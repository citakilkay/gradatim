// The kinds of work a Gradatim skill hands to a subagent, and the model a host's map gives each (MTH-7).
// capabilities.md holds the kinds, in the table under "Hand work to a subagent", with no model in it. A host's
// map may give each kind its model, in its section "A subagent's model": one row per model, its name in a code
// span, then its kinds. scripts/check.mjs holds the skills and the maps to them, and scripts/scenario.mjs reads
// whether a host's map gives a model at all.
import { cellText, tablesIn, unfencedLines, withoutCodeSpans } from '../skills/method/scripts/check-docs.mjs';

const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const spansOf = (line) => [...line.matchAll(/(`+)((?:(?!\1).)+?)\1/g)].map((m) => m[2].trim());

// The kinds, as the capabilities' table names them, in lower case, such as "a lookup" or "research".
export function kindsIn(capabilitiesText) {
  const table = tablesIn(capabilitiesText).find((t) => t.header[0] === 'Kind');
  return table ? table.rows.map((row) => cellText(row.cells[0] ?? '').toLowerCase()).filter(Boolean) : [];
}

// A map's models: for each row of its table "Model | Kinds", the model's name, from the code span in its first
// cell, and its kinds. Null where the map has no such table, as on a host whose map gives no model.
export function mapModels(mapText) {
  const table = tablesIn(mapText).find((t) => t.header[0] === 'Model' && t.header[1] === 'Kinds');
  if (!table) return null;
  return table.rows.map((row) => ({
    line: row.line,
    model: /`([^`]+)`/.exec(row.cells[0] ?? '')?.[1] ?? cellText(row.cells[0] ?? ''),
    kinds: cellText(row.cells[1] ?? '').split(',').map((kind) => kind.trim().toLowerCase()).filter(Boolean),
  }));
}

// What is wrong with a map's models, against the kinds: each kind has exactly one model, and the map names no
// kind that the capabilities' table lacks.
export function mapModelProblems(rows, kinds) {
  const problems = [];
  const given = new Map();
  for (const row of rows)
    for (const kind of row.kinds) {
      if (!kinds.includes(kind)) problems.push(`line ${row.line}: "${kind}" isn't a kind in the capabilities' table`);
      given.set(kind, [...(given.get(kind) ?? []), row.model]);
    }
  for (const kind of kinds) {
    const models = given.get(kind) ?? [];
    if (models.length === 0) problems.push(`no model for the kind "${kind}"`);
    else if (models.length > 1) problems.push(`the kind "${kind}" has ${models.length} models: ${models.join(', ')}`);
  }
  return problems;
}

// What a skill's code span may not name (writing rule 12): a model, by its family or its id, a provider, or an
// effort level. A bare "low", "medium" or "high" is also a severity or a confidence, as in close task's review
// and research's report, so it counts only on a line that speaks of effort.
const FAMILIES = /\b(?:haiku|sonnet|opus|fable)\b/i;
const PROVIDERS = /\b(?:anthropic|bedrock|vertex|openai|deepseek|openrouter)\b/i;
const EFFORT = /^(?:xhigh|max)$|\beffort\b/i;
const LEVELS = /^(?:low|medium|high)$/i;
export function modelWordsIn(line) {
  const aboutEffort = /\beffort\b/i.test(withoutCodeSpans(line));
  return spansOf(line).filter((span) => FAMILIES.test(span) || PROVIDERS.test(span) || EFFORT.test(span) || (aboutEffort && LEVELS.test(span)));
}

// A line that hands work to a subagent: "hand <the job> to a subagent", "give a subagent <the job>", or the
// sync's "In a subagent". It names its kind as "the model your host's map gives <kind>", or it links the sync,
// which names the sync's own kind (writing rule 12). Code spans are set aside before the line is read.
const HAND_OFF = /\bhand(?:s|ing)?\b[^.;:]*?\bto\s+(?:a|an|one|each)\s+(?:[a-z]+\s+)?subagents?\b|\bgives?\s+a\s+subagent\b|^\s*[-*]\s+\*\*In a subagent\*\*/i;
const SYNC_LINK = /\]\((?:\.\.\/method\/references\/)?sync\.md(?:#[^)]*)?\)/;
export function handOffProblems(text, kinds, { stepsOnly = true } = {}) {
  const named = new RegExp(`the model your host[’']s map gives (?:${kinds.map(escaped).join('|')})(?![a-z])`, 'i');
  const problems = [];
  let inSteps = !stepsOnly;
  for (const [lineNo, line] of unfencedLines(text)) {
    if (stepsOnly && /^##\s/.test(line)) {
      inSteps = /^##\s+Steps\s*$/.test(line);
      continue;
    }
    if (!inSteps) continue;
    const plain = withoutCodeSpans(line);
    if (!HAND_OFF.test(plain) || SYNC_LINK.test(line) || (kinds.length > 0 && named.test(plain))) continue;
    problems.push({ line: lineNo, text: line.trim() });
  }
  return problems;
}
