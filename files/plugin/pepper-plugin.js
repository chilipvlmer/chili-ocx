// dist/index.js
import { tool as tool2 } from "@opencode-ai/plugin";

// dist/utils/pepper-io.js
import { existsSync, mkdirSync, readFileSync, writeFileSync as writeFileSync2, readdirSync } from "fs";
import { join } from "path";

// dist/utils/workspace.js
import * as fs from "fs";
import * as path from "path";
var WorkspaceError = class _WorkspaceError extends Error {
  code;
  cause;
  /**
   * @param message - Human-readable error message
   * @param code - Optional error code (e.g., ENOENT, EACCES)
   * @param cause - Optional underlying error
   */
  constructor(message, code, cause) {
    super(message);
    this.code = code;
    this.cause = cause;
    this.name = "WorkspaceError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _WorkspaceError);
    }
  }
};
function resolveWorkspacePath(workspacePath) {
  if (!workspacePath || typeof workspacePath !== "string") {
    throw new WorkspaceError("Path must be a non-empty string");
  }
  const absolutePath = path.resolve(workspacePath);
  try {
    const realPath = fs.realpathSync(absolutePath);
    return realPath;
  } catch (error) {
    const err = error;
    if (err.code === "ENOENT") {
      throw new WorkspaceError(`Path does not exist: ${absolutePath}`, "ENOENT", err);
    }
    if (err.code === "EACCES" || err.code === "EPERM") {
      throw new WorkspaceError(`Permission denied accessing path: ${absolutePath}`, err.code, err);
    }
    if (err.code === "ELOOP") {
      throw new WorkspaceError(`Circular symlink detected: ${absolutePath}`, "ELOOP", err);
    }
    throw new WorkspaceError(`Failed to resolve workspace path: ${err.message}`, err.code, err);
  }
}
function isSymlink(workspacePath) {
  if (!workspacePath || typeof workspacePath !== "string") {
    throw new WorkspaceError("Path must be a non-empty string");
  }
  const absolutePath = path.resolve(workspacePath);
  try {
    const stats = fs.lstatSync(absolutePath);
    return stats.isSymbolicLink();
  } catch (error) {
    const err = error;
    if (err.code === "ENOENT") {
      throw new WorkspaceError(`Path does not exist: ${absolutePath}`, "ENOENT", err);
    }
    if (err.code === "EACCES" || err.code === "EPERM") {
      throw new WorkspaceError(`Permission denied accessing path: ${absolutePath}`, err.code, err);
    }
    throw new WorkspaceError(`Failed to check symlink status: ${err.message}`, err.code, err);
  }
}
function getWorkspaceInfo(workspacePath) {
  if (!workspacePath || typeof workspacePath !== "string") {
    throw new WorkspaceError("Path must be a non-empty string");
  }
  const absolutePath = path.resolve(workspacePath);
  const isSymlinkPath = isSymlink(absolutePath);
  const realPath = resolveWorkspacePath(absolutePath);
  const info = {
    symlink: isSymlinkPath ? absolutePath : null,
    real: realPath,
    isSymlink: isSymlinkPath,
    resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  return info;
}

// dist/utils/logger.js
import { writeFileSync } from "fs";
var LOG_FILE = "/tmp/chili-ocx-plugin.log";
var DEBUG_MODE = process.env.CHILI_OCX_DEBUG === "1";
function log(msg, level = "INFO") {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const line = `[${timestamp}] [${level}] ${msg}
`;
  if (DEBUG_MODE) {
    if (level === "ERROR") {
      console.error(msg);
    } else {
      console.log(msg);
    }
  }
  try {
    writeFileSync(LOG_FILE, line, { flag: "a" });
  } catch (e) {
  }
}
function logInfo(msg) {
  log(msg, "INFO");
}
function logError(msg) {
  log(msg, "ERROR");
}

// dist/utils/pepper-io.js
function initPepperStructure(projectDir) {
  let workspaceInfo;
  try {
    workspaceInfo = getWorkspaceInfo(projectDir);
  } catch (error) {
    if (error instanceof WorkspaceError) {
      return `\u274C Failed to resolve workspace path: ${error.message}

Please ensure:
- The path exists and is accessible
- You have permission to read the directory
- If using a symlink, the target exists`;
    }
    throw error;
  }
  const resolvedDir = workspaceInfo.real;
  const pepperDir = join(resolvedDir, ".pepper");
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
    version: "1.1.0",
    initialized: (/* @__PURE__ */ new Date()).toISOString(),
    workspacePath: {
      symlink: workspaceInfo.symlink,
      real: workspaceInfo.real,
      isSymlink: workspaceInfo.isSymlink,
      resolvedAt: workspaceInfo.resolvedAt
    },
    session_ids: [],
    auto_continue: false
  };
  writeFileSync2(join(pepperDir, "state.json"), JSON.stringify(initialState, null, 2));
  const emptyNotepad = {
    version: "1.0.0",
    entries: []
  };
  for (const notepadFile of ["learnings.json", "issues.json", "decisions.json"]) {
    writeFileSync2(join(pepperDir, "notepad", notepadFile), JSON.stringify(emptyNotepad, null, 2));
  }
  writeFileSync2(join(pepperDir, "tracking/rfc-status.json"), "{}");
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
  writeFileSync2(join(pepperDir, "plan.md"), planTemplate);
  let successMessage = `\u2705 Initialized .pepper/ structure`;
  if (workspaceInfo.isSymlink) {
    successMessage += `

\u{1F4CD} Workspace resolved:
`;
    successMessage += `  Symlink: ${workspaceInfo.symlink}
`;
    successMessage += `  Real path: ${workspaceInfo.real}`;
  }
  successMessage += `

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
  return successMessage;
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
    logError(`Failed to read state.json: ${error}`);
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
    logError(`Failed to read plan.md: ${error}`);
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
    writeFileSync2(notepadPath, JSON.stringify(notepad, null, 2));
    return `\u2705 Added entry to ${notepadType} notepad

"${entry}"`;
  } catch (error) {
    logError(`Failed to add notepad entry: ${error}`);
    return `\u274C Failed to add entry: ${error instanceof Error ? error.message : String(error)}`;
  }
}

// dist/skills/registry.js
import { tool } from "@opencode-ai/plugin";

// dist/skills/runner.js
import { exec } from "child_process";
import { readFile, stat, readdir } from "fs/promises";
import { promisify } from "util";
import { join as join2, basename } from "path";
var execAsync = promisify(exec);
var SkillRunner = class {
  skill;
  inputs;
  context;
  constructor(skill, inputs) {
    this.skill = skill;
    this.inputs = inputs;
    this.context = {
      inputs,
      steps: {}
    };
  }
  /**
   * Execute the skill steps sequentially
   */
  async execute() {
    console.log(`[SkillRunner] Starting execution of skill: ${this.skill.name}`);
    for (const step of this.skill.steps) {
      console.log(`[SkillRunner] Executing step: ${step.name} (${step.type})`);
      try {
        const output = await this.executeStep(step);
        this.context.steps[step.name] = output;
      } catch (error) {
        if (error.name === "InteractiveHaltError") {
          console.log(`[SkillRunner] Execution halted for interactive confirmation.`);
          this.context.halted = true;
          this.context.proposal = error.message;
          return this.context;
        }
        console.error(`[SkillRunner] Step ${step.name} failed:`, error);
        throw error;
      }
    }
    console.log(`[SkillRunner] Execution complete.`);
    return this.context;
  }
  async executeStep(step) {
    switch (step.type) {
      case "shell":
        return this.runShellStep(step);
      case "regex_scan":
        return this.runRegexScanStep(step);
      case "llm_generate":
        return this.runLlmGenerateStep(step);
      case "interactive":
        return this.runInteractiveStep(step);
      default:
        console.warn(`[SkillRunner] Unknown step type: ${step.type}. Skipping.`);
        return { skipped: true, reason: "unknown_type" };
    }
  }
  resolveVariables(template) {
    if (typeof template !== "string")
      return template;
    return template.replace(/\$\{([^}]+)\}/g, (_, expression) => {
      const [path2, defaultValue] = expression.split("||").map((s) => s.trim());
      const value = this.getValueByPath(path2);
      if (value === void 0 || value === null || value === "") {
        if (defaultValue) {
          return defaultValue.replace(/^['"]|['"]$/g, "");
        }
        return "";
      }
      return String(value);
    });
  }
  getValueByPath(path2) {
    const parts = path2.split(".");
    let current = this.context;
    for (const part of parts) {
      if (current === void 0 || current === null)
        return void 0;
      current = current[part];
    }
    return current;
  }
  async runShellStep(step) {
    const rawCommand = step.command;
    if (!rawCommand)
      throw new Error(`Step ${step.name} (shell) missing 'command' property`);
    const command = this.resolveVariables(rawCommand);
    this.checkPermission(command);
    console.log(`[SkillRunner] Shell command: ${command}`);
    const cwd = step.cwd ? this.resolveVariables(step.cwd) : process.cwd();
    try {
      const { stdout, stderr } = await execAsync(command, { cwd });
      return {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: 0
        // execAsync throws if exitCode != 0
      };
    } catch (error) {
      if (step.ignore_errors) {
        return {
          stdout: error.stdout?.trim(),
          stderr: error.stderr?.trim(),
          exitCode: error.code,
          error: error.message
        };
      }
      throw error;
    }
  }
  /**
   * Basic permission check for shell commands
   */
  checkPermission(command) {
    const trimmed = command.trim();
    if (trimmed.startsWith("git "))
      return;
    if (trimmed.startsWith("npm test"))
      return;
    if (trimmed.includes("rm -rf /")) {
      throw new Error(`[Security] Command blocked: ${command}`);
    }
    console.warn(`[Security] Unchecked command allowed: ${command}`);
  }
  async runRegexScanStep(step) {
    const rawFile = step.file;
    const rawPattern = step.pattern;
    if (!rawFile)
      throw new Error(`Step ${step.name} (regex_scan) missing 'file' property`);
    if (!rawPattern)
      throw new Error(`Step ${step.name} (regex_scan) missing 'pattern' property`);
    const filePath = this.resolveVariables(rawFile) || ".";
    const filesToScan = [];
    const cwd = process.cwd();
    let usedGit = false;
    try {
      const { stdout } = await execAsync("git rev-parse --is-inside-work-tree", { cwd });
      if (stdout.trim() === "true") {
        const cmd = `git ls-files --cached --others --exclude-standard "${filePath}"`;
        const { stdout: filesOut } = await execAsync(cmd, { cwd, maxBuffer: 10 * 1024 * 1024 });
        const gitFiles = filesOut.split("\n").filter((f) => f.trim() !== "");
        if (gitFiles.length > 0) {
          filesToScan.push(...gitFiles);
          usedGit = true;
        }
      }
    } catch (e) {
      console.warn(`[SkillRunner] git ls-files failed, falling back to recursive scan:`, e);
    }
    if (!usedGit) {
      const collectFiles = async (dir) => {
        try {
          const entries = await readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            const res = join2(dir, entry.name);
            if (entry.isDirectory()) {
              if (entry.name !== ".git" && entry.name !== "node_modules") {
                await collectFiles(res);
              }
            } else {
              filesToScan.push(res);
            }
          }
        } catch (err) {
          if (err.code === "ENOTDIR") {
            filesToScan.push(dir);
          }
        }
      };
      if (filePath.includes("*")) {
        console.warn(`[SkillRunner] Globs not fully supported in fallback mode. Using as-is: ${filePath}`);
        filesToScan.push(filePath);
      } else {
        await collectFiles(filePath);
      }
    }
    for (const file of filesToScan) {
      if (file.includes("*"))
        continue;
      const resolvedPath = file.startsWith("/") ? file : join2(cwd, file);
      try {
        const stats = await stat(resolvedPath);
        if (!stats.isFile())
          continue;
        const content = await readFile(resolvedPath, "utf-8");
        let safePattern = rawPattern;
        let flags = step.flags || "g";
        if (safePattern.startsWith("(?i)")) {
          safePattern = safePattern.substring(4);
          if (!flags.includes("i"))
            flags += "i";
        }
        const regex = new RegExp(safePattern, flags);
        const found = regex.test(content);
        if (step.fail_if_match && found) {
          throw new Error(`[Security] Regex match found in ${file}: ${rawPattern}`);
        }
        if (step.fail_if_no_match && !found) {
          throw new Error(`[Validation] Regex NOT found in ${file}: ${rawPattern}`);
        }
      } catch (err) {
        if (err.code === "ENOENT") {
          console.warn(`[SkillRunner] File not found for scan: ${resolvedPath}`);
          continue;
        }
        throw err;
      }
    }
    return {
      scanned: filesToScan,
      status: "clean"
    };
  }
  async runLlmGenerateStep(step) {
    console.log(`[SkillRunner] LLM Generation (STUB) for step: ${step.name}`);
    const prompt = this.resolveVariables(step.prompt || "");
    let message = "chore: update file";
    const fileMatch = prompt.match(/File:\s*(.+)/);
    if (fileMatch) {
      const filename = basename(fileMatch[1].trim());
      message = `fix(${filename}): update ${filename}`;
    }
    if (prompt.length > 1e4) {
      console.warn(`[SkillRunner] Diff is too large (${prompt.length} chars). Summarizing.`);
      try {
        const cwd = this.context.steps?.status?.cwd || process.cwd();
        const { stdout: statOut } = await execAsync("git diff --stat --cached", { cwd });
        message = `feat: large update with ${statOut.split("\n").length} files changed`;
        const lines = statOut.trim().split("\n");
        if (lines.length > 0) {
          const summaryLine = lines[lines.length - 1];
          message = `feat: ${summaryLine.trim()}`;
        }
      } catch (e) {
        console.warn(`[SkillRunner] Failed to get git diff stat:`, e);
        message = message.replace("fix", "feat").replace("update", "major update to");
      }
    }
    if (step.mock_output) {
      message = step.mock_output;
    }
    return {
      content: message,
      model: "heuristic-v1"
    };
  }
  async runInteractiveStep(step) {
    const confirm = this.inputs.confirm;
    console.log(`[SkillRunner] Interactive step '${step.name}'. Confirm=${confirm}`);
    if (confirm === true || confirm === "true") {
      console.log(`[SkillRunner] User confirmed step '${step.name}'. Continuing.`);
      return { confirmed: true };
    }
    const previousStepName = step.input_source;
    let previousOutput = "No output available";
    if (previousStepName && this.context.steps[previousStepName]) {
      const prev = this.context.steps[previousStepName];
      previousOutput = prev.content || prev.stdout || JSON.stringify(prev);
    } else {
      const stepNames = Object.keys(this.context.steps);
      if (stepNames.length > 0) {
        const last = this.context.steps[stepNames[stepNames.length - 1]];
        previousOutput = last.content || last.stdout || JSON.stringify(last);
      }
    }
    const proposalMsg = `PROPOSAL: ${previousOutput}. To execute, re-run with confirm=true.`;
    throw new InteractiveHaltError(proposalMsg);
  }
};
var InteractiveHaltError = class extends Error {
  proposal;
  constructor(proposal) {
    super(proposal);
    this.proposal = proposal;
    this.name = "InteractiveHaltError";
  }
};

// dist/skills/registry.js
var SkillRegistry = class {
  skills;
  constructor() {
    this.skills = /* @__PURE__ */ new Map();
  }
  /**
   * Register a new skill
   */
  register(skill) {
    if (this.skills.has(skill.name)) {
      console.warn(`Overwriting existing skill: ${skill.name}`);
    }
    this.skills.set(skill.name, skill);
  }
  /**
   * Get all registered skills
   */
  getSkills() {
    return Array.from(this.skills.values());
  }
  /**
   * Get a specific skill by name
   */
  getSkill(name) {
    return this.skills.get(name);
  }
  /**
   * Generate tool definitions for all registered skills.
   *
   * Each skill becomes a tool named `skill_<skill_name>`.
   * The tool's arguments are derived from the skill's `inputs` definition.
   *
   * @returns A record of tool definitions compatible with the plugin system
   */
  getTools() {
    const tools = {};
    for (const skill of this.skills.values()) {
      const toolName = `skill_${skill.name}`;
      const argsSchema = {};
      if (skill.inputs) {
        for (const [key, config] of Object.entries(skill.inputs)) {
          const type = config.type || "string";
          const description = config.description || "";
          let schemaBuilder;
          switch (type) {
            case "string":
              schemaBuilder = tool.schema.string();
              break;
            case "number":
              schemaBuilder = tool.schema.number();
              break;
            case "boolean":
              schemaBuilder = tool.schema.boolean();
              break;
            // TODO: Add support for enums/arrays if needed by skill spec
            default:
              schemaBuilder = tool.schema.string();
          }
          if (description) {
            schemaBuilder = schemaBuilder.describe(description);
          }
          argsSchema[key] = schemaBuilder;
        }
      }
      tools[toolName] = tool({
        description: `[SKILL] ${skill.description}`,
        args: argsSchema,
        execute: async (args, context) => {
          try {
            const runner = new SkillRunner(skill, args);
            const result = await runner.execute();
            return JSON.stringify(result, null, 2);
          } catch (error) {
            console.error(`Skill ${skill.name} failed:`, error);
            throw new Error(`Skill execution failed: ${error.message}`);
          }
        }
      });
    }
    return tools;
  }
};

// dist/skills/loader.js
import { readFile as readFile2, readdir as readdir2, stat as stat2 } from "fs/promises";
import { join as join3, basename as basename2, extname } from "path";
function parseYamlLike(text) {
  const result = {};
  const lines = text.split("\n");
  let currentKey = null;
  let multilineValue = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#"))
      continue;
    const match = trimmed.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) {
      if (currentKey) {
        if (multilineValue.length > 0) {
          result[currentKey] = multilineValue.join("\n").trim();
        }
        multilineValue = [];
      }
      const key = match[1];
      const value = match[2];
      if (value) {
        if (value === "true")
          result[key] = true;
        else if (value === "false")
          result[key] = false;
        else if (!isNaN(Number(value)))
          result[key] = Number(value);
        else
          result[key] = value;
        currentKey = null;
      } else {
        currentKey = key;
        result[key] = "";
      }
    } else if (currentKey) {
      multilineValue.push(line);
    }
  }
  if (currentKey && multilineValue.length > 0) {
    result[currentKey] = multilineValue.join("\n").trim();
  }
  return result;
}
async function parseSkill(filePath) {
  const content = await readFile2(filePath, "utf-8");
  const filename = basename2(filePath, extname(filePath));
  const fmRegex = /^---\n([\s\S]*?)\n---/;
  const fmMatch = content.match(fmRegex);
  let metadata = {};
  let body = content;
  if (fmMatch) {
    metadata = parseYamlLike(fmMatch[1]);
    body = content.substring(fmMatch[0].length);
  }
  const skill = {
    id: filename,
    name: metadata.name || filename,
    description: metadata.description || "",
    version: metadata.version || "0.0.1",
    steps: [],
    ...metadata
  };
  const stepSplitRegex = /^##\s+(.*)$/gm;
  let match;
  const indices = [];
  while ((match = stepSplitRegex.exec(body)) !== null) {
    indices.push({ name: match[1].trim(), start: match.index });
  }
  for (let i = 0; i < indices.length; i++) {
    const current = indices[i];
    const next = indices[i + 1];
    const startPos = current.start + `## ${current.name}`.length;
    const endPos = next ? next.start : body.length;
    const stepContent = body.substring(startPos, endPos).trim();
    const stepConfig = parseYamlLike(stepContent);
    skill.steps.push({
      name: current.name,
      type: stepConfig.type || "unknown",
      ...stepConfig
    });
  }
  return skill;
}
async function loadSkills(dir) {
  try {
    const stats = await stat2(dir);
    if (!stats.isDirectory())
      return [];
    const files = await readdir2(dir);
    const skills = [];
    for (const file of files) {
      if (file.endsWith(".md")) {
        try {
          const skill = await parseSkill(join3(dir, file));
          skills.push(skill);
        } catch (err) {
          console.error(`Failed to parse skill ${file}:`, err);
        }
      }
    }
    return skills;
  } catch (error) {
    return [];
  }
}

