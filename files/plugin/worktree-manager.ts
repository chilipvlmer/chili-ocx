import { definePlugin } from "@opencode-ai/plugin";
import { execSync, exec } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";

const execAsync = promisify(exec);

// --- Types (Parse at Boundary) ---

interface WorktreeInfo {
  path: string;
  branch: string;
  head: string;
  isMain: boolean;
}

interface WorktreeResult {
  success: boolean;
  path: string;
  branch: string;
  error?: string;
}

interface RemoveResult {
  success: boolean;
  error?: string;
}

// --- Helper Functions (Early Exit, Fail Fast) ---

function resolvePath(config: { cwd?: string }): string {
  return config.cwd || process.cwd();
}

function isGitRepository(projectRoot: string): boolean {
  return existsSync(join(projectRoot, ".git"));
}

function getCurrentBranch(projectRoot: string): string {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: projectRoot,
      encoding: "utf-8",
    }).trim();
  } catch {
    return "main";
  }
}

function normalizeBranchName(branchName: string): string {
  return branchName.startsWith("pepper/") ? branchName : `pepper/${branchName}`;
}

function extractWorktreeName(branchName: string): string {
  return branchName.replace("pepper/", "");
}

// --- Core Operations ---

async function createWorktree(
  projectRoot: string,
  branchName: string,
  baseBranch?: string
): Promise<WorktreeResult> {
  // Guard: Not a git repo
  if (!isGitRepository(projectRoot)) {
    return { success: false, path: "", branch: "", error: "Not a git repository" };
  }

  const fullBranchName = normalizeBranchName(branchName);
  const worktreePath = join(projectRoot, ".worktrees", extractWorktreeName(branchName));

  try {
    // Ensure .worktrees directory exists
    await mkdir(join(projectRoot, ".worktrees"), { recursive: true });

    // Resolve base branch (default to current)
    const base = baseBranch || getCurrentBranch(projectRoot);

    // Create worktree with new branch
    await execAsync(
      `git worktree add -b "${fullBranchName}" "${worktreePath}" "${base}"`,
      { cwd: projectRoot }
    );

    return {
      success: true,
      path: worktreePath,
      branch: fullBranchName,
    };
  } catch (error) {
    return {
      success: false,
      path: "",
      branch: "",
      error: error instanceof Error ? error.message : "Unknown error creating worktree",
    };
  }
}

async function listWorktrees(projectRoot: string): Promise<WorktreeInfo[]> {
  // Guard: Not a git repo
  if (!isGitRepository(projectRoot)) {
    return [];
  }

  try {
    const { stdout } = await execAsync("git worktree list --porcelain", {
      cwd: projectRoot,
    });

    // Guard: Empty output
    if (!stdout.trim()) {
      return [];
    }

    const worktrees: WorktreeInfo[] = [];
    const entries = stdout.trim().split("\n\n");

    for (const entry of entries) {
      const lines = entry.split("\n");
      const path = lines.find((l) => l.startsWith("worktree "))?.replace("worktree ", "");
      const head = lines.find((l) => l.startsWith("HEAD "))?.replace("HEAD ", "");
      const branch = lines.find((l) => l.startsWith("branch "))?.replace("branch refs/heads/", "");

      // Guard: Invalid entry
      if (!path || !head) {
        continue;
      }

      worktrees.push({
        path,
        branch: branch || "(detached)",
        head: head.substring(0, 8),
        isMain: !path.includes(".worktrees"),
      });
    }

    return worktrees;
  } catch {
    return [];
  }
}

async function removeWorktree(
  projectRoot: string,
  branchName: string,
  force?: boolean
): Promise<RemoveResult> {
  const fullBranchName = normalizeBranchName(branchName);
  const worktreePath = join(projectRoot, ".worktrees", extractWorktreeName(branchName));

  try {
    const forceFlag = force ? "--force" : "";
    await execAsync(`git worktree remove ${forceFlag} "${worktreePath}"`, {
      cwd: projectRoot,
    });

    // Attempt to delete the branch (may fail if unmerged - that's acceptable)
    try {
      await execAsync(`git branch -d "${fullBranchName}"`, { cwd: projectRoot });
    } catch {
      // Branch has unmerged changes - leave for user to handle
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error removing worktree",
    };
  }
}

// --- Plugin Definition ---

export default definePlugin({
  name: "pepper-worktree-manager",
  version: "0.1.0",

  tools: {
    "worktree.create": {
      description: "Create a new git worktree for isolated development",
      parameters: {
        type: "object",
        properties: {
          branchName: {
            type: "string",
            description: "Name for the new branch (will be prefixed with pepper/)",
          },
          baseBranch: {
            type: "string",
            description: "Branch to base the worktree on (defaults to current branch)",
          },
        },
        required: ["branchName"],
      },
      execute: async ({ branchName, baseBranch }, { config }) => {
        const projectRoot = resolvePath(config);
        return await createWorktree(projectRoot, branchName, baseBranch);
      },
    },

    "worktree.list": {
      description: "List all active worktrees",
      parameters: {
        type: "object",
        properties: {},
      },
      execute: async (_, { config }) => {
        const projectRoot = resolvePath(config);
        return await listWorktrees(projectRoot);
      },
    },

    "worktree.remove": {
      description: "Remove a worktree after merging or discarding changes",
      parameters: {
        type: "object",
        properties: {
          branchName: {
            type: "string",
            description: "Branch name of the worktree to remove",
          },
          force: {
            type: "boolean",
            description: "Force removal even with uncommitted changes",
          },
        },
        required: ["branchName"],
      },
      execute: async ({ branchName, force }, { config }) => {
        const projectRoot = resolvePath(config);
        return await removeWorktree(projectRoot, branchName, force);
      },
    },
  },
});
