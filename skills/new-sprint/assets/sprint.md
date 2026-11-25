# The sprint README

*The template of `docs/sprints/sprint-<n>/README.md`, which the new sprint step creates. Design task, build task and close task keep its board's Status column, and close sprint seals it. Its Parent line, its header rows, its parts and the six columns of its board are fixed, since `check-sprint` and the sync read them. The Status is `open` in the first draft, as it is once the sprint is listed in the rules.*

````markdown
# Sprint <n>

Parent: [the architecture](../../ARCHITECTURE.md)

| | |
|---|---|
| Status | `open` |
| Opened | YYYY-MM-DD |
| Goal | <One sentence: what a user can do when the sprint is done.> |
| Capacity | <days> of about <a> to <b> dev-days |

## Scope

<The agreed paragraph: the modules with their codes, the scope, and the total against the size. Then each merge or split of a story, with its reason.>

## Board

| Task | Title | Story | Depends on | Days | Status |
|---|---|---|---|---|---|
| [<CODE>-<n>](<CODE>-<n>-<slug>.md) | <Title> | <Story ids, or the milestone> | <Task ids, or —> | <days> | `to-do` |

## Log

| Date | Event |
|---|---|
| YYYY-MM-DD | Opened by the new sprint step: <the tasks, by id>, <days> dev-days |
````

- **The board** lists the tasks in the order of work. A task's Story is its story ids joined by ", ", or the milestone for a setup task. Its Days are the task's estimate, and the Capacity's first number is their sum.
- **The Scope** names only tasks that have files.
- **A later change,** such as a task added, is a row of the log: "Add a task" wrote <ID>: <n> dev-days.
