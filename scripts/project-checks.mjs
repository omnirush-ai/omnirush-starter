import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CHECK_NAMES, isMainModule, loadConfig, REPORT_FILE } from "./starter-lib.mjs";

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function executeCheck(root, spec, onOutput, signal) {
  return new Promise((finish) => {
    const child = spawn(spec.command, {
      cwd: resolve(root, spec.cwd ?? "."),
      shell: true,
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    let failure;
    let outputBytes = 0;
    function stop(code) {
      if (failure) return;
      failure = code;
      if (!child.pid) return;
      if (process.platform === "win32") {
        spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true, timeout: 5000 });
      } else {
        try { process.kill(-child.pid, "SIGKILL"); } catch { /* process group already ended */ }
      }
      child.kill("SIGKILL");
    }
    const interrupt = () => stop("ABORT_ERR");
    signal?.addEventListener("abort", interrupt, { once: true });
    if (signal?.aborted) interrupt();
    const timer = setTimeout(() => stop("ETIMEDOUT"), spec.timeoutMs ?? 120_000);
    const output = (chunk) => {
      outputBytes += Buffer.byteLength(chunk);
      if (outputBytes > 10 * 1024 * 1024) return stop("ENOBUFS");
      onOutput(chunk.toString());
    };
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", output);
    child.stderr.on("data", output);
    child.once("error", (error) => { failure ??= error.code ?? "UNKNOWN"; });
    child.once("close", (exitCode) => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", interrupt);
      finish({ exitCode, errorCode: failure, status: failure === "ABORT_ERR" ? "cancelled" : failure === "ETIMEDOUT" ? "timeout" : !failure && exitCode === 0 ? "passed" : "failed" });
    });
  });
}

export async function runProjectChecks(root, { writeReport = true, onOutput = () => {}, signal } = {}) {
  const { config, configHash } = loadConfig(root);
  const startedAt = new Date().toISOString();
  const checks = [];
  for (const name of CHECK_NAMES) {
    if (signal?.aborted) {
      checks.push({ name, status: "cancelled" });
      onOutput(`${name}: cancelled; command was not started.\n`);
      continue;
    }
    const spec = config.checks[name];
    if (spec === null) {
      checks.push({ name, status: "unconfigured" });
      onOutput(`${name}: NOT SET. Add a real project command or an explicit skip reason.\n`);
      continue;
    }
    if ("skip" in spec) {
      checks.push({ name, status: "skipped", reason: spec.skip });
      onOutput(`${name}: not applicable (${spec.skip}).\n`);
      continue;
    }
    onOutput(`\n${name}: ${spec.command}\n`);
    const started = Date.now();
    // Commands are trusted project code, as are tests and package scripts.
    // Use the OS shell so npm, pnpm, and Windows .cmd launchers work.
    const result = await executeCheck(root, spec, onOutput, signal);
    checks.push({ name, command: spec.command, cwd: spec.cwd ?? ".", status: result.status, exitCode: result.exitCode, durationMs: Date.now() - started,
      ...(result.errorCode ? { errorCode: result.errorCode } : {}) });
    onOutput(`${name}: ${result.status}.\n`);
  }
  const passed = checks.every((check) => check.status === "passed" || check.status === "skipped") &&
    checks.find((check) => check.name === "test")?.status === "passed";
  const report = { version: 1, startedAt, finishedAt: new Date().toISOString(), configHash, passed, checks };
  if (writeReport) {
    mkdirSync(dirname(join(root, REPORT_FILE)), { recursive: true });
    // Keep statuses, not terminal logs. Logs can contain private app data.
    writeFileSync(join(root, REPORT_FILE), `${JSON.stringify(report, null, 2)}\n`);
  }
  return report;
}

if (isMainModule(import.meta.url)) {
  const controller = new AbortController();
  let interruptCode;
  const onSigint = () => { interruptCode = 130; controller.abort(); };
  const onSigterm = () => { interruptCode = 143; controller.abort(); };
  process.once("SIGINT", onSigint);
  process.once("SIGTERM", onSigterm);
  try {
    const report = await runProjectChecks(DEFAULT_ROOT, { signal: controller.signal, onOutput: (text) => process.stdout.write(text) });
    console.log(report.passed ? "Project checks passed." : "Project checks did not pass. Resolve failures and setup gaps.");
    process.exitCode = interruptCode ?? (report.passed ? 0 : 1);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    process.removeListener("SIGINT", onSigint);
    process.removeListener("SIGTERM", onSigterm);
  }
}
