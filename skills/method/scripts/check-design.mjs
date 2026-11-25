// Checks a Gradatim project's designs, as the design task step writes them (../../design-task/SKILL.md) from
// its template (../../design-task/assets/design.md), with the lines that other steps read in
// ../references/documents.md. Design task runs it, and build task after a departure it marks (TSK-2), so it
// lives in the method's scripts/, as writing rule 8 says:
// - a design, docs/plans/<ID>-<slug>-design.md, has a task file of the same <ID>-<slug>;
// - its title is "# <ID> · <Title>: design", with its task's title, and a line above its first part
//   links the task;
// - it has every part of the template, and a change log with its table;
// - its steps are "### k. …", numbered 1, 2, 3 …, each with its "**Done when:**";
// - its criteria are a table whose Step cells name its steps and whose Shown by is filled, and once the
//   design is final, the table has as many rows as the task has criteria;
// - its estimate gives a figure in dev-days, and once the design is final, the board's Days;
// - a task's Design row links the task's own design;
// - the design names each file of its task's Takes in backticks;
// - no slot "<…>" is left, and check-sprint's faults count, with check-docs' faults in docs/plans/.
// A design is final once its task's Design row links it. Until then it is a draft: it gets a note, and a
// count or a figure that the yes will change is a note too. A fault in a sealed document is listed apart
// ("sealed, left as they are"), as check-docs does, and is left out of the count and of the exit code.
// It writes nothing and reads no network.
//
// Usage, from the project's folder or anywhere:
//   node <the method skill's folder>/scripts/check-design.mjs [<project folder>] [--offline]
// The folder is the current one by default. --offline changes nothing. Exit code 1 when a fault is found.

import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { basename, join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cellText, checkDocs, docsFolder, headerValue, inFolder, linkTarget, mapRows, projectFiles, relativeLinks, sealedDocuments, slotIn, tablesIn, unfencedLines } from './check-docs.mjs';
import { checkSprint, parse, rawHeader, under } from './check-sprint.mjs';

const NEVER = /$^/;
// The parts of the template, as level-2 headings, in its order.
const PARTS = ['The idea', "The user's decisions", 'Steps', 'Acceptance criteria', 'The estimate', 'Documents', 'Watch for', 'Change log'];
const CRITERIA = ['#', 'Criterion', 'Step', 'Shown by'];
const LOG = 'Date|Change';
const DONE = /\*\*Done when(?::\*\*|\*\*:)/;
const FIGURE = /(\d+(?:\.\d+)?)\s+(?:senior\s+)?dev-days?\b/i;

// A heading as the template words it: a curly apostrophe is a straight one.
const plain = (title) => title.replace(/[‘’]/g, "'");
const same = (text) => text.replace(/\s+/g, ' ').trim();

