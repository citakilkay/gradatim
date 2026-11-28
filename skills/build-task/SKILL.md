---
name: build-task
description: "Builds a task of a Gradatim project's open sprint from its design, test first, and shows each acceptance criterion with its evidence. Use when the user asks for Gradatim's build task step, to build, implement or code a designed task, or to go on with a build that stopped."
license: MIT
---

# Build task

The eighth step of Gradatim's cycle, and the second of the task loop. It builds a task from its final design, test first, makes sure the work works, and shows each acceptance criterion with its evidence. The design is design task's, the board new sprint's, a change of direction decide's or architecture's, and the review, the seal and the documents the task made stale close task's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the task, its design and the code it touches, read; the task's branch or the base, and `in-progress`; the design's steps built test first, here or, from four steps up, one subagent a step; the project's checks, and each criterion's evidence; the agreement; and at the yes the evidence row, the closing row and one commit. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's build task step, or to build, implement or code a task of the open sprint, or the next one.
- The user asks to go on with a build that stopped.
- Not for a task with no design: that is `design-task`. Not for a task's close, its code review or the documents it made stale: that is `close-task`. Not for a new task, an urgent bug or work split off a task: that is `new-sprint`'s "add a task". Not for a change of the project's direction: that is `decide-direction`, or `write-architecture` for the stack and the modules. Not for a folder with no Gradatim project: that is `init-project`.

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
| Issue | `docs/issues/YYYY-MM-DD-<ID>-<topic>.md` | reads, creates, changes |

