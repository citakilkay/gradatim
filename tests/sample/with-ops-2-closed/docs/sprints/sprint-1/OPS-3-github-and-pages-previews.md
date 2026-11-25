# OPS-3 · Shelf on GitHub, with Pages previews

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | the MVP |
| Depends on | OPS-2 |
| Takes | — |

## Goal

Shelf's repository is on GitHub, and Cloudflare Pages builds a preview of each pull request, so that a preview can be opened and checked.

## Scope

**In**
- The GitHub repository, with the project pushed to it, by the user under the git rule in `AGENTS.md`.
- The Cloudflare Pages project connected to the repository, so that each pull request gets a preview.
- A first pull request, with its preview opened.

**Out**
- The pull request's number in a preview's footer: the open issue `2026-11-08-OPS-2-preview-footer-number.md`, which needs a choice that may change the runbook's check.

## Acceptance criteria

- [ ] A pull request's Cloudflare Pages preview shows the footer with the version. *Moved from OPS-2 at its close.*
- [ ] The Actions job `gate` runs on a pull request.

## Questions for the brainstorm

1. **Does the GitHub repository take the owner and name that the footer's report link names, `example/shelf`?** The footer links to its issues. Proposed: yes, or the link changes to match.

## Documents to check on close

- [The runbook](../../RUNBOOK.md): "A release" and "The check".
- The project's README, if it says where the code lives.

## Log

| Date | Event |
|---|---|
| 2026-11-08 | Written by the new sprint step, through "add a task", at OPS-2's close: its criterion 3, which needs a pull request's preview. |
