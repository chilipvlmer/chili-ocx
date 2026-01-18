import type { PluginInput } from "@opencode-ai/plugin";
import { handlePepperInit } from "./pepper-init";
import { handleStatus } from "./status";
import { handlePrd } from "./prd";
import { handlePrdRefine } from "./prd-refine";
import { handleRfc } from "./rfc";
import { handleRfcRefine } from "./rfc-refine";
import { handleWork } from "./work";

export type ExecuteHandler = (
  ctx: PluginInput,
  args: string[]
) => Promise<string>;

export type DelegateHandler = (
  ctx: PluginInput,
  sessionID: string,
  args: string[]
) => Promise<string | void>;

export const executeHandlers: Record<string, ExecuteHandler> = {
  "pepper-init": handlePepperInit,
  "status": handleStatus
};

export const delegateHandlers: Record<string, DelegateHandler> = {
  "prd": handlePrd,
  "prd-refine": handlePrdRefine,
  "rfc": handleRfc,
  "rfc-refine": handleRfcRefine,
  "work": handleWork
};
