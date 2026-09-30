---
name: omnirush-handoff
description: "Save a resumable project handoff for an OmniRush starter session. Record the goal, changed files, actual check results, open work, and the next concrete step in docs/HANDOFF.md."
---

# Save enough to resume work

Write a concise handoff to [docs/HANDOFF.md](../../../docs/HANDOFF.md).
Read [PROJECT.md](../../../PROJECT.md) and the current working tree first.

## Capture current evidence

- Use the user's latest scope and decisions as the current goal.
- Identify the repository, branch, and revision when Git is available.
- Read `git status` and the relevant diff to identify changed files.
- Distinguish your changes from unrelated work already present.
- Use command output from this session for results, not remembered expectations.
- Read an existing handoff before updating it so useful unresolved work survives.
- Keep credentials, tokens, and private payloads out of the handoff.

## Write the handoff

Keep these parts brief and specific:

1. **Goal:** The desired result and acceptance criteria still in scope.
2. **State:** What works now, what is incomplete, and what is blocked.
3. **Files:** Changed paths and the reason for each meaningful change.
4. **Decisions:** Choices that affect the next step and their concrete reasons.
5. **Checks:** Exact commands, working folders, results, and relevant output.
6. **Next step:** One action the next session can start without guessing.

List test, lint, typecheck, and build separately in the checks section.
Use clear states such as passed, failed, missing, skipped, or not run.
Include the cause of each gap and what is needed to close it.
Record manual smoke steps and their observed result when they are the only evidence.
Label stale results with the revision or time they describe.

Include useful failed attempts, the user's latest feedback, and any source conflict
that affects unfinished work. For parallel work, save unresolved agent tasks and
file ownership so the next chat can integrate results without repeating the work.

## Make the next step usable

- Give an exact file, command, or reproduction step where possible.
- Record a running process and how to inspect it if it matters to resuming work.
- Do not stop processes, reset changes, commit, or push just to create a handoff.
- Check that named paths still exist and that the next step follows from current state.
- Do not mark acceptance criteria complete if their checks have not run.
- Do not describe an uncommitted change as merged or a local build as deployed.

Finish with the saved path, current result, and next action.
