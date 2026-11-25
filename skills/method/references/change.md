# The change

*How design task, build task and close task take a change that comes up while they run, and which change goes to decide instead. Written by MTH-12 on 2026-11-24. Read it when a change comes up. [documents.md](documents.md) holds the records and their marks, and [the sync](sync.md) carries a change down.*

**A usual change:** one search, a few lines in the reply, a mark, and the step goes on; at its yes, a note, the sync where it reaches further, and the checks.

## Whose it is

- **A change of direction** is decide's, or architecture's for the stack and the modules: who the project is for, or what it is; more of the MVP's cut than a story or two; the stack replaced, such as its language or its framework; the modules redrawn. Write nothing, and stop with your step's reply, which says why in a line.
- **Any other change is yours,** whatever a decision, the plan or the architecture says: a decision's detail, a tool, a library, a CI job, one service for another, a seam between two modules, an open choice that the architecture pins to this task's story, one story added, dropped or reworded, and the task's scope, criteria or days. Say in a line why it is yours.
- **The user's word wins** both ways, and so does a rule of theirs, in `AGENTS.md` or in the development cycle's "This project". The development cycle's other parts are the method's: where an older text there sends every changed choice to decide, this file holds.

## Where it comes up

1. **Search** `docs/` and `AGENTS.md` once for the ids and the terms it touches, as the sync's way does.
2. **Say it** at the top of the same reply, in two to five lines: what changes; each record it touches, by its id, and the documents and open tasks; and each sealed document it makes untrue, which stays as it is. Where a record's Over or Why argues against the change, say so once, with its id. Ask only where two readings of the user's words would lead to different work.
3. **Mark it:** in a design, as one of the user's decisions; in a build, at once, as a departure under the step it changes, with a row in the task's log; in a close, as a departure, which its closing row names.
4. **Go on** from where you were. Your agreement shows each change again, with what the yes writes for it. A build that stops before its yes keeps the change in its log and its mark, for the next run's agreement.

## At the yes

Before your step's own marks, in this order:

1. **The record.** Where a decision still holds with a part changed, a note under it, after its last line and a blank line, in its own file. Its id and its index row stay as they are.

   ```markdown
   > **Changed in <ID>'s <design, build or close>, YYYY-MM-DD.** <One sentence: what holds now>, at the user's word.
   ```

   Only where an open choice is settled, or nothing of the old decision holds, a record instead: in `docs/decisions/architecture.md`, under a section of today's date, from [the records' template](../../write-architecture/assets/records.md), with its index rows and its forward note. A change that touches no record gets neither.
2. **The criteria.** A criterion that the change rewrites or drops keeps its line, in the task and in the design's table: `*Changed in the <step>, YYYY-MM-DD:*` before its new text, or `*Dropped in the <step>, YYYY-MM-DD,* at the user's word:` before the old. A dropped criterion needs no evidence, and the task can still close `completed`.
3. **The sync,** where the search found more than the task and its design: run [the sync](sync.md), with the change and its note or record as its source, the search's hits as its list, and the task file and its design as yours, for it to leave. Close task puts the change into its own sync. Show the report in your final message, from "**Drift report**" on. Where a story is added or dropped, the overview is concept's: name it as left.
4. **The checks:** your step's own; then, after a note or a record in `docs/decisions/architecture.md`, `node <the method's folder>/scripts/check-architecture.mjs <the project's folder>`; each to "0 faults".

## What it may change

Besides your table and the sync's, these documents, each only where it exists:

| Document | Path |
|---|---|
| Decisions index | `docs/decisions/README.md` |
| Decision session | `docs/decisions/NN-<topic>.md` |
| Architecture's records | `docs/decisions/architecture.md` |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` |
