import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { initPepperStructure, getPepperStatus, addNotepadEntry } from "./utils/pepper-io";
import { writeFileSync } from "fs";

const ChiliOcxPlugin: Plugin = async (ctx) => {
  const logFile = "/tmp/chili-ocx-plugin.log";
  const log = (msg: string) => {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}\n`;
    console.log(msg);
    try {
      writeFileSync(logFile, line, { flag: "a" });
    } catch (e) {
      // Ignore file write errors
    }
  };
  
  try {
    log("🌶️ chili-ocx plugin initializing...");
    log(`  Context directory: ${ctx.directory}`);
    
    // Register custom tools using the tool() helper
    const tools = {
      "pepper_init": tool({
        description: "Initialize the Pepper harness .pepper/ directory structure in the current project",
        args: {},
        execute: async (args, context) => {
          log("🔧 pepper_init tool executing");
          const result = initPepperStructure(ctx.directory);
          log(`✅ pepper_init result: ${result.substring(0, 100)}`);
          return result;
        }
      }),
      "pepper_status": tool({
        description: "Get the current status of the Pepper harness including PRDs, RFCs, plans, and state",
        args: {},
        execute: async (args, context) => {
          log("🔧 pepper_status tool executing");
          const result = getPepperStatus(ctx.directory);
          log(`✅ pepper_status returned status report`);
          return result;
        }
      }),
      "pepper_notepad_add": tool({
        description: "Add an entry to one of the Pepper notepads (learnings, issues, or decisions)",
        args: {
          notepadType: tool.schema.enum(["learnings", "issues", "decisions"]).describe("Type of notepad: learnings, issues, or decisions"),
          entry: tool.schema.string().describe("The content to add to the notepad")
        },
        execute: async (args, context) => {
          log(`🔧 pepper_notepad_add tool executing (type: ${args.notepadType})`);
          const result = addNotepadEntry(ctx.directory, args.notepadType, args.entry);
          log(`✅ pepper_notepad_add: ${result.substring(0, 100)}`);
          return result;
        }
      })
    };
    
    log(`📋 Registered ${Object.keys(tools).length} custom tools`);
    log("✅ chili-ocx plugin loaded successfully");
    
    return { tool: tools };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    log(`❌ chili-ocx plugin failed to load: ${errorMsg}`);
    log(`Stack: ${errorStack}`);
    throw error;
  }
};

export default ChiliOcxPlugin;
