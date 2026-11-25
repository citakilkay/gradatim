# The review's rows

*Read only by the review step, at the yes: the shapes of what it writes. The plan's shapes are concept's, and `check-plan`, `check-architecture` and `check-sprint` hold them.*

## A story from a pick

In the MVP, or in the phase it joins, after the last story there and before the change log:

```markdown
### <M<n> or P<k>.<n>> · <Title>

Status: `planned` · Estimate: <n> dev-days · Depends on: <ids, or —> · Decisions: <ids, or none, the user's word>

<What a user gets, in one or two sentences, from the item's change and what it wins.> Done when <what a user can see once it is built>.
```

- **Its id:** the next in its milestone, after the highest there, a moved or dropped story's too, since no id is reused: `M<n>` in the MVP, `P<k>.<n>` in phase k.
- **Its estimate:** the item's size, in quarter dev-days.
- **Depends on:** the stories it needs built first. **Decisions:** those that hold behind it, else "none, the user's word".
- **The change log** of each document it joins: `| YYYY-MM-DD | <ids>: the picks of the review after sprint <n> |`.

## The roadmap

- Each story joins its milestone's list, after the stories it depends on and before any that depend on it, else at the list's end: `<k>. <id> · <Title>`, renumbered.
- Its milestone's row: the new sum of its stories.
- The plan's line: `about <the rows' new total> dev-days`, its range moved by the same days.
- The change log: `| YYYY-MM-DD | <ids> added: the picks of the review after sprint <n> |`.

## The architecture

- Each story's id joins its module's Stories cell, in the modules table, after the ids there.
- The change log: `| YYYY-MM-DD | <ids> in <module>: the picks of the review after sprint <n> |`.

## The overview

Made again in place, as concept makes it on a later run: the same file and number; the plan's total, each milestone's bar and dev-days, the stories table and the phases, with the new stories; its change log keeps its rows and gains `<tr><td class="n">YYYY-MM-DD</td><td>The picks of the review after sprint <n>: <ids></td></tr>`. Then the wrap.

## The review's row

In `docs/sprints/README.md`, under `## Reviews`. A first review puts the table where "None yet." was; a later one adds its row last:

```markdown
| Date | After | Report | Picks |
|---|---|---|---|
| YYYY-MM-DD | sprint-<n> | [NN-review-sprint-<n>.html](../artifacts/NN-review-sprint-<n>.html) | item <k>: <id> · item <k>: to decide · item <k>: to architecture |
```

- **After:** the last closed sprint, which the report is named after. The next review is due two closed sprints after it.
- **Picks:** each pick by its rank and what it became, joined with " · ", or "none: the report alone".
- **The change log:** `| YYYY-MM-DD | The review after sprint <n>: <its picks, in a few words> |`.
