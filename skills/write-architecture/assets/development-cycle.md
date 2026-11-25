# The development cycle

*The template of `docs/agents/development-cycle.md`, which the architecture step creates in every project. It carries the method's rules to a session that runs no Gradatim skill, and holds the project's own branch, merge and pull request rules. The first three parts are fixed; the fourth takes the project's answers. `AGENTS.md` points to it, and the sync changes it when a decision or a task makes a line stale. The file keeps no log.*

````markdown
# The development cycle

How work runs in <Project>, for every agent. The cycle is Gradatim's. This file holds the rules any agent keeps, with no Gradatim skill running, and then this project's own.

## The documents

They flow top-down: the concept, the MVP and the phases, the architecture, the sprints, the tasks. A change is recorded first, then made in the highest document it touches and in each one below it. A change of direction goes through decide, and one of the stack or the modules through architecture. The Gradatim step under way takes any other change; with none under way, a decision's detail changes by a dated note under it, `> **Changed, YYYY-MM-DD.** …`, and a choice made anew goes through decide. A lower document never disagrees with a higher one.

## Ids and statuses

- A decision is `D<n>`, a story `M<n>` or `P<k>.<n>`, and a task its module's code and a number, such as `<CODE>-<n>`. No id is reused.
- A task is `to-do`, `in-progress`, `completed`, `completed-as-partial` or `deferred`. Its status is changed in its header and on its sprint's board together.
- A task that is `completed`, `completed-as-partial` or `deferred` is sealed, and so is a closed sprint's README: nothing in them is rewritten or added, not even a log row. A later choice that conflicts with a sealed document is recorded above it.

## The work

- One task at a time, in the order of the open sprint's board, once its dependencies are `completed`.
- A task is designed in its design file, built, and closed: each criterion checked, the documents it made stale updated, and the task sealed.
- Work nobody planned goes to one place: a new task through the sprint's "add a task", a file in `docs/issues/` for a problem that needs thought, a change of direction through decide, or one of the stack or the modules through architecture.

## This project

- **Branch:** <on `main` where one developer works on the project, with a branch of its own only for a task that calls for one; else a branch for each task, such as one named after the task, and what it branches from>.
- **Before a merge:** <the gate: the commands that pass, such as `npm test`>.
- **Pull requests:** <for each task where a team works on the project, or for a task on a branch of its own; then draft first or not, who reviews, and the merge method>.
````

- **The fourth part** comes from the project: the user's own rules if `AGENTS.md` or the code states them, else the step's proposal, listed in the agreement for the user to overturn. The proposal follows who works on the project, as `AGENTS.md` says.
- **A concrete task id** stays out of the text, since the sync's check reads a task id as naming a task file. `<CODE>-<n>` is the form.
