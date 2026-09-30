# Learn the work loop

Use these tasks on your own project after setup. Each task should have a visible result and a check. Use your chosen language and framework. A disposable copy is useful when you are still learning.

## Start with real context

Ask the agent to inspect the relevant code, describe the current user flow, and find the app checks. Give it a real task you want to finish. Save the expected result in `PROJECT.md`.

If you have meeting notes, point to the needed sections. Check that the agent keeps agreed needs separate from suggestions and open choices.

## 1. Finish one small feature

Choose a small task in your app, such as adding a note or saving one setting.

Ask:

```text
Use omnirush-feature. Add [small behavior].
It must work with normal input. Empty input must show a clear error.
Write useful tests. Run them. Tell me how to try the feature.
```

Try both cases yourself. Check that the tests exercise app behavior rather than only checking that a file or function exists. Give the agent the steps and exact result when your attempt differs from the expected result. Continue until the requested behavior works or a specific gap is explained.

## 2. Fix a real failure

Use an error you found during the first task, or a real bug already reported in your project. Give the steps, the actual result, and the result you expected. If both flows work, move on to review.

Ask:

```text
Use omnirush-debug. Reproduce [failure] with [steps].
Add a test that fails before the fix and passes after it.
Fix the cause. Run the relevant tests and project checks.
```

Look for evidence of the failure and the fix. A test that already passed before the fix cannot prove that this bug was covered.

## 3. Review and resume

Ask the agent to review the diff with `omnirush-review`. Fix confirmed issues. Then use `omnirush-handoff` to save progress.

Open a new chat. Ask it to read `PROJECT.md` and `docs/HANDOFF.md` and continue. The new chat should know the goal, the commands, the check results, and the next step.

## 4. Try a larger task when your project needs one

- Refactor a hard-to-change module. Check that its callers still get the same required results.
- Improve a slow operation. Use the same real input for repeated before and after measurements.
- Fix a failing build or package command. Repeat the original command on the affected platform.

For work with independent parts, let a native subagent inspect a caller, design checks, or review the change. Give it a clear scope. Check that the main agent uses its evidence and verifies the combined result.

Finish when the task is complete and checked. The work determines how many steps it needs.

## Observe first use

Watch a new user attempt one of these tasks. Record the exact point where they get stuck in [FEEDBACK.md](FEEDBACK.md). Improve that part of the guide, then repeat the step. Keep raw private notes outside shared docs.

## What a useful test checks

| Behavior | Useful check |
| --- | --- |
| Save data | Read it back and compare the user's result. |
| Reject bad input | Check the error and that no bad data was saved. |
| Use a limit | Check just below, at, and just above the limit. |
| Handle a failed request | Check the user's error state and retry behavior. |
| Protect existing work | Run the relevant old tests along with the new ones. |

Use small tests for logic. Add an integration test when parts must work together. Use a browser check for an important web flow. Avoid making every small task run every expensive check.

## Configure app checks

In `starter.config.json`, keep `test`, `lint`, `typecheck`, and `build`. Use a real command for each applicable check. Examples of individual entries:

```json
{ "command": "python -m pytest", "cwd": ".", "timeoutMs": 120000 }
```

```json
{ "command": "npm test", "cwd": "apps/web", "timeoutMs": 120000 }
```

For an inapplicable check:

```json
{ "skip": "This JavaScript project does not have a type-check step." }
```

These are examples, not installed tools. Verify that the chosen commands exist and test your app. `test` cannot be skipped. Leave a missing command as `null` until the gap is resolved. The kit does not add tools or mark empty test suites useful on your behalf.

Run `npm run check:project`. A pass means the configured commands passed in that run. It does not prove that the test suite covers all required behavior. Read the tests and try the user flow as well.
