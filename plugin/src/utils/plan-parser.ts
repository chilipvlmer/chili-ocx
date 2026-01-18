export type Task = {
  description: string;
  line: number;
  isCurrent: boolean;
};

export function findCurrentTask(planContent: string): Task | null {
  const lines = planContent.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("← CURRENT")) {
      return {
        description: line.replace("← CURRENT", "").trim(),
        line: i,
        isCurrent: true
      };
    }
  }
  
  return null;
}

export function determineAgentFromTask(task: Task): string {
  const desc = task.description.toLowerCase();
  
  // Pattern matching to determine agent
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
  
  // Default to orchestrator
  return "scoville-orchestrator";
}
