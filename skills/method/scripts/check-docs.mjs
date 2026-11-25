// Checks the documents of a Gradatim project, as the sync in ../references/sync.md says:
// - every relative link resolves, and none points into docs/issues/ or docs/deferred-items/, whose
//   files are deleted at their end;
// - each id names something: a task, a decision, a story;
// - each task's status matches its sprint's board;
// - no sealed document has changed since its seal;
// - no slot "<…>" is left, outside code, in a document the sync may change, the agent file aside: it
//   holds the user's own rules.
// Which files are the method's documents comes from ../references/documents.md, so the paths have
// one source, under the folder that AGENTS.md names for them, docs by default (MTH-11). It writes
// nothing and reads no network.
//
// Usage, from the project's folder or anywhere:
//   node <the method skill's folder>/scripts/check-docs.mjs [<project folder>] [--offline]
// The folder is the current one by default. --offline changes nothing. Faults inside sealed
// documents are listed apart, since no step may fix them. Exit code 1 when any other fault is found.

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const DOCUMENTS_FILE = join(here, '..', 'references', 'documents.md');
export const TASK_STATUSES = ['to-do', 'in-progress', 'completed', 'completed-as-partial', 'deferred'];
const SEALING_STATUSES = new Set(['completed', 'completed-as-partial', 'deferred']);

// ---- Links ----------------------------------------------------------------------------------

// The rules GitHub applies, which the plugin's own check uses too: the target exists with the exact
// case GitHub will see, and a #fragment names a real heading or an id in the target.

// GitHub keeps letters, marks, numbers, connector punctuation (such as _), hyphens and spaces,
// lowercases, and turns each space into a hyphen.
export function slugify(heading) {
  const text = heading
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/!?\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/`+/g, '');
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');
}

// Yields [line number, line] for every line outside fenced code blocks.
export function* unfencedLines(text) {
  let fence = null;
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (fence) {
      if (marker && marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      continue;
    }
    if (marker) {
      fence = marker;
      continue;
    }
    yield [index + 1, line];
  }
}

export const withoutCodeSpans = (line) => line.replace(/(`+)(?:(?!\1).)+?\1/g, '');

// ---- Slots ----------------------------------------------------------------------------------

// The tags a document may hold outside code, which are no slot.
export const HTML_TAG = /^\/?(?:br|hr|p|div|span|a|b|i|u|em|strong|code|kbd|details|summary|img|sup|sub|ul|ol|li|table|tr|td|th|h[1-6])(?:\s[^>]*)?\/?$/i;

// A slot left in a line outside code: "<" and ">" round a word or more, which is no link or tag.
export function slotIn(raw) {
  const line = withoutCodeSpans(raw).replace(/\]\(<[^>]*>\)/g, '](x)');
  for (const m of line.matchAll(/<([\p{L}…][^<>\n]{0,80})>/gu)) {
    const inner = m[1];
    if (/^(https?:|mailto:)/i.test(inner) || HTML_TAG.test(inner)) continue;
    return m[0];
  }
  return null;
}

export const linkPattern =
  /!?\[(?:[^\]\\]|\\.)*\]\(\s*(<[^>]*>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)|^\s{0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)/g;

const anchorCache = new Map();
export function anchorsOf(file) {
  const key = `${file}\0${statSync(file).mtimeMs}`;
  if (anchorCache.has(key)) return anchorCache.get(key);
  const text = readFileSync(file, 'utf8');
  const anchors = new Set();
  for (const m of text.matchAll(/\b(?:id|name)\s*=\s*["']([^"']+)["']/g)) anchors.add(m[1]);
  if (extname(file).toLowerCase() === '.md') {
    const seen = new Map();
    for (const [, line] of unfencedLines(text)) {
      const heading = /^\s{0,3}#{1,6}\s+(.*?)(?:\s+#+)?\s*$/.exec(line)?.[1];
      if (heading === undefined) continue;
      const base = slugify(heading);
      const n = seen.get(base) ?? 0;
      anchors.add(n === 0 ? base : `${base}-${n}`);
      seen.set(base, n + 1);
    }
  }
  anchorCache.set(key, anchors);
  return anchors;
}

// Windows ignores case; GitHub doesn't. Walk the path from root one segment at a time.
export function caseMismatch(root, target) {
  let dir = root;
  for (const part of relative(root, target).split(sep).filter(Boolean)) {
    if (part === '..' || part === '.') return null;
    const names = readdirSync(dir);
    if (!names.includes(part)) return names.find((n) => n.toLowerCase() === part.toLowerCase()) ?? part;
    dir = resolve(dir, part);
  }
  return null;
}

// Each relative link outside code: its line, the link as written, its path and its #fragment.
// A link with a scheme, such as https:, is left out.
export function* relativeLinks(text) {
  for (const [lineNo, line] of unfencedLines(text)) {
    for (const m of withoutCodeSpans(line).matchAll(linkPattern)) {
      const raw = (m[1] ?? m[2] ?? '').replace(/^<|>$/g, '');
      if (!raw || /^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('//')) continue;
      const hash = raw.indexOf('#');
      const pathPart = hash < 0 ? raw : raw.slice(0, hash);
      const fragment = hash < 0 ? null : raw.slice(hash + 1);
      let path;
      try {
        path = decodeURIComponent(pathPart);
      } catch {
        path = pathPart;
      }
      yield { lineNo, raw, path, fragment };
    }
  }
}

// The file a link points to, from the linking file: an absolute path counts from root, and an empty
// one is the file itself.
export const linkTarget = (root, file, path) =>
  path === '' ? file : isAbsolute(path) ? resolve(root, `.${path}`) : resolve(dirname(file), path);

// What is wrong with a link's target, or null: a missing file, a wrong case, or a broken anchor.
export function targetFault(root, target, fragment) {
  if (!existsSync(target)) return 'missing file';
  const actual = caseMismatch(root, target);
  if (actual) return `wrong case (GitHub sees "${actual}")`;
  if (fragment === null || fragment === '' || statSync(target).isDirectory()) return null;
  if (!['.md', '.html', '.htm'].includes(extname(target).toLowerCase())) return null;
  let wanted = fragment;
  try {
    wanted = decodeURIComponent(fragment);
  } catch {}
  return anchorsOf(target).has(wanted) ? null : 'broken anchor';
}

// ---- Tables ---------------------------------------------------------------------------------

// A row's cells: split on unescaped pipes, without the outer ones.
export const cellsOf = (line) =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((cell) => cell.trim());
const isRule = (cells) => cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
// A cell's text: links as their text, with no backticks or bold.
export const cellText = (cell) => cell.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*]/g, '').trim();

