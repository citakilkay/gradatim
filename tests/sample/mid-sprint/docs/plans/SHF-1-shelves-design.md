# SHF-1 · Shelves and moving books: design

*The design of [SHF-1](../sprints/sprint-1/SHF-1-shelves.md), written on 2026-11-05.*

## The idea

The shelves and the books on them live in IndexedDB first, so that they work offline (D4). The SYN module sends the changes to the server later.

## Steps

1. The shelves' store: add, rename and remove a shelf, in IndexedDB. Done when its tests pass.
2. Moving a book: pick a shelf, and the move is kept at once. Done when the reader sees it.
3. Offline: the store works with the network off, and keeps each change for the catch-up. Done when the test with the network off passes.
