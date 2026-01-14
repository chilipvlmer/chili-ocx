import { z } from "zod";

const TimestampedEntry = z.object({
  id: z.string(),
  content: z.string(),
  created_at: z.string().datetime(),
  source: z.string().optional(), // Which agent/session added this
  tags: z.array(z.string()).default([]),
});

export const LearningsSchema = z.object({
  version: z.string().default("1.0.0"),
  entries: z.array(TimestampedEntry).default([]),
});

export const IssuesSchema = z.object({
  version: z.string().default("1.0.0"),
  entries: z.array(
    TimestampedEntry.extend({
      resolved: z.boolean().default(false),
      resolution: z.string().optional(),
    })
  ).default([]),
});

export const DecisionsSchema = z.object({
  version: z.string().default("1.0.0"),
  entries: z.array(
    TimestampedEntry.extend({
      rationale: z.string(),
      alternatives_considered: z.array(z.string()).default([]),
      refs: z.array(z.string()).default([]), // Citation references
    })
  ).default([]),
});

export type Learnings = z.infer<typeof LearningsSchema>;
export type Issues = z.infer<typeof IssuesSchema>;
export type Decisions = z.infer<typeof DecisionsSchema>;
