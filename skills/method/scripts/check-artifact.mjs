// Checks Gradatim artifacts, the HTML pages that ../references/artifacts.md describes: one file
// that needs nothing from the network, runs no script, carries the kit's look unchanged, and
// keeps its colours to the kit's tokens, so that it opens offline, in light and dark, and
// publishes as it is. Which names an artifact may have comes from ../references/documents.md.
// A review report's items are ranked 1, 2, 3 … with one badge each, strong ones first (REV-1).
// It writes nothing, needs no git, and reads no network.
//
// Usage, from anywhere:
//   node <the method skill's folder>/scripts/check-artifact.mjs <file>… [--offline]
// --offline changes nothing. Exit code 1 when a file has a fault, is missing, or none is given.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mapRows, pathPattern } from './check-docs.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const KIT_FILE = join(here, '..', 'assets', 'artifact.css');
export const WARN_BYTES = 200 * 1024;

// The kit's hash: the first 8 hex characters of the sha256 of its CSS, with line endings folded
// and the ends trimmed, so that a checkout's line endings don't change it.
export const kitHash = (css) =>
  createHash('sha256').update(css.replace(/\r\n?/g, '\n').trim()).digest('hex').slice(0, 8);

// The three kinds, by their names in documents.md. The living ones end with a change log.
const KINDS = ['Overview', 'PR explainer', 'Review report'];
const LIVING = new Set(['Overview', 'PR explainer']);
export function artifactKinds(rows = mapRows()) {
  return rows
    .filter((row) => KINDS.includes(row.document))
    .map((row) => ({ document: row.document, name: pathPattern(row.path.split('/').pop()) }));
}

