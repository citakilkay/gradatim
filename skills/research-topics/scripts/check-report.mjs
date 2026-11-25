// Checks a report that Gradatim's research step wrote, as research-topics' SKILL.md says: its
// shape, and its quotes against the pages they cite. A fetch that summarises a page can change a
// number, so each key claim carries the page's exact sentence, and this script looks for it there.
// It marks a quote it can't find, prints the page's closest sentence, and writes the header's
// count. It writes only into a draft, or into the notes added since git's last commit, since an
// indexed report is append-only (documents.md).
// A third kind, the report on the project's code, `NN-the-code.md` (MTH-8), cites paths in backticks, not
// pages: each quote is looked for in its file at the commit the header names, and in the file as it stands,
// with no network and no write. A miss is a fault until the report and its index row are in git's last
// commit, and a note after that, since the code moves on and no step may change the report.
//
// Usage, from the project's folder or anywhere:
//   node <the skill's folder>/scripts/check-report.mjs <report.md> [<report.md> …] [--offline]
//   node <the skill's folder>/scripts/check-report.mjs --quote <url> <words …>
//   node <the skill's folder>/scripts/check-report.mjs --text <url> [<words …>]
// --quote prints the page's own sentences that hold the words, for a quote, and --text the page's
// text, from the sentence that holds the words if any: a page's words with no summary between.
// --offline checks the shape, that the quotes were checked, and that nothing above a note
// changed, with no fetch and no write. Exit code 1 when a report's shape is wrong, or an indexed
// report changed above its notes. A quote that isn't found is marked, not failed; on the code, a
// quote that isn't found fails, unless it is a note.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, posix, resolve, win32 } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectRootOf } from '../../method/scripts/check-docs.mjs';

