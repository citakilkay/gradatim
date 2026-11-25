Status: addressed by CAT-3

# Lookups by ISBN hit Open Library's limit

*Found in CAT-1's build, 2026-11-04.*

## What happened

A batch of twenty lookups, as a reader importing a pile of books would make, got HTTP 403 after the first few. Open Library limits lookups by ISBN to 100 per IP every 5 minutes, and asks for one to three requests a second (research 01, findings F6 and F14).

## What it needs

A queue that spaces the lookups, and a way to tell the reader that a lookup is waiting. That is more than a quick fix, so CAT-1 went on without it.

## Log

| Date | Event |
|---|---|
| 2026-11-04 | Written by CAT-1's build: `open`. |
| 2026-11-05 | Taken by CAT-3: `addressed by CAT-3`. |
