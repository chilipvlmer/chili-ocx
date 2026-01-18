import type { Hooks, PluginInput } from "@opencode-ai/plugin";
import type { CommandInfo } from "../commands/types";
import { executeHandlers, delegateHandlers } from "../commands/handlers";
import { switchToAgent } from "../utils/agent-switch";

export function createCommandInterceptor(
  commands: CommandInfo[],
  ctx: PluginInput
): Hooks["chat.message"] {
  return async (input, output) => {
    // Debug logging to file
    const { writeFileSync } = await import("fs");
    const log = (msg: string) => {
      const timestamp = new Date().toISOString();
      const line = `[${timestamp}] ${msg}\n`;
      console.log(msg);
      try {
        writeFileSync("/tmp/chili-ocx-plugin.log", line, { flag: "a" });
      } catch (e) {}
    };
    
    log("🔍 chat.message hook called");
    log(`  Input sessionID: ${input.sessionID}`);
    log(`  Output parts count: ${output.parts?.length || 0}`);
    
    const textPart = output.parts.find(p => p.type === "text");
    if (!textPart || typeof textPart.text !== "string") {
      log("  ⚠️ No text part found or text is not a string");
      return;
    }

    const text = textPart.text.trim();
    log(`  📝 Text content: "${text.substring(0, 50)}"`);
    
    if (!text.startsWith("/")) {
      log("  ⚠️ Text does not start with /");
      return;
    }
    
    log(`  ✅ Command detected: ${text}`);

    const [cmdName, ...args] = text.slice(1).split(/\s+/);
    
    const command = commands.find(c => c.name === cmdName);
    
    if (!command) {
      // Unknown command - pass through to OpenCode
      return;
    }

    // Execute or delegate based on mode
    if (command.executionMode === "execute") {
      // Direct execution - run handler and replace message
      const handler = executeHandlers[command.name];
      if (!handler) {
        textPart.text = `⚠️ No handler implemented for /${cmdName}`;
        return;
      }
      
      try {
        const result = await handler(ctx, args);
        textPart.text = result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        textPart.text = `❌ Command failed: ${errorMsg}`;
      }
    } else {
      // Delegate mode - switch agent
      const sessionID = input.sessionID;
      const handler = delegateHandlers[command.name];
      
      // Show "Starting..." message first
      textPart.text = `🌶️ Starting ${cmdName}...\n\n(Switching to ${command.agent || 'agent'}...)`;
      
      // Switch to agent asynchronously
      setTimeout(async () => {
        try {
          if (handler) {
            const result = await handler(ctx, sessionID, args);
            if (result) {
              // Handler returned an error message
              console.log("Delegate handler returned:", result);
            }
          } else if (command.agent) {
            // Fallback: generic agent switching
            await switchToAgent(ctx, sessionID, command.agent, command.content);
          }
        } catch (error) {
          console.error(`Failed to execute command /${cmdName}:`, error);
        }
      }, 100);
    }
  };
}
