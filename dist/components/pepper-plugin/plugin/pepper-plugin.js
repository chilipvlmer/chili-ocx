// dist/index.js
import { tool } from "@opencode-ai/plugin";

// dist/utils/pepper-io.js
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "fs";
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
function readPepperState(projectDir) {
  const statePath = join(projectDir, ".pepper/state.json");
  if (!existsSync(statePath)) {
    return null;
  }
  try {
    const content = readFileSync(statePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read state.json:", error);
    return null;
  }
}
function readPepperPlan(projectDir) {
  const planPath = join(projectDir, ".pepper/plan.md");
  if (!existsSync(planPath)) {
    return null;
  }
  try {
    return readFileSync(planPath, "utf-8");
  } catch (error) {
    console.error("Failed to read plan.md:", error);
    return null;
  }
}
function getPepperStatus(projectDir) {
  const pepperDir = join(projectDir, ".pepper");
  if (!existsSync(pepperDir)) {
    return "\u274C Pepper harness not initialized\n\nRun /pepper-init to set up the directory structure.";
  }
  const state = readPepperState(projectDir);
  if (!state) {
    return "\u26A0\uFE0F .pepper/ exists but state.json is missing or invalid\n\nTry running /pepper-init again.";
  }
  const prdDir = join(pepperDir, "specs/prd");
  const prds = existsSync(prdDir) ? readdirSync(prdDir).filter((f) => f.endsWith(".md")) : [];
  const rfcDir = join(pepperDir, "specs/rfc");
  let rfcs = [];
  if (existsSync(rfcDir)) {
    const rfcVersions = readdirSync(rfcDir);
    rfcs = rfcVersions.flatMap((version) => {
      const versionDir = join(rfcDir, version);
      return existsSync(versionDir) ? readdirSync(versionDir).filter((f) => f.endsWith(".md")) : [];
    });
  }
  const plansDir = join(pepperDir, "plans");
  const plans = existsSync(plansDir) ? readdirSync(plansDir).filter((f) => f.endsWith(".md")) : [];
  let report = "# \u{1F336}\uFE0F Pepper Harness Status\n\n";
  report += `## State
`;
  report += `- Version: ${state.version || "unknown"}
`;
  report += `- Auto-continue: ${state.auto_continue ? "\u2705 enabled" : "\u274C disabled"}
`;
  report += `- Active sessions: ${state.session_ids?.length || 0}

`;
  report += `## Documents
`;
  report += `- PRDs: ${prds.length}
`;
  if (prds.length > 0) {
    prds.forEach((prd) => report += `  - ${prd}
`);
  }
  report += `- RFCs: ${rfcs.length}
`;
  if (rfcs.length > 0) {
    rfcs.forEach((rfc) => report += `  - ${rfc}
`);
  }
  report += `- Plans: ${plans.length}
`;
  if (plans.length > 0) {
    plans.forEach((plan) => report += `  - ${plan}
`);
  }
  const currentPlan = readPepperPlan(projectDir);
  if (currentPlan && !currentPlan.includes("No active plan yet")) {
    report += `
## Current Plan
`;
    report += `\u2705 Active plan exists in .pepper/plan.md
`;
  } else {
    report += `
## Current Plan
`;
    report += `\u274C No active plan
`;
  }
  report += `
## Next Steps
`;
  if (prds.length === 0) {
    report += `- Run /prd to create your first Product Requirements Document
`;
  } else if (rfcs.length === 0) {
    report += `- Run /rfc to create technical design from your PRD
`;
  } else if (plans.length === 0) {
    report += `- Run /plan to generate an execution plan from your RFC
`;
  } else {
    report += `- Run /work to continue with your current plan
`;
    report += `- Run /review to get code review feedback
`;
  }
  return report;
}
function addNotepadEntry(projectDir, notepadType, entry) {
  const pepperDir = join(projectDir, ".pepper");
  if (!existsSync(pepperDir)) {
    return "\u274C Pepper harness not initialized. Run /pepper-init first.";
  }
  const notepadPath = join(pepperDir, "notepad", `${notepadType}.json`);
  if (!existsSync(notepadPath)) {
    return `\u274C Notepad file not found: ${notepadType}.json`;
  }
  try {
    const content = readFileSync(notepadPath, "utf-8");
    const notepad = JSON.parse(content);
    notepad.entries.push({
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      content: entry
    });
    writeFileSync(notepadPath, JSON.stringify(notepad, null, 2));
    return `\u2705 Added entry to ${notepadType} notepad

"${entry}"`;
  } catch (error) {
    console.error(`Failed to add notepad entry:`, error);
    return `\u274C Failed to add entry: ${error instanceof Error ? error.message : String(error)}`;
  }
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
      }),
      "pepper_status": tool({
        description: "Get the current status of the Pepper harness including PRDs, RFCs, plans, and state",
        args: {},
        execute: async (args, context) => {
          log("\u{1F527} pepper_status tool executing");
          const result = getPepperStatus(ctx.directory);
          log(`\u2705 pepper_status returned status report`);
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
          log(`\u{1F527} pepper_notepad_add tool executing (type: ${args.notepadType})`);
          const result = addNotepadEntry(ctx.directory, args.notepadType, args.entry);
          log(`\u2705 pepper_notepad_add: ${result.substring(0, 100)}`);
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
