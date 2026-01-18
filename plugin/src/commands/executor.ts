import type { PluginInput } from "@opencode-ai/plugin";
import type { CommandInfo } from "./types";
import { executeHandlers, delegateHandlers } from "./handlers";

export async function executeCommand(
  command: CommandInfo,
  args: string[],
  ctx: PluginInput,
  sessionID: string
): Promise<string | void> {
  if (command.executionMode === "execute") {
    // Direct execution
    const handler = executeHandlers[command.name];
    
    if (!handler) {
      return `⚠️ No handler implemented for /${command.name}`;
    }
    
    return await handler(ctx, args);
  } else {
    // Delegate to agent
    const handler = delegateHandlers[command.name];
    
    if (!handler) {
      // Fallback: use generic agent switching
      if (!command.agent) {
        return `⚠️ Command /${command.name} has no agent specified`;
      }
      
      const { switchToAgent } = await import("../utils/agent-switch");
      await switchToAgent(ctx, sessionID, command.agent, command.content);
      return;
    }
    
    return await handler(ctx, sessionID, args);
  }
}
