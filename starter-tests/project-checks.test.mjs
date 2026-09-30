import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { cpSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { setTimeout as pause } from "node:timers/promises";
import { loadConfig, REPORT_FILE, starterStatus } from "../scripts/starter-lib.mjs";
import { runProjectChecks } from "../scripts/project-checks.mjs";
import { checksFor, fixture, REPO, script, writeConfig } from "./helpers.mjs";

test("an untouched app config fails and records all missing checks", async (t) => {
  const root = fixture(t);
  const report = await runProjectChecks(root);
  assert.equal(report.passed, false);
  assert.deepEqual(report.checks.map((item) => item.status), ["unconfigured", "unconfigured", "unconfigured", "unconfigured"]);
  assert.equal(JSON.parse(readFileSync(join(root, REPORT_FILE), "utf8")).passed, false);
});

test("a real test command passes with reasoned inapplicable checks", async (t) => {
  const root = fixture(t);
  const command = script(root, "pass", "console.log('passed app assertion');");
  writeConfig(root, checksFor(command));
  const output = [];
  const report = await runProjectChecks(root, { onOutput: (text) => output.push(text) });
  assert.equal(report.passed, true);
  assert.equal(report.checks[0].exitCode, 0);
  assert.equal(report.checks[1].status, "skipped");
  assert.match(output.join(""), /passed app assertion/);
});

test("a failed test cannot become a pass and later checks still run", async (t) => {
  const root = fixture(t);
  writeConfig(root, checksFor(script(root, "fail", "process.exitCode = 7;"), { lint: script(root, "lint", "process.exitCode = 0;") }));
  const report = await runProjectChecks(root);
  assert.equal(report.passed, false);
  assert.equal(report.checks[0].status, "failed");
  assert.equal(report.checks[0].exitCode, 7);
  assert.equal(report.checks[1].status, "passed");
});

test("a missing command fails even when app tests pass", async (t) => {
  const root = fixture(t);
  writeConfig(root, checksFor(script(root, "pass", ""), { lint: { command: "omnirush-starter-command-that-does-not-exist", timeoutMs: 1000 } }));
  const report = await runProjectChecks(root);
  assert.equal(report.passed, false);
  assert.equal(report.checks[1].status, "failed");
});

test("an unresolved check fails even when app tests pass", async (t) => {
  const root = fixture(t);
  writeConfig(root, checksFor(script(root, "pass", ""), { build: null }));
  assert.equal((await runProjectChecks(root)).passed, false);
});

test("a timed out test fails", async (t) => {
  const root = fixture(t);
  const command = script(root, "slow", "setTimeout(() => {}, 1500);");
  command.timeoutMs = 100;
  writeConfig(root, checksFor(command));
  const report = await runProjectChecks(root);
  assert.equal(report.passed, false);
  assert.equal(report.checks[0].status, "timeout");
});

test("a timeout stops the shell command and its child processes", async (t) => {
  const root = fixture(t);
  const command = script(root, "parent", `
    const { spawn } = require('node:child_process');
    const { writeFileSync } = require('node:fs');
    const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)']);
    writeFileSync('child-pid.json', JSON.stringify(child.pid));
    setInterval(() => {}, 1000);
  `);
  command.timeoutMs = 750;
  writeConfig(root, checksFor(command));
  const report = await runProjectChecks(root);
  const pid = JSON.parse(readFileSync(join(root, "child-pid.json"), "utf8"));
  const alive = () => {
    try { process.kill(pid, 0); return true; } catch { return false; }
  };
  t.after(() => { if (alive()) process.kill(pid, "SIGKILL"); });
  for (let count = 0; count < 20 && alive(); count++) await pause(50);
  assert.equal(report.checks[0].status, "timeout");
  assert.equal(alive(), false, "a child was left running after its check timed out");
});

test("cancelling a check stops its process and does not launch later checks", async (t) => {
  const root = fixture(t);
  const slow = script(root, "slow", "setInterval(() => {}, 1000);");
  const later = script(root, "later", "require('node:fs').writeFileSync('later-ran.txt', 'wrong');");
  writeConfig(root, checksFor(slow, { lint: later }));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 150);
  t.after(() => clearTimeout(timer));
  const report = await runProjectChecks(root, { signal: controller.signal });
  assert.equal(report.passed, false);
  assert.deepEqual(report.checks.map((check) => check.status), ["cancelled", "cancelled", "cancelled", "cancelled"]);
  assert.equal(existsSync(join(root, "later-ran.txt")), false);
});

