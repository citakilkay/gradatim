# Sprint 1

Parent: [the architecture](../../ARCHITECTURE.md)

| | |
|---|---|
| Status | `open` |
| Opened | 2026-11-04 |
| Capacity | 13 of about 10 to 15 dev-days |

## Scope

The catalogue and the shelves (CAT, SHF), the server and sign-in (INF), and the offline shelves (SYN): the MVP's M1, M2, M4 and M5. M3 waits for sprint 2.

## Board

| Task | Title | Story | Depends on | Days | Status |
|---|---|---|---|---|---|
| [CAT-1](CAT-1-search-by-isbn.md) | Search by ISBN | M1 | — | 2 | `completed-as-partial` |
| [SHF-1](SHF-1-shelves.md) | Shelves and moving books | M2 | CAT-1 | 2 | `completed` |
| [SHF-2](SHF-2-books-added-twice.md) | Fix: a book added twice | M2 | SHF-1 | 0.5 | `to-do` |
| [INF-1](INF-1-server-sign-in-and-hosting.md) | The server, sign-in and hosting | M4 | — | 3 | `in-progress` |
| [CAT-2](CAT-2-covers-and-the-book-page.md) | Covers and the book page | M1 | CAT-1 | 1.5 | `to-do` |
| [CAT-3](CAT-3-lookups-within-the-rate-limit.md) | Lookups within the rate limit | M1 | CAT-1 | 1 | `to-do` |
| [SYN-1](SYN-1-offline-shelves.md) | Offline shelves and the catch-up | M5 | SHF-1, INF-1 | 3 | `to-do` |

## Log

| Date | Event |
|---|---|
| 2026-11-04 | Opened by the new sprint step: CAT-1, CAT-2, SHF-1, SYN-1 and INF-1, 11.5 dev-days |
| 2026-11-04 | CAT-1's design written |
| 2026-11-04 | CAT-1's build started: `in-progress` |
| 2026-11-05 | CAT-1 closed as `completed-as-partial`. "Add a task" wrote CAT-3, which takes the rate-limit issue: 12.5 dev-days |
| 2026-11-05 | SHF-1 designed, built and closed as `completed` |
| 2026-11-05 | A draft PR for CAT-1 and SHF-1: https://github.com/example/shelf/pull/1 |
| 2026-11-05 | "Add a task" wrote SHF-2, an urgent bug, first among the tasks left: 13 dev-days |
| 2026-11-05 | INF-1's design written, and its build started: `in-progress` |
