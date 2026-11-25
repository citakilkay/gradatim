# The documents

*Every document that Gradatim's steps write in a project. Written by MTH-1 on 2026-10-28.*

| Document | Path | Kind | Created by | Changed by, and why | Read by |
|---|---|---|---|---|---|
| Agent file | `AGENTS.md` | living | init | concept: moves the idea into the concept, leaving a summary and a link · architecture: links its documents · the sync | every step; the host loads it in every session |
| Agent docs | `docs/agents/<topic>.md` | living | architecture | architecture: a new topic, or a changed stack · the sync: what a decision or a task made stale, such as a command | every step, through `AGENTS.md` |
| Research index | `docs/research/README.md` | living | research | research: a row for each report, "replaced by" when a newer report replaces one, and "checked again" when a report gains a note | decide, concept, architecture |
| Research report | `docs/research/NN-<topic>.md` | append-only | research | research: a dated note at its end when a finding is checked again | decide, concept, architecture, design task |
| Decisions index | `docs/decisions/README.md` | living | decide | decide and architecture: a row for each of their decisions, with its status · the change | every step from concept on |
| Decision session | `docs/decisions/NN-<topic>.md` | append-only | decide | decide: a dated correction, or a forward note under a decision that a later one replaces · architecture: a forward note under a decision that its records replace · the change | concept, architecture, design task, review, the sync |
| Architecture's records | `docs/decisions/architecture.md` | append-only | architecture | architecture: a dated section for each run · decide: a forward note under a record that a later decision replaces · the change | design task, review, the sync |
| Concept | `docs/MAIN_CONCEPT.md` | living | concept | concept: a changed plan · the sync | decide, and every step from architecture on |
| MVP | `docs/MVP.md` | living | concept | concept: a changed plan · close sprint: the stories the sprint delivered · review: the user's picks, as stories · the sync | architecture, new sprint, design task, review, demo |
| Roadmap | `docs/ROADMAP.md` | living | concept | concept: a changed plan · close sprint: the progress · review: its picks, placed in the order · the sync | new sprint, review |
| Phase | `docs/PHASE-<k>.md` | living | concept | concept: a changed plan · close sprint: the stories the sprint delivered · review: the user's picks, as stories · the sync | architecture, new sprint, design task, review, demo |
| Overview | `docs/artifacts/NN-overview.html` | living | concept | concept and review: made again when the plan changes | the user |
| Architecture | `docs/ARCHITECTURE.md` | living | architecture | architecture: a changed stack or structure · review: a pick's story, in its module's row · the sync: what a decision or a task made stale, such as a module's interface | new sprint, design task, build task, close task, draft PR, close sprint, release, review |
| Runbook | `docs/RUNBOOK.md` | living | architecture | architecture: a changed deployment · release: what a release taught · the sync: a decision or a task that changed how a release goes out | release |
| Release record | `docs/RELEASES.md` | append-only | release | release: an entry for each release, and a dated note such as a rollback | new sprint, design task, close sprint, review |
| Sprint rules and index | `docs/sprints/README.md` | living | new sprint | new sprint: a sprint's row, a new module code, a rule the user changes · close sprint: the sprint's closing date, and a rule the user changes · review: a row for each run | every step from new sprint on |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | living; sealed at its close | new sprint | new sprint: a task added, with its place and the capacity · design task: a log row, and its task's days and the capacity · build task and close task: their task's status and a log row · draft PR: a log row with the PR's link · close sprint: the deferrals and its closing row · the sync, while the sprint is open | every step from new sprint to release, review and demo |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | living; sealed at its close | new sprint | design task: the Design row, and the criteria it changes, marked · build task: the status and log rows · close task: the criteria's evidence, the status and the closing row, or a criterion moved in from a task closed as partial · close sprint: `deferred` · the change: a criterion it moves, marked · the sync, while it is open | design task, build task, close task, draft PR, release, review, demo |
| Design | `docs/plans/<ID>-<slug>-design.md` | living; sealed with its task | design task | design task: a revision, while its task is `to-do` · build task and close task: a departure, marked "Changed in the build, YYYY-MM-DD", or "in the close" · the sync, while its task is open | build task, close task, draft PR, close sprint, review |
| Issue | `docs/issues/YYYY-MM-DD-<ID>-<topic>.md` | living; deleted at its end | build task | build task: what it found later · new sprint: `addressed by <ID>` · close sprint: back to `open`, or deleted · the sync | new sprint, design task, close task, review |
| Deferred item | `docs/deferred-items/YYYY-MM-DD-<origin>-<topic>.md` | living; deleted at its end | close sprint | new sprint: `addressed by <ID>` · close sprint: back to `open`, or deleted · the sync | new sprint, design task, review |
| PR explainer | `docs/artifacts/NN-pr-<topic>.html` | living until its PR is merged, then sealed | draft PR | draft PR: while the PR is open | the PR's reviewers |
| Review report | `docs/artifacts/NN-review-sprint-<n>.html` | sealed | review | — | the user, decide |
| Demo walkthrough | `docs/demos/YYYY-MM-DD-<topic>.mjs` | sealed | demo | — | draft PR |
| Demo | `docs/demos/YYYY-MM-DD-<topic>.webm` | sealed | demo | — | the user, draft PR |

