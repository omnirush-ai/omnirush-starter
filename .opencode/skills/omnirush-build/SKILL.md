---
name: omnirush-build
description: "Diagnose and repair a failing build, typecheck, package step, or toolchain setup in an OmniRush project. Reproduce the exact command, isolate the cause, and verify the intended output."
---

# Repair the failing build

Start from the user's latest failing command and useful error output.
Use [PROJECT.md](../../../PROJECT.md) for the required setup and target platform.
See [USAGE.md](../../../docs/USAGE.md) when choosing or combining work guides.

## Capture the failure

- Record the exact command, working folder, revision, and first relevant error.
- Record the operating system, architecture, runtime, package manager, and build tool versions.
- Check the relevant configuration and whether installed dependencies match the lockfile.
- Check the current diff and preserve unrelated work.
- Reproduce in the same relevant environment before claiming a cause.
- Keep credentials and private data out of logs and reports.
- If the target platform is unavailable, state that limit and investigate the files locally.
- Do not invent a failure or force a build step on a project that does not need one.

## Isolate the cause

- Decide whether evidence points to source code, a dependency, the toolchain, or configuration.
- Trace the first useful error; later errors may be caused by the same failure.
- Inspect the relevant script and official tool documentation when its behavior is unfamiliar.
- Use a small local experiment to test the suspected cause before changing more files.
- Compare required and installed versions rather than upgrading everything at once.
- Treat missing external access or credentials as a specific gap, not a proven code defect.
- Use an independent native subagent for bounded log analysis or platform review when useful and available.
- Give it a clear read or write scope and check its evidence before applying a result.

## Repair the affected part

- Make the smallest repair supported by the failure evidence.
- Keep the user's stack, account, and model choice. Avoid changing global setup.
- Add or replace dependencies only when the requested scope authorizes that change.
- Use the existing package manager and keep dependency changes consistent with its lockfile.
- Do not silence errors, disable required checks, or replace a failing command with a no-op.
- Avoid deleting unrelated files or broad cache resets as a first step.
- When stale generated output is proven relevant, clear only that known output and rebuild.
- Keep platform-specific settings limited to the affected target.

## Prove the repair

- Rerun the original command in the recorded environment and inspect its exit status.
- Confirm the expected artifact or output exists and can be used where practical.
- Run the nearest related build or package check that could expose a regression.
- Run relevant app tests when source behavior changed.
- Update an incorrect configured check only when the new command matches the real project.
- Report test, lint, typecheck, and build results, including unavailable or unrun checks.
- Label every target platform that was not tested.
- A local build does not prove release signing, deployment, or a user flow works.
- Stop when the original failure is resolved and the affected output is checked.

Finish with the cause, focused repair, exact commands, and verified target platform.
Keep any remaining toolchain, access, or platform gap explicit.
Do not call a proposed repair verified until the original reproduction passes.
