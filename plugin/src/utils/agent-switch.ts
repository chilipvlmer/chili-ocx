import type { PluginInput } from "@opencode-ai/plugin";

export async function switchToAgent(
  ctx: PluginInput,
  sessionID: string,
  agent: string,
  prompt: string
): Promise<void> {
  await ctx.client.session.prompt({
    path: { id: sessionID },
    body: {
      agent,
      parts: [{ type: "text", text: prompt }]
    }
  });
}
