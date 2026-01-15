import { z } from "zod";

export const StateSchema = z.object({
  active_plan: z.string().optional(),
  active_spec: z.string().optional(),
  session_ids: z.array(z.string()).default([]),
  started_at: z.string().datetime().optional(),
  current_task: z.string().optional(),
  auto_continue: z.boolean().default(false),
  auto_review: z.boolean().default(true),
  version: z.string().default("1.0.0"),
});

export type State = z.infer<typeof StateSchema>;

export const defaultState: State = {
  session_ids: [],
  auto_continue: false,
  auto_review: true,
  version: "1.0.0",
};
