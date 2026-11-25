# The sync

*How a change reaches every document it made stale. Written by MTH-3 on 2026-11-05. Decide, architecture, close task and close sprint run it after their user's yes, and design task and build task for a change they took: close task before it seals its task, design task and build task before their own final marks, the others after theirs. [documents.md](documents.md) holds the documents, their kinds and the hierarchy it follows.*

**A usual sync:** one search for the change's ids and terms, the hits read, one edit per document, and the check. Fewer for a small change, more when it reaches many tasks.

## Who runs it, and how

- **Its callers:** decide, for its decisions; architecture, for a changed stack or structure; design task, build task and close task, for a change they took, as [the change](change.md) says; close task, for what the task made stale; close sprint, for what the sprint built.
- **In a subagent** where your host has one, on the model your host's map gives a build. Wait for its report. Without subagents, run it here, at the same point, and keep its report apart.
- **The brief** holds:
  - the absolute paths of the project, this file, documents.md, [the check](../scripts/check-docs.mjs) and your host's map;
  - the source, with its record's path: the decisions and what they replace, a change and its note or record, the closed task and the facts it added, or the closed sprint;
  - your list of documents to check, such as a task's "Documents to check on close";
  - from design task, build task or close task, that the task's file and design are its own: leave them, and report what in them is stale;
  - today's date;
  - that its reply is the report alone. It asks the user nothing and hands a question back instead, starts no subagent, and runs no git command.

## What it may change

These documents only, and only while they are living. It creates and deletes none: a missing document belongs to the step that creates it.

| Document | Path | While |
|---|---|---|
| Agent file | `AGENTS.md` | always |
| Agent docs | `docs/agents/<topic>.md` | always |
| Concept | `docs/MAIN_CONCEPT.md` | always |
| MVP | `docs/MVP.md` | always |
| Roadmap | `docs/ROADMAP.md` | always |
| Phase | `docs/PHASE-<k>.md` | always |
| Architecture | `docs/ARCHITECTURE.md` | always |
| Runbook | `docs/RUNBOOK.md` | always |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | its sprint is open |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | its task is open |
| Design | `docs/plans/<ID>-<slug>-design.md` | its task is open |
| Issue | `docs/issues/YYYY-MM-DD-<ID>-<topic>.md` | always |
| Deferred item | `docs/deferred-items/YYYY-MM-DD-<origin>-<topic>.md` | always |

## The hard lines

- **It makes no choice.** It carries down what the source settled. Where a stale spot needs a choice the source didn't make, leave it, and report it for decide, or for architecture when it is the stack.
- **It changes no status, except one:** a story the source drops becomes `dropped`, and keeps its id. A task the source made obsolete stays `to-do`, with a log row that says so.
- **It never touches a sealed document,** not even with a row. Report each one the change made untrue: the record above it holds the change.
- **It leaves headings as they are,** since other documents link to them, and a sealed document's link can't be fixed. Change the text under a heading. A story the source moves keeps its heading, with one line that links its new place, and goes whole under the same heading there, with its status.
- **It logs each change where it lands,** one row per document:
  - a task, a sprint README, an issue and a deferred item get a row in their `| Date | Event |` log;
  - any other living document gets a row in the `## Change log` table at its end, `| Date | Change |`, made if it has none;
  - the change ends with its source in brackets, such as "M5 moves to phase 1, with its id (D10)";
  - `AGENTS.md` and the agent docs keep no log.
- **It leaves another step's work to that step:** research, decision records, the sprint rules, artifacts and the release record. A document without its final mark is a draft: leave it, and report it.

## The way

1. Read the source's record.
2. Take the caller's list. Then search `docs/` and `AGENTS.md` once, for the source's ids, the ids it touches and the terms of what changed, and read each hit in its context.
3. Go down the tiers from the highest document the change touches: the concept, the plan, the architecture with `AGENTS.md` and the agent docs, the open sprint, then the open tasks with their designs, issues and deferred items. Update each from the one above it, or leave it because it is still true. A fact a task added goes where facts of its kind live, such as a command in the agent docs.
4. Run `node <the method's folder>/scripts/check-docs.mjs <the project's folder>`. Fix a fault that is clear and sits in a document you may change, such as a link to an issue, which becomes its file name in backticks. Report the rest.

Done when the check shows no fault that your edits made, and the report is written.

## The report

A subagent's whole reply, and what the caller shows in its final message:

```
**Drift report** for <the source>:
**Changed:** <each document, linked: what changed>, or nothing.
**Left as sealed:** <each sealed document: what in it is now untrue>, or nothing.
**Left for another step:** <each document or choice: the step that changes it>, or nothing.
**Check:** <the check's last line>.
```
