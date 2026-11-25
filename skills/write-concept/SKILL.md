---
name: write-concept
description: "Writes a Gradatim project's concept, MVP, roadmap and phases from its decisions, as estimated stories, with an overview page. Use when the user asks for Gradatim's concept step, to plan the MVP and what comes after it, or to change the plan's stories, order or estimates."
license: MIT
---

# Write concept

The fourth step of Gradatim's cycle, and the one that runs again whenever the plan changes. From the decisions that hold, it writes the concept, the MVP, the roadmap and the phases, as stories a sprint can name, with an overview page, and the user agrees them before the architecture step. The choices are decide's, the stack is the architecture step's, and the sprints are new sprint's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the idea and the decisions read; one question on where the MVP ends; four documents and the overview drafted; the agreement; the idea moved out of `AGENTS.md`. A later run shows the change, then writes it at the yes. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's concept step, or to plan the MVP and what comes after it from the decisions.
- The user wants to change the plan: a story's milestone, the order, an estimate, a split, a phase.
- Not for a change to what the project does, or to a decision that holds: that is `decide-direction`. Not for the stack or the structure: that is `write-architecture`. Not for sprints: that is `new-sprint`. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads, changes |
| Research index | `docs/research/README.md` | reads |
| Research report | `docs/research/NN-<topic>.md` | reads |
| Decisions index | `docs/decisions/README.md` | reads |
| Decision session | `docs/decisions/NN-<topic>.md` | reads |
| Concept | `docs/MAIN_CONCEPT.md` | reads, creates, changes |
| MVP | `docs/MVP.md` | reads, creates, changes |
| Roadmap | `docs/ROADMAP.md` | reads, creates, changes |
| Phase | `docs/PHASE-<k>.md` | reads, creates, changes |
| Overview | `docs/artifacts/NN-overview.html` | reads, creates, changes |

It also reads the project's own files that say what the project is, such as a README, and its code only through the report on it. It changes `AGENTS.md` only at the yes, and writes nothing to git.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · concept**`, the reply to the user's last answer too, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If the user didn't ask for this step, as with a remark on the plan, answer what they did say, then say in a line that it would write the concept, the MVP, the roadmap and the phases, and wait for the yes. A first run is one where `AGENTS.md` holds `### The idea`; on a later run, the idea is the concept's. If plan documents exist while `AGENTS.md` still holds the idea, a stopped run left them as drafts: ask first, as a question of its own, whether to go on from them or to start over. A file at a plan document's path whose opening line isn't the concept step's, "*The concept step's …", is the project's own, not a draft: ask instead, as a question of its own, "Take it in (Recommended)", read as an input and written over, since git's last commit keeps it, or "Stop here"; where git's last commit doesn't hold it, stop, as "Stop" says. If there is no decisions index, name decide as the step that makes the decisions, and offer `decide-direction` (recommended) or going on from the idea alone, which you do only at the user's word. On a first run in a folder with code whose research index lists no `NN-the-code.md`, offer `research-topics` first in the same way: it reads what the code already does. [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when the inputs are there, or the user chose to go on without one.
2. **Stories.** Read the idea; the decisions index and the records whose row says `holds`, taking a deferral's assumption until its time; the project's own files that say what it is; and the report on the code, `NN-the-code.md`, where the index lists one, in place of the code: where it exists, open no file of the code itself, since the report says what the code does. Read another research report only where a decision cites a finding the plan needs. Sort them into stories, each with its estimate in senior dev-days, in quarter-day steps, and the stories it depends on. A story the code meets whole, by that report's findings, is `existing`, with no estimate and an `Exists:` line; one it meets in part stays `planned`, with the days left and an "Exists in part:" line, as [the MVP's template](assets/mvp.md) says. On a later run, sort the user's change instead.
   - **Yours to change:** the cut, the order, an estimate, a split, a story from the idea or from a decision that holds, a proposal kept or dropped, and a story dropped.
   - **Not yours:** whatever a decision that holds settles otherwise; the idea's scope or its users; and a story that a task of the open sprint names, since only decide's sync carries a change to the task. Stop on these, as "Stop" says.

   Done when a sprint could take each story as a task's parent without asking what it means, and the idea and each decision that holds sit in a story, a trait or a limit.
