# OPS-2 · The version in the footer

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `in-progress` |
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
| 2026-11-09 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-09 | The report link opens `https://github.com/example/shelf/issues`: the user's answer, kept in `src/lib/report-problem.ts`. |
| 2026-11-09 | Step 1: `src/lib/app-version.ts` gives the version from `package.json`, which Vite inlines at build time, shown by `npm test` (`app-version.test.ts` failed first on the missing module, then passed) and `npm run check` (0 errors). The design's `npm run test:unit` doesn't exist: `npm test` runs instead, marked in the design. The test reads `package.json?raw` rather than `node:fs`, since svelte-check has no Node types and `@types/node` is no package the design names. |
| 2026-11-09 | Step 2: `src/lib/AppFooter.svelte` in the root layout shows "Shelf 0.0.1" and the "Report a problem" link, shown by `npm test` (5 passed, `AppFooter.test.ts` failed first on the missing component), `npm run test:e2e` (2 passed, `footer.test.ts` failed first on no footer) and `npm run build`. OPS-1's `e2e/home.test.ts` matched "Shelf" twice once the footer came, so it now finds the heading by its role, as its name says. |
| 2026-11-09 | The runbook's check asks a preview's footer for the pull request's number, which the design's version-alone footer doesn't show: `2026-11-09-OPS-2-preview-footer-pr-number.md`. |
| 2026-11-09 | What shows each criterion, for the close: 1. `app-version.test.ts` matches `package.json`'s version; `AppFooter.test.ts` and `e2e/footer.test.ts` find "Shelf 0.0.1" in the footer, on the production build; `build/index.html` holds it · 2. `AppFooter.test.ts` and `e2e/footer.test.ts`, in Chromium, find the "Report a problem" link to `https://github.com/example/shelf/issues` |
| 2026-11-09 | Built by the build task step, on `main`, with no branch of its own. The close is next. |