It also reads the project's code, and any document the task or its design points to, such as a decision. It writes the project's own files that the task needs, outside the map, as documents.md's rule 4 says: its code, its tests, its configuration and its CI. It changes no agent doc, runbook or architecture, since those are close task's, but through the sync for a change it took; and it changes the design only by a departure, marked under its step. It never writes a `CLAUDE.md`.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · build task**`, the reply to the user's last answer too, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If the user didn't ask for this step, as with a remark on a task's size, answer what they did say, then say in a line what it would write, and wait for the yes. The open sprint is the one `docs/sprints/README.md` lists `open`; with none, stop.
   - **The task** is the one the user names, else the one `in-progress` on the board, else the next task: the first `to-do` task on the board whose dependencies are all `completed`. Stop, as "Stop" says, on a sealed task (`completed`, `completed-as-partial` or `deferred`), on a `to-do` task with no Design row, on a task whose log has a row that opens "Built by the build task step", and on an ask that changes the project's direction. Each stop and each question of this step comes before any write.
   - **A dependency** that isn't `completed` is a missing input: name it, with the step that clears it, and go on only at the user's word.
   - **An `in-progress` task without that row** is a build that stopped: ask first, as a question of its own, whether to go on from its log and its marked steps (recommended) or to build it again. Going on takes the branch its first row names, with `git switch <branch>`, and makes no new marks.
   - **Git:** read the user's rules about git, in `AGENTS.md`, `docs/agents/development-cycle.md` and their own words. A rule of theirs wins: where one bars git writes, make none, and the final message shows the commands, on the base or the branch the lines below give the task: `git switch -c <branch>` first, where it doesn't exist yet. Otherwise build the task:
     - **on the base,** with no branch of its own, where the development cycle's Branch line says so, or where it names no rule and `AGENTS.md` says one developer works on the project: `git switch <the base>` where HEAD isn't on it. Make the task's branch all the same where the task calls for one, such as a large or risky change, and say why in the agreement;
     - **else on its own branch,** `git switch -c <branch>`.

     The development cycle names the base and the branch's name; without one, the base is the current branch, and the name is the task's file name without `.md`, in lower case. Where the base tracks a remote, bring it up to date first with `git pull --ff-only`. Where a dependency's work isn't on the base yet, since its pull request isn't merged, start from the dependency's branch, and say so in the agreement.
   - **The marks:** `in-progress` in the task's header and on the board, and this row in the task's log and in the sprint's README. On the base, it ends "on `<the base>`, with no branch of its own." in place of the branch; under a rule that bars git writes, "with no branch, under the user's git rule.":

     ```
     | YYYY-MM-DD | Build started by the build task step, on branch `<branch>`. |
     ```

   [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when HEAD is on the task's branch or the base, and `in-progress` is there, or the user chose.
2. **Read.** Read the task file, its design and each issue its Takes names; the architecture's seams and data for the modules it touches; the agent docs, the commands and the development cycle first; and the project's code where the task lands. A change the user asks for, or gives as an answer, against a decision, the design or the plan, is yours: follow [the change](../method/references/change.md), and stop, as "Stop" says, only on a change of direction. A design step whose work is an agent doc, the runbook or the architecture is close task's: build the rest, and say so in a log row. Done when the order of the work, and what will show each criterion, are known.
3. **Build** the design's steps in order. Up to three steps, build them here. From four steps up, hand each step to a subagent of its own, in order, with [the brief](assets/brief.md), on the model your host's map gives a build, or a light build for a small step that isn't complex, since each needs a context of its own; here you ask the user, log, check and commit, and a subagent's question comes back to you to ask. A host with no subagents builds them here.
   - **Test first,** where the project has tests or the design sets them up: a test that fails for the right reason, then the code that makes it pass. Run the project's checks after each step. Make no git write on the way, such as a stash to show a test failing: the build's git writes are its branch, where it makes one, and its commit.
   - **Evidence before claims:** a step is done when its Done when holds in what you ran, never in what should work.
   - **Never weaken, skip or loosen a test** to make it pass: fix the code, or ask.
   - **An unexpected failure:** reproduce it, find its cause, change one thing, and prove the fix. After three failed fixes, the approach is the problem: put it to the user, or write an issue.
   - **No tests, and the design sets none up:** ask before you add the architecture's smallest test setup.
   - **A small problem,** such as a wrong command or path in the design: fix it, with no issue. Mark it under its step in the design, with a row in the design's change log:

     ```
     *Changed in the build, YYYY-MM-DD:* <what, and why>.
     ```

   - **A point the design doesn't mention:** handle it, and log it.
   - **A problem that needs thought, or a fix that reaches beyond the task,** which no criterion hangs on, such as a document that asks for what the design's decisions can't give: write it from [the template](assets/issue.md) to `docs/issues/YYYY-MM-DD-<ID>-<topic>.md`, name it in the task's log by its file name, in backticks, never a link, and go on with what doesn't depend on it. A line in the agreement alone is lost: new sprint and the close read the issues.
   - **Ask only** what the work can't go on without, or what only the user can give: their decisions, money or accounts, what a page shows, a criterion that can't be met as written, the scope or the days, a package the design doesn't name, and anything that can't be undone. One question per reply, in plain text or with your question tool: two to five lines on what you found and what the answer changes, then two to four options, numbered from 1, each on one line, the recommended one first with its reason, and the reply ends there. The options may include a new task, through new sprint's ["add a task"](../new-sprint/references/add-a-task.md), followed on its own, or a way to build it.
   - **After each step,** a row in the task's log:

     ```
     | YYYY-MM-DD | Step <k>: <what it built>, shown by <the command>. |
     ```

   Done when every step's Done when holds, or what is left is the user's question.
4. **Check.** Run the project's gate, as its commands doc and development cycle name it, each command as it is written there, and show each criterion by what ran and what it printed. A criterion that needs a browser uses the first that fits: the project's own browser tests; a browser apart from the user's, the host's or an MCP server's; the user's own browser, with their logins, only for a check that needs their signed-in session, and only at their yes; else numbered steps. A criterion that only the user can show, such as one in their own accounts, gets numbered steps, each with what they should see, in a reply of its own before the agreement, never inside it, even where the check needs a push or a test pull request: the user may set that up first. End that reply on options such as "1. It went as the steps say" and "2. Something differs: say what". Their word is that criterion's evidence, and what they can't show yet stays open. Then run `node <this skill's folder>/../method/scripts/check-design.mjs <the project's folder>`, which runs the sprints' check too, and fix each fault it names. Done when each criterion has its evidence or is named open, and the check ends with "0 faults".
5. **Agree.** Show the summary in one reply, in four parts: what was built, each step with what shows its Done when, and each marked change; each criterion with its evidence, or what is open; what came up: each change, each issue by its file name, the user's answers, the calls you made, and what you noticed outside the task; and what the yes writes: each change's marks, the rows below, and the commit, with its branch and the documents it takes, or under a rule of the user's the commands they run. Each part says what you wrote, what you chose for the user, what is open, and what the yes will write. Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   Make a change, show what changed, and ask again. On the yes, and only then, write the final marks: each change's first, as the change says; then these two rows at the end of the task's log, with its status left `in-progress`. On the base, the second one says "on `<the base>`, with no branch of its own." in place of the branch; under a rule that bars git writes, it ends "with no branch, under the user's git rule. The close is next.":

   ```
   | YYYY-MM-DD | What shows each criterion, for the close: 1. <its evidence> · 2. <its evidence> · <…> |
   | YYYY-MM-DD | Built by the build task step, on branch `<branch>`. The close is next. |
   ```

   Run the check again. Then, last, so that the commit holds them, unless a rule of the user's bars git writes:

   ```
   git add <each path the build wrote, and each final Gradatim document that no commit holds>
   git commit -m "<one or two sentences>"
   ```

   Stage by path: each file the build wrote, or a folder that holds only files it wrote, and never the whole tree or a draft. The message has no description, and no `$`, `%`, `!`, backticks or double quotes. Under a rule that bars git writes, run neither, and show them. Done when the rows are written, the check ends with "0 faults", and the commit is made or its commands shown.
6. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state: close task, for this task. Before you write its options, check that `../close-task/SKILL.md` exists: where it doesn't, the Next line says that `close-task` isn't installed yet, and the message ends there, with no option. End with:

   ```
   **Build task: done.**
   **Written:** <the task file and the design, linked; each issue by its file name; the code's folders>.
   **Git:** <the commit's message, on `<branch>`>, or, under the user's rule, the commands to run.
   **Open:** <what is left>, or nothing.
   **Next:** close task, with `close-task`, for <the task>: <why>.
   1. Start `close-task` now (Recommended)
   2. Stop here
   ```

   Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. Start it only at the user's word. Done when the user chose, or you said it isn't installed.

## Stop

- If `AGENTS.md` has no line "The documents flow top-down: …", write nothing, and reply:

  ```
  **Gradatim · build task**

  **Build task: stopped.** This folder holds no Gradatim project: <what you found>. Nothing was written.
  **Next:** init, with `init-project`: it sets the project up.
  1. Start `init-project` now (Recommended)
  2. Stop here
  ```
- If no sprint is open, write nothing, and reply:

  ```
  **Gradatim · build task**

  **Build task: stopped.** No sprint is open: <what you found>. Nothing was written.
  **Next:** new sprint, with `new-sprint`: it plans the next sprint's tasks.
  1. Start `new-sprint` now (Recommended)
  2. Stop here
  ```
- If the task is sealed, write nothing, and reply:

  ```
  **Gradatim · build task**

  **Build task: stopped.** <The task> is sealed: <its status>. Nothing was written. Work it still needs becomes a new task.
  **Next:** new sprint, with `new-sprint`: its "add a task" adds the work to the open sprint.
  1. Start `new-sprint` now (Recommended)
  2. Stop here
  ```
- If the task is `to-do` with no Design row, write nothing, and reply:

  ```
  **Gradatim · build task**

  **Build task: stopped.** <The task> has no design: its header has no Design row. Nothing was written.
  **Next:** design task, with `design-task`: it writes the design that the build follows.
  1. Start `design-task` now (Recommended)
  2. Stop here
  ```
- If the task's log has a row that opens "Built by the build task step", write nothing, and reply:

  ```
  **Gradatim · build task**

  **Build task: stopped.** <The task> is built, and waits for its close: <the row>. Nothing was written.
  **Next:** close task, with `close-task`: it checks the criteria, reviews the code and seals the task.
  1. Start `close-task` now (Recommended)
  2. Stop here
  ```
- If the ask changes the project's direction, as [the change](../method/references/change.md) says, write nothing more, and reply:

  ```
  **Gradatim · build task**

  **Build task: stopped.** <The ask> changes the project's direction: <why, in a line>. <What was built, and kept, or "Nothing was written.">
  **Next:** <decide, with `decide-direction`, or architecture, with `write-architecture`, for the stack or the modules>: it makes the change.
  1. Start `<its skill>` now (Recommended)
  2. Stop here
  ```
- If the user says to stop at a question, keep what was built. End with "**Build task: stopped.**", what was built, and that the next run offers to go on from it. Offer no option.

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.
