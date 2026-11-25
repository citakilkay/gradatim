# OPS-2 · The version in the footer

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | the MVP |
| Depends on | OPS-1 |
| Takes | — |
| Design | [the design](../../plans/OPS-2-version-in-the-footer-design.md) |

## Goal

Every page of Shelf shows the app's version in its footer, beside a link to report a problem, so that a reader, and the runbook's check, can tell which release is running.

## Scope

**In**
- The version from `package.json`, read when the app is built, in a footer on every page.
- A link in the footer to report a problem.

**Out**
- The service worker's cache name, which follows the version: APP-1.

## Acceptance criteria

- [ ] The footer of every page shows "Shelf" and the version from `package.json`, as a test shows.
- [ ] The footer links to the page where a reader reports a problem.

## Questions for the brainstorm

1. **Does the footer show the commit too?** The runbook's check reads the version in the footer. Proposed: the version alone.

## Documents to check on close

- [The runbook](../../RUNBOOK.md): its check, which reads the version in the footer.

## Log

| Date | Event |
|---|---|
| 2026-11-08 | Written by the new sprint step, through "add a task": the footer that the runbook's check reads. |
| 2026-11-08 | Designed by the design task step: [the design](../../plans/OPS-2-version-in-the-footer-design.md). The version alone, over the commit; days unchanged. |
