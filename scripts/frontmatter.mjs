// A SKILL.md's frontmatter, which scripts/check.mjs checks and scripts/guides.mjs copies into a skill's guide. It moved
// here from the check, unchanged, so that both read it alike (REL-1).

// Reads a SKILL.md's frontmatter in the part of YAML that skills use: `key: value` lines, quoted
// values, block scalars (`>` or `|`), and nested `key: value` lines, as metadata takes. Hosts read
// frontmatter as YAML, so a plain value that YAML reads another way, such as one holding ": " or
// " #", is a problem.
export function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return { fields: {}, problems: ['the file must start with a --- line'] };
  const end = lines.indexOf('---', 1);
  if (end < 0) return { fields: {}, problems: ['the frontmatter has no closing --- line'] };
  const fields = {};
  const blocks = {};
  const problems = [];
  let open = null;
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    if (line === '' || /^\s/.test(line)) {
      if (open) open.lines.push(line.trim());
      else if (line.trim()) problems.push(`line ${i + 1} is indented under no key`);
      continue;
    }
    if (line.startsWith('#')) continue;
    open = null;
    const match = /^([A-Za-z0-9_-]+):(?: (.*))?$/.exec(line);
    if (!match) {
      problems.push(`line ${i + 1} isn't a "key: value" line`);
      continue;
    }
    const [, key, raw = ''] = match;
    const value = raw.trim();
    if (key in fields || key in blocks) problems.push(`"${key}" appears twice`);
    if (value === '' || /^[>|][+-]?$/.test(value)) {
      open = blocks[key] = { style: value[0] ?? 'map', lines: [] };
    } else if (value.startsWith('"')) {
      try {
        fields[key] = JSON.parse(value);
      } catch {
        problems.push(`"${key}" has a double-quoted value that doesn't close cleanly`);
      }
    } else if (value.startsWith("'")) {
      if (/^'(?:[^']|'')*'$/.test(value)) fields[key] = value.slice(1, -1).replaceAll("''", "'");
      else problems.push(`"${key}" has a single-quoted value that doesn't close cleanly`);
    } else if (/^[[\]{}&*!%@`|>]|^[-?:](?:\s|$)|: | #|:$/.test(value)) {
      problems.push(`"${key}" has a plain value that YAML reads another way: quote it`);
    } else {
      fields[key] = value;
    }
  }
  for (const [key, block] of Object.entries(blocks)) {
    if (block.style === '>') fields[key] = block.lines.join(' ').replace(/\s+/g, ' ').trim();
    else if (block.style === '|') fields[key] = block.lines.join('\n').trim();
    else if (block.lines.every((line) => !line)) fields[key] = '';
    else {
      fields[key] = {};
      for (const line of block.lines.filter(Boolean)) {
        const pair = /^([A-Za-z0-9_.-]+):(?: (.*))?$/.exec(line);
        if (pair) fields[key][pair[1]] = (pair[2] ?? '').replace(/^(["'])(.*)\1$/, '$2');
        else problems.push(`"${key}" holds a line that isn't "key: value"`);
      }
    }
  }
  return { fields, problems };
}
