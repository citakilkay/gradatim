// The sample project, Shelf, in tests/sample/: the names that a host or git reads, which end in ".sample" there, and
// the reader of its README's table of states. scripts/check.mjs and the scenario runner read the sample through this
// file, so that the two read it alike.

// Names that a host or git reads in a folder. Under tests/sample/ each ends in ".sample", so that
// none is read while someone works in this repository; the runner takes the suffix off.
export const HOST_READ_NAMES = [
  'AGENTS.md', 'AGENTS.override.md', 'CLAUDE.md', 'CLAUDE.local.md', 'GEMINI.md', '.cursorrules',
  '.gitignore', '.gitattributes', '.gitmodules', '.env', '.mcp.json', 'opencode.json', 'opencode.jsonc',
  '.claude', '.agents', '.codex', '.cursor', '.opencode', '.github', '.vscode',
];

export const cellText = (cell) => cell.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/`/g, '').trim();
// A cell may hold an escaped pipe, "\|", as the run log's cells do.
export const cellsOf = (line) => line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((cell) => cell.trim());
export const isRule = (cells) => cells.every((cell) => /^:?-+:?$/.test(cell));

// The sample's README: its states, with the state below each, the files each removes and whether
// it has git.
export function parseSample(text) {
  const states = new Map();
  let section = '';
  let header = null;
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (/^##\s/.test(line)) {
      section = line.replace(/^##\s+/, '').trim();
      header = null;
      continue;
    }
    if (!/^\s*\|/.test(line)) {
      header = null;
      continue;
    }
    const cells = cellsOf(line);
    if (!header) {
      header = cells.map(cellText);
      continue;
    }
    if (isRule(cells)) continue;
    const row = Object.fromEntries(header.map((name, i) => [name, cells[i] ?? '']));
    const spans = (cell) => [...(cell ?? '').matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    if (section === 'The states')
      states.set(cellText(row.State ?? ''), {
        from: cellText(row.From ?? ''),
        removes: spans(row.Removes),
        git: /^yes\b/i.test(cellText(row.Git ?? '')),
        // "yes, on `master`": the repository's base, where it isn't main, as in a project in progress.
        base: /^yes, on ([\w./-]+)$/i.exec(cellText(row.Git ?? ''))?.[1] ?? null,
        gitCell: cellText(row.Git ?? ''),
        lineNo: index + 1,
      });
  }
  return { states };
}
