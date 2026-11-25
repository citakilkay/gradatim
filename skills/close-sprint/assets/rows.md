# The rows of a sprint's close

*Read by the close sprint step at the yes: the exact rows and lines it writes, each at the end of its document's log. They are fixed, since other steps read them: new sprint reads the sprint's closing row for what the sprint taught, and the sprints' check holds the statuses that go with them. Each date is today's, `YYYY-MM-DD`. An issue or a deferred item is named by its file name, in backticks, never linked, since the file is deleted at its end.*

## A deferred task

One row at the end of the task's log, by what carries its work on:

```
| YYYY-MM-DD | Deferred by the close sprint step: `<the item's file name>` carries what it still needs. |
| YYYY-MM-DD | Deferred by the close sprint step: `<the taken file's name>`, back to `open`, carries what it still needs. |
| YYYY-MM-DD | Deferred by the close sprint step, with nothing carried: <the user's reason, or the decision that made it obsolete>. |
```

## The sprint

The closing row, the last of the sprint's log:

```
| YYYY-MM-DD | Closed by the close sprint step: <ids> `completed`; <ids> `completed-as-partial`; <each task `deferred`, with its item's file name, or with nothing carried>. Delivered: <the stories>, or no story. Check: <what was shown; what was deferred, by its item's file name; what was left, with the user's reason>, or none. Open: <each issue and item left `open`, by its file name>, or nothing. Taught: <the days that moved at the designs>; <the tasks added mid-sprint>; <a question that came back>; or nothing the logs show. |
```

- **Taught** holds up to three things that the sprint's own logs show and that would change the next sprint, with what the user added at the agreement. Leave out a part the logs don't show.

## The sprint rules

The sprint's row in the sprints table reads `closed YYYY-MM-DD`, as the README's Status does. The change log gains the first row below, and the second where the user agreed to change a rule, whose line in "The rules" is rewritten:

```
| YYYY-MM-DD | Sprint <n> closed |
| YYYY-MM-DD | <The rule>: <what it said> becomes <what it says>, from sprint <n>'s close, at the user's word |
```

## A file that goes back to open

An issue or a deferred item whose task isn't `completed`: its first line becomes `Status: open`, and its log gains:

```
| YYYY-MM-DD | Back to `open` at sprint <n>'s close: <ID> is `<its status>`. <What was done, and what is left.> |
```

## The plan

A delivered story's line reads ``Status: `delivered` ``, with the rest of the line as it was. Each MVP or phase file that holds one gains a row in its change log:

```
| YYYY-MM-DD | Sprint <n> delivered <the stories>, from the close |
```

The roadmap's Progress holds one line for each closed sprint, newest last; the first takes the place of "No sprint yet." Its change log gains the row below it:

```
Sprint <n> closed on YYYY-MM-DD: <the stories> are delivered, <d> of <the milestone>'s <total> dev-days. <What waits, and where: a deferred item, or a later sprint.>
Sprint <n> closed on YYYY-MM-DD: no story is delivered. <What it closed, such as its setup tasks, and what waits, and where.>
```

```
| YYYY-MM-DD | Progress: sprint <n> closed, from the close |
```
