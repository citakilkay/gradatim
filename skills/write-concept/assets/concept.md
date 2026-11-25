# The main concept

*The template of `docs/MAIN_CONCEPT.md`, which the concept step creates. The idea moves into it word for word from `AGENTS.md`, whose "### The idea" leaves at the yes. Its opening line names the decisions it rests on, which `check-plan` reads. The document is living, so each change is logged at its end.*

````markdown
# <Project> · The main concept

*The concept step's main concept, written on YYYY-MM-DD. It rests on D<n>, D<n> and D<n> ([the decisions](decisions/README.md)).*

## The idea

<The idea, word for word, as the "### The idea" of `AGENTS.md` holds it.>

## What <Project> is

<For whom it is, what they do with it, and why, in two to four sentences.>

- **<A trait>:** <what it means for the user> (D<n>).

## What <Project> is not

- <A limit, or what it leaves out> (D<n>).

## The plan

[The MVP](MVP.md) holds the first usable version, [the roadmap](ROADMAP.md) its milestones, and [phase 1](PHASE-1.md) what comes after it. The overview, `docs/artifacts/NN-overview.html`, shows them on one page.

## Change log

| Date | Change |
|---|---|
| YYYY-MM-DD | Written by the concept step, with the idea moved in from `AGENTS.md` |
````

- **With no decisions,** the opening line reads "It rests on the idea alone."
- **Each trait and each limit** names the decisions behind it. Every decision that holds sits in a trait, a limit or a story.
