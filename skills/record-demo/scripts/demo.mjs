// Gradatim's demo runner, for the demo step (../SKILL.md). It records a paced video of a project's UI, a card at each beat,
// from a walkthrough, docs/demos/YYYY-MM-DD-<topic>.mjs, with the project's own Playwright, 1.64 or later. It serves
// the app by the walkthrough's `app.start`, unless `app.url` answers already, and stops it at the end.
//
// Usage, from anywhere:
//   node <the demo skill's folder>/scripts/demo.mjs ready [<project folder>]
//   node <the demo skill's folder>/scripts/demo.mjs discover <walkthrough> [<path> …], each path without its leading slash, such as add for /add, and . for the home page
//   node <the demo skill's folder>/scripts/demo.mjs rehearse <walkthrough>
//   node <the demo skill's folder>/scripts/demo.mjs record <walkthrough>
// The project is two folders above the walkthrough. Exit code 0 when it went well, 1 for a fault or "not ready",
// 2 for a wrong call. It installs nothing, and writes only the video, beside the walkthrough; its own files, the
// server's log and the raw video, go in a temporary folder that it deletes.

import { spawn, spawnSync } from 'node:child_process';
import { closeSync, copyFileSync, existsSync, mkdtempSync, openSync, readFileSync, realpathSync, rmSync, statSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { projectRootOf } from '../../method/scripts/check-docs.mjs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DRAFT_MARK, FINAL_MARK, markOf, readWebm, slotsLeft } from './check-demo.mjs';

// The pauses, in milliseconds, set at the owner's word on seeing demos side by side (DMO-1): after a navigation, after
// a click, between beats, after the last action, a key typed, after typing, after a smooth scroll, after the cursor
// points at a part of the page, and the cursor's rest on its target before it acts. A longer wait, such as after a
// sign-in, is a walkthrough's own pause().
export const PACE = { navigation: 2800, click: 1800, beat: 1600, final: 2800, key: 32, typed: 450, scroll: 1400, see: 550, aim: 380 };
// How long a beat's card stays: long enough to read its title and its line, from 1.8 to 3.5 seconds.
export const CARD = { base: 1000, perCharacter: 30, least: 1800, most: 3500 };
export const cardTime = (title, line = '') => Math.min(CARD.most, Math.max(CARD.least, CARD.base + CARD.perCharacter * (String(title).length + String(line ?? '').length)));
// The steps of the mouse's glide to a target: 10 before an action, 8 when it only points at a part of the page.
const GLIDE = { act: 10, pan: 8 };
export const MIN_PLAYWRIGHT = '1.64.0';
export const PLAYWRIGHT_PACKAGES = ['playwright', '@playwright/test', 'playwright-core'];
export const TITLE_LIMIT = 40;
export const LINE_LIMIT = 60;
export const DEFAULT_SIZE = { width: 1280, height: 720 };
const VISIBLE_WITHIN = 5000;
const SERVER_WAIT = 120_000;
const POLL = 500;
const PROBE = 2000;
const QUIET_WAIT = 5000;
const KILL_GRACE = 3000;
const WATCHDOG = 10 * 60_000;
const DISCOVER_LINES = 200;
const FAULT_LINES = 120;
const MODES = ['ready', 'discover', 'rehearse', 'record'];
export const USAGE = [
  'Usage:',
  '  node demo.mjs ready [<project folder>]',
  '  node demo.mjs discover <walkthrough> [<path> …]',
  '  node demo.mjs rehearse <walkthrough>',
  '  node demo.mjs record <walkthrough>',
].join('\n');

const delay = (ms) => new Promise((done) => setTimeout(done, ms));
const firstLine = (error) => String(error?.message ?? error).split(/\r?\n/).find((line) => line.trim()) ?? 'it failed';
const slashed = (path) => path.split('\\').join('/');

// ---- The project's Playwright ----------------------------------------------------------------------------------

export function versionAtLeast(version, least = MIN_PLAYWRIGHT) {
  const parts = (text) => String(text).split(/[.+-]/).slice(0, 3).map((part) => Number.parseInt(part, 10) || 0);
  const [a, b] = [parts(version), parts(least)];
  for (let k = 0; k < 3; k++) if (a[k] !== b[k]) return a[k] > b[k];
  return true;
}

// The package manager a project's lockfile names, npm where it has none.
export function packageManager(dir) {
  const locks = [['pnpm-lock.yaml', 'pnpm'], ['yarn.lock', 'yarn'], ['bun.lock', 'bun'], ['bun.lockb', 'bun'], ['package-lock.json', 'npm'], ['npm-shrinkwrap.json', 'npm']];
  const found = locks.find(([file]) => existsSync(join(dir, file)));
  return { pm: found?.[1] ?? 'npm', lockfile: found?.[0] ?? null };
}

function packageFolder(require, dir, name) {
  try {
    return dirname(require.resolve(`${name}/package.json`));
  } catch {
    // Not resolvable from the project, or not exported: look in node_modules, as node does.
  }
  for (let at = dir; ; at = dirname(at)) {
    const folder = join(at, 'node_modules', ...name.split('/'));
    if (existsSync(join(folder, 'package.json'))) return folder;
    if (dirname(at) === at) return null;
  }
}

// What a project has of Playwright: the packages its package.json lists, and the first of playwright,
// @playwright/test and playwright-core that is installed, with its version and its folder.
export function findPlaywright(dir) {
  const manifest = join(dir, 'package.json');
  const { pm, lockfile } = packageManager(dir);
  if (!existsSync(manifest)) return { dir, manifest: false, listed: [], installed: null, pm, lockfile };
  let pkg = {};
  try {
    pkg = JSON.parse(readFileSync(manifest, 'utf8'));
  } catch {
    // A package.json that doesn't parse lists nothing.
  }
  const listed = PLAYWRIGHT_PACKAGES.filter((name) => [pkg.dependencies, pkg.devDependencies, pkg.optionalDependencies].some((deps) => deps && name in deps));
  const require = createRequire(manifest);
  let installed = null;
  for (const name of PLAYWRIGHT_PACKAGES) {
    const folder = packageFolder(require, dir, name);
    if (!folder) continue;
    let version = null;
    try {
      version = JSON.parse(readFileSync(join(folder, 'package.json'), 'utf8')).version ?? null;
    } catch {
      // A package with no readable manifest has no version.
    }
    installed = { name, version, folder };
    break;
  }
  return { dir, manifest: true, listed, installed, pm, lockfile };
}

const COMMANDS = {
  npm: { install: (lockfile) => (lockfile ? 'npm ci' : 'npm install'), add: (name) => `npm install -D ${name}`, browser: 'npx playwright install chromium' },
  pnpm: { install: () => 'pnpm install --frozen-lockfile', add: (name) => `pnpm add -D ${name}`, browser: 'pnpm exec playwright install chromium' },
  yarn: { install: () => 'yarn install --frozen-lockfile', add: (name) => `yarn add -D ${name}`, browser: 'yarn playwright install chromium' },
  bun: { install: () => 'bun install --frozen-lockfile', add: (name) => `bun add -d ${name}`, browser: 'bunx playwright install chromium' },
};

// Why a project isn't ready, with the commands that would make it so, for its lockfile; null where its packages are.
// The browser itself is checked by launching it.
export function readiness(found) {
  const commands = COMMANDS[found.pm] ?? COMMANDS.npm;
  if (!found.manifest) return { reason: 'the project has no package.json, so no Playwright for Node', commands: [commands.add('playwright'), commands.browser] };
  if (found.installed) {
    if (versionAtLeast(found.installed.version ?? '0')) return null;
    const name = found.listed[0] ?? found.installed.name;
    return { reason: `${found.installed.name} ${found.installed.version ?? 'of no version'} is installed, and the screencast needs ${MIN_PLAYWRIGHT} or later`, commands: [commands.add(`${name}@latest`), commands.browser] };
  }
  if (found.listed.length > 0) return { reason: `${found.listed[0]} is listed in package.json, and not installed`, commands: [commands.install(found.lockfile), commands.browser] };
  return { reason: 'package.json lists no Playwright', commands: [commands.add('playwright'), commands.browser] };
}

export function notReadyLines(problem, dir) {
  return [`not ready: ${problem.reason}`, ...(problem.commands.length ? [`the commands, in ${dir}:`, ...problem.commands.map((command) => `  ${command}`)] : [])];
}

// The installed package, loaded from the project: it exports `chromium`.
export function loadPlaywright(found) {
  const require = createRequire(join(found.installed.folder, 'package.json'));
  return require(found.installed.folder);
}

// ---- The walkthrough -------------------------------------------------------------------------------------------

export class DemoError extends Error {}

// A walkthrough, loaded: its mark, its app, its size and the function that plays it. Discover runs before the beats
// are written, so it needs only `app` without a slot; the other modes need the whole file without one.
export async function loadWalkthrough(file, { whole = true } = {}) {
  const path = resolve(file);
  if (!existsSync(path) || !statSync(path).isFile()) throw new DemoError(`${file}: no such file`);
  if (!path.endsWith('.mjs')) throw new DemoError(`${file}: a walkthrough is an .mjs file, docs/demos/YYYY-MM-DD-<topic>.mjs`);
  const project = projectRootOf(path);
  const rel = slashed(relative(project, path));
  const text = readFileSync(path, 'utf8');
  const href = pathToFileURL(path).href;
  let module;
  try {
    module = await import(`${href}?v=${Date.now()}`);
  } catch (error) {
    throw new DemoError(`${rel} doesn't load: ${firstLine(error)}`);
  }
  const problems = [];
  if (typeof module.default !== 'function') problems.push('it has no `export default async (page, demo) => { … }`');
  const app = module.app;
  if (!app || typeof app.start !== 'string' || !app.start.trim() || typeof app.url !== 'string') problems.push('it has no `export const app = { start, url }`');
  else if (/[<>]/.test(app.start + app.url)) problems.push('`app` still holds a slot of the template');
  else if (!/^https?:\/\/[^/\s]+/.test(app.url)) problems.push(`app.url, "${app.url}", isn't an http address`);
  const size = module.size ?? DEFAULT_SIZE;
  const fits = (value, most) => Number.isInteger(value) && value >= 200 && value <= most && value % 2 === 0;
  if (!size || !fits(size.width, 3840) || !fits(size.height, 2160)) problems.push('`size` is { width, height }: even numbers of pixels, from 200 up to 3840 by 2160');
  if (whole) for (const { slot, line } of slotsLeft(text)) problems.push(`line ${line} still holds the template's slot "${slot}"`);
  if (problems.length > 0) throw new DemoError(`${rel}: ${problems.join('; ')}`);
  return { file: path, href, rel, project, ...markOf(text), app: { start: app.start, url: app.url }, size: { width: size.width, height: size.height }, play: module.default };
}

// The walkthrough's line that a stack names, or null: its frames carry the file's address, with or without a query.
export function lineIn(stack, href) {
  for (const match of String(stack ?? '').matchAll(/(file:\/\/[^\s)?]+)(?:\?[^\s):]*)?:(\d+):\d+/g)) if (match[1] === href) return Number(match[2]);
  return null;
}

