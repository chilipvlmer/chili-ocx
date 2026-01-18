import type { PluginInput } from "@opencode-ai/plugin";
import { initPepperStructure } from "../../utils/pepper-io";

export async function handlePepperInit(
  ctx: PluginInput,
  args: string[]
): Promise<string> {
  return initPepperStructure(ctx.directory);
}
