// Checks a Gradatim project's demos, as the demo step (../SKILL.md) leaves them in docs/demos/, with the line that
// other steps read in ../../method/references/documents.md:
// - a walkthrough is named docs/demos/YYYY-MM-DD-<topic>.mjs, a real date and a topic of lower-case words;
// - its first line is the draft mark, "// Gradatim demo: draft", or the final one, "// Gradatim demo: final,
//   YYYY-MM-DD", dated on or after its name's date;
// - it parses (`node --check`), it has an `export default`, and its `export const app` names `start` and `url`;
// - no slot of the template, ../assets/walkthrough.mjs, is left in it;
// - a video is a WebM (the EBML magic 1A45DFA3, and the DocType "webm"), lasts 3 seconds or more, and has its
//   walkthrough beside it, by the same name.
// Notes, which are no faults: a draft walkthrough; a final one with no video beside it, as in a clone, since git
// ignores the videos; a video over 10 MB, which GitHub takes in a pull request's description only on a paid plan;
// a video with no Duration, whose length is then read from its last frame.
// It writes nothing and reads no network.
//
// Usage, from the project's folder or anywhere:
//   node <the demo skill's folder>/scripts/check-demo.mjs [<project folder> | <file> …] [--offline]
// With no argument, the current folder is the project. A file's project is two folders above it. --offline
// changes nothing. Exit code 1 when a fault is found, 2 for a wrong call.

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { docsFolder, inFolder, projectRootOf } from '../../method/scripts/check-docs.mjs';

