# INF-1 · The server, sign-in and hosting

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `in-progress` |
| Story | M4 |
| Depends on | — |
| Takes | — |
| Design | [the design](../../plans/INF-1-server-sign-in-and-hosting-design.md) |

## Goal

Shelf's server runs on its virtual machine, signs a reader in with an e-mail link, and keeps their shelves (D5, D8, D9).

## Acceptance criteria

- [ ] A reader signs in with a link sent by e-mail, and the link works once, for 15 minutes.
- [ ] The server keeps a reader's shelves in SQLite, and gives them back on another device.
- [ ] `POST /sync` takes the changes made offline, in order (D4).
- [ ] A release goes out by [the runbook](../../RUNBOOK.md).

## Log

| Date | Event |
|---|---|
| 2026-11-04 | Written by the new sprint step. |
| 2026-11-05 | Design written. Build started: `in-progress`. |
