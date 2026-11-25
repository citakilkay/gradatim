# 01 · What does the code already do?

*Read 2026-11-18 at commit `1d1d773`, for what the plan and the decisions start from. It decides nothing. Read: 20 files, every file git lists: `src/shelf.js`, `package.json`, `.gitignore`, `README.md`, `AGENTS.md` (with its uncommitted change), `.claude/` (settings, hook, skill) and `docs/` (notes, issues, specs, decisions, agents, sprints). Not read: nothing; no secret file is in the repository, and no `node_modules/` or built files are there.*

## Summary

A reader opens one page, adds a book by its title, and sees every book with its shelf, which is always "To read" (F1); a script reads the same list as JSON at `GET /books` (F2). It is one ES module on Node's own `http` module, with no dependency and no framework (F3, F4). There are no test files, though `npm test` runs `node --test` (F5). Half built: SHF-3, shelves the reader names, is in progress with a design and a to-do in the code (F6); STO-1, keeping the books in a file, is to do while the books live in memory (F7); BOK-4, the year's count of finished books, is to do and rests on a "Finished" shelf that does not exist yet (F8); the open issue on port 3000 (F9).

## Findings

### What it does

- **F1.** A reader opens the page at port 3000, types a title in a form and presses Add; the page reloads and lists every book as its title and its shelf, and every new book lands on "To read". There is no edit, delete, author or other field. [1] Confidence: high.
  > "<input name="title" placeholder="Title" required>" [1]
  > "books.push({ title, shelf: 'To read' });" [1]
- **F2.** A script or another app reads every book with its shelf as JSON at `GET /books`, and can add one by posting JSON with a `title` (answered with 201). This is BOK-3, marked done. [1][2] Confidence: high.
  > "response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(books));" [1]
  > "Status: done, 2026-11-11" [2]

### Stack and structure

- **F3.** JavaScript on Node, as ES modules, with no dependency: `package.json` lists no `dependencies`, and the app is one file, `src/shelf.js` (about 40 lines): an in-memory array, an HTML-escaping helper, a template for the one page, and one `createServer` handler that routes `POST /books`, `GET /books` and every other URL to the page. [3][1] Confidence: high.
  > ""type": "module"," [3]
  > "import { createServer } from 'node:http';" [1]
- **F4.** The stack is a recorded decision, D1, and the shelves' direction is D2; AGENTS.md keeps the code in `src/` as ES modules and allows no dependency without asking. [4][5] Confidence: high.
  > "**D1 · Node's own http module, with no framework** (2026-10-30)." [4]
  > "Add no dependency without asking." [5]

### Commands and tests

- **F5.** `npm start` runs `node src/shelf.js`, which listens on port 3000 (fixed in the code); `npm test` runs `node --test`, and git lists no test file, so there are no tests yet. The README also asks for `npm install`, which has nothing to install. [3][6][1] Confidence: high.
  > ""test": "node --test"" [3]
  > "}).listen(3000);" [1]

### Half built

- **F6.** SHF-3, shelves the reader names (`docs/sprints/sprint-2/SHF-3-shelves.md`, status in progress): its design in `docs/specs/2026-11-12-SHF-3-shelves.md` adds a field for a new shelf, a select beside each book, case-insensitive unique names and "To read" first, in memory until STO-1; one point stays open, deleting a shelf that holds books. In the code, nothing of it is built: it lands on the `books.push` line, with its to-do, and on the page template and the `POST` route in `src/shelf.js`. [7][8][1] Confidence: high.
  > "Status: in progress" [7]
  > "Open: whether a shelf that holds books can be deleted, and what happens to its books then." [8]
  > "// Every book starts on "To read". TODO: shelves the reader names, and moving a book between them." [1]
- **F7.** STO-1, keep the books in a file (`docs/sprints/sprint-2/STO-1-books-in-a-file.md`, status to do): the books, with their shelves, in one JSON file beside the app, so a restart keeps them. Today they are the `books` array at the top of `src/shelf.js`, and the README says nothing is saved. It lands on that array and on each place that writes it. [9][1][6] Confidence: high.
  > "Status: to do" [9]
  > "const books = [];" [1]
  > "Early days: books can be added by title and listed. Nothing is saved yet." [6]
