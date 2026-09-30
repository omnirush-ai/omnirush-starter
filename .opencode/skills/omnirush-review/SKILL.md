---
name: omnirush-review
description: "Review a named change in an OmniRush starter project for bugs, broken behavior, and missing checks. Report actionable findings with evidence; do not edit code unless asked."
---

# Review the requested change

Review the user's named files, diff, branch, or pull request.
Read [PROJECT.md](../../../PROJECT.md) for the expected product behavior.
Keep the review read-only unless the user also requests fixes.

## Establish the scope

- Identify the base and changed revision when reviewing a branch or pull request.
- Read the full changed behavior and enough surrounding code to understand its callers.
- Check existing work so unrelated edits are not attributed to the reviewed change.
- Compare the result with the request and its acceptance criteria.
- If the intended revision cannot be found, state that limit before making claims.

## Look for user-visible failures

- Follow changed inputs through validation, processing, storage, and output.
- Check relevant empty, invalid, error, and repeated-action paths.
- Examine access control or private data boundaries when the change touches them.
- Check interface compatibility and whether callers still use the correct contract.
- Inspect tests for assertions that could catch the likely failures.
- Distinguish a real regression from a possible improvement outside the request.
- Do not demand new abstractions or dependencies for a small working change.

## Verify suspicious behavior

- Use a small local test or reproduction when it can confirm a finding safely.
- Inspect check commands before running them for deploy, delete, or external effects.
- Use an isolated temporary fixture if proving a finding requires test data.
- Record the exact command, result, and revision checked.
- Do not edit tracked files merely to make the review pass.
- Mark findings that depend on unverified assumptions clearly.

## Report findings that can be acted on

For each finding, give the affected file and line, the trigger, the consequence,
and the smallest useful correction. Order findings by impact.

- A blocking finding must explain how the requested behavior breaks.
- Keep optional style suggestions separate from correctness findings.
- Include a summary of checks run and validation gaps.
- If no actionable issue was found, say so and state what the review covered.
- Do not turn "no findings" into a claim that all tests passed.

Finish with whether the reviewed change meets the requested behavior and why.
