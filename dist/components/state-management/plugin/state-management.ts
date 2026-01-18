import { definePlugin } from "@opencode-ai/plugin";
import { StateSchema, defaultState, type State } from "./schemas";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const PEPPER_DIR = ".pepper";
const STATE_FILE = "state.json";
const PLAN_FILE = "plan.md";
const NOTEPAD_DIR = "notepad";

// --- Helper Functions (Parse at Boundary, Fail Fast) ---

function resolvePepperPath(config: { cwd?: string }): string {
  const projectRoot = config.cwd || process.cwd();
  return join(projectRoot, PEPPER_DIR);
}

async function loadState(pepperPath: string): Promise<State> {
  const statePath = join(pepperPath, STATE_FILE);

  if (!existsSync(statePath)) {
    return { ...defaultState };
  }

  try {
    const content = await readFile(statePath, "utf-8");
    const parsed = JSON.parse(content);
    // Parse at boundary - trust internally after this
    return StateSchema.parse(parsed);
  } catch {
    // Fail fast with fallback - corrupted state shouldn't crash
    return { ...defaultState };
  }
}

async function saveState(pepperPath: string, state: State): Promise<void> {
  const statePath = join(pepperPath, STATE_FILE);
  await writeFile(statePath, JSON.stringify(state, null, 2));
}

async function initializePepperDirectory(pepperPath: string): Promise<void> {
  // Create directory structure
  await mkdir(pepperPath, { recursive: true });
  await mkdir(join(pepperPath, "specs", "prd"), { recursive: true });
  await mkdir(join(pepperPath, "specs", "rfc"), { recursive: true });
  await mkdir(join(pepperPath, "plans"), { recursive: true });
  await mkdir(join(pepperPath, "tracking"), { recursive: true });
  await mkdir(join(pepperPath, NOTEPAD_DIR), { recursive: true });
  await mkdir(join(pepperPath, "drafts"), { recursive: true });

  // Create default state
  await saveState(pepperPath, defaultState);

  // Create empty notepad files
  const emptyNotepad = { version: "1.0.0", entries: [] };
  await writeFile(
    join(pepperPath, NOTEPAD_DIR, "learnings.json"),
    JSON.stringify(emptyNotepad, null, 2)
  );
  await writeFile(
    join(pepperPath, NOTEPAD_DIR, "issues.json"),
    JSON.stringify(emptyNotepad, null, 2)
  );
  await writeFile(
    join(pepperPath, NOTEPAD_DIR, "decisions.json"),
    JSON.stringify(emptyNotepad, null, 2)
  );

  // Create empty tracking file
  await writeFile(
    join(pepperPath, "tracking", "rfc-status.json"),
    JSON.stringify({}, null, 2)
  );
}

async function findCurrentMarkerInPlan(pepperPath: string): Promise<string | null> {
  const planPath = join(pepperPath, PLAN_FILE);

  if (!existsSync(planPath)) {
    return null;
  }

  try {
    const planContent = await readFile(planPath, "utf-8");
    const currentMatch = planContent.match(/^.*← CURRENT.*$/m);
    return currentMatch ? currentMatch[0] : null;
  } catch {
    return null;
  }
}

async function buildResumeContext(pepperPath: string): Promise<string> {
  const parts: string[] = [];

  parts.push("## Pepper Session Resume Context\n");

  // Load state
  const state = await loadState(pepperPath);

  if (state.active_plan) {
    parts.push(`**Active Plan:** ${state.active_plan}`);
  }
  if (state.current_task) {
    parts.push(`**Current Task:** ${state.current_task}`);
  }
  if (state.auto_continue !== undefined) {
    parts.push(`**Auto-continue:** ${state.auto_continue ? "enabled" : "disabled"}`);
  }

  // Find resume point from plan
  const currentMarker = await findCurrentMarkerInPlan(pepperPath);
  if (currentMarker) {
    parts.push(`\n**Resume Point:**\n\`\`\`\n${currentMarker}\n\`\`\``);
  }

  // Include plan reference
  if (existsSync(join(pepperPath, PLAN_FILE))) {
    parts.push("\n**Plan Summary:**");
    parts.push("Review `.pepper/plan.md` for full context.");
  }

  // Notepad reminder - always include
  parts.push("\n**Notepad Reminder:**");
  parts.push("Check `.pepper/notepad/` for learnings, issues, and decisions from previous sessions.");

  return parts.join("\n");
}

// --- Plugin Definition ---

export default definePlugin({
  name: "pepper-state-management",
  version: "0.1.0",

  hooks: {
    // Initialize .pepper/ structure if needed
    "session.start": async ({ session, config }) => {
      const pepperPath = resolvePepperPath(config);

      // Early exit: skip if already initialized
      if (!existsSync(pepperPath)) {
        await initializePepperDirectory(pepperPath);
      }

      // Load and update state with current session
      const state = await loadState(pepperPath);

      // Guard: don't duplicate session IDs
      if (state.session_ids.includes(session.id)) {
        return;
      }

      state.session_ids.push(session.id);
      await saveState(pepperPath, state);
    },

    // Handle context compaction - re-inject essential state
    "session.compacting": async ({ config }) => {
      const pepperPath = resolvePepperPath(config);

      // Early exit: nothing to inject if no .pepper/
      if (!existsSync(pepperPath)) {
        return { inject: "" };
      }

      const resumeContext = await buildResumeContext(pepperPath);

      return {
        inject: resumeContext,
      };
    },

    // Clean up session ID on end
    "session.end": async ({ session, config }) => {
      const pepperPath = resolvePepperPath(config);
      const statePath = join(pepperPath, STATE_FILE);

      // Early exit: nothing to clean if no state file
      if (!existsSync(statePath)) {
        return;
      }

      const state = await loadState(pepperPath);
      state.session_ids = state.session_ids.filter((id) => id !== session.id);
      await saveState(pepperPath, state);
    },
  },
});