// Every table outside fenced code: its header's texts, its line, and its body rows with their lines.
export function tablesIn(text) {
  const tables = [];
  let current = null;
  let pending = null;
  for (const [lineNo, line] of unfencedLines(text)) {
    if (!/^\s*\|/.test(line)) {
      current = null;
      pending = null;
      continue;
    }
    const cells = cellsOf(line);
    if (current) {
      current.rows.push({ line: lineNo, cells });
      continue;
    }
    if (pending && isRule(cells)) {
      current = { header: pending.cells.map(cellText), line: pending.line, rows: [] };
      tables.push(current);
      pending = null;
      continue;
    }
    pending = { line: lineNo, cells };
  }
  return tables;
}

// A value in a task's or a sprint README's header, the table under its title: the cell beside the
// key, such as Status, and its line. The header ends at the first "## ".
export function headerValue(text, key) {
  for (const [lineNo, line] of unfencedLines(text)) {
    if (/^##\s/.test(line)) break;
    if (!/^\s*\|/.test(line)) continue;
    const cells = cellsOf(line);
    if (cellText(cells[0] ?? '') === key) return { value: cellText(cells[1] ?? ''), line: lineNo };
  }
  return null;
}

// The sprint rules' "## Reviews" part (REV-1): "None yet.", or a table with a row for each review, whose
// Date, After, Report and Picks cells name its date, the last closed sprint it came after, its report and
// what each pick became. A row's report is the path its link names, from the rules' folder. Null with no
// such part.
export function reviewsOf(text, folder = 'docs/sprints') {
  let start = null;
  let end = Infinity;
  const prose = [];
  for (const [lineNo, line] of unfencedLines(text)) {
    if (/^##\s/.test(line)) {
      if (start !== null) {
        end = lineNo;
        break;
      }
      if (/^##\s+Reviews\s*$/.test(line)) start = lineNo;
      continue;
    }
    if (start !== null && line.trim() && !/^\s*\|/.test(line)) prose.push(line.trim());
  }
  if (start === null) return null;
  const table = tablesIn(text).find((t) => t.line > start && t.line < end) ?? null;
  const rows = (table?.rows ?? []).map(({ line, cells }) => {
    const cell = (name) => (table.header.includes(name) ? cells[table.header.indexOf(name)] ?? '' : '');
    let target = /\]\(\s*<?([^)\s>]+)>?\s*\)/.exec(cell('Report'))?.[1] ?? null;
    try {
      target = target === null ? null : decodeURIComponent(target);
    } catch {}
    const report = target === null ? null : posix.normalize(posix.join(folder, target.split('#')[0]));
    return { line, date: cellText(cell('Date')), after: cellText(cell('After')), report, picks: cellText(cell('Picks')) };
  });
  return { line: start, prose, header: table?.header ?? null, rows };
}

// A sprint's board: the first table with Task and Status columns.
export function boardOf(text) {
  const board = tablesIn(text).find((table) => table.header.includes('Task') && table.header.includes('Status'));
  if (!board) return null;
  const column = (name) => board.header.indexOf(name);
  return { task: column('Task'), status: column('Status'), story: column('Story'), rows: board.rows };
}