## The rules

1. **One step creates each document**, the one in its "Created by" cell. A folder may hold several kinds of document, each with its own creator.
2. **A step writes only what the map gives it.** For a document another step owns, go through that step, as close task does through new sprint's "add a task", or its templates and checks, as init's [quick start](quick-start.md) does.
3. **The sync updates what a change made stale,** as [sync.md](sync.md) says. Decide, architecture, close task and close sprint run it, and design task and build task for a change.
   - It never makes a choice. Decide takes a change of direction, and architecture one of the stack or the modules; [the change](change.md) says who takes the rest.
   - A fact that a task added, such as a new command or a module's interface, is recorded where facts of that kind live.
4. **Outside the map** are the project's own files, such as its code, its README, its CI and its changelog. Build task and close task write them, as the task's work, and release the version, as its runbook says. Demo writes only `.gitignore`. Gradatim never writes a `CLAUDE.md`.
5. **"Read by"** names the steps that read a document besides its creator. A step that changes a document reads it too.
6. **Dates** are written `YYYY-MM-DD`, and links are relative.
7. **A "Changed by, and why" cell** names each step, then a colon and its reason, with " · " between them. Steps that share a reason are joined with "and".
8. **A folder of Gradatim's own:** where the project's files hold its paths, `AGENTS.md` names one folder, such as `docs/gradatim/`, and each `docs/` path here stands for it.

## The kinds

- **Living:** edited in place, each change logged, as "Logs" says below.
- **Append-only:** nothing in it is rewritten; new entries and dated notes are added.
- **Deleted at its end:** issues and deferred items, once resolved. Since they go away, no document links to one: name it by its file name, in backticks.
- **A draft first:** a step's output is a draft until the user agrees to it. Until then the step may rewrite it, and other steps don't take it as final. The kind's rules hold from the agreement on, when its final marks are written. The plan is final once `AGENTS.md` links the concept. The architecture is final once the index lists its records. A sprint, or a review's report, is final once the sprint rules list it. A design is final once its task's Design row links it.

## The lines other steps rely on

Other steps read or change these, and the checks read several:
- **`Parent:`**, among the first lines:
  - of a task file: `Parent: [sprint <n>](README.md)`;
  - of a sprint's README: `Parent: [the architecture](../../ARCHITECTURE.md)`.
- **A task's header** is the table under its title, and holds rows for:
  - its Status;
  - its Story: story ids, or the milestone a setup task serves;
  - Depends on;
  - Takes: the file names of any issue or deferred item it takes;
  - From, for a task taken over from the project: its file, as a path in backticks;
  - Design: a link to its design, once it has one.
