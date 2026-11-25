# The architecture's records

*The stack and the structure, as the architecture step agreed them with the user. Each run adds a dated section.*

## 2026-11-17

### D10 · JavaScript on Node.js's own http module, with no framework

- **Decision:** Shelf is JavaScript as ES modules in `src/`, served by Node.js's built-in `node:http`, with no web framework and no dependency. It runs on Node 22 LTS or later.
- **Over:** a web framework such as Express or Fastify, which adds a dependency for routing that eight small stories don't need; and another language, which would rewrite working code.
- **Why:** the code is one ES module on `node:http` with no dependency (01 F5), `AGENTS.md` says to add no dependency without asking, and the user said to keep Node's own http module with no framework: found in the code, and confirmed by the user's answer. Node 22 LTS or later was chosen for the user.
- **Date:** 2026-11-17.

### D11 · Books and shelves in one JSON file on disk

- **Decision:** the server keeps the reader's shelves and books in one JSON file, read at start and written in full after each change, atomically: to a temporary file beside it, then renamed over it. The file's folder comes from the environment variable `SHELF_DATA_DIR`, and is `data/` in the project when it is unset.
- **Over:** SQLite through Node's built-in `node:sqlite`, which is still marked experimental and needs a recent Node; and SQLite through a dependency such as `better-sqlite3`, which brings a native build against the rule on dependencies.
- **Why:** D2 saves books and shelves on the server and leaves how to architecture; one reader (D1) means a small file and never two writers, and a rename keeps the file whole if the server stops mid-write (M1): the user's answer.
- **Date:** 2026-11-17.

### D12 · One machine the reader runs, under a service manager

- **Decision:** Shelf runs on one machine the reader runs, a home server or a small VPS, as `npm start` under a service manager such as systemd, which restarts it when it stops. Its data folder lies outside the repository's checkout. A release is a tagged commit checked out there, then a restart; the port comes from `PORT`, 3000 when unset.
- **Over:** a platform host with a persistent disk, which adds an account, its config and a volume for the data file; and deferring hosting to the MVP's release, which leaves the runbook without a release to follow.
- **Why:** one reader (D1), online only (D2), and a data file that must outlive each release (D11, M1): the user's answer. The `PORT` variable was chosen for the user.
- **Date:** 2026-11-17.

### D13 · Pages rendered on the server, with a form for each action

- **Decision:** the server renders the one page as HTML. Each action, adding, moving or removing a book and adding, renaming, deleting or marking a shelf, is a plain form that posts and is redirected back to the page, or shown the page again with a message when it is refused. The browser runs no script. `GET /books` stays as JSON, and `POST /books` still takes JSON.
- **Over:** a JSON API with a small script in the browser, which gives two sides to keep in step; and a front-end framework, which brings dependencies and a build for eight small stories.
- **Why:** the page is already rendered on the server with a form that posts and redirects (01 F1, F2), and every rule of D3, D5, D7 and D8 then lives on the server only: the user's answer.
- **Date:** 2026-11-17.

### D14 · Modules by concern, with the rules apart from HTTP

- **Decision:** the code is split into a server module that starts and configures Shelf, a store that reads and writes the data file, a shelves module and a books module that hold the rules as plain functions over the data, and a web module that holds the routes and the page. Only the web module knows HTTP, and only the store touches the disk.
- **Over:** keeping one file, which mixes the rules of D3 to D9 with parsing and HTML and makes them hard to test alone; and a module per story, which splits rules that share the same data.
- **Why:** the MVP adds rules on shelves (D3, D7, D8) and books (D5, D6, D9) that tests should reach without a server: chosen for the user.
- **Date:** 2026-11-17.

### D15 · Tests with Node's own runner, gated on `main`

- **Decision:** tests use `node --test` and `node:assert`, with no test dependency: unit tests on the shelves and books modules, store tests on a temporary folder, and HTTP tests against a server started on a free port. `npm test` passes before each commit on `main`.
- **Over:** a test framework such as Vitest or Jest, which adds a dependency; and only HTTP tests, which reach the rules slowly and through HTML.
- **Why:** `npm test` already runs `node --test` (01 F7), and one developer works on `main` (`AGENTS.md`): found in the code, with the levels and the gate chosen for the user.
- **Date:** 2026-11-17.

### D16 · The book API for adding by ISBN waits for phase 1

- **Decision:** the book API for adding a book by ISBN, and how the server calls it, is decided by phase 1. Until then, the architecture assumes Shelf calls no outside service, and a book is its title (D4, D9).
- **Over:** choosing an API now, with no report that compares them (D4).
- **Why:** D4 decides ISBN after the MVP's release, and P1.1 needs research on a book API first: chosen for the user, from D4.
- **Date:** 2026-11-17.
