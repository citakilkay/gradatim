---
name: design-task
description: "Writes the design of a task in a Gradatim project's open sprint, a step-by-step guide for the build, from the main ideas the user settles. Use when the user asks for Gradatim's design task step, to design or brainstorm a task, or to revise a task's design."
license: MIT
---

# Design task

The seventh step of Gradatim's cycle, and the first of the task loop. It settles a task's main ideas with the user, one question at a time, and writes the task's design: a step-by-step guide that the build follows. A change of direction is decide's, or architecture's for the stack and the modules; the board is new sprint's, and the build is build task's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the task, its story, the decisions and the architecture it touches, and the code where it lands, read; one to three questions, one at a time; the design drafted and checked; the agreement; and at the yes the Design row, the marked criteria and the log rows. A revision asks only what changes, and rewrites the design at the yes. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's design task step, or to design or brainstorm a task of the open sprint, or the next one.
- The user asks to revise a task's design before its build starts.
- Not for building a task: that is `build-task`. Not for a new task, an urgent bug or work split off a task: that is `new-sprint`'s "add a task". Not for a change of the project's direction: that is `decide-direction`, or `write-architecture` for the stack and the modules. Not for facts that need research: that is `research-topics`. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |
| Agent docs | `docs/agents/<topic>.md` | reads |
| Decisions index | `docs/decisions/README.md` | reads |
| Decision session | `docs/decisions/NN-<topic>.md` | reads |
| Architecture's records | `docs/decisions/architecture.md` | reads |
| Research report | `docs/research/NN-<topic>.md` | reads |
| MVP | `docs/MVP.md` | reads |
| Phase | `docs/PHASE-<k>.md` | reads |
| Architecture | `docs/ARCHITECTURE.md` | reads |
| Release record | `docs/RELEASES.md` | reads |
| Sprint rules and index | `docs/sprints/README.md` | reads |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | reads, changes |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | reads, changes |
| Design | `docs/plans/<ID>-<slug>-design.md` | reads, creates, changes |
| Issue | `docs/issues/YYYY-MM-DD-<ID>-<topic>.md` | reads |
| Deferred item | `docs/deferred-items/YYYY-MM-DD-<origin>-<topic>.md` | reads |

