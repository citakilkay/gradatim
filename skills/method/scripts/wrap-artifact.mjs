// Wraps a Gradatim artifact in the kit, as ../references/artifacts.md says. The step writes only
// the page's content, a <title> and one <main>. This script puts the kit's shell around it, in
// place: the doctype, the charset and viewport metas, the title, and ../assets/artifact.css as the
// kit's style. It then checks the page with check-artifact.mjs, and writes it only if it passes.
// A page it wrapped before is wrapped again with the current kit; with the same kit it is left as
// it is. It reads no network.
//
// Usage, from anywhere:
//   node <the method skill's folder>/scripts/wrap-artifact.mjs <file>… [--offline]
// --offline changes nothing. Exit code 1 when a file has a fault, is missing, or none is given.

import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { KIT_FILE, artifactKinds, checkArtifactText, formatFinding, kitHash } from './check-artifact.mjs';

const GENERATOR = 'Gradatim artifact kit';
const COMMENTS = /<!--[\s\S]*?-->/g;

// The content of a page: its title, its <main> and the main's lang, from a bare draft or from a
// page the kit wrapped before. Anything else in the file is a fault, since the shell is the kit's.
export function contentOf(text) {
  const source = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const title = /<title[^>]*>([\s\S]*?)<\/title\s*>/i.exec(source);
  const open = /<main\b[^>]*>/i.exec(source);
  const close = source.toLowerCase().lastIndexOf('</main');
  if (!open || close < open.index) return { fault: 'no <main>…</main>: write the page\'s content inside one <main>' };
  if (!title || title.index > open.index) return { fault: 'no <title> before <main>: write the page\'s title first, then its <main>' };
  const closeEnd = source.indexOf('>', close) + 1;
  const main = source.slice(open.index, closeEnd);
  const lang = /\blang\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(open[0]);
  const wrapped = source.includes(`content="${GENERATOR}`);
  const left = (wrapped ? keptByWrap(source, title, open.index, closeEnd) : bareLeft(source, title, open.index, closeEnd)).replace(COMMENTS, '').trim();
  if (left) return { fault: `something outside <main>, "${left.replace(/\s+/g, ' ').slice(0, 60)}": put it inside <main>` };
  return { title: title[1].replace(/\s+/g, ' ').trim(), main, lang: lang ? (lang[1] ?? lang[2] ?? lang[3]) : '' };
}

// A bare draft holds the title and the main, and nothing else but comments.
function bareLeft(source, title, mainStart, mainEnd) {
  const cut = [[title.index, title.index + title[0].length], [mainStart, mainEnd]].sort((a, b) => a[0] - b[0]);
  return source.slice(0, cut[0][0]) + source.slice(cut[0][1], cut[1][0]) + source.slice(cut[1][1]);
}

// A page the kit wrapped holds its shell, the title and the main: what's left beyond those is
// something a step added outside <main>.
function keptByWrap(source, title, mainStart, mainEnd) {
  return (source.slice(0, mainStart) + source.slice(mainEnd))
    .replace(title[0], '')
    .replace(/<style\b[^>]*\bdata-kit\b[^>]*>[\s\S]*?<\/style\s*>/i, '')
    .replace(/<!doctype html>/i, '')
    .replace(/<\/?(?:html|head|body)\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, (meta) => (/\b(?:charset|name\s*=\s*"(?:viewport|generator)")/i.test(meta) ? '' : meta));
}

const escapeText = (text) => text.replace(/&(?![a-z#0-9]+;)/gi, '&amp;').replace(/</g, '&lt;');

// The whole page, from its content and the kit's CSS.
export function pageOf({ title, main, lang }, css) {
  const style = css.replace(/\r\n?/g, '\n').trim();
  const hash = kitHash(style);
  return [
    '<!doctype html>',
    lang ? `<html lang="${lang}">` : '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<meta name="generator" content="${GENERATOR} ${hash}">`,
    `<title>${escapeText(title)}</title>`,
    `<style data-kit="${hash}">`,
    style,
    '</style>',
    '</head>',
    '<body>',
    main,
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

// Wraps one file. Returns what to print, and whether it held a fault.
export function wrapFile(file, css = readFileSync(KIT_FILE, 'utf8'), kinds = artifactKinds()) {
  if (!existsSync(file)) return { lines: [formatFinding(file, { line: 1, kind: 'file', what: 'missing' })], failed: true };
  const before = readFileSync(file, 'utf8');
  const content = contentOf(before);
  if (content.fault) return { lines: [formatFinding(file, { line: 1, kind: 'content', what: content.fault }), `${file}: not wrapped, so left as it was`], failed: true };
  const page = pageOf(content, css);
  const { faults, warnings } = checkArtifactText(page, file, kinds);
  const lines = [...faults.map((f) => formatFinding(file, f)), ...warnings.map((w) => formatFinding(file, { ...w, kind: `warning: ${w.kind}` }))];
  if (faults.length > 0) return { lines: [...lines, `${file}: ${faults.length} fault${faults.length === 1 ? '' : 's'}, so left as it was`], failed: true };
  const hash = kitHash(css);
  if (before.replace(/\r\n?/g, '\n') === page) return { lines: [...lines, `${file}: unchanged, wrapped by the kit ${hash}: no fault`], failed: false };
  writeFileSync(file, page);
  const kb = Math.max(1, Math.round(Buffer.byteLength(page) / 1024));
  return { lines: [...lines, `${file}: wrapped by the kit ${hash}, ${kb} KB: no fault`], failed: false };
}

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
    console.log('usage: node wrap-artifact.mjs <file>… [--offline]');
    process.exit(1);
  }
  const css = readFileSync(KIT_FILE, 'utf8');
  const kinds = artifactKinds();
  let failed = false;
  for (const file of files) {
    const result = wrapFile(file, css, kinds);
    for (const line of result.lines) console.log(line);
    failed ||= result.failed;
  }
  process.exit(failed ? 1 : 0);
}
