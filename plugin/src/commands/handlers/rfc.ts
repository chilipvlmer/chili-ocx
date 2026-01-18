import type { PluginInput } from "@opencode-ai/plugin";
import { switchToAgent } from "../../utils/agent-switch";

export async function handleRfc(
  ctx: PluginInput,
  sessionID: string,
  args: string[]
): Promise<void> {
  const rfcName = args[0];
  
  const prompt = rfcName
    ? `Create a new RFC for: ${rfcName}`
    : `Create a new RFC (Request for Comments). Please ask me about the technical design.`;
  
  await switchToAgent(ctx, sessionID, "seed-prd-rfc", prompt);
}
