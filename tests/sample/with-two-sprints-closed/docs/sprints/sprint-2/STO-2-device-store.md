# STO-2 · Device store: Dexie schema with sync-ready rows

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | the MVP |
| Depends on | — |
| Takes | `2026-11-11-STO-1-device-store.md` |

## Goal

One Dexie database holds the shelves, books, covers and lookups tables, with every row carrying an `id`, `updatedAt` and `deleted`, ready for sync (D11, D13).

## Scope

**In**
- All that the deferred item carries, since STO-1's build had not started.
- The Dexie database, its first schema version and the place for later migrations.
- The four tables as the architecture's Data lists them, with their indexes.
- A shared helper that stamps `id`, `updatedAt` and `deleted` on every write, and reads that skip deleted rows.

**Out**
- Each module's own functions (`shelves.ts`, `books.ts`): SHF-3, BOK-3 and the tasks after them.
- Sync itself: phase 1.

## Acceptance criteria

- [x] A unit test writes and reads a row in each table, with its `id`, `updatedAt` and `deleted` set. **Shown 2026-11-11:** `src/lib/store/db.test.ts` writes a shelf, a book, a cover and a lookup, and reads each back with a UUID for its `id`, the write's `updatedAt`, and `deleted` false.
- [x] A soft-deleted row is left out of the reads and kept in the table. **Shown 2026-11-11:** `db.test.ts` deletes a shelf softly: the helper's read leaves it out, and the table still holds it, marked deleted, with a later `updatedAt`.
- [x] The database opens again after a reload, with its rows. **Shown 2026-11-11:** `db.test.ts` closes the database and opens it again by its name, as a reload does, and finds its rows.

## Questions for the brainstorm

1. **Is `updatedAt` the device clock or a hybrid logical clock?** D9 says the latest change wins, and P1.3 will compare these times. Proposed: the device clock in milliseconds now, with the field named so that P1.3 can change its meaning.
2. **How are the tests run without a browser?** Vitest runs in Node. Proposed: `fake-indexeddb` in the unit tests.

## Documents to check on close

- [The architecture](../../ARCHITECTURE.md)'s Data, if a field or table differs.

## Log

| Date | Event |
|---|---|
| 2026-11-11 | Written by the new sprint step. |
| 2026-11-11 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-11 | `dexie` joins the dependencies, and `fake-indexeddb` the dev dependencies, imported in the Vitest setup, as the second question proposed. |
| 2026-11-11 | `src/lib/store/db.ts` holds the database `shelf` at schema version 1, with the four tables and their indexes as the architecture's Data lists them, and a note where version 2 and its upgrade go. `src/lib/store/rows.ts` stamps `id`, `updatedAt` and `deleted` on each new row, deletes softly, and reads past the deleted rows; `updatedAt` is the device clock in milliseconds, behind one function, as the first question proposed. Shown by `npm test` (`db.test.ts` failed first on the missing module, then 8 passed) and `npm run check` (0 errors). |
| 2026-11-11 | What shows each criterion, for the close: 1. `src/lib/store/db.test.ts` writes a shelf, a book, a cover and a lookup, and reads each back with its `id`, `updatedAt` and `deleted` · 2. `db.test.ts` leaves a soft-deleted shelf out of the reads, and finds it in the table, marked, with a later `updatedAt` · 3. `db.test.ts` opens the database again by its name, as a reload does, and finds its rows |
| 2026-11-11 | Built by the build task step, on `main`, with no branch of its own. The close is next. |
| 2026-11-11 | Closed by the close task step: `completed`, every criterion shown. Review: L1 applied, a change to a row goes through the helper's `change`, which stamps `updatedAt` too, with its test. Documents: none: the architecture's Data holds as built. |
