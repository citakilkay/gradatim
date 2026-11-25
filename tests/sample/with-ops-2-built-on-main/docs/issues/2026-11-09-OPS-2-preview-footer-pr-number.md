Status: open

# The runbook's check asks a Pages preview's footer for the pull request's number, which no footer shows

*Found in OPS-2's build, 2026-11-09.*

## What happened

The runbook's "The check" says: "Open a pull request's Pages preview: its footer shows the pull request's number, so that a preview is never taken for production." OPS-2's footer shows "Shelf" and the version from `package.json` alone, as its design's decision 1 chose, so a preview's footer reads the same as production's. `build/index.html`, after `npm run build`, holds `<footer><span>Shelf 0.0.1</span> · <a …>Report a problem</a></footer>`, with no number.

## What it needs

A choice, not a quick fix: whether a preview shows its pull request's number, and how the build learns it, since Cloudflare Pages' Git build exposes the branch and the commit (`CF_PAGES_BRANCH`, `CF_PAGES_COMMIT_SHA`) rather than a pull request's number. The other way is to bring the runbook's line in line with a footer that shows the version alone. Under D15 tasks are built on `main` with no pull request, so the line may matter only for a task on a branch of its own. OPS-2 built the footer with the version alone, as its design says, and left the runbook as it is, since the runbook is the close's.

## Log

| Date | Event |
|---|---|
| 2026-11-09 | Written by OPS-2's build: `open`. |
