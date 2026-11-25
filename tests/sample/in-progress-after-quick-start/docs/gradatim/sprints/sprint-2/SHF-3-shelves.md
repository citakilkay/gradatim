# SHF-3 · Shelves the reader names

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | M3 |
| Depends on | — |
| Takes | — |
| From | `docs/sprints/sprint-2/SHF-3-shelves.md` |

## Goal

A reader makes their own shelves, such as Reading and Finished, and moves a book between them.

## Scope

**In**
- Adding a shelf by its name, moving a book to a shelf, and the page showing each book on its shelf.

**Out**
- Keeping the shelves through a restart, to STO-1.
- The year's count, to BOK-4.

## Acceptance criteria

- [ ] A reader adds a shelf by its name.
- [ ] A reader moves a book to that shelf.
- [ ] The page shows each book on its shelf.

## Questions for the brainstorm

1. **Does the build follow the project's design?** The owner agreed `docs/specs/2026-11-12-SHF-3-shelves.md` on 2026-11-12: a field for a new shelf, a select beside each book, names unique whatever the case, "To read" first. Proposed: follow it.
2. **Can a shelf that holds books be deleted?** The project's design leaves it open. Proposed: no delete in this task.

## Documents to check on close

- `docs/ARCHITECTURE.md`'s Data, for the list of shelves.

## Log

| Date | Event |
|---|---|
| 2026-11-18 | Written by the new sprint step, through init's quick start, taken over from the project's `docs/sprints/sprint-2/SHF-3-shelves.md`. |
