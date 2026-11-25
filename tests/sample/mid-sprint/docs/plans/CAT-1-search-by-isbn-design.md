# CAT-1 · Search by ISBN: design

*The design of [CAT-1](../sprints/sprint-1/CAT-1-search-by-isbn.md), written on 2026-11-04.*

## The idea

One call to Open Library's Books API with `jscmd=data` gives the title, the authors and the covers (D2). The result is kept in IndexedDB, so that a book added once shows offline (D4).

## Steps

1. `lookup(isbn)`: checks the ISBN, calls the Books API, and returns the title, the authors and the cover IDs. Done when its tests pass on three ISBNs.
2. The add-a-book page: an ISBN field, and the book shown once it comes back. Done when the reader sees it.
3. The offline copy: each book looked up goes into IndexedDB. Done when it reads back with the network off.

Changed in the build, 2026-11-04: a batch of lookups hit Open Library's limit. The queue it needs went to `2026-11-04-CAT-1-rate-limits.md`.
