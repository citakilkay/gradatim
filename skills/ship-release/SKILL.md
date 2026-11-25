---
name: ship-release
description: "Ships a Gradatim project's release by its runbook, checks it once it is out, records it, and rolls it back when the check fails. Use when the user asks for Gradatim's release step, or to ship, release or deploy what the sprints built."
license: MIT
---

# Release

The twelfth step of Gradatim's cycle, after a sprint's close, or whenever the user asks. It ships what the closed sprints built, by the project's runbook: the version, the release's steps, and the check once it is out. It records the release, rolls it back by the runbook when the check fails, and adds to the runbook what the release taught. The fix for a failed release is new sprint's, and a change to how the project deploys is architecture's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the runbook, the commands and the tasks to ship, read; the gate run; the agreement; and at the yes the version's commit, the release's steps, the check, a rollback where it fails, and the record. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's release step, or to ship, release or deploy what the sprints built.
- Not for a sprint's close: that is `close-sprint`. Not for a task's pull request: that is `draft-pr`. Not for a missing runbook, or a change to how the project deploys: that is `write-architecture`. Not for the fix of a failed release: that is `new-sprint`. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |
| Agent docs | `docs/agents/<topic>.md` | reads |
| Architecture | `docs/ARCHITECTURE.md` | reads |
| Runbook | `docs/RUNBOOK.md` | reads, changes |
| Release record | `docs/RELEASES.md` | reads, creates, changes |
| Sprint rules and index | `docs/sprints/README.md` | reads |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | reads |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | reads |

