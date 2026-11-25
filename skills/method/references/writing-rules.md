# Writing rules

*The rules for writing a Gradatim skill. FND-4 wrote the first part on 2026-10-28: the rules that keep a skill working on every host and model. MTH-2 added the skill file's shape and the rules of style on 2026-10-29. MTH-5 made the skills lite on 2026-11-02: a step gives the goal, the hard lines and how to tell it is done, and the route is the model's. MTH-7 gave each hand-off its kind on 2026-11-13. `npm run check` enforces the rules marked "Checked". A skill starts from [the template](../assets/skill-template.md), keeps [the contract](contract.md)'s hard lines, and passes [the checklist](checklist.md) before its task closes.*

## Portability

1. **Name capabilities, never tools.** Write "ask the user", "hand this to a subagent" or "search the web", with the names [capabilities.md](capabilities.md) gives them. A host's tool names appear only in that host's map. *Checked:* a tool name from a map's tool column, in backticks, anywhere in `skills/` outside the maps and this file.
2. **Link the capabilities in the first step.** A skill that uses any capability links capabilities.md in its first step, together with "the map of the host you run in". It reads the map at Start, and capabilities.md when a capability is missing, fails or is refused.
3. **Every use has a way without.** A step that uses a capability still works without it: by capabilities.md's "Without it", or by a way the step writes out itself.
4. **Optional tools stay optional.** Firecrawl, Exa, Playwright MCP and the like only add to a step. Where one would help, the skill says what it would add and links [optional-tools.md](optional-tools.md).
5. **Frontmatter holds only `name`, `description`, `license` and `metadata`.** Every host reads the frontmatter, and a key that one host needs can break another. Behaviour for one host goes in a file that only that host reads, such as Codex's `agents/openai.yaml`, and nothing essential rests on it. *Checked.*
6. **No host syntax.** That means no host variable, such as `$ARGUMENTS` or `${CLAUDE_PLUGIN_ROOT}`, and no line that one host runs as a command before the model reads the skill, such as Claude Code's `` !`command` ``. It also means no host's way of calling a skill, such as `/gradatim:<skill>`: the maps say how. What the user typed after the skill's name reaches the model as text on every host, so a skill reads it from the conversation. *Checked:* the variables, the command lines and `/gradatim:`.
7. **Links stay inside `skills/`.** A host may install only the skills, and then a link to the planning docs breaks. *Checked.*
8. **Paths are relative to the `SKILL.md`.** Another skill's file is `../<skill>/...`. A skill's scripts live in its `scripts/` folder and run as `node <the skill's folder>/scripts/<name>.mjs`, since some installers drop the executable bit. A script that several skills run, such as the sync's check, lives in the method's `scripts/` (MTH-3).
9. **A command runs unchanged in bash, PowerShell and cmd.** One program and its arguments, such as `git status --short`, with no `&&`, pipes, redirects or `$VAR`. Anything longer goes in a Node script.
10. **Nothing essential rests on a hook, a command file or a note injected into the session.** Hosts differ in all three. The skill's text carries the method.
11. **Write for the model Gradatim is made for.**
    - Each step gives its goal, its hard lines and how to tell it is done, as rule 27 says. The route is the model's.
    - Where to stop and wait, said in words, and the exact output where a step has one.
    - Nothing that relies on a host's own prompt.
    - Another model gets more guidance only where its run fails, in its host's map, so that the model Gradatim is made for doesn't pay for it.
    - The text is tried on Opus 5.5 on Claude Code, and, just in case, a few scenarios on DeepSeek Flash on OpenCode, as [the checklist](checklist.md)'s item 19 says.
