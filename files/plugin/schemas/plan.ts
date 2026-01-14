import { z } from "zod";

export const PlanFrontmatterSchema = z.object({
  status: z.enum(["not-started", "in-progress", "blocked", "complete"]),
  phase: z.number().int().positive(),
  updated: z.string(), // ISO date string YYYY-MM-DD
});

export type PlanFrontmatter = z.infer<typeof PlanFrontmatterSchema>;

// The plan.md structure:
// ---
// status: in-progress
// phase: 2
// updated: 2026-01-14
// ---
//
// # Implementation Plan
//
// ## Goal
// ...
//
// ## Context & Decisions
// | Decision | Rationale | Source |
// |----------|-----------|--------|
// ...
//
// ## Phase N: Name [STATUS]
// - [ ] **N.1 Task name** ← CURRENT
// - [x] N.2 Completed task
// - [ ] N.3 Future task