// ---- The method's documents -----------------------------------------------------------------

// A path from the map as a pattern: "<ID>" is a task id, "<n>" and "<k>" are numbers, any other
// "<…>" is a name, "NN-" is a file's number and "YYYY-MM-DD" a date, as documents.md writes them.
export function pathPattern(path) {
  const escaped = path
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/<ID>/g, '([A-Z]{3}-\\d+)')
    .replace(/<[nk]>/g, '(\\d+)')
    .replace(/<[^>]+>/g, '[^/]+')
    .replace(/(^|\/)NN-/g, '$1\\d{2,}-')
    .replace(/YYYY-MM-DD/g, '\\d{4}-\\d{2}-\\d{2}');
  return new RegExp(`^${escaped}$`);
}

// ---- The folder (MTH-11) --------------------------------------------------------------------

// Where a project's own files hold Gradatim's paths, AGENTS.md names one folder for Gradatim's documents, in the
// line "Gradatim's documents are in `<folder>/`: …", and each docs/ path of the map stands for it. Without the
// line, or with one whose folder leaves the project, the folder is docs.
export const FOLDER_LINE = /^Gradatim's documents are in `([^`]+?)`/m;
export function docsFolder(root) {
  const file = join(root, 'AGENTS.md');
  if (!existsSync(file)) return 'docs';
  const named = FOLDER_LINE.exec(readFileSync(file, 'utf8'))?.[1];
  const folder = named?.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/+$/, '');
  return folder && !folder.startsWith('/') && !/^[A-Za-z]:/.test(folder) && !folder.split('/').includes('..') ? folder : 'docs';
}
// A path of the map, or of a step, under the folder: docs/sprints/README.md is docs/gradatim/sprints/README.md there.
export const inFolder = (path, folder = 'docs') =>
  folder === 'docs' ? path : path === 'docs' ? folder : path.startsWith('docs/') ? `${folder}/${path.slice(5)}` : path;

// The project that holds a document, found from the file: the nearest folder above it with an AGENTS.md whose
// folder of documents holds the file. Without one, two folders up, as docs/research/NN-<topic>.md lies.
export function projectRootOf(file) {
  const path = resolve(file);
  for (let dir = dirname(path); dirname(dir) !== dir; dir = dirname(dir)) {
    if (!existsSync(join(dir, 'AGENTS.md'))) continue;
    if (relative(dir, path).split(sep).join('/').startsWith(`${docsFolder(dir)}/`)) return dir;
  }
  return resolve(dirname(path), '..', '..');
}

// The sprint rules' "Own up to" column (MTH-11): for each module code the project numbered before Gradatim, its
// highest number. A task at or below it is the project's own, or one Gradatim took over, with its From row.
export function ownUpToOf(rulesText) {
  const own = new Map();
  for (const table of tablesIn(rulesText ?? '')) {
    const at = table.header[0] === 'Code' ? table.header.indexOf('Own up to') : -1;
    if (at < 0) continue;
    for (const { cells } of table.rows) {
      const code = cellText(cells[0] ?? '');
      const n = /^\d+$/.exec(cellText(cells[at] ?? ''))?.[0];
      if (/^[A-Z]{3}$/.test(code) && n) own.set(code, Number(n));
    }
  }
  return own;
}

// The lines of a document that are Gradatim's: all of them, but in AGENTS.md only those under init's two sections
// and architecture's pointers. The rest of that file is the project's own, whose ids, such as its own D2, name
// nothing of Gradatim's (MTH-11).
export const AGENT_HEADINGS = ['The project', 'How the work runs', 'The architecture and the agent docs'];
export function* gradatimLines(file, text) {
  let ours = file !== 'AGENTS.md';
  for (const [lineNo, line] of unfencedLines(text)) {
    const heading = file === 'AGENTS.md' ? /^##\s+(.+?)\s*$/.exec(line)?.[1] : undefined;
    if (heading !== undefined) ours = AGENT_HEADINGS.includes(heading);
    else if (ours) yield [lineNo, line];
  }
}

// The rows of documents.md's first table: each document's name, path, kind, the steps that change
// it, and its path as a pattern, each path under the folder.
export function mapRows(text = readFileSync(DOCUMENTS_FILE, 'utf8'), folder = 'docs') {
  const [table] = tablesIn(text);
  const at = (name) => table.header.indexOf(name);
  const [doc, path, kind, changed] = ['Document', 'Path', 'Kind', 'Changed by, and why'].map(at);
  return table.rows.map(({ cells }) => {
    const p = inFolder(cellText(cells[path] ?? ''), folder);
    return { document: cellText(cells[doc] ?? ''), path: p, kind: cellText(cells[kind] ?? ''), changedBy: cells[changed] ?? '', pattern: pathPattern(p) };
  });
}

