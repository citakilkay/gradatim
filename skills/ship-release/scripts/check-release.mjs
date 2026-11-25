// Checks a Gradatim project's release record, docs/RELEASES.md, as the release step writes it (../SKILL.md, from
// ../assets/record.md), with the lines that other steps read in ../../method/references/documents.md:
// - the title, "# <Project> · The releases";
// - each entry's heading, "## <version> · YYYY-MM-DD", or "## YYYY-MM-DD" where the project's manifest names no
//   version; no release named twice, and no entry dated before the one above it, since the newest comes last;
// - each entry's five lines, in order: Holds, Commit, How, The check and Result;
// - each task the Holds line names is `completed` or `completed-as-partial`, with its file; and no task is held by
//   two entries, unless the first was rolled back;
// - the Commit line names a commit, by 7 to 40 hexadecimal characters; it doesn't look the commit up, since a state
//   built again gets new hashes;
// - the Result is "shipped." or "failed: …"; a failed entry has its dated note, "> **Rolled back, YYYY-MM-DD.** …" or
//   "> **Not rolled back, YYYY-MM-DD.** …", and a shipped one has none;
// - no slot "<…>" is left outside code.
// It writes nothing and reads no network.
//
// Usage, from the project's folder or anywhere:
//   node <the release skill's folder>/scripts/check-release.mjs [<project folder>] [--offline]
// The folder is the current one by default. --offline changes nothing. Exit code 1 when a fault is found.

import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { docsFolder, headerValue, inFolder, slotIn, unfencedLines } from '../../method/scripts/check-docs.mjs';

// The record's path in a project with no folder of Gradatim's own; recordOf gives it under the folder AGENTS.md names (MTH-11).
export const RECORD = 'docs/RELEASES.md';
export const recordOf = (dir) => inFolder(RECORD, docsFolder(dir));
const LINES = ['Holds', 'Commit', 'How', 'The check', 'Result'];
const VERSION = /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TASK_ID = /(?<![\w./-])([A-Z]{3}-\d+)(?![./-]?\w)/g;
const NOTE = /^>\s*\*\*(Rolled back|Not rolled back),\s+(\d{4}-\d{2}-\d{2})\.\*\*/;
const DONE = ['completed', 'completed-as-partial'];

// The version the project's manifest names: package.json's, else pyproject.toml's or Cargo.toml's. Null where none does.
export function projectVersion(dir) {
  try {
    const version = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).version;
    if (typeof version === 'string' && version) return version;
  } catch {
    // No package.json, or none that names a version.
  }
  for (const manifest of ['pyproject.toml', 'Cargo.toml']) {
    const file = join(dir, manifest);
    if (!existsSync(file)) continue;
    const version = /^\s*version\s*=\s*["']([^"']+)["']/m.exec(readFileSync(file, 'utf8'))?.[1];
    if (version) return version;
  }
  return null;
}

// The project's tasks, by id: each task file in the sprints' folders, with its status.
function tasksOf(dir) {
  const tasks = new Map();
  const folder = docsFolder(dir);
  const sprints = join(dir, ...inFolder('docs/sprints', folder).split('/'));
  if (!existsSync(sprints)) return tasks;
  for (const sprint of readdirSync(sprints, { withFileTypes: true }).filter((entry) => entry.isDirectory() && /^sprint-\d+$/.test(entry.name)))
    for (const name of readdirSync(join(sprints, sprint.name))) {
      const id = /^([A-Z]{3}-\d+)-.+\.md$/.exec(name)?.[1];
      if (!id) continue;
      const status = headerValue(readFileSync(join(sprints, sprint.name, name), 'utf8'), 'Status')?.value ?? null;
      tasks.set(id, { file: `${inFolder('docs/sprints', folder)}/${sprint.name}/${name}`, status });
    }
  return tasks;
}