export class DemoFault extends Error {
  constructor({ line = null, helper, target = '', reason }) {
    super(`${helper}${target ? ` ${target}` : ''}: ${reason}`);
    Object.assign(this, { line, helper, target, reason });
  }
}

// The cursor: a white pointer with a dark outline and a soft shadow, drawn over each page the app loads, that follows
// the mouse. Its last point is kept in sessionStorage, so that after a navigation it comes back where it stood. Its tip
// sits on the mouse's point, it takes no clicks, and the page's accessibility tree doesn't see it. The owner chose a
// drawn cursor over Playwright's own pointer on seeing both side by side (DMO-1).
export const CURSOR = `(() => {
  const id = 'gradatim-demo-cursor';
  const remember = (point) => { try { sessionStorage.setItem(id, JSON.stringify(point)); } catch {} };
  const recall = () => { try { return JSON.parse(sessionStorage.getItem(id)); } catch { return null; } };
  let point = recall() || { x: innerWidth / 2, y: innerHeight / 2 };
  const draw = () => {
    const root = document.documentElement;
    if (!root) return null;
    let pointer = document.getElementById(id);
    if (!pointer) {
      pointer = document.createElement('div');
      pointer.id = id;
      pointer.setAttribute('aria-hidden', 'true');
      pointer.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transition:transform 90ms linear;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35))';
      pointer.innerHTML = '<svg width="20" height="24" viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.5V18.5L6.4 14.4L9.3 21L12.1 19.8L9.3 13.3H15L2 1.5Z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>';
      root.appendChild(pointer);
    }
    pointer.style.transform = 'translate(' + (point.x - 2) + 'px,' + (point.y - 1.5) + 'px)';
    return pointer;
  };
  addEventListener('mousemove', (event) => {
    point = { x: event.clientX, y: event.clientY };
    remember(point);
    draw();
  }, true);
  draw();
  document.addEventListener('DOMContentLoaded', draw);
})();`;

