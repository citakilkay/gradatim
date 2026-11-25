# A worked example: Shelf

Shelf is a made-up web app where a reader keeps track of their books: a reader adds a book by its ISBN, and Shelf fills in the rest from a public book API, on shelves the reader names, online and offline. Gradatim keeps Shelf in its repository as each step left it, one folder a step, so each step below links the files it wrote for Shelf. A folder holds only what its step wrote or changed. A file that a host or git reads, such as `AGENTS.md`, ends there in `.sample`, so that nothing loads it by accident.

## 1. Init

`init-project` took the reader's idea, in their own words, set up git, and wrote [`AGENTS.md`](../../tests/sample/after-init/AGENTS.md.sample): the idea as written, who works on the project, and the order of its documents. It ended by showing the cycle and proposing topics for research.

## 2. Research

`research-topics` looked into the two services that could fill in a book from its ISBN, each in a cited report: [Open Library's API](../../tests/sample/after-research/docs/research/01-open-library.md) and [Google Books' API](../../tests/sample/after-research/docs/research/02-google-books.md). [A comparison](../../tests/sample/after-research/docs/research/03-book-apis-compared.md) sets them side by side, and [the index](../../tests/sample/after-research/docs/research/README.md) lists all three. The reports decide nothing.

## 3. Decide

`decide-direction` asked its questions in rounds and recorded nine decisions in [one session](../../tests/sample/after-decide/docs/decisions/01-book-lookup-and-shelves.md), which [the decisions index](../../tests/sample/after-decide/docs/decisions/README.md) lists. Among them: Open Library's ISBN API, an account whose shelves sync across devices, covers kept on the device, and a free app.

## 4. Concept

`write-concept` asked first where the MVP ends, then wrote [the concept](../../tests/sample/after-concept/docs/MAIN_CONCEPT.md), [the MVP](../../tests/sample/after-concept/docs/MVP.md) with its nine stories, [phase 1](../../tests/sample/after-concept/docs/PHASE-1.md), with the count of books finished this year among its stories, [phase 2](../../tests/sample/after-concept/docs/PHASE-2.md), [the roadmap](../../tests/sample/after-concept/docs/ROADMAP.md), and [an overview page](../../tests/sample/after-concept/docs/artifacts/01-overview.html) of the whole plan.

## 5. Architecture

`write-architecture` agreed the stack and the structure with the reader in one round of questions. It recorded each choice in [the architecture's records](../../tests/sample/after-architecture/docs/decisions/architecture.md): a Svelte front end, the server left for phase 1, Cloudflare Pages, Dexie on IndexedDB, and Vitest with Playwright. Then it wrote [the architecture](../../tests/sample/after-architecture/docs/ARCHITECTURE.md) with eight modules, [the runbook](../../tests/sample/after-architecture/docs/RUNBOOK.md), and the agent docs on [the development cycle](../../tests/sample/after-architecture/docs/agents/development-cycle.md) and [the commands](../../tests/sample/after-architecture/docs/agents/commands.md).

## 6. New sprint

`new-sprint` asked how large a sprint is, then what this one takes, and planned [sprint 1](../../tests/sample/after-new-sprint/docs/sprints/sprint-1/README.md): nine tasks for the whole MVP, in the order of work. [The sprints' rules](../../tests/sample/after-new-sprint/docs/sprints/README.md) hold the size and the module codes, and each task has its file, such as [OPS-1, the project's setup](../../tests/sample/after-new-sprint/docs/sprints/sprint-1/OPS-1-project-setup.md).

## 7. Design task

`design-task` brainstormed OPS-1 with the reader, one question at a time, and wrote [its design](../../tests/sample/after-design-task/docs/plans/OPS-1-project-setup-design.md), a step-by-step guide for the build. The reader's one decision: the full gate runs in GitHub Actions, and the check, the unit tests and the build run in Pages' own build.

## 8. Build task

`build-task` built OPS-1 from its design, test first, on a branch of its own: a SvelteKit app in TypeScript, built static, with a unit test, a component test and a browser test, [a workflow](../../tests/sample/after-build-task/.github.sample/workflows/gate.yml) that runs the gate on each pull request, and a deploy command. [OPS-1's file](../../tests/sample/after-build-task/docs/sprints/sprint-1/OPS-1-project-setup.md) logs each step, and the evidence for each criterion.

## 9. Close task

`close-task` showed each criterion with its evidence and ran one code review, whose fixes the reader picked. It brought [the runbook](../../tests/sample/after-close-task/docs/RUNBOOK.md), [the architecture](../../tests/sample/after-close-task/docs/ARCHITECTURE.md) and [the commands](../../tests/sample/after-close-task/docs/agents/commands.md) in line with what the build made, and sealed [OPS-1](../../tests/sample/after-close-task/docs/sprints/sprint-1/OPS-1-project-setup.md) as `completed`.

## 10. Draft PR

`draft-pr` opened OPS-1's pull request as a draft, with [an explainer page](../../tests/sample/after-draft-pr/docs/artifacts/02-pr-project-setup.html), and linked it in [the sprint's log](../../tests/sample/after-draft-pr/docs/sprints/sprint-1/README.md). On a host that publishes, the explainer is a page on claude.ai instead, and the project keeps no file of it.

## The later steps

From here, Shelf's folders hold faults planted on purpose, for a step to find. So each line says what the step did, with its files.

- **Close sprint** closed sprint 1 early: its unfinished tasks are `deferred`, most with [an item](../../tests/sample/after-close-sprint-on-main/docs/deferred-items/2026-11-11-BOK-1-add-by-isbn.md) that carries what the task still needs, and [sprint 1's README](../../tests/sample/after-close-sprint-on-main/docs/sprints/sprint-1/README.md) says what the sprint taught: its plan was too large for a first sprint, so [the sprints' rules](../../tests/sample/after-close-sprint-on-main/docs/sprints/README.md) now give a smaller size.
- **Review** looked at Shelf after its second sprint, in three looks, and ranked nine improvements in [one report](../../tests/sample/after-review/docs/artifacts/02-review-sprint-2.html). The reader's pick, adding a book with the network off, became a story in [the MVP](../../tests/sample/after-review/docs/MVP.md).
- **Release** shipped Shelf's first release, 0.1.0, by its runbook, checked it at the production address, and recorded it in [`docs/RELEASES.md`](../../tests/sample/after-release/docs/RELEASES.md), with what it taught added to [the runbook](../../tests/sample/after-release/docs/RUNBOOK.md).
- **Demo** recorded a walkthrough of adding a book by its ISBN, in five beats that each open with a card, from [its script](../../tests/sample/after-demo/docs/demos/2026-11-14-add-by-isbn.mjs). The video stays on the machine that recorded it, out of git.
