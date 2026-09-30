import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { findStarterRoot, parseSkill, readSkills, workflowGuide, WORKFLOWS } from "../scripts/starter-lib.mjs";
import { bestPracticesBundle } from "../scripts/bundle-best-practices.mjs";
import { syncSkills } from "../scripts/sync-skills.mjs";
import { fixture, REPO } from "./helpers.mjs";

test("the portable app bundle is current and every guide loads without starter-only files", () => {
  const raw = readFileSync(join(REPO, "bundles/best-practices.json"), "utf8");
  const bundle = JSON.parse(raw);
  assert.equal(raw, `${JSON.stringify(bestPracticesBundle(REPO), null, 2)}\n`);
  assert.deepEqual(bundle.skills.map((skill) => skill.name).sort(), WORKFLOWS.map((name) => `omnirush-${name}`).sort());
  for (const skill of bundle.skills) {
    assert.equal(parseSkill(skill.content, skill.name).description, skill.description);
    assert.doesNotMatch(skill.content, /starter\.config|PROJECT\.md|check:project|test:starter|npm run setup|\]\(\.\.\//);
  }
  assert.match(bundle.license, /Permission is hereby granted/);
});

test("every workflow is available from the canonical catalog", (t) => {
  const root = fixture(t);
  assert.deepEqual(readSkills(root).map((skill) => skill.name).sort(), WORKFLOWS.map((name) => `omnirush-${name}`).sort());
  for (const workflow of WORKFLOWS) assert.ok(workflowGuide(root, workflow).length > 300);
  assert.throws(() => workflowGuide(root, "../outside"), /Choose a workflow/);
});

test("desktop setup copies all skills and can run twice", (t) => {
  const root = fixture(t);
  assert.equal(syncSkills(root), WORKFLOWS.length);
  assert.equal(syncSkills(root), WORKFLOWS.length);
  assert.equal(syncSkills(root, { checkOnly: true }), WORKFLOWS.length);
  for (const skill of readSkills(root)) {
    assert.equal(readFileSync(join(root, ".opencode/skills", skill.name, "SKILL.md"), "utf8"), skill.content);
  }
});

test("an unchanged generated copy updates when canonical instructions change", (t) => {
  const root = fixture(t);
  syncSkills(root);
  const canonical = join(root, ".agents/skills/omnirush-feature/SKILL.md");
  const updated = `${readFileSync(canonical, "utf8")}\nAn added project instruction.\n`;
  writeFileSync(canonical, updated);
  assert.throws(() => syncSkills(root, { checkOnly: true }), /out of date/);
  syncSkills(root);
  assert.equal(readFileSync(join(root, ".opencode/skills/omnirush-feature/SKILL.md"), "utf8"), updated);
});

test("setup preserves separate desktop edits and prevents partial updates", (t) => {
  const root = fixture(t);
  syncSkills(root);
  const desktop = join(root, ".opencode/skills/omnirush-test/SKILL.md");
  const custom = `${readFileSync(desktop, "utf8")}\nKeep this user's custom instruction.\n`;
  writeFileSync(desktop, custom);
  const canonical = join(root, ".agents/skills/omnirush-debug/SKILL.md");
  writeFileSync(canonical, `${readFileSync(canonical, "utf8")}\nNew source instruction.\n`);
  const untouched = readFileSync(join(root, ".opencode/skills/omnirush-debug/SKILL.md"), "utf8");
  assert.throws(() => syncSkills(root), /desktop skill was edited/);
  assert.equal(readFileSync(desktop, "utf8"), custom);
  assert.equal(readFileSync(join(root, ".opencode/skills/omnirush-debug/SKILL.md"), "utf8"), untouched);
});

test("the project root is found from nested folders but not across a Git boundary", (t) => {
  const root = fixture(t);
  const nested = join(root, "app/src");
  mkdirSync(nested, { recursive: true });
  assert.equal(findStarterRoot(nested), root);
  mkdirSync(join(nested, ".git"));
  assert.throws(() => findStarterRoot(nested), /No starter.config.json/);
});
