import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { initPepperStructure, getPepperStatus, addNotepadEntry } from "./utils/pepper-io";
import { logInfo } from "./utils/logger.js";
import { SkillRegistry } from "./skills/registry.js";
import { loadSkills } from "./skills/loader.js";
import { join } from "path";

const ChiliOcxPlugin: Plugin = async (ctx) => {
  try {
    logInfo("🌶️ chili-ocx plugin initializing...");
    logInfo(`  Context directory: ${ctx.directory}`);
    
    // Register custom tools using the tool() helper
    const tools: Record<string, any> = {
      "pepper_init": tool({
        description: "Initialize the Pepper harness .pepper/ directory structure in the current project",
        args: {},
        execute: async (args, context) => {
          logInfo("🔧 pepper_init tool executing");
          const result = initPepperStructure(ctx.directory);
          logInfo(`✅ pepper_init result: ${result.substring(0, 100)}`);
          return result;
        }
      }),
      "pepper_status": tool({
        description: "Get the current status of the Pepper harness including PRDs, RFCs, plans, and state",
        args: {},
        execute: async (args, context) => {
          logInfo("🔧 pepper_status tool executing");
          const result = getPepperStatus(ctx.directory);
          logInfo(`✅ pepper_status returned status report`);
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
          logInfo(`🔧 pepper_notepad_add tool executing (type: ${args.notepadType})`);
          const result = addNotepadEntry(ctx.directory, args.notepadType, args.entry);
          logInfo(`✅ pepper_notepad_add: ${result.substring(0, 100)}`);
          return result;
        }
      })
    };

    // --- Dynamic Skill Loading ---
    const skillsDirs = [
      join(ctx.directory, ".opencode/skills")
    ];
    
    logInfo(`🔍 Scanning for skills in: ${skillsDirs.join(", ")}`);
    
    let allSkills: any[] = [];
    for (const dir of skillsDirs) {
      const skills = await loadSkills(dir);
      allSkills = allSkills.concat(skills);
    }
    
    if (allSkills.length > 0) {
      logInfo(`📦 Found ${allSkills.length} skills. Registering...`);
      const registry = new SkillRegistry();
      allSkills.forEach(skill => registry.register(skill));
      
      const skillTools = registry.getTools();
      Object.assign(tools, skillTools);
      logInfo(`✅ Registered ${Object.keys(skillTools).length} skill tools.`);
    } else {
      logInfo("ℹ️ No custom skills found.");
    }
    
    logInfo(`📋 Registered ${Object.keys(tools).length} custom tools (total)`);
    logInfo("✅ chili-ocx plugin loaded successfully");
    
    return { tool: tools };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    logInfo(`❌ chili-ocx plugin failed to load: ${errorMsg}`);
    logInfo(`Stack: ${errorStack}`);
    throw error;
  }
};

export default ChiliOcxPlugin;
