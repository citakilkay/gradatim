---
name: method
description: "Where a Gradatim project stands, and the step to run next. Use when the user asks where the project is, what to do next, or what Gradatim's method holds."
license: MIT
---

# Gradatim's method

This skill holds the method every Gradatim skill shares: its documents in [references/](references/README.md), its templates in `assets/`, and the scripts several skills run in `scripts/`. The other skills read them through relative links, such as `../method/references/cycle.md`. Run on its own, it tells the user where their project stands, and offers the next step.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** a look at the project's documents, and one short answer. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks where the project stands, what to do next, or what Gradatim's method holds.
- Not for running a step: each step has its own skill, which this one offers.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |
| Sprint rules and index | `docs/sprints/README.md` | reads |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | reads |
| Release record | `docs/RELEASES.md` | reads |

It also looks at which of the map's documents exist. It writes nothing.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · method**`, with what you found below it. Read the map of the host you run in, `references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. Read [the cycle](references/cycle.md): its table and "Where the project stands" are what this skill works from. [The documents](references/documents.md), [the capabilities](references/capabilities.md) and [the contract](references/contract.md) hold details, such as the step that creates a document you found: read one when you need it. Done when you have read the cycle.
2. **Answer** from the project's files, never from memory, in at most 12 lines:
   - where it stands: what is done; what is open, such as a sprint, a task under way or a step's drafts; and what comes next. A missing document is no error: it shows where the project stands;
   - with no `AGENTS.md` holding the line "The documents flow top-down: …": that there is no Gradatim project here, then the cycle's 14 steps, one a line;
   - asked what the method holds: that alone, from [the index](references/README.md), in at most eight lines in all, with no account of the project's state.

   Done when the answer is shown.
3. **Next step.** End with `**Next:** <step>, with <skill>: <why, from the project's state>.`, from [the cycle](references/cycle.md)'s Next column and the state: the step whose drafts are waiting, or `init-project` where there is no project. If `../<skill>/SKILL.md` exists, offer "1. Start <skill> now (Recommended)" and "2. Stop here", and start it only at the user's word. Otherwise say that it isn't installed yet. Done when the user chose, or you said it isn't installed.

## Stop

- Where the documents disagree on the state, such as a task's status on the board and in its file, say which and where, and propose the step that owns the document. Change nothing.
