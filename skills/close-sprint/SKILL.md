---
name: close-sprint
description: "Closes a Gradatim project's open sprint, with what is left deferred, its critical changes shown again, and the main documents brought in line. Use when the user asks for Gradatim's close sprint step, or to close, end or wrap up a sprint."
license: MIT
---

# Close sprint

The eleventh step of Gradatim's cycle, and the last of the delivery loop. It closes the open sprint: the tasks left to do are deferred at the user's word, the sprint's critical changes are shown again by what runs, the issues and deferred items it took are ended, the stories it delivered are marked, and the sprint is sealed, with the main documents brought in line. A task's close is close task's, its pull request draft PR's, the release release's, and the review review's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the board, the tasks' last rows, the items and the seals, read; one question on the tasks left; one check in a subagent, with a question on what it couldn't show; the agreement; and at the yes the rows, the statuses, the items, the stories and the progress, the sync in a subagent, and one commit. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's close sprint step, or to close, end or wrap up the open sprint.
- Not for a built task's close: that is `close-task`. Not for a closed task's pull request: that is `draft-pr`. Not for a new task, or the next sprint: that is `new-sprint`. Not for shipping: that is `ship-release`. Not for the review: that is `review-project`. Not for a change of direction: that is `decide-direction`. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |
| Agent docs | `docs/agents/<topic>.md` | reads |
| Architecture | `docs/ARCHITECTURE.md` | reads |
| Release record | `docs/RELEASES.md` | reads |
| MVP | `docs/MVP.md` | reads, changes |
| Roadmap | `docs/ROADMAP.md` | reads, changes |
| Phase | `docs/PHASE-<k>.md` | reads, changes |
| Sprint rules and index | `docs/sprints/README.md` | reads, changes |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | reads, changes |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | reads, changes |
| Design | `docs/plans/<ID>-<slug>-design.md` | reads |
| Issue | `docs/issues/YYYY-MM-DD-<ID>-<topic>.md` | reads, changes |
| Deferred item | `docs/deferred-items/YYYY-MM-DD-<origin>-<topic>.md` | reads, creates, changes |