// The helpers a walkthrough calls, for one mode: in "rehearse" they act with no pause and no decoration, and fault on a
// part of the page that isn't visible within 5 seconds, a card's title of 40 characters or more or its line of 60 or
// more, or a new tab; in "record" they also glide the mouse to each target, hold the pauses, and show the cards. Each
// adds an entry to the timeline.
export function makeDemo(page, { mode, app, href = null, wait = null, now = () => Date.now(), opened = () => 0, firstUrl = null }) {
  const recording = mode === 'record';
  const hold = (key) => (recording ? PACE[key] : 0);
  const waitFor = wait ?? ((ms) => page.waitForTimeout(ms));
  const sleep = async (ms) => {
    if (ms > 0) await waitFor(ms);
  };
  const start = now();
  const timeline = [];
  const chapters = [];
  const state = { ended: false, steps: 0, firstUrl };
  const where = () => lineIn(new Error().stack, href);
  const named = (locator) => String(locator);

  async function visible(helper, locator, line) {
    try {
      await locator.waitFor({ state: 'visible', timeout: VISIBLE_WITHIN });
    } catch (error) {
      throw new DemoFault({ line, helper, target: named(locator), reason: /Timeout/i.test(String(error?.name) + firstLine(error)) ? `not visible within ${VISIBLE_WITHIN / 1000} s` : firstLine(error) });
    }
  }
  async function step(helper, target, held, line, act) {
    if (state.ended) throw new DemoFault({ line, helper, target, reason: 'it comes after demo.end(), which holds the last screen' });
    const at = now() - start;
    try {
      await act?.();
    } catch (error) {
      if (error instanceof DemoFault) throw error;
      throw new DemoFault({ line, helper, target, reason: firstLine(error) });
    }
    if (opened() > 0) throw new DemoFault({ line, helper, target, reason: 'a new tab opened: a demo keeps to one tab, since a pop-up makes a video of its own' });
    if (held > 0) await sleep(held);
    timeline.push({ at, helper, step: target ? `${helper} ${target}` : helper, held });
    state.steps++;
  }
  // In record only: the target is brought into view and the mouse travels to its middle in a few steps, so that the
  // cursor glides there; then a short rest, so that the viewer sees where it will act.
  async function glide(locator, steps) {
    if (!recording) return;
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    if (!box) return;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps });
    await sleep(PACE.aim);
  }

  const helpers = {
    // A beat's card: its title, and one line on what the viewer sees, in place of a caption.
    async chapter(title, words = '') {
      const line = where();
      if (typeof title !== 'string' || !title.trim()) throw new DemoFault({ line, helper: 'chapter', reason: 'a card needs a title' });
      if (title.length >= TITLE_LIMIT) throw new DemoFault({ line, helper: 'chapter', target: JSON.stringify(title), reason: `${title.length} characters: a card's title stays under ${TITLE_LIMIT}` });
      const said = String(words ?? '');
      if (said.length >= LINE_LIMIT) throw new DemoFault({ line, helper: 'chapter', target: JSON.stringify(said), reason: `${said.length} characters: a card's line stays under ${LINE_LIMIT}` });
      const shown = cardTime(title, said);
      if (timeline.length > 0) {
        const at = now() - start;
        await sleep(hold('beat'));
        timeline.push({ at, helper: 'beat', step: 'a pause between beats', held: hold('beat') });
      }
      chapters.push({ at: now() - start, title });
      await step('chapter', `"${title}"${said ? `: "${said}"` : ''}`, 0, line, async () => {
        if (!recording) return;
        const began = now();
        await page.screencast.showChapter(title, { ...(said ? { description: said } : {}), duration: shown });
        const left = shown - (now() - began);
        if (left > 0) await sleep(left);
      });
      timeline.at(-1).held = recording ? shown : 0;
    },
    // A demo has no caption bar: what a caption would say goes on its beat's card.
    async caption(text = '') {
      throw new DemoFault({ line: where(), helper: 'caption', target: JSON.stringify(String(text ?? '')), reason: "a demo shows no caption bar: give this line to the beat's card, as demo.chapter('<title>', '<line>')" });
    },
    async goto(path = '/') {
      const line = where();
      const url = new URL(path, app.url).href;
      await step('goto', path, hold('navigation'), line, async () => {
        // The page opened at this address before the video started, so that its first frame shows the app.
        const already = state.firstUrl !== null && state.firstUrl === url;
        state.firstUrl = null;
        if (already) return;
        await page.goto(url);
        await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
      });
    },
    async click(locator) {
      const line = where();
      await step('click', named(locator), hold('click'), line, async () => {
        await visible('click', locator, line);
        await glide(locator, GLIDE.act);
        await locator.click();
      });
    },
    async fill(locator, text) {
      const line = where();
      await step('fill', `${named(locator)} "${text}"`, hold('typed'), line, async () => {
        await visible('fill', locator, line);
        await glide(locator, GLIDE.act);
        await locator.click();
        await locator.clear();
        await locator.pressSequentially(String(text), { delay: hold('key') });
      });
    },
    async choose(locator, label) {
      const line = where();
      await step('choose', `${named(locator)} "${label}"`, hold('click'), line, async () => {
        await visible('choose', locator, line);
        await glide(locator, GLIDE.act);
        await locator.selectOption({ label: String(label) });
      });
    },
    async see(locator) {
      const line = where();
      await step('see', named(locator), hold('see'), line, async () => {
        await visible('see', locator, line);
        if (recording) await glide(locator, GLIDE.pan);
        else await locator.hover();
      });
    },
    async scroll(locator) {
      const line = where();
      await step('scroll', named(locator), hold('scroll'), line, async () => {
        await visible('scroll', locator, line);
        await locator.evaluate((element) => element.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      });
    },
    async pause(ms = 0) {
      const line = where();
      if (!Number.isFinite(ms) || ms < 0 || ms > 30_000) throw new DemoFault({ line, helper: 'pause', target: String(ms), reason: 'a pause is from 0 to 30,000 milliseconds' });
      await step('pause', `${ms} ms`, recording ? ms : 0, line, null);
    },
    async end() {
      const line = where();
      await step('end', '', hold('final'), line, null);
      state.ended = true;
    },
  };
  return { helpers, timeline, chapters, state };
}

