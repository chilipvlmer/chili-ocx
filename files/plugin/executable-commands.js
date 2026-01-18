// dist/commands/loader.js
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
var EXECUTE_MODE_COMMANDS = /* @__PURE__ */ new Set([
  "pepper-init",
  "status",
  "notepad",
  "auto-continue"
]);
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: content };
  }
  const [, frontmatterText, body] = match;
  const data = {};
  for (const line of frontmatterText.split("\n")) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      data[key.trim()] = valueParts.join(":").trim();
    }
  }
  return {
    data,
    body: body.trim()
  };
}
function discoverOcxCommands() {
  const commandDir = join(homedir(), ".config/opencode/profiles/default/.opencode/command");
  if (!existsSync(commandDir)) {
    console.log("\u26A0\uFE0F No OCX commands directory found at:", commandDir);
    return [];
  }
  const commands = [];
  const entries = readdirSync(commandDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory())
      continue;
    const commandPath = join(commandDir, entry.name, "COMMAND.md");
    if (!existsSync(commandPath))
      continue;
    try {
      const content = readFileSync(commandPath, "utf-8");
      const { data, body } = parseFrontmatter(content);
      const commandInfo = {
        name: data.name || entry.name,
        agent: data.agent,
        description: data.description || "",
        content: body,
        argumentHint: data["argument-hint"],
        executionMode: EXECUTE_MODE_COMMANDS.has(entry.name) ? "execute" : "delegate"
      };
      commands.push(commandInfo);
    } catch (error) {
      console.error(`Failed to load command ${entry.name}:`, error);
      continue;
    }
  }
  console.log(`\u{1F336}\uFE0F Discovered ${commands.length} OCX commands`);
  return commands;
}

