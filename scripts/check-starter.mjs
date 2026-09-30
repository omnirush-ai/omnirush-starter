import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, readSkills, WORKFLOWS } from "./starter-lib.mjs";
import { syncSkills } from "./sync-skills.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : /\.(?:js|mjs|ts)$/.test(entry.name) ? [file] : [];
  });
}

try {
  loadConfig(root);
  const skills = readSkills(root);
  for (const workflow of WORKFLOWS) {
    if (!skills.some((skill) => skill.name === `omnirush-${workflow}`)) throw new Error(`Missing ${workflow} skill.`);
  }
  syncSkills(root, { checkOnly: true });
  const files = ["scripts", "starter-tests", ".omnirush/extensions", ".opencode/plugins"].flatMap((directory) => sourceFiles(join(root, directory)));
  for (const file of files) {
    const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (result.error || result.status !== 0) throw new Error(result.stderr || result.error?.message || `Syntax check failed: ${file}`);
  }
  console.log(`${skills.length} skills and ${files.length} source files checked. Running starter tests.`);
  const tests = sourceFiles(join(root, "starter-tests")).filter((file) => file.endsWith(".test.mjs"));
  if (!tests.length) throw new Error("No starter tests found.");
  const result = spawnSync(process.execPath, ["--test", ...tests], { stdio: "inherit" });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || "Starter tests failed.");
  console.log("Starter checks passed. This result does not validate an app.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
