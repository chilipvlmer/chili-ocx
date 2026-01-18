import { definePlugin } from "@opencode-ai/plugin";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

// --- Helper Functions (Parse at Boundary, Early Exit) ---

function resolvePepperPath(config: { cwd?: string }): string {
  const projectRoot = config.cwd || process.cwd();
  return join(projectRoot, ".pepper");
}

async function isAutoReviewEnabled(config: { cwd?: string }): Promise<boolean> {
  const pepperPath = resolvePepperPath(config);
  const statePath = join(pepperPath, "state.json");

  // Early exit: default to enabled if no state file
  if (!existsSync(statePath)) {
    return true;
  }

  try {
    const content = await readFile(statePath, "utf-8");
    const state = JSON.parse(content);
    // Default to true if not specified
    return state.auto_review !== false;
  } catch {
    // Fail fast with sensible default - enabled
    return true;
  }
}

function containsCodeChanges(result: string | undefined): boolean {
  // Early exit: no result means no changes
  if (!result) {
    return false;
  }

  // Check for common patterns indicating no code changes
  const noChangePatterns = [
    /no changes/i,
    /nothing to commit/i,
    /no modifications/i,
    /already up.to.date/i,
  ];

  return !noChangePatterns.some((pattern) => pattern.test(result));
}

// --- Plugin Definition ---

export default definePlugin({
  name: "pepper-auto-review",
  version: "0.1.0",

  hooks: {
    // Trigger after coder task completes
    "task.complete": async ({ task, result, config }) => {
      // Early exit: only trigger for Jalapeño (coder) tasks
      if (task.agent !== "jalapeno" && task.agent !== "coder") {
        return;
      }

      // Early exit: skip if result indicates no code changes
      if (!containsCodeChanges(result)) {
        return;
      }

      // Early exit: skip if auto-review is disabled
      const autoReviewEnabled = await isAutoReviewEnabled(config);
      if (!autoReviewEnabled) {
        return;
      }

      // Notify user that review is starting
      console.log("🔥 Auto-triggering Habanero review...");

      // Return instruction for orchestrator to trigger review
      return {
        followUp: {
          agent: "habanero",
          prompt: `Review the changes just made by Jalapeño.

## Context
${task.prompt || "Code implementation task"}

## Review Scope
Review the recent changes for:
- Correctness
- Security
- Performance
- Style

Use the code-review skill methodology.
Provide a summary of findings.`,
        },
      };
    },
  },
});
