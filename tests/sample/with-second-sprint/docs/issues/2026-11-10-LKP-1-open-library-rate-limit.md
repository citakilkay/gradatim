Status: addressed by LKP-2

# Lookups by ISBN meet Open Library's rate limit

*Found in LKP-1's build, 2026-11-10.*

## What happened

A batch of lookups, as a reader adding a pile of books would make, got HTTP 429 after the first few. Open Library asks for one request a second, and the lookup queue sends them as fast as the device is online.

## What it needs

A way to space the lookups and to back off on a 429, and a way to tell the reader that a lookup is waiting. That is more than a quick fix, so LKP-1 went on without it.

## Log

| Date | Event |
|---|---|
| 2026-11-10 | Written by LKP-1's build: `open`. |
| 2026-11-07 | Taken by sprint 2: `addressed by LKP-2`. |
