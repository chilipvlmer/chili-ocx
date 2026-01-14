import { z } from "zod";

const RfcStatusValue = z.enum([
  "draft",
  "review",
  "approved",
  "in-progress",
  "implemented",
  "deprecated",
]);

export const RfcStatusSchema = z.record(
  z.string(), // Version key like "v1.0.0"
  z.record(
    z.string(), // RFC key like "RFC-001-auth-flow"
    RfcStatusValue
  )
);

export type RfcStatus = z.infer<typeof RfcStatusSchema>;

// Example:
// {
//   "v1.0.0": {
//     "RFC-001-auth-flow": "implemented",
//     "RFC-002-db-schema": "in-progress"
//   }
// }
