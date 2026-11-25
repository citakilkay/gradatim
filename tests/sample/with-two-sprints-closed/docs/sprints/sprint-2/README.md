# Sprint 2

Parent: [the architecture](../../ARCHITECTURE.md)

| | |
|---|---|
| Status | `closed 2026-11-12` |
| Opened | 2026-11-11 |
| Goal | A reader opens Shelf with the network off after a first visit, keeps shelves they name, and adds a book to one by its ISBN. |
| Capacity | 4.5 of about 5 to 8 dev-days |

## Scope

The sprint builds what the rest of the MVP rests on, across four modules: the device store (`STO`), the app shell (`APP`), shelves (`SHF`) and books (`BOK`). It takes four of the seven deferred items of sprint 1's close, each by a task that goes on from the one deferred, and delivers M1, M2 and M3. It holds 4.5 dev-days, half a day under the band of 5 to 8, at the user's word: sprint 1 taught that 10.75 dev-days were too many, and these four tasks are the ones every later story needs. The lookup, M4 at 2 dev-days, would take it to 6.5, and waits for the next sprint with the other items.

- STO-2 is a setup task for the MVP, since the device store names no story and every story keeps its rows there. It takes `2026-11-11-STO-1-device-store.md`, at STO-1's day.
- APP-2 takes `2026-11-11-APP-1-offline-app-shell.md`, SHF-3 takes `2026-11-11-SHF-1-named-shelves.md`, and BOK-3 takes `2026-11-11-BOK-1-add-by-isbn.md`, each at its story's estimate.
- Left: `2026-11-11-LKP-1-open-library-lookup.md`, `2026-11-11-BOK-2-manual-details.md` and `2026-11-11-COV-1-stored-covers.md`, whose stories need these four first; and the open issue, `2026-11-09-OPS-2-preview-footer-pr-number.md`, which waits for a choice of architecture or decide, not for a task.

## Board

| Task | Title | Story | Depends on | Days | Status |
|---|---|---|---|---|---|
| [STO-2](STO-2-device-store.md) | Device store: Dexie schema with sync-ready rows | the MVP | — | 1 | `completed` |
| [APP-2](APP-2-offline-app-shell.md) | Offline app shell | M1 | — | 1 | `completed` |
| [SHF-3](SHF-3-named-shelves.md) | Shelves the reader names | M2 | STO-2, APP-2 | 1.5 | `completed` |
| [BOK-3](BOK-3-add-by-isbn.md) | Add a book by its ISBN | M3 | SHF-3 | 1 | `completed` |

## Log

| Date | Event |
|---|---|
| 2026-11-11 | Opened by the new sprint step: STO-2, APP-2, SHF-3, BOK-3, 4.5 dev-days |
| 2026-11-11 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-11 | STO-2 closed by the close task step: `completed`. |
| 2026-11-11 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-11 | APP-2 closed by the close task step: `completed`. |
| 2026-11-11 | SHF-3 designed: [the design](../../plans/SHF-3-named-shelves-design.md), one criterion added, days unchanged |
| 2026-11-12 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-12 | SHF-3 closed by the close task step: `completed`. |
| 2026-11-12 | BOK-3 designed: [the design](../../plans/BOK-3-add-by-isbn-design.md), one criterion added, days unchanged |
| 2026-11-12 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-12 | BOK-3 closed by the close task step: `completed`. |
| 2026-11-12 | Closed by the close sprint step: STO-2, APP-2, SHF-3, BOK-3 `completed`. Delivered: M1, M2, M3. Check: the gate passed on the sprint's final state, its Playwright tests at a desktop's and a phone's width; M1 shown by `e2e/offline.test.ts`, M2 by `e2e/shelves.test.ts` and M3 by `e2e/add-book.test.ts`; the rows stamped and kept once soft-deleted (STO-2), the book and its lookup written in one transaction (BOK-3), and the Finished shelf kept from deletion (SHF-3), shown again by `db.test.ts`, `books.test.ts` and `shelves.test.ts`. Open: `2026-11-09-OPS-2-preview-footer-pr-number.md`, `2026-11-11-BOK-2-manual-details.md`, `2026-11-11-COV-1-stored-covers.md` and `2026-11-11-LKP-1-open-library-lookup.md`. Taught: the four tasks closed whole at 4.5 dev-days, with no days moved at the two designs and no task added mid-sprint, so the next sprint can hold the band's 5 to 8 again; APP-2's first question proposed SvelteKit's `$service-worker` module, which SvelteKit 3 no longer has, so a task's question that names a library's module is checked against the version the project runs. |
