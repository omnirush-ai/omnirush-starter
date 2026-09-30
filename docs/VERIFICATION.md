# Kit verification

Checked on 2026-09-30 on macOS Apple Silicon.

## Local checks

- Six canonical skills passed the skill-creator frontmatter validator.
- `npm run setup` prepared all six desktop skill copies.
- `npm run check:starter` passed all 24 kit tests, script syntax checks, and skill copy checks.
- The kit tests cover failed commands, missing checks, timeouts, cancellation, stopping child processes, working folders with spaces, stale reports, skill copy conflicts, and both plugin adapters.
- `npm run check:project` on the blank config failed with four `NOT SET` states. This is the intended result before an app is set up.

## Engine checks

The actual OmniRush CLI core (`@earendil-works/pi-coding-agent` source version `0.86.1`) loaded the CLI extension and all six skills with zero loader errors or skill warnings. The `/starter help` and `/starter status` handlers worked with `triggerTurn: false`.

The actual desktop OpenCode sidecar (`v2.0.18`) loaded all six skills and both `starter_status` and `starter_guide` tools. The test used an isolated home folder and local server. It used no account login or model request. Plugin tools also passed direct result-format tests.

The desktop skill list can be empty while plugins start. The runtime smoke test waited for the catalog to load. This is separate from a plugin or skill error.

## Skill behavior check

An independent agent used `omnirush-debug` in a disposable cart app. It reproduced a wrong subtotal, added three tests that failed before the fix, fixed the cause, and passed all five app tests. It kept an unrelated user file unchanged. It did not add a dependency or make a network request.

This proves one useful debug workflow. It is not a measurement of every skill across all projects.

## Limits

Native Windows and Linux runs have not been performed locally. The included CI workflow has six jobs: Windows, macOS, and Linux on Node.js 22 and 24. It has not run on GitHub yet. Local kit checks ran on Node.js `24.16.0`.

The desktop plugin targets OpenCode 2.x. A full signed-in desktop chat and subscription use have not been exercised by these tests. No app stack, provider, or subscription plan is configured by this template.

CI action pins were checked against the official [checkout](https://github.com/actions/checkout) and [setup-node](https://github.com/actions/setup-node) repos. The workflow uses read-only repository access, disables persisted checkout credentials, and does not cache or install kit dependencies.
