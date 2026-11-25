# The MVP

*The template of `docs/MVP.md`, which the concept step creates: the first usable version, as stories. A story's heading, its line and its `Exists:` line are fixed, since new sprint, close sprint, review and the sync read them, and `check-plan` holds them. The document is living, so each change is logged at its end.*

````markdown
# <Project> · The MVP

*The concept step's MVP, written on YYYY-MM-DD. It rests on D<n> and D<n> ([the decisions](decisions/README.md)). A story keeps its id, also when it moves.*

<Where the MVP ends, and why: what the first usable version shows about whether the idea works, in two or three sentences.>

**Done when** <a result a user can see>.

**Out, and why:**
- <What waits>: [phase <k>](PHASE-<k>.md), since <why>.

### M<n> · <Title>

Status: `planned` · Estimate: <n> dev-days · Depends on: <story ids>, or — · Decisions: <D ids>, or none, from the idea

<What a user gets, in one or two sentences.> Done when <what shows it>.

### M<n> · <Title of a story the code meets whole>

Status: `existing` · Estimate: — · Depends on: <story ids>, or — · Decisions: <D ids>, none, from the idea, or none, from the code

<What a user gets, in one or two sentences.> Done when <what shows it>.

Exists: <NN Fk>.

## Change log

| Date | Change |
|---|---|
| YYYY-MM-DD | Written by the concept step: M1 to M<n> |
````

- **The story's line:**
  - `Status` is `planned`, `existing`, `delivered` or `dropped`;
  - `Estimate` is in senior dev-days, in quarter-day steps, such as 0.25, 1.5 or 3.75, and — for an `existing` story;
  - `Depends on` names the stories it needs first, or —;
  - `Decisions` names the D ids it rests on, or reads "none, from the idea". A phase's story may read "none, proposed", for the step's own proposal, a story the user asked for reads "none, the user's word", and a story that only the code names reads "none, from the code".
- **A story the code meets whole,** by the report on the project's code, `docs/research/NN-the-code.md`, is `existing` when the plan is written: the concept step alone sets that status. Its `Exists:` line, under its text, cites the findings that show it, as `Exists: 01 F2.`, and no path, since the finding keeps the path with its commit. It needs no task, and adds nothing to a sum.
- **A story the code meets in part** stays `planned`, with the days for what is left, and a line under its text that cites what exists: `Exists in part: <NN Fk>: <what exists>.`
- **The estimate** stays out of the heading, so that the heading's anchor holds when the estimate changes.
- **A moved story** keeps its heading where it was, with only this line under it, and sits whole in its new file, under the same heading:

  ```markdown
  Moved to [phase <k>](PHASE-<k>.md#<its heading's anchor>) on YYYY-MM-DD (<D<n>, or the user's word>).
  ```
- **A dropped story** keeps its heading and its line, with the status `dropped`.
- **A split** keeps the id on the part that keeps the story's aim. The other part takes the next id.
- **The next id** comes after the highest in the MVP and every phase, so no id is used twice.
- **An anchor** is the heading in lower case, its spaces as hyphens and its other marks dropped: `### M4 · Sign in with an e-mail link` is `#m4--sign-in-with-an-e-mail-link`.