// The map's rows that the sync may change: those whose "Changed by" cell names it.
export const syncRows = (rows = mapRows()) => rows.filter((row) => /\bthe sync\b/.test(row.changedBy));

const NEVER = /$^/;
const roleOf = (rows, name) => rows.find((row) => row.document === name)?.pattern ?? NEVER;
function rolesOf(rows) {
  const names = {
    task: 'Task file', design: 'Design', sprint: 'Sprint README', rules: 'Sprint rules and index',
    decisions: 'Decisions index', session: 'Decision session', records: "Architecture's records",
    mvp: 'MVP', phase: 'Phase', issue: 'Issue', deferred: 'Deferred item',
    review: 'Review report', demo: 'Demo', walkthrough: 'Demo walkthrough', report: 'Research report', research: 'Research index',
  };
  return Object.fromEntries(Object.entries(names).map(([key, name]) => [key, roleOf(rows, name)]));
}

// The project's files under the folder, docs by default, and AGENTS.md: paths from its folder, with forward slashes.
export function projectFiles(root, folder = docsFolder(root)) {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile()) out.push(path);
    }
  };
  if (existsSync(join(root, folder)) && statSync(join(root, folder)).isDirectory()) walk(folder);
  if (existsSync(join(root, 'AGENTS.md'))) out.push('AGENTS.md');
  return out.sort();
}

const read = (root, file) => readFileSync(join(root, file), 'utf8');

// Whether a task file's or a sprint README's text holds a sealing status.
function sealedText(roles, file, text) {
  const status = headerValue(text, 'Status')?.value ?? '';
  if (roles.task.test(file)) return SEALING_STATUSES.has(status);
  if (roles.sprint.test(file)) return /^closed\b/.test(status);
  return false;
}

// The review reports that the sprint rules' Reviews table links, by a rules text and its path: each is final,
// and sealed, from then on. One that no row links is a stopped run's draft (REV-1).
const linkedReviews = (roles, rulesFile, text) =>
  new Set((reviewsOf(text, posix.dirname(rulesFile))?.rows ?? []).map((row) => row.report).filter((path) => path && roles.review.test(path)));

// A demo walkthrough is final, and sealed, once its first line says so: "// Gradatim demo: final, YYYY-MM-DD".
// Its video, beside it by the same name, is sealed with it; a video with no walkthrough, once written (DMO-1).
const FINAL_WALKTHROUGH = /^\/\/ Gradatim demo: final, \d{4}-\d{2}-\d{2}[ \t]*\r?$/;
const finalWalkthrough = (text) => FINAL_WALKTHROUGH.test(String(text).split('\n', 1)[0]);
const walkthroughOf = (video) => video.replace(/\.webm$/i, '.mjs');

// The documents the working tree seals: a task closed or deferred, with its design; a closed
// sprint's README; a review report once the sprint rules list it; and a demo once its walkthrough
// says final, with its video.
function sealedIn(root, files, roles) {
  const sealed = new Set();
  const ids = new Set();
  const rulesFile = files.find((file) => roles.rules.test(file));
  const reviewed = rulesFile ? linkedReviews(roles, rulesFile, read(root, rulesFile)) : new Set();
  const walkthroughs = new Set(files.filter((file) => roles.walkthrough.test(file)));
  const finals = new Set([...walkthroughs].filter((file) => finalWalkthrough(read(root, file))));
  for (const file of files) {
    if (roles.review.test(file)) {
      if (reviewed.has(file)) sealed.add(file);
    } else if (roles.walkthrough.test(file)) {
      if (finals.has(file)) sealed.add(file);
    } else if (roles.demo.test(file)) {
      if (!walkthroughs.has(walkthroughOf(file)) || finals.has(walkthroughOf(file))) sealed.add(file);
    }
    else if ((roles.task.test(file) || roles.sprint.test(file)) && sealedText(roles, file, read(root, file))) {
      sealed.add(file);
      const id = roles.task.exec(file)?.[2];
      if (id) ids.add(id);
    }
  }
  for (const file of files) if (ids.has(roles.design.exec(file)?.[1])) sealed.add(file);
  return sealed;
}

// The documents sealed in a project's folder, as its files say, with no git: the runner records
// them, so that a run that changes one fails.
export function sealedDocuments(dir) {
  const root = resolve(dir);
  const folder = docsFolder(root);
  return [...sealedIn(root, projectFiles(root, folder), rolesOf(mapRows(undefined, folder)))].sort();
}

// ---- Ids ------------------------------------------------------------------------------------

// An id joined to a word, a path or a file name, such as D3.js or CAT-1-search.md, isn't one.
const TASK_ID = /(?<![\w./-])([A-Z]{3})-(\d+)(?![./-]?\w)/g;
const DECISION_ID = /(?<![\w./-])D(\d+)(?![./-]?\w)/g;
const STORY_ID = /(?<![\w./-])(M\d+|P\d+\.\d+)(?![./-]?\w)/g;

