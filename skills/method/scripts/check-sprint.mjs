// Checks a Gradatim project's sprints, as the new sprint step writes them (../../new-sprint/SKILL.md): the
// sprint rules, each sprint's README and task files, and the issues and deferred items that tasks take, with
// the lines that other steps read in ../references/documents.md. New sprint runs it, and design task through
// its own check (TSK-1), so it lives in the method's scripts/, as writing rule 8 says.
// - the rules have their parts, a size in senior dev-days, and a table of module codes: three capitals
//   each, once, one for every module of the architecture and for every task;
// - the sprints table lists the sprints in order, each with a link to its README and a status, at most
//   one `open`, and each README says the same;
// - a sprint's README has its Parent line, its header, its parts, a board of six columns, and a capacity
//   that is the sum of the board's days;
// - a task file has its title with its id, its Parent line, its header and its parts, and the board says
//   what the file says of its story and its dependencies, and in a draft of its title too;
// - in a draft, a task's story is one that its module names and the plan doesn't drop or mark `existing`, or the
//   milestone a setup task serves; no task depends on one later on the board, or on itself; a module's numbers run
//   1, 2, 3 … across the sprints;
// - a task's Takes names, in backticks, files of docs/issues/ and docs/deferred-items/ that exist, and
//   while the sprint is open each file says it is addressed by that task;
// - each issue and deferred item is named "YYYY-MM-DD-<ID>-<topic>.md", whose task has a file, or for a
//   deferred item "YYYY-MM-DD-sprint-<n>-<topic>.md"; it opens with its Status line and ends with a log table;
// - a sprint's close leaves it whole (SPR-2): a closed sprint has no task `to-do` or `in-progress`, and an open
//   one no `deferred` task, in a task's file or on the board; a file that a `completed` task of a closed sprint
//   took is deleted, and one whose task closed otherwise no longer says it is addressed by that task; and a
//   story the plan marks `delivered` is named by a task that is `completed` or `completed-as-partial`. Each is
//   reported where a step may still change it: the rules' row, the file taken, or the plan;
// - the rules' Reviews part is "None yet." or a table with a row for each review (REV-1): a date, the closed
//   sprint it came after, a link to its report of that sprint, which exists, and its picks, whose stories the
//   plan holds;
// - no slot "<…>" is left, in the issues and the deferred items too, and check-docs' faults in these folders
//   count.
// A sprint is final once the sprints table lists it. A sprint folder that it doesn't list is a draft: it
// gets a note, and its marks wait for the user's yes. Some checks hold in a draft only, since once a sprint
// is final a decision may drop a story, the architecture may move one, and a sync may rename a title on the
// board, and no step may change the task file. On a later sprint a code that the yes adds is a note while
// the sprint is a draft. A fault in a sealed document is listed apart ("sealed, left as they are"), as
// check-docs does, and is left out of the count and of the exit code.
// It writes nothing and reads no network.
//
// Usage, from the project's folder or anywhere:
//   node <the method skill's folder>/scripts/check-sprint.mjs [<project folder>] [--offline]
// The folder is the current one by default. --offline changes nothing. Exit code 1 when a fault is found.

import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cellsOf, cellText, checkDocs, docsFolder, headerValue, inFolder, linkTarget, mapRows, ownUpToOf, projectFiles, relativeLinks, reviewsOf, sealedDocuments, slotIn, tablesIn, unfencedLines } from './check-docs.mjs';

const STORY_ID = /(?<![\w./-])(M\d+|P\d+\.\d+)(?![./-]?\w)/g;
const TASK_ID = /(?<![\w./-])([A-Z]{3}-\d+)(?![./-]?\w)/g;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/;
const SIZE = /\babout\s+\d+(?:\.\d+)?\s+to\s+\d+(?:\.\d+)?\s+senior\s+dev-days\b/i;
const NEVER = /$^/;

// The parts of each template, as level-2 headings, in the order the template gives them.
const PARTS = {
  rules: ['The rules', 'Module codes', 'The sprints', 'Reviews', 'Change log'],
  readme: ['Scope', 'Board', 'Log'],
  task: ['Goal', 'Scope', 'Acceptance criteria', 'Questions for the brainstorm', 'Documents to check on close', 'Log'],
};
const HEADERS = {
  readme: ['Status', 'Opened', 'Goal', 'Capacity'],
  task: ['Status', 'Story', 'Depends on', 'Takes'],
};
const BOARD = ['Task', 'Title', 'Story', 'Depends on', 'Days', 'Status'];
const LOG = 'Date|Change';
const REVIEWS = 'Date|After|Report|Picks';
const ITEM_LOG = 'Date|Event';
const isDate = (text) => /^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(Date.parse(`${text}T00:00:00Z`)) && new Date(`${text}T00:00:00Z`).toISOString().startsWith(text);
const ITEM_STATUS = /^Status:\s*(open|addressed by ([A-Z]{3}-\d+))\s*$/;

