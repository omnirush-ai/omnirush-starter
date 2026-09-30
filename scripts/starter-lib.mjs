import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CHECK_NAMES = ["test", "lint", "typecheck", "build"];
export const WORKFLOWS = ["setup", "feature", "debug", "test", "refactor", "performance", "build", "review", "handoff"];
export const CONFIG_FILE = "starter.config.json";
export const REPORT_FILE = ".starter/last-check.json";

export function hash(text) {
  return createHash("sha256").update(text).digest("hex");
}

export function isMainModule(url) {
  return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(url));
}

export function findStarterRoot(directory) {
  let current = resolve(directory);
  for (;;) {
    if (existsSync(join(current, CONFIG_FILE))) return current;
    if (existsSync(join(current, ".git")) || dirname(current) === current) {
      throw new Error(`No ${CONFIG_FILE} in this project. Open the starter repo folder.`);
    }
    current = dirname(current);
  }
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validateConfig(config, root) {
  if (!isObject(config) || config.version !== 1) throw new Error("Config version must be 1.");
  const project = config.project;
  if (!isObject(project) || typeof project.name !== "string" || typeof project.goal !== "string" ||
      !Array.isArray(project.stack) || project.stack.some((item) => typeof item !== "string")) {
    throw new Error("Config project needs name, goal, and a stack array of strings.");
  }
  if (!isObject(config.checks)) throw new Error("Config checks must be an object.");
  for (const name of CHECK_NAMES) {
    const check = config.checks[name];
    if (check === null) continue;
    if (!isObject(check)) throw new Error(`checks.${name} must be a command, a skip reason, or null.`);
    if ("skip" in check) {
      if (name === "test" || typeof check.skip !== "string" || !check.skip.trim() || "command" in check) {
        throw new Error(`checks.${name}: tests need a command; other skips need a reason and no command.`);
      }
      continue;
    }
    if (typeof check.command !== "string" || !check.command.trim()) {
      throw new Error(`checks.${name}.command must be a nonempty shell command.`);
    }
    const cwd = check.cwd ?? ".";
    if (typeof cwd !== "string" || !cwd.trim()) throw new Error(`checks.${name}.cwd must be a directory.`);
    const outside = relative(resolve(root), resolve(root, cwd));
    if (outside === ".." || outside.startsWith("../") || outside.startsWith("..\\") || isAbsolute(outside)) {
      throw new Error(`checks.${name}.cwd must stay inside this project.`);
    }
    const timeoutMs = check.timeoutMs ?? 120_000;
    if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 3_600_000) {
      throw new Error(`checks.${name}.timeoutMs must be 100 to 3600000.`);
    }
  }
  return config;
}

export function loadConfig(root) {
  const raw = readFileSync(join(root, CONFIG_FILE), "utf8");
  let config;
  try { config = JSON.parse(raw); }
  catch { throw new Error(`${CONFIG_FILE} is not valid JSON.`); }
  return { config: validateConfig(config, root), configHash: hash(raw) };
}

// This pack uses plain names and one-line JSON-quoted YAML descriptions.
export function parseSkill(content, folder) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error(`${folder}: missing skill frontmatter.`);
  const name = match[1].match(/^name:\s*([a-z0-9-]+)\s*$/m)?.[1];
  const quoted = match[1].match(/^description:\s*("[^\r\n]*")\s*$/m)?.[1];
  let description;
  try { description = JSON.parse(quoted); } catch { /* report below */ }
  if (name !== folder || name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`${folder}: skill name must match the folder and use lowercase words with hyphens.`);
  }
  if (typeof description !== "string" || !description.trim() || description.length > 1024) {
    throw new Error(`${folder}: use a one-line quoted description, up to 1024 characters.`);
  }
  if (!match[2].trim()) throw new Error(`${folder}: skill instructions are empty.`);
  return { name, description, body: match[2].trim(), content };
}

export function readSkills(root) {
  const directory = join(root, ".agents", "skills");
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => parseSkill(readFileSync(join(directory, entry.name, "SKILL.md"), "utf8"), entry.name));
}

export function workflowGuide(root, workflow) {
  if (!WORKFLOWS.includes(workflow)) throw new Error(`Choose a workflow: ${WORKFLOWS.join(", ")}.`);
  const name = `omnirush-${workflow}`;
  const skill = readSkills(root).find((item) => item.name === name);
  if (!skill) throw new Error(`Missing skill: ${name}.`);
  return `${skill.body}\n\nSource: .agents/skills/${name}/SKILL.md`;
}

export function starterStatus(root) {
  const { config, configHash } = loadConfig(root);
  const lines = [
    `Project: ${config.project.name || "not set"}`,
    `Goal: ${config.project.goal || "not set"}`,
    `Stack: ${config.project.stack.join(", ") || "not set"}`,
    `Skills: ${readSkills(root).length}`,
    "Project checks:",
    ...CHECK_NAMES.map((name) => {
      const check = config.checks[name];
      return `  ${name}: ${check === null ? "NOT SET" : "skip" in check ? `not applicable (${check.skip})` : check.command}`;
    }),
  ];
  if (existsSync(join(root, REPORT_FILE))) {
    let report;
    try { report = JSON.parse(readFileSync(join(root, REPORT_FILE), "utf8")); }
    catch { throw new Error("The last check report is not valid JSON. Run npm run check:project again."); }
    lines.push(`Last project check: ${report.passed === true ? "passed" : "did not pass"} (${report.finishedAt ?? "time unknown"}).`);
    if (report.configHash !== configHash) lines.push("The check config has changed since that run.");
    lines.push("A past run does not prove that the current code passes.");
  } else {
    lines.push("No project check has run yet.");
  }
  lines.push("Run npm run check:project after setting the project commands. Starter tests check this kit only.");
  return lines.join("\n");
}

export function starterHelp() {
  return [
    "OmniRush starter",
    "  /starter status       Show setup and past check status. Does not run checks.",
    ...WORKFLOWS.map((workflow) => `  /starter ${workflow.padEnd(12)} Show the ${workflow} guide.`),
    "To ask the agent to work: /skill:omnirush-feature <your task>",
    "First use: /skill:omnirush-setup <what you want to build>",
    "These help commands do not start a model request.",
  ].join("\n");
}
