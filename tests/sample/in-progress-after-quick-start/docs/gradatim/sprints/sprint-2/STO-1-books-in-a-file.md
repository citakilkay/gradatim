# STO-1 · Keep the books in a file

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | M4 |
| Depends on | SHF-3 |
| Takes | — |
| From | `docs/sprints/sprint-2/STO-1-books-in-a-file.md` |

## Goal

The books, with their shelves, are kept in one file beside the app, so a restart loses nothing.

## Scope

**In**
- Reading the books and the shelves at the start, and writing them at each change.

**Out**
- Any store but a local file.

## Acceptance criteria

- [ ] A book added before a restart is still on its shelf after it.

## Questions for the brainstorm

1. **Where the books are kept, as D4 leaves to M4.** The project's own task proposes one JSON file beside the app. Proposed: one JSON file, its path beside the app.

## Documents to check on close

- `docs/ARCHITECTURE.md`'s Data and Open choices, and D4.

## Log

| Date | Event |
|---|---|
| 2026-11-18 | Written by the new sprint step, through init's quick start, taken over from the project's `docs/sprints/sprint-2/STO-1-books-in-a-file.md`. |
