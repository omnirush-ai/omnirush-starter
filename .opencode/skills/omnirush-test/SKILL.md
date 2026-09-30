---
name: omnirush-test
description: "Add or run meaningful tests for an OmniRush starter project. Check user behavior and important boundaries with the existing test tools, and report actual coverage gaps."
---

# Test behavior that matters

Read [PROJECT.md](../../../PROJECT.md), the requested behavior, and nearby tests.
Choose checks that could catch a real mistake in that behavior.

## Choose the cases

- Identify the public input, action, and observable result.
- Test the main successful case and the boundary most likely to fail.
- Include invalid, empty, missing, or repeated input when it affects the contract.
- For a fixed bug, use the smallest case that exposed the original failure.
- For stored data, check read-back or persistence when the feature requires it.
- For access control or payments, check the relevant rejection path as well as success.
- Do not add unrelated cases only to raise a coverage percentage.
- Tie each case to the task's acceptance criteria. A substantial change can benefit from an independent native subagent identifying missing cases; check its evidence before adding them.

## Use the right level

- Reuse the project's test runner, helpers, and conventions.
- Use a unit test for a pure rule and an integration test for connected behavior.
- Use a browser or manual smoke check when the visible interaction is the contract.
- Mock only boundaries that the test does not need to prove.
- Do not mock the behavior under test and then report that the real flow passed.
- Avoid assertions on private helper calls, file wording, or the implementation's shape.
- Keep time, random values, and shared state controlled when they affect the result.
- Add a test dependency only when the requested application needs it and user scope permits it.

## Run and read the result

- Confirm that the test command discovers the new or changed cases.
- For a regression test, confirm it detects the old failure when feasible.
- Run targeted tests first, then the related suite when the change needs it.
- Inspect failures and exit status. A command that ran zero tests proves no test cases.
- Keep skipped tests visible and explain any required service or fixture that is absent.
- Update a known wrong check in `starter.config.json`; use `null` if none exists.
- An application needs a real `checks.test` command. A missing test command remains a gap.
- Use a reasoned skip for inapplicable lint, typecheck, or build checks; never for tests.
- Run `npm run check:project` when validating the configured project checks.
- Report test, lint, typecheck, and build states separately.

If no test tool exists, use repeatable smoke steps and record the gap in `PROJECT.md`.
Do not substitute the starter's own tests for application tests.

Finish with the behavior checked, exact commands, results, and important gaps.
