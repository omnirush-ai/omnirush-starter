# Use OmniRush on your project

Start with a result that matters to you. Open the folder that contains the app. Give the agent enough context to find and check that result.

## First session

```text
Use omnirush-setup. I want [result] for [users].
My skill level is [level]. Read this project before choosing tools.
Keep the stack I already use. Help me choose one if the project is empty.
Finish one useful change and check it. Explain new ideas in small steps.
Tell me what works and how to try it.
```

The agent should find the real project folder, learn the goal, and run the checks that exist. It should save the goal and working commands in `PROJECT.md` and `starter.config.json`.

Try the result in your app. A useful session leaves a working change or a clearly reproduced problem with an exact next check.

## Give useful feedback

Stay with the task while you try the result. If it fails, give the action, expected result, actual result, exact error, and relevant file path.

```text
I tried [steps]. I expected [result], but got [actual result].
The error is [exact text]. Use omnirush-debug to fix it and repeat the check.
```

If the agent only described a solution, ask it to make the change and run the check. If a check passed but the app still fails, show the failing user flow. That check may cover the wrong behavior.

One complete pass can be enough for a small edit. A larger task may need investigation, decisions, changes, tests, and recovery from real failures. Let the task set the amount of work.

## Choose a guide

Use `omnirush-feature` for new behavior, `omnirush-debug` for wrong behavior, `omnirush-test` for checks, and `omnirush-review` for a change review.

- Use `omnirush-refactor` to change code structure or migrate an interface while keeping required behavior.
- Use `omnirush-performance` when a real task is slow or uses too much memory. Name the task and the measure you want to improve.
- Use `omnirush-build` when a build, package, or CI command fails. Give the command, platform, and error.

The agent can select a skill from a plain request. You can also name it yourself. [PROMPTS.md](PROMPTS.md) has examples.

## Use notes and subagents well

For meeting notes, point to the relevant files or sections. Ask the agent to separate agreed needs, suggestions, and open questions. Keep the active task and decisions in `PROJECT.md`. Keep private raw notes in their current private location. You can also use `.starter/inputs/` after `git check-ignore .starter/inputs/example.txt` prints that path. When adding the kit to an existing repo, merge its ignore rules first.

A subagent is another agent that works on a small part of the task. It can investigate a separate cause, design checks, or review a change while the main agent works. Each agent needs a clear question and file scope. The main agent must read its results and check the combined work.

Use subagents when the work has useful independent parts. Each extra agent should help reach the result.

## When you get stuck

| What happened | What to ask OmniRush to do |
| --- | --- |
| It sees the wrong project or says this is not a Git repo | Check `pwd`, nearby project files, and `git status`. Find the intended app folder before editing. |
| `npm run setup` cannot run | Check `node --version` and `npm --version`. Identify the missing or old runtime and give the setup step for your OS. |
| A desktop skill is missing | Run setup, check `.opencode/skills/`, and restart the workspace engine. CLI users can use `/reload`. |
| `check:project` says `NOT SET` | Find real app checks. Keep each missing check visible until it is available. |
| A check fails | Read the first useful error, reproduce it, and fix the cause. Keep old failures visible. |
| Kit checks pass but the app fails | Run app checks and repeat the failing user flow. `check:starter` checks the kit files. |
| A command is hanging | Cancel it with `Ctrl+C`, then inspect the cause before running it again. |
| Login, usage, or a provider request fails | Check the current OmniRush account status and exact error. Keep account settings in OmniRush. Remove secrets from shared error text. |
| The task needs a new chat | Save `docs/HANDOFF.md` with the goal, evidence, open work, and next step. Resume from that file. |

Add a tool or plugin when you can name the missing capability. [PLUGINS.md](PLUGINS.md) explains the choices.

## Learn from first use

Watch where a new user gets stuck. Record the step, expected result, observed result, and guide change that helped in [FEEDBACK.md](FEEDBACK.md). Repeat the same step after the guide changes.

Before a new chat, use `omnirush-handoff`. Save useful context so the next chat can start from current files and evidence.
