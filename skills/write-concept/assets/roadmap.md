# The roadmap

*The template of `docs/ROADMAP.md`, which the concept step creates: the milestones in order, with their estimates, and no dates. Its table and its lists are fixed, since new sprint takes the next stories from them, close sprint writes the progress, and `check-plan` holds them. The document is living, so each change is logged at its end.*

````markdown
# <Project> · The roadmap

*The concept step's roadmap, written on YYYY-MM-DD. It rests on D<n> ([the decisions](decisions/README.md)). The estimates are senior dev-days, not dates.*

| Milestone | Estimate | Done when |
|---|---|---|
| The MVP | <n> dev-days | <the MVP's done line> |
| Phase <k> | <n> dev-days | <the phase's done line> |

**The plan:** about <n> dev-days, <low> to <high>; no dates.

## The MVP

1. M<n> · <Title>

## Phase <k>

1. P<k>.<n> · <Title>

## Progress

<Only where a story is `existing`: "M<n> exists already, from the code.">

No sprint yet.

## Change log

| Date | Change |
|---|---|
| YYYY-MM-DD | Written by the concept step |
````

- **A row's estimate** is the sum of its milestone's stories that aren't `dropped`, and the plan's line says the rows' total. An `existing` story adds nothing. A review that adds a story changes both.
- **Each list** names every planned story of its milestone once, by id and title, so that none comes before a story it depends on. An `existing` story is in no list, since new sprint takes the next stories from them. The estimates stay in the stories' lines.
- **Progress** is close sprint's: one line for each closed sprint, newest last. The concept step writes "No sprint yet." and leaves it. Where a story is `existing`, the concept step writes one line above it that names each such story, such as "M1 exists already, from the code.", and close sprint keeps that line first.
