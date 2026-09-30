# Useful prompts

Replace the text in brackets with your task. You can use these in desktop chat. CLI users can also use `/skill:omnirush-feature ...` and the other skill names.

## Start a project

```text
Use omnirush-setup. Build [idea] for [users].
My skill level is [level]. I chose [stack], or help me pick a simple one.
Set up the project, then build one small feature and test it.
Tell me how to start the app.
```

## Add a feature

```text
Use omnirush-feature. Add [behavior].
It is done when [what the user can do or see].
Keep the change small. Test the main case and [important edge case].
```

## Fix a bug

```text
Use omnirush-debug. When I [steps], I get [actual result].
I expect [result]. The error is [exact error text].
Find the cause, fix it, and test that the bug does not return.
```

## Test a feature

```text
Use omnirush-test. Check [feature] against [expected behavior].
Cover empty input, bad input, and the main user flow where they apply.
Run the checks. Show any gap that is still open.
```

## Review changes

```text
Use omnirush-review. Review [files, diff, or branch].
Focus on bugs, missing tests, and effects on existing behavior.
Show the file and evidence for each issue. Do not change code yet.
```

## Save work for later

```text
Use omnirush-handoff. Save the current goal, completed work,
real check results, open problems, and the next step in docs/HANDOFF.md.
```

## Resume

```text
Read PROJECT.md and docs/HANDOFF.md. Check the current files and Git status.
Continue from the next step. Confirm old check results again when needed.
```

## Use your plan well

Give the agent one clear result. Add exact error text and file paths when useful. Keep one chat for one task until it is complete. Save a handoff before moving to a new chat.

Use the model already selected in OmniRush. Use lower effort for simple edits and more effort when a problem needs deeper reasoning. Judge the result by tests and the real user flow. Avoid repeated broad prompts such as `make everything better`.

CLI users can check `/status` and `/usage`. These show the current model and account usage. The starter does not promise a token limit or a plan benefit.