function checkIds(files, roles, text, fault, counts) {
  const tasks = new Set(files.map((file) => roles.task.exec(file)?.[2]).filter(Boolean));
  // Module codes come from the task files' names, and from the sprint rules' table whose first
  // column is Code. So UTF-8 or SHA-256 is no task id, unless the project has such a module.
  const codes = new Set([...tasks].map((id) => id.split('-')[0]));
  // An id at or below its code's "Own up to", with no task file, is the project's own (MTH-11).
  const own = new Map();
  for (const file of files.filter((f) => roles.rules.test(f))) {
    for (const table of tablesIn(text.get(file) ?? ''))
      if (table.header[0] === 'Code')
        for (const { cells } of table.rows) if (/^[A-Z]{3}$/.test(cellText(cells[0] ?? ''))) codes.add(cellText(cells[0]));
    for (const [code, n] of ownUpToOf(text.get(file))) own.set(code, n);
  }

  // Decisions: the index's first cells, and the headings of the decision files that open with an id.
  const index = files.find((f) => roles.decisions.test(f));
  const decisions = index ? new Set() : null;
  if (decisions) {
    for (const table of tablesIn(text.get(index) ?? ''))
      for (const { cells } of table.rows) if (/^D\d+$/.test(cellText(cells[0] ?? ''))) decisions.add(cellText(cells[0]));
    for (const file of files.filter((f) => roles.session.test(f) || roles.records.test(f)))
      for (const [, line] of unfencedLines(text.get(file) ?? '')) {
        const m = /^#{1,6}\s+(D\d+)\b/.exec(line);
        if (m) decisions.add(m[1]);
      }
  }

  // Stories: an id that opens a heading or a table row's first cell, in the MVP or a phase.
  const plans = files.filter((f) => roles.mvp.test(f) || roles.phase.test(f));
  const stories = plans.length ? new Set() : null;
  for (const file of plans) {
    for (const [, line] of unfencedLines(text.get(file) ?? '')) {
      const m = /^#{1,6}\s+(M\d+|P\d+\.\d+)\b/.exec(line);
      if (m) stories.add(m[1]);
    }
    for (const table of tablesIn(text.get(file) ?? ''))
      for (const { cells } of table.rows) if (/^(M\d+|P\d+\.\d+)$/.test(cellText(cells[0] ?? ''))) stories.add(cellText(cells[0]));
  }

  const research = (file) => roles.report.test(file) || roles.research.test(file);
  for (const [file, body] of text) {
    if (research(file)) continue;
    for (const [lineNo, line] of gradatimLines(file, body)) {
      for (const m of line.matchAll(TASK_ID)) {
        if (!codes.has(m[1])) continue;
        counts.ids++;
        if (!tasks.has(`${m[1]}-${m[2]}`) && !(Number(m[2]) <= (own.get(m[1]) ?? 0))) fault(file, lineNo, 'stale id', `${m[1]}-${m[2]} names no task file`);
      }
      if (decisions)
        for (const m of withoutCodeSpans(line).matchAll(DECISION_ID)) {
          counts.ids++;
          if (!decisions.has(`D${m[1]}`)) fault(file, lineNo, 'stale id', `D${m[1]} names no decision in the index`);
        }
      // An issue or a deferred item names the task that took it, whatever its module.
      if (roles.issue.test(file) || roles.deferred.test(file))
        for (const m of line.matchAll(/addressed by ([A-Z]{3})-(\d+)\b/g)) {
          if (codes.has(m[1])) continue;
          counts.ids++;
          if (!tasks.has(`${m[1]}-${m[2]}`)) fault(file, lineNo, 'stale id', `${m[1]}-${m[2]} names no task file`);
        }
    }
  }

  // A story id counts where the method puts one: a task's Story row and a board's Story column.
  if (!stories) return;
  const story = (file, line, value) => {
    for (const m of value.matchAll(STORY_ID)) {
      counts.ids++;
      if (!stories.has(m[1])) fault(file, line, 'stale id', `${m[1]} names no story in the MVP or a phase`);
    }
  };
  for (const [file, body] of text) {
    if (roles.task.test(file)) {
      const row = headerValue(body, 'Story');
      if (row) story(file, row.line, row.value);
    } else if (roles.sprint.test(file)) {
      const board = boardOf(body);
      if (board && board.story >= 0) for (const { line, cells } of board.rows) story(file, line, cellText(cells[board.story] ?? ''));
    }
  }
}

// ---- Statuses -------------------------------------------------------------------------------

