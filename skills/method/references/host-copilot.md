# GitHub Copilot

*The map from each capability in [capabilities.md](capabilities.md) to the tools of Copilot CLI and of Copilot in VS Code. Checked on 2026-10-28, from GitHub's and VS Code's docs and Copilot CLI's changelog, as FND-1's research found them. Not tried here: neither is installed on the owner's machine.*

| Capability | CLI | VS Code | Notes |
|---|---|---|---|
| Ask the user | `ask_user` | `#vscode/askQuestions` | Both add the user's own answer. VS Code's also works in subagents |
| Hand work to a subagent | Built-in agents, such as `general-purpose` | `#agent/runSubagent` | The CLI's docs don't name the tool it uses. In VS Code a subagent can't start its own, unless the user turns that on |
| Search the web | `web_search`, from the built-in GitHub MCP server | None found | In VS Code, fetch the pages you know, then ask the user for sources |
| Fetch a page | `web_fetch` | `#web/fetch` | |
| Research tools | The MCP servers the user added | The same | |
| Drive a browser | None found | The built-in browser tools | In the CLI, an MCP server such as Playwright MCP |
| Run a command | The shell | The terminal | Each asks the user before a command, unless the user allowed it |
| Show an artifact | None | Open in Integrated Browser | In the CLI, give the file's path |
| Keep a todo list | None found | `#todos` | |
| Start another Gradatim skill | None | None | Read `../<skill>/SKILL.md`, since a project's or the user's skill of the same name wins |

## Calling Gradatim's skills

In Copilot CLI the user names the skill with a slash, in the prompt: "Use the /hello skill". `/skills info` shows which plugin a skill came from. In VS Code, skills also appear as slash commands. Copilot may start a skill on its own when the prompt matches its description. A project's or the user's skill with the same name wins over Gradatim's.

## The instruction file

Copilot reads `AGENTS.md` together with `.github/copilot-instructions.md`, and in the CLI also `CLAUDE.md` and `GEMINI.md`, all at once, in no stated order. Keep them from conflicting. Nothing needs to be added.

## Adding an MCP server

In the CLI: `.copilot/mcp-config.json` in the user's home folder, or the project's `.mcp.json`. In VS Code: the project's `.vscode/mcp.json`.

## When nobody can answer

Not tried here. Ask in plain text and end the reply.
