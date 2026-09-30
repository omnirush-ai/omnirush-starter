# OmniRush project rules

Help the user build the project they asked for. Read `PROJECT.md` and the relevant files before making changes. Follow more specific instructions in app folders.

## First use

When the project goal or app checks are not set, use the `omnirush-setup` skill. Run `npm run setup` to prepare desktop skills. Learn the user's goal and current stack before creating app code. Make reasonable choices for small, reversible details. Ask one short question only when missing information would change the product or cause a hard-to-reverse change.

## Pick the useful skill

- New project or setup: `omnirush-setup`.
- New behavior: `omnirush-feature`.
- Broken behavior: `omnirush-debug`.
- Test work: `omnirush-test`.
- Code review: `omnirush-review`.
- Save or resume progress: `omnirush-handoff`.

Read the skill's `SKILL.md` when it applies. Canonical skills are in `.agents/skills/`. Desktop copies are in `.opencode/skills/`. Load only the skills needed for the task.

## Do the work

- Start with a short note: the result you will produce and the first step.
- Keep each change tied to a user need and a way to check it.
- For a bug, reproduce it first and add a test for that failure when practical.
- For new behavior, test a normal case and the relevant error or boundary case.
- Use the project's patterns and tools. Check official docs when an API is unfamiliar.
- Keep changes small. Do not change unrelated files or discard other people's work.
- Avoid new dependencies when the current tools can do the job.
- Do not add a full workflow or a large plan for a small edit.
- Finish clear local edit, test, and fix steps without permission handoffs.
- Use independent subagents only when they improve the work. Give each one a clear scope.

## Prove the result

`npm run check:starter` tests this kit. It does not test the app.

Record actual app checks in `starter.config.json`. Use `npm run check:project` after changing the app. A `null` check is an unresolved gap. A skip needs a specific reason and cannot replace app tests. Never call an unrun check passed. If existing checks already fail, state that fact and check whether your change made them worse.

Also try the changed user flow. For a web app, use a real browser when one is available. If no browser tool is available, describe the exact manual check and the gap. A successful build alone does not prove that a user flow works.

## Keep context and access clear

Save accepted decisions in `PROJECT.md`. Use `docs/HANDOFF.md` for work that needs another chat. Keep these notes short and current.

Use the user's existing OmniRush account and model choice. Do not put login tokens, provider keys, or private app data in this repo. Do not change global account settings as part of project setup. Keep required secrets in local environment files and put only empty examples in `.env.example`.

Do not publish, deploy, send messages, delete user data, or change live services unless the user asked for that action. Existing permission for an action remains valid; do not ask for it again.

## Report to the user

Use short sentences and common words. Say what changed, which checks ran, and how to try it. Include any real gap. Explain a required technical term in plain words. End when the requested result is complete and checked.
