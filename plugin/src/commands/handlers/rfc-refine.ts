import type { PluginInput } from "@opencode-ai/plugin";
import { switchToAgent } from "../../utils/agent-switch";

export async function handleRfcRefine(
  ctx: PluginInput,
  sessionID: string,
  args: string[]
): Promise<void> {
  const prompt = `Refine the active RFC.

Please review the current RFC and ask me questions to improve the technical design.`;
  
  await switchToAgent(ctx, sessionID, "seed-prd-rfc", prompt);
}
