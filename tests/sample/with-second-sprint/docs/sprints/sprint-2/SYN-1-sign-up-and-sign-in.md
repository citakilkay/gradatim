# SYN-1 · Sign up and sign in

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | P1.2 |
| Depends on | APP-2 |
| Takes | — |

## Goal

A reader makes an account and signs in, and the shelves on their device become theirs; they can sign in on a second device (P1.2, D3, D11).

## Scope

**In**
- The server and the sign-in, as the architecture records them once D11's choice is made.
- Sign-up, sign-in and sign-out in the app shell, and the account the device's rows belong to.

**Out**
- Syncing the shelves across devices: P1.3, in a later sprint.
- The count of books finished this year: P1.1, in a later sprint.

## Acceptance criteria

- [ ] A reader signs up, signs out, and signs in on a second device: a Playwright test.
- [ ] The shelves already on the first device stay there and belong to the reader's account.
- [ ] With the network off, Shelf still opens and works, signed in or not.

## Questions for the brainstorm

1. **Which server, sign-in and sync transport? (D11)** The architecture leaves it open until P1.2. Proposed: settle it through `write-architecture` before the design, with a choice that runs beside Cloudflare Pages, such as Cloudflare Workers with D1 and a passwordless email sign-in.
2. **Does a reader need an account to use Shelf?** D3 brings the account; the MVP works without one. Proposed: no, signing in stays optional, and the shelves made before it join the account.

## Documents to check on close

- [Phase 1](../../PHASE-1.md): P1.2's status.
- [The architecture](../../ARCHITECTURE.md): the open choice, the deployment and the seam to the server.
- [The runbook](../../RUNBOOK.md): the server's deploy and rollback.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
