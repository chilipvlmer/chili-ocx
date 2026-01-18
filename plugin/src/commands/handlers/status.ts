import type { PluginInput } from "@opencode-ai/plugin";
import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { readPepperState, readPepperPlan } from "../../utils/pepper-io";

export async function handleStatus(
  ctx: PluginInput,
  args: string[]
): Promise<string> {
  const pepperDir = join(ctx.directory, ".pepper");
  
  if (!existsSync(pepperDir)) {
    return "❌ .pepper/ not initialized\n\nRun /pepper-init to set up the Pepper harness.";
  }

  const state = readPepperState(ctx.directory);
  const plan = readPepperPlan(ctx.directory);
  
  const sections: string[] = [];
  
  sections.push("# Pepper Harness Status\n");
  
  // State info
  if (state) {
    sections.push("## State");
    sections.push(`- Version: ${state.version}`);
    sections.push(`- Active Spec: ${state.active_spec || "(none)"}`);
    sections.push(`- Auto Continue: ${state.auto_continue ? "✅ enabled" : "❌ disabled"}`);
    sections.push("");
  }
  
  // Specs info
  const prdDir = join(pepperDir, "specs/prd");
  const rfcDir = join(pepperDir, "specs/rfc");
  
  const prds = existsSync(prdDir) ? readdirSync(prdDir).filter(f => f.endsWith(".md")) : [];
  const rfcs = existsSync(rfcDir) ? readdirSync(rfcDir).filter(f => f.endsWith(".md")) : [];
  
  sections.push("## Specifications");
  sections.push(`- PRDs: ${prds.length} (${prds.join(", ") || "none"})`);
  sections.push(`- RFCs: ${rfcs.length} (${rfcs.join(", ") || "none"})`);
  sections.push("");
  
  // Plan info
  if (plan) {
    const currentTaskMatch = plan.match(/^-.*← CURRENT/m);
    if (currentTaskMatch) {
      sections.push("## Current Task");
      sections.push(currentTaskMatch[0].replace("← CURRENT", "").trim());
      sections.push("");
    }
  }
  
  sections.push("---");
  sections.push("Run /prd to create a PRD");
  sections.push("Run /work to continue current task");
  
  return sections.join("\n");
}