function checkStatuses(files, roles, text, fault, counts) {
  const sprints = new Map();
  for (const file of files) {
    const m = roles.task.exec(file);
    if (!m) continue;
    counts.statuses++;
    const status = headerValue(text.get(file) ?? '', 'Status');
    if (!status) fault(file, 1, 'no status', 'its header has no Status row');
    else if (!TASK_STATUSES.includes(status.value))
      fault(file, status.line, 'unknown status', `"${status.value}" is none of ${TASK_STATUSES.join(', ')}`);
    if (!sprints.has(m[1])) sprints.set(m[1], new Map());
    sprints.get(m[1]).set(m[2], { file, status: status?.value, line: status?.line ?? 1 });
  }
  for (const [n, own] of sprints) {
    const readme = files.find((f) => roles.sprint.exec(f)?.[1] === n);
    const board = readme ? boardOf(text.get(readme) ?? '') : null;
    const seen = new Set();
    for (const { line, cells } of board?.rows ?? []) {
      const id = /\b([A-Z]{3}-\d+)\b/.exec(cellText(cells[board.task] ?? ''))?.[1];
      if (!id) continue;
      seen.add(id);
      const entry = own.get(id);
      const shown = cellText(cells[board.status] ?? '');
      if (!entry) fault(readme, line, 'board row with no file', `${id} has no task file in sprint-${n}`);
      else if (entry.status && shown !== entry.status)
        fault(readme, line, 'status differs', `${id} is ${entry.status} in its file and ${shown || 'blank'} on the board`);
    }
    for (const [id, entry] of own)
      if (!seen.has(id)) fault(entry.file, entry.line, 'not on the board', readme ? `${id} is missing from sprint-${n}'s board` : `sprint-${n} has no README`);
  }
}

// ---- Seals ----------------------------------------------------------------------------------

function gitText(cwd, args) {
  const out = spawnSync('git', args, { cwd, encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 26 });
  return out.status === 0 ? out.stdout : null;
}

// Many "<commit>:<path>" objects in one call, each as a buffer, or null where git has none.
function gitBlobs(cwd, specs) {
  const blobs = new Map();
  if (specs.length === 0) return blobs;
  const out = spawnSync('git', ['cat-file', '--batch'], { cwd, input: `${specs.join('\n')}\n`, windowsHide: true, maxBuffer: 1 << 28 });
  if (out.status !== 0) return blobs;
  const data = out.stdout;
  let at = 0;
  for (const spec of specs) {
    const end = data.indexOf(0x0a, at);
    if (end < 0) break;
    const m = /^[0-9a-f]+ \w+ (\d+)$/.exec(data.subarray(at, end).toString('utf8'));
    at = end + 1;
    if (!m) {
      blobs.set(spec, null);
      continue;
    }
    blobs.set(spec, data.subarray(at, at + Number(m[1])));
    at += Number(m[1]) + 1;
  }
  return blobs;
}

// Two versions of a document are the same once line endings are folded, a demo's walkthrough too; a demo's
// video is compared byte for byte.
const sameText = (file, a, b) =>
  /\.(md|html?|mjs)$/i.test(file) ? a.toString('utf8').replace(/\r\n/g, '\n') === b.toString('utf8').replace(/\r\n/g, '\n') : a.equals(b);