12. **A hand-off names its kind, and a skill names no model, effort or provider.** A step that hands work to a subagent says so with its kind, from [the capabilities](capabilities.md#hand-work-to-a-subagent)' table: "hand <the job> to a subagent, on the model your host's map gives <the kind>". The host's map gives each kind its model, so the choice changes in one place, and no call names an effort. Where no kind fits a job, name the nearest heavier one. A kind that Claude Code's map runs below Opus 5.5 is named only after a trial in the task's design: the same scenarios on both models, where the lower one misses nothing the other found, or the owner accepts what it missed (MTH-7). *Checked:* a model, a provider or an effort level in a code span anywhere in `skills/` but the maps, these rules and the checklist; and, in each skill's Steps and in the sync, a line that hands work to a subagent names a kind, or links the sync.
13. **Keep a `SKILL.md` small:** under 500 lines and 20,000 bytes, with the detail moved to `references/`. *Checked.*

## The skill file

14. **A skill's name is a verb and its object**, taken from its step: `init-project`, `research-topics`. A step of two words keeps them: `design-task`. A host that drops the plugin's prefix then meets no built-in command and few other skills of the same name. [cycle.md](cycle.md)'s Skill column names each step's skill. *Checked.*
15. **The description gives the use case in a clause, then "Use when" and the user's words for each branch.** Name Gradatim or the step, so that the skill answers a Gradatim ask. Leave out the workflow: a model that finds the steps there follows them and skips the body. Every session holds the description, so keep it under 300 characters. *Checked:* "Use when", and a warning over 300.
16. **The frontmatter also holds `license: MIT`**, since some installers copy a skill on its own.
17. **The body comes in this order.** *Checked.*
    - The title, then one or two lines on the step's place in the cycle.
    - The fixed line: "This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name."
    - The size line, as rule 28 says.
    - `## When to use`: the asks the skill answers, and the cases it doesn't, each with the skill to use instead.
    - `## Reads and writes`: a table with the columns Document, Path and Use. Use is `reads`, `creates` or `changes`, or two of them. Each path is a row of [documents.md](documents.md), and the skill creates or changes it only as that row lets its step. What the sync changes isn't listed, nor what a change does: each is a procedure of its own, [sync.md](sync.md) and [change.md](change.md), which a step that follows it links, and which lists what it may change. The project's own files, which documents.md's rule 4 gives some steps, go in a line under the table. *Checked.*
    - `## Steps`, numbered: **Start** first; then the skill's own steps, each opening with its leading word in bold and ending on "Done when" or its exact output; then **Agree**; and **Next step** last.
    - `## Stop`: what makes the skill stop and say why, and the step that clears it.
    - `## Red flags`, only once a run has shown a model skipping a rule: a `| Thought | Instead |` table.
18. **The fixed steps carry their rules in their own lines**, since a model reads the contract only for a detail, and a host may drop the files a run read. *Checked:* each step, and its links.
    - **Start** names the step, reads the map of the host it runs in, and checks the ask, the inputs and its own drafts. It links the capabilities and [the contract](contract.md), and [documents.md](documents.md) in a skill that writes documents, to read when a step needs a detail they hold.
    - **Agree** names the summary's parts and the final marks, and asks. Every skill has it but `init-project` (N.2) and `method`, which writes nothing.
    - **Next step** reads [cycle.md](cycle.md), except in `hello`, whose next step is always `method`, and carries the final message's shape.
19. **What a skill reads, and when.** Start reads only the host's map, about 1,500 tokens; before MTH-5 it read about 12,000, which every later call of the run carried. Any other read is one a step needs.

    | File | When |
    |---|---|
    | The host's map | Start: the host's tools, and the lines it keeps on every reply |
    | capabilities.md | When a capability is missing, fails or is refused |
    | contract.md | When a step needs a hard line's detail, such as the git rules before a commit |
    | documents.md | When a step needs a document's kind, status or final mark beyond its table |
    | cycle.md | Next step; `method` at Start |
    | These rules, the checklist and the template | When a skill is written, never as it runs |

## Style

20. **Short sentences, one idea each.** Cut each sentence that changes nothing a model does. Models know the craft, so write what they can't guess: the method's names, paths and rules.
21. **Lead with the word that matters.** A step opens with its leading word in bold, such as "**Agree.**". Call each thing by the method's word, the same one every time: step, document, draft, final mark, the agreement, sealed.
22. **Say what to do.** A prohibition puts the very thing it forbids in front of the model. Keep "never" for a hard line, and pair it with what to do instead. Use no capitals for emphasis.
23. **Match the form to the failure.** An output with a fixed shape gets its exact template, in a code block. A rule that a model skips under pressure gets a red flag. A branch gets a condition the model can see, such as "if `AGENTS.md` has no order line".
24. **End each step on a clear end:** "Done when …", or its exact output.
25. **Inline what every run needs, and move what only some runs reach** to the skill's `references/`, one level deep, behind a link that says when to read it.
26. **State a rule in the step that applies it.** Start reads only the map, and a host may drop the files a run read, so a rule a step needs is written into that step.

## Initiative

*Added by MTH-5 on 2026-11-02, at the owner's word: a skill gives the model a range of initiative fitted to its task, to save tokens and time, and leans on the model more as models improve.*

27. **Freedom matches fragility.** Each part of a step is written at one of three levels.

    | Level | The step writes | For |
    |---|---|---|
    | **Open**, the default | The goal, what must exist at the end, and how to tell it is done | Work with many good routes: reading a project, research, drafts, designs, review findings |
    | **Guided** | A default route and its known pitfalls. The model may leave it, and says so in a line | A preferred pattern: how far to question, a sprint's size, where a new folder goes |
    | **Fixed** | The exact template, command or script, and what breaks without it | Marks other steps read, such as the order line, statuses, ids and index rows; seals, deletions and git writes; a host's rules; an output with an exact shape |

    A Fixed part that a script can hold goes in the skill's `scripts/`: only a script's output costs tokens.
28. **The size line.** Under the fixed line, a skill says what a usual run takes, and when to check in. *Checked.*

    ```
    **A usual run:** <its size, such as a look at the folder, one question and one file>. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.
    ```
29. **Write by subtraction.** Start from the goal, the hard lines, the Fixed parts and the done-checks. Add a line only when a run fails without it, and name that run in the task's design. When a new model becomes Gradatim's model on a host, each skill's suite runs once with its Guided lines cut, and the lines whose absence changes no outcome come out, as the tests' README says.
30. **No instructed self-checks.** No step tells the model to verify, re-check or double-check its own work, or to hand it to a reviewer subagent: the model checks its own work, and an instructed check repeats it at full cost. The exceptions are a check the idea asks for, such as the review at a task's close (8b), and a script that checks a Fixed output.
31. **A subagent only for work that is independent and big enough.** A fresh subagent starts at about 30,000 tokens. Hand work to one when it can run beside other work, or needs a context of its own, such as research on several topics, or a review that the work before it shouldn't colour. Do the rest here.