// dist/utils/pepper-io.js
import { existsSync as existsSync2, mkdirSync, readFileSync as readFileSync2, writeFileSync } from "fs";
import { join as join2 } from "path";
function initPepperStructure(projectDir) {
  const pepperDir = join2(projectDir, ".pepper");
  if (existsSync2(pepperDir)) {
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
    mkdirSync(join2(pepperDir, dir), { recursive: true });
  }
  const initialState = {
    version: "1.0.0",
    session_ids: [],
    auto_continue: false
  };
  writeFileSync(join2(pepperDir, "state.json"), JSON.stringify(initialState, null, 2));
  const emptyNotepad = {
    version: "1.0.0",
    entries: []
  };
  for (const notepadFile of ["learnings.json", "issues.json", "decisions.json"]) {
    writeFileSync(join2(pepperDir, "notepad", notepadFile), JSON.stringify(emptyNotepad, null, 2));
  }
  writeFileSync(join2(pepperDir, "tracking/rfc-status.json"), "{}");
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
  writeFileSync(join2(pepperDir, "plan.md"), planTemplate);
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
  const statePath = join2(projectDir, ".pepper/state.json");
  if (!existsSync2(statePath)) {
    return null;
  }
  try {
    const content = readFileSync2(statePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read state.json:", error);
    return null;
  }
}
function readPepperPlan(projectDir) {
  const planPath = join2(projectDir, ".pepper/plan.md");
  if (!existsSync2(planPath)) {
    return null;
  }
  try {
    return readFileSync2(planPath, "utf-8");
  } catch (error) {
    console.error("Failed to read plan.md:", error);
    return null;
  }
}

// dist/commands/handlers/pepper-init.js
async function handlePepperInit(ctx, args) {
  return initPepperStructure(ctx.directory);
}

// dist/commands/handlers/status.js
import { existsSync as existsSync3, readdirSync as readdirSync2 } from "fs";
import { join as join3 } from "path";
async function handleStatus(ctx, args) {
  const pepperDir = join3(ctx.directory, ".pepper");
  if (!existsSync3(pepperDir)) {
    return "\u274C .pepper/ not initialized\n\nRun /pepper-init to set up the Pepper harness.";
  }
  const state = readPepperState(ctx.directory);
  const plan = readPepperPlan(ctx.directory);
  const sections = [];
  sections.push("# Pepper Harness Status\n");
  if (state) {
    sections.push("## State");
    sections.push(`- Version: ${state.version}`);
    sections.push(`- Active Spec: ${state.active_spec || "(none)"}`);
    sections.push(`- Auto Continue: ${state.auto_continue ? "\u2705 enabled" : "\u274C disabled"}`);
    sections.push("");
  }
  const prdDir = join3(pepperDir, "specs/prd");
  const rfcDir = join3(pepperDir, "specs/rfc");
  const prds = existsSync3(prdDir) ? readdirSync2(prdDir).filter((f) => f.endsWith(".md")) : [];
  const rfcs = existsSync3(rfcDir) ? readdirSync2(rfcDir).filter((f) => f.endsWith(".md")) : [];
  sections.push("## Specifications");
  sections.push(`- PRDs: ${prds.length} (${prds.join(", ") || "none"})`);
  sections.push(`- RFCs: ${rfcs.length} (${rfcs.join(", ") || "none"})`);
  sections.push("");
  if (plan) {
    const currentTaskMatch = plan.match(/^-.*← CURRENT/m);
    if (currentTaskMatch) {
      sections.push("## Current Task");
      sections.push(currentTaskMatch[0].replace("\u2190 CURRENT", "").trim());
      sections.push("");
    }
  }
  sections.push("---");
  sections.push("Run /prd to create a PRD");
  sections.push("Run /work to continue current task");
  return sections.join("\n");
}

// dist/utils/agent-switch.js
async function switchToAgent(ctx, sessionID, agent, prompt) {
  await ctx.client.session.prompt({
    path: { id: sessionID },
    body: {
      agent,
      parts: [{ type: "text", text: prompt }]
    }
  });
}

// dist/commands/handlers/prd.js
async function handlePrd(ctx, sessionID, args) {
  const projectName = args[0];
  const prompt = projectName ? `Create a new PRD for project: ${projectName}` : `Create a new PRD. Please ask me about the project.`;
  await switchToAgent(ctx, sessionID, "seed-prd-rfc", prompt);
}

// dist/commands/handlers/prd-refine.js
async function handlePrdRefine(ctx, sessionID, args) {
  const state = readPepperState(ctx.directory);
  if (!state?.active_spec) {
    return "\u274C No active PRD found. Run /prd to create one first.";
  }
  const prompt = `Refine the active PRD: ${state.active_spec}

Please review the current PRD and ask me questions to improve it.`;
  await switchToAgent(ctx, sessionID, "seed-prd-rfc", prompt);
}

// dist/commands/handlers/rfc.js
async function handleRfc(ctx, sessionID, args) {
  const rfcName = args[0];
  const prompt = rfcName ? `Create a new RFC for: ${rfcName}` : `Create a new RFC (Request for Comments). Please ask me about the technical design.`;
  await switchToAgent(ctx, sessionID, "seed-prd-rfc", prompt);
}

// dist/commands/handlers/rfc-refine.js
async function handleRfcRefine(ctx, sessionID, args) {
  const prompt = `Refine the active RFC.

Please review the current RFC and ask me questions to improve the technical design.`;
  await switchToAgent(ctx, sessionID, "seed-prd-rfc", prompt);
}

// dist/commands/handlers/work.js
import { existsSync as existsSync4 } from "fs";
import { join as join4 } from "path";

// dist/utils/plan-parser.js
function findCurrentTask(planContent) {
  const lines = planContent.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("\u2190 CURRENT")) {
      return {
        description: line.replace("\u2190 CURRENT", "").trim(),
        line: i,
        isCurrent: true
      };
    }
  }
  return null;
}
function determineAgentFromTask(task) {
  const desc = task.description.toLowerCase();
  if (desc.includes("implement") || desc.includes("code") || desc.includes("fix")) {
    return "jalapeno-coder";
  }
  if (desc.includes("document") || desc.includes("readme") || desc.includes("write")) {
    return "chipotle-scribe";
  }
  if (desc.includes("review") || desc.includes("check")) {
    return "habanero-reviewer";
  }
  if (desc.includes("research") || desc.includes("explore")) {
    return "ghost-explorer";
  }
  if (desc.includes("plan")) {
    return "sprout-execution-planner";
  }
  return "scoville-orchestrator";
}

