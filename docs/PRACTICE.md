# Learn the work loop

Use these tasks after setup. Each task should have a visible result and a check. Use your chosen language and framework.

## 1. Finish one small feature

Choose a small task in your app, such as adding a note or saving one setting.

Ask:

```text
Use omnirush-feature. Add [small behavior].
It must work with normal input. Empty input must show a clear error.
Write useful tests. Run them. Tell me how to try the feature.
```

Try both cases yourself. Check that the tests exercise app behavior rather than only checking that a file or function exists.

## 2. Fix a real failure

Use an error you found during the first task. Give the steps, the actual result, and the result you expected.

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
