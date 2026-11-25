# Shelf · The runbook

*How a release goes out, written by the architecture step on 2026-11-18, from [the architecture](ARCHITECTURE.md). A command marked planned in [the commands](agents/commands.md) doesn't exist yet.*

## Before a release

`npm test` passes, and `version` in `package.json` is bumped. Port 3000 must be free.

## A release

Shelf has no host yet (D6): a release is the merge into `master` at the owner's yes, then `npm install` and `npm start` on the reader's machine.

## The check

Open http://localhost:3000: the page shows the form and the books. `GET /books` answers with the list as JSON.

## A rollback

Stop the server, check out the previous release's commit at the owner's yes, and run `npm start` again; the page shows as before.

## Change log

| Date | Change |
|---|---|
| 2026-11-18 | Written by the architecture step, through init's quick start |
