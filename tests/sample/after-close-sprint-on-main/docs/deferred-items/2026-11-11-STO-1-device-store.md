Status: open

# The device store: one Dexie database with sync-ready rows

*Deferred at sprint 1's close, 2026-11-11. It came from STO-1.*

## What it still needs

- The Dexie database, its first schema version and the place for later migrations, with the four tables, shelves, books, covers and lookups, and their indexes, as the architecture's Data lists them (D11, D13).
- A shared helper that stamps `id`, `updatedAt` and `deleted` on every write, and reads that skip deleted rows (D13).
- Shown by: a unit test that writes and reads a row in each table with those fields set; a soft-deleted row left out of the reads and kept in the table; the database opening again after a reload, with its rows.
- Done already: nothing of the store. OPS-1's project, with Vitest and Playwright, is where it goes.

## Log

| Date | Event |
|---|---|
| 2026-11-11 | Written by sprint 1's close: `open`. |
