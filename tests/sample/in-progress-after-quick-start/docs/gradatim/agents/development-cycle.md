# The development cycle

How work runs in Shelf, for every agent. The cycle is Gradatim's. This file holds the rules any agent keeps, with no Gradatim skill running, and then this project's own.

## The documents

They flow top-down: the concept, the MVP and the phases, the architecture, the sprints, the tasks. A choice is changed in the highest document it touches. A choice about what the project does changes through decide, and one about the stack or the structure through architecture. A lower document never disagrees with a higher one.

## Ids and statuses

- A decision is `D<n>`, a story `M<n>` or `P<k>.<n>`, and a task its module's code and a number, such as `<CODE>-<n>`. No id is reused.
- A task is `to-do`, `in-progress`, `completed`, `completed-as-partial` or `deferred`. Its status is changed in its header and on its sprint's board together.
- A task that is `completed`, `completed-as-partial` or `deferred` is sealed, and so is a closed sprint's README: nothing in them is rewritten or added, not even a log row. A later choice that conflicts with a sealed document is recorded above it.

## The work

- One task at a time, in the order of the open sprint's board, once its dependencies are `completed`.
- A task is designed in its design file, built, and closed: each criterion checked, the documents it made stale updated, and the task sealed.
- Work nobody planned goes to one place: a new task through the sprint's "add a task", a file in `docs/issues/` for a problem that needs thought, a decision through decide, or a change of the stack through architecture.

## This project

- **Branch:** on `master`, as one developer works on the project, with a branch of its own only for a task that calls for one. Each branch, checkout, commit, push or merge waits for the owner's yes, as `AGENTS.md` says, and only the owner commits, as the project's hook holds.
- **Before a merge:** `npm test` passes.
- **Pull requests:** only for a task on a branch of its own; the owner reviews it and merges it into `master`.
