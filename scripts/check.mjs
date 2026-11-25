// Checks the plugin: the manifests agree and follow their formats, each skill's frontmatter is
// valid, every relative Markdown link resolves, the skills name capabilities rather than a host's
// tools and each host map lists every capability, the skills name no model and each hand-off names its
// kind, which Claude Code's map gives a model (MTH-7), each document in the method's map has one step
// that creates it, each skill follows the contract's shape, each skill's guide and the README's table of
// the cycle are what `npm run guides` writes now, with no guide linking a planning doc (REL-1), each
// sample project's states are whole, no text file names a folder on someone's machine, the OpenCode entry registers
// the skills, and Claude Code's own validator passes where `claude` is installed. Where the scenario runner,
// scripts/scenario.mjs, is in the tree, each skill's scenarios and the run log are checked too.
//
// Usage, from anywhere in the repository:
//   npm run check
// Exit code 1 when anything fails. Warnings don't fail.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { HOST_READ_NAMES, parseSample } from './sample.mjs';
import { linkPattern, linkTarget, relativeLinks, targetFault, unfencedLines, withoutCodeSpans } from '../skills/method/scripts/check-docs.mjs';
import { handOffProblems, kindsIn, mapModelProblems, mapModels, modelWordsIn } from './models.mjs';
import { parseFrontmatter } from './frontmatter.mjs';
import { GUIDES_DIR, guideProblems } from './guides.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const error = (where, what) => errors.push(`${where}  ${what}`);
const warn = (where, what) => warnings.push(`${where}  ${what}`);
const shown = (file) => relative(root, file).split(sep).join('/');
const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

// The files git sees: tracked ones that still exist, and untracked ones it doesn't ignore.
const files = execFileSync('git', ['ls-files', '-z', '-co', '--exclude-standard'], { cwd: root, encoding: 'utf8' })
  .split('\0')
  .filter((file) => file && existsSync(join(root, file)));

// ---- Manifests ------------------------------------------------------------------------------

