---
name: new-sprint
description: "Plans a Gradatim project's next sprint as a board of tasks in the order of work, or adds a task to the open sprint. Use when the user asks for Gradatim's new sprint step, to plan the next sprint, or to add a task or an urgent bug to the open sprint."
license: MIT
---

# New sprint

The sixth step of Gradatim's cycle, and the first of the delivery loop. From the plan, the architecture and the work left open, it agrees a sprint's scope with the user and writes the sprint: its rules on first use, a README whose board lists the tasks in the order of work, and a file for each task. It also adds a task to the open sprint. The plan's stories, cut, order and estimates are the concept step's, the modules and their codes are architecture's, and designing a task is design task's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the plan, the architecture and the work left open read; on first use one question on the size; one on the scope; the rules, the README and one file per task drafted and checked; the agreement; and at the yes the sprint's row and the `addressed by` marks. Adding a task shows the task, then writes it at the yes. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's new sprint step, to plan the next sprint, or to open the first one.
- The user asks to add a task to the open sprint: an urgent bug, or work split off a task.
- Not for a change to a story, the cut, the roadmap's order or an estimate: that is `write-concept`. Not for the stack, the structure or a module: that is `write-architecture`. Not for a change of direction: that is `decide-direction`. Not for designing a task: that is `design-task`. Not for closing a sprint: that is `close-sprint`. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |
| Decisions index | `docs/decisions/README.md` | reads |
| MVP | `docs/MVP.md` | reads |
| Roadmap | `docs/ROADMAP.md` | reads |
| Phase | `docs/PHASE-<k>.md` | reads |
| Architecture | `docs/ARCHITECTURE.md` | reads |
| Agent docs | `docs/agents/<topic>.md` | reads |
| Release record | `docs/RELEASES.md` | reads |
| Sprint rules and index | `docs/sprints/README.md` | reads, creates, changes |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | reads, creates, changes |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | reads, creates |
| Issue | `docs/issues/YYYY-MM-DD-<ID>-<topic>.md` | reads, changes |
| Deferred item | `docs/deferred-items/YYYY-MM-DD-<origin>-<topic>.md` | reads, changes |