// The texts of the code spans outside fenced code.
function codeSpans(text) {
  const spans = [];
  for (const [, line] of unfencedLines(text)) for (const m of line.matchAll(/(`+)((?:(?!\1).)+?)\1/g)) spans.push(m[2].trim());
  return spans;
}

// How many criteria a task file lists: its checkboxes under "## Acceptance criteria", or its items.
function criteriaOf(text) {
  const doc = parse(text);
  const part = doc.headings.find((h) => h.level === 2 && h.title === 'Acceptance criteria');
  if (!part) return 0;
  const lines = under(doc, part).lines.map(([, raw]) => raw);
  return lines.filter((raw) => /^[-*+]\s+\[[ xX]\]/.test(raw)).length || lines.filter((raw) => /^[-*+]\s/.test(raw)).length;
}

export function checkDesign(dir) {
  const root = resolve(dir);
  // Every path is under the folder AGENTS.md names for Gradatim's documents, docs by default (MTH-11).
  const folder = docsFolder(root);
  const rows = mapRows(undefined, folder);
  const row = (name) => rows.find((r) => r.document === name);
  const pattern = (name) => row(name)?.pattern ?? NEVER;
  const files = projectFiles(root, folder);
  const read = (file) => readFileSync(join(root, file), 'utf8');
  const has = (file) => files.includes(file);
  const shown = (file) => relative(root, file).split(sep).join('/');
  // A fault in a sealed document is listed apart, as check-docs does: no step may change it.
  const sealed = new Set(sealedDocuments(root));
  const result = { faults: [], sealedFaults: [], notes: [], counts: { designs: 0, final: 0, tasks: 0 } };
  const fault = (path, line, kind, what) => (sealed.has(path) ? result.sealedFaults : result.faults).push({ path, line, kind, what });

  const DESIGN_PATH = row('Design')?.path ?? inFolder('docs/plans/<ID>-<slug>-design.md', folder);
  const designOf = (name) => DESIGN_PATH.replace('<ID>-<slug>', name);
  const PLANS = `${posix.dirname(DESIGN_PATH)}/`;

  // The tasks, by the name their design takes: <ID>-<slug>.
  const tasks = new Map();
  for (const file of files) {
    const m = pattern('Task file').exec(file);
    if (m) tasks.set(basename(file, '.md'), { file, id: m[2], text: read(file) });
  }
  result.counts.tasks = tasks.size;
  const designs = files.filter((f) => pattern('Design').test(f));
  result.counts.designs = designs.length;

  // Each task's Days, from its sprint's board.
  const days = new Map();
  for (const file of files.filter((f) => pattern('Sprint README').test(f))) {
    const board = tablesIn(read(file)).find((t) => t.header.includes('Task') && t.header.includes('Status'));
    if (!board || !board.header.includes('Days')) continue;
    for (const { cells } of board.rows) {
      const id = /\b([A-Z]{3}-\d+)\b/.exec(cellText(cells[board.header.indexOf('Task')] ?? ''))?.[1];
      if (id) days.set(id, cellText(cells[board.header.indexOf('Days')] ?? ''));
    }
  }

  // ---- The Design rows: each links its own task's design, which is then final -------------------
  const final = new Set();
  for (const [name, task] of tasks) {
    const raw = rawHeader(task.text, 'Design');
    if (raw === null) continue;
    const line = headerValue(task.text, 'Design')?.line ?? 1;
    const wanted = designOf(name);
    const targets = [...relativeLinks(raw)].map(({ path }) => shown(linkTarget(root, join(root, task.file), path)));
    if (targets.length === 0) fault(task.file, line, 'design row', `its Design row links no design: it links ${wanted} once the design is agreed`);
    else if (!targets.includes(wanted)) fault(task.file, line, 'design row', `its Design row links ${targets[0]}, which isn't its own design, ${wanted}`);
    else if (has(wanted)) final.add(wanted);
  }

  // ---- Each design ------------------------------------------------------------------------------
  for (const file of designs) {
    const name = basename(file).replace(/-design\.md$/, '');
    const id = pattern('Design').exec(file)?.[1];
    const task = tasks.get(name);
    const isFinal = final.has(file);
    if (isFinal) result.counts.final++;
    else result.notes.push(`${file}: a draft, since no Design row links it`);
    const text = read(file);
    const doc = parse(text);
    const part = (title) => doc.headings.find((h) => h.level === 2 && plain(h.title) === title);
    if (!task) fault(file, 1, 'no task', `${name} names no task file: a design takes its task's file name, ${designOf('<ID>-<slug>')}`);

    // The title, and the opening line that links the task.
    const h1 = doc.headings.find((h) => h.level === 1);
    const title = h1 ? /^([A-Z]{3}-\d+) · (.+): design$/.exec(h1.title) : null;
    const taskTitle = task ? /^[A-Z]{3}-\d+ · (.+)$/.exec(parse(task.text).headings.find((h) => h.level === 1)?.title ?? '')?.[1] : undefined;
    if (!title || title[1] !== id || (taskTitle !== undefined && same(title[2]) !== same(taskTitle)))
      fault(file, h1?.line ?? 1, 'title', `its title isn't "# ${id} · ${taskTitle ?? '<Title>'}: design"`);
    if (task) {
      const firstPart = doc.headings.find((h) => h.level === 2)?.line ?? Infinity;
      const opening = [...relativeLinks(text)].filter(({ lineNo }) => lineNo < firstPart);
      if (!opening.some(({ path }) => shown(linkTarget(root, join(root, file), path)) === task.file))
        fault(file, h1?.line ?? 1, 'opening line', `no line above its first part links its task, ${task.file}`);
    }

    // The parts, and the change log's table.
    for (const wanted of PARTS) if (!part(wanted)) fault(file, 1, 'missing part', `it has no "## ${wanted}"`);
    const log = part('Change log');
    if (log && !under(doc, log).tables.some((t) => t.header.join('|') === LOG))
      fault(file, log.line, 'missing part', 'its change log has no table with the columns Date and Change');

    // The steps: "### k. …", in order from 1, each with its Done when.
    const numbers = new Set();
    const stepsPart = part('Steps');
    if (stepsPart) {
      const steps = doc.headings.filter((h) => h.level === 3 && h.line > stepsPart.line && h.line < stepsPart.end);
      if (steps.length === 0) fault(file, stepsPart.line, 'steps', 'it has no step: each is "### k. <what it delivers>", with its "**Done when:**"');
      let expected = 1;
      for (const step of steps) {
        const k = /^(\d+)\.\s+\S/.exec(step.title)?.[1];
        if (!k) {
          fault(file, step.line, 'steps', `"${step.title}" isn't a step's heading: "### k. <what it delivers>"`);
          continue;
        }
        if (Number(k) !== expected) fault(file, step.line, 'steps', `step ${k} sits where step ${expected} should: the steps run 1, 2, 3 …`);
        expected = Number(k) + 1;
        numbers.add(Number(k));
        if (!under(doc, step).lines.some(([, raw]) => DONE.test(raw))) fault(file, step.line, 'steps', `step ${k} has no "**Done when:**" line`);
      }
    }

    // The criteria: a table, each row with its step and its proof, and every criterion of the task.
    const criteria = part('Acceptance criteria');
    if (criteria) {
      const table = under(doc, criteria).tables.find((t) => CRITERIA.every((c) => t.header.includes(c)));
      if (!table) fault(file, criteria.line, 'criteria', `it has no table with the columns ${CRITERIA.join(', ')}`);
      else {
        const col = (wanted) => table.header.indexOf(wanted);
        for (const { line, cells } of table.rows) {
          const step = cellText(cells[col('Step')] ?? '');
          const named = [...step.matchAll(/\d+/g)].map((m) => Number(m[0]));
          if (numbers.size > 0 && (named.length === 0 || named.some((k) => !numbers.has(k))))
            fault(file, line, 'criteria', `its Step, "${step}", names no step of the design`);
          if (!cellText(cells[col('Shown by')] ?? '')) fault(file, line, 'criteria', 'its Shown by is empty: what shows the criterion met');
        }
        if (task) {
          const count = criteriaOf(task.text);
          if (count !== table.rows.length) {
            const what = `${table.rows.length} criteria in the design, and ${count} in the task`;
            if (isFinal) fault(file, table.line, 'criteria', `${what}: the table holds every criterion of the task`);
            else result.notes.push(`${file}: ${what}: the yes writes the new ones into the task, marked`);
          }
        }
      }
    }

    // The estimate: a figure in dev-days, and once final the board's Days.
    const estimate = part('The estimate');
    if (estimate) {
      const found = under(doc, estimate).lines.map(([n, raw]) => [n, FIGURE.exec(raw)?.[1]]).find(([, figure]) => figure !== undefined);
      if (!found) fault(file, estimate.line, 'estimate', 'it gives no figure: "<n> dev-days"');
      else if (task) {
        const board = days.get(task.id);
        if (board && Number.isFinite(Number(board)) && Math.abs(Number(board) - Number(found[1])) > 1e-9) {
          const what = `its estimate is ${found[1]} dev-days, and the board's Days say ${board}`;
          if (isFinal) fault(file, found[0], 'estimate', `${what}: the yes moves the Days and the capacity with the estimate`);
          else result.notes.push(`${file}: ${what}: the yes moves the Days and the capacity`);
        }
      }
    }

    // What the task takes, named in backticks.
    if (task) {
      const raw = rawHeader(task.text, 'Takes');
      if (raw !== null && raw.trim() !== '—') {
        const spans = codeSpans(text);
        for (const [taken] of raw.matchAll(/[\p{L}\p{N}_.-]+\.md/gu))
          if (!spans.some((span) => span === taken || span.endsWith(`/${taken}`)))
            fault(file, 1, 'takes', `its task takes ${taken}, which it doesn't name in backticks: copy what the build needs from it, and name the file`);
      }
    }

    // A slot left.
    for (const [n, raw] of doc.lines) {
      const slot = slotIn(raw);
      if (slot) fault(file, n, 'slot', `${slot} is a slot of the template, left unfilled`);
    }
  }

  // ---- What check-sprint finds, and check-docs in docs/plans/ ------------------------------------
  const docs = checkDocs(root);
  const sprint = checkSprint(root, { docs });
  result.faults.push(...sprint.faults);
  result.sealedFaults.push(...sprint.sealedFaults);
  result.notes.push(...sprint.notes);
  // check-docs' "slot" in a design is the fault just above.
  for (const f of docs.faults) if (f.path.startsWith(PLANS) && f.kind !== 'slot') result.faults.push(f);
  for (const f of docs.sealedFaults) if (f.path.startsWith(PLANS) && f.kind !== 'slot') result.sealedFaults.push(f);
  return result;
}

export function formatDesign(result) {
  const line = ({ path, line: at, kind, what }) => `${path}:${at}  ${kind}  ${what}`;
  const lines = result.faults.map(line);
  if (result.sealedFaults.length > 0) lines.push('sealed, left as they are:', ...result.sealedFaults.map((f) => `  ${line(f)}`));
  if (result.notes.length > 0) lines.push('notes:', ...result.notes.map((note) => `  ${note}`));
  const { designs, final, tasks } = result.counts;
  lines.push(`checked ${designs} designs, ${final} of them final, and ${tasks} tasks: ${result.faults.length} faults`);
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
    const result = checkDesign(dir);
    for (const line of formatDesign(result)) console.log(line);
    process.exitCode = result.faults.length > 0 ? 1 : 0;
  }
}
