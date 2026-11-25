# BOK-1 · Add a book by its ISBN

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | M3 |
| Depends on | SHF-1 |
| Takes | — |

## Goal

A reader types an ISBN and picks a shelf, and the book is saved at once, online or offline, with a lookup queued (M3, D4, D5).

## Scope

**In**
- `books.ts`: add a book and its lookup entry in one transaction, and remove a book.
- The add-book view, with ISBN checking for ISBN-10 and ISBN-13.
- A shelf's books shown by ISBN until details arrive.

**Out**
- Draining the lookup queue: LKP-1.
- Moving a book: SHF-2.

## Acceptance criteria

- [ ] A book added with the network off shows on its shelf by its ISBN.
- [ ] The book and its queue entry are written together, or neither is.

## Questions for the brainstorm

1. **Is an ISBN-10 stored as typed or converted to ISBN-13?** Open Library takes both. Proposed: stored as ISBN-13, with hyphens and spaces taken out.
2. **What if the same ISBN is added twice?** Proposed: Shelf says it's already on a shelf, and doesn't add it again.

## Documents to check on close

- [The MVP](../../MVP.md): M3's status.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