It deletes an issue or a deferred item at its end, as the map says. It runs the project's gate, in the check, and writes none of the project's own files, and no `CLAUDE.md`. The map's other documents change only through [the sync](../method/references/sync.md), at the yes. It never changes a sealed document: one that differs from its seal is put back as it was sealed, at the user's word.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · close sprint**`, the reply to the user's last answer too, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If the user didn't ask for this step, as with a remark that a sprint has run long, answer what they did say, then say in a line what it would write, and wait for the yes. The open sprint is the one `docs/sprints/README.md` lists `open`; with none, stop. Nothing is written before the agreement's yes, but for a seal put back at the user's word: a close that stops leaves the project as it was, but for what it put back.
   - **Git:** read the user's rules about git, in `AGENTS.md`, `docs/agents/development-cycle.md` and their own words. A rule of theirs wins: where one bars git writes, make none, and the final message shows the commands. Otherwise settle where the commit will go, by reading alone, since a fetch or a switch is a write, and this step makes none before the yes:
     - **the base,** where the sprint's tasks are built on it, as the development cycle's Branch line or their start rows say. It is never pushed;
     - **the branch HEAD is on,** where tasks go through pull requests, HEAD is on the last task's branch, and `gh pr list --head <branch> --json url,state` lists its pull request open. The commit is pushed, so that the sprint's last pull request carries the close;
     - **a branch of its own,** `close-sprint-<n>`, where tasks go through pull requests, in every other case: HEAD on the base, that pull request merged or closed, or a command that can't tell. It is made at the yes, and not pushed.

   [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when the sprint is known, and where the commit goes, or that a rule of the user's bars it.
2. **Gate.** Read the sprint's README, with its board and its log; each task's header, criteria and last rows; the issues and the deferred items; and the sprint rules. Then run, in this order:

   ```
   node <this skill's folder>/scripts/check-seals.mjs <the project's folder>
   node <this skill's folder>/../method/scripts/check-design.mjs <the project's folder>
   ```

   The first checks with git that no sealed document has changed since its seal. A seal that no commit holds yet is a note there: the agreement names it, and the close's commit holds it from then on. The second runs the sprints' and the documents' checks too: a fault it names goes in the agreement, with the step that clears it. Then ask what applies, each in a reply of its own, in this order:
   - **A sealed document that changed.** After the script's lines, which name each document and its seal's commit:

     ```
     <n> sealed documents changed since their seal. A sealed document stays as it closed.
     1. Put each back as it was sealed (Recommended): a change that no commit holds is lost
     2. Stop here: I look at the changes first
     ```

     On 1, run the first command again with `--put-back` after the folder, which writes each sealed text back, and go on. On 2, stop, as "Stop" says.
   - **A task that is built and not closed:** `in-progress`, with a row that opens "Built by the build task step". And **a closed task whose pull request is due,** as [the cycle](../method/references/cycle.md) says, with no row in the sprint's log that links it: a sealed README takes no row. Stop once for all of them, as "Stop" says, with its way on.
   - **The tasks left,** `to-do` or `in-progress`:

     ```
     **The tasks left to do**
     <n> tasks of sprint <k> aren't closed. Each becomes `deferred`, and one deferred item carries what it still needs.
     - <ID> · <title>, `<status>`: <what its item would carry, in a line>.
     1. Defer them as listed (Recommended)
     2. Defer them, with changes: name a task to drop, which carries nothing, or say what an item should carry
     3. Keep the sprint open: nothing is written
     ```

     An item carries the parts still needed, never a copy of the task: what is built stays out. What an issue or an item the task took still holds stays in that file, which goes back to `open`, so a task whose taken file holds all it needs gets no item. A task the user drops, or one that its log says a decision made obsolete, carries nothing. On 3, stop, as "Stop" says.

   Done when no seal differs, and each task left has the user's word.
3. **Check.** The second look the idea asks for at a sprint's close: each critical change shown again by what runs, on the sprint's final state. It is lighter than a task's close, and reviews no code again, since each task's close had its review. Skip it where the sprint closed no task.
   - **The list:** from the closed tasks' criteria, closing rows and designs, the changes that are critical: money, security, kept data, how a release goes out, a seam two tasks share, and a finding that a task's close left. Number them C1, C2 …, each with its task and what its close says shows it.
   - **The checker:** hand the check to one fresh subagent, on the model your host's map gives a verification. Its brief says to read [the check's brief](assets/check.md) by its absolute path and follow it, and gives the absolute paths of the project, the sprint's README and the commands doc, the list, and today's date. A host with no subagents runs the check here, from the same brief, and keeps its lines apart.
   - **Its lines** go to the user as they came. Where the gate fails, a change fails or isn't shown, or the checker declined to judge something, ask after them, in plain text, and end your reply:

     ```
     What do I do with them?
     1. Defer each as a deferred item of this sprint's close (Recommended)
     2. Keep the sprint open, and add a task for the work: nothing is written
     3. Leave them: say why, and the sprint's closing row keeps your reason
     ```

     On 1, each gets an item at the yes, whose origin is `sprint-<n>`. On 2, stop, as "Stop" says.

   Done when each change is shown, deferred, or left at the user's word.
4. **Agree.** Show the summary in one reply, in five parts:
   - **The tasks:** each closed, deferred with what its item carries, or dropped;
   - **The check:** each change shown, deferred, or left with the user's reason;
   - **The items and issues:** each item to write; each file to delete, since the task that took it is `completed`; each to set back to `open`; and each left as it is, since no task took it;
   - **The documents:** each story to mark `delivered`; the roadmap's Progress line; what the sprint taught, in up to three lines read from its logs, such as days that moved at the designs, tasks added mid-sprint and a question that came back; a rule of the sprints that this would change, with its new words; and the sync's list, the main documents: the concept, the MVP, the roadmap, the phases, the architecture, the runbook, `AGENTS.md` and the agent docs;
   - **What the yes writes:** the marks below; each seal that no commit holds yet; and the commit, with its branch and whether it is pushed, or under a rule of the user's the commands they run.

   A story is delivered when it is `planned`, a task of this sprint names it, and every task of this sprint that names it is `completed` or `completed-as-partial`, with no part of it waiting: a criterion moved to a task that isn't closed, or a split whose other part the sprint's Scope leaves for later. A setup task, whose Story is a milestone, delivers none.

   Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   Make a change, show what changed, and ask again. A critical change the user adds is shown first, as the check shows one. On the yes, and only then, read [the rows](assets/rows.md), and write in this order:
   1. **The rows,** while the sprint is open: each deferred task's row in its log, and the sprint's closing row.
   2. **The check:** check-design again, and fix what it names.
   3. **The statuses,** together: `deferred` in each such task's header and on the board; and `closed YYYY-MM-DD` in the README's header and in the rules' row, with the rules' change-log row, and a rule the user agreed to change. This seals the README, and each deferred task with its design.
   4. **The items:** each new one from [its template](assets/deferred-item.md); each file whose task is `completed`, deleted as a plain file, not by `git rm`; and each other taken file back to `Status: open`, with its row.
   5. **The plan:** `delivered` on each story's line, where the story sits whole, with a change-log row; and the roadmap's Progress line, with its row.
   6. **The sync:** run [the sync](../method/references/sync.md) for the closed sprint: hand it to a subagent with the brief the sync gives, and the main documents as its list; a host with no subagents runs it here. Keep its report as it came.
   7. **The checks:** check-design once more, then `node <this skill's folder>/../method/scripts/check-plan.mjs <the project's folder>`, and fix what they name in a living document.
   8. **The commit,** last, so that it holds the rest, unless a rule of the user's bars git writes:

      ```
      git add <each path the close and the sync wrote, deleted or put back, and each final Gradatim document that no commit holds>
      git commit -m "<one or two sentences>"
      git push origin <branch>
      ```

      On a branch of its own, `git switch -c close-sprint-<n>` comes first. The push runs only on a task's branch whose pull request is open. Stage each path by name, a deleted file too: never the whole tree, or a pattern such as `*.md`. The message has no description, and no `$`, `%`, `!`, backticks or double quotes. Under a rule that bars git writes, run none of them, and show them.

   Done when the marks are written, the checks end with "0 faults", and the commit is made or its commands shown.
5. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state: the release where there is something to ship, then the review where it is due, then the new sprint. Name each of them that is due, in that order, and say of each whose `../<skill>/SKILL.md` doesn't exist that it isn't installed yet. Offer the first that is installed. End with:

   ```
   **Close sprint: done.**
   **Closed:** sprint <n>, on YYYY-MM-DD: <the tasks closed>; <each task deferred, with its item's file name, or dropped>.
   **Items:** <each written, each deleted and each back to `open`, by its file name; each issue left open>, or none.
   **Delivered:** <the stories marked `delivered`>, or no story.
   <the sync's drift report, word for word as it came back, from "**Drift report**" on>
   **Git:** <the commit's message, on `<branch>`, pushed or not>, or, under the user's rule, the commands to run.
   **Open:** <what the check left, with the user's reason; a branch to push or a pull request to merge; each seal that no commit holds, which can't be checked until it is committed; what the report left for another step>, or nothing.
   **Review:** <due: two sprints have closed since the last review, or in all where none has run; or not due yet>.
   **Next:** <release, review or new sprint>, with `<its skill>`: <why>. <Each due step whose skill isn't installed, named so.>
   1. Start `<the first due step's skill that is installed>` now (Recommended)
   2. Stop here
   ```

   Start it only at the user's word. Done when the user chose.

## Stop

- If `AGENTS.md` has no line "The documents flow top-down: …", write nothing, and reply:

  ```
  **Gradatim · close sprint**

  **Close sprint: stopped.** This folder holds no Gradatim project: <what you found>. Nothing was written.
  **Next:** init, with `init-project`: it sets the project up.
  1. Start `init-project` now (Recommended)
  2. Stop here
  ```
- If no sprint is open, write nothing, and reply:

  ```
  **Gradatim · close sprint**

  **Close sprint: stopped.** No sprint is open: <what you found>. Nothing was written.
  **Next:** new sprint, with `new-sprint`: it plans the next sprint's tasks.
  1. Start `new-sprint` now (Recommended)
  2. Stop here
  ```
- If a task is built and not closed, or a closed task's pull request is due and not linked, write nothing, and reply, naming each such task:

  ```
  **Gradatim · close sprint**

  **Close sprint: stopped.** <ID> is built and not closed: <its last row>. <ID> is closed, and no row of the sprint's log links its pull request. Nothing was written.
  **Next:** <close task, with `close-task`, or draft PR, with `draft-pr`>, for <the first of them>: <it seals the task, or it opens the pull request and writes its row>.
  1. Start `<its skill>` now (Recommended)
  2. Go on without it
  3. Stop here
  ```

  On 2, go on with the gate: a built task then counts among the tasks left, and a pull request with no row stays so, named in the final message's Open.
- If the user keeps the sprint open, at a changed seal, the tasks left or the check, write nothing, and reply:

  ```
  **Gradatim · close sprint**

  **Close sprint: stopped.** Sprint <n> stays `open`: <why>. Nothing was written.
  **Next:** <the step for the sprint's next task, or new sprint for the task to add>, with `<its skill>`, for <the task>: <why>.
  1. Start `<its skill>` now (Recommended)
  2. Stop here
  ```

  Where the user stopped to look at a changed seal, the Next line says to run close sprint again once they have, and the reply has no option.

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. Where a seal was put back before the stop, name each document put back in place of "Nothing was written.", and say that no commit holds it as sealed yet.