export function checkRelease(dir) {
  const record = recordOf(dir);
  const result = { faults: [], entries: 0, record };
  const fault = (line, kind, what) => result.faults.push({ path: record, line, kind, what });
  const file = join(dir, record);
  if (!existsSync(file)) {
    fault(1, 'missing', `no ${record}: the release step writes it`);
    return result;
  }
  const lines = [...unfencedLines(readFileSync(file, 'utf8'))];
  const title = lines.find(([, line]) => /^#\s/.test(line));
  if (!title || !/^# .+ · The releases\s*$/.test(title[1])) fault(title?.[0] ?? 1, 'title', `the record opens with "# <Project> · The releases"${title ? `, not "${title[1].trim()}"` : ''}`);
  for (const [lineNo, line] of lines) {
    const slot = slotIn(line);
    if (slot) fault(lineNo, 'slot', `${slot} is a slot of the template, left unfilled`);
  }

  // The entries: each from its "## " heading to the next.
  const entries = [];
  for (const [lineNo, line] of lines) {
    if (/^##\s/.test(line)) entries.push({ lineNo, heading: line.trim(), body: [] });
    else if (entries.length > 0) entries.at(-1).body.push([lineNo, line]);
  }
  result.entries = entries.length;
  const version = projectVersion(dir);
  const tasks = tasksOf(dir);
  const seen = new Map(); // a release's name, to its entry's line
  const held = new Map(); // a task's id, to the entry that holds it and whether that entry was rolled back
  let lastDate = null;
  for (const entry of entries) {
    // The heading: "## <version> · YYYY-MM-DD", or the date alone where the project has no version.
    const both = /^## (\S+) · (\S+)$/.exec(entry.heading);
    const alone = /^## (\S+)$/.exec(entry.heading);
    let name = null;
    let date = null;
    if (both && VERSION.test(both[1]) && DATE.test(both[2])) [name, date] = [both[1], both[2]];
    else if (!version && alone && DATE.test(alone[1])) [name, date] = [alone[1], alone[1]];
    else
      fault(
        entry.lineNo,
        'heading',
        `"${entry.heading}" isn't "## <version> · YYYY-MM-DD"${version ? ` (the project's version is ${version})` : ', or "## YYYY-MM-DD" for a project with no version'}`,
      );
    if (name) {
      if (seen.has(name)) fault(entry.lineNo, 'twice', `the release ${name} has an entry at line ${seen.get(name)} already`);
      else seen.set(name, entry.lineNo);
      if (lastDate && date < lastDate) fault(entry.lineNo, 'order', `${date} comes before ${lastDate}, the date of the entry above it: the newest entry comes last`);
      lastDate = date;
    }

    // The five lines, in order.
    const named = [];
    const value = {};
    for (const [lineNo, line] of entry.body) {
      const m = /^\s*-\s+\*\*([^*]+?):\*\*\s*(.*)$/.exec(line);
      if (m && LINES.includes(m[1])) {
        named.push(m[1]);
        value[m[1]] ??= { lineNo, text: m[2].trim() };
      }
    }
    const missing = LINES.filter((line) => !named.includes(line));
    if (missing.length > 0) fault(entry.lineNo, 'lines', `the entry has no ${missing.map((line) => `**${line}:**`).join(', ')} line`);
    else if (named.join('|') !== LINES.join('|')) fault(entry.lineNo, 'lines', `the entry's lines come as ${named.join(', ')}, where they go ${LINES.join(', ')}`);

    // The notes: each dated, a failed entry with one, a shipped one with none.
    const notes = [];
    let marked = 0;
    for (const [lineNo, line] of entry.body) {
      if (!/^>\s*\*\*/.test(line)) continue;
      marked++;
      const m = NOTE.exec(line);
      if (!m) fault(lineNo, 'note', `a note opens "> **Rolled back, YYYY-MM-DD.**" or "> **Not rolled back, YYYY-MM-DD.**"`);
      else notes.push({ lineNo, kind: m[1], date: m[2] });
    }
    const outcome = value.Result?.text;
    const shipped = outcome === 'shipped.';
    const failed = /^failed:\s+\S/.test(outcome ?? '');
    if (value.Result && !shipped && !failed) fault(value.Result.lineNo, 'result', `the Result is "shipped." or "failed: <the line that failed>", not "${outcome}"`);
    if (failed && marked === 0) fault(entry.lineNo, 'note', `a failed release has a dated note under it: "> **Rolled back, YYYY-MM-DD.** …", or "Not rolled back" where the runbook says it can't be undone`);
    if (shipped && notes.length > 0) fault(notes[0].lineNo, 'note', `a shipped release has no note under it`);
    const rolledBack = notes.some((note) => note.kind === 'Rolled back');

    // The commit, by its hash.
    if (value.Commit && !/(?<![0-9a-f])[0-9a-f]{7,40}(?![0-9a-f])/i.test(value.Commit.text)) fault(value.Commit.lineNo, 'commit', `the Commit line names no commit by its hash, 7 to 40 hexadecimal characters`);

    // The tasks it holds: each closed, with its file, and none held twice unless the first entry was rolled back.
    if (value.Holds) {
      const ids = [...new Set([...value.Holds.text.matchAll(TASK_ID)].map((m) => m[1]))];
      if (ids.length === 0) fault(value.Holds.lineNo, 'holds', `the Holds line names no task by its id`);
      for (const id of ids) {
        const task = tasks.get(id);
        if (!task) fault(value.Holds.lineNo, 'holds', `${id} has no task file in ${inFolder('docs/sprints', docsFolder(dir))}/`);
        else if (!DONE.includes(task.status)) fault(value.Holds.lineNo, 'holds', `${id} is \`${task.status}\` in ${task.file}, where a release holds a \`completed\` or \`completed-as-partial\` task`);
        const before = held.get(id);
        if (before && !before.rolledBack) fault(value.Holds.lineNo, 'held twice', `${id} is held by the entry at line ${before.lineNo} already, which wasn't rolled back`);
        held.set(id, { lineNo: entry.lineNo, rolledBack });
      }
    }
  }
  return result;
}

export function formatRelease(result) {
  const lines = result.faults.map(({ path, line, kind, what }) => `${path}:${line}  ${kind}  ${what}`);
  lines.push(`checked ${result.entries} entries in ${result.record ?? RECORD}: ${result.faults.length} faults`);
  return lines;
}

// Whether node started this file. A symlink or a junction in its path makes process.argv[1] differ from
// import.meta.url, which node resolves to the real path: the script would then do nothing, and exit 0.
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
    const result = checkRelease(dir);
    for (const line of formatRelease(result)) console.log(line);
    process.exitCode = result.faults.length > 0 ? 1 : 0;
  }
}
