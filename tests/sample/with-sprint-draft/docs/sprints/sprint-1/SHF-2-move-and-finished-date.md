# SHF-2 · Move or remove a book, and edit its finished date

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | M7, M8 |
| Depends on | BOK-1 |
| Takes | — |

## Goal

A reader moves a book to another shelf or removes it, moving onto Finished records today's date and moving off clears it, and the reader can edit that date (M7, M8, D5, D7).

## Scope

**In**
- Moving a book between shelves, and removing it as a soft delete.
- Setting and clearing `finishedAt` on the moves onto and off Finished.
- Editing a finished book's date.

**Out**
- The yearly count: phase 1, P1.1.

## Acceptance criteria

- [ ] A book moved onto Finished shows the date it was finished.
- [ ] A book moved off Finished has no finished date.
- [ ] A book shows the finished date the reader set.

## Questions for the brainstorm

1. **May the finished date be in the future?** Proposed: no, any date up to today.
2. **Is removing a book undoable?** Proposed: yes, for a few seconds, since the row is only soft-deleted.

## Documents to check on close

- [The MVP](../../MVP.md): M7's and M8's status.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