// Each sealed document with the commit that sealed it: the first commit in which its status seals it,
// its task's for a design, the first whose sprint rules link it for a review report, the first in which
// its first line says final for a demo's walkthrough, and the one that added it for a demo's video. Its
// state says how the document stands against that commit:
// - "kept", "changed" or "deleted", with the sealed text as that commit holds it;
// - "uncommitted", where no commit holds the seal yet, with no commit and no text;
// - "absent", where the seal's commit doesn't hold the document, as for a design written after its
//   task's close, with no text.
// A video that git ignores, as the demo step's line in .gitignore has it, is left out: no commit holds it.
// `unchecked` says why nothing was read, "no git" or "no commits yet", and is null otherwise.
function readSeals(root, roles, sealedNow, folder = 'docs') {
  const top = gitText(root, ['rev-parse', '--show-toplevel'])?.trim();
  if (!top) return { unchecked: 'no git', seals: [] };
  if (gitText(top, ['rev-parse', '--verify', '--quiet', 'HEAD']) === null) return { unchecked: 'no commits yet', seals: [] };
  const prefix = relative(resolve(top), root).split(sep).join('/');
  const full = (file) => (prefix ? `${prefix}/${file}` : file);
  const own = (path) => (prefix ? path.slice(prefix.length + 1) : path);

  // What HEAD seals counts too, so that a status set back in the working tree is still caught, and a review
  // report that HEAD's rules list but the working tree's don't.
  const headFiles = (gitText(top, ['ls-tree', '-r', '-z', '--name-only', 'HEAD', '--', full(folder)]) ?? '').split('\0').filter(Boolean).map(own);
  const statusFiles = headFiles.filter((file) => roles.task.test(file) || roles.sprint.test(file));
  const rulesFile = headFiles.find((file) => roles.rules.test(file));
  const headWalkthroughs = headFiles.filter((file) => roles.walkthrough.test(file));
  const atHead = gitBlobs(top, [...statusFiles, ...headWalkthroughs, ...(rulesFile ? [rulesFile] : [])].map((file) => `HEAD:${full(file)}`));
  const candidates = new Set(sealedNow);
  const headIds = new Set();
  for (const file of statusFiles) {
    const blob = atHead.get(`HEAD:${full(file)}`);
    if (blob && sealedText(roles, file, blob.toString('utf8'))) {
      candidates.add(file);
      const id = roles.task.exec(file)?.[2];
      if (id) headIds.add(id);
    }
  }
  const headRules = rulesFile ? atHead.get(`HEAD:${full(rulesFile)}`) : null;
  if (headRules) for (const file of linkedReviews(roles, rulesFile, headRules.toString('utf8'))) candidates.add(file);
  const headFinals = new Set(headWalkthroughs.filter((file) => finalWalkthrough(atHead.get(`HEAD:${full(file)}`)?.toString('utf8') ?? '')));
  for (const file of headFinals) candidates.add(file);
  for (const file of headFiles) {
    const video = roles.demo.test(file) && (!headWalkthroughs.includes(walkthroughOf(file)) || headFinals.has(walkthroughOf(file)));
    if (headIds.has(roles.design.exec(file)?.[1]) || video) candidates.add(file);
  }

  // Each candidate's history, oldest first, read in one call. A review report's seal is the first commit whose
  // rules link it, so the rules' history stands for it (REV-1).
  const history = new Map();
  const reviews = [...candidates].filter((file) => roles.review.test(file));
  const rulesPath = rulesFile ?? `${folder}/sprints/README.md`;
  if (reviews.length > 0) history.set(rulesPath, (gitText(top, ['log', '--reverse', '--format=%H', '--', full(rulesPath)]) ?? '').split('\n').filter(Boolean));
  for (const file of candidates) {
    if (roles.design.test(file) || roles.review.test(file)) continue;
    history.set(file, (gitText(top, ['log', '--reverse', '--format=%H', '--', full(file)]) ?? '').split('\n').filter(Boolean));
  }
  const versions = gitBlobs(top, [...history].flatMap(([file, commits]) => commits.map((commit) => `${commit}:${full(file)}`)));
  const sealCommit = new Map();
  for (const [file, commits] of history) {
    if (!candidates.has(file)) continue;
    const sealing = roles.demo.test(file)
      ? commits.find((commit) => versions.get(`${commit}:${full(file)}`))
      : commits.find((commit) => {
          const blob = versions.get(`${commit}:${full(file)}`);
          return blob && (roles.walkthrough.test(file) ? finalWalkthrough(blob.toString('utf8')) : sealedText(roles, file, blob.toString('utf8')));
        });
    if (sealing) sealCommit.set(file, sealing);
  }
  // The videos that git ignores, among those no commit holds.
  const unheld = [...candidates].filter((file) => roles.demo.test(file) && !sealCommit.has(file));
  const ignored = new Set(unheld.length ? (gitText(top, ['check-ignore', '--', ...unheld.map(full)]) ?? '').split(/\r?\n/).filter(Boolean).map(own) : []);
  for (const file of reviews) {
    const sealing = (history.get(rulesPath) ?? []).find((commit) => {
      const blob = versions.get(`${commit}:${full(rulesPath)}`);
      return blob && linkedReviews(roles, rulesPath, blob.toString('utf8')).has(file);
    });
    if (sealing) sealCommit.set(file, sealing);
  }
  const reviewAt = gitBlobs(top, reviews.filter((file) => sealCommit.has(file)).map((file) => `${sealCommit.get(file)}:${full(file)}`));
  for (const [spec, blob] of reviewAt) versions.set(spec, blob);
  const taskSeal = new Map([...sealCommit].map(([file, commit]) => [roles.task.exec(file)?.[2], commit]).filter(([id]) => id));
  const designs = [...candidates].filter((file) => roles.design.test(file));
  const designAt = gitBlobs(top, designs.filter((file) => taskSeal.has(roles.design.exec(file)[1])).map((file) => `${taskSeal.get(roles.design.exec(file)[1])}:${full(file)}`));

  const seals = [];
  for (const file of [...candidates].sort()) {
    const commit = roles.design.test(file) ? taskSeal.get(roles.design.exec(file)[1]) : sealCommit.get(file);
    if (!commit && ignored.has(file)) continue;
    if (!commit) {
      seals.push({ path: file, commit: null, state: 'uncommitted', text: null });
      continue;
    }
    const sealedVersion = (roles.design.test(file) ? designAt : versions).get(`${commit}:${full(file)}`);
    if (!sealedVersion) {
      seals.push({ path: file, commit, state: 'absent', text: null });
      continue;
    }
    const path = join(root, file);
    const state = !existsSync(path) ? 'deleted' : sameText(file, readFileSync(path), sealedVersion) ? 'kept' : 'changed';
    seals.push({ path: file, commit, state, text: sealedVersion });
  }
  return { unchecked: null, seals };
}