It reads the project's code and changes none. It changes the task file and the sprint's README only at the yes. It runs no git command, not even one that only reads.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · design task**`, the reply to the user's last answer too, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If the user didn't ask for this step, as with a remark on a task's size, answer what they did say, then say in a line what it would write, and wait for the yes. The open sprint is the one `docs/sprints/README.md` lists `open`; with none, stop. The task is the one the user names, else the next task: the first `to-do` task on the open sprint's board whose dependencies are all `completed`. A task that is `completed`, `completed-as-partial` or `deferred` is sealed, and one that is `in-progress` is being built: stop on either, as "Stop" says. Name each dependency that isn't `completed` yet, and go on. A design in `docs/plans/` that no Design row links is a stopped run's draft: ask first, as a question of its own, whether to go on from it or to start over. Going on takes its decisions as the user's: run the check, and go to Agree. A task whose Design row links its design has a final design: unless the user asked to revise it, ask first, as a question of its own, whether to revise it or which task to design. [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when the task and its inputs are there, or the user chose.
2. **Read.** Read the task file and its row on the board; its story in the MVP or a phase, or the milestone a setup task serves; the decisions and records it cites; the architecture's seams and data for the modules it touches; the agent docs; the designs of the tasks it depends on; for the fix of a failed release, the release record; and each issue or deferred item in its Takes, copying what the design needs and naming the file in backticks, never a link, since the file is deleted later. Read the project's code where the task lands, at the level of its modules. Where a main idea rests on how an outside service or library behaves, and the research and the decisions don't say, fetch one page of its own docs, and cite it in the question. Send nothing about the user to a site. A question that needs more than one look is research: offer `research-topics`. An ask or an answer against a decision that holds, the plan or the architecture is a change: follow [the change](../method/references/change.md), and stop, as "Stop" says, only on a change of direction. Done when each main idea is found: one to ask, or one that is your call.
3. **Ask.** One question per reply, in plain text or with your question tool. Open with the line `**Q<k> · <its title>**`, with k from 1. Then two to five lines: what the documents say, and what the answer changes. Then two to four options, numbered from 1, each on one line, the recommended one first, with its reason. End your reply after the options. If the user asks how an outside service or library behaves, fetch the page of its own docs that says, answer from it with the page cited, and ask your question again. Ask only the main ideas:
   - what the project's user sees or does;
   - data that is hard to undo;
   - what is exposed, or kept secret;
   - what the user sets up or pays for;
   - a choice that a decision records, or that the architecture leaves open for the task's story;
   - the task's scope, or its days.

   Each question for the brainstorm in the task file, with its "Proposed:", is asked if it is a main idea, and otherwise taken as your call. How the task is built, its modules, files, names and tests, is your call too, listed in the agreement for the user to overturn. After each answer, plan the next question again: the answer may settle it, add one or change it. A revision asks only what its change opens. Done when no main idea is open.
4. **Draft.** Write the design to `docs/plans/<ID>-<slug>-design.md`, the task file's name with `-design`, from [the template](assets/design.md), with each of its parts. Number the user's decisions 1, 2… and cite them as "(decision 2)": a `D` with a number names a decision of the project's index. Name only ids that have files. Keep the steps at the level of behaviour and modules: the build reads the code, and picks the files and the names. A revision writes nothing before the yes: show the change instead. Done when the draft is written, or the change shown.
5. **Check.** Run `node <this skill's folder>/../method/scripts/check-design.mjs <the project's folder>`, which runs the sprint's check too, and fix each fault it names, before the agreement and again at the yes; a revision runs it only at the yes. Done when it ends with "0 faults".
6. **Agree.** Show the summary in one reply, in four parts: the idea and the user's decisions, each with what it was chosen over, and the calls you made for the user; the steps, each with its Done when; the criteria, each with its step, and the estimate against the story's figure; and the documents and what to watch for, with what the yes writes. A revision shows only the parts it changes. Each part says what you wrote, what you chose for the user, what is open, and what the yes will write. Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   Make a change in the draft, show what changed, and ask again. On the yes, and only then, write the final marks:
   - what [the change](../method/references/change.md) writes for each change the design took;
   - in the task's header, below Takes, the row `| Design | [the design](../../plans/<ID>-<slug>-design.md) |`;
   - each criterion that the design adds or changes, in the task's criteria, opening with `*New, by the design of YYYY-MM-DD:*` or `*Changed by the design of YYYY-MM-DD:*`;
   - a log row in the task file, and one in the sprint's README;
   - where the estimate moved, the task's Days on the board, and the sprint's Capacity with it;
   - for a revision, the design rewritten, with a row in its change log.

   Then run the check again; a fault that needs a choice goes back to the user before you finish. Done when the marks are written and the check ends with "0 faults".
7. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state: build task, for this task. End with:

   ```
   **Design task: done.**
   **Written:** <each file, linked>.
   <where a change ran the sync, its drift report, word for word as it came back, from "**Drift report**" on>
   **Open:** <what is left>, or nothing.
   **Next:** build task, with `build-task`, for <the task>: <why>.
   1. Start `build-task` now (Recommended)
   2. Stop here
   ```

   Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. Start it only at the user's word. Done when the user chose, or you said it isn't installed.

## Stop

- If `AGENTS.md` has no line "The documents flow top-down: …", write nothing, and reply:

  ```
  **Gradatim · design task**

  **Design task: stopped.** This folder holds no Gradatim project: <what you found>. Nothing was written.
  **Next:** init, with `init-project`: it sets the project up.
  1. Start `init-project` now (Recommended)
  2. Stop here
  ```
- If no sprint is open, write nothing, and reply:

  ```
  **Gradatim · design task**

  **Design task: stopped.** No sprint is open: <what you found>. Nothing was written.
  **Next:** new sprint, with `new-sprint`: it plans the next sprint's tasks.
  1. Start `new-sprint` now (Recommended)
  2. Stop here
  ```
- If the task is sealed, write nothing, and reply:

  ```
  **Gradatim · design task**

  **Design task: stopped.** <The task> is sealed: <its status>. Nothing was written. Work it still needs becomes a new task.
  **Next:** new sprint, with `new-sprint`: its "add a task" adds the work to the open sprint.
  1. Start `new-sprint` now (Recommended)
  2. Stop here
  ```
- If the task is `in-progress`, write nothing, and reply:

  ```
  **Gradatim · design task**

  **Design task: stopped.** <The task> is being built: <what you found>. Nothing was written.
  **Next:** build task, with `build-task`: it goes on with the build.
  1. Start `build-task` now (Recommended)
  2. Stop here
  ```
- If the ask changes the project's direction, as [the change](../method/references/change.md) says, write nothing, and reply:

  ```
  **Gradatim · design task**

  **Design task: stopped.** <The ask> changes the project's direction: <why, in a line>. Nothing was written.
  **Next:** <decide, with `decide-direction`, or architecture, with `write-architecture`, for the stack or the modules>: it makes the change.
  1. Start `<its skill>` now (Recommended)
  2. Stop here
  ```
- If the user says to stop at a question, keep what was drafted. End with "**Design task: stopped.**", what was drafted, and that the next run offers to go on from it. Offer no option.

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.
