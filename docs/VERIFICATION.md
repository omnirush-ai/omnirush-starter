# Kit verification

Checked on 2026-09-30 on macOS Apple Silicon.

## Local checks

- Nine canonical skills passed the skill-creator frontmatter validator.
- `npm run setup` prepared all nine desktop skill copies.
- `npm run check:starter` passed all 24 kit tests, script syntax checks, and skill copy checks.
- After the performance trial suggested a measurement cutoff, the guide was updated and all eight routing and skill-sync tests passed again.
- All 29 Markdown files had valid local links. `git diff --check` passed.
- The kit tests cover failed commands, missing checks, timeouts, cancellation, stopping child processes, working folders with spaces, stale reports, skill copy conflicts, and both plugin adapters.
- `npm run check:project` on the blank config failed with four `NOT SET` states. This is the intended result before an app is set up.

## Engine checks

The actual OmniRush CLI core (`@earendil-works/pi-coding-agent` source version `0.86.1`) loaded the CLI extension and all nine skills with zero loader errors or skill warnings. The `/starter help`, `status`, `refactor`, `performance`, and `build` handlers worked with `triggerTurn: false`. The smoke test ran on Node.js `25.6.0` and made no model or network request.

The actual desktop OpenCode sidecar (`v2.0.18`) loaded all nine skills and both `starter_status` and `starter_guide` tools. The test used an isolated home folder and local server. It used no account login or model request. Plugin tools also passed direct result-format and routing tests for all nine guides.

The desktop skill list can be empty while plugins start. The final runtime smoke test waited for the catalog to load. Earlier local attempts timed out under heavy host load; the bounded retry passed. This is separate from a plugin or skill error.

## Skill behavior check

An independent agent used setup, feature, test, and handoff guides in a disposable notes CLI. Seven real CLI-process tests ran before the feature; five failed. After the change, all seven passed. The agent verified save, read-back in a new process, and rejection of blank input without changing saved notes. An unrelated user file stayed unchanged. One configured run timed out under load; a targeted Node.js 24 run and the final configured check passed.

Another independent agent used `omnirush-performance` on a disposable order report. A profile and operation trace found repeated whole-input scans. The agent changed aggregation to one pass, passed all five app tests, and passed four comparisons with the original output. It preserved unrelated notes. The timing comparison remained inconclusive because heavy, changing host load prevented a comparable alternating run. The guide gained a bounded measurement and inconclusive-result example from that feedback.

A fresh agent resumed the notes fixture using only its files and handoff. Seven new CLI processes verified save, read-back, append, trimming, and rejection of empty or missing text. All 53 existing files stayed unchanged. This resume trial used direct checks and did not rerun the full configured suite.

These are simulated agent trials. They give evidence for the tested workflows, not for every skill across all projects or for first-time human usability. No trial added a dependency, used a network service, or changed account settings.

## Limits

Native Windows and Linux runs were not performed locally. The [GitHub CI workflow](https://github.com/omnirush-ai/omnirush-starter/actions/workflows/starter-checks.yml) runs six jobs: Windows, macOS, and Linux on Node.js 22 and 24. Open that page for the latest results. Local kit checks ran on Node.js `24.16.0`.

The desktop plugin targets OpenCode 2.x. A full signed-in desktop chat and subscription use have not been exercised by these tests. No app stack, provider, or subscription plan is configured by this template.

[FEEDBACK.md](FEEDBACK.md) remains an empty template for a real first-time user trial. The starter does not claim a measured change in adoption, usage quality, or subscription value.

CI action pins were checked against the official [checkout](https://github.com/actions/checkout) and [setup-node](https://github.com/actions/setup-node) repos. The workflow uses read-only repository access, disables persisted checkout credentials, and does not cache or install kit dependencies.