// ---- A small HTML reader ------------------------------------------------------------------------

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const RAW = new Set(['style', 'script', 'title', 'textarea']);
const TAG = /<!--[\s\S]*?(?:-->|$)|<!doctype[^>]*>|<(\/?)([a-zA-Z][\w:.-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/gi;
const ATTR = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function attributesOf(text) {
  const attrs = new Map();
  for (const m of text.matchAll(ATTR)) {
    const name = m[1].toLowerCase();
    if (!attrs.has(name)) attrs.set(name, m[2] ?? m[3] ?? m[4] ?? '');
  }
  return attrs;
}

// Every element, with its name, its attributes, where its content starts and ends, its line, and
// its open ancestors; and every comment, so that text checks can leave comments out.
export function readHtml(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') starts.push(i + 1);
  const lineOf = (index) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= index) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
  const elements = [];
  const comments = [];
  const stack = [];
  TAG.lastIndex = 0;
  let m;
  while ((m = TAG.exec(text))) {
    if (m[0].startsWith('<!--')) {
      comments.push([m.index, m.index + m[0].length]);
      continue;
    }
    if (!m[2]) continue; // the doctype
    const name = m[2].toLowerCase();
    const closing = m[1] === '/';
    if (closing) {
      const at = stack.map((e) => e.name).lastIndexOf(name);
      if (at === -1) continue;
      for (const open of stack.splice(at)) open.end = m.index;
      continue;
    }
    const element = { name, attrs: attributesOf(m[3]), open: m.index, start: m.index + m[0].length, end: text.length, line: lineOf(m.index), ancestors: [...stack] };
    elements.push(element);
    if (RAW.has(name)) {
      const close = text.toLowerCase().indexOf(`</${name}`, element.start);
      element.end = close === -1 ? text.length : close;
      TAG.lastIndex = close === -1 ? text.length : close;
      continue;
    }
    if (m[4] === '/' || VOID.has(name)) {
      element.end = element.start;
      continue;
    }
    stack.push(element);
  }
  return { elements, comments, lineOf };
}

const classesOf = (element) => (element.attrs.get('class') ?? '').split(/\s+/).filter(Boolean);
const textOf = (text, element) =>
  text
    .slice(element.start, element.end)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const inside = (outer, inner) => inner.open >= outer.start && inner.open < outer.end;

// ---- Colours ------------------------------------------------------------------------------------

const NAMED_COLOURS = 'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen canvas canvastext linktext visitedtext activetext buttonface buttontext field fieldtext highlight highlighttext graytext'.split(' ');
const NAMED = new RegExp(`(?:^|[^\\w-])(?:${NAMED_COLOURS.join('|')})(?![\\w-])`, 'i');
const COLOUR_FUNCTION = /(?:^|[^\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const HEX = /#[0-9a-f]{3,8}(?![\w-])/i;
const withoutVars = (value) => value.replace(/var\(\s*--[\w-]+\s*\)|url\([^)]*\)/g, ' ');
export const rawColourIn = (value) => {
  const v = withoutVars(value);
  return HEX.test(v) || COLOUR_FUNCTION.test(v) || NAMED.test(v);
};
const SVG_PAINT = ['fill', 'stroke', 'stop-color', 'color', 'flood-color', 'lighting-color'];
const PAINT_OK = /^(?:none|currentcolor|transparent|inherit|context-fill|context-stroke|var\(\s*--[\w-]+\s*\)|url\(\s*#[^)]+\))$/i;

// ---- The rules ----------------------------------------------------------------------------------

const FORBIDDEN = ['iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'portal', 'link', 'base', 'form', 'script'];
const DATA_ONLY = ['src', 'srcset', 'poster', 'background', 'action', 'formaction', 'ping', 'data', 'archive', 'codebase', 'manifest'];
const LINK_OK = /^(?:https?:|mailto:)/i;
const DATE = /\b\d{4}-\d{2}-\d{2}\b/;
const BADGES = ['strong', 'optional'];
const decoded = (fragment) => {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
};

function cssFaults(css, line, fault, where) {
  if (/@import\b/i.test(css)) fault(line, 'network', `${where} has an @import`);
  for (const m of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi))
    if (!/^(?:data:|#)/i.test(m[2].trim())) fault(line, 'network', `${where} loads url(${m[2].trim()})`);
}

// The faults and warnings of one artifact's text. Its file name says its kind.
export function checkArtifactText(text, fileName, kinds = artifactKinds()) {
  const faults = [];
  const warnings = [];
  const fault = (line, kind, what) => faults.push({ line, kind, what });
  if (text.includes('�')) fault(1, 'text', 'holds U+FFFD, a character that failed to decode, which a publish refuses');
  const { elements, comments, lineOf } = readHtml(text);
  const all = (name) => elements.filter((e) => e.name === name);

  // The shell.
  if (!/^﻿?\s*<!doctype html>/i.test(text)) fault(1, 'shell', 'no <!doctype html> at its start: run the wrap');
  const metas = all('meta');
  if (!metas.some((e) => (e.attrs.get('charset') ?? '').toLowerCase() === 'utf-8')) fault(1, 'shell', 'no <meta charset="utf-8">: run the wrap');
  if (!metas.some((e) => (e.attrs.get('name') ?? '').toLowerCase() === 'viewport')) fault(1, 'shell', 'no viewport meta: run the wrap');
  const inSvg = (e) => e.ancestors.some((a) => a.name === 'svg');
  const titles = all('title').filter((e) => !inSvg(e));
  if (titles.length !== 1) fault(titles[1]?.line ?? 1, 'shell', `${titles.length} <title> elements, where one is needed`);
  else if (!textOf(text, titles[0])) fault(titles[0].line, 'shell', 'an empty <title>');
  const styles = all('style');
  const kitStyle = styles.find((e) => e.attrs.has('data-kit'));
  if (!kitStyle) fault(1, 'shell', "no kit style, <style data-kit>: run the wrap");
  else if (kitHash(text.slice(kitStyle.start, kitStyle.end)) !== kitStyle.attrs.get('data-kit'))
    fault(kitStyle.line, 'shell', "the kit's style was changed: put the page's needs in style attributes, and run the wrap again");
  for (const extra of styles.filter((e) => e !== kitStyle)) fault(extra.line, 'shell', 'a <style> of its own: only the kit styles a page, so use style attributes with its tokens');
  for (const style of styles) cssFaults(text.slice(style.start, style.end), style.line, fault, 'a <style>');
  const mains = all('main');
  if (mains.length !== 1) fault(mains[1]?.line ?? 1, 'shell', `${mains.length} <main> elements, where one is needed`);
  const body = all('body')[0];
  if (body && mains.length === 1) {
    const main = mains[0];
    const around = (text.slice(body.start, main.open) + text.slice(Math.min(main.end + '</main>'.length, body.end), body.end))
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
    if (around) fault(lineOf(body.start), 'shell', 'something in the body outside <main>: put it inside <main>');
  }

  // No script, and nothing from the network.
  const ids = new Map();
  for (const e of elements) {
    if (FORBIDDEN.includes(e.name)) fault(e.line, e.name === 'script' ? 'script' : 'network', `a <${e.name}>, which ${e.name === 'script' ? 'no page runs' : 'loads or sends from outside the page'}`);
    if (e.name === 'meta' && (e.attrs.get('http-equiv') ?? '').toLowerCase() === 'refresh') fault(e.line, 'network', 'a meta refresh');
    for (const [name, value] of e.attrs) {
      if (/^on[a-z]+$/.test(name)) fault(e.line, 'script', `an ${name} attribute, which runs a script`);
      if (/^\s*(?:javascript|vbscript):/i.test(value)) fault(e.line, 'script', `a ${name} that runs a script`);
      if (DATA_ONLY.includes(name) && !/^\s*data:/i.test(value)) fault(e.line, 'network', `${name}="${value.slice(0, 60)}": only a data: address loads nothing`);
      if ((name === 'href' || name === 'xlink:href') && e.name !== 'a' && !/^\s*(?:#|data:)/i.test(value))
        fault(e.line, 'network', `<${e.name} ${name}="${value.slice(0, 60)}">: only #… or data: loads nothing`);
      if (name === 'style') {
        cssFaults(value, e.line, fault, 'a style attribute');
        for (const declaration of value.split(';')) {
          const colon = declaration.indexOf(':');
          if (colon !== -1 && rawColourIn(declaration.slice(colon + 1)))
            fault(e.line, 'colour', `a raw colour in style="${declaration.trim().slice(0, 60)}": use the kit's tokens, var(--…)`);
        }
      }
      if (SVG_PAINT.includes(name) && e.ancestors.concat(e).some((a) => a.name === 'svg') && !PAINT_OK.test(value.trim()))
        fault(e.line, 'colour', `${name}="${value}" in an SVG: use var(--…), currentColor, none or a class of the kit`);
    }
    const id = e.attrs.get('id');
    if (id !== undefined) {
      if (ids.has(id)) fault(e.line, 'links', `the id "${id}" is used twice`);
      else ids.set(id, e);
    }
  }

  // Links: an anchor in the page, or a full address.
  for (const a of all('a')) {
    if (!a.attrs.has('href')) continue;
    const href = a.attrs.get('href').trim();
    if (href.startsWith('#')) {
      if (href.length > 1 && !ids.has(decoded(href.slice(1)))) fault(a.line, 'links', `href="${href}": no element has that id`);
    } else if (!LINK_OK.test(href))
      fault(a.line, 'links', `href="${href}": a published page can't follow a relative link, so name the document by its path in <code>`);
  }

  // Content.
  const h1s = all('h1');
  if (h1s.length !== 1) fault(h1s[1]?.line ?? 1, 'content', `${h1s.length} <h1> elements, where one is needed`);
  let unslotted = text;
  const blank = (from, to) => (unslotted = unslotted.slice(0, from) + unslotted.slice(from, to).replace(/[^\n]/g, ' ') + unslotted.slice(to));
  for (const [from, to] of comments) blank(from, to);
  for (const e of elements.filter((x) => x.name === 'pre' || x.name === 'style')) blank(e.start, e.end);
  for (const m of unslotted.matchAll(/\{\{[^}\n]*\}?\}?/g)) fault(lineOf(m.index), 'content', `an unfilled slot, ${m[0].slice(0, 50)}`);
  for (const svg of all('svg')) {
    if (!svg.attrs.has('viewbox')) fault(svg.line, 'content', 'an <svg> without a viewBox, which a phone can\'t scale');
    if ((svg.attrs.get('aria-hidden') ?? '') === 'true') continue;
    if ((svg.attrs.get('role') ?? '') !== 'img') fault(svg.line, 'content', 'an <svg> without role="img"');
    if (!elements.some((e) => e.name === 'title' && inside(svg, e))) fault(svg.line, 'content', 'an <svg> without a <title> that says what it shows');
  }
  for (const table of all('table'))
    if (!table.ancestors.some((a) => classesOf(a).includes('frame'))) fault(table.line, 'content', 'a <table> outside a .frame, which would widen the page on a phone');

  // By kind.
  const name = basename(fileName);
  const kind = kinds.find((k) => k.name.test(name));
  if (!kind) fault(1, 'name', `"${name}" isn't an artifact's name in documents.md: NN-overview.html, NN-pr-<topic>.html or NN-review-sprint-<n>.html`);
  const main = mains[0];
  if (main) {
    const inMain = (e) => inside(main, e);
    if (kind && LIVING.has(kind.document)) {
      const h2s = all('h2').filter(inMain);
      const last = h2s.at(-1);
      if (!last || textOf(text, last).toLowerCase() !== 'change log')
        fault(last?.line ?? main.line, 'content', `the ${kind.document.toLowerCase()} is living, so its last <h2> is "Change log"`);
      else {
        const table = all('table').find((t) => t.open > last.end && inMain(t));
        const heads = table ? elements.filter((e) => e.name === 'th' && inside(table, e)).map((th) => textOf(text, th).toLowerCase()) : [];
        const firstCells = table
          ? elements.filter((e) => e.name === 'tr' && inside(table, e)).map((tr) => elements.find((td) => td.name === 'td' && inside(tr, td)))
          : [];
        if (!table || heads[0] !== 'date' || heads[1] !== 'change') fault(last.line, 'content', 'the change log has no Date and Change table');
        else if (!firstCells.some((td) => td && DATE.test(textOf(text, td)))) fault(table.line, 'content', 'the change log has no dated row');
      }
    }
    // A review report's items (REV-1): item k shows the rank k and has the id item-<k>, with one badge, strong or
    // optional; no strong item sits below an optional one; and the top recommendation links item 1.
    if (kind?.document === 'Review report') {
      const items = all('article').filter((e) => inMain(e) && classesOf(e).includes('item'));
      let optional = null;
      items.forEach((card, index) => {
        const k = index + 1;
        const rank = elements.find((e) => inside(card, e) && classesOf(e).includes('rank'));
        if (!rank || textOf(text, rank) !== String(k)) fault(card.line, 'content', `item ${k} shows the rank "${rank ? textOf(text, rank) : ''}", where "${k}": rank the items 1, 2, 3 … in order`);
        if (card.attrs.get('id') !== `item-${k}`) fault(card.line, 'content', `item ${k} has the id "${card.attrs.get('id') ?? ''}", where "item-${k}"`);
        const badges = elements.filter((e) => inside(card, e) && classesOf(e).includes('tag') && BADGES.some((b) => classesOf(e).includes(b)));
        if (badges.length !== 1) {
          fault(card.line, 'content', badges.length === 0 ? `item ${k} has no badge: one <span class="tag strong"> or <span class="tag optional">` : `item ${k} has ${badges.length} badges, where one is needed`);
          return;
        }
        const badge = BADGES.find((b) => classesOf(badges[0]).includes(b));
        const own = BADGES.find((b) => classesOf(card).includes(b));
        if (own && own !== badge) fault(card.line, 'content', `item ${k}'s class says ${own}, and its badge ${badge}`);
        if (badge === 'optional') optional ??= k;
        else if (optional !== null) fault(card.line, 'content', `item ${k} is strong, below item ${optional}, which is optional: strong items rank first`);
      });
      const top = all('section').find((e) => inMain(e) && e.attrs.get('id') === 'top');
      if (items.length > 0 && !(top && all('a').some((a) => inside(top, a) && a.attrs.get('href') === '#item-1')))
        fault(top?.line ?? main.line, 'content', `the top recommendation doesn't link item 1: <a href="#item-1">`);
    }
    const footer = all('footer').find(inMain);
    if (!footer) fault(main.line, 'content', "no <footer> naming the step, the date and the documents it shows");
    else {
      if (!DATE.test(textOf(text, footer))) fault(footer.line, 'content', 'the footer has no date, YYYY-MM-DD');
      if (!elements.some((e) => e.name === 'code' && inside(footer, e))) fault(footer.line, 'content', 'the footer names no document by its path in <code>');
    }
  }

  const bytes = Buffer.byteLength(text);
  if (bytes > WARN_BYTES) warnings.push({ line: 1, kind: 'size', what: `${Math.round(bytes / 1024)} KB; a page stays under ${WARN_BYTES / 1024} KB` });
  return { faults, warnings };
}

// One file's result, read from disk: a file that doesn't decode as UTF-8 is a fault.
export function checkArtifactFile(file, kinds = artifactKinds()) {
  if (!existsSync(file)) return { faults: [{ line: 1, kind: 'file', what: 'missing' }], warnings: [] };
  const bytes = readFileSync(file);
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return { faults: [{ line: 1, kind: 'text', what: "doesn't decode as UTF-8" }], warnings: [] };
  }
  return checkArtifactText(text, file, kinds);
}

export const formatFinding = (file, { line, kind, what }) => `${file}:${line}  ${kind}  ${what}`;

// Whether node started this file. A symlink or a junction in its path makes process.argv[1] differ
// from import.meta.url, which node resolves to the real path: the script would then do nothing, and
// pass.
function startedHere() {
  try {
    return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (startedHere()) {
  const files = process.argv.slice(2).filter((arg) => arg !== '--offline');
  if (files.length === 0) {
    console.log('usage: node check-artifact.mjs <file>… [--offline]');
    process.exit(1);
  }
  const kinds = artifactKinds();
  let faults = 0;
  let warnings = 0;
  for (const file of files) {
    const result = checkArtifactFile(file, kinds);
    for (const f of result.faults) console.log(formatFinding(file, f));
    for (const w of result.warnings) console.log(formatFinding(file, { ...w, kind: `warning: ${w.kind}` }));
    faults += result.faults.length;
    warnings += result.warnings.length;
  }
  console.log(`checked ${files.length} artifact${files.length === 1 ? '' : 's'}: ${faults} fault${faults === 1 ? '' : 's'}${warnings ? `, ${warnings} warning${warnings === 1 ? '' : 's'}` : ''}`);
  process.exit(faults > 0 ? 1 : 0);
}