// Plays a walkthrough on a page: the helpers for the mode, a new tab watched, and an end it must reach.
export async function play(walkthrough, page, options) {
  const tabs = [];
  const context = page.context();
  const onPage = (tab) => tabs.push(tab);
  context.on('page', onPage);
  const demo = makeDemo(page, { ...options, app: walkthrough.app, href: walkthrough.href, opened: () => tabs.length });
  try {
    await walkthrough.play(page, demo.helpers);
    if (tabs.length > 0) throw new DemoFault({ helper: 'walkthrough', reason: 'a new tab opened: a demo keeps to one tab' });
    if (!demo.state.ended) throw new DemoFault({ helper: 'end', reason: "the walkthrough doesn't end with demo.end(), which holds the last screen" });
  } catch (error) {
    if (error instanceof DemoFault) throw error;
    throw new DemoFault({ line: lineIn(error?.stack, walkthrough.href), helper: 'walkthrough', reason: firstLine(error) });
  } finally {
    context.off('page', onPage);
  }
  return demo;
}

// ---- The app's server ------------------------------------------------------------------------------------------

// Whether an address answers with any HTTP response, within a time.
export function answers(url, timeout = PROBE) {
  return new Promise((done) => {
    let settled = false;
    const finish = (value) => {
      if (!settled) {
        settled = true;
        done(value);
      }
    };
    try {
      const target = new URL(url);
      const call = target.protocol === 'https:' ? httpsRequest : httpRequest;
      const req = call(target, { method: 'GET', agent: false, timeout, rejectUnauthorized: false }, (res) => {
        res.resume();
        finish(true);
      });
      req.on('timeout', () => {
        req.destroy();
        finish(false);
      });
      req.on('error', () => finish(false));
      req.end();
    } catch {
      finish(false);
    }
  });
}

