---
name: omnirush-setup
description: "Set up this OmniRush starter for a new or existing software project. Capture the goal, users, stack, and real project checks before development."
---

# Set up the project

Make the project goal and its check commands clear enough to start useful work.
Read [PROJECT.md](../../../PROJECT.md) and [starter.config.json](../../../starter.config.json).
Run `npm run setup` from the starter root when Node.js is available.
Report a missing runtime as a setup gap; do not silently install it.

## Learn what is being built

- Read the user's request, repository instructions, and existing project files.
- Find the intended users, the problem to solve, and the first useful result.
- Identify the stack from source files, manifests, and build configuration.
- Keep the user's chosen stack. Do not pick a framework just to fill a blank.
- For an empty project, describe the first user flow before choosing its tools.
- Ask one short question only when a missing answer changes the product or stack.
- State low-risk assumptions and continue work that does not depend on the answer.

## Find the real checks

- Read existing scripts, CI configuration, and project documentation.
- Locate the application root. It can differ from the starter repository root.
- Identify separate test, lint, typecheck, and build commands where they exist.
- Inspect commands before running them for deploy, delete, or other external effects.
- Run available local checks from their actual working folders.
- Record each result and any missing tool or service needed to run it.
- Keep a failing but valid command configured. Its failure is useful evidence.
- Do not count `npm run test:starter` as application validation.
- Do not invent a check or install dependencies only to make all four slots green.

## Save the project contract

Update `PROJECT.md` with the goal, users, scope, stack, and first acceptance criteria.
Include setup needs, exact local commands, and known validation gaps.
Update `starter.config.json` without removing unrelated settings.

- Keep `version` at `1`.
- Set `project.name`, `project.goal`, and `project.stack` from current evidence.
- Keep the keys `checks.test`, `checks.lint`, `checks.typecheck`, and `checks.build`.
- Each configured check has `command`, `cwd`, and `timeoutMs`.
- Use the verified shell command and a working folder relative to the repository root.
- Use `120000` milliseconds unless the measured check needs a different timeout.
- Use `{ "skip": "reason this does not apply" }` for inapplicable lint, typecheck, or build checks.
- Use `null` only for an unresolved check gap. Explain that gap in `PROJECT.md`.
- Once an application exists, `checks.test` needs a real application test command.
- Never use a skip value or the starter's test command to hide missing application tests.

Run `npm run check:project` after saving the configuration, if Node.js is available.
Read all four reported states. Missing, skipped, and failed checks are not passes.

Finish with the project goal, checks that ran, remaining gaps, and the first next step.
