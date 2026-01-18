import type { Plugin } from "@opencode-ai/plugin";
import { discoverOcxCommands } from "./commands/loader";
import { createCommandInterceptor } from "./hooks/command-interceptor";

const ChiliOcxPlugin: Plugin = async (ctx) => {
  console.log("🌶️ chili-ocx plugin loaded");
  
  const commands = discoverOcxCommands();
  console.log(`📋 Loaded commands: ${commands.map(c => c.name).join(", ")}`);
  
  return {
    "chat.message": createCommandInterceptor(commands, ctx)
  };
};

export default ChiliOcxPlugin;
