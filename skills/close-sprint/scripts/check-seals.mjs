// Lists the seals of a Gradatim project for the close sprint step (../SKILL.md), which checks with git
// that nothing sealed has changed since its seal, as ../../method/references/documents.md says. A task
// closed or deferred, its design, a closed sprint's README, a review report and a demo are sealed. The
// seals are read by the sync's check, ../../method/scripts/check-docs.mjs, which compares each sealed
// document with the commit that sealed it.
// - It prints each sealed document that changed or was deleted since its seal, with the seal's commit;
// - under "notes:", each seal that no commit holds yet, which the close's own commit holds from then on;
// - and a last line, "checked <n> seals: <k> changed since their seal".
// With --put-back it writes each changed or deleted document back as its seal's commit holds it, byte
// for byte, prints "put back as it was sealed in <commit>" for each, and reads the seals again. It
// makes no git write: the files it put back wait for the step's commit. Without --put-back it writes
// nothing. It reads no network.
//
// Usage, from the project's folder or anywhere:
//   node <this skill's folder>/scripts/check-seals.mjs [<project folder>] [--put-back] [--offline]
// The folder is the current one by default. --offline changes nothing. Exit code 1 when a sealed
// document differs from its seal at the end. With no git, or no commit yet, it says so and exits 0.

import { existsSync, mkdirSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sealsOf } from '../../method/scripts/check-docs.mjs';

const differs = (seal) => seal.state === 'changed' || seal.state === 'deleted';

// A project's seals: how many a commit holds, which of them differ now, which were put back, and a
// note for each that can't be compared. `unchecked` says why nothing was read, or is null.
export function readSeals(dir, { putBack = false } = {}) {
  const root = resolve(dir);
  let { unchecked, seals } = sealsOf(root);
  const restored = [];
  if (putBack) {
    for (const seal of seals.filter(differs)) {
      const path = join(root, seal.path);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, seal.text);
      restored.push({ path: seal.path, commit: seal.commit });
    }
    if (restored.length > 0) ({ unchecked, seals } = sealsOf(root));
  }
  const notes = [];
  for (const { path, commit, state } of seals) {
    if (state === 'uncommitted') notes.push(`${path}: sealed, not yet committed, so its seal isn't checked`);
    else if (state === 'absent') notes.push(`${path}: not in its seal's commit ${commit.slice(0, 7)}, so its seal isn't checked`);
  }
  return {
    unchecked,
    checked: seals.filter((seal) => seal.text !== null).length,
    changed: seals.filter(differs).map(({ path, state, commit }) => ({ path, state, commit })),
    putBack: restored,
    asked: putBack,
    notes,
  };
}

export function formatSeals(result) {
  if (result.unchecked) return [`seals: not checked: ${result.unchecked}`];
  const lines = [
    ...result.putBack.map(({ path, commit }) => `${path}  put back as it was sealed in ${commit.slice(0, 7)}`),
    ...result.changed.map(({ path, state, commit }) => `${path}  ${state} since its seal in ${commit.slice(0, 7)}`),
  ];
  if (result.notes.length > 0) lines.push('notes:', ...result.notes.map((note) => `  ${note}`));
  lines.push(`checked ${result.checked} seals: ${result.asked ? `${result.putBack.length} put back, ` : ''}${result.changed.length} changed since their seal`);
  return lines;
}

// Whether node started this file. A symlink or a junction in its path makes process.argv[1] differ
// from import.meta.url, which node resolves to the real path: the script would then do nothing, and
// exit 0, as if no seal differed.
function startedHere() {
  try {
    return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (startedHere()) {
  const args = process.argv.slice(2);
  const [dir = '.'] = args.filter((arg) => arg !== '--offline' && arg !== '--put-back');
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    console.log(`${dir}: no such folder`);
    process.exitCode = 1;
  } else {
    const result = readSeals(dir, { putBack: args.includes('--put-back') });
    for (const line of formatSeals(result)) console.log(line);
    process.exitCode = result.changed.length > 0 ? 1 : 0;
  }
}
