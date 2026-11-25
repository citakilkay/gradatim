Status: open

# A pull request's Pages preview shows no pull request number in its footer

*Found in OPS-2's build, 2026-11-08.*

## What happened

The runbook's "The check" asks that a pull request's Pages preview show the pull request's number in its footer, so that a preview is never taken for production. OPS-2 built the footer with "Shelf version" and the version alone, as its design's decision 1 chose and the user's word at the agreement worded: `npm run build` writes "Shelf version 0.0.1" and "Report a problem" into `build/index.html`, and nothing in the build knows a pull request's number.

## What it needs

The footer can only show a number the build is given. Cloudflare Pages gives a preview build its branch and commit, not a pull request's number, so the choice is between a number passed in from GitHub Actions, the branch name in its place, or a change to the runbook's check. It reaches past OPS-2's design and needs a choice from the user. OPS-2 built the footer without it, and none of OPS-2's criteria depend on it.

OPS-3 holds the check that a pull request's Pages preview shows the footer with the version, moved from OPS-2 at its close. It leaves the pull request's number out, so this issue stays open.

## Log

| Date | Event |
|---|---|
| 2026-11-08 | Written by OPS-2's build: `open`. |
| 2026-11-08 | The footer's text quoted as "Shelf version 0.0.1"; OPS-3 holds the preview's version, not its number (OPS-2) |
