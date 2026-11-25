# OpenCode

*The map from each capability in [capabilities.md](capabilities.md) to OpenCode's tools. Checked on 2026-10-28. OpenCode 2.x: the 2.0.32 CLI that OpenCode Desktop bundles, tried here, and [OpenCode's v2 docs](https://opencode.ai/v2/docs/permissions). OpenCode 1.x: from its docs, as FND-1's research found them, not tried here.*

| Capability | 2.x | 1.x | Notes |
|---|---|---|---|
| Ask the user | `question` | `question` | An `opencode run` cancels a question and tells the model to go on without an answer. Don't: ask in plain text. The General subagent can't ask |
| Hand work to a subagent | `subagent`, with the agents `general` and `explore` | `task`, with the same agents | In 2.x the General agent can't start a subagent of its own |
| Search the web | `websearch` | `websearch` | 1.x has it only with the OpenCode or OpenCode Go provider, or with `OPENCODE_ENABLE_EXA` set. 2.x lists it with DeepSeek's models, and how it searches isn't tried here |
| Fetch a page | `webfetch` | `webfetch` | |
| Research tools | The MCP servers the user added | The same | |
| Drive a browser | An MCP server, such as Playwright MCP | The same | OpenCode has no browser of its own |
| Run a command | `shell` | `bash` | Most actions are allowed by default |
| Show an artifact | None | None | Give the file's path |
| Keep a todo list | None | `todowrite` | The 2.0.32 CLI lists no todo tool |
| Start another Gradatim skill | `skill` | `skill` | Skills sit under their own names, not the plugin's, so read `../<skill>/SKILL.md` instead |

## Every reply

On this host, keep these lines of every skill, whatever the model. DeepSeek Flash missed them when only the skill gave them (MTH-5's runs, 2026-11-02 to 04):
- Open each reply with the heading line the skill's Start gives, such as `**Gradatim · hello**`, on a line of its own: nothing above it, and nothing after it on that line. It is the same on every reply, whatever step or tool you are on.
- Ask one question at a time, or the round the skill's step gives. After the last question's numbered options, end the reply, with nothing after them. Take the answers from the user's next message, then go on with the skill's steps in their order.
- When `question` comes back cancelled, the user is still there. Ask in plain text and end the reply. Never take an option for the user, the recommended one included.
- Put the reason for the recommended option on that option's own line, as `1. <option> (Recommended): <why>`, not in the lines above the options. A fixed text, such as the agreement's question, keeps its own words.

## Calling Gradatim's skills

Gradatim's entry registers its skills under their own names. The user asks for one by name, such as "Use the hello skill", and OpenCode may also start one on its own from its description. A project's or the user's skill with the same name can clash, and OpenCode's docs don't say which wins.

## The instruction file

OpenCode reads `AGENTS.md`, and reads `CLAUDE.md` only when there is no `AGENTS.md`. The `instructions` list in `opencode.json` adds other files. Nothing needs to be added.

## Adding an MCP server

In 2.x, under `mcp.servers` in `opencode.json`: a name, a `type` and a `command` list, such as `"playwright": {"type": "local", "command": ["npx", "@playwright/mcp@latest"]}`. In 1.x, under `mcp`, as a `local` or `remote` server.

## When nobody can answer

An `opencode run` cancels a question, and tells the model to make its own assumptions. Ask in plain text and end the reply. The user answers with `opencode run --session <session id> "<answer>"`. A script that runs `opencode run` closes the run's input. Left open, the run waits at the question until it is stopped (2.0.32, tried here).
