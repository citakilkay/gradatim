# The sprint rules

*The template of `docs/sprints/README.md`, which the new sprint step creates on first use. It holds the rules every sprint follows, the module codes, the sprints and the reviews. Its parts and its two tables are fixed, since `check-sprint` and the sync read them. The document is living, so each change is logged at its end.*

````markdown
# Sprints

*The rules every sprint follows, the module codes, and the sprints. Written by the new sprint step on YYYY-MM-DD.*

## The rules

- **The size:** about <a> to <b> senior dev-days, as a guide, not a limit. A sprint may stretch to <c> with its reason in its README, and a milestone's last sprint may hold less.
- **One task per story,** under the module that names it. A story of half a day or less joins the task of the story it follows in the same module, within the sprint and where that breaks no order. A story over about 3 dev-days splits. The sprint's README says why for each.
- **A task in a module that names no story** has the milestone it serves as its Story, `the MVP` or `phase <k>`. Its close marks no story delivered.
- **What waits comes first:** the fix for a release that was rolled back, then the deferred items, then the open issues, then new stories.
- **The board is in the order of work,** so no task comes before one it depends on. Urgent or split-off work joins the open sprint through "add a task".
- **At most one sprint is open.**
- **Ids, statuses and sealing** are as [the development cycle](../agents/development-cycle.md) says.

## Module codes

| Code | Module |
|---|---|
| `<ABC>` | <The module's name> |

## The sprints

| Sprint | Status | Opened |
|---|---|---|

## Reviews

None yet.

## Change log

| Date | Change |
|---|---|
| YYYY-MM-DD | Written by the new sprint step: the rules and <n> module codes |
````

- **The size** is the band the user gave, in senior dev-days, with its stretch. Words of the user's own are taken as said.
- **The codes** are the first column of the architecture's modules table, one row each, with the module's name. A code stays once it is listed: a new module adds a row, and nothing takes one out.
- **The sprints table** gets a row for a sprint only at the user's yes: ``| [sprint-<n>](sprint-<n>/README.md) | `open` | YYYY-MM-DD |``. Close sprint changes the Status to `closed YYYY-MM-DD`. A first draft has the header and no row.
- **Reviews:** "None yet." until the review step's first yes. At each yes, the review step writes a row for its run, under the header `| Date | After | Report | Picks |`: the date, the last closed sprint as `sprint-<n>`, a link to its report in `../artifacts/`, and what each pick became. The row makes the report final, and the cycle reads the last row to tell when the next review is due.
- **A line of the rules** changes only at the yes, and the change log says what changed.