- **A sprint's README** has a header too, whose Status row is `open` or `closed YYYY-MM-DD`.
- **A sprint's board** is the first table in its README with Task and Status columns. It lists the tasks in the order of work, each by its id in the Task cell, with a Story column.
- **The module codes** open the rows of the architecture's modules table, and of the sprint rules' table; each has Code as its first column.
- **An issue or a deferred item** opens with a `Status:` line.
- **Logs:** a task file, a sprint's README, an issue and a deferred item end with a `| Date | Event |` table. A step that changes one adds a row. The other living documents, but `AGENTS.md` and the agent docs, end with a `## Change log` table, `| Date | Change |`. Build task's last two rows open "What shows each criterion, for the close:" and "Built by the build task step". A closing row opens "Closed by the close task step", or "Closed by the close sprint step".
- **An id where it is defined:** a decision's opens its row in the decisions index, and its record's heading, such as `### D17 · …`. A story's opens a heading, such as `### M4 · …`, with its line `Status: … · Estimate: … · Depends on: … · Decisions: …` under it, or the first cell of a table row, in the MVP or a phase. One that moves keeps its heading, with a line linking where it went, and sits whole there.
- **A research report** numbers its findings `F1`, `F2`…, each with its sources and its confidence. Its risks, watch-outs and trade-offs sit under the heading `## Risks, watch-outs and trade-offs`, its options under `## The options`, and what it couldn't settle under `## Gaps`. Other steps cite a finding as `NN Fk`, such as `02 F3`. A comparison of ideas for one choice is a report too, numbered after theirs. The report on the project's code, `NN-the-code.md`, cites paths in backticks, not links, and sorts its findings under `### What it does`, `### Stack and structure`, `### Commands and tests` and `### Half built`.
- **The research index** lists each report in a table with the columns Report, Date, Question, Feeds and Replaced by. A report is final once it has a row there.
- **A decision record** holds:
  - its id and title;
  - the decision;
  - what it was chosen over, and why;
  - its date;
  - the decision it replaces, if any.

  A deferral is a record too: its decision says when the area is decided, and what the plan assumes until then.
- **The decisions index** lists each decision in a table with the columns Decision, Title, Record and Status. A decision is final once it has a row there.
- **A forward note** goes under a decision that a later one replaces, in its own file: `> **Replaced by D<n>, YYYY-MM-DD.** <one sentence> (<a link to the new record>).` Decide, architecture and the change write it.
- **A release's entry** opens `## <version> · YYYY-MM-DD`, and its **Holds:** line names the tasks it ships; a rollback is a note under it, `> **Rolled back, YYYY-MM-DD.** …`.
- **A demo walkthrough** opens `// Gradatim demo: draft`, then `// Gradatim demo: final, YYYY-MM-DD` from the yes; git ignores its `.webm`.
- **`AGENTS.md`** holds this line: "The documents flow top-down: Concept → MVP and phases → Architecture → Sprints → Tasks."

## The hierarchy

Above the tiers sit the records: the research and the decisions.

The tiers, top first:
1. **The concept:** `docs/MAIN_CONCEPT.md`.
2. **The plan:** `docs/MVP.md`, `docs/ROADMAP.md` and `docs/PHASE-<k>.md`.
3. **The architecture:** `docs/ARCHITECTURE.md`, `docs/RUNBOOK.md`, `AGENTS.md` and `docs/agents/`.
4. **The sprints:** `docs/sprints/README.md`, and each sprint's README.
5. **The tasks:** task files, designs, issues and deferred items.

## Ids

