# Sprints

*The rules every sprint follows, the module codes, and the sprints. Written by the new sprint step on 2026-11-07.*

## The rules

- **The size:** about 5 to 8 senior dev-days, as a guide, not a limit. A sprint may stretch to 10 with its reason in its README, and a milestone's last sprint may hold less.
- **One task per story,** under the module that names it. A story of half a day or less joins the task of the story it follows in the same module, within the sprint and where that breaks no order. A story over about 3 dev-days splits. The sprint's README says why for each.
- **A task in a module that names no story** has the milestone it serves as its Story, `the MVP` or `phase <k>`. Its close marks no story delivered.
- **What waits comes first:** the fix for a release that was rolled back, then the deferred items, then the open issues, then new stories.
- **The board is in the order of work,** so no task comes before one it depends on. Urgent or split-off work joins the open sprint through "add a task".
- **At most one sprint is open.**
- **Ids, statuses and sealing** are as [the development cycle](../agents/development-cycle.md) says.

## Module codes

| Code | Module |
|---|---|
| `APP` | App shell |
| `STO` | Device store |
| `SHF` | Shelves |
| `BOK` | Books |
| `LKP` | Lookup |
| `COV` | Covers |
| `SYN` | Account and sync |
| `OPS` | Hosting and release |

## The sprints

| Sprint | Status | Opened |
|---|---|---|
| [sprint-1](sprint-1/README.md) | `closed 2026-11-11` | 2026-11-07 |
| [sprint-2](sprint-2/README.md) | `closed 2026-11-12` | 2026-11-11 |
| [sprint-3](sprint-3/README.md) | `closed 2026-11-14` | 2026-11-14 |

## Reviews

| Date | After | Report | Picks |
|---|---|---|---|
| 2026-11-13 | sprint-2 | [02-review-sprint-2.html](../artifacts/02-review-sprint-2.html) | item 1: M10 |

## Change log

| Date | Change |
|---|---|
| 2026-11-07 | Written by the new sprint step: the rules and 8 module codes |
| 2026-11-07 | Sprint 1 opened: OPS-1 to SHF-2, 10.75 dev-days |
| 2026-11-11 | Sprint 1 closed |
| 2026-11-11 | The size: about 10 to 15 senior dev-days, stretching to 20, becomes about 5 to 8 senior dev-days, stretching to 10, from sprint 1's close, at the user's word |
| 2026-11-11 | Sprint 2 opened: STO-2 to BOK-3, 4.5 dev-days |
| 2026-11-12 | Sprint 2 closed |
| 2026-11-13 | The review after sprint 2: item 1, adding a book offline, as M10 |
| 2026-11-14 | Sprint 3 opened: BOK-4 and OPS-3, 0.75 dev-days, at the user's word |
| 2026-11-14 | Sprint 3 closed |
