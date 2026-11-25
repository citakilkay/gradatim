// Checks a Gradatim project's architecture, as the architecture step writes it (../../write-architecture/SKILL.md):
// the records of its choices, the architecture, the runbook and the agent docs, with the lines that
// other steps read in ../references/documents.md. The architecture step runs it, and review once a pick's
// story joins a module (REV-1), so it lives in the method's scripts/, as writing rule 8 says.
// - the records sit in dated sections, each with its Decision, Over, Why and Date; no id heads two
//   records; once the decisions index lists the records, each has its row, and a record that replaces
//   one marks it replaced, with a forward note under the replaced record;
// - the architecture, the runbook and the development cycle have the parts of their templates, and
//   each change log its table;
// - the modules table gives each module a code of three capitals, once, and names its stories; every
//   planned story of the MVP sits in a module; and the architecture names no task that has no file;
// - the open choices each name a record that holds, and a story, the MVP or a phase that exists; a
//   deferral that holds has its row;
// - each decision the architecture cites holds, or is drafted in the records;
// - once the index lists the records, AGENTS.md points to the architecture, the runbook and each agent
//   doc, each pointer on a line that opens "- **";
// - no slot "<…>" is left in a document, the commands say what built each (planned, existing, or a
//   task's id), and AGENTS.md keeps the order line.
// It writes nothing and reads no network.
//
// Usage, from the project's folder or anywhere:
//   node <the method skill's folder>/scripts/check-architecture.mjs [<project folder>] [--offline]
// The folder is the current one by default. --offline changes nothing. Exit code 1 when a fault is found.

import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cellText, docsFolder, inFolder, linkTarget, mapRows, projectFiles, relativeLinks, slotIn, tablesIn, unfencedLines, withoutCodeSpans } from './check-docs.mjs';

const DECISION_ID = /(?<![\w./-])D(\d+)(?![./-]?\w)/g;
const STORY_ID = /(?<![\w./-])(M\d+|P\d+\.\d+)(?![./-]?\w)/g;
const TASK_ID = /(?<![\w./-])([A-Z]{3})-(\d+)(?![./-]?\w)/g;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/;
const ORDER_LINE = 'The documents flow top-down: Concept → MVP and phases → Architecture → Sprints → Tasks.';
const AGENTS_NOTE_BYTES = 16 * 1024;
const NEVER = /$^/;

// The parts of each template, as level-2 headings, in the order the template gives them.
const PARTS = {
  architecture: ['Overview', 'Modules', 'Seams', 'Data', 'Deployment', 'Testing', 'Open choices', 'Change log'],
  runbook: ['Before a release', 'A release', 'The check', 'A rollback', 'Change log'],
  cycle: ['The documents', 'Ids and statuses', 'The work', 'This project'],
};
const SLOTS_OF_THIS_PROJECT = ['Branch', 'Before a merge', 'Pull requests'];
const COLUMNS = {
  modules: 'Code|Module|What it holds|Stories',
  choices: 'Choice|Decided by|Until then|Record',
  log: 'Date|Change',
};
// Names of standards that a text writes with a hyphen and a number, such as UTF-8 or ISO-8601. A module
// with such a code would make the sync's check read those as task ids.
const STANDARDS = new Set(['UTF', 'ISO', 'SHA', 'AES', 'RSA', 'GPT', 'SSH', 'TLS', 'RFC', 'UTC']);

const ids = (text, pattern) => [...text.matchAll(pattern)].map((m) => (pattern === DECISION_ID ? `D${m[1]}` : m[1]));

