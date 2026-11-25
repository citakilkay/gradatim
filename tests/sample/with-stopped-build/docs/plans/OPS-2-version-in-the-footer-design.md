# OPS-2 · The version in the footer: design

*The design of task [OPS-2](../sprints/sprint-1/OPS-2-version-in-the-footer.md), for the MVP. Written by the design task step on 2026-11-08.*

## The idea

- The version comes from `package.json` when the app is built, so that each release shows its own, with nothing to keep in step by hand (chosen for the user).
- The footer shows "Shelf" and the version alone, on every page, through the root layout (decision 1).
- The footer holds a link to the page where a reader reports a problem (chosen for the user).

## The user's decisions

1. **The version alone.** *Over:* the version and the commit, which would crowd the footer with a hash that a reader can't use.

## Steps

### 1. The version is read when the app is built

- A small module gives the app's version, taken from `package.json` at build time.
- A unit test shows that it gives the version that `package.json` holds.

**Done when:** `npm run test:unit` passes, with the unit test seen to fail first.

*Changed in the build, 2026-11-08:* `npm test`, since the project has no `test:unit` script: its unit and component tests both run in Vitest under `npm test`.

### 2. The footer shows the version and the report link

- The root layout gains a footer, on every page, that shows "Shelf" and the version, and a link to report a problem.
- A component test renders the footer, and finds the version and the link.
- A Playwright test opens the page, and finds the version in the footer.

**Done when:** `npm test` and `npm run test:e2e` pass, each new test seen to fail first, and `npm run build` passes.

## Acceptance criteria

| # | Criterion | Step | Shown by |
|---|---|---|---|
| 1 | The footer of every page shows "Shelf" and the version from `package.json`, as a test shows. | 1, 2 | The unit, component and Playwright tests |
| 2 | The footer links to the page where a reader reports a problem. | 2 | The component test, and the page in a browser |

## The estimate

0.25 dev-days: unchanged. A setup task of the MVP, added through "add a task".

## Documents

**With this design:** the Design row in OPS-2's header, and a log row in OPS-2 and in the sprint's README.

**At the close:** the runbook's "The check", which reads the version in the footer; the commands doc, if a command changes.

## Watch for

- The version is read when the app is built, so `npm run dev` shows the version of `package.json` as it stood at the last start.
- The footer sits in the root layout, so every route has it, the prerendered placeholder page too.
- The runbook's "The check" reads this footer, on production and on a pull request's Pages preview: what it asks of the footer is in `docs/RUNBOOK.md`.

## Change log

| Date | Change |
|---|---|
| 2026-11-08 | Written by the design task step. |
| 2026-11-08 | Step 1 changed in the build: its Done when runs `npm test`. |
