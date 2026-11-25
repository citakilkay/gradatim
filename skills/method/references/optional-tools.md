# Optional tools

*Tools from outside Gradatim that make some steps better where the user has them. Gradatim ships none of them and needs none: each step works without them, as [capabilities.md](capabilities.md) says. Checked on 2026-10-28, at each tool's own page.*

| Tool | What it adds | What it needs | Used for |
|---|---|---|---|
| Firecrawl | Search, scrape and parse pages as clean text, including pages that block a plain fetch | Nothing to start: a keyless mode, free within daily limits. A sign-in or an API key gives more, and full access depends on the plan | Research |
| Exa | Web search that returns the pages' content, reading of known pages, and multi-step research | Nothing to start: free, rate-limited use without a key. A sign-in or an API key gives higher limits, and new accounts get free credits | Research |
| Playwright MCP | A real browser that the agent drives through the page's structure: open, click, type, fill forms and take screenshots | Node.js 18 or later. No key and no cost | Checking a UI when a task is built or closed, and looking at the whole UI in a review. A demo records with the project's own Playwright, since a video the agent drives keeps its pauses |

## Setting one up

Each tool's own page gives its setup for each host, and the host's map says where its MCP servers go.

- **Firecrawl:** [its MCP page](https://docs.firecrawl.dev/mcp-server). It is hosted at `https://mcp.firecrawl.dev/v2/mcp-oauth`, with a sign-in, or at `https://mcp.firecrawl.dev/v2/mcp`, with a key.
- **Exa:** [its MCP page](https://exa.ai/docs/reference/exa-mcp). It is hosted at `https://mcp.exa.ai/mcp`.
- **Playwright MCP:** [its README](https://github.com/microsoft/playwright-mcp). It runs on the user's machine as `npx @playwright/mcp@latest`.

Keys go in the host's MCP settings or in the environment, never in the project's files. A skill offers the setup, and runs it only if the user says yes.

## How a skill tells that one is there

Its tools are in the tool list, named after it. Firecrawl's names hold `firecrawl`, Exa's end in `_exa`, and Playwright MCP's start with `browser_`, after any prefix the host adds. On some hosts an MCP server's tools are listed by name only until they are loaded; the map says how to load them.
