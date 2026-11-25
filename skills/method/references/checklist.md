# The checklist

*What every Gradatim skill passes before its task closes. Written by MTH-2 on 2026-10-29. The task ticks each item in its design, with its evidence: a run of `npm run check`, a line of the skill, or a run's event log. An item that doesn't apply is marked so, with the reason. FND-5 turns the items under "Read and run" into scenarios.*

## Checked by `npm run check`

1. **The frontmatter** holds only `name`, the description and `license`, and the name is its folder's.
2. **The name** is in [cycle.md](cycle.md)'s Skill column, or is `method` or `hello`.
3. **The description** holds "Use when", in under 300 characters.
4. **The sections** come in [the writing rules](writing-rules.md#the-skill-file)' order: the size line under the title, then When to use, Reads and writes, Steps, Stop, and Red flags if there are any.
5. **The fixed steps:** Start comes first and links the capabilities and [the contract](contract.md), to read when a step needs them. Agree is there, unless the skill is `init-project` or `method`. Next step comes last and links cycle.md, unless the skill is `hello`.
6. **Reads and writes:** each path is a row of [documents.md](documents.md), and the skill creates or changes it only as that row lets its step.
7. **Portable:** no host's tool names or syntax, no model, effort or provider, no link that leaves `skills/`, and no other plugin's skill.
8. **Small:** the `SKILL.md` is under 500 lines and 20,000 bytes.

## Read and run

9. **The description** gives the use case and the user's words that trigger the skill, and no workflow.
10. **The ask.** Started without the user asking for its step, a skill that writes says what it would do and asks first.
11. **A missing input** is named, with the step that creates it, and the skill goes on without it only at the user's word.
12. **Its own drafts,** left by a run that stopped, are offered: go on from them, or start over.
13. **Each question** comes alone, or in a round where the skill's step asks in rounds: at most four questions whose answers don't hang on each other. Each has two to four options, the recommended one first, with its reason, and the reply waits for the answers. When a question tool comes back without an answer, the skill asks in plain text: it never guesses.
14. **The agreement** comes before every final mark, in the parts the skill names, in plain text. A change is made, shown and asked again. Silence is never a yes.
15. **The final marks** appear only after the yes, and match the Agree step's list.
16. **The next step** comes from the cycle's Next cell and the project's state, in the final message, and starts only at the user's word.
17. **Git:** the skill makes only the git and GitHub writes its steps name, staged by path with only what the step wrote and the final documents no commit holds, and none where a rule of the user's bars them.
18. **It writes only** what its "Reads and writes" table lists.
19. **The runs** pass on Opus 5.5 on Claude Code, with the user's other plugins off. A just-in-case run of a few on DeepSeek Flash on OpenCode, where its free limit allowed one, is noted with its result, and is no gate. Their tokens and time are in the run log, and a run over its budget has a reason in the task's design.

## Read by the task

*Added by MTH-5 on 2026-11-02.*

20. **Lite**, as [the writing rules](writing-rules.md#initiative) say:
    - each step gives its goal, its hard lines and how to tell it is done;
    - each Fixed part says what breaks without it;
    - the size line fits the skill's runs;
    - no step tells the model to verify or re-check its own work, or hands it to a reviewer subagent, unless the idea asks for the check;
    - a subagent runs only work that is independent and big enough;
    - each hand-off names its kind, and one below Opus was adopted on a trial;
    - each line added after a failed run names that run in the task's design.
