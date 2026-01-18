import type { PluginInput } from "@opencode-ai/plugin";
import { switchToAgent } from "../../utils/agent-switch";
import { readPepperState } from "../../utils/pepper-io";

export async function handlePrdRefine(
  ctx: PluginInput,
  sessionID: string,
  args: string[]
): Promise<string | void> {
  const state = readPepperState(ctx.directory);
  
  if (!state?.active_spec) {
    return "❌ No active PRD found. Run /prd to create one first.";
  }
  
  const prompt = `Refine the active PRD: ${state.active_spec}

Please review the current PRD and ask me questions to improve it.`;
  
  await switchToAgent(ctx, sessionID, "seed-prd-rfc", prompt);
}
