# The quick start

*How init starts Gradatim in a project with code and work under way, with one agreement before the first task's design. Written by MTH-11 on 2026-11-18. Init runs it once the user picks "From what's here".*

**A usual quick start:** one read in a subagent, a round only where something is open, the drafts in one message, three checks, one agreement, the marks.

## What it writes

Each `docs/` path stands for the folder `AGENTS.md` names.

| Document | Path | Step | Use | Template |
|---|---|---|---|---|
| Research report | `docs/research/NN-<topic>.md` | research | creates | [code.md](../../research-topics/assets/code.md) |
| Research index | `docs/research/README.md` | research | creates, changes | [its block](../../research-topics/SKILL.md#steps) |
| Concept | `docs/MAIN_CONCEPT.md` | concept | creates | [concept.md](../../write-concept/assets/concept.md) |
| MVP | `docs/MVP.md` | concept | creates | [mvp.md](../../write-concept/assets/mvp.md) |
| Roadmap | `docs/ROADMAP.md` | concept | creates | [roadmap.md](../../write-concept/assets/roadmap.md) |
| Architecture's records | `docs/decisions/architecture.md` | architecture | creates | [records.md](../../write-architecture/assets/records.md) |
| Decisions index | `docs/decisions/README.md` | decide | creates, changes | [index.md](../../decide-direction/assets/index.md) |
| Architecture | `docs/ARCHITECTURE.md` | architecture | creates | [architecture.md](../../write-architecture/assets/architecture.md) |
| Runbook | `docs/RUNBOOK.md` | architecture | creates | [runbook.md](../../write-architecture/assets/runbook.md) |
| Agent docs | `docs/agents/<topic>.md` | architecture | creates | [development-cycle.md](../../write-architecture/assets/development-cycle.md), [commands.md](../../write-architecture/assets/commands.md) |
| Sprint rules and index | `docs/sprints/README.md` | new sprint | creates | [sprint-rules.md](../../new-sprint/assets/sprint-rules.md) |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | new sprint | creates | [sprint.md](../../new-sprint/assets/sprint.md) |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | new sprint | creates | [task.md](../../new-sprint/assets/task.md) |
| Agent file | `AGENTS.md` | init | changes | the marks below |

## The hard lines

- **Only this table, in the folder:** never a file of the project's own, a hook or a setting. A refused write: [the capabilities](capabilities.md#a-refused-write).
- **No other skill starts.** One round at most, one agreement, no final mark before the yes.
- **Each document from its template**, with its opening line and fixed parts, short. Before the yes the plan cites no decision: its opening lines say "the idea alone", and a story's Decisions "none, the user's word" where the project's plan names it, else "none, from the code". A story is `existing` only where the report shows it whole.
- **The project's names stay:**
  - its task codes are the modules', with a third column in the sprint rules' codes table, "Own up to": the project's highest number;
  - a task taken over keeps its id, with a `From` row naming the project's file as a path in backticks; a new task takes the next number;
  - the first sprint takes the number of the project's open sprint, and its tasks may share a story;
  - the records go on after the project's highest `D<n>`;
  - any other task, story or decision of the project's is named by its file's path alone: any id reads as Gradatim's.
- **The checks** in `../scripts/`: `check-plan`, `check-architecture` and `check-sprint` end at "0 faults" before the agreement and after the marks.
- **No sync, no commit.** After a compaction, read this file again: the drafts show how far the run got.

## The way

1. **The read.** Hand it to a subagent, on the model your host's map gives research, on [the brief](../../research-topics/assets/code.md), for `docs/research/NN-the-code.md`. Tell it: a map, deep only where the open work lands; its documents first, then the stack, each module in a line or two, the commands and tests; each open item of the project's plan a finding under "Half built", with its file, its status and where it lands. Then read the report; open none of the project's task files. Done when its check passes.
2. **The round,** only where a draft needs what the report and the project's documents leave open: up to four questions, the recommended option first.
3. **The drafts**, in one message:
   - the plan: a short concept; the MVP as the milestone under way, done items `existing`, open ones `planned`; a roadmap of one row; no phase, no overview;
   - the architecture: records, a choice the code made "found in the code" and what nothing answers a deferral pinned to the MVP; its eight parts; a short runbook; the development cycle, with the found base as its Branch line, and the commands, each naming the project's own doc;
   - the sprint: the rules, with the project's sprint size, else "about a to b senior dev-days" from the work; one task per open item. Where the project designed a task, its first question for the brainstorm names that design's path, with "Proposed: follow it".
4. **The checks,** to "0 faults".
5. **The agreement**, in five parts: the read; the plan; the architecture; the sprint, with its tasks; and how Gradatim fits: its folder, the rules and hooks it follows, the project's skills beside its steps. Each part says what you wrote, what you chose for the user, what is open, and what the yes will write. Then ask in plain text and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   A change: draft it, check, show it, ask again.
6. **The marks**, at the yes, in order: research's index row; the decisions index, a row per record; in `AGENTS.md`, concept's link in place of `### The idea`, and architecture's pointers; the sprint's row, `open`. Then the checks again. Next: design task, for the sprint's first task.
