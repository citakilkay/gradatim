# SYN-1 · Offline shelves and the catch-up

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | M5 |
| Depends on | SHF-1, INF-1 |
| Takes | — |

## Goal

The shelves work offline, and catch up with the server when the reader is back online (D4).

## Acceptance criteria

- [ ] A book added or moved offline is kept in a queue in IndexedDB.
- [ ] Back online, the queue goes to `POST /sync` in order, and the server's shelves match the device's.
- [ ] Two devices that changed the same shelf end with the last write.

## Log

| Date | Event |
|---|---|
| 2026-11-04 | Written by the new sprint step. |