for (const [signal, expectedExit] of [["SIGINT", 130], ["SIGTERM", 143]]) {
  test(`CLI ${signal} cleans up its active check`, { skip: process.platform === "win32" ? "Windows signals need a console; AbortSignal cleanup is tested above." : false }, async (t) => {
    const root = fixture(t);
    cpSync(join(REPO, "scripts"), join(root, "scripts"), { recursive: true });
    const slow = script(root, "slow", "require('node:fs').writeFileSync('active-pid.json', JSON.stringify(process.pid)); setInterval(() => {}, 1000);");
    writeConfig(root, checksFor(slow));
    const child = spawn(process.execPath, [join(root, "scripts/project-checks.mjs")], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk) => { output += chunk.toString(); });
    const closed = new Promise((resolve) => child.once("close", (code) => resolve(code)));
    t.after(() => { if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL"); });
    for (let count = 0; count < 100 && !existsSync(join(root, "active-pid.json")) && child.exitCode === null; count++) await pause(50);
    assert.ok(existsSync(join(root, "active-pid.json")), `the fixture check did not start: ${output}`);
    const pid = JSON.parse(readFileSync(join(root, "active-pid.json"), "utf8"));
    const alive = () => { try { process.kill(pid, 0); return true; } catch { return false; } };
    t.after(() => { if (alive()) process.kill(pid, "SIGKILL"); });
    child.kill(signal);
    assert.equal(await closed, expectedExit);
    for (let count = 0; count < 20 && alive(); count++) await pause(50);
    assert.equal(alive(), false, "the CLI left its check running");
    const report = JSON.parse(readFileSync(join(root, REPORT_FILE), "utf8"));
    assert.equal(report.passed, false);
    assert.equal(report.checks[0].status, "cancelled");
  });
}

test("the configured working folder is used", async (t) => {
  const root = fixture(t);
  const command = script(root, "cwd", "if (!process.cwd().endsWith('.agents')) process.exitCode = 1;");
  command.cwd = ".agents";
  writeConfig(root, checksFor(command));
  assert.equal((await runProjectChecks(root)).passed, true);
});

test("reports keep status and do not store command output", async (t) => {
  const root = fixture(t);
  writeConfig(root, checksFor(script(root, "logs", "console.log('PRIVATE_OUTPUT_SAMPLE'); console.error('PRIVATE_ERROR_SAMPLE');")));
  const report = await runProjectChecks(root);
  const persisted = readFileSync(join(root, REPORT_FILE), "utf8");
  assert.equal(report.passed, true);
  assert.doesNotMatch(persisted, /PRIVATE_(OUTPUT|ERROR)_SAMPLE/);
});

test("a dry check does not create a report", async (t) => {
  const root = fixture(t);
  await runProjectChecks(root, { writeReport: false });
  assert.equal(existsSync(join(root, REPORT_FILE)), false);
});

test("tests cannot be skipped to get a green result", (t) => {
  const root = fixture(t);
  writeConfig(root, checksFor({ skip: "No tests." }));
  assert.throws(() => loadConfig(root), /tests need a command/);
});

test("skip reasons, timeouts, and working folders must be valid", (t) => {
  const root = fixture(t);
  writeConfig(root, checksFor(script(root, "pass", ""), { lint: { skip: "" } }));
  assert.throws(() => loadConfig(root), /skips need a reason/);
  writeConfig(root, checksFor({ command: "anything", cwd: ".." }));
  assert.throws(() => loadConfig(root), /stay inside/);
  writeConfig(root, checksFor({ command: "anything", timeoutMs: 0 }));
  assert.throws(() => loadConfig(root), /timeoutMs/);
});

test("status labels past results and warns if config changed", async (t) => {
  const root = fixture(t);
  const checks = checksFor(script(root, "pass", ""));
  writeConfig(root, checks);
  await runProjectChecks(root);
  assert.match(starterStatus(root), /past run does not prove/i);
  writeConfig(root, { ...checks, build: null });
  assert.match(starterStatus(root), /config has changed/);
});
