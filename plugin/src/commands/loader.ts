import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { CommandInfo, CommandFrontmatter } from "./types";

// Commands that execute TypeScript logic directly
const EXECUTE_MODE_COMMANDS = new Set([
  "pepper-init",
  "status",
  "notepad",
  "auto-continue"
]);

function parseFrontmatter(content: string): { data: CommandFrontmatter; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { data: {} as CommandFrontmatter, body: content };
  }

  const [, frontmatterText, body] = match;
  const data: Record<string, string> = {};
  
  for (const line of frontmatterText.split("\n")) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      data[key.trim()] = valueParts.join(":").trim();
    }
  }

  return {
    data: data as unknown as CommandFrontmatter,
    body: body.trim()
  };
}

export function discoverOcxCommands(): CommandInfo[] {
  const commandDir = join(homedir(), ".config/opencode/command");
  
  if (!existsSync(commandDir)) {
    console.log("⚠️ No OCX commands directory found at:", commandDir);
    return [];
  }

  const commands: CommandInfo[] = [];
  const entries = readdirSync(commandDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const commandPath = join(commandDir, entry.name, "COMMAND.md");
    if (!existsSync(commandPath)) continue;

    try {
      const content = readFileSync(commandPath, "utf-8");
      const { data, body } = parseFrontmatter(content);

      const commandInfo: CommandInfo = {
        name: data.name || entry.name,
        agent: data.agent,
        description: data.description || "",
        content: body,
        argumentHint: data["argument-hint"],
        executionMode: EXECUTE_MODE_COMMANDS.has(entry.name) ? "execute" : "delegate"
      };

      commands.push(commandInfo);
    } catch (error) {
      console.error(`Failed to load command ${entry.name}:`, error);
      continue;
    }
  }

  console.log(`🌶️ Discovered ${commands.length} OCX commands`);
  return commands;
}
