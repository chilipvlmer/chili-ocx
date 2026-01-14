import { definePlugin } from "@opencode-ai/plugin";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const AGENTS_MD = "AGENTS.md";
const PEPPER_CONTEXT = ".pepper/context.md";

// --- Helper Functions (Parse at Boundary, Early Exit) ---

function resolveProjectRoot(config: { cwd?: string }): string {
  return config.cwd || process.cwd();
}

function formatContext(source: string, content: string): string {
  return `## Project Context (from ${source})

${content.trim()}

---
*This context is automatically loaded by the Pepper harness.*`;
}

async function loadProjectContext(projectRoot: string): Promise<string | null> {
  // Priority 1: AGENTS.md in project root
  const agentsMdPath = join(projectRoot, AGENTS_MD);
  if (existsSync(agentsMdPath)) {
    try {
      const content = await readFile(agentsMdPath, "utf-8");
      return formatContext("AGENTS.md", content);
    } catch {
      // Fall through to next option
    }
  }

  // Priority 2: .pepper/context.md (fallback)
  const pepperContextPath = join(projectRoot, PEPPER_CONTEXT);
  if (existsSync(pepperContextPath)) {
    try {
      const content = await readFile(pepperContextPath, "utf-8");
      return formatContext(".pepper/context.md", content);
    } catch {
      // No context available
    }
  }

  return null;
}

// --- Plugin Definition ---

export default definePlugin({
  name: "pepper-agents-md-loader",
  version: "0.1.0",

  hooks: {
    // Inject project context into agent system prompts
    "chat.system.transform": async ({ system, config }) => {
      const projectRoot = resolveProjectRoot(config);

      const projectContext = await loadProjectContext(projectRoot);

      // Early exit: no context to inject
      if (!projectContext) {
        return { system };
      }

      // Inject project context at the beginning of system prompt
      const injectedSystem = `<project-context>
${projectContext}
</project-context>

${system}`;

      return { system: injectedSystem };
    },
  },
});