// dist/index.js
import { join as join4 } from "path";
import * as fs2 from "fs";
function logToTmp(msg) {
  try {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    fs2.appendFileSync("/tmp/pepper-debug.log", `[${timestamp}] ${msg}
`);
  } catch (e) {
  }
}
var ChiliOcxPlugin = async (ctx) => {
  try {
    logToTmp("Plugin initializing...");
    logInfo("\u{1F336}\uFE0F chili-ocx plugin initializing...");
    logInfo(`  Context directory: ${ctx.directory}`);
    const tools = {
      "pepper_init": tool2({
        description: "Initialize the Pepper harness .pepper/ directory structure in the current project",
        args: {},
        execute: async (args, context) => {
          logInfo("\u{1F527} pepper_init tool executing");
          const result = initPepperStructure(ctx.directory);
          logInfo(`\u2705 pepper_init result: ${result.substring(0, 100)}`);
          return result;
        }
      }),
      "pepper_status": tool2({
        description: "Get the current status of the Pepper harness including PRDs, RFCs, plans, and state",
        args: {},
        execute: async (args, context) => {
          logInfo("\u{1F527} pepper_status tool executing");
          const result = getPepperStatus(ctx.directory);
          logInfo(`\u2705 pepper_status returned status report`);
          return result;
        }
      }),
      "pepper_notepad_add": tool2({
        description: "Add an entry to one of the Pepper notepads (learnings, issues, or decisions)",
        args: {
          notepadType: tool2.schema.enum(["learnings", "issues", "decisions"]).describe("Type of notepad: learnings, issues, or decisions"),
          entry: tool2.schema.string().describe("The content to add to the notepad")
        },
        execute: async (args, context) => {
          logInfo(`\u{1F527} pepper_notepad_add tool executing (type: ${args.notepadType})`);
          const result = addNotepadEntry(ctx.directory, args.notepadType, args.entry);
          logInfo(`\u2705 pepper_notepad_add: ${result.substring(0, 100)}`);
          return result;
        }
      })
    };
    const skillsDirs = [
      join4(ctx.directory, ".opencode/skills")
    ];
    logInfo(`\u{1F50D} Scanning for skills in: ${skillsDirs.join(", ")}`);
    let allSkills = [];
    for (const dir of skillsDirs) {
      logToTmp(`Scanning directory: ${dir}`);
      const exists = fs2.existsSync(dir);
      logToTmp(`Directory exists? ${exists}`);
      const skills = await loadSkills(dir);
      allSkills = allSkills.concat(skills);
    }
    logToTmp(`Found ${allSkills.length} skills`);
    if (allSkills.length > 0) {
      logInfo(`\u{1F4E6} Found ${allSkills.length} skills. Registering...`);
      const registry = new SkillRegistry();
      allSkills.forEach((skill) => registry.register(skill));
      const skillTools = registry.getTools();
      Object.assign(tools, skillTools);
      logInfo(`\u2705 Registered ${Object.keys(skillTools).length} skill tools.`);
    } else {
      logInfo("\u2139\uFE0F No custom skills found.");
    }
    logInfo(`\u{1F4CB} Registered ${Object.keys(tools).length} custom tools (total)`);
    logInfo("\u2705 chili-ocx plugin loaded successfully");
    return { tool: tools };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    logToTmp(`Error: ${errorStack}`);
    logInfo(`\u274C chili-ocx plugin failed to load: ${errorMsg}`);
    logInfo(`Stack: ${errorStack}`);
    throw error;
  }
};
var index_default = ChiliOcxPlugin;
export {
  index_default as default
};
