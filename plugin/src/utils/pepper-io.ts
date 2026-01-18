import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

export function initPepperStructure(projectDir: string): string {
  const pepperDir = join(projectDir, ".pepper");
  
  if (existsSync(pepperDir)) {
    return "✅ .pepper/ already initialized\n\nRun /status to see current state.";
  }

  // Create directory structure
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

  // Write initial state.json
  const initialState = {
    version: "1.0.0",
    session_ids: [],
    auto_continue: false
  };

  writeFileSync(
    join(pepperDir, "state.json"),
    JSON.stringify(initialState, null, 2)
  );

  // Write empty notepad files
  const emptyNotepad = {
    version: "1.0.0",
    entries: []
  };

  for (const notepadFile of ["learnings.json", "issues.json", "decisions.json"]) {
    writeFileSync(
      join(pepperDir, "notepad", notepadFile),
      JSON.stringify(emptyNotepad, null, 2)
    );
  }

  // Write empty tracking files
  writeFileSync(
    join(pepperDir, "tracking/rfc-status.json"),
    "{}"
  );

  // Create empty plan.md template
  const planTemplate = `# Execution Plan

> Created: ${new Date().toISOString().split('T')[0]}

## Current Status
- No active plan yet
- Run /prd to create a Product Requirements Document
- Run /plan to generate an execution plan from a PRD

---

## Tasks
(Tasks will appear here after running /plan)
`;

  writeFileSync(join(pepperDir, "plan.md"), planTemplate);

  return `✅ Initialized .pepper/ structure

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

export function readPepperState(projectDir: string): any {
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

export function readPepperPlan(projectDir: string): string | null {
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
