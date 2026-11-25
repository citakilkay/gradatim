# A phase

*The template of `docs/PHASE-<k>.md`, which the concept step creates for each milestone after the MVP. Its stories take the shapes that [the MVP's template](mvp.md) gives. The document is living, so each change is logged at its end.*

````markdown
# <Project> · Phase <k>

*The concept step's phase <k>, written on YYYY-MM-DD. It rests on D<n> ([the decisions](decisions/README.md)).*

<Its aim, in a sentence.> It starts <when, such as once the MVP is done, or once a decision's time comes>, and ends when <a result a user can see>.

### P<k>.<n> · <Title>

Status: `planned` · Estimate: <n> dev-days · Depends on: <story ids>, or — · Decisions: <D ids>, none, from the idea, or none, proposed

<What a user gets, in one or two sentences.> Done when <what shows it>.

## Change log

| Date | Change |
|---|---|
| YYYY-MM-DD | Written by the concept step: P<k>.1 to P<k>.<n> |
````

- **A proposal** is one of the step's own options, at most three in the plan. Its line reads "none, proposed", and the agreement names it, for the user to keep or drop. None goes in the MVP.
- **A story moved here** keeps its id, such as `### M5 · …`, and is whole here.
- **With no decision behind it,** the opening line reads "It rests on the idea alone."
