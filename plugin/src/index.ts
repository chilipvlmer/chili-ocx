import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { initPepperStructure, getPepperStatus, addNotepadEntry } from "./utils/pepper-io";
import { logInfo } from "./utils/logger.js";
import { SkillRegistry } from "./skills/registry.js";
import { loadSkills } from "./skills/loader.js";
import { SkillResolver } from "./utils/skill-resolver.js";
import { join } from "path";
import * as fs from "fs";

function logToTmp(msg: string) {
  try {
    const timestamp = new Date().toISOString();
    fs.appendFileSync("/tmp/pepper-debug.log", `[${timestamp}] ${msg}\n`);
  } catch (e) {
    // Ignore logging errors
  }
}

const ChiliOcxPlugin: Plugin = async (ctx) => {
  try {
    logToTmp("Plugin initializing...");
    logInfo("🌶️ chili-ocx plugin initializing...");
    logInfo(`  Context directory: ${ctx.directory}`);
    
    // --- RFC-010: Skill Tool ---
    const skillToolDef = tool({
      description: "Load a knowledge skill (instructions) by name. Use this to access standard protocols like 'prd-methodology', 'rfc-format', etc.",
      args: {
        name: tool.schema.string().describe("The name of the skill to load (e.g., 'prd-methodology', 'rfc-format')")
      },
      execute: async (args, context) => {
        try {
          const resolver = new SkillResolver(ctx.directory);
          const result = await resolver.resolve(args.name);
          
          if (result.source === 'not-found') {
            const available = result.availableSkills ? result.availableSkills.join(', ') : 'none';
            const msg = `Skill '${args.name}' not found. Available skills: ${available}`;
            logInfo(`⚠️ ${msg}`);
            return msg;
          }
          
          logInfo(`📖 Loaded skill: ${args.name} (Source: ${result.source})`);
          
          // Prepend metadata header
          const metadata = `<!-- Skill: ${result.name} | Source: ${result.source} | Path: ${result.path} -->\n\n`;
          return metadata + result.content;
        } catch (error: any) {
          const msg = `Failed to load skill ${args.name}: ${error.message}`;
          logInfo(`❌ ${msg}`);
          throw new Error(msg);
        }
      }
    });

    // Register custom tools using the tool() helper
    const tools: Record<string, any> = {
      "pepper_init": tool({
        description: "Initialize the Pepper harness .pepper/ directory structure in the current project",
        args: {
           reason: tool.schema.string().describe("Brief explanation of why you are calling this tool")
        },
        execute: async (args, context) => {
          logInfo("🔧 pepper_init tool executing");
          const result = initPepperStructure(ctx.directory);
          logInfo(`✅ pepper_init result: ${result.substring(0, 100)}`);
          return result;
        }
      }),
      "pepper_status": tool({
        description: "Get the current status of the Pepper harness including PRDs, RFCs, plans, and state",
        args: {
           reason: tool.schema.string().describe("Brief explanation of why you are calling this tool")
        },
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

    // Try to register 'skill' (primary)
    // OpenCode might block this if it conflicts with a built-in tool, 
    // but the goal is to override the built-in one which is broken.
    // We also register 'pepper_skill' as a fallback just in case.
    tools["skill"] = skillToolDef;
    tools["pepper_skill"] = skillToolDef;

    // --- Dynamic Skill Loading (Legacy/Experimental) ---
    // Keeping this for backward compatibility or future features, 
    // but the main way to access knowledge skills is now the 'skill' tool above.
    const skillsDirs = [
      join(ctx.directory, ".opencode/skills")
    ];
    
    logInfo(`🔍 Scanning for skills in: ${skillsDirs.join(", ")}`);
    
    let allSkills: any[] = [];
    for (const dir of skillsDirs) {
      logToTmp(`Scanning directory: ${dir}`);
      const exists = fs.existsSync(dir);
      logToTmp(`Directory exists? ${exists}`);
      const skills = await loadSkills(dir);
      allSkills = allSkills.concat(skills);
    }
    logToTmp(`Found ${allSkills.length} skills`);
    
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
    logToTmp(`Error: ${errorStack}`);
    logInfo(`❌ chili-ocx plugin failed to load: ${errorMsg}`);
    logInfo(`Stack: ${errorStack}`);
    throw error;
  }
};

export default ChiliOcxPlugin;
