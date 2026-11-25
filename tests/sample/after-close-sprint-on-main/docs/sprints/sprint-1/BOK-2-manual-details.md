# BOK-2 · Type the title and author by hand

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `deferred` |
| Story | M5 |
| Depends on | LKP-1 |
| Takes | — |

## Goal

When Open Library has no record of a book's ISBN, the reader types its title and author (M5, D4).

## Scope

**In**
- An offer to type the details on a book marked `not-found`.
- Saving them with `lookup` set to `manual`.

**Out**
- Editing details Open Library found: not in the MVP.

## Acceptance criteria

- [ ] A book whose ISBN Open Library doesn't know shows the title and author the reader typed.

## Questions for the brainstorm

1. **May a reader type details before the lookup ends?** Proposed: no, only on `not-found`, so a later lookup never overwrites them.

## Documents to check on close

- [The MVP](../../MVP.md): M5's status.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
| 2026-11-11 | Deferred by the close sprint step: `2026-11-11-BOK-2-manual-details.md` carries what it still needs. |
