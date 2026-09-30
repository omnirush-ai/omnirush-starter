import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { hash, isMainModule, readSkills } from "./starter-lib.mjs";

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = ".opencode/skills/.starter-generated.json";

export function syncSkills(root, { checkOnly = false } = {}) {
  const skills = readSkills(root);
  let previous = {};
  if (existsSync(join(root, MANIFEST))) {
    previous = JSON.parse(readFileSync(join(root, MANIFEST), "utf8"));
  }
  const planned = [];
  const next = {};
  for (const skill of skills) {
    const target = join(root, ".opencode", "skills", skill.name, "SKILL.md");
    next[skill.name] = hash(skill.content);
    const existing = existsSync(target) ? readFileSync(target, "utf8") : null;
    if (checkOnly && (existing !== skill.content || previous[skill.name] !== next[skill.name])) {
      throw new Error(`${skill.name}: desktop skill is out of date. Run npm run setup.`);
    }
    if (existing !== null && existing !== skill.content && hash(existing) !== previous[skill.name]) {
      throw new Error(`${skill.name}: desktop skill was edited. Move those edits to .agents/skills/${skill.name}/SKILL.md, then remove the desktop copy and run npm run setup.`);
    }
    planned.push({ target, content: skill.content });
  }
  for (const name of Object.keys(previous)) {
    if (!(name in next)) throw new Error(`${name}: a previously generated skill is absent. Remove its desktop folder and manifest entry before continuing.`);
  }
  // Check all conflicts before writing any file. Leave user skill edits intact.
  if (!checkOnly) {
    for (const { target, content } of planned) {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
    mkdirSync(dirname(join(root, MANIFEST)), { recursive: true });
    writeFileSync(join(root, MANIFEST), `${JSON.stringify(next, null, 2)}\n`);
  }
  return skills.length;
}

if (isMainModule(import.meta.url)) {
  try {
    const count = syncSkills(DEFAULT_ROOT);
    console.log(`${count} skills ready for CLI and desktop. No account or provider settings changed.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
