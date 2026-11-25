---
name: close-task
description: "Closes a built task of a Gradatim project's open sprint, with each acceptance criterion shown, a code review to pick fixes from, and the documents it made stale brought in line. Use when the user asks for Gradatim's close task step, or to close, finish or wrap up a built task."
license: MIT
---

# Close task

The ninth step of Gradatim's cycle, and the third of the task loop. It closes a built task: each acceptance criterion shown with its evidence, one code review whose findings the user picks from, the documents the task made stale brought in line, and the task sealed as `completed` or `completed-as-partial`. The build is build task's, a new task new sprint's "add a task", and the pull request draft PR's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the task, its evidence and its design, read; what changed since the build, checked again; one review in a subagent; the user's picks applied, and the gate run; the project's own docs the task made stale; the agreement; and at the yes the sync in a subagent, the ticks, the seal and one commit. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's close task step, or to close, finish or wrap up a built task of the open sprint.
- Not for a task that isn't built, or whose build stopped: that is `build-task`. Not for a new task, an urgent bug or work split off a task: that is `new-sprint`'s "add a task", which this step follows on its own for a criterion the user moves. Not for the pull request: that is `draft-pr`. Not for the sprint's close: that is `close-sprint`. Not for a change of the project's direction: that is `decide-direction`, or `write-architecture` for the stack and the modules. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |
| Agent docs | `docs/agents/<topic>.md` | reads |
| Architecture | `docs/ARCHITECTURE.md` | reads |
| Sprint rules and index | `docs/sprints/README.md` | reads |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | reads, changes |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | reads, changes |
| Design | `docs/plans/<ID>-<slug>-design.md` | reads, changes |
| Issue | `docs/issues/YYYY-MM-DD-<ID>-<topic>.md` | reads |

