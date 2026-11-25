# STO-1 · Device store: Dexie schema with sync-ready rows

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | the MVP |
| Depends on | OPS-1 |
| Takes | — |

## Goal

One Dexie database holds the shelves, books, covers and lookups tables, with every row carrying an `id`, `updatedAt` and `deleted`, ready for sync (D11, D13).

## Scope

**In**
- The Dexie database, its first schema version and the place for later migrations.
- The four tables as the architecture's Data lists them, with their indexes.
- A shared helper that stamps `id`, `updatedAt` and `deleted` on every write, and reads that skip deleted rows.

**Out**
- Each module's own functions (`shelves.ts`, `books.ts`): SHF-1, BOK-1 and the tasks after them.
- Sync itself: phase 1.

## Acceptance criteria

- [ ] A unit test writes and reads a row in each table, with its `id`, `updatedAt` and `deleted` set.
- [ ] A soft-deleted row is left out of the reads and kept in the table.
- [ ] The database opens again after a reload, with its rows.

## Questions for the brainstorm

1. **Is `updatedAt` the device clock or a hybrid logical clock?** D9 says the latest change wins, and P1.3 will compare these times. Proposed: the device clock in milliseconds now, with the field named so that P1.3 can change its meaning.
2. **How are the tests run without a browser?** Vitest runs in Node. Proposed: `fake-indexeddb` in the unit tests.

## Documents to check on close

- [The architecture](../../ARCHITECTURE.md)'s Data, if a field or table differs.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
