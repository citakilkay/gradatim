# OPS-2 · The version in the footer

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `completed-as-partial` |
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

- [x] The footer of every page shows "Shelf" and the version from `package.json`, as a test shows. **Shown 2026-11-08:** checked again after the review's fixes: the unit, component and Playwright tests find "Shelf version" and the version of `package.json` in the root layout's footer, `npm test` 5 passed and `npm run test:e2e` 2 passed, and `build/index.html` holds "Shelf version 0.0.1".
- [x] The footer links to the page where a reader reports a problem. **Shown 2026-11-08:** checked again after the review's fixes: the component and Playwright tests find the "Report a problem" link to https://github.com/example/shelf/issues in the footer, both passing.
- [ ] *New, by the design of 2026-11-08:* a pull request's Cloudflare Pages preview shows the footer with the version. **Moved to OPS-3** at the user's word: Shelf isn't on GitHub yet, so no pull request has a preview.

## Questions for the brainstorm

1. **Does the footer show the commit too?** The runbook's check reads the version in the footer. Proposed: the version alone.

## Documents to check on close

- [The runbook](../../RUNBOOK.md): its check, which reads the version in the footer.

## Log

| Date | Event |
|---|---|
| 2026-11-08 | Written by the new sprint step, through "add a task": the footer that the runbook's check reads. |
| 2026-11-08 | Designed by the design task step: [the design](../../plans/OPS-2-version-in-the-footer-design.md). The version alone, over the commit; one criterion added; days unchanged. |
| 2026-11-08 | Build started by the build task step, with no branch, under the user's git rule. |
| 2026-11-08 | The user: the footer's report link opens https://github.com/example/shelf/issues. |
| 2026-11-08 | Step 1: `appVersion()` in `src/lib/version.ts` gives the version of `package.json`, read when the app is built, shown by `npm test` (3 passed), its unit test seen to fail first. |
| 2026-11-08 | Step 2: the footer in `src/lib/AppFooter.svelte`, rendered in the root layout, shows "Shelf" and the version and links to the report page, shown by `npm test` (5 passed), `npm run test:e2e` (2 passed) and `npm run build`, its component and Playwright tests seen to fail first. |
| 2026-11-08 | Not in the design: OPS-1's Playwright test `e2e/home.test.ts` found "Shelf" twice once the footer came, so it now finds the heading by its role, as its title says it should. |
| 2026-11-08 | The runbook's check asks for the pull request's number in a preview's footer, which the design's decision 1 doesn't give: `2026-11-08-OPS-2-preview-footer-number.md`. |
| 2026-11-08 | The user, at the agreement: the footer reads "Shelf version" and then the version. Changed in `src/lib/AppFooter.svelte`, its component and Playwright tests first, shown by `npm test` (5 passed), `npm run test:e2e` (2 passed) and `npm run build`. |
| 2026-11-08 | What shows each criterion, for the close: 1. the unit test `src/lib/version.test.ts`, the component test `src/lib/app-footer.test.ts` and the Playwright test `e2e/footer.test.ts` find "Shelf version" and the version of `package.json` in the root layout's footer, with `npm test` 5 passed and `npm run test:e2e` 2 passed, and `build/index.html` holds "Shelf version 0.0.1" · 2. the component and Playwright tests find the "Report a problem" link to https://github.com/example/shelf/issues in the footer · 3. open: no pull request has a Pages preview yet |
| 2026-11-08 | Built by the build task step, with no branch, under the user's git rule. The close is next. |
| 2026-11-08 | Closed by the close task step: `completed-as-partial`, criterion 3 moved to OPS-3 at the user's word. Review: M1 and L1 applied; L2 left, not picked by the user. Documents: the README's Releases, on the footer's version and report link; the runbook's check and the issue `2026-11-08-OPS-2-preview-footer-number.md`, by the sync; left for decide or architecture: a preview's pull request number, in that issue. |
