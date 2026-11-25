---
name: review-project
description: "Reviews a Gradatim project as built and ranks improvements to its architecture, UX and features in one badged report, whose picks become stories. Use when the user asks for Gradatim's review step, or to review the project, its code, its UX or its features."
license: MIT
---

# Review

The thirteenth step of Gradatim's cycle, every two or three sprints. It looks at the project as built: the code's structure, the UI as a user meets it, and the features against the plan. What it finds comes as one list, ranked from the strongest down, each item badged strong or optional, in a report the user opens in a browser. The user's picks become stories in the plan. A pick that changes the direction is decide's, one that changes the stack or the modules architecture's, and building a story the sprints'.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the plan, the sprints and the code read; three looks in subagents at once; one report; the picks; the agreement; and at the yes the stories, the roadmap, the modules' cells, the overview and the review's row. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's review step, or to review the project, its architecture, its code, its UX or its features, as close sprint suggests every two or three sprints.
- Not for one task's code: that is `close-task`. Not for a sprint's close: that is `close-sprint`. Not for a change of direction the user has in mind: that is `decide-direction`. Not for the stack or the structure: that is `write-architecture`. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |
| Agent docs | `docs/agents/<topic>.md` | reads |
| Concept | `docs/MAIN_CONCEPT.md` | reads |
| Decisions index | `docs/decisions/README.md` | reads |
| Decision session | `docs/decisions/NN-<topic>.md` | reads |
| Architecture's records | `docs/decisions/architecture.md` | reads |
| MVP | `docs/MVP.md` | reads, changes |
| Roadmap | `docs/ROADMAP.md` | reads, changes |
| Phase | `docs/PHASE-<k>.md` | reads, changes |
| Overview | `docs/artifacts/NN-overview.html` | reads, changes |
| Architecture | `docs/ARCHITECTURE.md` | reads, changes |
| Release record | `docs/RELEASES.md` | reads |
| Sprint rules and index | `docs/sprints/README.md` | reads, changes |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | reads |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | reads |
| Design | `docs/plans/<ID>-<slug>-design.md` | reads |
| Issue | `docs/issues/YYYY-MM-DD-<ID>-<topic>.md` | reads |
| Deferred item | `docs/deferred-items/YYYY-MM-DD-<origin>-<topic>.md` | reads |
| Review report | `docs/artifacts/NN-review-sprint-<n>.html` | reads, creates |

It reads the code, and runs the project's own commands to see the app. It writes none of the project's own files and no `CLAUDE.md`, makes no git write, and runs no sync: in the architecture it changes only the modules' Stories cells. It never changes a sealed document.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · review**`, the reply to the user's last answer too, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If the user didn't ask for this step, as with a remark on the code or a screen, answer what they did say, then say in a line that it would review the project and write a report in `docs/artifacts/`, and wait for the yes. With no sprint `closed` in `docs/sprints/README.md`, stop, since a report is named after the last closed sprint. Then, each in a reply of its own:
   - **A draft:** a `docs/artifacts/NN-review-sprint-<n>.html` that no row of the rules' `## Reviews` links is a stopped run's. Ask first:

     ```
     A stopped review left its draft: `docs/artifacts/<file>`, with <n> items.
     1. Go on from it (Recommended): its items go to the picks
     2. Start over: the looks run again, and the draft is rewritten
     ```

     On 1, go on at Picks, with the draft's items and scope.
   - **The scope:** the sprints closed after the one the last row of `## Reviews` names, or all of them on a first review, or a direction the user names, such as the UI alone, which narrows the looks to it. Where no sprint has closed since the last review, ask:

     ```
     No sprint has closed since the last review, which came after sprint <n>.
     1. Stop here (Recommended): a review is due once two more sprints close
     2. Review anyway: the code and the screens as they are now
     ```

     On 1, stop, as "Stop" says.

   [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when the scope is known, or the user chose to go on from the draft.
2. **Look.** Three looks, each a review that the others shouldn't colour: the code's structure, the UI as a user meets it, and the features against the plan. Hand them to three fresh subagents, all at once: the code's on the model your host's map gives a code review, and the UI's and the features' each on the model your host's map gives a report. Each brief says to read [the looks' brief](assets/look.md) by its absolute path and follow its part, and gives its look, the absolute paths of the project and its commands doc, the scope, and today's date. Only the UI's look builds or serves the app, or runs its browser tests, since two would fight over a port. A host with no subagents runs the looks here, one after another, from the same brief, and keeps each look's candidates apart. A direction the user named runs only the looks it needs. Done when each look's candidates are back.
3. **Report.** Make one list from the candidates:
   - merge those with one root, and drop one with no evidence you can open: a file and line, a screen, or a story's id;
   - drop one that a `planned` story, an open issue or a deferred item already holds;
   - give each its route, in this order: **decide**, where a decision of a session in `docs/decisions/` that holds stands against it, so that it "reopens D<n>", or it changes the concept's or the MVP's scope; **architecture**, where it changes the stack or the structure: a technology that a record of `docs/decisions/architecture.md` names, or a module that the architecture's table lacks; else **a story**;
   - badge each: `strong` where it costs something now and the change is clear, `optional` for a gain that can wait;
   - rank the strong ones first, then the optional ones, each by what it wins for its size, and give each its size in dev-days;
   - draw a mockup for an item that changes a screen, and a diagram where one shows a change to the code's structure.

   Write it by [the kit](../method/references/artifacts.md), from [its template](../method/assets/review-report.html), to `docs/artifacts/NN-review-sprint-<n>.html`: `NN` the next free number in `docs/artifacts/`, and `<n>` the last closed sprint. A draft you go on from keeps its file. Then run `node <this skill's folder>/../method/scripts/wrap-artifact.mjs <the file>`, and fix each fault it names. Done when the wrap prints "no fault".
