// Shelf's guard: everything under docs/ is the team's own, written by hand.
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const slashed = (path) => String(path ?? '').split(String.fromCharCode(92)).join('/');
const cwd = slashed(input.cwd).replace(/\/+$/, '');
const path = slashed(input.tool_input?.file_path ?? input.tool_input?.notebook_path);
const rel = path.toLowerCase().startsWith(`${cwd.toLowerCase()}/`) ? path.slice(cwd.length + 1) : path;

if (/^docs\//.test(rel)) {
  console.error("Refused by Shelf's hook in .claude/settings.json: everything under docs/ is the team's own, written by hand.");
  process.exit(2);
}
process.exit(0);
