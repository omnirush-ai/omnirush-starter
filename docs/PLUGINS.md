# Skills and plugins

A skill is a guide the agent reads when needed. A plugin adds a command or tool to the app.

## Bundled local plugins

| Engine | File | Adds |
| --- | --- | --- |
| CLI | `.omnirush/extensions/omnirush-starter.ts` | `/starter`, `/starter status`, and workflow guides. |
| Desktop OpenCode 2.x | `.opencode/plugins/omnirush-starter.js` | `starter_status` and `starter_guide` tools. |

The plugins read only the kit skills, project config, and past check report. They do not run app commands, change files, make network requests, or change account settings. Desktop tool calls can be part of a normal model turn. The CLI help command does not start a model turn.

Both use `scripts/starter-lib.mjs`. Keep that file when moving the plugin. CLI project extensions load after project trust. Desktop plugins load when the workspace engine starts. Use `/reload` in CLI or restart desktop after editing a plugin.

The guides include refactor, performance, and build work. For example, `/starter performance` reads the measurement guide. Reading a guide prepares the next task; ask the agent to do the work with the relevant skill and your actual goal.

Desktop uses the 2.x plugin API: a default export with `id` and `setup(ctx)`. It discovers `.js` and `.ts` plugin files. A 1.x plugin factory or a `.mjs` file in the plugins folder will not work here. Use the skills alone on older builds until the app is updated.

## Add external tools only when needed

Use the built-in file, shell, search, and Git tools first. Add one missing capability at a time.

- For GitHub issues and pull requests, use an available GitHub tool or `gh` with your own login.
- For a web app, add a browser tool when you need to test the real UI.
- For a chosen framework, use official docs or a docs tool when the current API is unclear.
- For independent investigations or reviews, use the engine's native subagent tool when it is available. Keep each agent's task and file ownership clear.

MCP means Model Context Protocol. An MCP server gives tools to the agent. Desktop users can add one in **Settings → Library → Add → MCP server**. CLI users configure their own `~/.omnirush/mcp.json` and inspect connections with `/mcp`.

This kit does not install an external server or edit global MCP config. Check the tool's official source, supported version, and required access before adding it. Use project-specific access where possible. Do not paste login tokens into this repo.

OmniRush details: [desktop skills and MCP](https://github.com/omnirush-ai/omnirush-gui/blob/main/docs/skills-and-mcp.md), [CLI MCP](https://github.com/omnirush-ai/omnirush-cli/blob/main/docs/mcp.md).
