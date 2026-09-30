---
name: omnirush-performance
description: "Measure and improve a reported speed, memory, or resource problem in an OmniRush project. Use a real workload, a recorded baseline, and fair comparisons to prove the result."
---

# Improve a measured bottleneck

Start from the slow or costly action the user actually needs to improve.
Use [PROJECT.md](../../../PROJECT.md) for the user's goal and required behavior.
See [USAGE.md](../../../docs/USAGE.md) when choosing or combining work guides.

## Choose what to measure

- Define the real workload: action, input size, data, and relevant user conditions.
- Choose a useful metric, such as elapsed time, peak memory, or requests per second.
- Record its units and what success would mean for this task.
- Keep the user's existing runtime, account, and model choice.
- Check the current diff and preserve unrelated work.
- If there is no demonstrated performance problem, measure before proposing a rewrite.
- Use a local or isolated workload when a benchmark could change live data or services.

## Record the baseline before edits

- Save the exact command or steps, revision, runtime, platform, and relevant settings.
- Keep input data and workload size fixed for the comparison.
- State whether the test uses a cold start or a warm cache. Match the real use case.
- Repeat the measurement enough to see normal variation; keep the individual results.
- Use the same summary for both versions, such as the median of repeated runs.
- Note competing work or outside services that can make the result noisy.
- Set a cutoff before a costly measurement. Stop at that limit and keep incomplete runs separate from completed samples.
- Save a reproducible command or small benchmark when it will be used again.
- Run a relevant functional check so speed is not compared across broken behavior.

## Find and change the costly part

- Profile or trace the measured path with existing tools before choosing an edit.
- Identify where time or memory is spent and test the likely cause with a small experiment.
- Change the smallest part that explains the measured cost.
- Reuse existing tools and dependencies unless the user authorized a new dependency.
- Keep correctness, error handling, and the required output intact.
- Check whether caching or batching changes freshness, memory use, or response order.
- Use an independent native subagent for bounded profiling or review when useful and available.
- Give it a clear scope and integrate its measurements without overlapping edits.

## Compare fairly

- Repeat the baseline workload on the changed revision with the same environment and data.
- Record both revisions; compare only the intended change and disclose other differences.
- Use the same warmup, measurement method, units, and summary for both runs.
- If the environment changed, rerun a comparable baseline or label the result uncertain.
- On a noisy shared host, a bounded alternating before/after run can reduce order bias. If comparable runs cannot finish, report an inconclusive result and the next useful measurement.
- Report the before and after values, absolute difference, and percentage when meaningful.
- Keep normal variation visible. A result inside that variation is not a proven improvement.
- Run relevant functional checks and an adjacent workload that could become worse.
- Revert an ineffective trial without discarding unrelated work.
- Stop once the requested target is met or evidence shows the remaining limit.

Finish with the workload, bottleneck, exact measurement steps, and observed result.
State tradeoffs and untested conditions. Do not generalize beyond the measured workload.
If no reliable gain was found, say so and report the evidence.
