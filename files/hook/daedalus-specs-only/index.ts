import type { PluginInput } from "@opencode-ai/plugin"
import { resolve, relative, isAbsolute } from "node:path"
import { HOOK_NAME, DAEDALUS_AGENTS, ALLOWED_PATH_PREFIX, BLOCKED_TOOLS, ERROR_MESSAGE } from "./constants"
import { getSessionAgent } from "../../features/claude-code-session-state"
import { findNearestMessageWithFields, findFirstMessageWithAgent, MESSAGE_STORAGE } from "../../features/hook-message-injector"
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { log } from "../../shared/logger"

export * from "./constants"

/**
 * Cross-platform path validator for Daedalus/Theseus file writes.
 * Ensures writes are confined to .sisyphus/specs/ directory.
 */
function isAllowedFile(filePath: string, workspaceRoot: string): boolean {
  // 1. Resolve to absolute path
  const resolved = resolve(workspaceRoot, filePath)

  // 2. Get relative path from workspace root
  const rel = relative(workspaceRoot, resolved)

  // 3. Reject if escapes root (starts with ".." or is absolute)
  if (rel.startsWith("..") || isAbsolute(rel)) {
    return false
  }

  // 4. Normalize path separators for consistent matching
  const normalized = rel.replace(/\\/g, "/")

  // 5. Check if path starts with .sisyphus/specs/
  if (!normalized.startsWith(ALLOWED_PATH_PREFIX + "/") && 
      normalized !== ALLOWED_PATH_PREFIX) {
    return false
  }

  return true
}

function getMessageDir(sessionID: string): string | null {
  if (!existsSync(MESSAGE_STORAGE)) return null

  const directPath = join(MESSAGE_STORAGE, sessionID)
  if (existsSync(directPath)) return directPath

  for (const dir of readdirSync(MESSAGE_STORAGE)) {
    const sessionPath = join(MESSAGE_STORAGE, dir, sessionID)
    if (existsSync(sessionPath)) return sessionPath
  }

  return null
}

function getAgentFromMessageFiles(sessionID: string): string | undefined {
  const messageDir = getMessageDir(sessionID)
  if (!messageDir) return undefined
  return findFirstMessageWithAgent(messageDir) ?? findNearestMessageWithFields(messageDir)?.agent
}

function getAgentFromSession(sessionID: string): string | undefined {
  return getSessionAgent(sessionID) ?? getAgentFromMessageFiles(sessionID)
}

export function createDaedalusSpecsOnlyHook(ctx: PluginInput) {
  return {
    "tool.execute.before": async (
      input: { tool: string; sessionID: string; callID: string },
      output: { args: Record<string, unknown>; message?: string }
    ): Promise<void> => {
      const agentName = getAgentFromSession(input.sessionID)
      
      // Only apply to Daedalus/Theseus agents
      if (!agentName || !DAEDALUS_AGENTS.includes(agentName)) {
        return
      }

      const toolName = input.tool

      // Only check Write/Edit tools
      if (!BLOCKED_TOOLS.includes(toolName)) {
        return
      }

      // Special rule: Theseus is blocked from ALL writes
      if (agentName === "Theseus (Spec Reviewer)") {
        log(`[${HOOK_NAME}] Blocked: Theseus is read-only`, {
          sessionID: input.sessionID,
          tool: toolName,
          agent: agentName,
        })
        throw new Error(`❌ Theseus is a read-only reviewer and cannot write or edit files.`)
      }

      // Extract file path from parameters
      const filePath = (output.args.filePath ?? output.args.path ?? output.args.file) as string | undefined

      if (!filePath) {
        return // No file path to check
      }

      // Validate path for Daedalus
      if (!isAllowedFile(filePath, ctx.directory)) {
        log(`[${HOOK_NAME}] Blocked: Daedalus can only write to .sisyphus/specs/`, {
          sessionID: input.sessionID,
          tool: toolName,
          filePath,
          agent: agentName,
        })
        throw new Error(ERROR_MESSAGE.replace("{path}", filePath))
      }

      log(`[${HOOK_NAME}] Allowed: .sisyphus/specs/ write permitted`, {
        sessionID: input.sessionID,
        tool: toolName,
        filePath,
        agent: agentName,
      })
    },
  }
}
