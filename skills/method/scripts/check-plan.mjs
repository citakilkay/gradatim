// Checks a Gradatim project's plan, as the concept step writes it (../../write-concept/SKILL.md): the
// concept, the MVP, the roadmap, the phases and the overview, with the lines that other steps read in
// ../references/documents.md. The concept step runs it, and close sprint once it has marked the stories a
// sprint delivered (SPR-2), so it lives in the method's scripts/, as writing rule 8 says.
// - every story in the MVP and the phases has its line (a status, an estimate in quarter dev-days,
//   its dependencies and its decisions), or is a moved story's pointer to its whole story, and a
//   story that sits outside the milestone its id names left such a pointer there;
// - each id has one whole story, and no dependency is unknown, dropped, later or circular;
// - each decision named holds, and no proposal of the step sits in the MVP;
// - each document's opening line names the decisions it rests on, or the idea alone;
// - the roadmap has one row per milestone, each the sum of its stories, a plan line that says their total
//   (REV-1), and its lists name each planned story once, after the stories it depends on, and no id that has
//   no whole story;
// - the idea moved word for word, and AGENTS.md no longer holds it once it links the concept;
// - the overview is one file, with one bar per milestone and that milestone's dev-days;
// - a story the code already meets is `existing` (MTH-8): its estimate is —, it adds nothing to a sum, its
//   `Exists:` line cites the findings that show it in a report on the code that the research index lists, as
//   an "Exists in part:" line of a planned story does, it is in no list of the roadmap, and the roadmap's
//   Progress opens with a line that names it.
// It writes nothing and reads no network.
//
// Usage, from the project's folder or anywhere:
//   node <the method skill's folder>/scripts/check-plan.mjs [<project folder>] [--offline]
// The folder is the current one by default. --offline changes nothing. Exit code 1 when a fault is found.

import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cellText, docsFolder, linkTarget, mapRows, projectFiles, relativeLinks, slugify, tablesIn, unfencedLines } from './check-docs.mjs';