// A project's seals, as readSeals gives them: what close sprint's check lists and puts back, and what
// the runner keeps of a state whose seal is broken (SPR-2).
export function sealsOf(dir) {
  const root = resolve(dir);
  const folder = docsFolder(root);
  const roles = rolesOf(mapRows(undefined, folder));
  return readSeals(root, roles, sealedIn(root, projectFiles(root, folder), roles), folder);
}

// No sealed document has changed since its seal. One whose seal can't be read is a note.
function checkSeals(root, roles, sealedNow, result, folder) {
  const { unchecked, seals } = readSeals(root, roles, sealedNow, folder);
  if (unchecked) return result.notes.push(`seals: not checked: ${unchecked}`);
  for (const { path, commit, state } of seals) {
    if (state === 'uncommitted') result.notes.push(`${path}: sealed, not yet committed, so its seal isn't checked`);
    else if (state === 'absent') result.notes.push(`${path}: not in its seal's commit ${commit.slice(0, 7)}, so its seal isn't checked`);
    else {
      result.counts.seals++;
      if (state !== 'kept') result.faults.push({ path, line: 1, kind: 'sealed document changed', what: `${state} since its seal in ${commit.slice(0, 7)}` });
    }
  }
}

// ---- The check ------------------------------------------------------------------------------

export function checkDocs(dir) {
  const root = resolve(dir);
  const folder = docsFolder(root);
  const rows = mapRows(undefined, folder);
  const roles = rolesOf(rows);
  const files = projectFiles(root, folder);
  // Issues and deferred items are deleted at their end, so no document links one (documents.md's kinds).
  const deletedFolders = rows.filter((row) => row.document === 'Issue' || row.document === 'Deferred item').map((row) => `${posix.dirname(row.path)}/`);
  const markdown = files.filter((file) => file.endsWith('.md') && (file === 'AGENTS.md' || rows.some((row) => row.pattern.test(file))));
  const text = new Map(markdown.map((file) => [file, read(root, file)]));
  const sealed = sealedIn(root, files, roles);
  const result = { faults: [], sealedFaults: [], notes: [], counts: { links: 0, ids: 0, statuses: 0, seals: 0, documents: markdown.length } };
  const fault = (path, line, kind, what) => (sealed.has(path) ? result.sealedFaults : result.faults).push({ path, line, kind, what });

  for (const [file, body] of text) {
    const from = join(root, file);
    for (const { lineNo, raw, path, fragment } of relativeLinks(body)) {
      result.counts.links++;
      const target = linkTarget(root, from, path);
      const rel = relative(root, target);
      if (rel.startsWith('..') || isAbsolute(rel)) {
        fault(file, lineNo, 'outside the project', raw);
        continue;
      }
      const shown = rel.split(sep).join('/');
      if (deletedFolders.some((gone) => shown.startsWith(gone))) {
        fault(file, lineNo, 'links a file deleted at its end', `${raw}: name it in backticks instead`);
        continue;
      }
      const kind = targetFault(root, target, fragment);
      if (kind) fault(file, lineNo, kind, raw);
    }
  }
  // A slot left in a document the sync may change: text in angle brackets, outside code, reads as a
  // template's slot to the checks of the steps that wrote the document, and the sync's own check had
  // no word for it. The agent file is left out, since it holds the user's own rules.
  const synced = syncRows(rows).filter((row) => row.document !== 'Agent file');
  for (const [file, body] of text) {
    if (!synced.some((row) => row.pattern.test(file))) continue;
    for (const [lineNo, raw] of unfencedLines(body)) {
      const slot = slotIn(raw);
      if (slot) fault(file, lineNo, 'slot', `${slot} reads as a slot left unfilled: fill it, or put the text in a code span`);
    }
  }
  checkIds(files, roles, text, fault, result.counts);
  checkStatuses(files, roles, text, fault, result.counts);
  checkSeals(root, roles, sealed, result, folder);
  return result;
}

export function formatResult(result) {
  const line = ({ path, line: at, kind, what }) => `${path}:${at}  ${kind}  ${what}`;
  const lines = result.faults.map(line);
  if (result.sealedFaults.length > 0) lines.push('sealed, left as they are:', ...result.sealedFaults.map((f) => `  ${line(f)}`));
  if (result.notes.length > 0) lines.push('notes:', ...result.notes.map((note) => `  ${note}`));
  const { links, ids, statuses, seals, documents } = result.counts;
  lines.push(`checked ${links} links, ${ids} ids, ${statuses} statuses and ${seals} seals in ${documents} documents: ${result.faults.length} faults`);
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
    const result = checkDocs(dir);
    for (const line of formatResult(result)) console.log(line);
    process.exitCode = result.faults.length > 0 ? 1 : 0;
  }
}
