# 01 · What does the code already do?

*Read 2026-11-17 at commit `22fe134`, for what the plan and the decisions start from. It decides nothing. Read: 6 files, `src/shelf.js`, `package.json`, `README.md`, `AGENTS.md`, `.gitignore` at the root and `docs/notes.md`. Not read: nothing.*

## Summary

A reader can open one page, add a book by its title and see every book listed with its shelf (F1, F2). Every book lands on "To read"; shelves the reader names, moving a book and the count of books finished this year are absent (F3, F4). It is one Node.js file on `node:http`, with no dependency (F5). `npm test` runs `node --test`, and there are no test files (F7). Nothing is saved: the books live in memory (F8), and the notes hold open questions (F9).

## Findings

### What it does

- **F1.** A reader opens the app at port 3000 and adds a book by typing its title in a form and pressing Add. [1] Confidence: high.
  > "<form method="post" action="/books">" [1]
- **F2.** A reader sees all their books on the one page, each with its shelf; the same list comes back as JSON from `/books`. [1] Confidence: high.
  > "${books.map((book) => `  <li>${escape(book.title)} · ${escape(book.shelf)}</li>`).join('\n')}" [1]
- **F3.** A reader cannot name a shelf or move a book: each book is put on "To read", and no route changes it. [1] Confidence: high.
  > "books.push({ title, shelf: 'To read' });" [1]
- **F4.** A reader cannot see how many books they finished this year: no code counts them, and the idea's feature appears only as a note. [3] Confidence: medium, one source.
  > "- A count of the books finished this year would be nice." [3]

### Stack and structure

- **F5.** JavaScript as ES modules on Node.js, with the built-in `node:http` server and no dependency in the manifest; all the code is one file, `src/shelf.js`, that holds the list, the page and the routes. [2] Confidence: high.
  > "import { createServer } from 'node:http';" [1]
  > ""type": "module"," [2]

### Commands and tests

- **F6.** `npm start` runs the server, which listens on port 3000; the README also names `npm install`, with nothing to install. [2] Confidence: high.
  > ""start": "node src/shelf.js"," [2]
  > "Then open http://localhost:3000." [4]
- **F7.** `npm test` runs Node's test runner, and the repository holds no test file. [2] Confidence: high.
  > ""test": "node --test"" [2]

### Half built

- **F8.** Nothing is saved: the books sit in an array in memory and are lost when the server stops. [1] Confidence: high.
  > "const books = [];" [1]
  > "Early days: books can be added by title and listed. Nothing is saved yet." [4]
- **F9.** Shelves the reader names and moving a book are a note to do in the code; the notes add adding by ISBN from a book API and working without a network as open questions. [1] Confidence: high.
  > "// Every book starts on "To read". TODO: shelves the reader names, and moving a book between them." [1]
  > "- Adding a book by its ISBN would save typing. Which free book API gives the title, the author and the cover?" [3]
  > "- The shelves should work without a network. Local storage, then a sync?" [3]
- **F10.** A JSON post to `/books` is parsed with no check, so a body that is not JSON throws inside the request's end handler, and a JSON body with no title adds a book with no title. Confidence: inference, from F1 and the line below.
  > "const title = form ? new URLSearchParams(body).get('title') : JSON.parse(body).title;" [1]

## Risks, watch-outs and trade-offs

- **Watch out:** no file sits in `docs/sprints/`, `docs/issues/`, `docs/deferred-items/` or `docs/plans/`; `docs/notes.md` holds the reader's own open questions, not Gradatim's (F9).
- **Watch out:** books kept in memory vanish on each restart, so any shelf or count of finished books has nothing lasting to stand on yet (F8, F4).
- **Watch out:** a book has a title and a shelf only, with no date, so no record exists today of when a book was finished this year (F3, F4).
- **Watch out:** a bad JSON body may stop the server, since the parse is unguarded (F10).
- **Watch out:** no text in the code or the notes speaks to an agent (F5, F9).

## Gaps

- Whether the tests pass: the read runs no command, and there are no test files to run (F7).
- Whether a bad JSON body stops the server: read from the code, not run (F10).

## Sources

1. `src/shelf.js`, the whole app: the book list, the page and the routes. Read in full.
2. `package.json`, the manifest and its scripts. Read in full.
3. `docs/notes.md`, the project's notes and open questions. Read in full.
4. `README.md`, how to run it and its status. Read in full.

## Notes
