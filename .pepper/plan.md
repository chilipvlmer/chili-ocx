---
status: not-started
phase: 0
updated: 2026-01-19
rfc: RFC-003
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

## Phase 1: Preparation [NOT STARTED]

- [ ] **1.1 Create feature branch** ← CURRENT
  - Run: `git checkout -b feat/rfc-003-agent-prompt-updates`
  - Verify branch created: `git branch --show-current`
  - Source: RFC-003 Section 5.2 Step 1

- [ ] **1.2 Review current agent prompts**
  - Read all 7 AGENT.md files to understand current structure
  - Identify exact insertion points for new sections
  - Note any agent-specific variations
  - Source: RFC-003 Section 4.1, 4.2

## Phase 2: Agent Prompt Updates [NOT STARTED]

### Scoville (Orchestrator)

- [ ] **2.1 Update Scoville: Add Workflow Handoff Protocol**
  - File: `files/agent/scoville-orchestrator/AGENT.md`
  - Insert after "Your Role" section (around line 22)
  - Add handoff matrix: After understanding → Specialist, After state check → Phase-matching agent
  - Source: RFC-003 Section 4.1, Lines 126-128

- [ ] **2.2 Update Scoville: Polish symlink section**
  - Standardize formatting with other agents
  - Ensure consistent example paths (`/tmp/ocx-ghost-abc123`)
  - Add references to RFC-001, RFC-002, RFC-003
  - Source: RFC-003 Section 4.3

### Seed (Artifact Planner)

- [ ] **2.3 Update Seed: Add Workflow Handoff Protocol**
  - File: `files/agent/seed-prd-rfc/AGENT.md`
  - Insert after "Your Role" section
  - Add handoff matrix: After PRD → Seed for RFCs, After RFC(s) → Sprout for plan
  - Source: RFC-003 Section 4.1, Lines 130-132

- [ ] **2.4 Update Seed: Polish symlink section**
  - Standardize formatting
  - Update examples for consistency
  - Add RFC references
  - Source: RFC-003 Section 4.3

### Sprout (Execution Planner)

- [ ] **2.5 Update Sprout: Add Workflow Handoff Protocol**
  - File: `files/agent/sprout-execution-planner/AGENT.md`
  - Insert after "Your Role" section
  - Add handoff matrix: After plan created → Jalapeño for implementation
  - Source: RFC-003 Section 4.1, Lines 134-135

- [ ] **2.6 Update Sprout: Polish symlink section**
  - Standardize formatting
  - Update examples for consistency
  - Add RFC references
  - Source: RFC-003 Section 4.3

### Jalapeño (Coder)

- [ ] **2.7 Update Jalapeño: Add Workflow Handoff Protocol**
  - File: `files/agent/jalapeno-coder/AGENT.md`
  - Insert after "Your Role" section
  - Add handoff matrix: After implementation → Habanero for review, After fixes → Habanero for re-review
  - Source: RFC-003 Section 4.1, Lines 137-139

- [ ] **2.8 Update Jalapeño: Polish symlink section**
  - Standardize formatting
  - Update examples for consistency
  - Add RFC references
  - Source: RFC-003 Section 4.3

### Habanero (Reviewer) - Special: RFC Compliance + Handoff

- [ ] **2.9 Update Habanero: Add RFC Compliance Checking Protocol**
  - File: `files/agent/habanero-reviewer/AGENT.md`
  - Insert BEFORE "The 4 Review Layers" section (around line 106)
  - Add complete protocol: Step 1-4 (Locate → Extract → Verify → Report)
  - Include example RFC compliance check
  - Source: RFC-003 Section 4.2, Lines 151-264

- [ ] **2.10 Update Habanero: Add Workflow Handoff Protocol**
  - Insert after "Your Role" section
  - Add handoff matrix: After APPROVE → Scoville, After REQUEST_CHANGES → Jalapeño
  - Source: RFC-003 Section 4.1, Lines 141-143

- [ ] **2.11 Update Habanero: Polish symlink section**
  - Standardize formatting
  - Update examples for consistency
  - Add RFC references
  - Source: RFC-003 Section 4.3

### Chipotle (Scribe)

- [ ] **2.12 Update Chipotle: Add Workflow Handoff Protocol**
  - File: `files/agent/chipotle-scribe/AGENT.md`
  - Insert after "Your Role" section
  - Add handoff matrix: After documentation → Scoville for next task
  - Source: RFC-003 Section 4.1, Lines 145-146

- [ ] **2.13 Update Chipotle: Polish symlink section**
  - Standardize formatting
  - Update examples for consistency
  - Add RFC references
  - Source: RFC-003 Section 4.3

### Ghost (Explorer)

- [ ] **2.14 Update Ghost: Add Workflow Handoff Protocol**
  - File: `files/agent/ghost-explorer/AGENT.md`
  - Insert after "Your Role" section
  - Add handoff matrix: After research → Scoville to decide next steps
  - Source: RFC-003 Section 4.1, Lines 148-149

- [ ] **2.15 Update Ghost: Polish symlink section**
  - Standardize formatting
  - Update examples for consistency
  - Add RFC references
  - Source: RFC-003 Section 4.3

### Documentation

- [ ] **2.16 Update ARCHITECTURE.md**
  - Document new workflow handoff protocol
  - Update agent coordination section
  - Add workflow diagram if not present
  - Reference RFC-003
  - Source: RFC-003 Section 5.2 Step 9

## Phase 3: Build, Test & Review [NOT STARTED]

- [ ] **3.1 Build the registry**
  - Run: `bun run build`
  - Verify build succeeds without errors
  - Check dist/ directory for updated components
  - Source: RFC-003 Section 5.2 Step 10

- [ ] **3.2 Manual test: Workflow handoff messages**
  - Test each agent shows handoff message after task completion
  - Verify message format is friendly and includes TAB key instruction
  - Check all 7 agents have consistent handoff behavior
  - Source: RFC-003 Section 6.1

- [ ] **3.3 Manual test: Out-of-scope handoffs**
  - Ask each agent to do something outside their role
  - Verify they suggest appropriate agent switch
  - Check message format is consistent
  - Source: RFC-003 Section 6.1 Step 6

- [ ] **3.4 Manual test: Habanero RFC compliance check**
  - Have Habanero review a completed RFC implementation
  - Verify "RFC Compliance Check" section appears BEFORE code review
  - Check acceptance criteria are extracted and verified
  - Verify compliance summary and recommendation format
  - Source: RFC-003 Section 6.1 Step 5

- [ ] **3.5 Verify acceptance criteria**
  - Check all 7 agents have "## Workflow Handoff Protocol" section
  - Check Habanero has "## RFC Compliance Checking Protocol" section
  - Verify symlink sections are consistent across agents
  - Confirm ARCHITECTURE.md is updated
  - Source: RFC-003 Section 6.2

- [ ] **3.6 Commit changes**
  - Stage all changes: `git add files/agent/*/AGENT.md ARCHITECTURE.md`
  - Commit with message from RFC-003 Section 5.2 Step 12
  - Verify commit includes all 8 files (7 agents + ARCHITECTURE.md)
  - Source: RFC-003 Section 5.2 Step 12