3. **The cut.** On a first run, and on a later one that moves the MVP's end without saying where, ask where the MVP ends, in plain text, since a dialog would cover the stories. Open with the line `**Where the MVP ends**`. List the stories, each with its title, its dev-days, or "exists" for one the code meets whole, and what it needs first, with no id yet, since the cut decides M or P. Then two to five lines on what the decisions leave open. Then two to four options, numbered from 1, each on one line: first the cut you propose, marked (Recommended), the smallest usable version that shows whether the idea works, with its dev-days and its reason; then a smaller and a larger cut, where there are such, each with its dev-days. End your reply after the options, with nothing after them. Done when the user chose.
4. **Draft.** On a first run, write the four documents from the templates: [the concept](assets/concept.md), [the MVP](assets/mvp.md), [a phase](assets/phase.md) for each milestone after the MVP, and [the roadmap](assets/roadmap.md). Give the ids now: `M1` and on in the MVP, and `P<k>.1` and on in phase k. The concept holds the idea word for word. The phases hold what the MVP leaves out, and up to three options of your own, each with "Decisions: none, proposed"; none goes in the MVP. On a later run, write nothing before the yes, and show the change document by document: the plan is final once `AGENTS.md` links the concept, so a change written before the yes would read as agreed. A story that moves keeps its heading where it was, with only the pointer line that [the MVP's template](assets/mvp.md) gives, and goes whole, under the same heading, into its new file. Done when the drafts are written, or the change is shown.
5. **Overview.** Make it by [the kit](../method/references/artifacts.md), from [its template](../method/assets/overview.html): before the agreement on a first run, and at the yes on a later one. On a first run its `NN-` is the next free number in `docs/artifacts/`; on a later run, make the same file again, keeping its rows and adding one. Label each bar with its milestone's stories. Then run `node <this skill's folder>/../method/scripts/check-plan.mjs <the project's folder>`, and fix each fault it names. Done when the wrap prints "no fault", and the check ends with "0 faults".
6. **Agree.** Show the summary in five parts: the concept; the MVP, with where it ends and its dev-days; the roadmap, with its order and its total; the phases, naming each proposal for the user to keep or drop; and the overview, with its path, to open in a browser. Each part says what you wrote, what you chose for the user, what is open, and what the yes will write. Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   Where your tool list has the tool that your host's map names for publishing, add "2. Yes, and publish it: <what the map says publishing makes>" before "Not yet", as the kit says. Make a change in the drafts, or in the change you show; on a first run, wrap and check again. Show what changed, and ask again. On the yes, and only then, write the final marks:
   - on a first run, in `AGENTS.md`: take out `### The idea` and the text under it, up to the next heading, keep every other line as it is, and add `The idea and the plan are in [the concept](docs/MAIN_CONCEPT.md).` to the end of the paragraph above it;
   - on a later run: the change, a row in the change log of each document it touches, then the overview made again, the wrap and the check. A fault that needs a choice goes back to the user before you finish.

   Then publish the page, if the user chose that, with the file as it is. Done when the marks are written.
7. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state, and end with:

   ```
   **Concept: done.**
   **Written:** <each file, linked>.
   **Open:** <what is left, such as a condition that a decision carries into the plan>, or nothing.
   **Next:** <step>, with <skill>: <why, from the project's state>.
   1. Start <skill> now (Recommended)
   2. Stop here
   ```

   Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. Start it only at the user's word. Done when the user chose, or you said it isn't installed.

## Stop

- If `AGENTS.md` has no line "The documents flow top-down: …", write nothing, and reply:

  ```
  **Gradatim · concept**

  **Concept: stopped.** This folder holds no Gradatim project: <what you found>. Nothing was written.
  **Next:** init, with `init-project`: it sets the project up.
  1. Start `init-project` now (Recommended)
  2. Stop here
  ```
- If the user asks for what a decision that holds settles otherwise, for a change to the idea's scope or its users, or for a story that a task of the open sprint names, write nothing, and reply:

  ```
  **Gradatim · concept**

  **Concept: stopped.** <The ask> goes against D<n>, which settles <what>, or changes what the project does. Nothing was written.
  **Next:** decide, with `decide-direction`: it records the change, and its sync carries it into the plan.
  1. Start `decide-direction` now (Recommended)
  2. Stop here
  ```
- If a file at a plan document's path is the project's own, and git's last commit doesn't hold it, write nothing, and reply:

  ```
  **Gradatim · concept**

  **Concept: stopped.** <The file> is the project's own, and git's last commit doesn't hold it, so the plan written there would lose it. Nothing was written.
  **Next:** concept, with `write-concept`, once <the file> is committed or moved.
  ```
- If the user says to stop at a question, keep what was drafted. End with "**Concept: stopped.**", what was drafted, and that the next run offers to go on from it. Offer no option.

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.
