# OmniRush Starter

Work on your software project with OmniRush. Use plain words to describe what you want. The skills help the agent read the code, make a useful change, test it, and teach the needed steps.

This is a blank project kit. You choose the app, language, and framework. It works with OmniRush desktop and CLI. The kit has no package dependencies.

## Start here

1. Choose [Use this template](https://github.com/omnirush-ai/omnirush-starter/generate) to create your own repo, then clone it into a new folder. You can also download this repo as a ZIP. Open the folder in OmniRush.
2. Run `npm run setup` once in that folder. It prepares the desktop skill copies. You can ask OmniRush to run it for you.
3. Paste this into your first chat:

```text
Use omnirush-setup. I want to build [your idea] for [who will use it].
I know [your skill level]. Help me choose a simple stack if I have not picked one.
Set up this repo, then build one small feature and test it.
Explain what changed and how I can try it.
```

If you are new to coding agents, follow the [first-session guide](docs/USAGE.md). It shows how to give feedback, choose a skill, and recover when you get stuck. For an existing app, keep its current stack and start with one real task.

Use Node.js 22.19 or newer for the kit scripts. Sign in to OmniRush with your own account. Keep your account settings in OmniRush. The kit does not set a provider, model, token, or subscription plan.

### Desktop

Open the repo folder as your workspace. Sign in from the app. After setup, open **Settings → Library** and check for the nine `omnirush-*` skills. Restart the app if a new skill does not appear. Ask in chat: `Use omnirush-feature to build ...`.

The local desktop plugin adds `starter_status` and `starter_guide`. The agent can use these tools to read the setup and guides. The plugin uses the desktop's OpenCode 2.x engine. Older desktop builds can still use the skill files; update the app before using this plugin.

### CLI

If the CLI is not installed:

```sh
npm install -g omnirush
omnirush login
```

From this repo folder:

```sh
omnirush
```

Trust the project when OmniRush asks. Inside the session, start with:

```text
/starter
/skill:omnirush-setup I want to build a small app for ...
```

`/starter status` shows setup and past check results. `/starter feature` shows a guide. These help commands do not start a model request. Use `/reload` after changing a skill or extension.

## What is in the kit

| Skill | Use it for |
| --- | --- |
| `omnirush-setup` | Learn the goal, choose a stack, and record real check commands. |
| `omnirush-feature` | Build one feature from clear user needs. |
| `omnirush-debug` | Reproduce a bug, find its cause, and test the fix. |
| `omnirush-test` | Test real behavior, error cases, and boundaries. |
| `omnirush-refactor` | Simplify code or migrate an interface with behavior checks. |
| `omnirush-performance` | Measure a slow task, find the cause, and check the improvement. |
| `omnirush-build` | Reproduce and fix build, package, or toolchain failures. |
| `omnirush-review` | Find code problems and show evidence. |
| `omnirush-handoff` | Save progress so the next chat can resume. |

[PROJECT.md](PROJECT.md) holds the goal, current task, and decisions. [AGENTS.md](AGENTS.md) tells the agent how to work. [Prompt examples](docs/PROMPTS.md) help you ask for useful work. [Practice tasks](docs/PRACTICE.md) teach the full work loop. [Plugins](docs/PLUGINS.md) explains the local adapters and optional tools.

[Starter goals](docs/STARTER-GOALS.md) defines what this kit should help users do. [First-use feedback](docs/FEEDBACK.md) helps you record where a user gets stuck and whether a guide change helped.

## Run checks

```sh
npm run check:starter
```

This checks the kit: skill copies, script syntax, and kit tests. It does **not** test your app.

After the setup skill records your app's commands in [starter.config.json](starter.config.json), run:

```sh
npm run check:project
```

An empty config fails with `NOT SET`. This is expected before you build the app. Tests must have a real command. Checks that do not apply need a reason, for example `{"skip": "This project has no compile step."}`. A failed command, timeout, or missing check makes the project check fail. Press `Ctrl+C` to cancel the current check and stop later checks. The runner executes the configured commands through your OS shell. Only use commands from a project you trust.

Reports go to `.starter/last-check.json`, which Git ignores. Reports store results, not terminal logs. A past report does not prove that code changed since then still works.

## Edit the kit

Edit skills in `.agents/skills/`. Run `npm run setup` to update the desktop copies in `.opencode/skills/`. Setup stops if a desktop copy has separate edits. It leaves those edits intact.

Keep the kit files when you add your app. Keep the starter scripts in `package.json` if you change that file. Add normal app scripts such as `dev` and `test` for your chosen stack. Use app checks for the app and starter checks for the kit.

To add the full kit to an existing repo, use a clean branch. Merge the full layout: skills, both plugin files, scripts, starter tests, `starter.config.json`, `PROJECT.md`, and docs. Keep the desktop skill manifest with its copies. Merge package scripts, agent rules, and `.gitignore` rules, including `.starter/`. Keep skill files on LF line endings with suitable `.gitattributes` rules; preserve the app's other file rules. Check file conflicts first. Before storing private inputs, run `git check-ignore .starter/inputs/example.txt` and confirm that it prints the path. The JavaScript plugin and starter tests need ES modules, which are JavaScript files that use `import` and `export`. Preserve the app's current module format and check how the kit files load before running the kit checks.

## Share this starter

The [portable Best practices bundle](docs/APP-BUNDLE.md) lets OmniRush clients
use the same guides in any project, with a local on/off setting.

This is a public GitHub template. Share [omnirush-ai/omnirush-starter](https://github.com/omnirush-ai/omnirush-starter) with new users. They can choose **Use this template → Create a new repository** to start their own project. The repo includes a kit CI workflow for Windows, macOS, and Linux. Add app CI after choosing the app stack.

OmniRush help: [CLI source and install guide](https://github.com/omnirush-ai/omnirush-cli), [desktop source and downloads](https://github.com/omnirush-ai/omnirush-gui), [desktop skills guide](https://github.com/omnirush-ai/omnirush-gui/blob/main/docs/skills-and-mcp.md).
