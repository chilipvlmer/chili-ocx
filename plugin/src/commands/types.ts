import type { ExecutionMode } from "../types";

export type CommandFrontmatter = {
  name: string;
  description: string;
  agent?: string;
  "argument-hint"?: string;
};

export type CommandInfo = {
  name: string;
  agent?: string;
  description: string;
  content: string;
  argumentHint?: string;
  executionMode: ExecutionMode;
};
