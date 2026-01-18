import type { PluginInput } from "@opencode-ai/plugin";
import { switchToAgent } from "../../utils/agent-switch";

export async function handlePrd(
  ctx: PluginInput,
  sessionID: string,
  args: string[]
): Promise<void> {
  // Choice A from question 2: Let Seed handle missing args
  const projectName = args[0];
  
  const prompt = projectName
    ? `Create a new PRD for project: ${projectName}`
    : `Create a new PRD. Please ask me about the project.`;
  
  await switchToAgent(ctx, sessionID, "seed-prd-rfc", prompt);
}
