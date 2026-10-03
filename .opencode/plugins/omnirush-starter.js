import { findStarterRoot, starterStatus, workflowGuide, WORKFLOWS } from "../../scripts/starter-lib.mjs";

export default {
  id: "omnirush-starter",
  async setup(ctx) {
    const root = findStarterRoot(ctx.location.directory);
    await ctx.tool.transform((editor) => {
      editor.add({
        name: "starter_status",
        description: "Read this project's starter setup and past check status. Does not run checks.",
        input: { type: "object", properties: {}, additionalProperties: false },
        options: { codemode: false },
        async execute() {
          return { content: [{ type: "text", text: starterStatus(root) }] };
        },
      });
      editor.add({
        name: "starter_guide",
        description: "Read an OmniRush starter guide for setup, features, debugging, tests, refactors, performance, build failures, reviews, handoffs, or moving CLI chats into the desktop app.",
        input: { type: "object", properties: { workflow: { type: "string", enum: WORKFLOWS } }, required: ["workflow"], additionalProperties: false },
        options: { codemode: false },
        async execute(input) {
          return { content: [{ type: "text", text: workflowGuide(root, input.workflow) }] };
        },
      });
    });
  },
};
