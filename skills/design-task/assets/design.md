# The design

*The template of a task's design, `docs/plans/<ID>-<slug>-design.md`: the task file's name with `-design`. The design task step creates it, build task follows it, and the sync keeps it true while its task is open. Its title, its opening line, its parts, the steps' headings with their Done when, the criteria's table, the estimate's figure and the change log are fixed, since `check-design`, the build and the sync read them. The design is final once its task's Design row links it, which the yes writes.*

````markdown
# <ID> · <The task's title>: design

*The design of task [<ID>](../sprints/sprint-<n>/<the task's file>), for <its story ids, or the milestone it serves>. Written by the design task step on YYYY-MM-DD.*

## The idea

- <A main idea, in one sentence: what the build does, and why> (decision <k>).
- <A call made for the user, which they may overturn> (chosen for the user).

## The user's decisions

1. **<The decision.>** *Over:* <what it was chosen over, and why>.

## Steps

### 1. <What the step delivers>

- <A behaviour the step adds, at the level of the modules.>

**Done when:** <what proves it: a test that fails first, where the project has tests, or what the user sees>.

## Acceptance criteria

| # | Criterion | Step | Shown by |
|---|---|---|---|
| 1 | <A criterion of the task, as its file words it> | <the steps that deliver it> | <the test or the check that shows it> |

## The estimate

<n> dev-days: unchanged, or moved from <the board's figure>, because <why>. <The story's figure, or the milestone's>.

## Documents

**With this design:** <what the yes writes: the Design row, a log row in the task and in the sprint's README, any criterion added or changed, and the days if they moved>.

**At the close:** <the documents the build will make stale, such as the commands or the architecture's seams>.

## Watch for

- <A risk, and how the build guards against it.>
- <A fact the build confirms at its source before it relies on it.>

## Change log

| Date | Change |
|---|---|
| YYYY-MM-DD | Written by the design task step. |
````

- **The idea:** three to ten bullets. Each ends with "(decision k)", with a decision of the project that holds, by its id, or with "(chosen for the user)".
- **The user's decisions** are numbered 1, 2… and cited as "(decision 2)". A `D` and a number names a decision of the project's index, and the check reads it so.
- **The steps:** each a `### k.` heading, two to six bullets of behaviour, and its **Done when:** with its proof. The build reads the code, and picks the files and the names.
- **The criteria:** one row for each criterion of the task, and for each one the design adds. The yes writes the added ones into the task, marked.
- **The estimate:** the figure that the board's Days hold once the yes writes it.
- **Ids in the text** name only what has a file. An issue or a deferred item goes by its file name, in backticks, never a link, since the file is deleted later.