4. **Picks.** Ask in plain text, since a dialog would cover the list, with the items as bullets, so that a bare number is always an option, and end your reply:

   ```
   **The picks**
   - <rank> · <badge> · <title>: about <n> dev-days<; through decide: it reopens D<n>><; through architecture: <what changes>>
   The report: `docs/artifacts/NN-review-sprint-<n>.html`, to open in a browser.

   Which items should I plan?
   1. The strong ones: items <ranks> (Recommended)
   2. All of them
   3. None: the report alone
   4. Only those you name, such as "items 2 and 5"
   ```

   With no strong item, leave out the first option, and recommend "None". Done when the user chose.
5. **Agree.** Each pick takes the route its item shows. A strong pick's story joins the milestone under way, the first with a `planned` story, after the stories it depends on, so that the next sprint can take it. An optional pick's joins the next phase, or the last milestone where none follows. Show the summary in one reply, in four parts:
   - **The report:** its path, its items, and what each look read and ran;
   - **The stories:** each with its id, title, milestone, module, size, "Depends on" and "Decisions", and its place in the roadmap's list; then each milestone's new sum and the plan's new total;
   - **Through decide and architecture:** each such pick, with the question it brings or the change it makes. It gets no story;
   - **What the yes writes:** each file and its change, and the review's row, which makes the report final.

   Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   Where your tool list has the tool that your host's map names for publishing, add "2. Yes, and publish it: <what the map says publishing makes>" before "Not yet", as the kit says. "Not yet" may move a pick, change a story, change the picks, or change the report, which you write and wrap again. Show what changed, and ask again. On the yes, and only then, read [the rows](assets/rows.md), and write in this order:
   1. **The stories,** each in its milestone's document, with a change-log row.
   2. **The roadmap:** each story in its list, the rows' sums and the plan's total, with a row.
   3. **The modules:** each story's id in its module's Stories cell of the architecture, with a row.
   4. **The overview,** made again in place, as concept makes it on a later run, then wrapped. Steps 1 to 4 are skipped where no pick is a story.
   5. **The review's row** in the rules' `## Reviews`, with its change-log row: the report is final from here.
   6. **The checks:** `node <this skill's folder>/../method/scripts/check-plan.mjs <the project's folder>`, then `check-architecture.mjs` and `check-design.mjs` from the same folder. Fix each fault in what this step wrote; a fault that needs a choice goes back to the user.

   Then publish the report, where the user chose it. Done when the marks are written, and the checks end with "0 faults".
6. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column: decide where a pick goes there, then architecture, else new sprint for the stories. Name each that applies, in that order, and say of each whose `../<skill>/SKILL.md` doesn't exist that it isn't installed yet. Offer the first that is installed. End with:

   ```
   **Review: done.**
   **Report:** `docs/artifacts/NN-review-sprint-<n>.html`, <n> items, final.
   **Picks:** <each pick by its rank: a story <id> in <milestone>, or decide's or architecture's, with its question>, or none.
   **Written:** <each file the yes changed>.
   **Left:** <the items not picked, by rank>, or nothing.
   **Next:** <decide, architecture or new sprint>, with `<its skill>`: <why>.
   1. Start `<the first that is installed>` now (Recommended)
   2. Stop here
   ```

   Start it only at the user's word. Done when the user chose.

## Stop

- If `AGENTS.md` has no line "The documents flow top-down: …", write nothing, and reply:

  ```
  **Gradatim · review**

  **Review: stopped.** This folder holds no Gradatim project: <what you found>. Nothing was written.
  **Next:** init, with `init-project`: it sets the project up.
  1. Start `init-project` now (Recommended)
  2. Stop here
  ```
- If no sprint is closed, write nothing, and reply:

  ```
  **Gradatim · review**

  **Review: stopped.** No sprint has closed yet: <what you found>. A review looks at what the sprints built, so nothing was written.
  **Next:** <new sprint, or the step for the open sprint's next task>, with `<its skill>`: <why>.
  1. Start `<its skill>` now (Recommended)
  2. Stop here
  ```
- If the user stops at a question, write nothing more, and reply:

  ```
  **Gradatim · review**

  **Review: stopped.** <Where it stopped, and why>. <The draft stays at `docs/artifacts/<file>`, and the next review offers to go on from it; or: Nothing was written.>
  **Next:** <review again, with `review-project`, to go on from the draft; or the cycle's next step for the project's state, with its skill>.
  ```

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.
