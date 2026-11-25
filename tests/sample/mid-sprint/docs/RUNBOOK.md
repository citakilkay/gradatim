# Shelf · The runbook

*How a release goes out, written by the architecture step on 2026-11-04.*

## Before a release

1. `npm test` passes, and so does `npm run build`.
2. Bump the service worker's cache version in `src/sw.ts`, so that readers' offline copies refresh.

## A release

1. `npm run deploy -- <version>` copies the build and the server to the virtual machine, and restarts the server.
2. Check the release's SHA-256 against the one the build printed.
3. Open the site, add a book by its ISBN, and move it to another shelf.

## A rollback

`npm run deploy -- <the previous version>`, then the same check.

## Change log

| Date | Change |
|---|---|
| 2026-11-04 | Written by the architecture step |
