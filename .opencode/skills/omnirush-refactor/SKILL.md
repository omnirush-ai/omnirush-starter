---
name: omnirush-refactor
description: "Refactor existing OmniRush project code while preserving required behavior. Use for cleanup, module changes, or interface migrations that need caller checks and regression evidence."
---

# Improve code without breaking its use

Keep the user's requested result and the current public behavior clear.
Use [PROJECT.md](../../../PROJECT.md) for accepted behavior and compatibility needs.
See [USAGE.md](../../../docs/USAGE.md) when choosing or combining work guides.

## Find the boundary

- Name the problem the change should solve, such as duplicate rules or a hard-to-change module.
- Inspect the affected code, its callers, exports, and relevant tests before editing.
- Include callers outside the repo when a public API or saved file format is involved.
- Identify behavior that must stay the same and any change the user already requested.
- Check the current diff and keep unrelated edits intact.
- For a small local cleanup, a short scope note is enough. Do not require a formal plan.
- Do not invent a refactor need when the existing code already meets the request.

## Establish useful evidence

- Run the relevant existing checks and record the starting revision and result.
- If behavior lacks coverage and the change could break it, add a focused check first.
- Cover actual inputs and outputs, not the names or structure of private helpers.
- Include the boundary most likely to change, such as errors, defaults, or repeated calls.
- Use repeatable smoke steps when an automated check would add little value.
- Record existing failures separately so they are not hidden or blamed on this change.

## Make a safe change

- Prefer removing duplication and reusing existing code over adding a new layer.
- Preserve the user's stack. Add no dependency unless the requested scope authorizes it.
- Move or replace one connected part at a time when the change crosses module boundaries.
- Update imports, callers, and tests together so each slice remains usable.
- Keep public compatibility until callers can move, or state the authorized breaking change.
- Check saved data, serialization, caches, and migrations if the change touches their format.
- Keep a recovery path for a data migration. Do not use live user data as a test fixture.
- Separate a required behavior change from cleanup so its effect can be checked clearly.
- Use an independent native subagent for a bounded caller search or review when useful and available.
- Give it clear file ownership, preserve others' work, and check its evidence before use.

## Verify the whole affected path

- Run the baseline checks again after the change and compare their behavior.
- Check both sides of a moved interface: the caller and the code it calls.
- Confirm old data can still be read when compatibility is required.
- For an authorized format change, test the migration and the intended recovery path.
- Run relevant configured app checks and inspect their output and exit status.
- Fix failures caused by the change. Keep unrelated failures visible with evidence.
- Stop when the requested cleanup works and the affected behavior is checked.

Finish with what became simpler, which callers or formats changed, and the checks run.
Include the starting evidence, final results, and any compatibility or data gap.
Do not report preserved behavior on a platform or path that was not checked.
