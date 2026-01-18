// dist/index.js
import { tool } from "@opencode-ai/plugin";

// dist/utils/pepper-io.js
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
function initPepperStructure(projectDir) {
  const pepperDir = join(projectDir, ".pepper");
  if (existsSync(pepperDir)) {
    return "\u2705 .pepper/ already initialized\n\nRun /status to see current state.";
  }
  const dirs = [
    "specs/prd",
    "specs/rfc",
    "plans",
    "tracking",
    "notepad",
    "drafts"
  ];
  for (const dir of dirs) {
    mkdirSync(join(pepperDir, dir), { recursive: true });
  }
  const initialState = {
    version: "1.0.0",
    session_ids: [],
    auto_continue: false
  };
  writeFileSync(join(pepperDir, "state.json"), JSON.stringify(initialState, null, 2));
  const emptyNotepad = {
    version: "1.0.0",
    entries: []
  };
  for (const notepadFile of ["learnings.json", "issues.json", "decisions.json"]) {
    writeFileSync(join(pepperDir, "notepad", notepadFile), JSON.stringify(emptyNotepad, null, 2));
  }
  writeFileSync(join(pepperDir, "tracking/rfc-status.json"), "{}");
  const planTemplate = `# Execution Plan

> Created: ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}

## Current Status
- No active plan yet
- Run /prd to create a Product Requirements Document
- Run /plan to generate an execution plan from a PRD

---

## Tasks
(Tasks will appear here after running /plan)
`;
  writeFileSync(join(pepperDir, "plan.md"), planTemplate);
  return `\u2705 Initialized .pepper/ structure

Created:
- specs/prd/ - Product Requirements Documents
- specs/rfc/ - Request for Comments (technical designs)
- plans/ - Execution plans
- tracking/ - Progress tracking
- notepad/ - Learnings, issues, decisions
- state.json - Session state

Next steps:
- Run /prd to create your first PRD
- Run /status to verify setup`;
}

// dist/index.js
import { writeFileSync as writeFileSync2 } from "fs";
var ChiliOcxPlugin = async (ctx) => {
  const logFile = "/tmp/chili-ocx-plugin.log";
  const log = (msg) => {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const line = `[${timestamp}] ${msg}
`;
    console.log(msg);
    try {
      writeFileSync2(logFile, line, { flag: "a" });
    } catch (e) {
    }
  };
  try {
    log("\u{1F336}\uFE0F chili-ocx plugin initializing...");
    log(`  Context directory: ${ctx.directory}`);
    const tools = {
      "pepper_init": tool({
        description: "Initialize the Pepper harness .pepper/ directory structure in the current project",
        args: {},
        execute: async (args, context) => {
          log("\u{1F527} pepper_init tool executing");
          const result = initPepperStructure(ctx.directory);
          log(`\u2705 pepper_init result: ${result.substring(0, 100)}`);
          return result;
        }
      })
    };
    log(`\u{1F4CB} Registered ${Object.keys(tools).length} custom tools`);
    log("\u2705 chili-ocx plugin loaded successfully");
    return { tool: tools };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    log(`\u274C chili-ocx plugin failed to load: ${errorMsg}`);
    log(`Stack: ${errorStack}`);
    throw error;
  }
};
var index_default = ChiliOcxPlugin;
export {
  index_default as default
};
