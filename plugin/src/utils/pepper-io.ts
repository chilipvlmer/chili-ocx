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

export function getPepperStatus(projectDir: string): string {
  const pepperDir = join(projectDir, ".pepper");
  
  if (!existsSync(pepperDir)) {
    return "❌ Pepper harness not initialized\n\nRun /pepper-init to set up the directory structure.";
  }

  const state = readPepperState(projectDir);
  if (!state) {
    return "⚠️ .pepper/ exists but state.json is missing or invalid\n\nTry running /pepper-init again.";
  }

  // Find PRDs
  const prdDir = join(pepperDir, "specs/prd");
  const prds = existsSync(prdDir) ? readdirSync(prdDir).filter(f => f.endsWith(".md")) : [];
  
  // Find RFCs
  const rfcDir = join(pepperDir, "specs/rfc");
  let rfcs: string[] = [];
  if (existsSync(rfcDir)) {
    const rfcVersions = readdirSync(rfcDir);
    rfcs = rfcVersions.flatMap(version => {
      const versionDir = join(rfcDir, version);
      return existsSync(versionDir) ? readdirSync(versionDir).filter(f => f.endsWith(".md")) : [];
    });
  }

  // Find plans
  const plansDir = join(pepperDir, "plans");
  const plans = existsSync(plansDir) ? readdirSync(plansDir).filter(f => f.endsWith(".md")) : [];

  // Build status report
  let report = "# 🌶️ Pepper Harness Status\n\n";
  
  report += `## State\n`;
  report += `- Version: ${state.version || "unknown"}\n`;
  report += `- Auto-continue: ${state.auto_continue ? "✅ enabled" : "❌ disabled"}\n`;
  report += `- Active sessions: ${state.session_ids?.length || 0}\n\n`;

  report += `## Documents\n`;
  report += `- PRDs: ${prds.length}\n`;
  if (prds.length > 0) {
    prds.forEach(prd => report += `  - ${prd}\n`);
  }
  report += `- RFCs: ${rfcs.length}\n`;
  if (rfcs.length > 0) {
    rfcs.forEach(rfc => report += `  - ${rfc}\n`);
  }
  report += `- Plans: ${plans.length}\n`;
  if (plans.length > 0) {
    plans.forEach(plan => report += `  - ${plan}\n`);
  }

  // Check current plan
  const currentPlan = readPepperPlan(projectDir);
  if (currentPlan && !currentPlan.includes("No active plan yet")) {
    report += `\n## Current Plan\n`;
    report += `✅ Active plan exists in .pepper/plan.md\n`;
  } else {
    report += `\n## Current Plan\n`;
    report += `❌ No active plan\n`;
  }

  report += `\n## Next Steps\n`;
  if (prds.length === 0) {
    report += `- Run /prd to create your first Product Requirements Document\n`;
  } else if (rfcs.length === 0) {
    report += `- Run /rfc to create technical design from your PRD\n`;
  } else if (plans.length === 0) {
    report += `- Run /plan to generate an execution plan from your RFC\n`;
  } else {
    report += `- Run /work to continue with your current plan\n`;
    report += `- Run /review to get code review feedback\n`;
  }

  return report;
}

export function addNotepadEntry(projectDir: string, notepadType: "learnings" | "issues" | "decisions", entry: string): string {
  const pepperDir = join(projectDir, ".pepper");
  
  if (!existsSync(pepperDir)) {
    return "❌ Pepper harness not initialized. Run /pepper-init first.";
  }

  const notepadPath = join(pepperDir, "notepad", `${notepadType}.json`);
  
  if (!existsSync(notepadPath)) {
    return `❌ Notepad file not found: ${notepadType}.json`;
  }

  try {
    const content = readFileSync(notepadPath, "utf-8");
    const notepad = JSON.parse(content);
    
    notepad.entries.push({
      timestamp: new Date().toISOString(),
      content: entry
    });
    
    writeFileSync(notepadPath, JSON.stringify(notepad, null, 2));
    
    return `✅ Added entry to ${notepadType} notepad\n\n"${entry}"`;
  } catch (error) {
    console.error(`Failed to add notepad entry:`, error);
    return `❌ Failed to add entry: ${error instanceof Error ? error.message : String(error)}`;
  }
}
