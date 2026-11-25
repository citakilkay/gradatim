// Shelf's guard: the team's own sprints and decisions are written by hand, and only the team lead commits.
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const slashed = (path) => String(path ?? '').split(String.fromCharCode(92)).join('/');
const cwd = slashed(input.cwd).replace(/\/+$/, '');
const path = slashed(input.tool_input?.file_path ?? input.tool_input?.notebook_path);
const rel = path.toLowerCase().startsWith(`${cwd.toLowerCase()}/`) ? path.slice(cwd.length + 1) : path;
const command = String(input.tool_input?.command ?? '');

if (/^docs\/(sprints|decisions)\//.test(rel)) {
  console.error("Refused by Shelf's hook in .claude/settings.json: docs/sprints/ and docs/decisions/ are the team's own, written by hand.");
  process.exit(2);
}
if (/\bgit\b[^|;&]*\bcommit\b/.test(command)) {
  console.error("Refused by Shelf's hook in .claude/settings.json: only the team lead commits.");
  process.exit(2);
}
process.exit(0);
