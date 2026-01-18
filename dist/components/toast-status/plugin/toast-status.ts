import { definePlugin } from "@opencode-ai/plugin";
import { exec } from "child_process";

// --- Types (Parse at Boundary) ---

type DelegationStatus = "running" | "complete" | "error";

interface DelegationInfo {
  id: string;
  agent: string;
  task: string;
  startedAt: number;
  status: DelegationStatus;
}

interface DelegationEvent {
  id: string;
  agent?: string;
  prompt?: string;
}

// --- State ---

const activeDelegations = new Map<string, DelegationInfo>();

// --- Helper Functions (Early Exit, Atomic Predictability) ---

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

function formatElapsedTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getStatusIcon(status: DelegationStatus): string {
  const icons: Record<DelegationStatus, string> = {
    running: "~",
    complete: "+",
    error: "x",
  };
  return icons[status];
}

function formatStatusText(status: DelegationStatus, elapsed: string): string {
  if (status === "complete") return "done";
  if (status === "error") return "error";
  return elapsed;
}

function areAllDelegationsComplete(delegations: DelegationInfo[]): boolean {
  return delegations.every((d) => d.status !== "running");
}

function parseDelegationEvent(delegation: DelegationEvent): DelegationInfo {
  return {
    id: delegation.id,
    agent: delegation.agent || "Agent",
    task: truncateText(delegation.prompt || "Background task", 30),
    startedAt: Date.now(),
    status: "running",
  };
}

// --- Toast Rendering (Intentional Naming) ---

function buildToastContent(delegations: DelegationInfo[]): string {
  const lines = delegations.map((delegation) => {
    const elapsed = formatElapsedTime(Date.now() - delegation.startedAt);
    const icon = getStatusIcon(delegation.status);
    const status = formatStatusText(delegation.status, elapsed);
    const agentPadded = delegation.agent.padEnd(12);
    const statusPadded = status.padEnd(6);

    return `[${icon}] ${agentPadded} | ${statusPadded} | ${delegation.task}`;
  });

  const separator = "-".repeat(50);
  const sessionId = delegations[0]?.id || "none";

  return [
    "Pepper Agents",
    separator,
    ...lines,
    separator,
    `Session: ${sessionId}`,
  ].join("\n");
}

function renderToast(delegations: DelegationInfo[]): void {
  // Guard: No delegations to display
  if (delegations.length === 0) return;

  // Guard: Toast API not available
  if (typeof globalThis.opencode?.toast !== "function") return;

  const isAllComplete = areAllDelegationsComplete(delegations);

  globalThis.opencode.toast({
    id: "pepper-delegations",
    title: "Pepper Agents",
    message: buildToastContent(delegations),
    variant: isAllComplete ? "success" : "info",
    persistent: true,
  });
}

function dismissToast(): void {
  if (typeof globalThis.opencode?.dismissToast !== "function") return;
  globalThis.opencode.dismissToast("pepper-delegations");
}

// --- Sound (Best Effort) ---

function playCompletionSound(): void {
  // Guard: Non-macOS platforms (fail silently)
  if (process.platform !== "darwin") return;

  // Fire and forget - sound is optional enhancement
  exec("afplay /System/Library/Sounds/Glass.aiff", () => {
    // Intentionally empty - sound failure is acceptable
  });
}

// --- Toast Update Orchestration ---

function updateToastDisplay(): void {
  const delegations = Array.from(activeDelegations.values());
  renderToast(delegations);
}

function handleAllComplete(): void {
  playCompletionSound();

  // Dismiss after 5 seconds
  setTimeout(() => {
    dismissToast();
    activeDelegations.clear();
  }, 5000);
}

// --- Plugin Definition ---

export default definePlugin({
  name: "pepper-toast-status",
  version: "0.1.0",

  hooks: {
    // Track delegation start
    "delegation.start": async ({ delegation }: { delegation: DelegationEvent }) => {
      const info = parseDelegationEvent(delegation);
      activeDelegations.set(delegation.id, info);
      updateToastDisplay();
    },

    // Track delegation completion
    "delegation.complete": async ({ delegation }: { delegation: DelegationEvent }) => {
      const info = activeDelegations.get(delegation.id);

      // Guard: Unknown delegation
      if (!info) return;

      info.status = "complete";
      updateToastDisplay();

      // Check if all delegations are now complete
      const delegations = Array.from(activeDelegations.values());
      if (areAllDelegationsComplete(delegations)) {
        handleAllComplete();
      }
    },

    // Track delegation errors
    "delegation.error": async ({ delegation }: { delegation: DelegationEvent }) => {
      const info = activeDelegations.get(delegation.id);

      // Guard: Unknown delegation
      if (!info) return;

      info.status = "error";
      updateToastDisplay();
    },
  },
});