// A Markdown text: its lines outside fenced code, its headings (each with the line where its section
// ends: the next heading of the same level or a higher one), and its tables.
function parse(text) {
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
const under = (doc, h) => ({
  lines: doc.lines.filter(([n]) => n > h.line && n < h.end),
  tables: doc.tables.filter((t) => t.line > h.line && t.line < h.end),
});
const partOf = (doc, title) => doc.headings.find((h) => h.level === 2 && h.title === title);

// A record's bullets, "- **Decision:** …": each field's text, with the lines that continue it.
function fieldsOf(lines) {
  const fields = new Map();
  let open = null;
  for (const [, raw] of lines) {
    const m = /^\s*[-*]\s+\*\*([A-Za-z]+):?\*\*:?\s*(.*)$/.exec(raw);
    if (m) {
      open = m[1];
      fields.set(open, m[2].trim());
    } else if (!raw.trim() || /^\s*>/.test(raw)) open = null;
    else if (open) fields.set(open, `${fields.get(open)} ${raw.trim()}`.trim());
  }
  return fields;
}

export function checkArchitecture(dir) {
  const root = resolve(dir);
  // Every path is under the folder AGENTS.md names for Gradatim's documents, docs by default (MTH-11), so a project's
  // own docs/agents/ isn't read as Gradatim's.
  const folder = docsFolder(root);
  const rows = mapRows(undefined, folder);
  const row = (name) => rows.find((r) => r.document === name);
  const pattern = (name) => row(name)?.pattern ?? NEVER;
  const files = projectFiles(root, folder);
  const read = (file) => readFileSync(join(root, file), 'utf8');
  const has = (file) => files.includes(file);
  const shown = (file) => relative(root, file).split(sep).join('/');
  const result = { faults: [], notes: [], counts: { records: 0, modules: 0, choices: 0, documents: 0 } };
  const fault = (path, line, kind, what) => result.faults.push({ path, line, kind, what });

  const RECORDS = row("Architecture's records")?.path ?? inFolder('docs/decisions/architecture.md', folder);
  const ARCHITECTURE = row('Architecture')?.path ?? inFolder('docs/ARCHITECTURE.md', folder);
  const RUNBOOK = row('Runbook')?.path ?? inFolder('docs/RUNBOOK.md', folder);
  const CYCLE = inFolder('docs/agents/development-cycle.md', folder);
  const COMMANDS = inFolder('docs/agents/commands.md', folder);
  const index = files.find((f) => pattern('Decisions index').test(f));
  const sessions = files.filter((f) => pattern('Decision session').test(f));
  const agentDocs = files.filter((f) => pattern('Agent docs').test(f));
  const mvp = files.find((f) => pattern('MVP').test(f));
  const phases = files.filter((f) => pattern('Phase').test(f));
  const tasks = new Set(files.map((f) => pattern('Task file').exec(f)?.[2]).filter(Boolean));

  for (const [path, what] of [
    [RECORDS, "the architecture's records"],
    [ARCHITECTURE, 'the architecture'],
    [RUNBOOK, 'the runbook'],
    [CYCLE, 'the development cycle'],
    [COMMANDS, 'the commands'],
  ])
    if (!has(path)) fault(folder, 1, 'missing document', `${what}, ${path}, which the architecture step writes`);

  // The decisions index: each decision's status, and whether a row links the records, which makes the
  // architecture final (documents.md).
  const status = new Map();
  let final = false;
  if (index) {
    for (const table of tablesIn(read(index))) {
      const at = table.header.indexOf('Status');
      const record = table.header.indexOf('Record');
      if (at < 0) continue;
      for (const { cells } of table.rows) {
        const id = cellText(cells[0] ?? '');
        if (!/^D\d+$/.test(id)) continue;
        status.set(id, cellText(cells[at] ?? ''));
        for (const { path } of relativeLinks(cells[record] ?? ''))
          if (path && shown(linkTarget(root, join(root, index), path)) === RECORDS) final = true;
      }
    }
  }

  // The records: every heading "### D<n> · …" of the sessions and of the records file.
  const records = new Map();
  const own = new Map();
  for (const file of [...sessions, ...(has(RECORDS) ? [RECORDS] : [])]) {
    const doc = parse(read(file));
    let section = null;
    for (const h of doc.headings) {
      if (h.level === 2) section = h;
      const id = /^(D\d+)\b/.exec(h.title)?.[1];
      if (!id) continue;
      const record = { id, file, h, doc, fields: new Map() };
      if (records.has(id)) fault(file, h.line, 'record', `${id} heads two records: here and in ${records.get(id).file}`);
      else records.set(id, record);
      if (file !== RECORDS) continue;
      // The step's own record.
      result.counts.records++;
      own.set(id, record);
      record.fields = fieldsOf(under(doc, h).lines);
      if (h.level !== 3 || !section || !/^\d{4}-\d{2}-\d{2}$/.test(section.title))
        fault(file, h.line, 'record', `${id} sits outside a dated section: records go under "## YYYY-MM-DD", as "### ${id} · …"`);
      for (const name of ['Decision', 'Over', 'Why', 'Date'])
        if (!record.fields.get(name)) fault(file, h.line, 'record', `${id} has no "${name}", as "- **${name}:** …"`);
    }
  }

  // A decision holds when the index says so, or when it is drafted in the records and no row exists yet.
  const valid = (id) => (status.has(id) ? /^holds\b/i.test(status.get(id)) : own.has(id));

  if (final) {
    for (const [id, r] of own) {
      if (!status.has(id)) fault(RECORDS, r.h.line, 'record', `${id} has no row in the decisions index, which makes a decision final`);
      for (const k of ids(r.fields.get('Replaces') ?? '', DECISION_ID)) {
        const s = status.get(k);
        if (s === undefined) fault(RECORDS, r.h.line, 'record', `${id} replaces ${k}, which the decisions index doesn't list`);
        else if (!new RegExp(`^replaced by ${id}\\b`, 'i').test(s)) fault(RECORDS, r.h.line, 'record', `${id} replaces ${k}, whose row says "${s}", not "replaced by ${id}"`);
      }
    }
  }
  // A decision that the step's records replace keeps a forward note under it, in its own file.
  for (const [k, s] of status) {
    const by = /^replaced by (D\d+)\b/i.exec(s)?.[1];
    const old = records.get(k);
    if (!by || !own.has(by) || !old) continue;
    const note = new RegExp(`^\\s*>\\s*\\*\\*Replaced by ${by}\\b`);
    if (!under(old.doc, old.h).lines.some(([, raw]) => note.test(raw)))
      fault(old.file, old.h.line, 'record', `${k} is replaced by ${by}, and has no forward note under it: "> **Replaced by ${by}, YYYY-MM-DD.** …"`);
  }

  // The stories the modules and the open choices may name: a heading or a table row's first cell in
  // the MVP or a phase, and a heading's status.
  const stories = new Map();
  for (const file of [mvp, ...phases].filter(Boolean)) {
    const doc = parse(read(file));
    for (const h of doc.headings) {
      const id = /^(M\d+|P\d+\.\d+)\b/.exec(h.title)?.[1];
      if (!id) continue;
      const first = under(doc, h).lines.find(([, raw]) => raw.trim())?.[1] ?? '';
      const state = /^\s*Status:\s*`?([a-z-]+)/i.exec(first)?.[1]?.toLowerCase();
      if (state || !stories.has(id)) stories.set(id, { file, status: state });
    }
    for (const table of doc.tables)
      for (const { cells } of table.rows) {
        const id = cellText(cells[0] ?? '');
        if (/^(M\d+|P\d+\.\d+)$/.test(id) && !stories.has(id)) stories.set(id, { file, status: undefined });
      }
  }

  // ---- The architecture ---------------------------------------------------------------------
  if (has(ARCHITECTURE)) {
    result.counts.documents++;
    const doc = parse(read(ARCHITECTURE));
    for (const part of PARTS.architecture) if (!partOf(doc, part)) fault(ARCHITECTURE, 1, 'missing part', `it has no "## ${part}"`);
    const log = partOf(doc, 'Change log');
    if (log && !under(doc, log).tables.some((t) => t.header.join('|') === COLUMNS.log))
      fault(ARCHITECTURE, log.line, 'missing part', 'its change log has no table with the columns Date and Change');

    // The modules.
    const codes = new Set();
    const named = new Set();
    const modules = partOf(doc, 'Modules');
    if (modules) {
      const table = under(doc, modules).tables.find((t) => t.header.join('|') === COLUMNS.modules);
      if (!table) fault(ARCHITECTURE, modules.line, 'modules', 'it has no table with the columns Code, Module, What it holds and Stories');
      else {
        for (const { line, cells } of table.rows) {
          result.counts.modules++;
          const code = cellText(cells[0] ?? '');
          if (!/^[A-Z]{3}$/.test(code)) fault(ARCHITECTURE, line, 'modules', `"${code}" isn't a module code: three capital letters`);
          else if (STANDARDS.has(code)) fault(ARCHITECTURE, line, 'modules', `${code} is the name of a standard, such as ${code}-8: a text that cites one would read as a task id`);
          if (codes.has(code)) fault(ARCHITECTURE, line, 'modules', `${code} is the code of two modules`);
          else codes.add(code);
          for (const id of ids(cellText(cells[3] ?? ''), STORY_ID)) {
            named.add(id);
            if (!stories.has(id)) fault(ARCHITECTURE, line, 'modules', `${code} names ${id}, which has no story in the MVP or a phase`);
          }
        }
        for (const [id, story] of stories)
          if (story.file === mvp && story.status === 'planned' && !named.has(id))
            fault(ARCHITECTURE, modules.line, 'modules', `${id}, a planned story of the MVP, is in no module's Stories`);
      }
    }

    // The open choices.
    const open = partOf(doc, 'Open choices');
    const listed = new Set();
    const reported = new Set();
    if (open) {
      const section = under(doc, open);
      const table = section.tables.find((t) => t.header.join('|') === COLUMNS.choices);
      if (table) {
        const col = (name) => table.header.indexOf(name);
        for (const { line, cells } of table.rows) {
          result.counts.choices++;
          const record = cellText(cells[col('Record')] ?? '');
          const id = ids(record, DECISION_ID)[0];
          if (!id || !valid(id)) {
            fault(ARCHITECTURE, line, 'open choice', `its Record, "${record}", isn't a decision that holds or is drafted in the records`);
            reported.add(line);
          } else listed.add(id);
          const by = cellText(cells[col('Decided by')] ?? '');
          const found = [];
          for (const story of ids(by, STORY_ID)) found.push(stories.has(story) ? null : `${story}, which has no story`);
          for (const m of by.matchAll(/\bphase\s+(\d+)\b/gi)) found.push(has(inFolder(`docs/PHASE-${m[1]}.md`, folder)) ? null : `phase ${m[1]}, which has no file`);
          if (/\bMVP\b/.test(by)) found.push(mvp ? null : 'the MVP, which has no file');
          if (found.length === 0) fault(ARCHITECTURE, line, 'open choice', `its "Decided by", "${by}", names no story, no MVP and no phase`);
          for (const bad of found.filter(Boolean)) fault(ARCHITECTURE, line, 'open choice', `its "Decided by" names ${bad}`);
        }
      } else if (!/\bNothing open\b/i.test(section.lines.map(([, raw]) => raw).join(' ')))
        fault(ARCHITECTURE, open.line, 'open choice', 'it has neither a table with the columns Choice, Decided by, Until then and Record, nor the words "Nothing open."');
      for (const [id, r] of own)
        if (/\buntil then\b/i.test(r.fields.get('Decision') ?? '') && valid(id) && !listed.has(id))
          fault(ARCHITECTURE, open.line, 'open choice', `${id} is a deferral that holds, and has no row`);
    }

    // The decisions it cites, and the tasks it names, outside its change log.
    for (const [n, raw] of doc.lines) {
      if ((log && n >= log.line && n < log.end) || reported.has(n)) continue;
      for (const id of ids(withoutCodeSpans(raw), DECISION_ID))
        if (!valid(id)) fault(ARCHITECTURE, n, 'decision', `${id} neither holds in the decisions index nor is drafted in the records`);
      for (const m of raw.matchAll(TASK_ID))
        if (codes.has(m[1]) && !tasks.has(`${m[1]}-${m[2]}`))
          fault(ARCHITECTURE, n, 'task id', `${m[1]}-${m[2]} names no task file: the architecture names modules and stories, and tasks come with the sprints`);
    }
  }

  // ---- The runbook and the agent docs ------------------------------------------------------
  if (has(RUNBOOK)) {
    result.counts.documents++;
    const doc = parse(read(RUNBOOK));
    for (const part of PARTS.runbook) if (!partOf(doc, part)) fault(RUNBOOK, 1, 'missing part', `it has no "## ${part}"`);
    const log = partOf(doc, 'Change log');
    if (log && !under(doc, log).tables.some((t) => t.header.join('|') === COLUMNS.log))
      fault(RUNBOOK, log.line, 'missing part', 'its change log has no table with the columns Date and Change');
  }
  if (has(CYCLE)) {
    const doc = parse(read(CYCLE));
    for (const part of PARTS.cycle) if (!partOf(doc, part)) fault(CYCLE, 1, 'missing part', `it has no "## ${part}"`);
    const project = partOf(doc, 'This project');
    if (project) {
      const text = under(doc, project).lines.map(([, raw]) => raw).join(' ');
      for (const slot of SLOTS_OF_THIS_PROJECT) if (!text.includes(slot)) fault(CYCLE, project.line, 'missing part', `"## This project" has no "${slot}"`);
    }
  }
  if (has(COMMANDS)) {
    const table = tablesIn(read(COMMANDS)).find((t) => t.header.includes('Command'));
    if (!table) fault(COMMANDS, 1, 'commands', 'it has no table with a Command column');
    else if (!table.header.includes('Built by')) fault(COMMANDS, table.line, 'commands', 'its table has no "Built by" column: `planned`, `existing`, or the id of the task that built the command');
    else {
      const at = table.header.indexOf('Built by');
      for (const { line, cells } of table.rows) {
        const built = cellText(cells[at] ?? '');
        if (!['planned', 'existing'].includes(built) && !/^[A-Z]{3}-\d+$/.test(built))
          fault(COMMANDS, line, 'commands', `"${built}" in Built by is none of \`planned\`, \`existing\` and a task id`);
      }
    }
  }

  // A slot left in any document the step wrote.
  for (const file of [RECORDS, ARCHITECTURE, RUNBOOK, ...agentDocs].filter((f) => has(f))) {
    if (file !== RECORDS && file !== ARCHITECTURE && file !== RUNBOOK) result.counts.documents++;
    for (const [n, raw] of parse(read(file)).lines) {
      const slot = slotIn(raw);
      if (slot) fault(file, n, 'slot', `${slot} is a slot of the template, left unfilled`);
    }
  }
  if (has(RECORDS)) result.counts.documents++;

  // ---- AGENTS.md ----------------------------------------------------------------------------
  if (has('AGENTS.md')) {
    const text = read('AGENTS.md');
    const lines = new Map(unfencedLines(text));
    const order = [...lines].find(([, raw]) => (raw.match(/→/g) ?? []).length >= 2);
    if (!order) fault('AGENTS.md', 1, 'order line', `it has no line "${ORDER_LINE}"`);
    else if (order[1].trim() !== ORDER_LINE) fault('AGENTS.md', order[0], 'order line', `its first line with two arrows isn't "${ORDER_LINE}"`);
    if (final) {
      // Each document has a pointer: a line that links it and opens "- **". Another line of the user's
      // own that links it too is left as it is.
      const wanted = [ARCHITECTURE, RUNBOOK, ...agentDocs].filter((f) => has(f));
      const linking = new Map(wanted.map((file) => [file, []]));
      for (const { lineNo, path } of relativeLinks(text)) {
        const target = path ? shown(linkTarget(root, join(root, 'AGENTS.md'), path)) : '';
        if (linking.has(target)) linking.get(target).push(lineNo);
      }
      for (const [file, at] of linking) {
        if (at.length === 0) fault('AGENTS.md', 1, 'pointer', `it has no pointer to ${file}`);
        else if (!at.some((n) => /^\s*-\s+\*\*/.test(lines.get(n) ?? '')))
          fault('AGENTS.md', at[0], 'pointer', `the pointer to ${file} should open "- **Before <the work>**, read …"`);
      }
    }
    const bytes = Buffer.byteLength(text);
    if (bytes > AGENTS_NOTE_BYTES)
      result.notes.push(`AGENTS.md is ${bytes} bytes, over 16 KiB: Codex joins instruction files up to 32 KiB, so what only some tasks need belongs in ${inFolder('docs/agents', folder)}/`);
  }
  return result;
}

export function formatArchitecture(result) {
  const lines = result.faults.map(({ path, line, kind, what }) => `${path}:${line}  ${kind}  ${what}`);
  if (result.notes.length > 0) lines.push('notes:', ...result.notes.map((note) => `  ${note}`));
  const { records, modules, choices, documents } = result.counts;
  lines.push(`checked ${records} records, ${modules} modules and ${choices} open choices in ${documents} documents: ${result.faults.length} faults`);
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
    const result = checkArchitecture(dir);
    for (const line of formatArchitecture(result)) console.log(line);
    process.exitCode = result.faults.length > 0 ? 1 : 0;
  }
}
