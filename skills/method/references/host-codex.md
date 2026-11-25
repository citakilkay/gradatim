# Codex

*The map from each capability in [capabilities.md](capabilities.md) to Codex's tools. Checked on 2026-10-28, from Codex's docs and, where they are silent, its source code, as FND-1's research found them. Not tried here: Codex isn't installed on the owner's machine.*

| Capability | Tool | Notes |
|---|---|---|
| Ask the user | `request_user_input` | Only in Plan mode, per the source: 1 to 3 questions, each with 2 to 3 options. Outside Plan mode, ask in plain text |
| Hand work to a subagent | Codex's agent tools | On by default in current releases. The docs name no tool, and the user's settings cap how many run at once |
| Search the web | `web_search` | Cached results by default, live ones with `--search`. Among DeepSeek's models only `deepseek-v4-pro` has it, at search prices |
| Fetch a page | None | The docs name no fetch tool, and the sandbox has no network by default, so ask the user for the text |
| Research tools | The MCP servers the user added | |
| Drive a browser | The desktop app's browser | Not in Codex CLI or the IDE extension: there, an MCP server such as Playwright MCP |
| Run a command | The shell, in a sandbox | By default it writes only in the workspace, has no network, and asks the user when it needs more |
| Show an artifact | The desktop app's HTML preview | The CLI has no preview: give the file's path |
| Keep a todo list | `update_plan` | Per the source; not in the docs |
| Start another Gradatim skill | None | Read `../<skill>/SKILL.md`. The docs don't say how Codex names a plugin's skills |

## Calling Gradatim's skills

The user types `$` and picks the skill, or opens the `/skills` picker. Codex may also start a skill on its own when the task matches the skill's description.

## The instruction file

Codex reads `AGENTS.md`: first the one in the user's Codex folder, then each from the project's root down to the working folder. An `AGENTS.override.md` in a folder takes the place of its `AGENTS.md`. All of them together are capped at 32 KiB, so keep `AGENTS.md` short and point to other files. Nothing needs to be added.

## Adding an MCP server

`codex mcp add <name> <command> [arguments]`, or an entry under `[mcp_servers]` in the user's `config.toml`.

## When nobody can answer

Not tried here. Ask in plain text and end the reply.
