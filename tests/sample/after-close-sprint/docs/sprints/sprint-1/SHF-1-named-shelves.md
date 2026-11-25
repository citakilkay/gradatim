# SHF-1 · Shelves the reader names

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | M2 |
| Depends on | APP-1, STO-1 |
| Takes | — |

## Goal

A new reader starts with Reading, To read and Finished, renames any of them, adds and deletes their own, and Finished stays marked when renamed (M2, D5).

## Scope

**In**
- `shelves.ts`: create, rename, reorder and delete, and the three starting shelves on first open.
- The shelves view, reading through a Dexie live query.

**Out**
- Books on a shelf: BOK-1.
- Moving books: SHF-2.

## Acceptance criteria

- [x] A reader renames To read, adds a shelf, and sees both after reopening Shelf offline.
- [x] Finished, once renamed, is still the shelf marked `isFinished`.

## Questions for the brainstorm

1. **What happens to the books on a deleted shelf?** D5 says one shelf per book. Proposed: a shelf with books can't be deleted until they are moved, and the marked Finished shelf can't be deleted.
2. **Can a reader reorder shelves?** The data has a position. Proposed: yes, simply, by moving one up or down.

## Documents to check on close

- [The MVP](../../MVP.md): M2's status.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
| 2026-11-13 | Closed: every criterion met. Status `completed`. |
