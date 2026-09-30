# What this starter should do

Help people use OmniRush to finish useful software work in their own projects. Teach the steps as the agent does the work.

## Required results

- A new user can open the intended project, describe a goal, and start one useful task.
- The agent uses the existing code and the user's chosen stack and account.
- The user can choose a guide for features, bugs, tests, refactors, performance, build failures, reviews, or handoffs.
- Work produces a change, a measured result, or a clearly reproduced issue with an actionable next step.
- The agent checks real behavior and reports the evidence and any gap.
- A user who gets stuck receives a small, concrete recovery step.
- Another chat can resume from saved decisions, working commands, and open work.
- Skills and local plugins work in both supported OmniRush engines.

## How the agent should work

Read the relevant code. Define the user's result. Make the needed decisions. Implement the change. Check it. Use new evidence to fix failures. Explain unfamiliar ideas in small steps.

Scale work to the task. Use parallel agents for useful independent parts. Keep ownership clear and check the combined result. Load only the guides and source sections needed for current work.

Use actual progress and observable behavior as the measure of success. Keep repo size, turn count, and token use out of the user's acceptance criteria unless their own task requires such a measure.

## Check whether the starter helps

1. Use the guides on a concrete task in a disposable project or a user's authorized project.
2. Check that the app outcome works and its tests could catch a real failure.
3. Save a handoff and verify that another chat can resume.
4. Observe a first-time user, record where they get stuck, improve the relevant guide, and repeat that step.

Kit tests prove that files, routing, and checks work. Guided task tests give evidence about agent behavior. First-time user feedback gives evidence about usability. Report these results separately.

The starter controls project guidance and local helpers. Account access, subscription terms, usage grants, and session recording belong to OmniRush. The starter uses the user's current choices for those services.
