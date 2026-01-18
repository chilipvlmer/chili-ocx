import type { PluginInput } from "@opencode-ai/plugin";
import { existsSync } from "fs";
import { join } from "path";
import { readPepperPlan } from "../../utils/pepper-io";
import { findCurrentTask, determineAgentFromTask } from "../../utils/plan-parser";
import { switchToAgent } from "../../utils/agent-switch";

export async function handleWork(
  ctx: PluginInput,
  sessionID: string,
  args: string[]
): Promise<string | void> {
  // Check .pepper/ exists
  const pepperDir = join(ctx.directory, ".pepper");
  if (!existsSync(pepperDir)) {
    return "❌ .pepper/ not initialized. Run /pepper-init first.";
  }
  
  // Read plan
  const plan = readPepperPlan(ctx.directory);
  if (!plan) {
    return "❌ No plan found. Run /plan to create an execution plan.";
  }
  
  // Find current task
  const currentTask = findCurrentTask(plan);
  if (!currentTask) {
    return `❌ No current task marked in plan.

Add ← CURRENT marker to a task in .pepper/plan.md to indicate what to work on next.`;
  }
  
  // Determine agent
  const agent = determineAgentFromTask(currentTask);
  
  // Build prompt with context
  const prompt = `Continue working on this task:

${currentTask.description}

Context:
- Refer to .pepper/plan.md for the full plan
- Refer to .pepper/specs/ for requirements
- Mark the task as complete when done`;
  
  // Switch to agent
  await switchToAgent(ctx, sessionID, agent, prompt);
  
  // No return - agent switch happens
}
