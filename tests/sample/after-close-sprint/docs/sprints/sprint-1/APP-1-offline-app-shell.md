# APP-1 · Offline app shell

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | M1 |
| Depends on | OPS-1 |
| Takes | — |

## Goal

Shelf installs as a web app, and after a first visit it opens and runs with no network (M1, D3).

## Scope

**In**
- The SvelteKit layout and routes.
- The service worker that caches the app shell, and the web app manifest with its icons.
- The online status that LKP will watch.

**Out**
- The shelves view: SHF-1.

## Acceptance criteria

- [x] A reader opens Shelf with the network off, after a first visit, and it loads: a Playwright test.
- [x] The browser offers to install Shelf.

## Questions for the brainstorm

1. **SvelteKit's own service worker or a library such as Workbox?** Proposed: SvelteKit's `$service-worker` module, which knows the build's files.
2. **How does a new version reach a reader?** Proposed: the new worker waits, and Shelf offers to reload.

## Documents to check on close

- [The MVP](../../MVP.md): M1's status.
- [The architecture](../../ARCHITECTURE.md)'s Seams, for the online status.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
| 2026-11-13 | Closed: every criterion met. Status `completed`. |