// dist/commands/handlers/work.js
async function handleWork(ctx, sessionID, args) {
  const pepperDir = join4(ctx.directory, ".pepper");
  if (!existsSync4(pepperDir)) {
    return "\u274C .pepper/ not initialized. Run /pepper-init first.";
  }
  const plan = readPepperPlan(ctx.directory);
  if (!plan) {
    return "\u274C No plan found. Run /plan to create an execution plan.";
  }
  const currentTask = findCurrentTask(plan);
  if (!currentTask) {
    return `\u274C No current task marked in plan.

Add \u2190 CURRENT marker to a task in .pepper/plan.md to indicate what to work on next.`;
  }
  const agent = determineAgentFromTask(currentTask);
  const prompt = `Continue working on this task:

${currentTask.description}

Context:
- Refer to .pepper/plan.md for the full plan
- Refer to .pepper/specs/ for requirements
- Mark the task as complete when done`;
  await switchToAgent(ctx, sessionID, agent, prompt);
}

// dist/commands/handlers/index.js
var executeHandlers = {
  "pepper-init": handlePepperInit,
  "status": handleStatus
};
var delegateHandlers = {
  "prd": handlePrd,
  "prd-refine": handlePrdRefine,
  "rfc": handleRfc,
  "rfc-refine": handleRfcRefine,
  "work": handleWork
};

// dist/hooks/command-interceptor.js
function createCommandInterceptor(commands, ctx) {
  return async (input, output) => {
    const textPart = output.parts.find((p) => p.type === "text");
    if (!textPart || typeof textPart.text !== "string") {
      return;
    }
    const text = textPart.text.trim();
    if (!text.startsWith("/")) {
      return;
    }
    const [cmdName, ...args] = text.slice(1).split(/\s+/);
    const command = commands.find((c) => c.name === cmdName);
    if (!command) {
      return;
    }
    if (command.executionMode === "execute") {
      const handler = executeHandlers[command.name];
      if (!handler) {
        textPart.text = `\u26A0\uFE0F No handler implemented for /${cmdName}`;
        return;
      }
      try {
        const result = await handler(ctx, args);
        textPart.text = result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        textPart.text = `\u274C Command failed: ${errorMsg}`;
      }
    } else {
      const sessionID = input.sessionID;
      const handler = delegateHandlers[command.name];
      textPart.text = `\u{1F336}\uFE0F Starting ${cmdName}...

(Switching to ${command.agent || "agent"}...)`;
      setTimeout(async () => {
        try {
          if (handler) {
            const result = await handler(ctx, sessionID, args);
            if (result) {
              console.log("Delegate handler returned:", result);
            }
          } else if (command.agent) {
            await switchToAgent(ctx, sessionID, command.agent, command.content);
          }
        } catch (error) {
          console.error(`Failed to execute command /${cmdName}:`, error);
        }
      }, 100);
    }
  };
}

// dist/index.js
var ChiliOcxPlugin = async (ctx) => {
  console.log("\u{1F336}\uFE0F chili-ocx plugin loaded");
  const commands = discoverOcxCommands();
  console.log(`\u{1F4CB} Loaded commands: ${commands.map((c) => c.name).join(", ")}`);
  return {
    "chat.message": createCommandInterceptor(commands, ctx)
  };
};
var index_default = ChiliOcxPlugin;
export {
  index_default as default
};
