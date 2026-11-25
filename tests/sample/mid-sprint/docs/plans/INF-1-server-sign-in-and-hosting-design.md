# INF-1 · The server, sign-in and hosting: design

*The design of [INF-1](../sprints/sprint-1/INF-1-server-sign-in-and-hosting.md), written on 2026-11-05.*

## The idea

A small Node server with SQLite (D8), on one virtual machine behind Caddy (D9). It signs a reader in with a one-time link by e-mail (D5), keeps their shelves, and takes the changes made offline at `POST /sync` (D4).

## Steps

1. The server and its database: the readers, the shelves and the books, in SQLite. Done when its tests pass.
2. Sign-in: a link by e-mail that works once, for 15 minutes. Done when a reader signs in from the link.
3. `POST /sync`: takes a device's queue of changes, in order, and answers with the shelves as the server has them. Done when its tests pass.
4. Hosting: the virtual machine, Caddy, and `npm run deploy`, as the runbook says. Done when a release goes out by the runbook.
