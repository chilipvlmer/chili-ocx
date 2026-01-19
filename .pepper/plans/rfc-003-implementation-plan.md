---
status: completed
phase: 3
updated: 2026-01-19
completed: 2026-01-19
commit: ae5a686
rfc: RFC-003
archived: 2026-01-19
---

# Implementation Plan: RFC-003 Agent Prompt Updates for Workflow & Compliance

## Goal
Update all 7 agent prompts with workflow handoff protocol, RFC compliance checking (Habanero), and symlink awareness polish.

## Context & Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| Update all 7 agents simultaneously | Atomic rollout ensures consistency | RFC-003 Section 3.2 |
| Add dedicated "Workflow Handoff Protocol" section | Clear, discoverable location in prompts | RFC-003 Section 4.1 |
| Place handoff section after role definition | Early in document for visibility | RFC-003 Section 4.1 |
| Habanero gets RFC Compliance before Review Layers | Compliance check must happen first | RFC-003 Section 4.2 |
| Use friendly suggestion format for handoffs | Non-blocking, preserves user flexibility | RFC-003 Section 4.1 |
| **Work on dev-symlink-detection branch** | **RFC-001/002 done here, consistent workflow** | **User decision 2026-01-19** |

## Status: COMPLETED ✅

All 10/10 acceptance criteria met. Implementation successful.

**Commit**: ae5a686 - "feat(agents): add workflow handoff protocol and RFC compliance checking"

**Files Changed**: 21 files, 1795 insertions, 64 deletions
- 7 agent AGENT.md files updated
- ARCHITECTURE.md updated
- executable-commands.js rebuilt

**Next**: Testing phase (see current plan.md)