const STORY_ID = /(?<![\w./-])(M\d+|P\d+\.\d+)(?![./-]?\w)/g;
const DECISION_ID = /(?<![\w./-])D(\d+)(?![./-]?\w)/g;
const STATUSES = ['planned', 'existing', 'delivered', 'dropped'];
const NO_DECISION = /^none,\s*(from the idea|proposed|the user['’]s word|from the code)\b/i;
const FINDING = /(?<![\w.])(\d{2,}) F(\d+)\b/g;
const EXISTS = /^\s*Exists( in part)?:\s*(.*)$/i;
const NO_DEPENDENCY = /^(—|–|-|none)\.?$/i;

const ids = (text, pattern) => [...text.matchAll(pattern)].map((m) => (pattern === DECISION_ID ? `D${m[1]}` : m[1]));
const near = (a, b) => Math.abs(a - b) < 1e-9;
const firstNumber = (text) => Number(/(\d+(?:\.\d+)?)/.exec(text)?.[1] ?? NaN);
// A link's #fragment as a heading's anchor reads, as check-docs decodes it.
const decoded = (fragment) => {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
};

// Each heading of a Markdown text: its level, its title, its anchor as GitHub makes it, the first
// line of text under it, and its body as [line number, line] pairs.
function headingsOf(text) {
  const headings = [];
  const seen = new Map();
  let open = null;
  for (const [line, raw] of unfencedLines(text)) {
    const h = /^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/.exec(raw);
    if (h) {
      const base = slugify(h[2]);
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      open = { level: h[1].length, title: h[2], line, anchor: n === 0 ? base : `${base}-${n}`, first: null, firstLine: line, body: [] };
      headings.push(open);
      continue;
    }
    if (!open) continue;
    open.body.push([line, raw]);
    if (open.first === null && raw.trim()) {
      open.first = raw.trim();
      open.firstLine = line;
    }
  }
  return headings;
}

// The text of a section, its lines joined with single spaces.
const sectionText = (heading) => heading.body.map(([, raw]) => raw).join(' ').replace(/\s+/g, ' ').trim();

// A story's line: its fields, split on " · ".
function storyLine(line) {
  const fields = new Map();
  for (const part of line.split(/\s+·\s+/)) {
    const m = /^([A-Za-z][A-Za-z ]*?):\s*(.*)$/.exec(part.trim());
    if (m) fields.set(m[1].toLowerCase(), m[2].trim());
  }
  return fields;
}

// The document's opening line: the first line of text under its title.
function openingLine(text) {
  const title = headingsOf(text).find((h) => h.level === 1);
  return title ? { line: title.firstLine, text: title.first ?? '' } : { line: 1, text: '' };
}

export function checkPlan(dir) {
  const root = resolve(dir);
  // Every path is under the folder AGENTS.md names for Gradatim's documents, docs by default (MTH-11).
  const folder = docsFolder(root);
  const rows = mapRows(undefined, folder);
  const pathOf = (name) => rows.find((row) => row.document === name)?.path;
  const pattern = (name) => rows.find((row) => row.document === name)?.pattern ?? /$^/;
  const files = projectFiles(root, folder);
  const read = (file) => readFileSync(join(root, file), 'utf8');
  const result = { faults: [], counts: { stories: 0, dependencies: 0, milestones: 0, documents: 0 } };
  const fault = (path, line, kind, what) => result.faults.push({ path, line, kind, what });

  const concept = files.find((f) => pattern('Concept').test(f));
  const mvp = files.find((f) => pattern('MVP').test(f));
  const roadmap = files.find((f) => pattern('Roadmap').test(f));
  const phases = files
    .map((f) => ({ file: f, k: Number(pattern('Phase').exec(f)?.[1]) }))
    .filter((p) => Number.isInteger(p.k))
    .sort((a, b) => a.k - b.k);
  const overviews = files.filter((f) => pattern('Overview').test(f));
  const index = files.find((f) => pattern('Decisions index').test(f));
  // The reports on the code that the research index lists, each with its findings' ids (MTH-8). While AGENTS.md links
  // no concept, the plan is a draft, and so may be the report, which the quick start's yes indexes with it (MTH-11).
  const researchIndex = files.find((f) => pattern('Research index').test(f));
  const listedReports = researchIndex ? read(researchIndex) : '';
  const agentsText = files.includes('AGENTS.md') ? read('AGENTS.md') : '';
  const planFinal = Boolean(concept) && [...relativeLinks(agentsText)].some(({ path }) => path && relative(root, linkTarget(root, join(root, 'AGENTS.md'), path)).split(sep).join('/') === concept);
  const codeFindings = new Map();
  for (const f of files) {
    const nn = /(?:^|\/)(\d{2,})-the-code\.md$/.exec(f)?.[1];
    if (nn && pattern('Research report').test(f) && (!planFinal || listedReports.includes(f.split('/').pop())))
      codeFindings.set(nn, new Set([...read(f).matchAll(/^- \*\*F(\d+)\.\*\*/gm)].map((m) => Number(m[1]))));
  }

  for (const [file, name] of [[concept, `the concept, ${pathOf('Concept')}`], [mvp, `the MVP, ${pathOf('MVP')}`], [roadmap, `the roadmap, ${pathOf('Roadmap')}`]])
    if (!file) fault(folder, 1, 'missing document', `${name}, which the concept step writes`);

  // The decisions that hold: the index's rows whose Status says "holds".
  const holds = new Set();
  if (index)
    for (const table of tablesIn(read(index))) {
      const status = table.header.indexOf('Status');
      if (status < 0) continue;
      for (const { cells } of table.rows)
        if (/^D\d+$/.test(cellText(cells[0] ?? '')) && /^holds\b/i.test(cellText(cells[status] ?? ''))) holds.add(cellText(cells[0]));
    }
  const decisionFaults = (file, line, text) => {
    for (const id of ids(text, DECISION_ID))
      if (!holds.has(id)) fault(file, line, 'decision', `${id} doesn't hold in the decisions index`);
  };

  // The stories: whole ones, and the pointers that moved ones leave.
  const plans = [...(mvp ? [{ file: mvp, k: 0 }] : []), ...phases];
  const milestone = (k) => (k === 0 ? 'the MVP' : `phase ${k}`);
  const whole = new Map();
  const pointers = [];
  for (const { file, k } of plans) {
    for (const h of headingsOf(read(file))) {
      const id = /^(M\d+|P\d+\.\d+)\b/.exec(h.title)?.[1];
      if (!id) continue;
      const first = h.first ?? '';
      if (/^moved to\b/i.test(first)) {
        pointers.push({ id, file, line: h.firstLine, links: [...relativeLinks(first)] });
        continue;
      }
      if (!/^status:/i.test(first)) {
        fault(file, h.line, 'no story line', `${id} has no line "Status: … · Estimate: … · Depends on: … · Decisions: …" under its heading`);
        continue;
      }
      result.counts.stories++;
      const fields = storyLine(first);
      const story = { id, file, k, line: h.firstLine, anchor: h.anchor, deps: [], decisions: fields.get('decisions') ?? '' };
      story.status = (fields.get('status') ?? '').replace(/[`*]/g, '').replace(/[.,;]$/, '').trim();
      if (!STATUSES.includes(story.status)) fault(file, story.line, 'story line', `${id}'s status "${story.status}" is none of ${STATUSES.join(', ')}`);
      const estimate = /^(?:about\s+)?(\d+(?:\.\d+)?)\s*(?:senior\s+)?dev-days?\b/i.exec(fields.get('estimate') ?? '');
      story.estimate = estimate ? Number(estimate[1]) : NaN;
      // A story the code already meets adds nothing: the plan's days are the work left (MTH-8).
      if (story.status === 'existing') {
        story.estimate = 0;
        if (!NO_DEPENDENCY.test((fields.get('estimate') ?? '').replace(/`/g, '')))
          fault(file, story.line, 'story line', `${id} is \`existing\`, so its estimate is —: the code meets it already, and it adds nothing to a sum`);
      } else if (!estimate) fault(file, story.line, 'story line', `${id} has no estimate in dev-days`);
      else if (!(story.estimate > 0) || !near(story.estimate * 4, Math.round(story.estimate * 4)))
        fault(file, story.line, 'story line', `${id}'s estimate, ${estimate[1]} dev-days, isn't above 0 in quarter-day steps`);
      const depends = (fields.get('depends on') ?? '').replace(/`/g, '');
      if (!fields.has('depends on')) fault(file, story.line, 'story line', `${id} has no "Depends on"`);
      else if (!NO_DEPENDENCY.test(depends)) {
        story.deps = ids(depends, STORY_ID);
        if (story.deps.length === 0) fault(file, story.line, 'story line', `${id}'s "Depends on" names no story id, and isn't —`);
      }
      if (!fields.has('decisions')) fault(file, story.line, 'story line', `${id} has no "Decisions"`);
      else if (ids(story.decisions, DECISION_ID).length === 0 && !NO_DECISION.test(story.decisions))
        fault(file, story.line, 'story line', `${id}'s "Decisions" names no D id, and isn't "none, from the idea", "none, proposed", "none, the user's word" or "none, from the code"`);
      // What the code already holds (MTH-8): the `Exists:` line of an existing story, and the "Exists in part:" line
      // of one the code meets in part, each citing findings of a report on the code that the research index lists.
      const exists = h.body.map(([line, raw]) => ({ line, m: EXISTS.exec(raw) })).filter(({ m }) => m);
      if (story.status === 'existing' && !exists.some(({ m }) => !m[1]))
        fault(file, story.line, 'exists', `${id} is \`existing\`, and has no "Exists:" line under its text that cites the findings showing it, as "Exists: 01 F2."`);
      for (const { line, m } of exists) {
        const label = m[1] ? 'Exists in part' : 'Exists';
        const cited = [...m[2].matchAll(FINDING)];
        if (cited.length === 0) fault(file, line, 'exists', `${id}'s "${label}:" line cites no finding of the report on the code, as "01 F2"`);
        for (const [, nn, k] of cited) {
          if (!codeFindings.has(nn)) fault(file, line, 'exists', `${id}'s "${label}:" line cites ${nn} F${k}, and the research index lists no report on the code ${nn}-the-code.md`);
          else if (!codeFindings.get(nn).has(Number(k))) fault(file, line, 'exists', `${id}'s "${label}:" line cites ${nn} F${k}, which ${nn}-the-code.md doesn't hold`);
        }
      }
      if (whole.has(id)) fault(file, h.line, 'two whole stories', `${id} is whole here and in ${whole.get(id).file}: a moved story leaves only a pointer`);
      else whole.set(id, story);
    }
  }

  // A pointer links its story's whole heading, in the plan.
  for (const { id, file, line, links } of pointers) {
    const story = whole.get(id);
    const link = links.find(({ path }) => path !== '');
    if (!link) fault(file, line, 'pointer', `${id}'s pointer links no file`);
    else {
      const target = relative(root, linkTarget(root, join(root, file), link.path)).split(sep).join('/');
      if (!story) fault(file, line, 'pointer', `${id}'s pointer leads to no whole story of ${id}`);
      else if (target !== story.file) fault(file, line, 'pointer', `${id}'s pointer links ${target}, but its whole story is in ${story.file}`);
      else if (link.fragment && decoded(link.fragment) !== story.anchor) fault(file, line, 'pointer', `${id}'s pointer links #${link.fragment}, but its whole story's heading is #${story.anchor}`);
    }
  }

  // A story's id says where it was given: M in the MVP, P<k> in phase k. One that sits elsewhere
  // moved, so its first file keeps its heading, with a pointer.
  const fileOf = new Map(plans.map((p) => [p.k, p.file]));
  for (const story of whole.values()) {
    const origin = story.id.startsWith('M') ? 0 : Number(/^P(\d+)\./.exec(story.id)[1]);
    if (origin === story.k) continue;
    const first = fileOf.get(origin);
    if (!pointers.some((p) => p.id === story.id && p.file === first))
      fault(first ?? story.file, first ? 1 : story.line, 'pointer', `${story.id} sits in ${milestone(story.k)}, so it moved from ${milestone(origin)}, whose file keeps no heading for it with a line that links its new place`);
  }

  // Dependencies, decisions and proposals.
  for (const story of whole.values()) {
    if (story.status === 'dropped') continue;
    for (const dep of story.deps) {
      result.counts.dependencies++;
      const on = whole.get(dep);
      if (dep === story.id) fault(story.file, story.line, 'dependency', `${story.id} depends on itself`);
      else if (!on) fault(story.file, story.line, 'dependency', `${story.id} depends on ${dep}, which has no whole story`);
      else if (on.status === 'dropped') fault(story.file, story.line, 'dependency', `${story.id} depends on ${dep}, which is dropped`);
      else if (on.k > story.k) fault(story.file, story.line, 'dependency', `${story.id}, in ${milestone(story.k)}, depends on ${dep}, in ${milestone(on.k)}, which comes later`);
    }
    if (story.status === 'planned') decisionFaults(story.file, story.line, story.decisions);
    if (story.k === 0 && story.status === 'planned' && /^none,\s*proposed\b/i.test(story.decisions))
      fault(story.file, story.line, 'proposal in the MVP', `${story.id} is the step's own proposal: it goes in a phase, unless the user asks for it`);
  }
  const state = new Map();
  const visit = (id, path) => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'open') {
      const story = whole.get(id);
      fault(story.file, story.line, 'dependency', `a cycle: ${[...path.slice(path.indexOf(id)), id].join(' → ')}`);
      return;
    }
    state.set(id, 'open');
    for (const dep of whole.get(id).deps) if (whole.has(dep) && whole.get(dep).status !== 'dropped' && dep !== id) visit(dep, [...path, id]);
    state.set(id, 'done');
  };
  for (const [id, story] of whole) if (story.status !== 'dropped') visit(id, []);

  // Each document's opening line names the decisions it rests on, or the idea alone.
  for (const file of [concept, mvp, roadmap, ...phases.map((p) => p.file)].filter(Boolean)) {
    result.counts.documents++;
    const opening = openingLine(read(file));
    if (ids(opening.text, DECISION_ID).length === 0 && !/\bidea alone\b/i.test(opening.text))
      fault(file, opening.line, 'opening line', 'it names neither the decisions it rests on nor the idea alone');
    else decisionFaults(file, opening.line, opening.text);
  }

  // The roadmap: its rows, their sums, and its lists.
  const rowsShown = [];
  if (roadmap) {
    const text = read(roadmap);
    const table = tablesIn(text).find((t) => t.header.includes('Milestone') && t.header.includes('Estimate'));
    const wanted = plans.map((p) => p.k);
    if (!table) fault(roadmap, 1, 'roadmap', 'it has no table with Milestone and Estimate columns');
    else {
      const at = table.header.indexOf('Estimate');
      for (const { line, cells } of table.rows) {
        const name = cellText(cells[0] ?? '');
        const k = /\bMVP\b/i.test(name) ? 0 : Number(/\bphase\s+(\d+)\b/i.exec(name)?.[1] ?? NaN);
        rowsShown.push({ k, line, estimate: firstNumber(cellText(cells[at] ?? '')) });
      }
      const shown = rowsShown.map((r) => r.k);
      result.counts.milestones = shown.length;
      if (shown.join() !== wanted.join())
        fault(roadmap, table.line, 'roadmap', `its rows are ${shown.map((k) => (Number.isNaN(k) ? '?' : milestone(k))).join(', ') || 'none'}, but the plan has ${wanted.map(milestone).join(', ') || 'no MVP'}`);
      for (const row of rowsShown) {
        if (Number.isNaN(row.k)) continue;
        const sum = [...whole.values()].filter((s) => s.k === row.k && s.status !== 'dropped').reduce((n, s) => n + (Number.isNaN(s.estimate) ? 0 : s.estimate), 0);
        if (!near(row.estimate, sum)) fault(roadmap, row.line, 'roadmap', `${milestone(row.k)} shows ${Number.isNaN(row.estimate) ? 'no number' : row.estimate} dev-days, but its stories add up to ${sum}`);
      }
      // The plan's line, where the roadmap has one, says what the rows should add up to: every milestone's
      // stories that aren't dropped. A review's pick changes it too (REV-1).
      const total = [...unfencedLines(text)].find(([, raw]) => /^\s*\*\*The plan:\*\*/.test(raw));
      if (total) {
        const said = /\babout\s+(\d+(?:\.\d+)?)\s+dev-days\b/i.exec(total[1])?.[1];
        const sum = [...whole.values()].filter((s) => wanted.includes(s.k) && s.status !== 'dropped').reduce((n, s) => n + (Number.isNaN(s.estimate) ? 0 : s.estimate), 0);
        if (said === undefined || !near(Number(said), sum))
          fault(roadmap, total[0], 'roadmap', `"**The plan:**" says ${said === undefined ? 'no "about <n> dev-days"' : `about ${said} dev-days`}, but its milestones' stories add up to ${sum}`);
      }
    }
    // Its lists, under "## The MVP" and "## Phase <k>": each planned story once, in its milestone's
    // list, after the planned stories it depends on.
    const order = [];
    for (const h of headingsOf(text).filter((x) => x.level === 2)) {
      const k = /\bMVP\b/i.test(h.title) ? 0 : Number(/^phase\s+(\d+)\b/i.exec(h.title)?.[1] ?? NaN);
      if (Number.isNaN(k)) continue;
      for (const [line, raw] of h.body) {
        const item = /^\s*\d+[.)]\s+(.*)$/.exec(raw)?.[1];
        const id = item && ids(item, STORY_ID)[0];
        if (id) order.push({ id, k, line });
      }
    }
    const position = new Map();
    order.forEach(({ id, line }, i) => {
      if (!whole.has(id)) fault(roadmap, line, 'roadmap', `its lists name ${id}, which has no whole story in the MVP or a phase`);
      else if (whole.get(id).status === 'existing') fault(roadmap, line, 'roadmap', `its lists name ${id}, which is \`existing\`: they hold the stories left to build, which new sprint takes`);
      if (position.has(id)) fault(roadmap, line, 'roadmap', `its lists name ${id} more than once`);
      else position.set(id, i);
    });
    // Its Progress opens with a line that names each existing story, above close sprint's lines (MTH-8).
    const existing = [...whole.values()].filter((s) => s.status === 'existing').map((s) => s.id);
    if (existing.length > 0) {
      const progress = headingsOf(text).find((h) => h.level === 2 && /^progress$/i.test(h.title.trim()));
      const named = ids(progress?.first ?? '', STORY_ID);
      const missing = existing.filter((id) => !named.includes(id));
      if (!progress) fault(roadmap, 1, 'roadmap', `it has no "## Progress", whose first line names each existing story`);
      else if (missing.length > 0)
        fault(roadmap, progress.firstLine, 'roadmap', `its Progress opens with "${progress.first ?? ''}", which doesn't name ${missing.join(', ')}: a line that names each existing story comes first, as "M1 exists already, from the code."`);
    }
    for (const story of whole.values()) {
      if (story.status !== 'planned') continue;
      const listed = order.find((o) => o.id === story.id);
      if (!listed) fault(roadmap, 1, 'roadmap', `its lists don't name ${story.id}, a planned story of ${milestone(story.k)}`);
      else if (listed.k !== story.k) fault(roadmap, listed.line, 'roadmap', `it lists ${story.id} under ${milestone(listed.k)}, but its story is in ${milestone(story.k)}`);
      else
        for (const dep of story.deps)
          if (whole.get(dep)?.status === 'planned' && position.has(dep) && position.get(dep) > position.get(story.id))
            fault(roadmap, listed.line, 'roadmap', `it lists ${story.id} before ${dep}, which ${story.id} depends on`);
    }
  }

  // The idea: moved word for word, and out of AGENTS.md once AGENTS.md links the concept.
  if (concept) {
    const own = headingsOf(read(concept)).find((h) => /^the idea$/i.test(h.title.trim()));
    if (!own) fault(concept, 1, 'missing part', 'it has no "## The idea"');
    if (files.includes('AGENTS.md')) {
      const agents = read('AGENTS.md');
      const linksConcept = [...relativeLinks(agents)].some(({ path }) => path && relative(root, linkTarget(root, join(root, 'AGENTS.md'), path)).split(sep).join('/') === concept);
      const idea = headingsOf(agents).find((h) => /^the idea$/i.test(h.title.trim()));
      if (idea && linksConcept) fault('AGENTS.md', idea.line, 'idea not moved', 'it links the concept, and still holds "### The idea": the yes moves it out');
      else if (idea && own && sectionText(idea) !== sectionText(own))
        fault(concept, own.line, 'idea changed', "its \"## The idea\" isn't AGENTS.md's \"### The idea\" word for word");
    }
  }

  // The overview: one file, with one bar per roadmap row and that row's dev-days.
  if (overviews.length > 1) fault(overviews[1], 1, 'overview', `${overviews.join(' and ')}: the concept step makes the overview again in place, under its number`);
  if (overviews.length >= 1 && roadmap) {
    const page = read(overviews[0]);
    const timeline = /<ol\b[^>]*class="[^"]*\btimeline\b[^"]*"[^>]*>([\s\S]*?)<\/ol>/i.exec(page)?.[1];
    if (!timeline) fault(overviews[0], 1, 'overview', 'it has no milestone timeline, <ol class="timeline">');
    else {
      const bars = [...timeline.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map(([, li]) =>
        firstNumber((/class="est"[^>]*>([\s\S]*?)<\/span>/i.exec(li)?.[1] ?? '').replace(/<[^>]+>/g, '')),
      );
      if (bars.length !== rowsShown.length) fault(overviews[0], 1, 'overview', `its timeline has ${bars.length} bars, and the roadmap ${rowsShown.length} milestones`);
      else
        bars.forEach((n, i) => {
          if (!near(n, rowsShown[i].estimate)) fault(overviews[0], 1, 'overview', `bar ${i + 1} shows ${Number.isNaN(n) ? 'no number' : n} dev-days, and the roadmap's row ${rowsShown[i].estimate}`);
        });
    }
  }
  return result;
}

export function formatPlan(result) {
  const lines = result.faults.map(({ path, line, kind, what }) => `${path}:${line}  ${kind}  ${what}`);
  const { stories, dependencies, milestones, documents } = result.counts;
  lines.push(`checked ${stories} stories, ${dependencies} dependencies and ${milestones} milestones in ${documents} documents: ${result.faults.length} faults`);
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
    const result = checkPlan(dir);
    for (const line of formatPlan(result)) console.log(line);
    process.exitCode = result.faults.length > 0 ? 1 : 0;
  }
}
