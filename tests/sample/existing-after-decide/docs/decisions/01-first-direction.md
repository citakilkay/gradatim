# 01 · First direction

*Decide's first session, 2026-11-17, from the research in [docs/research/](../research/README.md): who Shelf is for, how books are kept, how shelves work, and what waits for later.*

### D1 · One reader, no accounts

- **Decision:** Shelf serves one reader. It has no accounts, no sign-in and no per-person data.
- **Over:** several readers with accounts, which would more than double the MVP for a need the idea doesn't state; and one reader with accounts deferred, since nothing in the idea points to a second reader.
- **Why:** the idea speaks of "a reader" and "their books", and the code holds one list with no login (01 F2, F5).
- **Date:** 2026-11-17.

### D2 · Books saved on the server, online only

- **Decision:** a reader's books and shelves are saved on the server and survive a restart. Shelf works online only, and keeps no copy in the browser and no sync.
- **Over:** offline-first storage in the browser, which loses the books when the browser's data is cleared; both with a sync, the most work, which needs conflict handling; and offline deferred, since with one reader (D1) there is nothing to sync between.
- **Why:** books are kept in memory today and lost on each restart, so shelves and the count of finished books have nothing lasting to stand on (01 F8, F4). The notes' "Local storage, then a sync?" (01 F9) is dropped for this reason. How the server stores them is for architecture.
- **Date:** 2026-11-17.

### D3 · Shelves named by the reader, and moving a book

- **Decision:** the reader names every shelf: they add, rename and delete shelves, and no shelf is fixed. A reader moves a book from one shelf to another. The reader marks one shelf as the shelf of finished books, which the count of books finished this year reads.
- **Over:** three starting shelves with a fixed Finished shelf, which leaves one shelf the reader can't name; and three fixed shelves only, which drops the idea's "shelves they name".
- **Why:** the idea has books on "shelves the reader names" and a reader who "moves a book from one shelf to another". The code puts every book on "To read" and has no route to change that (01 F3, F9). The finished shelf gives the count something to read from (01 F4).
- **Date:** 2026-11-17.

### D4 · Adding a book by ISBN, after the MVP

- **Decision:** adding a book by ISBN from a book API is decided after the MVP's release. Until then, the plan assumes a reader adds a book by its title only, and Shelf calls no outside service.
- **Over:** adding it to the MVP, which needs research on a free book API first and brings a network dependency; and dropping it, since the notes ask for it (01 F9).
- **Why:** the idea needs only a title (01 F1). No report compares book APIs, and the user chose no more research for now.
- **Date:** 2026-11-17.

### D5 · A book post is checked before it is added

- **Decision:** a post to `/books` that is not valid, or has no title or a blank one, is refused with an error, and adds no book.
- **Over:** leaving the parse unchecked, which may stop the server and adds books with no title.
- **Why:** a JSON post is parsed with no check, so bad JSON throws inside the request's handler, and a body with no title adds a book with no title (01 F10). Chosen by decide as a routine call, from that finding.
- **Date:** 2026-11-17.

### D6 · Finished this year, by the date a book reached the finished shelf

- **Decision:** when a book is moved onto the finished shelf (D3), Shelf saves that day as its finished date. A book moved off the finished shelf loses its date, and gets a new one if it comes back. The page shows how many books on the finished shelf have a finished date in the current calendar year.
- **Over:** a date the reader can change, which needs a date field for books finished before Shelf; and every book on the finished shelf with no date, which counts all years, not this one.
- **Why:** a book holds a title and a shelf only, with no date, so nothing records when a book was finished (01 F3, F4). Saving the date on the move asks nothing of the reader. Clearing it when a book leaves the shelf was chosen by decide as a routine call, so the count matches the shelf.
- **Date:** 2026-11-17.

### D7 · A new Shelf starts with three shelves

- **Decision:** a new Shelf starts with Reading, To read and Finished, in that order, with Finished marked as the finished shelf. The reader can rename and delete each one, as D3 allows. A new book goes on the first shelf in order. Two shelves can't share a name.
- **Over:** no shelves, where the reader makes a shelf before the first book; and one shelf, "To read", where the reader adds the rest.
- **Why:** the idea's own examples are Reading, To read and Finished, and a new book needs a shelf to land on (01 F3). Refusing a second shelf with the same name was chosen by decide as a routine call, so a move is never ambiguous.
- **Date:** 2026-11-17.

### D8 · A shelf with books can't be deleted

- **Decision:** Shelf refuses to delete a shelf that holds books, until the reader moves them off. That includes the finished shelf. If the reader deletes an empty finished shelf, no shelf is marked finished, and the count shows nothing until the reader marks another one.
- **Over:** moving the books to a shelf the reader picks on delete, which is more work for the same outcome; deleting the books with the shelf, which loses books by mistake; and a finished shelf that can never be deleted, which goes against D3's shelves with none fixed.
- **Why:** under D3 the reader deletes shelves, and a book can't sit on no shelf. What happens to the count after an empty finished shelf is deleted was chosen by decide as a routine call, from D3.
- **Date:** 2026-11-17.

### D9 · A book is its title, and a reader can remove one

- **Decision:** a book holds its title, its shelf and, on the finished shelf, its finished date (D6). A reader can remove a book. Authors, covers and other details wait on D4.
- **Over:** an optional author too, which the idea doesn't ask for; and no removal, which leaves a book added by mistake there forever.
- **Why:** the idea adds a book by its title, and the code stores only the title and the shelf (01 F1, F3).
- **Date:** 2026-11-17.
