# SHF-3 · Shelves the reader names

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | M2 |
| Depends on | STO-2, APP-2 |
| Takes | `2026-11-11-SHF-1-named-shelves.md` |
| Design | [the design](../../plans/SHF-3-named-shelves-design.md) |

## Goal

A new reader starts with Reading, To read and Finished, renames any of them, adds and deletes their own, and Finished stays marked when renamed (M2, D5).

## Scope

**In**
- All that the deferred item carries, since SHF-1's build had not started.
- `shelves.ts`: create, rename, reorder and delete, and the three starting shelves on first open.
- The shelves view, reading through a Dexie live query.

**Out**
- Books on a shelf: BOK-3.
- Moving books: M7, for a later sprint.

## Acceptance criteria

- [x] A reader renames To read, adds a shelf, and sees both after reopening Shelf offline. **Shown 2026-11-12:** `e2e/shelves.test.ts` renames To read to Next up, adds Borrowed, closes the page, and opens Shelf again in a new one with the network off: the four shelves show in order, at a desktop's and a phone's width.
- [x] Finished, once renamed, is still the shelf marked `isFinished`. **Shown 2026-11-12:** `src/lib/shelves.test.ts` renames Finished to Done, which keeps its id and its mark, the only shelf marked.
- [x] *New, by the design of 2026-11-11:* A shelf that holds books, and the Finished shelf, can't be deleted, and Shelf says why. **Shown 2026-11-12:** `shelves.test.ts` refuses to delete Finished and a shelf that holds a book; `src/routes/page.test.ts` finds each reason beside its shelf.

## Questions for the brainstorm

1. **What happens to the books on a deleted shelf?** D5 says one shelf per book. Proposed: a shelf with books can't be deleted until they are moved, and the marked Finished shelf can't be deleted.
2. **Can a reader reorder shelves?** The data has a position. Proposed: yes, simply, by moving one up or down.

## Documents to check on close

- [The MVP](../../MVP.md): M2's status.

## Log

| Date | Event |
|---|---|
| 2026-11-11 | Written by the new sprint step. |
| 2026-11-11 | Designed by the design task step: [the design](../../plans/SHF-3-named-shelves-design.md). A shelf that holds books, and Finished, can't be deleted, and a shelf moves up or down one place; one criterion added; days unchanged. |
| 2026-11-12 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-12 | Step 1: `src/lib/shelves.ts` makes Reading, To read and Finished on first open, once, in one transaction, and lists the shelves in order, also as a live query; the root layout makes them on Shelf's first open. Shown by `npm test` (`shelves.test.ts` failed first on the missing module). |
| 2026-11-12 | Step 2: rename, add, move and delete, with a blank or taken name refused, Finished marked under any name, and the two deletes refused, shown by `npm test` (`shelves.test.ts`, 10 passed). |
| 2026-11-12 | Step 3: the home page lists the shelves, each with its heading, Finished's mark, and buttons to rename, move and delete it, with a field to add a shelf, and a refusal's reason beside its shelf. Shown by `npm test` (25 passed), `npm run test:e2e` (`shelves.test.ts` failed first on no Rename button, then 10 passed) and `npm run build`. |
| 2026-11-12 | What shows each criterion, for the close: 1. `e2e/shelves.test.ts` renames To read to Next up, adds Borrowed, and finds both after reopening Shelf with the network off, at a desktop's and a phone's width · 2. `shelves.test.ts` renames Finished to Done, which keeps its id and its mark, the only one · 3. `shelves.test.ts` refuses to delete Finished and a shelf that holds a book; `src/routes/page.test.ts` finds each reason beside its shelf |
| 2026-11-12 | Built by the build task step, on `main`, with no branch of its own. The close is next. |
| 2026-11-12 | Closed by the close task step: `completed`, every criterion shown. Review: no findings. Documents: none. |
