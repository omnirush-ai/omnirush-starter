import { findStarterRoot, starterHelp, starterStatus, workflowGuide } from "../../scripts/starter-lib.mjs";

export default function (api) {
  api.registerCommand("starter", {
    description: "Show starter help, a workflow guide, or project status without a model request",
    async handler(args, ctx) {
      try {
        const action = args.trim() || "help";
        const root = findStarterRoot(ctx.cwd);
        const text = action === "help" ? starterHelp() : action === "status" ? starterStatus(root) : workflowGuide(root, action);
        api.sendMessage({ customType: "omnirush-starter", content: text, display: true }, { triggerTurn: false });
      } catch (error) {
        ctx.ui.notify(error.message, "error");
      }
    },
  });
}