const live = new Set();
const temporary = new Set();

function killTree(pid, signal) {
  if (!pid) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  else
    try {
      process.kill(-pid, signal);
    } catch {
      try {
        process.kill(pid, signal);
      } catch {
        // Gone already.
      }
    }
}

// A process that outlives this one, for the case where nothing of this one runs at its end: a host that kills it
// outright, as a forced end on Windows does, runs no handler, and the server would hold its port. It watches this
// process; once it is gone, it stops the server's processes and deletes the temporary folder. It ends with the server.
// On Windows, node puts the shell it starts in a job that dies with this process, while what the shell started lives
// on outside it; so the guardian reads the server's tree once, while it stands, and kills each process of it.
export const GUARDIAN = `
const [parent, server, folder] = process.argv.slice(1);
const { spawnSync } = require('node:child_process');
const { rmSync } = require('node:fs');
const alive = (pid) => { try { process.kill(Number(pid), 0); return true; } catch (error) { return error.code === 'EPERM'; } };
const tree = [server];
if (process.platform === 'win32') {
  const out = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', 'Get-CimInstance Win32_Process | ForEach-Object { "$($_.ProcessId) $($_.ParentProcessId)" }'], { encoding: 'utf8', windowsHide: true });
  const children = new Map();
  for (const line of String(out.stdout || '').split(/\\r?\\n/)) {
    const [pid, ppid] = line.trim().split(/\\s+/);
    if (pid && ppid && pid !== ppid) children.set(ppid, [...(children.get(ppid) || []), pid]);
  }
  for (let k = 0; k < tree.length; k++) tree.push(...(children.get(tree[k]) || []).filter((pid) => !tree.includes(pid)));
}
setInterval(() => {
  const standing = tree.filter(alive);
  if (standing.length === 0) process.exit(0);
  if (alive(parent)) return;
  if (process.platform === 'win32') for (const pid of standing) spawnSync('taskkill', ['/pid', pid, '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  else try { process.kill(-Number(server), 'SIGKILL'); } catch {}
  try { rmSync(folder, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {}
  process.exit(0);
}, 500);
`;

const tail = (file, lines = 15) => {
  try {
    return readFileSync(file, 'utf8').split(/\r?\n/).filter((line) => line.trim()).slice(-lines).map((line) => `  ${line}`).join('\n');
  } catch {
    return '  (no log)';
  }
};

