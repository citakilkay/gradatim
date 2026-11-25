# The skill template

*Every Gradatim skill starts from the block below. Written by MTH-2 on 2026-10-29; made lite by MTH-5 on 2026-11-02; its Stop a reply in a code block, with FND-6 on 2026-11-06; a hand-off's kind, with MTH-7 on 2026-11-13. Copy the block into `skills/<name>/SKILL.md`, fill each `<…>`, and delete what doesn't apply. [The writing rules](../references/writing-rules.md#the-skill-file) say what each part holds and [how free each step is](../references/writing-rules.md#initiative), [the contract](../references/contract.md) holds the hard lines, and [the checklist](../references/checklist.md) says what the skill passes before its task closes. The block's links are written for a skill's own folder, so they work once it sits in `skills/<name>/`.*

````markdown
---
name: <a verb and its object, from cycle.md's Skill column>
description: "<What the user gets, in one clause>. Use when the user asks for Gradatim's <step> step, or <the ask in their own words>."
license: MIT
---

# <Title>

<One or two sentences: what this step does in the cycle, and what it leaves to other steps.>

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** <its size, such as a look at the project, two questions and one document>. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- <An ask this skill answers, in the user's words.>
- Not for <a case>: that is `<the other skill>`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| <Its name in documents.md> | `<its path in documents.md>` | reads |
| <…> | `<…>` | creates |

## Steps

1. **Start.** Open each reply with the line `**Gradatim · <step>**`, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: say so, and offer `init-project`. If the user didn't ask for this step, answer what they did ask, then say in a line what it would write, and wait for the yes. Name a missing input with the step that creates it, and go on without it only at the user's word. If a run left this step's drafts, offer to go on from them. [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when <the inputs are there, or the user chose to go on>.
2. **<Leading word>.** <The goal, and what must exist at the end. A Fixed part gives its exact shape, and what breaks without it. A step that asks: one question at a time, after two to five lines on what the documents say and what the answer changes, with two to four options, the recommended one first, with its reason; without a question tool, or when it comes back without an answer, in plain text with the options numbered, and the reply ends there. Only a step that says so asks in rounds, as decide's and architecture's do: up to four questions whose answers don't wait on each other. A step that hands work to a subagent: "hand <the job> to a subagent, on the model your host's map gives <its kind, from the capabilities' table>", and what a host with no subagents does instead.> Done when <what the model can see>.
3. **Agree.** Show the summary in <n> parts: <the parts>. Each says what you wrote, what you chose for the user, what is open, and what the yes will write. Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   <In a step that writes to git: the summary says what the yes writes, its git writes among them. They run last, after the final marks, so that they hold them. Where a rule of the user's bars git writes, run none, and show the commands.> Make a change, show what changed, and ask again. On the yes, and only then, write the final marks: <the marks>. Done when they are written.
4. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state, and end with:

   ```
   **<Step>: done.**
   **Written:** <each file, linked>.
   **Open:** <what is left>, or nothing.
   **Next:** <step>, with <skill>: <why, from the project's state>.
   1. Start <skill> now (Recommended)
   2. Stop here
   ```

   Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed. Start it only at the user's word. Done when the user chose.

## Stop

- If <a condition the model can see>, write nothing, and reply:

  ```
  **Gradatim · <step>**

  **<Step>: stopped.** <The reason>: <what you found>. Nothing was written.
  **Next:** <the step that clears it>, with `<skill>`: <why>.
  1. Start `<skill>` now (Recommended)
  2. Stop here
  ```

  Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.

## Red flags

| Thought | Instead |
|---|---|
| "<What a model tells itself to skip a rule>" | <What to do instead.> |
````
