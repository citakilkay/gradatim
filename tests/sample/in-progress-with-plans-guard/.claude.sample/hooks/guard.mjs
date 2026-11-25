// Shelf's guard: designs are the team's own, in docs/specs/, so nothing is written under docs/gradatim/plans/, by a
// file tool or by a command that names the folder.
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const slashed = (path) => String(path ?? '').split(String.fromCharCode(92)).join('/');
const cwd = slashed(input.cwd).replace(/\/+$/, '');
const path = slashed(input.tool_input?.file_path ?? input.tool_input?.notebook_path);
const rel = path.toLowerCase().startsWith(`${cwd.toLowerCase()}/`) ? path.slice(cwd.length + 1) : path;
const command = slashed(input.tool_input?.command);

if (/^docs\/gradatim\/plans(\/|$)/.test(rel) || /docs\/gradatim\/plans/.test(command)) {
  console.error("Refused by Shelf's hook in .claude/settings.json: designs are the team's own, in docs/specs/, so nothing goes under docs/gradatim/plans/.");
  process.exit(2);
}
process.exit(0);
