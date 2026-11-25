# Sprint 1

Parent: [the architecture](../../ARCHITECTURE.md)

| | |
|---|---|
| Status | `open` |
| Opened | 2026-11-07 |
| Goal | A reader, with the network off, adds a book by its ISBN, sees its title, author and cover filled in once back online, and moves it between their own shelves. |
| Capacity | 11 of about 10 to 15 dev-days |

## Scope

The sprint delivers the MVP, M1 to M9, across seven modules: hosting and release (`OPS`), the device store (`STO`), the app shell (`APP`), shelves (`SHF`), books (`BOK`), the lookup (`LKP`) and covers (`COV`). Account and sync (`SYN`) waits for phase 1. It holds 10.75 dev-days, within the band of 10 to 15: the MVP's 8.75 and two setup days, and it stops at the MVP's end.

- OPS-1 and STO-1 are setup tasks for the MVP, since their modules name no story and every story needs a project that builds and a database that stores. A day each.
- SHF-2 takes M7 and M8: M8, of half a day, follows M7 in the same module and depends on it.
- COV-1 takes M6 and M9: M9, of a quarter day, follows M6 in the same module. Open Library's answer may be slow, so the task asks early and sets the switch when it comes.
- BOK-2 holds M5 alone: joining it to BOK-1 would break the order, since M5 depends on M4, which LKP-1 builds after BOK-1.

## Board

| Task | Title | Story | Depends on | Days | Status |
|---|---|---|---|---|---|
| [OPS-1](OPS-1-project-setup.md) | Project setup and Cloudflare Pages | the MVP | — | 1 | `completed` |
| [OPS-2](OPS-2-version-in-the-footer.md) | The version in the footer | the MVP | OPS-1 | 0.25 | `to-do` |
| [STO-1](STO-1-device-store.md) | Device store: Dexie schema with sync-ready rows | the MVP | OPS-1 | 1 | `to-do` |
| [APP-1](APP-1-offline-app-shell.md) | Offline app shell | M1 | OPS-1 | 1 | `to-do` |
| [SHF-1](SHF-1-named-shelves.md) | Shelves the reader names | M2 | APP-1, STO-1 | 1.5 | `to-do` |
| [BOK-1](BOK-1-add-by-isbn.md) | Add a book by its ISBN | M3 | SHF-1 | 1 | `to-do` |
| [LKP-1](LKP-1-open-library-lookup.md) | Title and author from Open Library | M4 | BOK-1 | 2 | `to-do` |
| [BOK-2](BOK-2-manual-details.md) | Type the title and author by hand | M5 | LKP-1 | 0.5 | `to-do` |
| [COV-1](COV-1-stored-covers.md) | Covers stored on the device, with Open Library's word | M6, M9 | LKP-1 | 1.25 | `to-do` |
| [SHF-2](SHF-2-move-and-finished-date.md) | Move or remove a book, and edit its finished date | M7, M8 | BOK-1 | 1.5 | `to-do` |

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Opened by the new sprint step: OPS-1, STO-1, APP-1, SHF-1, BOK-1, LKP-1, BOK-2, COV-1, SHF-2, 10.75 dev-days |
| 2026-11-07 | OPS-1 designed: [the design](../../plans/OPS-1-project-setup-design.md), one criterion added, days unchanged |
| 2026-11-08 | Build started by the build task step, on branch `ops-1-project-setup`. |
| 2026-11-08 | OPS-1 closed: every criterion met |
| 2026-11-08 | OPS-1's pull request, from its branch `ops-1-project-setup`, squash-merged into `main`: https://github.com/example/shelf/pull/1 |
| 2026-11-08 | "Add a task" wrote OPS-2: 0.25 dev-days |
| 2026-11-08 | OPS-2 designed: [the design](../../plans/OPS-2-version-in-the-footer-design.md), days unchanged |
