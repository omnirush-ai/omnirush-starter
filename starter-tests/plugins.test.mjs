import assert from "node:assert/strict";
import test from "node:test";
import cliExtension from "../.omnirush/extensions/omnirush-starter.ts";
import desktopPlugin from "../.opencode/plugins/omnirush-starter.js";
import { fixture } from "./helpers.mjs";

test("CLI help and status do not trigger a model turn", async (t) => {
  const root = fixture(t);
  const commands = new Map();
  const messages = [];
  cliExtension({
    registerCommand: (name, value) => commands.set(name, value),
    sendMessage: (message, options) => messages.push({ message, options }),
  });
  const errors = [];
  const context = { cwd: root, ui: { notify: (message) => errors.push(message) } };
  await commands.get("starter").handler("", context);
  await commands.get("starter").handler("status", context);
  assert.equal(errors.length, 0);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].options.triggerTurn, false);
  assert.equal(messages[1].options.triggerTurn, false);
  assert.match(messages[1].message.content, /No project check has run yet/);
});

test("CLI guides read the selected workflow and reject an unknown workflow", async (t) => {
  const root = fixture(t);
  let command;
  let output;
  let error;
  cliExtension({ registerCommand: (_name, value) => { command = value; }, sendMessage: (message) => { output = message.content; } });
  const context = { cwd: root, ui: { notify: (message) => { error = message; } } };
  await command.handler("debug", context);
  assert.match(output, /omnirush-debug\/SKILL.md/);
  await command.handler("missing", context);
  assert.match(error, /Choose a workflow/);
});

test("desktop exposes working status and guide tools in the engine's result format", async (t) => {
  const root = fixture(t);
  const tools = new Map();
  await desktopPlugin.setup({
    location: { directory: root },
    tool: { transform: async (fn) => fn({ add: (tool) => tools.set(tool.name, tool) }) },
  });
  assert.deepEqual([...tools.keys()], ["starter_status", "starter_guide"]);
  const status = await tools.get("starter_status").execute({});
  assert.equal(status.content[0].type, "text");
  assert.match(status.content[0].text, /test: NOT SET/);
  const guide = await tools.get("starter_guide").execute({ workflow: "feature" });
  assert.match(guide.content[0].text, /omnirush-feature\/SKILL.md/);
  await assert.rejects(tools.get("starter_guide").execute({ workflow: "../outside" }), /Choose a workflow/);
});