export const DEMOS = 'docs/demos';
export const DRAFT_MARK = '// Gradatim demo: draft';
export const FINAL_MARK = /^\/\/ Gradatim demo: final, (\d{4}-\d{2}-\d{2})$/;
const WALKTHROUGH = /^docs\/demos\/(\d{4}-\d{2}-\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\.mjs$/;
const VIDEO = /^docs\/demos\/(\d{4}-\d{2}-\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\.webm$/;
export const SHORTEST_MS = 3000;
export const LARGEST_BYTES = 10 * 1024 * 1024;
const TEMPLATE = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'walkthrough.mjs');

// ---- WebM ---------------------------------------------------------------------------------------------------

// EBML's variable-length integers: an id keeps its length marker, a size drops it, and a size of all ones is unknown.
function vint(buffer, at, keepMarker) {
  const first = buffer[at];
  if (first === undefined || first === 0) return null;
  const length = Math.clz32(first) - 23;
  if (length > 8 || at + length > buffer.length) return null;
  let value = keepMarker ? first : first & (0xff >> length);
  let ones = value === 0xff >> length;
  for (let k = 1; k < length; k++) {
    value = value * 256 + buffer[at + k];
    if (buffer[at + k] !== 0xff) ones = false;
  }
  return { value, length, unknown: !keepMarker && ones };
}
const unsigned = (buffer, start, end) => {
  let value = 0;
  for (let k = start; k < end; k++) value = value * 256 + buffer[k];
  return value;
};
const float = (buffer, start, end) => (end - start === 4 ? buffer.readFloatBE(start) : end - start === 8 ? buffer.readDoubleBE(start) : null);

const ID = { EBML: 0x1a45dfa3, DocType: 0x4282, Segment: 0x18538067, Info: 0x1549a966, TimecodeScale: 0x2ad7b1, Duration: 0x4489, Tracks: 0x1654ae6b, TrackEntry: 0xae, Video: 0xe0, PixelWidth: 0xb0, PixelHeight: 0xba, Cluster: 0x1f43b675, Timecode: 0xe7, SimpleBlock: 0xa3, BlockGroup: 0xa0, Block: 0xa1, Cues: 0x1c53bb6b };
// The level-1 ids that end a cluster of unknown size.
const LEVEL_ONE = new Set([ID.Cluster, ID.Cues, 0x114d9b74, ID.Info, ID.Tracks, 0x1254c367, 0x1941a469, 0x1043a770]);

// Each element between start and end, as [id, its data's start, its data's end].
function* elements(buffer, start, end, stopAt = null) {
  let at = start;
  while (at < end) {
    const id = vint(buffer, at, true);
    if (!id) return;
    if (stopAt?.has(id.value)) return;
    const size = vint(buffer, at + id.length, false);
    if (!size) return;
    const from = at + id.length + size.length;
    const to = size.unknown ? end : Math.min(end, from + size.value);
    yield [id.value, from, to, size.unknown];
    at = to;
  }
}

// What a WebM file says of itself: whether it opens with EBML's magic, its DocType, its Duration in milliseconds
// where its Info has one, the time of its last frame in milliseconds, and its video track's width and height.
export function readWebm(buffer) {
  const out = { ebml: false, docType: null, duration: null, lastFrame: null, width: null, height: null };
  if (buffer.length < 4 || buffer.readUInt32BE(0) !== ID.EBML) return out;
  out.ebml = true;
  for (const [id, from, to] of elements(buffer, 0, buffer.length)) {
    if (id === ID.EBML) {
      for (const [child, s, e] of elements(buffer, from, to)) if (child === ID.DocType) out.docType = buffer.toString('latin1', s, e).replace(/\0+$/, '');
    } else if (id === ID.Segment) readSegment(buffer, from, to, out);
  }
  return out;
}

function readSegment(buffer, start, end, out) {
  let scale = 1_000_000;
  let duration = null;
  let last = null;
  let at = start;
  while (at < end) {
    const id = vint(buffer, at, true);
    if (!id) break;
    const size = vint(buffer, at + id.length, false);
    if (!size) break;
    const from = at + id.length + size.length;
    let to = size.unknown ? end : Math.min(end, from + size.value);
    if (id.value === ID.Info) {
      for (const [child, s, e] of elements(buffer, from, to)) {
        if (child === ID.TimecodeScale) scale = unsigned(buffer, s, e) || scale;
        if (child === ID.Duration) duration = float(buffer, s, e);
      }
    } else if (id.value === ID.Tracks) {
      for (const [entry, s, e] of elements(buffer, from, to))
        if (entry === ID.TrackEntry)
          for (const [child, cs, ce] of elements(buffer, s, e))
            if (child === ID.Video)
              for (const [field, fs, fe] of elements(buffer, cs, ce)) {
                if (field === ID.PixelWidth) out.width ??= unsigned(buffer, fs, fe);
                if (field === ID.PixelHeight) out.height ??= unsigned(buffer, fs, fe);
              }
    } else if (id.value === ID.Cluster) {
      // A cluster's time, and each block's, relative to it, in the second and third bytes after the track's number.
      let base = 0;
      let reached = from;
      for (const [child, s, e] of elements(buffer, from, to, size.unknown ? LEVEL_ONE : null)) {
        reached = e;
        if (child === ID.Timecode) base = unsigned(buffer, s, e);
        const block = child === ID.SimpleBlock ? [s, e] : child === ID.BlockGroup ? [...elements(buffer, s, e)].find(([c]) => c === ID.Block)?.slice(1) : null;
        if (block) {
          const track = vint(buffer, block[0], false);
          if (track && block[0] + track.length + 2 <= block[1]) {
            const time = base + buffer.readInt16BE(block[0] + track.length);
            last = last === null ? time : Math.max(last, time);
          }
        }
      }
      if (size.unknown) to = reached;
    }
    if (to <= at) break;
    at = to;
  }
  out.duration = duration === null ? null : (duration * scale) / 1e6;
  out.lastFrame = last === null ? null : (last * scale) / 1e6;
}

// ---- Walkthroughs --------------------------------------------------------------------------------------------

// The slots of the walkthrough's template: each "<…>" in it, which a finished walkthrough no longer holds.
let templateSlots;
export function slotsOfTemplate() {
  if (templateSlots) return templateSlots;
  const text = existsSync(TEMPLATE) ? readFileSync(TEMPLATE, 'utf8') : '';
  return (templateSlots = [...new Set(text.match(/<[^<>\n]+>/g) ?? [])]);
}
// The template's slots that a text still holds, each with its first line.
export function slotsLeft(text, slots = slotsOfTemplate()) {
  const lines = text.split(/\r?\n/);
  return slots.filter((slot) => text.includes(slot)).map((slot) => ({ slot, line: lines.findIndex((line) => line.includes(slot)) + 1 }));
}

// A walkthrough's first line: "draft", "final" with its date, or null.
export function markOf(text) {
  const first = text.split(/\r?\n/, 1)[0].trim();
  if (first === DRAFT_MARK) return { mark: 'draft', date: null };
  const final = FINAL_MARK.exec(first);
  return final ? { mark: 'final', date: final[1] } : { mark: null, date: null };
}

const realDate = (date) => {
  const [y, m, d] = date.split('-').map(Number);
  const day = new Date(Date.UTC(y, m - 1, d));
  return day.getUTCFullYear() === y && day.getUTCMonth() === m - 1 && day.getUTCDate() === d;
};
const slashed = (path) => path.split('\\').join('/');

// The faults and notes of the demos the targets name: project folders, whose docs/demos/ is read whole, or files,
// each a walkthrough or a video, whose project is two folders above it. A video's walkthrough is checked with it.
export function checkDemos(targets = ['.'], { cwd = process.cwd() } = {}) {
  const faults = [];
  const notes = [];
  const fault = (path, line, kind, what) => faults.push({ path, line, kind, what });
  const note = (path, what) => notes.push({ path, what });
  const files = new Map(); // an absolute path: its project
  for (const target of targets.length ? targets : ['.']) {
    const path = resolve(cwd, target);
    if (!existsSync(path)) {
      fault(slashed(target), 0, 'missing', 'no such file or folder');
      continue;
    }
    if (statSync(path).isDirectory()) {
      const folder = join(path, ...inFolder(DEMOS, docsFolder(path)).split('/'));
      if (!existsSync(folder)) continue;
      for (const entry of readdirSync(folder).sort()) if (/\.(mjs|webm)$/.test(entry)) files.set(join(folder, entry), path);
    } else files.set(path, projectRootOf(path));
  }
  // A video brings its walkthrough along.
  for (const [path, project] of [...files]) {
    const pair = path.replace(/\.webm$/, '.mjs');
    if (path.endsWith('.webm') && existsSync(pair)) files.set(pair, project);
  }
  let walkthroughs = 0;
  let videos = 0;
  for (const [path, project] of [...files].sort(([a], [b]) => a.localeCompare(b))) {
    const rel = slashed(relative(project, path));
    // A demo's name is read as if its folder were docs/demos/, under the folder AGENTS.md names (MTH-11).
    const folder = docsFolder(project);
    const named = folder !== 'docs' && rel.startsWith(`${folder}/`) ? `docs/${rel.slice(folder.length + 1)}` : rel;
    if (path.endsWith('.mjs')) {
      walkthroughs++;
      checkWalkthrough(path, rel, fault, note, named);
    } else if (path.endsWith('.webm')) {
      videos++;
      checkVideo(path, rel, fault, note, named);
    } else fault(rel, 0, 'name', `not a walkthrough or a video: a demo is docs/demos/YYYY-MM-DD-<topic>.mjs, and its video beside it`);
  }
  return { faults, notes, walkthroughs, videos };
}

function checkWalkthrough(path, rel, fault, note, named = rel) {
  const name = WALKTHROUGH.exec(named);
  if (!name) fault(rel, 0, 'name', `a walkthrough is named docs/demos/YYYY-MM-DD-<topic>.mjs, with a topic of lower-case words`);
  else if (!realDate(name[1])) fault(rel, 0, 'name', `${name[1]} isn't a date`);
  const text = readFileSync(path, 'utf8');
  const { mark, date } = markOf(text);
  if (!mark) fault(rel, 1, 'mark', `the first line is neither "${DRAFT_MARK}" nor "// Gradatim demo: final, YYYY-MM-DD"`);
  else if (mark === 'draft') note(rel, 'a draft: its first line says draft, so a stopped run left it, or its agreement is still to come');
  else if (!realDate(date)) fault(rel, 1, 'mark', `${date} isn't a date`);
  else if (name && date < name[1]) fault(rel, 1, 'mark', `final on ${date}, before ${name[1]}, the date in its name`);
  const parsed = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8', windowsHide: true });
  if (parsed.status !== 0) {
    const where = /:(\d+)\r?\n/.exec(parsed.stderr ?? '')?.[1];
    const what = (parsed.stderr ?? '').split(/\r?\n/).find((line) => /Error/.test(line)) ?? 'it doesn\'t parse';
    fault(rel, Number(where ?? 0), 'syntax', what.trim());
  }
  if (!/^\s*export\s+default\b/m.test(text)) fault(rel, 0, 'export', 'no `export default async (page, demo) => { … }`, which plays the walkthrough');
  const app = /export\s+const\s+app\s*=\s*\{([^}]*)\}/.exec(text);
  if (!app || !/\bstart\s*:/.test(app[1]) || !/\burl\s*:/.test(app[1])) fault(rel, 0, 'export', 'no `export const app = { start, url }`: the command that serves the app, and its address');
  for (const { slot, line } of slotsLeft(text)) fault(rel, line, 'slot', `the template's slot "${slot}" is left`);
  if (mark === 'final' && !existsSync(path.replace(/\.mjs$/, '.webm'))) note(rel, 'final, with no video beside it: git ignores the videos, so a clone has none; recording it again makes one');
}