Of the project's own files, it changes only the version, where the runbook bumps one. It runs the project's commands as the runbook names them, writes no `CLAUDE.md`, runs no sync, and changes nothing sealed. Accounts, keys and sign-ins stay the user's.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · release**`, the reply to the user's last answer too, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If `docs/RUNBOOK.md` is missing, or lacks one of `## Before a release`, `## A release`, `## The check` and `## A rollback`, stop. If the user didn't ask for this step, as with a remark on what production shows, answer what they did say, then say in a line what it would ship and that its push reaches production, and wait for the yes. Nothing is written before the agreement's yes, and no git write runs: read origin with `git ls-remote --heads origin`, which changes nothing where a fetch would.
   - **What ships:** each `completed` or `completed-as-partial` task whose work users run, from any closed sprint, that no entry of `docs/RELEASES.md` holds; and the tasks of an entry that was rolled back, again. With nothing to ship, stop.
   - **From where:** where tasks are built on the base, as the development cycle's Branch line or their start rows say, the base as it stands. Where they go through pull requests, the base as origin holds it, read with `git ls-remote --heads origin`; a sprint's pull request that isn't merged stops the release. Name each commit to ship that no closed task holds, such as a task built and not closed.
   - **Git:** read the user's rules about git, in `AGENTS.md`, `docs/agents/development-cycle.md` and their own words. A rule of theirs that bars git writes makes the commit and the push theirs: write the version's files, and give them the commands.

   [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when what ships, and from where, is known.
2. **Before.** Read the runbook, `docs/agents/commands.md` and the architecture's `## Deployment`. A command the release needs that the commands mark `planned` stops it, as "Stop" says. Run each line of `## Before a release` that runs here and reaches no production, such as the gate: a line that fails stops the release. Propose the version from the one the manifest names: minor where it ships new work users run, patch for fixes alone, and never 1.0 unless the user asks. Then sort each line of the runbook's four parts as one of:
   - **mine:** a command, a page fetched, or what a user sees, through the project's own browser tests pointed at the production address where it has them, else a browser tool, where the host has one;
   - **yours:** what needs the user's hands, such as a dashboard, a sign-in or a secret, given as numbered steps, each with what they should see;
   - **at the yes:** what this step does once the user agrees, such as the version's bump;
   - **not this release's:** a line that waits on work no task has built, such as a story's part that a deferred item or an open issue holds, named with what it waits for.

   A line is sorted now, never after the yes. Ask nothing here. Done when the gate passed and every line is sorted.
3. **Agree.** Show the summary in one reply, in this shape:

   ```
   **The release:** <version>, after <the last entry's, or none>: <minor: new work users run | patch: fixes alone>. It ships <ID> (sprint <n>), …, from `<short sha>` on `<branch>`: <n> commits that origin lacks<, with <ID>'s, built but not closed>.
   **Before it**
   - <each line>: passed, by `<command>` | at the yes | yours: <what> | not this release's: <what it waits for>
   **Its steps**
   1. <each step of "A release">: mine, `<command>` | yours: <what you do, and what you should see>
   **The check,** at <the production address, or where it is read>
   - <each line>: mine, by <a command, a fetch, the browser tests there> | yours | not this release's: <what it waits for>
   **If a line fails:** <the rollback's steps, each mine or yours>, at once, then <its check>. <What it can't undo>.
   **What the yes writes:** the commit "Release <version>" with <files>, then <the push>, which reaches production; after the check, the entry in `docs/RELEASES.md` and what the release taught in the runbook, which no commit holds until the next step's.
   ```

   Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, ship it
   2. Not yet: say what to change
   ```

   Make a change, show what changed, and ask again. On the yes, and only then, in this order:
   1. **The version,** where the runbook bumps one: its files, then one commit, `git commit -m "Release <version>"`, of those files staged by path, never the whole tree or a pattern. Where `npm version` writes them, add `--no-git-tag-version`, since it tags by default. A tag only where the runbook names one.
   2. **The release's steps,** in the runbook's order: run each marked mine, and give the user each marked yours as numbered steps, each with what they should see. Where a later step waits on one of theirs, ask them to say when it's done, and end your reply. A command the host refuses becomes theirs, with what it should show.
   3. **The check,** at the production address: each line marked mine, then each marked yours.
   4. **A line that fails:** the runbook's rollback, at once, then its own check. A rollback step of the user's is given as numbered steps, and you wait for their word. Never fix the code here: the fix opens the next sprint. Where the runbook says the release can't be undone, don't roll back: the fix goes forward.
   5. **The record:** the entry in `docs/RELEASES.md`, from [the template](assets/record.md), creating the file where there is none; and what the release taught, written into the runbook where it belongs, with its change-log row, or nothing where it taught nothing. Then run, until each ends with "0 faults":

      ```
      node <this skill's folder>/scripts/check-release.mjs <the project's folder>
      node <this skill's folder>/../method/scripts/check-architecture.mjs <the project's folder>
      ```

      No commit and no push for these: a push now would deploy again, so the next step's commit takes them.

   Under a rule of the user's that bars git writes, run no git command: show the commit and the push as theirs, and wait for their word before the check. Done when the release is out and checked, or rolled back, and the record says so.
4. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state: after a rollback, new sprint, which puts the fix first; otherwise review where it is due, else new sprint. Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. End with:

   ```
   **Release: done.**
   **Released:** <version>, from `<short sha>` on `<branch>`: <the tasks>. <Or: rolled back on YYYY-MM-DD: <the line that failed>.>
   **The check:** <each line: passed, by what | not this release's: why | failed: what showed it>.
   **Written:** <the entry, linked>; <the runbook's lesson>, or none. No commit holds them: the next step's takes them.
   **Git:** the commit "<message>" on `<branch>`, pushed | under your rule, the commands you ran.
   **Open:** <your steps not done; a line not checked>, or nothing.
   **Next:** <new sprint, with the fix first | review | new sprint>, with `<skill>`: <why>.
   1. Start `<skill>` now (Recommended)
   2. Stop here
   ```

   Start it only at the user's word. Done when the user chose.

## Stop

- In each case below, write nothing, make no git write, and reply:

  ```
  **Gradatim · release**

  **Release: stopped.** <The reason>: <what you found>. Nothing was written.
  **Next:** <the step that clears it>, with `<skill>`: <why>.
  1. Start `<skill>` now (Recommended)
  2. Stop here
  ```

  | Case | Next |
  |---|---|
  | `AGENTS.md` has no line "The documents flow top-down: …" | init, with `init-project`: it sets the project up |
  | No runbook, or one that lacks a part | architecture, with `write-architecture`: it writes the runbook |
  | Nothing to ship | review where it is due, else new sprint |
  | A command the release needs is `planned` | the step for the task that builds it, else new sprint |
  | A line of `## Before a release` fails | new sprint, which takes the fix; nothing is shipped or recorded |
  | A sprint's pull request isn't merged | none: the user merges it, then runs the release again, so the reply has no option |
  | The user stops at the agreement | the cycle's next step for the project's state |

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.