// Serves the app: reuses a server that answers at its address already, or starts one with its command, its output in
// a log in the temporary folder, never in this process's pipe, and waits for the address to answer.
export async function serve(app, { cwd, logDir }) {
  if (await answers(app.url)) return { reused: true, url: app.url, start: app.start };
  const log = join(logDir, 'server.log');
  const fd = openSync(log, 'a');
  let child;
  try {
    child = spawn(app.start, { cwd, shell: true, stdio: ['ignore', fd, fd], detached: process.platform !== 'win32', windowsHide: true, env: { ...process.env, BROWSER: 'none', FORCE_COLOR: '0' } });
  } finally {
    closeSync(fd);
  }
  const server = { reused: false, url: app.url, start: app.start, pid: child.pid, log, exited: null, stopped: false };
  child.on('exit', (code, signal) => (server.exited = { code, signal }));
  child.on('error', (error) => (server.exited = { code: null, signal: null, error }));
  live.add(server);
  const deadline = Date.now() + SERVER_WAIT;
  while (Date.now() < deadline) {
    if (server.exited) {
      live.delete(server);
      throw new DemoError(`"${app.start}" ended${server.exited.code !== null ? ` with code ${server.exited.code}` : ''} before ${app.url} answered. Its last lines:\n${tail(log)}`);
    }
    if (await answers(app.url, 1000)) {
      // Once the address answers, the server's tree stands, for the guardian to read.
      const guardian = spawn(process.execPath, ['-e', GUARDIAN, String(process.pid), String(child.pid), logDir], { detached: true, stdio: 'ignore', windowsHide: true });
      guardian.unref();
      server.guardian = guardian.pid;
      return server;
    }
    await delay(POLL);
  }
  await stopServer(server);
  throw new DemoError(`${app.url} didn't answer within ${SERVER_WAIT / 1000} s of "${app.start}". Its last lines:\n${tail(log)}`);
}

// Stops a server this run started, with the processes below it, and waits for its address to go quiet. True when it did.
export async function stopServer(server) {
  if (!server || server.reused) return true;
  if (!server.stopped) {
    server.stopped = true;
    killTree(server.pid, 'SIGTERM');
    if (process.platform !== 'win32') {
      const until = Date.now() + KILL_GRACE;
      while (!server.exited && Date.now() < until) await delay(100);
      if (!server.exited) killTree(server.pid, 'SIGKILL');
    }
  }
  live.delete(server);
  const until = Date.now() + QUIET_WAIT;
  while (Date.now() < until) {
    if (!(await answers(server.url, 500))) return true;
    await delay(250);
  }
  return false;
}

// At the process's end, however it ends: each server still up is killed, and each temporary folder deleted.
function stopEverythingNow() {
  for (const server of live) if (!server.stopped) killTree(server.pid, 'SIGKILL');
  live.clear();
  for (const dir of temporary) rmSync(dir, { recursive: true, force: true });
  temporary.clear();
}
let guarded = false;
function guard() {
  if (guarded) return;
  guarded = true;
  process.on('exit', stopEverythingNow);
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'])
    process.on(signal, () => {
      stopEverythingNow();
      process.exit(130);
    });
  for (const event of ['uncaughtException', 'unhandledRejection'])
    process.on(event, (error) => {
      console.log(`stopped: ${firstLine(error)}`);
      stopEverythingNow();
      process.exit(1);
    });
  setTimeout(() => {
    console.log(`stopped: the run passed ${WATCHDOG / 60_000} minutes`);
    stopEverythingNow();
    process.exit(1);
  }, WATCHDOG).unref();
}