It also reads the project's code and the task's diff. It writes the project's own files that the task made wrong or stale, outside the map, as documents.md's rule 4 says: its code, its tests, its README and a changelog. The map's other documents change only through [the sync](../method/references/sync.md) and [the change](../method/references/change.md), at the yes. Work split off goes through new sprint's "add a task", which writes the new task. It writes no issue, no deferred item and no `CLAUDE.md`.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · close task**`, the reply to the user's last answer too, and while you follow "add a task", with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If the user didn't ask for this step, as with a remark that a task looks done, answer what they did say, then say in a line what it would write, and wait for the yes. The open sprint is the one `docs/sprints/README.md` lists `open`; with none, stop.
   - **The task** is the one the user names, else the `in-progress` task on the board whose log has a row that opens "Built by the build task step". Stop, as "Stop" says, on a sealed task (`completed`, `completed-as-partial` or `deferred`); on a build that stopped, whose log has a row that opens "Build started by the build task step" and none that opens "Built by the build task step"; on a task with neither row; and on an ask that changes the project's direction. Each stop and each question of this step comes before any write.
   - **Git:** read the user's rules about git, in `AGENTS.md`, `docs/agents/development-cycle.md` and their own words. A rule of theirs wins: where one bars git writes, make none, and the final message shows the commands. Otherwise the close commits on the branch its "Build started" row names: the task's own branch, never the base, or the base where the row says the task has no branch of its own. Where HEAD isn't on it, `git switch <branch>`; where the task's own branch is gone, `git switch -c <branch>` at HEAD, and the agreement says so.

   [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when the task is known, and HEAD is on its branch, or a rule of the user's bars git writes.
2. **Read.** Read the task file, with its evidence row, which opens "What shows each criterion, for the close:", and its "Built by" row; its design's criteria table, its "At the close" and its Watch for; each issue its log names; and the commands doc and the development cycle. Then find what changed since the build: take the commit that holds the "Built by" row, `git log -1 --format=%H -S "Built by the build task step" -- <the task file>`, then run `git diff --stat <that commit>` and `git status --short`. With no such commit, the build's work is all in the working tree, and the build's evidence covers it. A change the user asks for, or gives as an answer, against a decision, the design or the plan, is yours: follow [the change](../method/references/change.md), and stop, as "Stop" says, only on a change of direction. Done when each criterion's evidence, and what changed since the build, are known.
3. **Criteria.** Show each acceptance criterion by its evidence:
   - the build's evidence stands where nothing it rests on has changed since, the user's word included;
   - a criterion whose code or files changed since is shown again, by what runs and what it printed;
   - one that rests on the sync, such as a fact the task added to an agent doc, is shown at the yes;
   - one that needs a browser uses the first that fits: the project's own browser tests; a browser apart from the user's, the host's or an MCP server's; the user's own browser, with their logins, only for a check that needs their signed-in session, and only at their yes; else numbered steps;
   - one that only the user can show, such as one in their own accounts, gets numbered steps, each with what they should see, in a reply of its own, before the review, even where the check needs a push or a test pull request: the user may set that up first. End it on options such as "1. It went as the steps say" and "2. Something differs: say what". Their word is its evidence.

   **A criterion that fails, or stays open:** fix it now, as build task would: a test that fails for the right reason, then the code, then the project's gate. Where it can't be met now, ask, as a question of its own, whether to move it to a new task, through new sprint's ["add a task"](../new-sprint/references/add-a-task.md), followed on its own and then back here; to move it into a `to-do` task of the open sprint that has no design yet; or to keep this task open, which stops. A moved criterion closes the task `completed-as-partial`. In the task that takes it, it reads `- [ ] <criterion> *Moved from <ID> at its close.*`: "add a task" writes it so in a new task, and the yes in a `to-do` one. Done when each criterion is shown, or moved at the user's word, or the task stays open.
4. **Review.** One code review, the check the idea asks for at a task's close, in a subagent of its own, since the build shouldn't colour it.
   - **The base** is the commit before the build started: take the first line of `git log --reverse --format=%H -S "Build started by the build task step" -- <the task file>`, and write it `<sha>~1`. With no such commit, the base is HEAD, and the untracked files count too.
   - **The reviewer:** hand the review to one fresh subagent, on the model your host's map gives a code review. Its brief says to read [the review's brief](assets/review.md) by its absolute path and follow it, and gives it the absolute paths of the project, the task file, the design and the commands doc, the base, and today's date. A host with no subagents runs the review here, from the same brief, and keeps its findings apart.
   - **The findings** go to the user as the reviewer gave them, by their ids. With none, say so, and go on to the documents.
   - **The pick,** in plain text, after the findings, and the reply ends there:

     ```
     Which findings do I apply?
     1. The high ones and those marked recommended: <ids> (Recommended)
     2. All of them
     3. None: each stays in the closing row, with your reason
     4. Only those you name, such as "H1, M2"
     ```

   - **Applying the picks:** check each against the code before you change anything, and push back, with the reason, on one that doesn't hold. A pick that changes a decision, the stack or the plan is a change, as the change says. Once the picks are in, run the project's gate, as its commands doc names it, each command as it is written there. A pick that breaks a test is fixed or dropped, and the reply says which. To check a guard with a temporary edit, copy the file first and copy it back; `git checkout` and `git restore` are writes this step doesn't make. A pick that changes the design's approach gets a mark under its step in the design, with a row in its change log:

     ```
     *Changed in the close, YYYY-MM-DD:* <what, and why>.
     ```

   One round only: the fixes aren't reviewed again. Done when each pick is applied or pushed back, and the gate passes.
5. **Documents.** Bring in line the project's own docs that the task made stale, such as its README, a changelog where it keeps one, and docs outside the map: search them once for the task's terms, such as each command, page or setting it built, and edit each now, as the task's work. Leave the map's documents to the sync, and make its list for the yes: the task's "Documents to check on close", the design's "At the close", the facts the task added, such as each command it built, and the Watch for lines aimed at the close. Then run `node <this skill's folder>/../method/scripts/check-design.mjs <the project's folder>`, which runs the sprints' and the documents' checks too, and fix each fault it names in a file you may change. Done when the docs are edited, the list is ready, and the check ends with "0 faults".
6. **Agree.** Show the summary in one reply, in four parts:
   - **Criteria:** each with its evidence, and whether it is reused, checked again, on the user's word, moved, or resting on the sync at the yes;
   - **Review:** each finding by its id: applied, left at the user's word, or pushed back with its reason; and the gate after the picks;
   - **Documents:** each of the project's own docs that changed, with what changed, each change with what the yes writes for it, and the sync's list;
   - **What the yes writes:** each change's marks, the sync, the ticks and the closing row, the status, which seals the task file and its design, the sprint's row, and the commit, with its branch, or under a rule of the user's the commands they run.

   Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   Make a change, show what changed, and ask again. On the yes, and only then, in this order:
   1. **The sync:** first each change's marks, as the change says. Then run [the sync](../method/references/sync.md) for the task, with each change in its source: hand it to a subagent with the brief the sync gives, your list as its list, and the task file and its design as yours, for it to leave; a host with no subagents runs it here. Read what its report says it changed. Each departure from the design that it reports and no mark holds gets the "Changed in the close" mark under its step, with its change-log row; the task file's history stays as it is. If it leaves a criterion that rests on it unmet, write no tick, no status and no seal: stop, as "Stop" says.
   2. **The ticks** in the task's criteria, a met one and a moved one:

      ```
      - [x] <criterion> **Shown YYYY-MM-DD:** <its evidence>.
      - [ ] <criterion> **Moved to <ID>** at the user's word: <why>.
      ```

      A `to-do` task that takes a moved criterion gets it, so marked, and the log row `| YYYY-MM-DD | A criterion moved in from <ID>, closed as `completed-as-partial`. |`. Then the closing row, at the end of the task's log; a partial close reads "`completed-as-partial`, criterion <k> moved to <ID> at the user's word" after its colon:

      ```
      | YYYY-MM-DD | Closed by the close task step: `completed`, every criterion shown. Review: <ids> applied; <ids> left, <why>; or no findings. Documents: <each changed>; left for <step>: <what>; or none. |
      ```

   3. **The check:** check-design again, while the task is open, and fix what it names.
   4. **The status:** `completed` or `completed-as-partial`, in the task's header and on the board, which seals the task file and its design, and this row in the sprint's README:

      ```
      | YYYY-MM-DD | <ID> closed by the close task step: `<status>`. |
      ```

   5. **The check** once more, since a sealed file's faults are listed apart.
   6. **The commit,** last, so that it holds the rest, unless a rule of the user's bars git writes:

      ```
      git add <each path the close and the sync wrote, and each final Gradatim document that no commit holds>
      git commit -m "<one or two sentences>"
      ```

      Stage by path, never the whole tree or a draft. The message has no description, and no `$`, `%`, `!`, backticks or double quotes. Under a rule that bars git writes, run neither, and show them.

   Done when the marks are written, the check ends with "0 faults", and the commit is made or its commands shown.
7. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state: draft PR, for this task's pull request, where one is due. Where none is due, as for one developer's task built with no branch of its own, or where the project's rules open none, it is design task for the next task, or close sprint when no task is left to do. Before you write its options, check that its `../<skill>/SKILL.md` exists: where it doesn't, the Next line names that skill, and says that it isn't installed yet, and the message ends there, with no option. End with:

   ```
   **Close task: done.**
   **Closed:** <the task, linked>, `<its status>`, and each criterion moved, with where it went.
   **Written:** <the project's own files that changed, and any task added, linked>, or nothing.
   <the sync's drift report, word for word as it came back, from "**Drift report**" on>
   **Git:** <the commit's message, on `<branch>`>, or, under the user's rule, the commands to run.
   **Open:** <the findings left; what the report left for another step; what only the user can do, such as requiring a CI job in branch protection>, or nothing.
   **Next:** <draft PR, design task or close sprint>, with `<its skill>`, for <its task or the sprint>: <why>.
   1. Start `<its skill>` now (Recommended)
   2. Stop here
   ```

   Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. Start it only at the user's word. Done when the user chose, or you said it isn't installed.

## Stop

- If `AGENTS.md` has no line "The documents flow top-down: …", write nothing, and reply:

  ```
  **Gradatim · close task**

  **Close task: stopped.** This folder holds no Gradatim project: <what you found>. Nothing was written.
  **Next:** init, with `init-project`: it sets the project up.
  1. Start `init-project` now (Recommended)
  2. Stop here
  ```
- If no sprint is open, write nothing, and reply:

  ```
  **Gradatim · close task**

  **Close task: stopped.** No sprint is open: <what you found>. Nothing was written.
  **Next:** new sprint, with `new-sprint`: it plans the next sprint's tasks.
  1. Start `new-sprint` now (Recommended)
  2. Stop here
  ```
- If the task is sealed, write nothing, and reply:

  ```
  **Gradatim · close task**

  **Close task: stopped.** <The task> is sealed: <its status>. Nothing was written. Work it still needs becomes a new task.
  **Next:** new sprint, with `new-sprint`: its "add a task" adds the work to the open sprint.
  1. Start `new-sprint` now (Recommended)
  2. Stop here
  ```
- If the task's build stopped, with a row that opens "Build started by the build task step" and none that opens "Built by the build task step", write nothing, and reply:

  ```
  **Gradatim · close task**

  **Close task: stopped.** <The task>'s build stopped: <its last row>. Nothing was written.
  **Next:** build task, with `build-task`: it goes on from where the build stopped.
  1. Start `build-task` now (Recommended)
  2. Stop here
  ```
- If the task has neither row, write nothing, and reply:

  ```
  **Gradatim · close task**

  **Close task: stopped.** <The task> has no build row: <its status and its last row>. Nothing was written.
  **Next:** build task, with `build-task`: it builds the task and writes the evidence the close reads.
  1. Start `build-task` now (Recommended)
  2. Close it anyway: I check each criterion myself, by what runs
  3. Stop here
  ```

  On 2, go on from Read, and show each criterion again by what runs.
- If the ask changes the project's direction, as [the change](../method/references/change.md) says, write nothing more, and reply:

  ```
  **Gradatim · close task**

  **Close task: stopped.** <The ask> changes the project's direction: <why, in a line>. <What was written, and kept, or "Nothing was written.">
  **Next:** <decide, with `decide-direction`, or architecture, with `write-architecture`, for the stack or the modules>: it makes the change.
  1. Start `<its skill>` now (Recommended)
  2. Stop here
  ```
- If the user keeps the task open at a criterion, or the sync leaves a criterion that rests on it unmet, write no status and no seal, keep what was written, and reply, with no option:

  ```
  **Gradatim · close task**

  **Close task: stopped.** <ID> stays `in-progress`: <the criterion, and why it is open>. Nothing was sealed. <What was written, and kept, or "Nothing was written.">
  **Next:** <what clears it>, then close task again.
  ```

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.