const ids = (text, pattern) => [...text.matchAll(pattern)].map((m) => m[1]);
const same = (text) => text.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').trim();

// A Markdown text: its lines outside fenced code, its headings (each with the line where its section
// ends: the next heading of the same level or a higher one), and its tables.
export function parse(text) {
  const lines = [...unfencedLines(text)];
  const headings = [];
  for (const [line, raw] of lines) {
    const h = HEADING.exec(raw);
    if (h) headings.push({ level: h[1].length, title: h[2].trim(), line });
  }
  headings.forEach((h, i) => {
    h.end = headings.slice(i + 1).find((x) => x.level <= h.level)?.line ?? Infinity;
  });
  return { lines, headings, tables: tablesIn(text) };
}
// What lies under a heading, down to the end of its section.
export const under = (doc, h) => ({
  lines: doc.lines.filter(([n]) => n > h.line && n < h.end),
  tables: doc.tables.filter((t) => t.line > h.line && t.line < h.end),
});
export const partOf = (doc, title) => doc.headings.find((h) => h.level === 2 && h.title === title);

// A header cell as written, backticks and all: the cell beside the key, in the table under the title.
export function rawHeader(text, key) {
  for (const [, line] of unfencedLines(text)) {
    if (/^##\s/.test(line)) break;
    if (!/^\s*\|/.test(line)) continue;
    const cells = cellsOf(line);
    if (cellText(cells[0] ?? '') === key) return cells[1] ?? '';
  }
  return null;
}

// docs: check-docs' result for the same folder, where the caller has it already, as check-design does.
export function checkSprint(dir, { docs } = {}) {
  const root = resolve(dir);
  // Every path is under the folder AGENTS.md names for Gradatim's documents, docs by default (MTH-11).
  const folder = docsFolder(root);
  const rows = mapRows(undefined, folder);
  const row = (name) => rows.find((r) => r.document === name);
  const pattern = (name) => row(name)?.pattern ?? NEVER;
  const files = projectFiles(root, folder);
  const SPRINTS = `${folder}/sprints`;
  const ISSUES = posix.dirname(row('Issue')?.path ?? `${folder}/issues/x`);
  const DEFERRED = posix.dirname(row('Deferred item')?.path ?? `${folder}/deferred-items/x`);
  const read = (file) => readFileSync(join(root, file), 'utf8');
  const has = (file) => files.includes(file);
  const shown = (file) => relative(root, file).split(sep).join('/');
  // A fault in a sealed document is listed apart, as check-docs does: no step may change it.
  const sealed = new Set(sealedDocuments(root));
  const result = { faults: [], sealedFaults: [], notes: [], counts: { sprints: 0, tasks: 0, codes: 0, documents: 0 } };
  const fault = (path, line, kind, what) => (sealed.has(path) ? result.sealedFaults : result.faults).push({ path, line, kind, what });

  const RULES = row('Sprint rules and index')?.path ?? `${SPRINTS}/README.md`;
  const ARCHITECTURE = row('Architecture')?.path ?? inFolder('docs/ARCHITECTURE.md', folder);
  const mvp = files.find((f) => pattern('MVP').test(f));
  const phases = files.filter((f) => pattern('Phase').test(f));
  const readmes = new Map();
  const tasks = [];
  for (const file of files) {
    const sprint = pattern('Sprint README').exec(file);
    if (sprint) readmes.set(sprint[1], file);
    const task = pattern('Task file').exec(file);
    if (task) tasks.push({ file, n: task[1], id: task[2], code: task[2].split('-')[0], number: Number(task[2].split('-')[1]) });
  }
  const items = files.filter((f) => [ISSUES, DEFERRED].includes(posix.dirname(f)) && f.endsWith('.md'));
  const sprintNumbers = [...new Set([...readmes.keys(), ...tasks.map((t) => t.n)])].sort((a, b) => a - b);
  result.counts.sprints = sprintNumbers.length;
  result.counts.tasks = tasks.length;

  // ---- The sprint rules ---------------------------------------------------------------------
  let codes = null;
  // The project's own highest number for each code it numbered before Gradatim (MTH-11).
  const ownUpTo = has(RULES) ? ownUpToOf(read(RULES)) : new Map();
  const listed = new Map();
  if (!has(RULES)) fault(SPRINTS, 1, 'missing document', `the sprint rules, ${RULES}, which the new sprint step writes`);
  else {
    result.counts.documents++;
    const doc = parse(read(RULES));
    for (const part of PARTS.rules) if (!partOf(doc, part)) fault(RULES, 1, 'missing part', `it has no "## ${part}"`);
    const rules = partOf(doc, 'The rules');
    if (rules && !SIZE.test(under(doc, rules).lines.map(([, raw]) => raw).join(' ')))
      fault(RULES, rules.line, 'missing part', 'its rules give no size: "about <a> to <b> senior dev-days"');
    const log = partOf(doc, 'Change log');
    if (log && !under(doc, log).tables.some((t) => t.header.join('|') === LOG))
      fault(RULES, log.line, 'missing part', 'its change log has no table with the columns Date and Change');

    const part = partOf(doc, 'Module codes');
    if (part) {
      const table = under(doc, part).tables.find((t) => t.header[0] === 'Code' && t.header[1] === 'Module');
      if (!table) fault(RULES, part.line, 'codes', 'it has no table with the columns Code and Module');
      else {
        codes = new Map();
        for (const { line, cells } of table.rows) {
          const code = cellText(cells[0] ?? '');
          if (!/^[A-Z]{3}$/.test(code)) fault(RULES, line, 'codes', `"${code}" isn't a module code: three capital letters`);
          else if (codes.has(code)) fault(RULES, line, 'codes', `${code} is listed twice`);
          else codes.set(code, line);
        }
      }
    }
    result.counts.codes = codes?.size ?? 0;

    const sprints = partOf(doc, 'The sprints');
    if (sprints) {
      const table = under(doc, sprints).tables.find((t) => t.header.includes('Sprint') && t.header.includes('Status'));
      if (!table) fault(RULES, sprints.line, 'sprints', 'it has no table with the columns Sprint and Status');
      else {
        const at = (name) => table.header.indexOf(name);
        let open = 0;
        // The first sprint may take the number of the project's own open sprint (MTH-11): the sprints run in order from
        // the lowest sprint folder, or from the first one listed where there is none.
        let expected = sprintNumbers.length > 0 ? Number(sprintNumbers[0]) : null;
        for (const { line, cells } of table.rows) {
          const cell = cells[at('Sprint')] ?? '';
          const n = [...relativeLinks(cell)]
            .map(({ path }) => pattern('Sprint README').exec(shown(linkTarget(root, join(root, RULES), path)))?.[1])
            .find(Boolean);
          const status = cellText(cells[at('Status')] ?? '');
          if (!n) fault(RULES, line, 'sprints', `"${cellText(cell)}" links no sprint README, as "[sprint-<n>](sprint-<n>/README.md)"`);
          else {
            expected ??= Number(n);
            if (Number(n) !== expected) fault(RULES, line, 'sprints', `sprint-${n} sits where sprint-${expected} should: the sprints run in order from the first sprint`);
            expected++;
            listed.set(n, { status, line });
          }
          if (status === 'open') open++;
          else if (!/^closed \d{4}-\d{2}-\d{2}$/.test(status)) fault(RULES, line, 'sprints', `its Status, "${status}", is neither \`open\` nor \`closed YYYY-MM-DD\``);
        }
        if (open > 1) fault(RULES, table.line, 'sprints', `${open} sprints are open: at most one is`);
      }
    }
  }
  for (const n of sprintNumbers)
    if (!listed.has(n)) result.notes.push(`${SPRINTS}/sprint-${n}: a draft, since the sprint rules don't list it`);
  // On a later sprint, the rules list a sprint already, and the yes adds a code that its tasks need: while
  // the sprint is a draft, a missing code is a note. On first use the rules hold every code at once.
  const later = listed.size > 0;
  const drafting = sprintNumbers.some((n) => !listed.has(n));

  // ---- The architecture's modules, and the plan's stories -----------------------------------
  const modules = new Map();
  let storiesColumn = false;
  if (has(ARCHITECTURE)) {
    const table = parse(read(ARCHITECTURE)).tables.find((t) => t.header[0] === 'Code');
    if (table) {
      const at = table.header.indexOf('Stories');
      storiesColumn = at >= 0;
      for (const { line, cells } of table.rows) {
        const code = cellText(cells[0] ?? '');
        if (!/^[A-Z]{3}$/.test(code)) continue;
        modules.set(code, new Set(ids(cellText(cells[at] ?? ''), STORY_ID)));
        if (codes && !codes.has(code)) {
          if (later && drafting) result.notes.push(`${code}, a module of the architecture, has no code in the sprint rules yet: the yes adds it`);
          else fault(ARCHITECTURE, line, 'codes', `${code}, a module of the architecture, has no code in the sprint rules`);
        }
      }
    }
  }
  const stories = new Map();
  for (const file of [mvp, ...phases].filter(Boolean)) {
    const doc = parse(read(file));
    for (const h of doc.headings) {
      const id = /^(M\d+|P\d+\.\d+)\b/.exec(h.title)?.[1];
      if (!id) continue;
      const first = under(doc, h).lines.find(([, raw]) => raw.trim())?.[1] ?? '';
      const state = /^\s*Status:\s*`?([a-z-]+)/i.exec(first)?.[1]?.toLowerCase();
      if (state || !stories.has(id)) stories.set(id, { state, file, line: h.line });
    }
  }

  // ---- The reviews (REV-1) -------------------------------------------------------------------
  // "None yet.", or a row for each review: its date, the closed sprint it came after, its report of that
  // sprint, and what each pick became, where a story it names is one the plan holds.
  const reviews = has(RULES) ? reviewsOf(read(RULES), posix.dirname(RULES)) : null;
  if (reviews) {
    const shaped = reviews.header
      ? reviews.header.join('|') === REVIEWS && reviews.rows.length > 0 && reviews.prose.length === 0
      : reviews.prose.length === 1 && reviews.prose[0] === 'None yet.';
    if (!shaped) fault(RULES, reviews.line, 'reviews', 'its Reviews part is neither "None yet." nor a table with the columns Date, After, Report and Picks, with a row for each review');
    for (const review of reviews.header?.join('|') === REVIEWS ? reviews.rows : []) {
      if (!isDate(review.date)) fault(RULES, review.line, 'reviews', `its Date, "${review.date}", isn't a date written YYYY-MM-DD`);
      const n = /^sprint-(\d+)$/.exec(review.after)?.[1];
      if (!n || !/^closed\b/.test(listed.get(n)?.status ?? ''))
        fault(RULES, review.line, 'reviews', `its After, "${review.after}", names no closed sprint, as "sprint-<n>"`);
      else if (!review.report || pattern('Review report').exec(review.report)?.[1] !== n || !has(review.report))
        fault(RULES, review.line, 'reviews', `its Report links no review report of sprint-${n} that exists, such as "[NN-review-sprint-${n}.html](../artifacts/NN-review-sprint-${n}.html)"`);
      if (!review.picks) fault(RULES, review.line, 'reviews', 'its Picks is empty: say what each pick became, or "none: the report alone"');
      for (const id of new Set(ids(review.picks, STORY_ID)))
        if (!stories.has(id)) fault(RULES, review.line, 'reviews', `its Picks name ${id}, a story that neither the MVP nor a phase holds`);
    }
  }

  // ---- Each sprint: its README, its tasks and what they take --------------------------------
  const parent = (file, text, wanted, what) => {
    let found = null;
    for (const [lineNo, raw] of unfencedLines(text)) {
      if (/^##\s/.test(raw)) break;
      if (/^\s*Parent:/.test(raw)) {
        found = { lineNo, raw };
        break;
      }
    }
    if (!found) return fault(file, 1, 'parent', `it has no "Parent:" line linking ${what}`);
    const links = [...relativeLinks(found.raw)];
    if (!links.some(({ path }) => shown(linkTarget(root, join(root, file), path)) === wanted))
      fault(file, found.lineNo, 'parent', `its Parent line doesn't link ${what}, ${wanted}`);
  };
  const header = (file, text, keys) => {
    for (const key of keys) {
      const found = headerValue(text, key);
      if (!found || !found.value) fault(file, 1, 'header', `its header has no "${key}" row`);
    }
  };
  const itemStatus = new Map();
  for (const file of items) itemStatus.set(file, ITEM_STATUS.exec(read(file).split(/\r?\n/)[0]));
  const takenBy = new Map();
  const openTasks = new Map();
  // Each task as its file says: its sprint, its status, whether that sprint is closed, and the stories it names.
  const taskState = new Map();

  for (const n of sprintNumbers) {
    const readmeFile = readmes.get(n);
    const entry = listed.get(n);
    const own = tasks.filter((t) => t.n === n);
    let status = entry?.status;
    let board = null;

    if (readmeFile) {
      result.counts.documents++;
      const text = read(readmeFile);
      const doc = parse(text);
      parent(readmeFile, text, ARCHITECTURE, 'the architecture');
      header(readmeFile, text, HEADERS.readme);
      const own_status = headerValue(text, 'Status');
      // On the rules' row, which a step may change: a README that says closed is sealed.
      if (entry && own_status?.value && own_status.value !== entry.status)
        fault(RULES, entry.line, 'sprints', `sprint-${n}'s README says "${own_status.value}", and its row says "${entry.status}"`);
      status ??= own_status?.value;
      for (const part of PARTS.readme) if (!partOf(doc, part)) fault(readmeFile, 1, 'missing part', `it has no "## ${part}"`);

      const boardPart = partOf(doc, 'Board');
      if (boardPart) {
        const table = under(doc, boardPart).tables.find((t) => t.header.includes('Task') && t.header.includes('Status'));
        if (!table) fault(readmeFile, boardPart.line, 'board', 'it has no table with the columns Task and Status');
        else {
          const col = (name) => table.header.indexOf(name);
          const missing = BOARD.filter((name) => col(name) < 0);
          if (missing.length > 0) fault(readmeFile, table.line, 'board', `its board has no ${missing.map((m) => `"${m}"`).join(', ')} column: ${BOARD.join(', ')}`);
          board = {
            col,
            rows: table.rows.map(({ line, cells }) => ({ line, cells, id: /\b([A-Z]{3}-\d+)\b/.exec(cellText(cells[col('Task')] ?? ''))?.[1] })),
          };
          const capacity = headerValue(text, 'Capacity');
          if (capacity?.value && col('Days') >= 0) {
            let total = 0;
            let numbers = true;
            for (const { line, cells } of table.rows) {
              const days = cellText(cells[col('Days')] ?? '');
              if (days === '' || !Number.isFinite(Number(days))) {
                fault(readmeFile, line, 'board', `its Days, "${days}", isn't a number`);
                numbers = false;
              } else total += Number(days);
            }
            const first = /^\s*(\d+(?:\.\d+)?)/.exec(capacity.value)?.[1];
            total = Math.round(total * 100) / 100;
            if (numbers && (first === undefined || Math.abs(Number(first) - total) > 1e-9))
              fault(readmeFile, capacity.line, 'capacity', `its Capacity starts with ${first ?? 'no number'}, and the board's Days add up to ${total}`);
          }
          // The order: a dependency in this sprint comes earlier on the board, and is not the task itself.
          const position = new Map();
          board.rows.forEach(({ id }, i) => {
            if (id && !position.has(id)) position.set(id, i);
          });
          if (col('Depends on') >= 0)
            board.rows.forEach(({ line, cells, id }, i) => {
              for (const dep of ids(cellText(cells[col('Depends on')] ?? ''), TASK_ID)) {
                if (dep === id) fault(readmeFile, line, 'order', `${id} depends on itself`);
                else if (position.has(dep) && position.get(dep) > i) fault(readmeFile, line, 'order', `${id} depends on ${dep}, which comes later on the board`);
              }
            });
        }
      }
    }

    const closed = /^closed\b/.test(status ?? '');
    for (const t of own) {
      result.counts.documents++;
      const text = read(t.file);
      const doc = parse(text);
      const h1 = doc.headings.find((h) => h.level === 1);
      const title = h1 ? /^([A-Z]{3}-\d+) · (.+)$/.exec(h1.title) : null;
      if (!title || title[1] !== t.id) fault(t.file, h1?.line ?? 1, 'title', `its title isn't "# ${t.id} · <Title>"`);
      parent(t.file, text, `${SPRINTS}/sprint-${n}/README.md`, `its sprint's README`);
      header(t.file, text, HEADERS.task);
      // A task at or below its code's "Own up to" is one taken over from the project (MTH-11): its From row names
      // the project's own file, as a path in backticks, which a draft's file holds.
      if (t.number <= (ownUpTo.get(t.code) ?? 0)) {
        const from = rawHeader(text, 'From');
        const path = /^`([^`]+)`$/.exec(from?.trim() ?? '')?.[1];
        if (!path) fault(t.file, 1, 'from', `${t.id} is at or below ${t.code}'s "Own up to", ${ownUpTo.get(t.code)}, so it is a task taken over: its header needs a From row naming the project's file, as a path in backticks`);
        else if (!entry && !existsSync(join(root, path))) fault(t.file, 1, 'from', `its From row names ${path}, which isn't in the project`);
      }
      for (const part of PARTS.task) if (!partOf(doc, part)) fault(t.file, 1, 'missing part', `it has no "## ${part}"`);

      // The board says what the file says.
      const mine = board?.rows.filter((r) => r.id === t.id) ?? [];
      if (board && mine.length === 1 && tasks.filter((x) => x.n === n && x.id === t.id).length === 1) {
        const [{ line, cells }] = mine;
        // A title is compared in a draft only: a later sync carries a change to the board, and leaves a heading as it is.
        const compare = [
          ['Title', entry ? undefined : title?.[2]],
          ['Story', headerValue(text, 'Story')?.value],
          ['Depends on', headerValue(text, 'Depends on')?.value],
        ];
        for (const [name, written] of compare) {
          if (board.col(name) < 0 || written === undefined) continue;
          const onBoard = cellText(cells[board.col(name)] ?? '');
          if (same(onBoard) !== same(cellText(written))) fault(readmeFile, line, 'board differs', `${t.id}'s ${name} is "${onBoard}" on the board and "${cellText(written)}" in its file`);
        }
      }

      // Its story: one that its module names, or the milestone a setup task serves. In a draft only: once the
      // sprint is final, a decision may drop a story and the architecture may move one, and no step may change the task.
      const tells = headerValue(text, 'Story');
      const named = modules.get(t.code);
      if (!entry && tells?.value && storiesColumn && named) {
        const found = ids(tells.value, STORY_ID);
        const milestone = /\bthe MVP\b/i.test(tells.value) ? 'MVP' : /\bphase\s+(\d+)\b/i.exec(tells.value)?.[1];
        if (found.length > 0) {
          for (const id of found) {
            if (!named.has(id)) fault(t.file, tells.line, 'story', `${t.code} doesn't name ${id} among its stories${named.size ? `: ${[...named].join(', ')}` : ''}`);
            else if (stories.get(id)?.state === 'dropped') fault(t.file, tells.line, 'story', `${id} is dropped`);
            else if (stories.get(id)?.state === 'existing') fault(t.file, tells.line, 'story', `${id} is \`existing\`: the code met it when the plan was written, so no task builds it (MTH-8)`);
          }
          if (milestone) fault(t.file, tells.line, 'story', `its Story names stories and a milestone: it is one or the other`);
        } else if (milestone !== undefined) {
          const wanted = milestone === 'MVP' ? mvp : inFolder(`docs/PHASE-${milestone}.md`, folder);
          if (named.size > 0) fault(t.file, tells.line, 'story', `${t.code} names stories (${[...named].join(', ')}), so its Story is a story id, not a milestone`);
          if (!wanted || !has(wanted)) fault(t.file, tells.line, 'story', `its milestone, "${tells.value}", has no file`);
        } else fault(t.file, tells.line, 'story', `its Story, "${tells.value}", names no story and no milestone: "the MVP" or "phase <k>"`);
      }

      // What it takes.
      const raw = rawHeader(text, 'Takes');
      const takes = headerValue(text, 'Takes');
      if (raw !== null && raw.trim() !== '—') {
        // A file name may hold letters of any language.
        const names = [...raw.matchAll(/[\p{L}\p{N}_.-]+\.md/gu)].map((m) => m[0]);
        const rest = raw.replace(/`[^`]+`/g, '').replace(/[\s,;]+/g, '');
        if (names.length === 0 || rest !== '') fault(t.file, takes?.line ?? 1, 'takes', `its Takes, "${cellText(raw)}", is neither — nor the names of files in backticks`);
        const taken = new Set();
        for (const name of names) {
          const path = [ISSUES, DEFERRED].map((items) => `${items}/${name}`).find(has);
          if (!path) {
            if (!closed) fault(t.file, takes?.line ?? 1, 'takes', `it takes ${name}, which is in neither ${ISSUES}/ nor ${DEFERRED}/`);
            continue;
          }
          taken.add(path);
          const marked = itemStatus.get(path);
          if (!closed && entry?.status === 'open' && marked && marked[2] !== t.id)
            fault(t.file, takes?.line ?? 1, 'takes', `it takes ${name}, whose Status is "${marked[1]}": it should say "addressed by ${t.id}"`);
        }
        takenBy.set(t.id, taken);
      }
      if (entry?.status === 'open') openTasks.set(t.id, t.file);
      taskState.set(t.id, { n, status: headerValue(text, 'Status')?.value ?? '', closed, stories: ids(tells?.value ?? '', STORY_ID) });
    }

    // What a sprint's close leaves (SPR-2): a closed sprint has no task left to do, and an open one no deferred
    // task, in a task's file or on the board. On the rules' row, which a step may change: a deferred task and a
    // closed sprint's README are sealed, and a fault there is listed apart.
    if (entry) {
      const said = new Map();
      const say = (id, value, where) => said.set(id, [...(said.get(id) ?? []), { value, where }]);
      for (const t of own) say(t.id, taskState.get(t.id).status, 'in its file');
      if (board && board.col('Status') >= 0) for (const { id, cells } of board.rows) if (id) say(id, cellText(cells[board.col('Status')] ?? ''), 'on the board');
      for (const [id, places] of said) {
        const left = places.find(({ value }) => value === 'to-do' || value === 'in-progress');
        if (/^closed\b/.test(entry.status) && left)
          fault(RULES, entry.line, 'close', `sprint-${n} is closed, and ${id} is \`${left.value}\` ${left.where}: a sprint's close defers each task left to do`);
        const deferred = places.find(({ value }) => value === 'deferred');
        if (entry.status === 'open' && deferred)
          fault(RULES, entry.line, 'close', `sprint-${n} is open, and ${id} is \`deferred\` ${deferred.where}: only a sprint's close defers a task, as it closes`);
      }
    }
  }
  // An item addressed by a task of the open sprint is named in that task's Takes row.
  for (const [file, marked] of itemStatus) {
    const by = marked?.[2];
    if (by && openTasks.has(by) && !(takenBy.get(by)?.has(file)))
      fault(file, 1, 'takes', `it is addressed by ${by}, whose Takes row doesn't name it`);
  }
  // What a sprint's close does with a file that a task took (SPR-2): where the task is `completed`, the file is
  // deleted; otherwise it goes back to `open`. On the file, since a closed task is sealed.
  for (const [id, state] of taskState) {
    if (!state.closed || state.status !== 'completed') continue;
    for (const path of takenBy.get(id) ?? []) fault(path, 1, 'close', `${id} took it and is \`completed\`, in sprint-${state.n}, which is closed: the sprint's close deletes it`);
  }
  for (const [file, marked] of itemStatus) {
    const by = marked?.[2];
    const state = by ? taskState.get(by) : null;
    if (state?.closed && state.status !== 'completed')
      fault(file, 1, 'close', `it is addressed by ${by}, which is \`${state.status}\` in sprint-${state.n}, which is closed: the sprint's close sets it back to "Status: open", with a dated row`);
  }
  // A story that the plan marks `delivered` is named by a task that closed (SPR-2): a sprint's close sets that
  // status, for the stories its closed tasks name.
  const closedStories = new Set([...taskState.values()].filter((state) => state.status === 'completed' || state.status === 'completed-as-partial').flatMap((state) => state.stories));
  for (const [id, story] of stories)
    if (story.state === 'delivered' && !closedStories.has(id))
      fault(story.file, story.line, 'delivered', `${id} is \`delivered\`, and no \`completed\` or \`completed-as-partial\` task names it in its Story row: a sprint's close sets that status`);

  // ---- Numbers: within a module, across the sprints -----------------------------------------
  const byCode = new Map();
  for (const t of tasks) byCode.set(t.code, [...(byCode.get(t.code) ?? []), t]);
  for (const [code, list] of byCode) {
    list.sort((a, b) => a.number - b.number || a.file.localeCompare(b.file));
    const seen = new Map();
    for (const t of list) {
      if (seen.has(t.number)) fault(t.file, 1, 'numbers', `${t.id} is used twice: here and in ${seen.get(t.number)}`);
      else seen.set(t.number, t.file);
    }
    // Below the project's own highest number, a task taken over keeps its id, and the rest are the project's (MTH-11).
    const top = Math.max(...list.map((t) => t.number));
    const from = (ownUpTo.get(code) ?? 0) + 1;
    for (let k = from; k <= top; k++)
      if (!seen.has(k))
        fault(SPRINTS, 1, 'numbers', from > 1
          ? `${code}-${k} is skipped: after the project's own, up to ${code}-${from - 1}, a module's numbers run ${from}, ${from + 1} … across the sprints, and a task that is dropped keeps its file`
          : `${code}-${k} is skipped: a module's numbers run 1, 2, 3 … across the sprints, and a task that is dropped keeps its file`);
    if (codes && !codes.has(code))
      for (const t of list) {
        if (later && !listed.has(t.n)) result.notes.push(`${t.file}: ${code}, the code of ${t.id}, isn't in the sprint rules' table yet: the yes adds it`);
        else fault(t.file, 1, 'codes', `${code}, the code of ${t.id}, isn't in the sprint rules' table of module codes`);
      }
  }

  // ---- The issues and the deferred items ----------------------------------------------------
  // Each is named by its date, its origin and its topic (documents.md's ids): the origin of an issue is the task
  // whose build found it, which has a file; a deferred item's may be the sprint whose close found it (TSK-2).
  const taskIds = new Set(tasks.map((t) => t.id));
  for (const file of items) {
    result.counts.documents++;
    const issue = posix.dirname(file) === ISSUES;
    const name = posix.basename(file);
    const named = /^\d{4}-\d{2}-\d{2}-(?:([A-Z]{3}-\d+)|(sprint-\d+))-[^/]+\.md$/.exec(name);
    if (!named || (named[2] && issue))
      fault(file, 1, 'name', `its name isn't "YYYY-MM-DD-<ID>-<topic>.md"${issue ? '' : ', or "YYYY-MM-DD-sprint-<n>-<topic>.md"'}`);
    else if (named[1] && !taskIds.has(named[1])) fault(file, 1, 'name', `its name gives ${named[1]}, which has no task file`);
    if (!itemStatus.get(file)) fault(file, 1, 'item', 'its first line isn\'t "Status: open" or "Status: addressed by <ID>"');
    if (!tablesIn(read(file)).some((t) => t.header.join('|') === ITEM_LOG)) fault(file, 1, 'item', 'it has no log table with the columns Date and Event');
  }

  // ---- A slot left in a document the step wrote ---------------------------------------------
  for (const file of [RULES, ...readmes.values(), ...tasks.map((t) => t.file), ...items].filter((f) => has(f))) {
    for (const [n, raw] of parse(read(file)).lines) {
      const slot = slotIn(raw);
      if (slot) fault(file, n, 'slot', `${slot} is a slot of the template, left unfilled`);
    }
  }

  // ---- What check-docs finds in these folders ------------------------------------------------
  // Its "no status" is the header fault above, and its "slot" the one just above this.
  const found = docs ?? checkDocs(root);
  const here = (f) => [SPRINTS, ISSUES, DEFERRED].some((items) => f.path.startsWith(`${items}/`));
  for (const f of found.faults) if (here(f) && f.kind !== 'no status' && f.kind !== 'slot') result.faults.push(f);
  for (const f of found.sealedFaults) if (here(f) && f.kind !== 'slot') result.sealedFaults.push(f);
  return result;
}

export function formatSprint(result) {
  const line = ({ path, line: at, kind, what }) => `${path}:${at}  ${kind}  ${what}`;
  const lines = result.faults.map(line);
  if (result.sealedFaults.length > 0) lines.push('sealed, left as they are:', ...result.sealedFaults.map((f) => `  ${line(f)}`));
  if (result.notes.length > 0) lines.push('notes:', ...result.notes.map((note) => `  ${note}`));
  const { sprints, tasks, codes, documents } = result.counts;
  lines.push(`checked ${sprints} sprints, ${tasks} tasks and ${codes} module codes in ${documents} documents: ${result.faults.length} faults`);
  return lines;
}

// Whether node started this file. A symlink or a junction in its path makes process.argv[1] differ
// from import.meta.url, which node resolves to the real path: the script would then do nothing, and
// exit 0, as if no fault were found.
function startedHere() {
  try {
    return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (startedHere()) {
  const [dir = '.'] = process.argv.slice(2).filter((arg) => arg !== '--offline');
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    console.log(`${dir}: no such folder`);
    process.exitCode = 1;
  } else {
    const result = checkSprint(dir);
    for (const line of formatSprint(result)) console.log(line);
    process.exitCode = result.faults.length > 0 ? 1 : 0;
  }
}
