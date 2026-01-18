export type ExecutionMode = "delegate" | "execute";

export type CommandInfo = {
  name: string;
  agent?: string;
  description: string;
  content: string;
  argumentHint?: string;
  executionMode: ExecutionMode;
};