// A temporary folder for a run's own files, deleted when the run ends, however it ends.
export async function withTempDir(work) {
  const dir = mkdtempSync(join(tmpdir(), 'gradatim-demo-'));
  temporary.add(dir);
  try {
    return await work(dir);
  } finally {
    temporary.delete(dir);
    try {
      rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (error) {
      console.log(`note: ${dir} wasn't deleted: ${firstLine(error)}`);
    }
  }
}

// ---- The printout ----------------------------------------------------------------------------------------------

export const clock = (ms) => {
  const seconds = Math.round(Math.max(0, ms) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};
const tenths = (ms) => {
  const seconds = Math.max(0, ms) / 1000;
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(1).padStart(4, '0')}`;
};
const secondsOf = (ms) => `${(ms / 1000).toFixed(1)} s`;

// What `record` prints: the video, its chapters, its timeline, its pace against the pauses it was set to, and the server.
export function recordingLines({ rel, bytes, webm = {}, size, timeline, chapters, server, quiet = true }) {
  const length = webm.duration ?? webm.lastFrame ?? (timeline.length ? timeline.at(-1).at + timeline.at(-1).held : 0);
  const width = webm.width ?? size.width;
  const height = webm.height ?? size.height;
  const mean = (helper) => {
    const held = timeline.filter((entry) => entry.helper === helper).map((entry) => entry.held);
    return held.length ? secondsOf(held.reduce((a, b) => a + b, 0) / held.length) : 'none';
  };
  const lines = [`recorded ${rel}: ${clock(length)}, ${(bytes / 1024 / 1024).toFixed(1)} MB, ${width} by ${height}`];
  lines.push(`chapters: ${chapters.length ? chapters.map((chapter) => `${clock(chapter.at)} ${chapter.title}`).join(' · ') : 'none'}`);
  lines.push('timeline:');
  for (const entry of timeline) lines.push(`  ${tenths(entry.at)}  ${entry.step}${entry.held ? `  held ${secondsOf(entry.held)}` : ''}`);
  const set = (key) => secondsOf(PACE[key]);
  lines.push(`pace, against its setting: after a navigation ${mean('goto')} (${set('navigation')}) · after a click ${mean('click')} (${set('click')}) · between beats ${mean('beat')} (${set('beat')}) · after the last action ${mean('end')} (${set('final')})`);
  lines.push(serverLine(server, quiet));
  return lines;
}
export function serverLine(server, quiet = true) {
  if (server.reused) return `server: reused ${server.url}: this run neither started it nor stops it`;
  return quiet ? `server: started by "${server.start}", stopped` : `server: started by "${server.start}", and ${server.url} still answers after the stop: stop it by hand`;
}
const capped = (text, most) => {
  const lines = String(text).split(/\r?\n/);
  return lines.length > most ? [...lines.slice(0, most), `… ${lines.length - most} more lines`] : lines;
};
async function treeOf(page) {
  try {
    return typeof page.ariaSnapshot === 'function' ? await page.ariaSnapshot() : await page.locator('body').ariaSnapshot();
  } catch (error) {
    return `(no tree: ${firstLine(error)})`;
  }
}
export function faultLines(fault, rel, url, tree) {
  return [`fault at ${rel}${fault.line ? `:${fault.line}` : ''}: ${fault.message}`, `the page at ${url} shows:`, ...capped(tree, FAULT_LINES)];
}

// Whether a page's Playwright records with chapter cards, as 1.64 and later do.
const screencastOf = (page) => ['start', 'stop', 'showChapter'].every((name) => typeof page.screencast?.[name] === 'function');

// ---- The modes -------------------------------------------------------------------------------------------------

function projectPlaywright(dir, say) {
  const found = findPlaywright(dir);
  const problem = readiness(found);
  if (problem) {
    for (const line of notReadyLines(problem, dir)) say(line);
    return null;
  }
  return { found, playwright: loadPlaywright(found) };
}

async function launch(playwright) {
  if (!playwright.chromium?.launch) throw new DemoError(`the package has no chromium to launch`);
  return playwright.chromium.launch({ headless: true });
}

async function ready(dir, say) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    say(`${dir}: no such folder`);
    return 2;
  }
  const loaded = projectPlaywright(dir, say);
  if (!loaded) return 1;
  const { found, playwright } = loaded;
  const commands = COMMANDS[found.pm] ?? COMMANDS.npm;
  let browser;
  try {
    browser = await launch(playwright);
    const page = await browser.newPage();
    if (!screencastOf(page)) {
      for (const line of notReadyLines({ reason: `${found.installed.name} ${found.installed.version} has no screencast with chapter cards`, commands: [commands.add(`${found.listed[0] ?? found.installed.name}@latest`), commands.browser] }, dir)) say(line);
      return 1;
    }
  } catch (error) {
    for (const line of notReadyLines({ reason: `Chromium doesn't launch: ${firstLine(error)}`, commands: [commands.browser] }, dir)) say(line);
    return 1;
  } finally {
    await browser?.close().catch(() => {});
  }
  say(`ready: ${found.installed.name} ${found.installed.version}, and Chromium launches`);
  return 0;
}

