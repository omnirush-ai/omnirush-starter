import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readSkills } from "./starter-lib.mjs";

// Update this reference when the canonical source skills change.
export const SOURCE_COMMIT = "c50f4460fbb99b7d178561ba940ce28f306d898c";

export const SYSTEM_PROMPT = `OmniRush Best practices

Help the user finish the software task they asked for. Use these guides only for relevant project work; keep ordinary chat brief.
- Follow the user's current request and the repository's own instructions. Find the intended app folder and preserve unrelated work.
- Keep the existing stack, tools, model, and account choices. Do not install the starter kit, create its templates, or change global settings unless requested.
- For useful work, choose the relevant omnirush-setup, feature, debug, test, refactor, performance, build, review, handoff, or import-chats guide. Load only the guides needed now.
- Explain unfamiliar choices in small steps. Continue clear, authorized local work without repeated permission questions. Ask when a missing choice changes the result or required authority is absent.
- Define the user-visible result, make a focused change, run the project's real checks, and use the latest feedback to finish the same task. Never call an unrun check passed.
- Use bounded independent agent work only when it helps. Give each agent a clear scope and verify the combined result. Do not create extra turns, code, or calls to meet activity targets.
- Keep raw private notes in their existing private location. Do not copy them into the project for these guides. Use placeholders for secrets; keep passwords, tokens, keys, and private payloads out of committed files, logs, reports, and examples. Do not read private inputs unless the authorized task needs them. Send private material elsewhere only when the user has authorized that action.
- Summarize what changed, what was checked, how to try it, and any real gap. For longer work, use the project's existing notes or handoff location to save the next step.`;

const SETUP_NOTES = `## Keep useful setup notes

Use the project's existing documentation or a short reply to record the goal,
users, scope, stack, first acceptance criteria, exact checks, and remaining gaps.
Create or change a project document only when the task calls for it.
Do not install a starter kit or create starter-specific configuration by default.

- Record each actual check command and its working folder.
- Keep valid failing checks visible; do not replace them with no-op commands.
- Explain checks that do not apply and checks that cannot run.
- A project needs meaningful checks for its changed behavior.
- Use a bounded timeout for long checks and keep incomplete results separate.

Run applicable project checks and read their output and exit status.
Missing, skipped, and failed checks are not passes.

`;

function replaceRequired(text, before, after, name) {
  if (!text.includes(before)) throw new Error(`${name}: canonical wording changed; review the portable adaptation.`);
  return text.replace(before, after);
}

function portableSkill(skill) {
  let body = skill.body
    .replaceAll("[PROJECT.md](../../../PROJECT.md)", "the project's existing goal and setup notes")
    .replace(/^See \[USAGE\.md\]\(\.\.\/\.\.\/\.\.\/docs\/USAGE\.md\).*\n/gm, "")
    .replaceAll("Use [USAGE.md](../../../docs/USAGE.md) when the user is stuck. ", "")
    .replaceAll("the starter repository root", "the parent workspace")
    .replaceAll("Run the applicable configured checks from `starter.config.json`.", "Run the project's applicable check commands from their actual working folders.")
    .replaceAll("Run applicable configured checks from `starter.config.json`.", "Run the project's applicable check commands from their actual working folders.")
    .replaceAll("- Use `npm run check:project` when the starter runner and Node.js are available.\n", "")
    .replaceAll("Keep `PROJECT.md` current for work that spans chats.", "Keep the project's existing notes current for work that spans chats.");
  let description = skill.description.replaceAll("starter project", "software project").replaceAll("starter session", "project session");

  if (skill.name === "omnirush-setup") {
    description = "Set up a new or existing software project. Find the user's goal, current stack, and real project checks before development.";
    body = replaceRequired(body,
      "Read the project's existing goal and setup notes and [starter.config.json](../../../starter.config.json).\nRun `npm run setup` from the starter root when Node.js is available.\nReport a missing runtime as a setup gap; do not silently install it.",
      "Read the repository instructions and existing setup documentation.\nConfirm the required runtime before using it.\nReport a missing runtime as a setup gap; do not silently install it.", skill.name);
    body = body.replaceAll("- Do not count `npm run test:starter` as application validation.", "- Do not count checks for OmniRush guides as application validation.");
    const start = body.indexOf("## Save the project contract\n");
    const end = body.indexOf("If the user also asked to build or fix something", start);
    if (start < 0 || end < 0) throw new Error("Review the setup adaptation before rebuilding.");
    body = body.slice(0, start) + SETUP_NOTES + body.slice(end);
  }
  if (skill.name === "omnirush-test") {
    body = replaceRequired(body,
      "- Update a known wrong check in `starter.config.json`; use `null` if none exists.\n- An application needs a real `checks.test` command. A missing test command remains a gap.\n- Use a reasoned skip for inapplicable lint, typecheck, or build checks; never for tests.\n- Run `npm run check:project` when validating the configured project checks.",
      "- Correct a proven wrong project check using the project's existing configuration.\n- A missing test command remains a gap; use repeatable smoke steps when practical.\n- Explain inapplicable lint, typecheck, or build checks without pretending they passed.\n- Run relevant existing project checks; do not create a separate runner by default.", skill.name);
    body = body.replaceAll("record the gap in `PROJECT.md`", "record the gap in the project's existing notes");
    body = body.replaceAll("Do not substitute the starter's own tests for application tests.", "Do not substitute checks for these guides for application tests.");
  }
  if (skill.name === "omnirush-handoff") {
    description = "Save a resumable software-project handoff. Record the goal, changed files, actual checks, open work, and the next concrete step in the project's existing handoff location.";
    body = replaceRequired(body,
      "Write a concise handoff to [docs/HANDOFF.md](../../../docs/HANDOFF.md).\nRead the project's existing goal and setup notes and the current working tree first.",
      "Read the project's existing notes and the current working tree first.\nUse an existing handoff location or the destination requested by the user.\nIf no file location is agreed, give a concise handoff in the reply.\nDo not create starter templates or copy raw private notes into the project.", skill.name);
  }
  const content = `---\nname: ${skill.name}\ndescription: ${JSON.stringify(description)}\n---\n\n${body.trim()}\n`;
  if (/starter\.config|PROJECT\.md|check:project|test:starter|npm run setup|\]\(\.\.\//.test(content)) {
    throw new Error(`${skill.name}: starter-only assumptions remain in the portable guide.`);
  }
  return { name: skill.name, description, content, sourceSha256: createHash("sha256").update(skill.content).digest("hex") };
}

export function bestPracticesBundle(root) {
  return {
    version: 1,
    source: { repo: "https://github.com/omnirush-ai/omnirush-starter", commit: SOURCE_COMMIT },
    license: readFileSync(join(root, "LICENSE"), "utf8"),
    systemPrompt: SYSTEM_PROMPT,
    skills: readSkills(root).map(portableSkill),
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const file = join(root, "bundles", "best-practices.json");
  const content = `${JSON.stringify(bestPracticesBundle(root), null, 2)}\n`;
  if (process.argv.includes("--check")) {
    if (readFileSync(file, "utf8") !== content) throw new Error("Rebuild bundles/best-practices.json before publishing.");
    console.log("Portable Best practices bundle is current.");
  } else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
    console.log("Prepared bundles/best-practices.json.");
  }
}
