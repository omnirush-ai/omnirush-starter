import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "omnirush-starter space-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  cpSync(join(REPO, ".agents"), join(root, ".agents"), { recursive: true });
  mkdirSync(join(root, ".git"));
  writeConfig(root);
  return root;
}

export function writeConfig(root, checks = { test: null, lint: null, typecheck: null, build: null }) {
  const config = { version: 1, project: { name: "Test app", goal: "Check behavior", stack: ["Node.js"] }, checks };
  writeFileSync(join(root, "starter.config.json"), `${JSON.stringify(config, null, 2)}\n`);
  return config;
}

export function quote(value) {
  return process.platform === "win32" ? `"${value.replaceAll('"', '""')}"` : `'${value.replaceAll("'", "'\\''")}'`;
}

export function script(root, name, content) {
  const file = join(root, `${name}.cjs`);
  writeFileSync(file, content);
  return { command: `${quote(process.execPath)} ${quote(file)}`, cwd: ".", timeoutMs: 10_000 };
}

export function checksFor(test, extras = {}) {
  return { test, lint: { skip: "No linter in this fixture." }, typecheck: { skip: "JavaScript fixture." }, build: { skip: "No build in this fixture." }, ...extras };
}