async function newPage(browser, size) {
  const context = await browser.newContext({ viewport: size, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('dialog', (dialog) => dialog.accept().catch(() => {}));
  return page;
}

async function rehearsal(walkthrough, browser, say) {
  const page = await newPage(browser, walkthrough.size);
  const began = Date.now();
  try {
    const demo = await play(walkthrough, page, { mode: 'rehearse' });
    say(`rehearsed: no fault, ${demo.state.steps} steps in ${((Date.now() - began) / 1000).toFixed(1)} s`);
    return true;
  } catch (error) {
    const fault = error instanceof DemoFault ? error : new DemoFault({ helper: 'walkthrough', reason: firstLine(error) });
    for (const line of faultLines(fault, walkthrough.rel, page.url(), await treeOf(page))) say(line);
    return false;
  } finally {
    await page.context().close().catch(() => {});
  }
}

async function withApp(walkthrough, say, work) {
  return withTempDir(async (tmp) => {
    const loaded = projectPlaywright(walkthrough.project, say);
    if (!loaded) return 1;
    const server = await serve(walkthrough.app, { cwd: walkthrough.project, logDir: tmp });
    if (server.reused) say(serverLine(server));
    let browser;
    try {
      browser = await launch(loaded.playwright);
      return await work({ tmp, server, browser });
    } finally {
      await browser?.close().catch(() => {});
      say(serverLine(server, await stopServer(server)));
    }
  });
}

// A page's address from a path on the command line: "add" or "/add", and "." for the home page. Git Bash on Windows
// rewrites an argument that starts with a slash into a folder of its own, such as C:/Program Files/Git/add.
export function pageAddress(path, base) {
  if (/^[A-Za-z]:[\\/]/.test(path)) throw new DemoError(`${path}: the shell rewrote this path into a folder; give it without its leading slash, such as "add" for /add, and "." for the home page`);
  return new URL(path === '.' ? '/' : `/${path.replace(/^\/+/, '')}`, base).href;
}

async function discover(walkthrough, paths, say) {
  const urls = (paths.length ? paths : ['.']).map((path) => pageAddress(path, walkthrough.app.url));
  return withApp(walkthrough, say, async ({ browser }) => {
    const page = await newPage(browser, walkthrough.size);
    for (const url of urls) {
      await page.goto(url);
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
      say(`the page at ${url} shows:`);
      for (const line of capped(await treeOf(page), DISCOVER_LINES)) say(line);
    }
    return 0;
  });
}

async function rehearse(walkthrough, say) {
  return withApp(walkthrough, say, async ({ browser }) => ((await rehearsal(walkthrough, browser, say)) ? 0 : 1));
}

async function record(walkthrough, say) {
  return withApp(walkthrough, say, async ({ tmp, browser, server }) => {
    if (!(await rehearsal(walkthrough, browser, say))) return 1;
    const page = await newPage(browser, walkthrough.size);
    if (!screencastOf(page)) {
      say(`not ready: this Playwright has no screencast with chapter cards, which needs ${MIN_PLAYWRIGHT} or later`);
      return 1;
    }
    const raw = join(tmp, 'demo.webm');
    await page.addInitScript(CURSOR);
    await page.goto(walkthrough.app.url);
    await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    await page.mouse.move(walkthrough.size.width / 2, walkthrough.size.height / 2);
    await page.screencast.start({ path: raw, size: walkthrough.size, fps: 25 });
    let demo;
    try {
      demo = await play(walkthrough, page, { mode: 'record', firstUrl: page.url() });
    } catch (error) {
      await page.screencast.stop().catch(() => {});
      const fault = error instanceof DemoFault ? error : new DemoFault({ helper: 'walkthrough', reason: firstLine(error) });
      for (const line of faultLines(fault, walkthrough.rel, page.url(), await treeOf(page))) say(line);
      say('no video was kept');
      return 1;
    }
    await page.screencast.stop();
    await page.context().close();
    const target = walkthrough.file.replace(/\.mjs$/, '.webm');
    copyFileSync(raw, target);
    const bytes = statSync(target).size;
    const rel = walkthrough.rel.replace(/\.mjs$/, '.webm');
    const lines = recordingLines({ rel, bytes, webm: readWebm(readFileSync(target)), size: walkthrough.size, timeline: demo.timeline, chapters: demo.chapters, server });
    // The server's line comes last, once the server is stopped.
    for (const line of lines.slice(0, -1)) say(line);
    return 0;
  });
}

// The command line. Returns the exit code.
export async function main(argv, say = (line) => console.log(line)) {
  const [mode, ...rest] = argv;
  if (!MODES.includes(mode)) {
    say(USAGE);
    return 2;
  }
  if (mode === 'ready') {
    if (rest.length > 1) {
      say(USAGE);
      return 2;
    }
    return ready(resolve(rest[0] ?? '.'), say);
  }
  if (rest.length === 0 || (mode !== 'discover' && rest.length > 1)) {
    say(USAGE);
    return 2;
  }
  let walkthrough;
  try {
    walkthrough = await loadWalkthrough(rest[0], { whole: mode !== 'discover' });
  } catch (error) {
    say(error instanceof DemoError ? error.message : `${rest[0]}: ${firstLine(error)}`);
    return error instanceof DemoError && /no such file|an \.mjs file/.test(error.message) ? 2 : 1;
  }
  try {
    if (mode === 'discover') return await discover(walkthrough, rest.slice(1), say);
    if (mode === 'rehearse') return await rehearse(walkthrough, say);
    return await record(walkthrough, say);
  } catch (error) {
    say(error instanceof DemoError ? error.message : `stopped: ${firstLine(error)}`);
    return 1;
  }
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
  guard();
  process.exit(await main(process.argv.slice(2)));
}

export { DRAFT_MARK, FINAL_MARK };