| Item | Shape | Example | Given by |
|---|---|---|---|
| Task | The module's code, a hyphen, and the next number in that module, across all sprints, after the project's own | `SIG-2` | new sprint |
| Module code | Three capital letters, listed in `docs/sprints/README.md` before its first task | `SIG` | architecture |
| Story | `M<n>` in the MVP; `P<k>.<n>` in phase k | `M4`, `P2.3` | concept; review, for its picks |
| Decision | `D<n>`, one sequence across the project | `D17` | decide; architecture, for its records |
| Sprint | `sprint-<n>`, from 1 | `sprint-3` | new sprint |
| Research report, artifact | `NN-` at the start of the file name: the next number in its folder | `03-payments.md` | the step that creates it |
| Issue, deferred item | The file name: the date, the origin and the topic. The origin is a task id, or `sprint-<n>` for a finding of that sprint's close | `2026-11-03-SIG-2-retries` | build task; close sprint |
| Release | The project's version, or the date when it has none | `0.3.0` | release |

- No id is reused:
  - a task that is dropped or split keeps its number, and work split off it gets the next number in its module;
  - a story keeps its id when it moves, and when it is dropped.

## Statuses

| Task status | Meaning | Set by |
|---|---|---|
| `to-do` | Written, and not yet built | new sprint |
| `in-progress` | Its build has started | build task |
| `completed` | Closed, with every criterion met, or dropped by a change | close task |
| `completed-as-partial` | Closed, with at least one criterion moved to another task at the user's word, as its log says | close task |
| `deferred` | Left unfinished at its sprint's close. A deferred item carries what it still needs, or nothing when the user dropped it | close sprint |

- The step that changes a task's status changes it in the task's header and on the board together.
- A task that a decision made obsolete stays `to-do`, with a log row saying so. Its sprint's close then defers it with nothing carried.
- **Sprints:** `open`, set by new sprint; `closed YYYY-MM-DD`, set by close sprint.
- **Stories:**
  - `planned`, set by concept or review;
  - `existing`, set by concept, for a story the code meets whole when the plan is written;
  - `delivered`, set by close sprint;
  - `dropped`, set by concept, or by the sync when a decision drops the story.
- **Decisions:** `holds`, or `replaced by D<n>`. The step that records the new decision sets the second.
- **Issues and deferred items:** `open`, or `addressed by <ID>`, which new sprint sets when a task takes one.

## Sealing

| What | Sealed from |
|---|---|
| A task file and its design | The task's close, as `completed` or `completed-as-partial` |
| A `deferred` task and its design | Its sprint's close |
| A sprint's README | Its close |
| A PR explainer | The merge of its PR |
| A review report | Once the sprint rules list it |
| A demo | Once its walkthrough says final |

- A sealed document is neither rewritten nor added to, not even by a log row: it holds what was true at its close.
- A later choice that conflicts with a sealed document is recorded above it: in a decision, and in the living documents. Work that the choice needs is a new task, or the task's that took the change.
- The sprint's close checks with git that nothing sealed has changed since its seal, and puts back what has, at the user's word.

## The life of an issue

1. **Written:** by build task, for a problem that needs thought, not a quick fix, as `open`, and named in the task's log.
2. **Taken:** new sprint offers the open issues after the deferred items. The task that takes one copies what it needs and names it in its Takes row, and the issue becomes `addressed by <ID>`. "Add a task" can also take one in the middle of a sprint.
3. **Ended**, at the close of the sprint that took it:
   - if its task is `completed`, the issue is deleted;
   - otherwise it goes back to `open`, with a dated line saying what was done. A deferred item for the same task doesn't repeat it.

## The life of a deferred item

1. **Written**, at a sprint's close:
   - each `to-do` or `in-progress` task is proposed for deferral;
   - with the user's word, the task becomes `deferred`, and one deferred item carries the parts it still needs, not a copy of the task;
   - work that the sprint's own check defers gets an item too.
2. **Taken:** as an issue is; new sprint offers the deferred items first.
3. **Ended**, at the close of the sprint that took it:
   - once everything it carries is in a `completed` task, the item is deleted;
   - otherwise it goes back to `open`, with a dated line saying what was done.
