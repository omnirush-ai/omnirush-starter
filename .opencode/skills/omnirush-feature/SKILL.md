---
name: omnirush-feature
description: "Build a requested feature in an OmniRush starter project. Turn the user outcome into acceptance criteria, implement the smallest complete flow, and verify it."
---

# Build one useful feature

Read [PROJECT.md](../../../PROJECT.md) and the instructions for the affected code.
Use the existing stack and conventions.

## Define the result

- Turn the request into observable acceptance criteria before editing.
- Describe who takes the action, what they do, and what they should see.
- Include the relevant empty, invalid, or failure state.
- Keep the criteria within the user's request. Do not add a product roadmap.
- For a small change, a few sentences are enough. Do not require a formal plan.
- Ask only when an unresolved choice changes the requested behavior materially.
- Use the relevant supplied source when requirements come from notes. Keep suggestions and open conflicts distinct from agreed behavior.

Example: "A user can save a note, reopen it, and see the same text. An empty note shows a clear error."

## Follow the existing flow

- Inspect the affected entry point, data flow, and existing tests.
- Read `git status` and the relevant diff to preserve unrelated work.
- Use existing components and utilities before adding new ones.
- Keep each step usable from the real interface to the real result.
- Do not claim a feature is complete because a button or endpoint exists alone.
- If the requested flow stores data, verify that data can be read back.
- Keep temporary mocks separate from claims about real application behavior.
- For substantial work, use a bounded independent investigation, test design, or review when a native subagent can help. Give each agent a clear scope and integrate its evidence.
- Explain a needed choice in small steps. Continue clear local implementation and checks after the explanation.
- Add a dependency only when the requested application needs it and user scope permits it.

## Prove the behavior

- Add or update a test when it protects meaningful behavior changed by this feature.
- Test the user's outcome and the relevant boundary, not the code's internal shape.
- Use a direct smoke check for a low-impact change when a new test adds little value.
- Run the smallest check that proves each acceptance criterion.
- Run the applicable configured checks from `starter.config.json`.
- Use `npm run check:project` when the starter runner and Node.js are available.
- Report test, lint, typecheck, and build states explicitly, including missing checks.
- If a check fails, resolve failures caused by this change and rerun that check.
- If a failure is unrelated, give evidence and keep it visible in the result.
- Try the real user flow when possible. Use the user's latest feedback to fix unmet criteria in this same task. Keep `PROJECT.md` current for work that spans chats.

Finish with what works, how it was checked, and any criterion still unmet.
Name the changed files and the exact commands that produced the evidence.
Do not call an unrun check passed.