It changes the rules, the items and the issues only at the yes. It writes nothing to git, and runs no sync.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · new sprint**`, the reply to the user's last answer too, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If the user didn't ask for this step, as with a remark on a sprint's length, answer what they did say, then say in a line what it would write, and wait for the yes. If `docs/sprints/README.md` lists a sprint `open`, an ask to add a task goes to step 2, and anything else stops, as "Stop" says. The plan must be final, which means `AGENTS.md` links the concept, and so must the architecture: the decisions index lists a record of `docs/decisions/architecture.md`, and `docs/ARCHITECTURE.md` has its modules table. Else stop, as "Stop" says. Rules that list no sprint, or a sprint folder that they don't list, are a stopped run's drafts: ask first, as a question of its own, whether to go on from them or to start over. Going on takes them as the scope the user chose: run the check, and go to Agree. Starting over rewrites them. First use means there is no `docs/sprints/README.md`. [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when the inputs are there, or the user chose.
2. **Add a task.** Only when the user asks for a task. Follow [the part](references/add-a-task.md), which holds its own agreement and its marks. With a sprint open, go to Next step after it. With none open, take the task as the first work of step 5 and go on to step 3. Done when its marks are written, or the user stopped.
3. **Size.** On first use only, ask the size of a sprint, in plain text or with your question tool. Open with the line `**The size of a sprint**`. Then two to five lines from the roadmap's milestones: what each milestone's stories add up to. Then two to four options, each a band of senior dev-days with its stretch, such as "10 to 15, stretching to 20": the recommended band first, with its reason. A band in the user's own words is taken as said. The rules record it as a guide, not a limit. Done when the user chose.
4. **Read.** Read the architecture's modules and open choices; the roadmap's order; the stories with their statuses; earlier task files, for their numbers; the release record; the last closed sprint's closing row, for what it taught; the open deferred items and issues; and the agent docs, which hold the commands a setup task builds. Stories, the cut, the roadmap's order and a story's estimate are concept's. Modules, the stack, and a module's code once the rules list it, are architecture's. Stop on a change to them, as "Stop" says. Done when each piece of open work and each next story is found.
5. **Scope.** In plain text, since a dialog would cover it, open with the line `**The scope of the sprint**`. Then the paragraph: the modules with their codes, the scope, what the last closed sprint taught, where its closing row says so, and the total in senior dev-days against the size, saying by how much and why where it passes the band or falls under it. Then the work, in the order it is taken: the fix for a rolled-back release, from `docs/RELEASES.md`; the deferred items; the open issues, as a list of their own, each taken or left with its reason; then the next `planned` stories whose dependencies are delivered or `existing`, or come earlier on the board. Show each task with its id, title, story, days and dependencies. Then, under a line of their own, such as "Past the MVP's end, for the larger scope:", the tasks that only the larger scope adds, shown the same way. Then two to four options, numbered from 1, each on one line: this scope (Recommended), a smaller one and a larger one, each with its days. End your reply after the options. The route is yours, with these defaults:
   - one task for each `planned` story, under the module that names it, with the story's estimate as its days. A story of half a day or less joins the task of the story it follows in the same module, within the sprint and where that breaks no order, and its days add to that task's. A story over about 3 dev-days splits, and its days divide. Say why for each, and name both stories in a merged task's Story, such as `M7, M8`;
   - a module that names no story, such as infrastructure, gets a setup task in the first sprint whose stories need it. Its Story is the milestone it serves, `the MVP` or `phase <k>`, and its days are your call;
   - a choice that the architecture pins to a story opens that story's first task, whose first question for the brainstorm names its record, for the task's design to settle;
   - the sprint stops at a milestone's end, unless the user asks to go past it.

   Done when the user chose.
6. **Draft.** On first use, write the rules from [their template](assets/sprint-rules.md): the size, the codes copied from the architecture's modules table, and a sprints table with no row. Then the sprint's README from [its template](assets/sprint.md), with its first log row, and one file per task from [the task template](assets/task.md). A task's id is its module's code and the next number in that module across the sprints, drafts counted. The board is in the order of work. A Takes cell holds file names in backticks, never links. No prose names an id that has no task file, since the check would read it as stale. On a later sprint, leave the rules as they are until the yes. Done when the drafts are written.
7. **Check.** Run `node <this skill's folder>/../method/scripts/check-sprint.mjs <the project's folder>`, and fix each fault it names, before the agreement and again at the yes. Done when it ends with "0 faults".
8. **Agree.** Show the summary in five parts: the rules, with the size and the codes, or what changes in them; the sprint, with its paragraph, its board and its capacity; the tasks, each with its goal; what it takes, each item or issue with its task, and what it leaves; and what the yes writes. Each says what you wrote, what you chose for the user, what is open, and what the yes will write. Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   Make a change in the drafts, show what changed, and ask again. On the yes, and only then, write the final marks:
   - in the rules, the sprint's row `open` as [their template](assets/sprint-rules.md) shows, with any new code or changed rule, and a row in the change log;
   - on each item or issue a task takes, `Status: addressed by <ID>` and a log row.

   Then run the check again; a fault that needs a choice goes back to the user before you finish. Done when the marks are written and the check ends with "0 faults".
9. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state: design task, for the board's first task. End with:

   ```
   **New sprint: done.**
   **Written:** <each file, linked>.
   **Open:** <each item or issue left, and why>, or nothing.
   **Next:** design task, with `design-task`, for <the board's first task>: <why>.
   1. Start `design-task` now (Recommended)
   2. Stop here
   ```

   Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. Start it only at the user's word. Done when the user chose, or you said it isn't installed.

## Stop

- If `AGENTS.md` has no line "The documents flow top-down: …", write nothing, and reply:

  ```
  **Gradatim · new sprint**

  **New sprint: stopped.** This folder holds no Gradatim project: <what you found>. Nothing was written.
  **Next:** init, with `init-project`: it sets the project up.
  1. Start `init-project` now (Recommended)
  2. Stop here
  ```
- If the plan isn't final, write nothing, and reply:

  ```
  **Gradatim · new sprint**

  **New sprint: stopped.** The plan isn't final: <what you found>. Nothing was written.
  **Next:** concept, with `write-concept`: it writes the plan.
  1. Start `write-concept` now (Recommended)
  2. Stop here
  ```
- If the architecture isn't final, has no modules table, or no module names a story the sprint needs, write nothing, and reply:

  ```
  **Gradatim · new sprint**

  **New sprint: stopped.** The architecture isn't ready for a sprint: <what you found>. Nothing was written.
  **Next:** architecture, with `write-architecture`: it writes the architecture and the modules.
  1. Start `write-architecture` now (Recommended)
  2. Stop here
  ```
- If a sprint is open and the user asked for no task, write nothing, and reply:

  ```
  **Gradatim · new sprint**

  **New sprint: stopped.** Sprint <n> is open: <what you found>. Nothing was written. A task can be added to the open sprint: ask for one.
  **Next:** close sprint, with `close-sprint`: it closes the open sprint.
  1. Start `close-sprint` now (Recommended)
  2. Stop here
  ```
- If the user asks to change a story, the cut, the roadmap's order or a story's estimate, write nothing, and reply:

  ```
  **Gradatim · new sprint**

  **New sprint: stopped.** <The ask> changes the plan, which is the concept step's: <what you found>. Nothing was written.
  **Next:** concept, with `write-concept`: it changes the plan.
  1. Start `write-concept` now (Recommended)
  2. Stop here
  ```
- If the user says to stop at a question, keep what was drafted. End with "**New sprint: stopped.**", what was drafted, and that the next run offers to go on from it. Offer no option.

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.