// The Agent Plugins 1.0 schema, as read on 2026-10-28: a closed set of top-level keys, and a
// pattern for the name.
const AGENT_PLUGINS_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
const AGENT_PLUGINS_KEYS = ['$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions'];
const AGENT_PLUGINS_NAME = /^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function readJson(path) {
  const file = join(root, path);
  if (!existsSync(file)) {
    error(path, `missing`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    error(path, `not valid JSON: ${e.message}`);
    return null;
  }
}

const pkg = readJson('package.json') ?? {};
const agentPlugin = readJson('plugin.json');
const claudePlugin = readJson('.claude-plugin/plugin.json');
const claudeMarket = readJson('.claude-plugin/marketplace.json');
const codexMarket = readJson('.agents/plugins/marketplace.json');
const { name, version } = pkg;

if (!KEBAB.test(name ?? '') || name.length > 64)
  error('package.json', `name "${name}" isn't 1 to 64 lowercase letters, digits and single hyphens`);
if (!SEMVER.test(version ?? '')) error('package.json', `version "${version}" isn't a semantic version`);

// One name, one version, one license and one description, in every manifest that has the keys.
for (const [path, manifest] of [['plugin.json', agentPlugin], ['.claude-plugin/plugin.json', claudePlugin]]) {
  if (!manifest) continue;
  if (manifest.name !== name) error(path, `name "${manifest.name}" differs from package.json's "${name}"`);
  if (manifest.version !== version) error(path, `version "${manifest.version}" differs from package.json's "${version}"`);
  if (manifest.description !== pkg.description) warn(path, `the description differs from package.json's`);
}
for (const [path, manifest] of [['package.json', pkg], ['plugin.json', agentPlugin], ['.claude-plugin/plugin.json', claudePlugin]]) {
  if (!manifest) continue;
  if (manifest.license !== 'MIT') error(path, `license "${manifest.license}" isn't MIT`);
  if (typeof manifest.description !== 'string' || !manifest.description.trim()) error(path, `no description`);
}

// Agent Plugins 1.0, which Codex, Cursor and GitHub Copilot read.
if (agentPlugin) {
  const at = 'plugin.json';
  for (const key of Object.keys(agentPlugin))
    if (!AGENT_PLUGINS_KEYS.includes(key)) error(at, `key "${key}" isn't in Agent Plugins 1.0, whose schema allows no other`);
  if (agentPlugin.$schema !== AGENT_PLUGINS_SCHEMA) error(at, `$schema isn't ${AGENT_PLUGINS_SCHEMA}`);
  if (!AGENT_PLUGINS_NAME.test(agentPlugin.name ?? '') || agentPlugin.name.length > 64)
    error(at, `name "${agentPlugin.name}" breaks the standard's pattern`);
  for (const key of ['version', 'description', 'homepage', 'repository', 'license'])
    if (key in agentPlugin && typeof agentPlugin[key] !== 'string') error(at, `${key} isn't a string`);
  if ('author' in agentPlugin) {
    if (!isObject(agentPlugin.author)) error(at, `author isn't an object`);
    else
      for (const [key, value] of Object.entries(agentPlugin.author))
        if (!['name', 'email', 'url'].includes(key) || typeof value !== 'string')
          error(at, `author.${key} isn't one of name, email and url, as a string`);
  }
  if ('keywords' in agentPlugin && !(Array.isArray(agentPlugin.keywords) && agentPlugin.keywords.every((k) => typeof k === 'string')))
    error(at, `keywords isn't a list of strings`);
  if ('extensions' in agentPlugin) {
    if (!isObject(agentPlugin.extensions)) error(at, `extensions isn't an object`);
    else
      for (const [namespace, value] of Object.entries(agentPlugin.extensions))
        if (!isObject(value)) error(at, `extensions["${namespace}"] isn't an object`);
  }
  // OpenAI's listing caps the display name and the short description at 30 characters.
  const listing = agentPlugin.extensions?.['com.openai']?.interface ?? {};
  for (const key of ['displayName', 'shortDescription'])
    if (typeof listing[key] === 'string' && listing[key].length > 30)
      error(at, `the com.openai interface's ${key} is ${listing[key].length} characters; OpenAI's cap is 30`);
}

// Claude Code's marketplace, which Copilot also reads, and Codex's: one name, and an entry for
// the plugin in each.
const entryOf = (market) => (Array.isArray(market?.plugins) ? market.plugins.find((plugin) => plugin?.name === name) : undefined);
for (const [path, market] of [['.claude-plugin/marketplace.json', claudeMarket], ['.agents/plugins/marketplace.json', codexMarket]]) {
  if (!market) continue;
  if (!KEBAB.test(market.name ?? '')) error(path, `name "${market.name}" isn't lowercase letters, digits and single hyphens`);
  if (!entryOf(market)) error(path, `no plugins[] entry named "${name}"`);
}
if (claudeMarket && codexMarket && claudeMarket.name !== codexMarket.name)
  error('.agents/plugins/marketplace.json', `name "${codexMarket.name}" differs from Claude Code's marketplace, "${claudeMarket.name}"`);
if (claudeMarket) {
  const at = '.claude-plugin/marketplace.json';
  const entry = entryOf(claudeMarket);
  if (!claudeMarket.owner?.name) error(at, `no owner.name`);
  if (entry && 'version' in entry && entry.version !== version)
    error(at, `version "${entry.version}" differs from package.json's "${version}"`);
  if (entry && entry.source !== './') warn(at, `source "${entry.source}" isn't this repository's root`);
}
if (codexMarket) {
  const at = '.agents/plugins/marketplace.json';
  const entry = entryOf(codexMarket);
  if (!codexMarket.interface?.displayName) error(at, `no interface.displayName`);
  if (entry) {
    const { source, policy, category } = entry;
    if (!isObject(source) || !['local', 'url', 'git-subdir', 'npm'].includes(source.source))
      error(at, `the source isn't local, url, git-subdir or npm`);
    else if (source.source === 'local' && !String(source.path).startsWith('./'))
      error(at, `a local source's path must start with ./`);
    if (!['AVAILABLE', 'INSTALLED_BY_DEFAULT', 'NOT_AVAILABLE'].includes(policy?.installation))
      error(at, `policy.installation isn't AVAILABLE, INSTALLED_BY_DEFAULT or NOT_AVAILABLE`);
    if (!policy?.authentication) error(at, `no policy.authentication`);
    if (!category) error(at, `no category`);
  }
}

if (pkg.main && !existsSync(join(root, pkg.main))) error('package.json', `main "${pkg.main}" doesn't exist`);
for (const entry of pkg.files ?? []) if (!existsSync(join(root, entry))) error('package.json', `the files entry "${entry}" doesn't exist`);
if (!existsSync(join(root, 'LICENSE')) || !readFileSync(join(root, 'LICENSE'), 'utf8').startsWith('MIT License'))
  error('LICENSE', `missing, or not the MIT License`);
const changelog = existsSync(join(root, 'CHANGELOG.md')) ? readFileSync(join(root, 'CHANGELOG.md'), 'utf8') : '';
if (!changelog.includes('## [Unreleased]')) error('CHANGELOG.md', `no "## [Unreleased]" section`);
if (version && !changelog.includes(`## [${version}]`)) error('CHANGELOG.md', `no section for version ${version}`);

// ---- Skills ---------------------------------------------------------------------------------

// The frontmatter keys a Gradatim skill may use: the Agent Skills spec's, less `allowed-tools`,
// whose values are one host's tool names, and `compatibility`, a host's needs. Every host reads the
// frontmatter, so behaviour for one host goes in a file only that host reads
// (skills/method/references/writing-rules.md, rule 5).
const FRONTMATTER_KEYS = ['name', 'description', 'license', 'metadata'];
// The frontmatter's reader, parseFrontmatter, is in ./frontmatter.mjs, which the guides' script reads too (REL-1).

const skillsRoot = join(root, 'skills');
// Skills that only the tests load, such as one that plays a step just after its yes, sit in
// tests/skills/<name>/. The runner copies one into the plugin's copy for its own suites, so it is
// checked as a skill that sits in skills/, and never ships (MTH-3).
const testSkillsRoot = join(root, 'tests', 'skills');
const skillNames = [];
const testSkillNames = [];
const skillDescriptions = {};
const skillLicenses = {};
const skillFileOf = (skill) => join(testSkillNames.includes(skill) ? testSkillsRoot : skillsRoot, skill, 'SKILL.md');
const skillFolders = [
  ...(existsSync(skillsRoot) ? readdirSync(skillsRoot, { withFileTypes: true }).map((entry) => [entry, 'skills', skillNames]) : []),
  ...(existsSync(testSkillsRoot) ? readdirSync(testSkillsRoot, { withFileTypes: true }).map((entry) => [entry, 'tests/skills', testSkillNames]) : []),
];
for (const [entry, base, names] of skillFolders) {
  // Hidden entries, such as macOS's .DS_Store, aren't skills; the OpenCode entry skips them too.
  if (entry.name.startsWith('.')) continue;
  const folder = `${base}/${entry.name}`;
  if (!entry.isDirectory()) {
    error(folder, `a file in ${base}/, which holds only skill folders`);
    continue;
  }
  const file = join(root, base, entry.name, 'SKILL.md');
  if (!existsSync(file)) {
    error(folder, `no SKILL.md: every folder in ${base}/ is a skill`);
    continue;
  }
  if (base === 'tests/skills' && skillNames.includes(entry.name)) error(folder, `a skill that ships is named "${entry.name}" too`);
  names.push(entry.name);
  const at = `${folder}/SKILL.md`;
  const text = readFileSync(file, 'utf8');
  const { fields, problems } = parseFrontmatter(text);
  for (const problem of problems) error(at, `frontmatter: ${problem}`);
  const skill = fields.name;
  if (typeof skill !== 'string' || !skill) error(at, `no name`);
  else {
    if (skill !== entry.name) error(at, `name "${skill}" differs from its folder, "${entry.name}"`);
    if (!KEBAB.test(skill) || skill.length > 64) error(at, `name "${skill}" isn't 1 to 64 lowercase letters, digits and single hyphens`);
    if (/claude|anthropic/.test(skill)) error(at, `name "${skill}" holds "claude" or "anthropic", which Claude's skill rules forbid`);
    if (`${name}:${skill}`.length > 64) error(at, `"${name}:${skill}" is over 64 characters, OpenAI's cap`);
  }
  const description = fields.description;
  if (typeof description !== 'string' || !description.trim()) error(at, `no description`);
  else {
    skillDescriptions[entry.name] = description;
    if (description.length > 1024) error(at, `the description is ${description.length} characters; the cap is 1,024`);
    if (/<\/?[a-z][^>]*>/i.test(description)) error(at, `the description holds an XML tag, which Claude's skill rules forbid`);
  }
  skillLicenses[entry.name] = fields.license;
  for (const key of Object.keys(fields))
    if (!FRONTMATTER_KEYS.includes(key))
      error(at, `key "${key}" isn't one of ${FRONTMATTER_KEYS.join(', ')}, the keys that every host takes`);
  const bytes = Buffer.byteLength(text);
  if (bytes >= 20000) error(at, `${bytes} bytes; a SKILL.md stays under 20,000, with the detail moved to its references/`);
  const lineCount = text.split('\n').length;
  if (lineCount > 500) warn(at, `${lineCount} lines; a SKILL.md stays under 500`);
}
if (skillNames.length === 0) error('skills/', `no skill`);

// ---- Links ----------------------------------------------------------------------------------

// Every relative link in the Markdown files git sees: the target exists with the exact case
// GitHub will see, it stays inside the repository, and a #fragment names a real heading (GitHub's
// slug rules) or an id in the target. Links inside code are ignored. The rules live in the method's
// check of a project's documents, skills/method/scripts/check-docs.mjs, so they exist once.

// The sample's states hold a made-up project's files, whose links are that project's
// (tests/sample/README.md), so their links aren't checked here: the tests check them as projects.
const SAMPLE_LAYER = /^tests\/sample\/[^/]+\//;
const markdownFiles = files.filter((file) => file.endsWith('.md') && !SAMPLE_LAYER.test(file)).map((file) => join(root, file));
// A skill that only the tests load links as if it sat in skills/, where the runner puts it.
const TEST_SKILL_FILE = /^tests\/skills\/([^/]+)\/(.+)$/;
function linkFromSkills(file, path) {
  const inTests = TEST_SKILL_FILE.exec(shown(file));
  if (!inTests || path === '') return linkTarget(root, file, path);
  const placed = join(skillsRoot, inTests[1]);
  const target = linkTarget(root, join(placed, inTests[2]), path);
  return relative(placed, target).startsWith('..') ? target : join(testSkillsRoot, inTests[1], relative(placed, target));
}
let linkCount = 0;
for (const file of markdownFiles) {
  for (const { lineNo, raw, path, fragment } of relativeLinks(readFileSync(file, 'utf8'))) {
    linkCount++;
    const target = linkFromSkills(file, path);
    const report = (kind) => error(`${shown(file)}:${lineNo}`, `${kind}  ${raw}`);
    if (relative(root, target).startsWith('..')) {
      report('outside the repository');
      continue;
    }
    // A host may install only the skills, so a skill's links stay inside skills/.
    const isSkill = shown(file).startsWith('skills/') || TEST_SKILL_FILE.test(shown(file));
    if (isSkill && relative(skillsRoot, target).startsWith('..') && relative(testSkillsRoot, target).startsWith('..')) {
      report('leaves skills/, which a host may install alone');
      continue;
    }
    const fault = targetFault(root, target, fragment);
    if (fault) report(fault);
  }
}

// ---- Portability ----------------------------------------------------------------------------

// The capabilities a skill may use are the rows of the first table in capabilities.md. Each host
// map that capabilities.md links has one row for each of them, no more and no fewer. A host's tool
// names appear only in its map: elsewhere in skills/, a name from a map's table in backticks is an
// error, as are host variables, Claude Code's call form and its `!`command`` lines (writing-rules.md,
// rules 1 and 6).
const referencesDir = join(skillsRoot, 'method', 'references');
const capabilitiesFile = join(referencesDir, 'capabilities.md');
const MAP_FILE = /^host-[a-z0-9-]+\.md$/;
const isMap = (file) => file.startsWith('skills/method/references/') && MAP_FILE.test(file.split('/').pop());
// Plain words that are also some host's tool names. In backticks they are more often just words.
const PLAIN_WORDS = new Set(['bash', 'edit', 'explore', 'general', 'question', 'read', 'shell', 'skill', 'subagent', 'task', 'write']);
const HOST_SYNTAX = [
  [/\$\{?(?:ARGUMENTS|CLAUDE_[A-Z_]+|CURSOR_PLUGIN_ROOT|PLUGIN_ROOT)\b\}?/, 'a host variable'],
  [/\/gradatim:/, `Claude Code's call form "/gradatim:", which only its map may give`],
  [/(?:^|\s)!`/, `a "!\`command\`" line, which only Claude Code runs`],
];
const MAP_BYTES = 6000;
const MAP_DAYS = 90;

// The first table among numbered lines: its header's cells, and its body rows, each with its line
// number and a list of its cells. A cell may hold an escaped pipe, "\|", as the run log's do.
function tableIn(numberedLines) {
  const rows = [];
  for (const [lineNo, line] of numberedLines) {
    if (/^\s*\|/.test(line)) rows.push({ lineNo, cells: line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((cell) => cell.trim()) });
    else if (rows.length > 0) break;
  }
  return { header: rows[0]?.cells ?? [], body: rows.slice(2) }; // the body starts past the |---| row
}
const headedTable = (text) => tableIn(unfencedLines(text));
const firstTable = (text) => headedTable(text).body.map((row) => row.cells);
const cellText = (cell) => cell.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/`/g, '').trim();
const codeSpans = (line) => [...line.matchAll(/(`+)((?:(?!\1).)+?)\1/g)].map((m) => m[2].trim());

const mapNames = [];
const toolNames = new Set();
if (!existsSync(capabilitiesFile)) error('skills/method/references/capabilities.md', `missing`);
else {
  const text = readFileSync(capabilitiesFile, 'utf8');
  const capabilities = firstTable(text).map(([first]) => cellText(first));
  if (capabilities.length === 0) error(shown(capabilitiesFile), `no table of capabilities at its top`);
  const linked = new Set([...text.matchAll(/\]\(([^)#\s]+)\)/g)].map((m) => m[1]).filter((target) => MAP_FILE.test(target)));
  for (const name of readdirSync(referencesDir).filter((entry) => MAP_FILE.test(entry)))
    if (!linked.has(name)) error(`skills/method/references/${name}`, `a host map that capabilities.md doesn't link`);
  for (const name of [...linked].sort()) {
    const file = join(referencesDir, name);
    const at = shown(file);
    if (!existsSync(file)) continue; // the link check reports it
    mapNames.push(name);
    const mapText = readFileSync(file, 'utf8');
    const rows = firstTable(mapText);
    const listed = rows.map(([first]) => cellText(first));
    for (const capability of capabilities) if (!listed.includes(capability)) error(at, `no row for the capability "${capability}"`);
    for (const capability of listed)
      if (!capabilities.includes(capability)) error(at, `a row for "${capability}", which isn't a capability in capabilities.md`);
    for (const row of rows)
      for (const cell of row.slice(1))
        for (const span of codeSpans(cell)) if (/^[#A-Za-z][\w#/.-]*$/.test(span) && !PLAIN_WORDS.has(span)) toolNames.add(span);
    const bytes = Buffer.byteLength(mapText);
    if (bytes > MAP_BYTES) warn(at, `${bytes} bytes; a map stays under ${MAP_BYTES}, since every skill run reads one`);
    const checked = /Checked on (\d{4}-\d{2}-\d{2})/.exec(mapText)?.[1];
    if (!checked) warn(at, `no "Checked on <date>" line`);
    else if ((Date.now() - Date.parse(checked)) / 86_400_000 > MAP_DAYS)
      warn(at, `checked on ${checked}, more than ${MAP_DAYS} days ago: check its facts again at their sources`);
  }
}

// Every Markdown file in skills/ but the maps and the writing rules, which name what the rest may not.
const portableFiles = files.filter(
  (file) =>
    (file.startsWith('skills/') || file.startsWith('tests/skills/')) &&
    file.endsWith('.md') &&
    !isMap(file) &&
    file !== 'skills/method/references/writing-rules.md',
);
for (const file of portableFiles) {
  readFileSync(join(root, file), 'utf8')
    .split(/\r?\n/)
    .forEach((line, index) => {
      const where = `${file}:${index + 1}`;
      for (const span of codeSpans(line))
        if (toolNames.has(span)) error(where, `names the tool \`${span}\`, which only a host map may name: name the capability`);
      for (const [pattern, what] of HOST_SYNTAX) if (pattern.test(line)) error(where, `holds ${what}`);
    });
}

// A subagent's model (MTH-7, writing rule 12). No skill names a model, a provider or an effort in a code span:
// the checklist joins the maps and the writing rules, which name what the rest may not. Each line of a skill's
// Steps, or of the sync, that hands work to a subagent names a kind from the capabilities' table, or links the
// sync. A map that gives models gives each kind exactly one, and Claude Code's map gives them.
const kinds = existsSync(capabilitiesFile) ? kindsIn(readFileSync(capabilitiesFile, 'utf8')) : [];
if (existsSync(capabilitiesFile) && kinds.length === 0) error(shown(capabilitiesFile), `no table of the kinds of a subagent's job, headed "Kind"`);
for (const file of portableFiles.filter((file) => file !== 'skills/method/references/checklist.md'))
  readFileSync(join(root, file), 'utf8')
    .split(/\r?\n/)
    .forEach((line, index) => {
      for (const word of modelWordsIn(line))
        error(`${file}:${index + 1}`, `names \`${word}\`, a model, a provider or an effort: a skill names the job's kind, and the host's map gives its model`);
    });
const theSync = 'skills/method/references/sync.md';
// The procedures that a step follows whole, and whose every line may hand work to a subagent: the sync, the quick start (MTH-11),
// and the change (MTH-12).
const procedures = [theSync, 'skills/method/references/quick-start.md', 'skills/method/references/change.md'];
for (const file of [...files.filter((file) => /^(?:tests\/)?skills\/[^/]+\/SKILL\.md$/.test(file)), ...procedures].filter((file) => existsSync(join(root, file))))
  for (const { line } of handOffProblems(readFileSync(join(root, file), 'utf8'), kinds, { stepsOnly: !procedures.includes(file) }))
    error(`${file}:${line}`, `hands work to a subagent with no kind: say "on the model your host's map gives <a kind from the capabilities' table>", or link the sync`);
for (const name of mapNames) {
  const rows = mapModels(readFileSync(join(referencesDir, name), 'utf8'));
  if (rows === null) {
    if (name === 'host-claude-code.md') error(`skills/method/references/${name}`, `no table "Model | Kinds" giving each kind of a subagent's job its model`);
    continue;
  }
  for (const problem of mapModelProblems(rows, kinds)) error(`skills/method/references/${name}`, problem);
}

// ---- Method ---------------------------------------------------------------------------------

// The steps are the rows of the first table in cycle.md, and the document map is the first table
// in documents.md. Each document has one row, and exactly one step creates it: its "Created by"
// cell names one of the steps (MTH-1's design, decision 17). Each step has one skill, whose name is
// two words or more (MTH-2's design, decision 1). The columns are found by their headers.
const cycleFile = join(referencesDir, 'cycle.md');
const documentsFile = join(referencesDir, 'documents.md');
// Every skill run may read both files, so growing either past its size is a choice made here.
const METHOD_BYTES = new Map([[cycleFile, 7500], [documentsFile, 17500]]);
const steps = [];
const stepOfSkill = new Map();
const documentRows = new Map();
let documentCount = 0;

function methodTable(file, columns) {
  const at = shown(file);
  if (!existsSync(file)) {
    error(at, `missing`);
    return null;
  }
  const text = readFileSync(file, 'utf8');
  const bytes = Buffer.byteLength(text);
  if (bytes > METHOD_BYTES.get(file)) warn(at, `${bytes} bytes; it stays under ${METHOD_BYTES.get(file)}, since every skill run may read it`);
  const { header, body } = headedTable(text);
  const index = {};
  for (const name of columns) {
    index[name] = header.findIndex((cell) => cellText(cell) === name);
    if (index[name] < 0) error(at, `the first table has no "${name}" column`);
  }
  if (body.length === 0) error(at, `no table at its top`);
  return Object.values(index).every((i) => i >= 0) ? { at, body, index } : null;
}

const cycleTable = methodTable(cycleFile, ['Step', 'Skill']);
for (const { lineNo, cells } of cycleTable?.body ?? []) {
  const where = `${cycleTable.at}:${lineNo}`;
  const step = cellText(cells[cycleTable.index.Step] ?? '');
  if (!step) error(where, `a step with no name`);
  else if (steps.includes(step)) error(where, `the step "${step}" is listed twice`);
  else steps.push(step);
  const skill = cellText(cells[cycleTable.index.Skill] ?? '');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(skill))
    error(where, `the skill "${skill}" isn't two words or more, in lowercase, joined by hyphens: a verb and its object`);
  else if (stepOfSkill.has(skill)) error(where, `the skill "${skill}" runs two steps`);
  else stepOfSkill.set(skill, step);
}

// The steps a "Changed by, and why" cell names: the part of each " · " piece before its colon,
// where steps are joined by "and" or commas (documents.md, rule 7). Other words, such as "the sync",
// aren't steps and are left out.
function changersOf(cell) {
  const named = new Set();
  for (const piece of cell.split('·'))
    for (const name of piece.split(':')[0].split(/,|\band\b/)) if (steps.includes(name.trim())) named.add(name.trim());
  return named;
}

const documentsTable = methodTable(documentsFile, ['Path', 'Created by', 'Changed by, and why']);
for (const { lineNo, cells } of documentsTable?.body ?? []) {
  const where = `${documentsTable.at}:${lineNo}`;
  const path = cellText(cells[documentsTable.index.Path] ?? '');
  const creator = cellText(cells[documentsTable.index['Created by']] ?? '');
  documentCount++;
  // With no steps read, cycle.md's own error says why; one per row would only repeat it.
  if (steps.length > 0 && !steps.includes(creator))
    error(where, `"${path}" is created by "${creator}", which isn't one of cycle.md's steps: a document has exactly one creator`);
  if (documentRows.has(path)) error(where, `"${path}" has a second row: a document has one`);
  const changedBy = cellText(cells[documentsTable.index['Changed by, and why']] ?? '');
  documentRows.set(path, { creator, changers: changersOf(changedBy), bySync: /\bthe sync\b/.test(changedBy), byChange: /\bthe change\b/.test(changedBy) });
}

// The sync (MTH-3): its table of what it may change lists exactly the map's documents whose
// "Changed by" cell names it, and it stays small, since each sync reads it whole.
const syncFile = join(referencesDir, 'sync.md');
const SYNC_BYTES = 6000;
if (!existsSync(syncFile)) error(shown(syncFile), `missing`);
else {
  const text = readFileSync(syncFile, 'utf8');
  const bytes = Buffer.byteLength(text);
  if (bytes > SYNC_BYTES) warn(shown(syncFile), `${bytes} bytes; it stays under ${SYNC_BYTES}, since each sync reads it whole`);
  const { header, body } = headedTable(text);
  const pathAt = header.findIndex((cell) => cellText(cell) === 'Path');
  if (pathAt < 0) error(shown(syncFile), `its first table has no Path column: the documents the sync may change`);
  else if (documentsTable) {
    const listed = new Set(body.map(({ cells }) => cellText(cells[pathAt] ?? '')));
    const named = new Set([...documentRows].filter(([, row]) => row.bySync).map(([path]) => path));
    for (const path of named) if (!listed.has(path)) error(shown(syncFile), `its table lacks "${path}", whose "Changed by" cell in documents.md names the sync`);
    for (const path of listed) if (!named.has(path)) error(shown(syncFile), `its table lists "${path}", whose "Changed by" cell in documents.md doesn't name the sync`);
  }
}

// The change (MTH-12): how the steps of the task loop take a change. Its table of what it may change lists exactly the
// map's documents whose "Changed by" cell names it, and it stays small, since each change reads it whole.
const changeFile = join(referencesDir, 'change.md');
const CHANGE_BYTES = 5000;
if (!existsSync(changeFile)) error(shown(changeFile), `missing`);
else {
  const text = readFileSync(changeFile, 'utf8');
  const bytes = Buffer.byteLength(text);
  if (bytes > CHANGE_BYTES) warn(shown(changeFile), `${bytes} bytes; it stays under ${CHANGE_BYTES}, since each change reads it whole`);
  const { header, body } = headedTable(text);
  const pathAt = header.findIndex((cell) => cellText(cell) === 'Path');
  if (pathAt < 0) error(shown(changeFile), `its first table has no Path column: the documents a change may change`);
  else if (documentsTable) {
    const listed = new Set(body.map(({ cells }) => cellText(cells[pathAt] ?? '')));
    const named = new Set([...documentRows].filter(([, row]) => row.byChange).map(([path]) => path));
    for (const path of named) if (!listed.has(path)) error(shown(changeFile), `its table lacks "${path}", whose "Changed by" cell in documents.md names the change`);
    for (const path of listed) if (!named.has(path)) error(shown(changeFile), `its table lists "${path}", whose "Changed by" cell in documents.md doesn't name the change`);
  }
}

// The quick start (MTH-11): init's procedure, which writes other steps' documents from their templates. Each row of
// its table names a document of the map and the step whose document it is: it creates only what the map gives that
// step to create, and changes only what the map lets that step change, so every document keeps its one creator.
// It stays small, since a quick start reads it whole.
const quickStartFile = join(referencesDir, 'quick-start.md');
const QUICK_START_BYTES = 6000;
const QUICK_START_USES = ['reads', 'creates', 'changes'];
if (!existsSync(quickStartFile)) error(shown(quickStartFile), `missing`);
else {
  const text = readFileSync(quickStartFile, 'utf8');
  const bytes = Buffer.byteLength(text);
  if (bytes > QUICK_START_BYTES) warn(shown(quickStartFile), `${bytes} bytes; it stays under ${QUICK_START_BYTES}, since each quick start reads it whole`);
  const { header, body } = headedTable(text);
  const at = (name) => header.findIndex((cell) => cellText(cell) === name);
  if (['Document', 'Path', 'Step', 'Use', 'Template'].some((name) => at(name) < 0))
    error(shown(quickStartFile), `its first table hasn't the columns Document, Path, Step, Use and Template`);
  else
    for (const { lineNo, cells } of body) {
      const where = `${shown(quickStartFile)}:${lineNo}`;
      const path = cellText(cells[at('Path')] ?? '');
      const step = cellText(cells[at('Step')] ?? '');
      const row = documentRows.get(path);
      if (!row) {
        error(where, `"${path}" isn't a document in documents.md's map`);
        continue;
      }
      if (steps.length > 0 && !steps.includes(step)) error(where, `"${step}" isn't one of cycle.md's steps`);
      for (const use of cellText(cells[at('Use')] ?? '').split(/,|\band\b/).map((word) => word.trim()).filter(Boolean)) {
        if (!QUICK_START_USES.includes(use)) error(where, `"${use}" isn't one of ${QUICK_START_USES.join(', ')}`);
        else if (use === 'creates' && row.creator !== step) error(where, `creates "${path}" for ${step}, and documents.md's map gives it to ${row.creator}`);
        else if (use === 'changes' && row.creator !== step && !row.changers.has(step))
          error(where, `changes "${path}" for ${step}, which its "Changed by" cell in documents.md doesn't name`);
      }
    }
}

// The artifacts' procedure (MTH-4) stays small, since each step that makes an artifact reads it.
const artifactsFile = join(referencesDir, 'artifacts.md');
const ARTIFACTS_BYTES = 4000;
if (!existsSync(artifactsFile)) error(shown(artifactsFile), `missing`);
else {
  const bytes = Buffer.byteLength(readFileSync(artifactsFile, 'utf8'));
  if (bytes > ARTIFACTS_BYTES) warn(shown(artifactsFile), `${bytes} bytes; it stays under ${ARTIFACTS_BYTES}, since each step that makes an artifact reads it`);
}

// ---- Contract -------------------------------------------------------------------------------

// Every skill follows the contract's shape (MTH-2's design, decision 16; writing-rules.md, rules
// 14 to 18). Its name is in cycle.md's Skill column, unless it is method or hello. Its frontmatter
// holds "license: MIT", and its description holds "Use when". Its sections come in the writing
// rules' order. Its fixed steps, Start, Agree and Next step, are where they belong and link the
// files they read. And each document in its "Reads and writes" table is one the map lets its step
// create or change. Across skills/, no code span names another plugin's skill (I.5).
const contractFile = join(referencesDir, 'contract.md');
const CONTRACT_BYTES = 2000; // its hard lines only (MTH-5)
const SIZE_LINE = '**A usual run:**'; // under the fixed line: a run's size, and when to check in (MTH-5)
// Under the title, the same in every skill and the template (writing rule 17; TSK-2's git rules).
const FIXED_LINE = 'This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.';
const DESCRIPTION_CHARS = 300;
const SKILL_SECTIONS = ['When to use', 'Reads and writes', 'Steps', 'Stop'];
const LAST_SECTION = 'Red flags'; // only where a run showed a model skipping a rule
const OWN_SKILLS = ['method', 'hello']; // the skills that run no step of the cycle
const NO_AGREEMENT = ['init-project', 'method']; // init by N.2; method writes nothing
const USES = ['reads', 'creates', 'changes'];
const OTHER_PLUGIN_SKILL = /^\/?([a-z0-9][a-z0-9-]*):[a-z0-9][a-z0-9-]*$/;

if (!existsSync(contractFile)) error(shown(contractFile), `missing`);
else {
  const bytes = Buffer.byteLength(readFileSync(contractFile, 'utf8'));
  if (bytes > CONTRACT_BYTES) warn(shown(contractFile), `${bytes} bytes; it stays under ${CONTRACT_BYTES}: its hard lines, with the rest in the skills' own steps`);
}

// The files that the relative links in some lines point to.
function linkTargets(lines, fromDir) {
  const targets = new Set();
  for (const line of lines)
    for (const m of withoutCodeSpans(line).matchAll(linkPattern)) {
      const raw = (m[1] ?? m[2] ?? '').replace(/^<|>$/g, '').split('#')[0];
      if (!raw || /^[a-z][a-z0-9+.-]*:/i.test(raw)) continue;
      try {
        targets.add(resolve(fromDir, decodeURIComponent(raw)));
      } catch {
        targets.add(resolve(fromDir, raw));
      }
    }
  return targets;
}

for (const skill of [...skillNames, ...testSkillNames]) {
  // A skill that only the tests load runs no step of its own, and needs no agreement: it plays a
  // step just after its yes (MTH-3), or the steps that make an artifact (MTH-4). So its table may
  // name the documents of the steps it plays. Its links count from skills/<name>/, where the
  // runner puts it.
  const isTest = testSkillNames.includes(skill);
  const file = skillFileOf(skill);
  const at = shown(file);
  const step = stepOfSkill.get(skill);
  if (!step && !OWN_SKILLS.includes(skill) && !isTest)
    error(at, `"${skill}" isn't in cycle.md's Skill column, and isn't ${OWN_SKILLS.join(' or ')}`);
  if (skillLicenses[skill] !== 'MIT') error(at, `no "license: MIT" in the frontmatter, which a skill copied on its own keeps`);
  const description = skillDescriptions[skill];
  if (typeof description === 'string') {
    if (!description.includes('Use when')) error(at, `the description has no "Use when", which says what starts the skill`);
    if (description.length > DESCRIPTION_CHARS)
      warn(at, `the description is ${description.length} characters; it stays under ${DESCRIPTION_CHARS}, since every session holds it`);
  }

  // The sections, each with its numbered lines outside code. The lines above the first section
  // hold the size line.
  const sections = [];
  const intro = [];
  for (const [lineNo, line] of unfencedLines(readFileSync(file, 'utf8'))) {
    const heading = /^##\s+(.+?)\s*$/.exec(line)?.[1];
    if (heading !== undefined) sections.push({ heading, lines: [] });
    else (sections.at(-1)?.lines ?? intro).push([lineNo, line]);
  }
  if (!intro.some(([, line]) => line.trim() === FIXED_LINE))
    error(at, `no fixed line above "## When to use", word for word: "${FIXED_LINE}" (writing rule 17)`);
  if (!intro.some(([, line]) => line.startsWith(SIZE_LINE)))
    error(at, `no "${SIZE_LINE}" line above "## When to use": a run's usual size, and when to check in (writing rule 28)`);
  const headings = sections.map((section) => section.heading);
  const expected = headings.at(-1) === LAST_SECTION ? [...SKILL_SECTIONS, LAST_SECTION] : SKILL_SECTIONS;
  if (headings.join('|') !== expected.join('|'))
    error(at, `the sections are [${headings.join(', ')}]; the writing rules' order is ${SKILL_SECTIONS.join(', ')}, then ${LAST_SECTION} if any`);
  const linesOf = (heading) => sections.find((section) => section.heading === heading)?.lines ?? [];

  // The steps: each top-level "1. **Word.**" line opens one, and the lines below belong to it.
  const items = [];
  for (const [lineNo, line] of linesOf('Steps')) {
    const lead = /^\d+\.\s+\*\*([^*]+?)\.?\*\*/.exec(line)?.[1];
    if (lead !== undefined) items.push({ lead, lineNo, lines: [line] });
    else items.at(-1)?.lines.push(line);
  }
  const leads = items.map((item) => item.lead);
  const links = (item) => linkTargets(item.lines, isTest ? join(skillsRoot, skill) : dirname(file));
  if (leads[0] !== 'Start') error(at, `the first step isn't **Start.**`);
  else
    for (const [target, what] of [[capabilitiesFile, 'capabilities.md'], [contractFile, 'contract.md']])
      if (!links(items[0]).has(target)) error(`${at}:${items[0].lineNo}`, `Start doesn't link ${what}, which it reads when a step needs it`);
  if (leads.at(-1) !== 'Next step') error(at, `the last step isn't **Next step.**`);
  else if (skill !== 'hello' && !links(items.at(-1)).has(cycleFile))
    error(`${at}:${items.at(-1).lineNo}`, `Next step doesn't link cycle.md, which gives the next step`);
  if (skill === 'init-project' && leads.includes('Agree'))
    error(at, `an **Agree.** step in init-project, the one step that asks for no agreement (N.2)`);
  else if (!NO_AGREEMENT.includes(skill) && !isTest && !leads.includes('Agree')) error(at, `no **Agree.** step`);

  // "Reads and writes": each path is a row of documents.md, which says who may create or change it.
  const table = tableIn(linesOf('Reads and writes'));
  const column = (name) => table.header.findIndex((cell) => cellText(cell) === name);
  if ([column('Document'), column('Path'), column('Use')].includes(-1)) {
    error(at, `"Reads and writes" has no table with the columns Document, Path and Use`);
    continue;
  }
  for (const { lineNo, cells } of table.body) {
    const where = `${at}:${lineNo}`;
    const path = cellText(cells[column('Path')] ?? '');
    const row = documentRows.get(path);
    if (!row) {
      error(where, `"${path}" isn't a document in documents.md's map`);
      continue;
    }
    for (const use of cellText(cells[column('Use')] ?? '').split(/,|\band\b/).map((word) => word.trim()).filter(Boolean)) {
      if (!USES.includes(use)) error(where, `"${use}" isn't one of ${USES.join(', ')}`);
      else if (use === 'creates' && !isTest && row.creator !== step)
        error(where, `creates "${path}", which documents.md's map gives to ${row.creator}`);
      else if (use === 'changes' && !isTest && row.creator !== step && !row.changers.has(step))
        error(where, `changes "${path}", which its "Changed by" cell in documents.md doesn't give to ${step ?? skill}`);
    }
  }
}

for (const file of portableFiles) {
  readFileSync(join(root, file), 'utf8')
    .split(/\r?\n/)
    .forEach((line, index) => {
      for (const span of codeSpans(line)) {
        const plugin = OTHER_PLUGIN_SKILL.exec(span)?.[1];
        if (plugin && plugin !== name)
          error(`${file}:${index + 1}`, `names \`${span}\`, another plugin's skill: Gradatim's skills call only each other (I.5)`);
      }
    });
}

// ---- Guides ---------------------------------------------------------------------------------

// Each skill in skills/ has its guide for users, docs/guides/<skill>.md, whose block, from line 1 to its
// end marker, is what `npm run guides` writes now from the skill's file and cycle.md, and so is the
// README's table of the cycle. No other file in docs/guides/ holds a guide's block, and no guide links a
// planning doc, in docs/ outside docs/guides/ (REL-1). The rules are in ./guides.mjs, which its tests
// cover. The skills that only the tests load get no guide.
const guidesRoot = join(root, GUIDES_DIR);
const guideFiles = new Map(
  existsSync(guidesRoot)
    ? readdirSync(guidesRoot)
        .filter((entry) => entry.endsWith('.md'))
        .map((entry) => [entry, readFileSync(join(guidesRoot, entry), 'utf8')])
    : [],
);
const guideCount = skillNames.filter((skill) => guideFiles.has(`${skill}.md`)).length;
for (const { where, what } of guideProblems({
  skills: new Map(skillNames.map((skill) => [skill, readFileSync(skillFileOf(skill), 'utf8')])),
  cycleText: existsSync(cycleFile) ? readFileSync(cycleFile, 'utf8') : '',
  guides: guideFiles,
  readme: existsSync(join(root, 'README.md')) ? readFileSync(join(root, 'README.md'), 'utf8') : null,
}))
  error(where, what);

// ---- Tests ----------------------------------------------------------------------------------

// Each state of the sample has its row and its folder, and a name that a host or git reads ends in ".sample" there;
// the sample's reader is ./sample.mjs, which the runner reads too. Where the runner, scripts/scenario.mjs, is in the
// tree, every skill has its scenarios in tests/scenarios/<skill>/, and a README there that maps each of the
// checklist's items 9 to 19 to the scenarios that cover it, or says why it doesn't apply; each scenario parses, names
// its skill and a state of the sample, and its Items match the map; and each row of the run log is whole. Their
// parsers are the runner's, so the two read the format alike. Scenarios with no runner to read them fail the check,
// so that none is skipped in silence.
const testsRoot = join(root, 'tests');
const scenariosRoot = join(testsRoot, 'scenarios');
const sampleRoot = join(testsRoot, 'sample');
let scenarioCount = 0;
let sample = { states: new Map() };
const sampleReadme = join(sampleRoot, 'README.md');
if (!existsSync(sampleReadme)) error('tests/sample/README.md', `missing`);
else {
  sample = parseSample(readFileSync(sampleReadme, 'utf8'));
  for (const [name, state] of sample.states) {
    const where = `tests/sample/README.md:${state.lineNo}`;
    if (!existsSync(join(sampleRoot, name))) error(where, `the state "${name}" has no folder`);
    if (state.from !== 'empty' && !sample.states.has(state.from)) error(where, `the state "${name}" comes from "${state.from}", which isn't a state`);
    // A Git cell says "yes", "no", or "yes, on `<base>`" for a repository whose base isn't main (MTH-11).
    if (!/^(?:no|yes(?:, on [\w./-]+)?)$/i.test(state.gitCell ?? 'yes'))
      error(where, `the state "${name}" has the Git cell "${state.gitCell}": it is "yes", "no", or "yes, on \`<base>\`"`);
  }
  for (const entry of readdirSync(sampleRoot, { withFileTypes: true }))
    if (entry.isDirectory() && !sample.states.has(entry.name))
      error(`tests/sample/${entry.name}/`, `a folder that tests/sample/README.md doesn't list as a state`);
}
for (const file of files.filter((file) => SAMPLE_LAYER.test(file)))
  for (const part of file.split('/').slice(3))
    if (HOST_READ_NAMES.includes(part))
      error(file, `"${part}" is a name a host or git reads, so in the sample it is stored as "${part}.sample"`);

// The sample's research reports pass research-topics' own check, offline, so that its template,
// its script and the kept states agree (RES-1). This repository's git isn't the sample's, so no
// committed text is read. A layer holds no code, so a report on the code is checked for its shape
// here, and for its quotes by the script's tests, on its state built whole (MTH-8).
const reportCheck = join(skillsRoot, 'research-topics', 'scripts', 'check-report.mjs');
if (existsSync(reportCheck)) {
  const { checkReport } = await import(pathToFileURL(reportCheck).href);
  for (const file of files.filter((file) => /^tests\/sample\/[^/]+\/docs\/research\/\d{2,}-[^/]+\.md$/.test(file))) {
    const { problems } = await checkReport(join(root, file), { offline: true, committed: () => null, readCode: false });
    for (const problem of problems) error(file, `research-topics' check of a report: ${problem}`);
  }
}

const runnerFile = join(root, 'scripts', 'scenario.mjs');
const runner = existsSync(runnerFile) ? await import(pathToFileURL(runnerFile).href) : null;
if (!runner && existsSync(scenariosRoot)) error('tests/scenarios/', `scenarios with no runner to read them: scripts/scenario.mjs is missing`);
const { FIRST_ITEM, LAST_ITEM, parseItemMap, parseScenario } = runner ?? {};
for (const skill of runner ? [...skillNames, ...testSkillNames] : []) {
  const dir = join(scenariosRoot, skill);
  const at = `tests/scenarios/${skill}/`;
  if (!existsSync(join(dir, 'README.md'))) {
    error(at, `no scenarios, with a README that maps the checklist's items ${FIRST_ITEM} to ${LAST_ITEM}: every skill is tested`);
    continue;
  }
  const numbers = new Map(); // a scenario's number, to its items
  for (const name of readdirSync(dir).filter((entry) => entry.endsWith('.md') && entry !== 'README.md').sort()) {
    const where = `${at}${name}`;
    const number = /^(\d{2})-[a-z0-9-]+\.md$/.exec(name)?.[1];
    if (!number) {
      error(where, `a scenario is named NN-<slug>.md`);
      continue;
    }
    if (numbers.has(number)) error(where, `a second scenario numbered ${number}`);
    const scenario = parseScenario(readFileSync(join(dir, name), 'utf8'));
    scenarioCount++;
    for (const problem of scenario.problems) error(where, problem);
    if (scenario.skill && scenario.skill !== skill) error(where, `names the skill "${scenario.skill}", in the folder of "${skill}"`);
    const base = scenario.state;
    if (base && base !== 'empty' && !sample.states.has(base)) error(where, `the state "${base}" isn't in tests/sample/README.md`);
    // A Branch row's state lies below the scenario's own, so that the branch holds a layer or more (PRQ-1); and so does
    // a Remote row's "origin at <state>", so that a layer or more is still to push (DEP-1).
    const below = [];
    for (let name = sample.states.get(base)?.from; name && name !== 'empty' && below.length < 100; name = sample.states.get(name)?.from) below.push(name);
    if (scenario.branch && !below.includes(scenario.branch.from)) error(where, `the Branch row's state "${scenario.branch.from}" isn't below "${base}" in tests/sample/README.md`);
    if (scenario.remoteAt && !below.includes(scenario.remoteAt)) error(where, `the Remote row's state "${scenario.remoteAt}" isn't below "${base}" in tests/sample/README.md`);
    // A `script` line runs the skill's own script, or else the method's, as the runner looks (MTH-3).
    for (const line of scenario.files.filter((l) => l.check?.word === 'script'))
      if (![skill, 'method'].some((owner) => existsSync(join(skillsRoot, owner, 'scripts', `${line.check.arg}.mjs`))))
        error(`${where}:${line.lineNo}`, `\`script ${line.check.arg}\` names no script: neither skills/${skill}/scripts/ nor skills/method/scripts/ has ${line.check.arg}.mjs`);
    numbers.set(number, new Set(scenario.items));
  }
  const map = parseItemMap(readFileSync(join(dir, 'README.md'), 'utf8'));
  for (let item = FIRST_ITEM; item <= LAST_ITEM; item++) {
    const cellValue = map.get(item);
    if (cellValue === undefined || !cellValue.trim()) {
      error(`${at}README.md`, `no row for the checklist's item ${item}: name its scenarios, or say why it doesn't apply`);
      continue;
    }
    for (const named of new Set(cellValue.match(/\b\d{2}\b/g) ?? [])) {
      if (!numbers.has(named)) error(`${at}README.md`, `item ${item} names scenario ${named}, which doesn't exist`);
      else if (!numbers.get(named).has(item)) error(`${at}README.md`, `item ${item} names scenario ${named}, whose Items row doesn't hold ${item}`);
    }
  }
  for (const [number, items] of numbers)
    for (const item of items)
      if (!new Set(map.get(item)?.match(/\b\d{2}\b/g) ?? []).has(number))
        error(`${at}${number}`, `covers item ${item}, which the README's row for ${item} doesn't name`);
}

const runLogFile = join(testsRoot, 'RUNS.md');
if (!runner) {
  // The public tree holds no runner, no scenarios and no run log.
} else if (!existsSync(runLogFile)) error('tests/RUNS.md', `missing`);
else {
  const { header, body } = headedTable(readFileSync(runLogFile, 'utf8'));
  const RUN_COLUMNS = ['Date', 'Host', 'Model', 'Scenario', 'Result', 'Cost', 'Tokens and time', 'Plugin', 'Read', 'Run'];
  if (header.map(cellText).join('|') !== RUN_COLUMNS.join('|')) error('tests/RUNS.md', `the log's columns aren't ${RUN_COLUMNS.join(', ')}`);
  for (const { lineNo, cells } of body) {
    const where = `tests/RUNS.md:${lineNo}`;
    if (cells.length !== RUN_COLUMNS.length) error(where, `a row of ${cells.length} cells, not ${RUN_COLUMNS.length}`);
    else {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(cells[0])) error(where, `the date "${cells[0]}" isn't YYYY-MM-DD`);
      if (!/^(pass|fail at |void: )/.test(cells[4])) error(where, `the result "${cells[4]}" isn't pass, "fail at …" or "void: …"`);
    }
  }
}

// ---- Machine paths --------------------------------------------------------------------------

// No text file names a folder on someone's machine. docs/IDEA.md is the one exception: it is the
// owner's own text, which stays as written.
const TEXT_FILE = /\.(md|json|js|mjs|cjs|ts|ya?ml|toml|txt|sample|html|css)$|(^|\/)\.(gitignore|gitattributes|env\.example)$/;
const MACHINE_PATHS = [
  /\b[A-Za-z]:[\\/]+(?:Users|Documents and Settings)[\\/]/i, // a Windows user folder
  /(?:^|[\s"'`(])\/[a-z]\/Users\//i, // the same, as Git Bash writes it
  /(?:^|[\s"'`(])\/Users\/[^/\s]+\//, // a macOS user folder
  /(?:^|[\s"'`(])\/home\/[^/\s]+\//, // a Linux user folder
];
const textFiles = files.filter((file) => TEXT_FILE.test(file) && file !== 'docs/IDEA.md');
for (const file of textFiles) {
  readFileSync(join(root, file), 'utf8')
    .split(/\r?\n/)
    .forEach((line, index) => {
      if (MACHINE_PATHS.some((pattern) => pattern.test(line))) error(`${file}:${index + 1}`, `names a folder on a machine`);
    });
}

// ---- The OpenCode entry ---------------------------------------------------------------------

// The entry runs against a stand-in for the host. OpenCode 1.x calls every function the module
// exports by name, and the plugin's config hook adds skills/ to skills.paths. OpenCode 2.x calls
// the default export's setup(), which adds each skill through ctx.skill.transform.
const entryPath = pkg.main ?? '.opencode/plugins/gradatim.js';
try {
  const entry = await import(pathToFileURL(join(root, entryPath)).href);
  const skillsPath = join(root, 'skills');
  const named = Object.entries(entry).filter(([key, value]) => key !== 'default' && typeof value === 'function');
  if (named.length !== 1)
    error(entryPath, `exports ${named.length} functions by name; OpenCode 1.x calls each one as a plugin, so export only the plugin`);
  const hooks = named.length > 0 ? await named[0][1]({}) : {};
  const oldConfig = {};
  await hooks?.config?.(oldConfig);
  if (!(oldConfig.skills?.paths ?? []).some((path) => resolve(path) === skillsPath))
    error(entryPath, `OpenCode 1.x: the config hook doesn't add skills/ to skills.paths`);
  const newConfig = { skills: [] };
  await hooks?.config?.(newConfig);
  if (!Array.isArray(newConfig.skills) || newConfig.skills.length > 0)
    error(entryPath, `OpenCode 2.x: the config hook changes the config's list of skills`);
  if (entry.default?.id !== name) error(entryPath, `the default export's id isn't "${name}"`);
  const added = [];
  await entry.default?.setup?.({ skill: { transform: async (change) => change({ add: (skill) => added.push(skill) }) } });
  const addedIds = added.map((skill) => skill.id).sort().join(', ');
  const expectedIds = [...skillNames].sort().join(', ');
  if (addedIds !== expectedIds) error(entryPath, `OpenCode 2.x: setup() adds [${addedIds}], not the skills [${expectedIds}]`);
  for (const skill of added) {
    if (!skill.path || !existsSync(skill.path)) error(entryPath, `OpenCode 2.x: the skill "${skill.id}" has no path to its SKILL.md`);
    if (skill.name !== skill.id) error(entryPath, `OpenCode 2.x: the skill "${skill.id}" is named "${skill.name}"`);
    if (!skill.content?.trim() || skill.content.startsWith('---'))
      error(entryPath, `OpenCode 2.x: the skill "${skill.id}" has no body, or keeps its frontmatter`);
    if (skill.id in skillDescriptions && skill.description !== skillDescriptions[skill.id])
      warn(entryPath, `OpenCode 2.x reads the description of "${skill.id}" differently from YAML: ${JSON.stringify(skill.description)}`);
  }
  await entry.default?.setup?.({}); // OpenCode 1.x calls setup() too, with no skill domain
  const index = await import(pathToFileURL(join(root, 'index.js')).href);
  if (index.default !== entry.default) error('index.js', `doesn't re-export the OpenCode entry's default export`);
} catch (e) {
  error(entryPath, `the OpenCode entry fails: ${e.message}`);
}

// ---- Claude Code's validator ----------------------------------------------------------------

// It checks the marketplace and the plugin's manifest, but not the skills (Claude Code 2.1.301).
// On Windows, claude is a .cmd file, which only a shell runs; the targets hold no spaces. `where`
// finds it there by its exit code, since cmd says "not recognized" in the system's language.
const claudeFound = process.platform !== 'win32' || spawnSync('where', ['claude'], { stdio: 'ignore' }).status === 0;
let claudeResult = claudeFound ? 'passed' : 'skipped, since claude is not on the PATH';
for (const target of claudeFound ? ['.', '.claude-plugin/plugin.json'] : []) {
  const options = { cwd: root, encoding: 'utf8' };
  const run =
    process.platform === 'win32'
      ? spawnSync(`claude plugin validate ${target} --strict`, { ...options, shell: true })
      : spawnSync('claude', ['plugin', 'validate', target, '--strict'], options);
  if (run.error) {
    claudeResult = 'skipped, since claude is not on the PATH';
    break;
  }
  const output = `${run.stdout ?? ''}${run.stderr ?? ''}`;
  if (run.status !== 0) {
    claudeResult = 'failed';
    const lines = output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    error(`claude plugin validate ${target}`, lines.join(' | '));
  }
}

for (const line of errors) console.log(`error    ${line}`);
for (const line of warnings) console.log(`warning  ${line}`);
console.log(
  `checked 5 manifests, ${skillNames.length} skills${testSkillNames.length ? ` and ${testSkillNames.length} that only the tests load` : ''} against the contract, ${guideCount} guides, ${mapNames.length} host maps, ` +
    `${steps.length} steps and ${documentCount} documents in the method, ` +
    `${runner ? `${scenarioCount} scenarios` : `no scenarios, since the runner isn't in this tree`}, ` +
    `${linkCount} links in ${markdownFiles.length} Markdown files, ` +
    `${textFiles.length} files for machine paths, and the OpenCode entry; claude plugin validate ${claudeResult}. ` +
    `${errors.length} errors, ${warnings.length} warnings.`,
);
process.exitCode = errors.length > 0 ? 1 : 0;