- **F8.** BOK-4, the count of books finished this year (`docs/sprints/sprint-2/BOK-4-books-this-year.md`, status to do): "Finished this year: n" at the top of the page, counting a book on the date it moved to Finished. The code holds no shelf named Finished, no move and no date on a book, so it lands on the page template and on the move that SHF-3 adds. [10][1] Confidence: high.
  > "A book counts once it moves to Finished, on the date it moved." [10]
- **F9.** The open issue `docs/issues/2026-11-12-port-in-use.md`: `npm start` fails when port 3000 is taken, and the port could come from `PORT`; not planned. It lands on the `listen(3000)` line of `src/shelf.js`. [11][1] Confidence: high.
  > "`npm start` fails when port 3000 is taken. The port could come from `PORT`. Found on 2026-11-12; not planned yet." [11]

## Risks, watch-outs and trade-offs

- **Watch out:** the project keeps its own files at paths Gradatim's steps write: `docs/sprints/` (README, sprint-1, sprint-2 and its four task files), `docs/decisions/README.md` (D1, D2), `docs/agents/development-cycle.md`, `docs/issues/` and `docs/specs/`; AGENTS.md says Gradatim's documents go in `docs/gradatim/` and the project's stay as they are (F4, F6) [5].
- **Watch out:** `.claude/hooks/guard.mjs`, run before every Bash, PowerShell, Write and Edit call, refuses writes under `docs/sprints/` and `docs/decisions/` and refuses any `git … commit` command [12][13].
- **Watch out:** AGENTS.md makes git read-only by default and asks the owner before each branch, checkout, commit, push or merge; the project's cycle builds on a branch per task and the owner merges into `master` [5][14].
- **Watch out:** the project has its own skill, `.claude/skills/design-a-task`, which writes designs in `docs/specs/`, and its own cycle, plan → build → review (F6) [15][14].
- **Watch out:** a `POST /books` that is neither a form nor valid JSON reaches `JSON.parse` with no guard, and no test covers any route (F2, F5) [1].
- **Watch out:** `AGENTS.md` has an uncommitted change in the working tree, the Gradatim section, which commit `1d1d773` does not hold [5].
- **Watch out:** `docs/notes.md` holds three unplanned ideas: adding a book by ISBN from a free book API, shelves that work offline with a sync, and the year's count (the last is BOK-4) (F8) [16].

## Gaps

- Whether the tests pass: the read runs no command, and there are no test files for `node --test` to find.
- Whether the app starts and behaves as read: no server was run.
- How the owner wants SHF-3's open point settled, and whether "Finished" for BOK-4 is a shelf the reader names or a fixed one: the documents don't say.

## Sources

1. `src/shelf.js`, the whole app: the page, the routes and the books in memory. Read in full.
2. `docs/sprints/sprint-2/BOK-3-books-as-json.md`, task BOK-3. Read in full.
3. `package.json`, the manifest and its scripts. Read in full.
4. `docs/decisions/README.md`, decisions D1 and D2. Read in full.
5. `AGENTS.md`, the agents' notes, rules and Gradatim's section. Read in full.
6. `README.md`, how to run it and its status. Read in full.
7. `docs/sprints/sprint-2/SHF-3-shelves.md`, task SHF-3. Read in full.
8. `docs/specs/2026-11-12-SHF-3-shelves.md`, SHF-3's design. Read in full.
9. `docs/sprints/sprint-2/STO-1-books-in-a-file.md`, task STO-1. Read in full.
10. `docs/sprints/sprint-2/BOK-4-books-this-year.md`, task BOK-4. Read in full.
11. `docs/issues/2026-11-12-port-in-use.md`, the open issue on the port. Read in full.
12. `.claude/hooks/guard.mjs`, the project's guard hook. Read in full.
13. `.claude/settings.json`, the hooks' wiring. Read in full.
14. `docs/agents/development-cycle.md`, the project's cycle. Read in full.
15. `.claude/skills/design-a-task/SKILL.md`, the project's own skill. Read in full.
16. `docs/notes.md`, the owner's notes. Read in full.

## Notes
