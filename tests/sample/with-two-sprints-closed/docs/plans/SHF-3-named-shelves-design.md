# SHF-3 · Shelves the reader names: design

*The design of task [SHF-3](../sprints/sprint-2/SHF-3-named-shelves.md), for M2. Written by the design task step on 2026-11-11.*

## The idea

- `shelves.ts` makes a new reader's three shelves, Reading, To read and Finished, on Shelf's first open, once, with Finished marked `isFinished` (D5).
- A rename changes a shelf's name alone, so Finished stays the marked shelf under any name, and its id stays the same for the books on it (D5).
- A shelf that holds books can't be deleted, and Finished can't be deleted at all; Shelf says why beside the shelf (decision 1).
- The reader reorders the shelves by moving one up or down a place (decision 2).
- A name is trimmed, and a blank name, or one that another shelf has in any case, is refused (chosen for the user).
- The home page is the shelves view: it reads the shelves through a live query that `shelves.ts` gives, and changes them through its functions (chosen for the user).
- All that `2026-11-11-SHF-1-named-shelves.md` carries is built here, since SHF-1's build had not started (D5).

## The user's decisions

1. **A shelf that holds books can't be deleted until they are moved, and Finished can't be deleted.** *Over:* moving a deleted shelf's books to To read, which moves books the reader didn't touch; and deleting them with the shelf, which loses them. Moving a book comes with M7.
2. **A shelf moves up or down one place at a time.** *Over:* dragging a shelf into place, which is harder on a phone and more to build; and no reordering, which leaves a new shelf last for good.

## Steps

### 1. The three starting shelves, and the list

- `shelves.ts` makes Reading, To read and Finished on first open, in one transaction that first checks that the table is empty, so that two pages opening at once make them once.
- It lists the shelves in their order, without the deleted ones, through the store's reads, and gives the list as a live query for a view.
- The root layout makes them on Shelf's first open, whichever page opens first.

**Done when:** unit tests show the three shelves, Finished marked, made once however often Shelf opens.

### 2. Rename, add, move and delete

- A rename trims the name, and refuses a blank one or one another shelf has; it changes the name alone.
- A new shelf goes last. A move swaps a shelf's place with its neighbour's, and does nothing past either end (decision 2).
- A delete is soft, through the store's helper, and is refused for Finished and for a shelf that holds books (decision 1).

**Done when:** unit tests show each, with Finished still the one marked shelf after a rename, and both deletes refused.

### 3. The shelves view

- The home page lists the shelves in order, each with its name as a heading, Finished's mark, and buttons to rename it, move it up or down, and delete it, with a field to add a shelf.
- A refused rename, add or delete says why, beside its shelf or under the field.

**Done when:** component tests rename a shelf, add one, and find a refusal's reason, and a Playwright test renames To read, adds a shelf, and finds both after reopening Shelf with the network off, at a desktop's and a phone's width.

## Acceptance criteria

| # | Criterion | Step | Shown by |
|---|---|---|---|
| 1 | A reader renames To read, adds a shelf, and sees both after reopening Shelf offline. | 2, 3 | The Playwright test of the shelves, at both widths |
| 2 | Finished, once renamed, is still the shelf marked `isFinished`. | 1, 2 | The unit test of Finished's rename |
| 3 | A shelf that holds books, and the Finished shelf, can't be deleted, and Shelf says why. | 2, 3 | The unit tests of the delete, and the component test of the reasons |

## The estimate

1.5 dev-days: unchanged. M2's figure.

## Documents

**With this design:** the Design row in SHF-3's header, criterion 3 added to its criteria as new, and a log row in SHF-3 and in the sprint's README. The days don't move.

**At the close:** none expected, since the architecture's Data has the shelves' fields as they are built. M2's status is close sprint's.

## Watch for

- Two pages opening Shelf at once: the check that the table is empty and the three writes share one transaction, so that the shelves are made once.
- A live query gives its first list after the page has rendered, so a test waits for the shelves to show before it acts on them.
- The Playwright test reopens Shelf offline through the service worker that APP-2 built: it waits for the worker before the network goes off.

## Change log

| Date | Change |
|---|---|
| 2026-11-11 | Written by the design task step. |
