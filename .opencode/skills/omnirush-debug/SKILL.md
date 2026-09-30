---
name: omnirush-debug
description: "Find and fix a reported bug in an OmniRush starter project. Reproduce the failure, identify its cause, make a focused fix, and check for regression."
---

# Fix a bug with evidence

Start from the user's latest error, logs, or reproduction steps.
Read [PROJECT.md](../../../PROJECT.md) for the expected behavior and local setup.

## Reproduce the failure

- Write down the expected result and the actual result.
- Find the smallest input or user action that shows the difference.
- Use the same relevant runtime, configuration, and data as the failing case.
- Capture the exact failing command or steps and the useful error output.
- Keep passwords, tokens, and private user data out of logs and reports.
- When reproduction is blocked, state the missing input or service precisely.
- Continue with useful local investigation while avoiding claims of a proven cause.

## Find the cause

- Trace the failing action through the affected code and its callers.
- Separate observed facts from guesses.
- Test one plausible cause with a small experiment before changing more code.
- Check recent edits, configuration, and dependency usage when the evidence points there.
- Use current logs to update the diagnosis instead of defending an earlier guess.
- Stop broad searching when the failing behavior and its cause are explained.

## Make a focused fix

- Read the relevant diff and preserve unrelated work.
- Add a regression test that fails for the original bug when practical.
- Use an existing test tool. Do not add dependencies just to reproduce the error.
- For a UI or environment bug without a suitable test harness, save repeatable smoke steps.
- Change the smallest part that causes the failure.
- Avoid broad rewrites or unrelated cleanup during the repair.

## Verify the repair

- Repeat the original reproduction and check the expected result.
- Run the regression test and a relevant neighboring case.
- Run applicable configured checks from `starter.config.json`.
- Report test, lint, typecheck, and build states, including checks not available or not run.
- If the fix cannot be verified, describe the remaining gap and next concrete check.
- Do not treat disappearing error text alone as proof that the user's task now works.

Finish with the cause, the fix, and the commands or steps that prove the result.
Distinguish a verified repair from a proposed fix.
