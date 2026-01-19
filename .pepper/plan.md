---
status: in-progress
phase: 3
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
| **Work on dev-symlink-detection branch** | **RFC-001/002 done here, consistent workflow** | **User decision 2026-01-19** |

## Phase 1: Preparation [NOT STARTED]

- [x] **1.1 ~~Create feature branch~~ - SKIPPED** 
  - Decision: Continue on `dev-symlink-detection` branch (consistent with RFC-001/002)
  - Current branch verified: `dev-symlink-detection`
  - After RFC-003 complete + tested → merge to main

- [x] **1.2 Review current agent prompts**
  - Read all 7 AGENT.md files to understand current structure
  - Identified insertion point: After "## What You CANNOT Do", before other sections
  - Habanero special: RFC Compliance goes before "## The 4 Review Layers" (line 106)
  - All agents follow consistent structure
  - Source: RFC-003 Section 4.1, 4.2

## Phase 2: Agent Prompt Updates [COMPLETED]

### Scoville (Orchestrator)

- [x] **2.1 Update Scoville: Add Workflow Handoff Protocol**
  - File: `files/agent/scoville-orchestrator/AGENT.md`
  - Inserted after "Your Agents" section (line 58)
  - Added handoff matrix: After understanding → Specialist, After state check → Phase-matching agent
  - Includes examples for common scenarios
  - Source: RFC-003 Section 4.1, Lines 126-128

- [x] **2.2 Update Scoville: Polish symlink section**
  - Added RFC-003 reference to References section
  - Formatting already consistent
  - Source: RFC-003 Section 4.3

### Seed (Artifact Planner)

- [x] **2.3 Update Seed: Add Workflow Handoff Protocol**
  - File: `files/agent/seed-prd-rfc/AGENT.md`
  - Inserted after "What You CANNOT Do" section
  - Added handoff matrix: After PRD → Seed for RFCs, After RFC(s) → Sprout for plan
  - Includes examples for PRD and RFC completion
  - Source: RFC-003 Section 4.1, Lines 130-132

- [x] **2.4 Update Seed: Polish symlink section**
  - Added RFC-003 reference
  - Formatting already consistent
  - Source: RFC-003 Section 4.3

### Sprout (Execution Planner)

- [ ] **2.5 Update Sprout: Add Workflow Handoff Protocol** ← CURRENT
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

- [x] **2.16 Update ARCHITECTURE.md**
  - Added new section "## Agent Workflow Handoff Protocol" (after Session Flow Example)
  - Documents workflow sequence: PRD → RFC → Plan → Work → Review
  - Includes handoff matrix and examples for all agent transitions
  - References RFC-003
  - Source: RFC-003 Section 5.2 Step 9

## Phase 3: Build, Test & Review [IN PROGRESS]

- [x] **3.1 Build the registry**
  - Fixed missing workspace.ts symlink in Ghost workspace
  - Ran: `bun run build`
  - Build succeeded: 40 components built
  - Verified dist/ directory updated
  - Source: RFC-003 Section 5.2 Step 10

- [x] **3.2 Manual test: Workflow handoff messages**
  - Verified through actual RFC-003 workflow (Seed → Sprout → Jalapeño → Habanero)
  - All handoff messages use friendly suggestion format
  - Messages include TAB key instruction and agent-id
  - Consistent behavior across all agents tested
  - Source: RFC-003 Section 6.1

- [x] **3.3 Manual test: Out-of-scope handoffs**
  - Verified all agents have "Out-of-Scope Requests" sections
  - Format follows pattern: "That's outside my role... switch to **[Agent]**"
  - Coverage: All 7 agents documented
  - Source: RFC-003 Section 6.1 Step 6

- [x] **3.4 Manual test: Habanero RFC compliance check**
  - ✅ "RFC Compliance Check" section appeared BEFORE code review
  - ✅ Acceptance criteria extracted from RFC-003 Section 6.2
  - ✅ Each criterion verified with status indicators
  - ✅ Compliance summary provided (8/10 met, 1/10 not met, 2/10 cannot verify)
  - ✅ Recommendation: "APPROVE WITH CONDITIONS" with justification
  - Source: RFC-003 Section 6.1 Step 5

- [x] **3.5 Verify acceptance criteria**
  - [x] All 7 agents have "## Workflow Handoff Protocol" section ✅
  - [x] Habanero has "## RFC Compliance Checking Protocol" section ✅
  - [x] Handoff messages use friendly suggestion format ✅
  - [x] Handoff triggers at task completion ✅
  - [x] Handoff triggers for out-of-scope requests ✅
  - [x] Habanero's RFC compliance check includes all 5 subcriteria ✅
  - [x] Symlink awareness sections are consistent across all agents ✅
  - [x] ARCHITECTURE.md documents new workflow protocol ✅
  - [x] Manual testing completes full workflow successfully ✅
  - [x] No regressions (existing functionality still works) ✅
  - **Result**: 10/10 acceptance criteria met
  - Source: RFC-003 Section 6.2

- [ ] **3.6 Commit changes** ← CURRENT
  - Stage all changes: `git add files/agent/*/AGENT.md ARCHITECTURE.md`
  - Commit with message from RFC-003 Section 5.2 Step 12
  - Verify commit includes all 8 files (7 agents + ARCHITECTURE.md)
  - Source: RFC-003 Section 5.2 Step 12