function checkVideo(path, rel, fault, note, named = rel) {
  if (!VIDEO.test(named)) fault(rel, 0, 'name', `a video is named as its walkthrough is, docs/demos/YYYY-MM-DD-<topic>.webm`);
  const buffer = readFileSync(path);
  const webm = readWebm(buffer);
  if (!webm.ebml) fault(rel, 0, 'webm', 'not a WebM: it doesn\'t open with EBML\'s magic, 1A45DFA3');
  else if (webm.docType !== 'webm') fault(rel, 0, 'webm', `not a WebM: its DocType is ${webm.docType ? `"${webm.docType}"` : 'missing'}`);
  else {
    const length = webm.duration ?? webm.lastFrame;
    if (webm.duration === null) note(rel, `no Duration in its Info${webm.lastFrame === null ? ', and no frame' : `: its last frame is at ${(webm.lastFrame / 1000).toFixed(1)} s`}`);
    if (length !== null && length < SHORTEST_MS) fault(rel, 0, 'duration', `${(length / 1000).toFixed(1)} s: a demo lasts ${SHORTEST_MS / 1000} seconds or more`);
    if (length === null) fault(rel, 0, 'duration', 'no Duration and no frame: an empty video');
  }
  if (buffer.length > LARGEST_BYTES) note(rel, `${(buffer.length / 1024 / 1024).toFixed(1)} MB: GitHub takes a video in a pull request's description up to 10 MB on a free plan`);
  if (!existsSync(path.replace(/\.webm$/, '.mjs'))) fault(rel, 0, 'pair', `no walkthrough beside it, ${basename(path).replace(/\.webm$/, '.mjs')}, which records it again`);
}

export function formatDemos(result) {
  const lines = result.faults.map(({ path, line, kind, what }) => `${path}${line ? `:${line}` : ''}  ${kind}  ${what}`);
  for (const { path, what } of result.notes) lines.push(`${path}  note  ${what}`);
  lines.push(`checked ${result.walkthroughs} walkthroughs and ${result.videos} videos: ${result.faults.length} faults`);
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
  const args = process.argv.slice(2).filter((arg) => arg !== '--offline');
  const flag = args.find((arg) => arg.startsWith('--'));
  if (flag) {
    console.log(`${flag}: not a flag of this script\nUsage: node check-demo.mjs [<project folder> | <file> …] [--offline]`);
    process.exitCode = 2;
  } else {
    const result = checkDemos(args);
    for (const line of formatDemos(result)) console.log(line);
    process.exitCode = result.faults.length > 0 ? 1 : 0;
  }
}