export const REPORT_PARTS = ['Summary', 'Findings', 'The options', 'Risks, watch-outs and trade-offs', 'Gaps', 'Sources', 'Notes'];
export const COMPARISON_PARTS = ['Summary', 'The ideas side by side', 'Risks, watch-outs and trade-offs', 'Gaps', 'Notes'];
export const CODE_PARTS = ['Summary', 'Findings', 'Risks, watch-outs and trade-offs', 'Gaps', 'Sources', 'Notes'];
export const CODE_SECTIONS = ['What it does', 'Stack and structure', 'Commands and tests', 'Half built'];
// The report on the project's code is told by its file name (MTH-8).
export const isCode = (file) => /^\d{2,}-the-code\.md$/.test(basename(file));
const COMMIT = /\bcommit `([0-9a-f]{7,40})`/i;
// A file that holds keys or passwords, which the read never opens or quotes: the report is committed.
const SECRET = /^(\.env(\..+)?|.+\.(pem|key|p12|pfx|keystore|jks)|id_(rsa|dsa|ecdsa|ed25519)|\.npmrc|\.netrc|\.pgpass|credentials(\..+)?|secrets?(\..+)?)$/i;
const NO_SECRET = /^\.env\.(example|sample|template|dist)$/i;
const secretFile = (path) => {
  const name = path.split(/[\\/]/).pop();
  return SECRET.test(name) && !NO_SECRET.test(name);
};
const outsideProject = (path) => posix.isAbsolute(path) || win32.isAbsolute(path) || path.split(/[\\/]/).includes('..');
const MARKED_PART = 'Risks, watch-outs and trade-offs';
const LABELS = /^- \*\*(Risk|Watch out|Trade-off):\*\*/;
const CONFIDENCE = /Confidence: (high|medium|low|inference)\b/i;
// A quote line: `> "<the sentence>" [n]`, or with an inline link in a note:
// `> "<the sentence>" ([<Title>](<url>))`. Anything after the citation is kept, such as a mark.
const QUOTE = /^(\s*>\s*)"(.*)"\s*(\[(\d+)\]|\(\[[^\]]*\]\((https?:\/\/[^)\s]+)\)\))(.*)$/;
const MARKS = { missing: 'unverified: not on the page', unreached: 'unverified: not reached' };
const OLD_MARK = /\s*\(unverified: (?:not on the page|not reached)\)/g;
const CITATION = /\[(\d+)\](?!\()/g;
const FINDING_REF = /\b(\d{2,}) F(\d+)\b/g;
const USER_AGENT = 'Mozilla/5.0 (compatible; Gradatim research check)';
const TIMEOUT_MS = 20000;
const MAX_BYTES = 5 * 1024 * 1024;

// ---- Reading a report -----------------------------------------------------------------------

// The report's lines, its title, its header line, and its "## " parts, outside fenced code.
export function parse(text) {
  const lines = text.split(/\r?\n/);
  const report = { lines, title: '', titleLine: -1, header: null, headerLine: -1, parts: [], partAt: {} };
  report.titleLine = lines.findIndex((line) => /^#\s/.test(line));
  if (report.titleLine >= 0) report.title = lines[report.titleLine];
  for (let i = report.titleLine + 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    if (/^\*.*\*$/.test(lines[i].trim())) {
      report.header = lines[i];
      report.headerLine = i;
    }
    break;
  }
  let fence = null;
  lines.forEach((line, i) => {
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (fence) {
      if (marker && marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      return;
    }
    if (marker) {
      fence = marker;
      return;
    }
    const heading = /^##\s+(.+?)\s*$/.exec(line)?.[1];
    if (heading !== undefined) report.parts.push({ name: heading, start: i });
  });
  report.parts.forEach((part, k) => {
    part.end = k + 1 < report.parts.length ? report.parts[k + 1].start : lines.length;
    report.partAt[part.name] ??= part;
  });
  return report;
}

const partLines = (report, name) => {
  const part = report.partAt[name];
  return part ? report.lines.slice(part.start + 1, part.end).map((text, k) => ({ text, index: part.start + 1 + k })) : [];
};
const isComparison = (report) => 'The ideas side by side' in report.partAt || /^#\s+\d{2,} · Compares\b/.test(report.title);

// The findings: each "- **Fn.**" bullet, with the lines indented under it. A bullet of another
// kind under "Findings" is kept apart, since every finding needs its id (RES-1's main path put a
// gap there).
function findingsOf(report) {
  const found = [];
  const strays = [];
  let current = null;
  for (const { text, index } of partLines(report, 'Findings')) {
    const id = /^- \*\*F(\d+)\.\*\*/.exec(text)?.[1];
    if (id !== undefined) {
      current = { id: Number(id), index, own: text, quotes: 0 };
      found.push(current);
    } else if (/^\s+\S/.test(text) && current) {
      if (QUOTE.test(text)) current.quotes++;
      else current.own += ` ${text.trim()}`;
    } else if (text.trim()) {
      current = null;
      if (/^[-*] /.test(text)) strays.push(index);
    }
  }
  found.strays = strays;
  return found;
}

// The sources: "n. [Title](url), …".
function sourcesOf(report) {
  const sources = new Map();
  for (const { text, index } of partLines(report, 'Sources')) {
    const m = /^(\d+)\.\s+\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)(.*)$/.exec(text.trim());
    if (m) sources.set(Number(m[1]), { title: m[2], url: m[3], rest: m[4], index });
  }
  return sources;
}

// The quote lines anywhere in the report, each with the page it cites.
function quotesOf(report, sources) {
  const quotes = [];
  report.lines.forEach((text, index) => {
    const m = QUOTE.exec(text);
    if (!m) return;
    const number = m[4] ? Number(m[4]) : null;
    quotes.push({ index, prefix: m[1], quote: m[2], citation: m[3], number, url: number ? sources.get(number)?.url : m[5], tail: m[6] ?? '' });
  });
  return quotes;
}

// ---- The shape --------------------------------------------------------------------------------

// The labelled lines of "Risks, watch-outs and trade-offs", each citing what it rests on.
function markedProblems(report) {
  const problems = [];
  const marked = partLines(report, MARKED_PART).filter(({ text }) => text.trim().startsWith('- '));
  if (marked.length === 0) problems.push(`"${MARKED_PART}" has no line`);
  for (const { text, index } of marked) {
    if (!LABELS.test(text.trim())) problems.push(`line ${index + 1}: a line of "${MARKED_PART}" opens with **Risk:**, **Watch out:** or **Trade-off:**`);
    else if (!/\bF\d+\b|\[\d+\]/.test(text)) problems.push(`line ${index + 1}: cites no finding or source`);
  }
  return problems;
}

// The findings: their ids in order, each with its confidence and what it rests on.
function findingProblems(findings) {
  const problems = [];
  if (findings.length === 0) problems.push(`"Findings" has no "- **F1.**" line`);
  for (const index of findings.strays) problems.push(`line ${index + 1}: a bullet in "Findings" that isn't a finding: give it its id, or move it to "Gaps"`);
  findings.forEach((finding, k) => {
    const where = `line ${finding.index + 1}`;
    if (finding.id !== k + 1) problems.push(`${where}: F${finding.id} comes where F${k + 1} should`);
    const confidence = CONFIDENCE.exec(finding.own)?.[1]?.toLowerCase();
    if (!confidence) problems.push(`${where}: F${finding.id} has no "Confidence: high", "medium", "low" or "inference"`);
    else if (confidence === 'inference' ? !/\bF\d+\b/.test(finding.own.replace(/^- \*\*F\d+\.\*\*/, '')) : !/\[\d+\]/.test(finding.own))
      problems.push(`${where}: F${finding.id} cites ${confidence === 'inference' ? 'no finding it builds on' : 'no source'}`);
  });
  return problems;
}

export function shapeProblems(report, { folder, offline, code = false } = {}) {
  if (code) return codeShapeProblems(report);
  const problems = [];
  const comparison = isComparison(report);
  const expected = comparison ? COMPARISON_PARTS : REPORT_PARTS;
  if (!/^#\s+\d{2,} · \S/.test(report.title)) problems.push(`the title isn't "# NN · <the topic, as a question>"`);
  if (!report.header) problems.push(`no header line in italics under the title`);
  else if (!/decides nothing/i.test(report.header)) problems.push(`the header line doesn't say that the report decides nothing`);
  else if (!comparison && !/Quotes:/.test(report.header)) problems.push(`the header line has no "Quotes:", where this script writes the count`);
  else if (!comparison && !/Missing:/.test(report.header)) problems.push(`the header line has no "Missing:", which says what a missing research tool would have added, or "nothing"`);
  const names = report.parts.map((part) => part.name);
  if (names.join('|') !== expected.join('|')) problems.push(`the parts are [${names.join(', ')}]; a ${comparison ? 'comparison' : 'report'} has ${expected.join(', ')}, in that order`);

  problems.push(...markedProblems(report));

  if (comparison) {
    const rows = partLines(report, 'The ideas side by side').filter(({ text }) => /^\s*\|/.test(text)).slice(2);
    if (rows.length === 0) problems.push(`"The ideas side by side" has no table rows`);
    for (const { text, index } of rows) {
      const cells = text.trim().replace(/^\||\|$/g, '').split('|').slice(1);
      for (const cell of cells)
        if (!/\b\d{2,} F\d+\b/.test(cell) && !/not found/i.test(cell)) problems.push(`line ${index + 1}: a cell cites no finding, as "NN Fk"`);
    }
    if (folder) problems.push(...refProblems(report, folder));
    return problems;
  }

  problems.push(...findingProblems(findingsOf(report)));
  if (!partLines(report, 'The options').some(({ text }) => /^- \*\*/.test(text.trim()))) problems.push(`"The options" has no "- **<option>:**" line`);

  const sources = sourcesOf(report);
  if (sources.size === 0) problems.push(`"Sources" lists no "1. [Title](url)" line`);
  for (const [number, source] of sources) {
    if (!/\b(Primary|Secondary)\b/.test(source.rest)) problems.push(`line ${source.index + 1}: source ${number} doesn't say Primary or Secondary`);
    if (!/Checked \d{4}-\d{2}-\d{2}/.test(source.rest)) problems.push(`line ${source.index + 1}: source ${number} has no "Checked YYYY-MM-DD"`);
  }
  const sourcesPart = report.partAt.Sources;
  report.lines.forEach((text, index) => {
    if (sourcesPart && index > sourcesPart.start && index < sourcesPart.end) return;
    for (const m of text.matchAll(CITATION)) if (!sources.has(Number(m[1]))) problems.push(`line ${index + 1}: cites [${m[1]}], which "Sources" doesn't list`);
  });
  for (const q of quotesOf(report, sources)) if (!q.url) problems.push(`line ${q.index + 1}: a quote whose source has no link`);
  if (offline && report.header && /Quotes: not checked yet/i.test(report.header)) problems.push(`the quotes were never checked: run this script without --offline`);
  return problems;
}

// A comparison's "NN Fk" citations: the report NN in the same folder, and its finding k.
function refProblems(report, folder) {
  const problems = [];
  const files = existsSync(folder) ? readdirSync(folder) : [];
  const findings = new Map();
  report.lines.forEach((text, index) => {
    for (const m of text.matchAll(FINDING_REF)) {
      const [, number, id] = m;
      if (!findings.has(number)) {
        const file = files.find((name) => name.startsWith(`${number}-`) && name.endsWith('.md'));
        findings.set(number, file ? new Set(findingsOf(parse(readFileSync(join(folder, file), 'utf8'))).map((f) => f.id)) : null);
      }
      const ids = findings.get(number);
      if (!ids) problems.push(`line ${index + 1}: cites ${number} F${id}, and no report ${number}- is in the folder`);
      else if (!ids.has(Number(id))) problems.push(`line ${index + 1}: cites ${number} F${id}, which report ${number} doesn't hold`);
    }
  });
  return problems;
}

// ---- The report on the code (MTH-8) --------------------------------------------------------------

// Its sources: "n. `<path>`, …", each a path from the project's folder. A link in their place is kept apart,
// since a later task may move the file, and no step may change an indexed report.
function codeSourcesOf(report) {
  const sources = new Map();
  sources.links = [];
  for (const { text, index } of partLines(report, 'Sources')) {
    const line = text.trim();
    const m = /^(\d+)\.\s+`([^`]+)`(.*)$/.exec(line);
    if (m) sources.set(Number(m[1]), { path: m[2].trim(), rest: m[3], index });
    else if (/^\d+\.\s+\[/.test(line)) sources.links.push(index);
  }
  return sources;
}

// Its quote lines, each with the path its source names.
function codeQuotesOf(report, sources) {
  const quotes = [];
  report.lines.forEach((text, index) => {
    const m = QUOTE.exec(text);
    if (!m) return;
    const number = m[4] ? Number(m[4]) : null;
    quotes.push({ index, quote: m[2], number, path: number ? (sources.get(number)?.path ?? null) : null });
  });
  return quotes;
}

function codeShapeProblems(report) {
  const problems = [];
  if (!/^#\s+\d{2,} · \S/.test(report.title)) problems.push(`the title isn't "# NN · What does the code already do?"`);
  if (!report.header) problems.push(`no header line in italics under the title`);
  else {
    if (!/decides nothing/i.test(report.header)) problems.push(`the header line doesn't say that the report decides nothing`);
    if (!COMMIT.test(report.header) && !/\bno commit\b/i.test(report.header))
      problems.push(`the header line names no commit, as "at commit \`<hash>\`", or "with no commit" where the repository has none`);
    if (!/\bRead:/.test(report.header)) problems.push(`the header line has no "Read:", which names the files the read covered`);
    if (!/\bNot read:/.test(report.header)) problems.push(`the header line has no "Not read:", which names what the read left out, or "nothing"`);
  }
  const names = report.parts.map((part) => part.name);
  if (names.join('|') !== CODE_PARTS.join('|')) problems.push(`the parts are [${names.join(', ')}]; a report on the code has ${CODE_PARTS.join(', ')}, in that order`);
  const sections = partLines(report, 'Findings').map(({ text }) => /^###\s+(.+?)\s*$/.exec(text)?.[1]).filter(Boolean);
  if (sections.join('|') !== CODE_SECTIONS.join('|'))
    problems.push(`"Findings" has the sections [${sections.join(', ')}]; a report on the code has ${CODE_SECTIONS.join(', ')}, in that order`);
  problems.push(...markedProblems(report));
  const findings = findingsOf(report);
  problems.push(...findingProblems(findings));
  for (const finding of findings)
    if (finding.quotes === 0 && !/Confidence: inference\b/i.test(finding.own))
      problems.push(`line ${finding.index + 1}: F${finding.id} quotes no line of its file: the exact line goes under it, as > "<the line>" [n]`);

  const sources = codeSourcesOf(report);
  for (const index of sources.links) problems.push(`line ${index + 1}: a source of a report on the code is a path in backticks, such as \`src/app.js\`, not a link: a later task may move the file`);
  if (sources.size === 0 && sources.links.length === 0) problems.push(`"Sources" lists no "1. \`<path>\`" line`);
  for (const [number, source] of sources) {
    if (outsideProject(source.path)) problems.push(`line ${source.index + 1}: source ${number}, \`${source.path}\`, is outside the project: give its path from the project's folder`);
    else if (secretFile(source.path)) problems.push(`line ${source.index + 1}: source ${number}, \`${source.path}\`, is a secret file, which the read never opens or quotes`);
  }
  // A citation outside Sources, past the quoted code and the code spans, whose brackets cite nothing.
  const sourcesPart = report.partAt.Sources;
  report.lines.forEach((text, index) => {
    if (sourcesPart && index > sourcesPart.start && index < sourcesPart.end) return;
    const quote = QUOTE.exec(text);
    const cited = (quote ? `${quote[3]}${quote[6] ?? ''}` : text).replace(/(`+)(?:(?!\1).)+?\1/g, '');
    for (const m of cited.matchAll(CITATION)) if (!sources.has(Number(m[1]))) problems.push(`line ${index + 1}: cites [${m[1]}], which "Sources" doesn't list`);
  });
  for (const q of codeQuotesOf(report, sources)) if (!q.path) problems.push(`line ${q.index + 1}: a quote whose source names no path, as [n] for "n. \`<path>\`" in "Sources"`);
  return problems;
}

// A file's text at a commit, or null where git can't show it: no repository, no such commit, no such file.
export function gitShow(root, commit, path) {
  try {
    return execFileSync('git', ['-C', root, 'show', `${commit}:./${path}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true, maxBuffer: 4 * MAX_BYTES });
  } catch {
    return null;
  }
}

// Each quote against its file, at the commit the header names and as the file stands: found in either, it
// holds. Strict, a miss is a problem; else a note. The project's folder holds docs/research/, or the research folder
// under the one its AGENTS.md names (MTH-11).
function checkCode(file, report, { strict, show }) {
  const root = projectRootOf(file);
  const commit = COMMIT.exec(report.header ?? '')?.[1] ?? null;
  const sources = codeSourcesOf(report);
  const texts = new Map();
  const textOf = (path) => {
    if (!texts.has(path)) {
      let now = null;
      try {
        if (statSync(join(root, path)).isFile()) now = readFileSync(join(root, path), 'utf8');
      } catch {}
      texts.set(path, { atCommit: commit ? show(root, commit, path) : null, now });
    }
    return texts.get(path);
  };
  const result = { problems: [], notes: [], count: { found: 0, total: 0 } };
  const miss = (what) => (strict ? result.problems : result.notes).push(what);
  const readable = (path) => path && !outsideProject(path) && !secretFile(path);
  for (const source of sources.values()) {
    if (!readable(source.path)) continue;
    const { atCommit, now } = textOf(source.path);
    if (atCommit === null && now === null) miss(`line ${source.index + 1}: \`${source.path}\` is in neither the commit the header names nor the project's folder`);
  }
  for (const q of codeQuotesOf(report, sources)) {
    if (!readable(q.path)) continue;
    const { atCommit, now } = textOf(q.path);
    if (atCommit === null && now === null) continue;
    result.count.total++;
    if ([atCommit, now].some((text) => text !== null && findQuote(q.quote, text))) {
      result.count.found++;
      continue;
    }
    const closest = closestSentence(q.quote, now ?? atCommit);
    const where = commit && atCommit !== null ? `at commit ${commit}, nor as it stands` : 'as it stands';
    miss(
      `line ${q.index + 1}: "${q.quote.slice(0, 160)}" isn't in \`${q.path}\`, ${where}. ${closest ? `Its closest line: "${closest.slice(0, 300)}". Copy the line as the file has it, or correct the finding.` : 'The file has no line close to it: correct the finding from the file.'}`,
    );
  }
  return result;
}

// ---- The pages ----------------------------------------------------------------------------------

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', copy: '©', reg: '®', trade: '™', middot: '·', bull: '•', times: '×', laquo: '«', raquo: '»' };
const fromCode = (code) => (Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : ' ');
const decode = (text) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name) =>
    name[0] === '#' ? fromCode(name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10)) : (NAMED[name.toLowerCase()] ?? whole),
  );

// A page's text: no comments, scripts or styles; a line break for each block, and none inside one,
// so that a sentence the page's source wraps stays whole; no tags.
export function htmlToText(html) {
  return decode(
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1\s*>/gi, ' ')
      .replace(/\s+/g, ' ')
      .replace(/<(br|hr)\b[^>]*>|<\/(p|div|li|ul|ol|h[1-6]|tr|td|th|table|section|article|header|footer|pre|blockquote|dd|dt)\s*>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t\f\v ]+/g, ' ')
    .replace(/ *\n[\s]*/g, '\n')
    .trim();
}

// Text as the match reads it: one kind of quote mark and dash, no emphasis or code marks, one
// space, lowercase.
export function fold(text) {
  return text
    .normalize('NFKC')
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″«»]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/…/g, '...')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

// Whether the page holds the quote. A "…" in the quote stands for words left out, so its pieces
// must come in order. Where tags split a word on the page, the match also tries with no spaces.
export function findQuote(quote, pageText) {
  const page = fold(pageText);
  const bare = page.replace(/\s/g, '');
  const pieces = fold(quote)
    .split('...')
    .map((piece) => piece.replace(/^[\s.,;:!?'"()-]+|[\s.,;:!?'"()-]+$/g, ''))
    .filter(Boolean);
  if (pieces.length === 0) return false;
  const inOrder = (haystack, needles) => {
    let from = 0;
    for (const needle of needles) {
      const at = haystack.indexOf(needle, from);
      if (at < 0) return false;
      from = at + needle.length;
    }
    return true;
  };
  return inOrder(page, pieces) || inOrder(bare, pieces.map((piece) => piece.replace(/\s/g, '')));
}

// The page's sentence that shares the most words with the quote, or null below a third of them.
export function closestSentence(quote, pageText) {
  const words = new Set(fold(quote).match(/[a-z0-9]+/g) ?? []);
  if (words.size === 0) return null;
  let best = null;
  let bestScore = 0;
  for (const sentence of pageText.split(/(?<=[.!?])\s+|\n+/)) {
    const text = sentence.trim();
    if (text.length < 12 || text.length > 600) continue;
    const own = new Set(fold(text).match(/[a-z0-9]+/g) ?? []);
    let shared = 0;
    for (const word of words) if (own.has(word)) shared++;
    const score = shared / words.size;
    if (score > bestScore) {
      bestScore = score;
      best = text;
    }
  }
  return bestScore >= 1 / 3 ? best : null;
}

// The page's sentences that hold most of the words, as the page has them, best first: a quote
// copied from them is exact, where a fetch that summarises may change a number.
export function sentencesFor(words, pageText, max = 3) {
  const wanted = new Set(fold(words).match(/[a-z0-9]+/g) ?? []);
  if (wanted.size === 0) return [];
  const scored = [];
  for (const sentence of pageText.split(/(?<=[.!?])\s+|\n+/)) {
    const text = sentence.trim();
    if (text.length < 12 || text.length > 800) continue;
    const own = new Set(fold(text).match(/[a-z0-9]+/g) ?? []);
    let shared = 0;
    for (const word of wanted) if (own.has(word)) shared++;
    if (shared / wanted.size >= 0.5) scored.push({ text, score: shared / wanted.size });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, max).map((s) => s.text);
}

const PACE_MS = 1100;
const pause = (ms) => new Promise((done) => setTimeout(done, ms));

// The first `limit` bytes of a response, read as they come: past that the rest is never downloaded.
// Reading the whole body first would load a huge page, or a small one that unpacks to gigabytes,
// into memory before the cap could cut it.
async function readCapped(response, limit) {
  const reader = response.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  const chunks = [];
  let size = 0;
  try {
    while (size < limit) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      size += value.length;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return Buffer.concat(chunks).subarray(0, limit);
}

// One page as text, or why it couldn't be read. A site that says it is busy, with a 429 or a 503,
// is asked once more after a pause.
export async function fetchText(url, tries = 2) {
  try {
    const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': USER_AGENT, accept: 'text/html,text/plain;q=0.9,*/*;q=0.5' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if ((response.status === 429 || response.status === 503) && tries > 1) {
      await pause(5000);
      return fetchText(url, tries - 1);
    }
    if (!response.ok) return { error: `HTTP ${response.status}` };
    const type = response.headers.get('content-type') ?? '';
    if (/pdf/i.test(type)) return { error: 'a PDF' };
    const body = (await readCapped(response, MAX_BYTES)).toString('utf8');
    const text = /html|xml/i.test(type) || /^\s*</.test(body) ? htmlToText(body) : body;
    if (text.length < 200) return { error: 'too little text, as on a page that scripts build' };
    return { text };
  } catch (e) {
    return { error: e?.name === 'TimeoutError' ? 'timed out' : String(e?.cause?.code ?? e?.message ?? e) };
  }
}

// ---- Git and the index --------------------------------------------------------------------------

// The report's text in git's last commit, or null.
export function committedText(file) {
  try {
    return execFileSync('git', ['-C', dirname(file), 'show', `HEAD:./${basename(file)}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true });
  } catch {
    return null;
  }
}

// Whether the folder's index lists the report: then it is final, and append-only.
export function isIndexed(file) {
  const index = join(dirname(file), 'README.md');
  return existsSync(index) && readFileSync(index, 'utf8').includes(basename(file));
}

// Whether the index in git's last commit listed the report: only then was the committed text final.
// A draft can be committed and changed before its yes (RES-1's 06).
export function wasIndexed(file) {
  const index = committedText(join(dirname(file), 'README.md'));
  return index !== null && index.includes(basename(file));
}

// ---- One report -------------------------------------------------------------------------------

const lf = (text) => text.replace(/\r\n/g, '\n');
const pad = (n) => String(n).padStart(2, '0');
// Today, in local time, as the reports' dates are written.
const localDate = (now = new Date()) => `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

// Checks one report. Returns its problems, its quotes with what was found, and its new text when
// the marks changed it.
// readCode: false checks a code report's shape alone, as for a layer of the sample, which holds no code.
export async function checkReport(file, { offline = false, fetchPage = fetchText, committed = committedText, indexed = isIndexed, finalBefore = wasIndexed, gitShow: show = gitShow, readCode = true, today = localDate(), pages = new Map() } = {}) {
  const text = readFileSync(file, 'utf8');
  const report = parse(text);
  const code = isCode(file);
  const problems = shapeProblems(report, { folder: dirname(resolve(file)), offline, code });
  const final = indexed(file);
  const finalInGit = final && finalBefore(file);
  const before = finalInGit ? committed(file) : null;
  // Where marks may go: all of a draft; in an indexed report, only what follows its committed
  // text, or its notes when git has none.
  let from = 0;
  if (final) {
    if (before !== null) {
      const old = lf(before).replace(/\s+$/, '');
      if (!lf(text).startsWith(old)) problems.push(`it changed above its end since git's last commit: an indexed report is append-only, so a later finding goes in "Notes"`);
      from = old.split('\n').length;
    } else from = report.partAt.Notes ? report.partAt.Notes.start : report.lines.length;
  }
  if (code) {
    if (!readCode) return { problems, notes: [], quotes: [], text: null };
    const checked = checkCode(file, report, { strict: !finalInGit, show });
    return { problems: [...problems, ...checked.problems], notes: checked.notes, quotes: [], code: checked.count, text: null };
  }
  const quotes = quotesOf(report, sourcesOf(report)).filter((q) => q.index >= from);
  if (offline || isComparison(report)) return { problems, quotes, text: null };

  // One site's pages one after another, a second apart, since sites such as Open Library allow
  // one request a second; different sites at once (RES-1's main path at xhigh reached 34 of 70).
  const bySite = new Map();
  for (const url of new Set(quotes.map((q) => q.url).filter((url) => url && !pages.has(url)))) {
    const site = (() => {
      try {
        return new URL(url).host;
      } catch {
        return url;
      }
    })();
    bySite.set(site, [...(bySite.get(site) ?? []), url]);
  }
  await Promise.all(
    [...bySite.values()].map(async (urls) => {
      for (const [k, url] of urls.entries()) {
        if (k > 0) await pause(PACE_MS);
        pages.set(url, await fetchPage(url));
      }
    }),
  );
  const lines = [...report.lines];
  const count = { found: 0, missing: 0, unreached: 0 };
  for (const q of quotes) {
    const page = q.url ? pages.get(q.url) : { error: 'no link' };
    q.status = page?.text === undefined ? 'unreached' : findQuote(q.quote, page.text) ? 'found' : 'missing';
    q.why = page?.error;
    if (q.status === 'missing') q.closest = closestSentence(q.quote, page.text);
    count[q.status]++;
    const tail = q.tail.replace(OLD_MARK, '');
    lines[q.index] = `${q.prefix}"${q.quote}" ${q.citation}${q.status === 'found' ? '' : ` (${MARKS[q.status]})`}${tail}`;
  }
  if (!final && report.headerLine >= 0) {
    const total = quotes.length;
    const rest = [count.missing && `${count.missing} not on the page`, count.unreached && `${count.unreached} not reached`].filter(Boolean).join(', ');
    const summary = total === 0 ? 'none' : `${count.found} of ${total} found on their pages on ${today}${rest ? `; ${rest}` : ''}`;
    lines[report.headerLine] = lines[report.headerLine].replace(/Quotes:[^*]*(\*\s*)$/, (whole, end) => `Quotes: ${summary}.${end}`);
  }
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const next = lines.join(eol);
  return { problems, quotes, count, text: next !== text ? next : null };
}

// ---- The command ----------------------------------------------------------------------------------

const TEXT_CHARS = 20000;

async function main(argv) {
  // A page's own words, with no summary between: the sentences for a quote, or its text.
  if (argv[0] === '--quote' || argv[0] === '--text') {
    const [mode, url, ...words] = argv;
    if (!url) {
      console.log('Usage: node check-report.mjs --quote <url> <words …> | --text <url> [<words …>]');
      return 1;
    }
    const page = await fetchText(url);
    if (page.error) {
      console.log(`${url} wasn't reached (${page.error}).`);
      return 1;
    }
    if (mode === '--quote') {
      const found = sentencesFor(words.join(' '), page.text);
      console.log(found.length ? found.map((s) => `"${s}"`).join('\n') : `No sentence on ${url} holds most of these words.`);
      return 0;
    }
    const from = words.length ? Math.max(0, page.text.indexOf(sentencesFor(words.join(' '), page.text, 1)[0] ?? '\0')) : 0;
    const text = page.text.slice(from, from + TEXT_CHARS);
    console.log(text);
    if (page.text.length > from + TEXT_CHARS) console.log(`(cut at ${TEXT_CHARS} characters, of ${page.text.length}: give words to start further on)`);
    return 0;
  }
  const offline = argv.includes('--offline');
  const files = argv.filter((arg) => !arg.startsWith('--'));
  if (files.length === 0) {
    console.log('Usage: node check-report.mjs <report.md> [<report.md> …] [--offline]');
    console.log('       node check-report.mjs --quote <url> <words …> | --text <url> [<words …>]');
    return 1;
  }
  let failed = 0;
  const pages = new Map();
  for (const file of files) {
    if (!existsSync(file)) {
      console.log(`${file}: no such file`);
      failed++;
      continue;
    }
    const result = await checkReport(file, { offline, pages });
    if (result.text !== null) writeFileSync(file, result.text);
    const counts = result.code
      ? ` Quotes: ${result.code.found} of ${result.code.total} found in their files.`
      : result.count
        ? ` Quotes: ${result.count.found} found, ${result.count.missing} not on the page, ${result.count.unreached} not reached.`
        : '';
    console.log(`${file}: ${result.problems.length === 0 ? 'the shape holds.' : `${result.problems.length} problem${result.problems.length > 1 ? 's' : ''}.`}${counts}`);
    for (const problem of result.problems) console.log(`  - ${problem}`);
    for (const note of result.notes ?? []) console.log(`  - note: ${note}`);
    for (const q of result.quotes.filter((q) => q.status === 'missing')) {
      console.log(`  - line ${q.index + 1}: not on ${q.url}: "${q.quote.slice(0, 160)}"`);
      console.log(q.closest ? `    The page's closest sentence: "${q.closest.slice(0, 300)}". If it says the same, copy it as the quote; if not, correct the finding, or keep the mark.` : `    The page has no sentence close to it: correct the finding from the page, or keep the mark.`);
    }
    for (const q of result.quotes.filter((q) => q.status === 'unreached')) console.log(`  - line ${q.index + 1}: ${q.url ?? 'no link'} wasn't reached (${q.why}): the mark stays unless another source holds the sentence.`);
    if (result.problems.length > 0) failed++;
  }
  return failed > 0 ? 1 : 0;
}

// Whether node started this file. A symlink or a junction in its path makes process.argv[1] differ
// from import.meta.url, which node resolves to the real path: the script would then do nothing, and
// exit 0, as if every report passed.
function startedHere() {
  try {
    return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (startedHere())
  main(process.argv.slice(2)).then(
    (code) => (process.exitCode = code),
    (e) => {
      console.error(`error  ${e.message}`);
      process.exitCode = 1;
    },
  );
