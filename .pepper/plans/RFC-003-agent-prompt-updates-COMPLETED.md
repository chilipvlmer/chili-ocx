---
status: not-started
phase: 1
updated: 2026-01-18
rfc: RFC-003
---

# Implementation Plan: RFC-003 Agent Prompt Updates

## Goal
Update all 7 agent AGENT.md files with symlink workspace awareness sections, enabling agents to operate correctly in OpenCode Ghost environments and any symlinked development setup.

## Context & Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| Tiered approach: high/medium/low touch | Content varies by agent's operational needs | RFC-003 Section 3.2 |
| Jalapeño gets most detailed content | Critical agent performing file/git operations | RFC-003 Section 3.1.4 |
| Reference state.json v1.1.0 | Agents read workspace info from state | RFC-003 Section 2.3 |
| Single atomic commit | Ensure consistency across all agents | RFC-003 Section 5.2 |
| No code changes | Documentation-only update | RFC-003 Section 1.2 |

## Phase 1: Preparation [NOT STARTED]

- [ ] **1.1 Read RFC-003 specification** ← CURRENT
  - Review RFC-003 completely
  - Understand tiered approach (high/medium/low touch)
  - Note exact content for each agent (Section 3.1)
  - Source: RFC-003 full document

- [ ] **1.2 Verify file locations**
  - Confirm all 7 AGENT.md files exist
  - Check current structure of each file
  - Identify correct insertion points
  - Source: RFC-003 Section 2.1

- [ ] **1.3 Identify section placement**
  - Scoville: After "Session Initialization Protocol"
  - Seed: After role description, before workflows
  - Sprout: After role description, before planning
  - Jalapeño: After "The 5 Laws", before "Commit Guidelines"
  - Habanero: After role description, before checklists
  - Ghost: After role description, before exploration
  - Chipotle: After role description, before documentation
  - Source: RFC-003 Sections 3.1.1-3.1.7

## Phase 2: Implementation - High-Touch Agents [NOT STARTED]

- [ ] **2.1 Update Jalapeño AGENT.md (CRITICAL)**
  - Add "## Symlink Workspace Awareness" section
  - Insert after "The 5 Laws" section
  - Include all content from RFC-003 Section 3.1.4
  - Content: Workspace resolution, git ops, file ops, error reporting
  - Source: RFC-003 Section 3.1.4 (lines 267-377)

- [ ] **2.2 Update Habanero AGENT.md**
  - Add "## Symlink Workspace Awareness" section
  - Insert after role description
  - Include all content from RFC-003 Section 3.1.5
  - Content: Review checklist, verification patterns
  - Source: RFC-003 Section 3.1.5 (lines 382-454)

## Phase 3: Implementation - Medium-Touch Agents [NOT STARTED]

- [ ] **3.1 Update Scoville AGENT.md**
  - Add "## Symlink Workspace Awareness" section
  - Insert after "Session Initialization Protocol"
  - Include all content from RFC-003 Section 3.1.1
  - Content: Reading workspace info, error reporting
  - Source: RFC-003 Section 3.1.1 (lines 111-170)

- [ ] **3.2 Update Ghost AGENT.md**
  - Add "## Symlink Workspace Awareness" section
  - Insert after role description
  - Include all content from RFC-003 Section 3.1.6
  - Content: Context awareness, reporting findings
  - Source: RFC-003 Section 3.1.6 (lines 460-527)

## Phase 4: Implementation - Low-Touch Agents [NOT STARTED]

- [ ] **4.1 Update Seed AGENT.md**
  - Add "## Symlink Workspace Awareness" section
  - Insert after role description
  - Include all content from RFC-003 Section 3.1.2
  - Content: Basic awareness, path documentation
  - Source: RFC-003 Section 3.1.2 (lines 175-218)

- [ ] **4.2 Update Sprout AGENT.md**
  - Add "## Symlink Workspace Awareness" section
  - Insert after role description
  - Include all content from RFC-003 Section 3.1.3
  - Content: Planning considerations, no special tasks
  - Source: RFC-003 Section 3.1.3 (lines 223-261)

- [ ] **4.3 Update Chipotle AGENT.md**
  - Add "## Symlink Workspace Awareness" section
  - Insert after role description
  - Include all content from RFC-003 Section 3.1.7
  - Content: Documentation patterns, path references
  - Source: RFC-003 Section 3.1.7 (lines 532-592)

## Phase 5: Verification [NOT STARTED]

- [ ] **5.1 Validate markdown formatting**
  - Check all 7 files for proper markdown syntax
  - Verify code blocks use correct language tags
  - Ensure headings hierarchy is correct
  - Source: RFC-003 Section 4.1

- [ ] **5.2 Verify content accuracy**
  - Cross-reference each section with RFC-003
  - Confirm state.json v1.1.0 schema examples correct
  - Validate RFC-001 and RFC-002 references
  - Source: RFC-003 Section 6

- [ ] **5.3 Check section placement**
  - Verify each section inserted at correct location
  - Confirm no existing content disrupted
  - Ensure flow makes sense in context
  - Source: RFC-003 Sections 3.1.1-3.1.7

- [ ] **5.4 Create atomic commit**
  - Stage all 7 AGENT.md files
  - Commit message: "docs(agents): add symlink workspace awareness (RFC-003)"
  - Verify commit includes only documentation changes
  - Source: RFC-003 Section 5.2

## Phase 6: Review [NOT STARTED]

- [ ] **6.1 Request Habanero review**
  - Delegate to Habanero for code review
  - Provide RFC-003 as context
  - Request verification of all 7 files
  - Source: RFC-003 Section 9 (Implementation Checklist)

- [ ] **6.2 Address review feedback**
  - Implement any suggested corrections
  - Update files as needed
  - Re-verify formatting and accuracy
  - Source: Standard practice

## Phase 7: Testing - Ghost Workspace [NOT STARTED]

- [ ] **7.1 Manual test: Scoville in Ghost**
  - Create test symlink workspace
  - Run Scoville session initialization
  - Verify reads workspace info from state.json
  - Confirm error messages include both paths if issues
  - Source: RFC-003 Section 4.2

- [ ] **7.2 Manual test: Jalapeño in Ghost**
  - Test file operation in symlinked workspace
  - Verify git operations use real path
  - Confirm no "not a git repository" errors
  - Test error reporting includes both paths
  - Source: RFC-003 Section 4.2

- [ ] **7.3 Manual test: Habanero in Ghost**
  - Review code changes in symlinked workspace
  - Verify checklist includes symlink items
  - Test verification of workspace utilities usage
  - Source: RFC-003 Section 4.2

- [ ] **7.4 Manual test: Ghost in Ghost**
  - Explore codebase in symlinked workspace
  - Verify workspace context in reports
  - Check git repository detection
  - Source: RFC-003 Section 4.2

## Phase 8: Testing - Regression [NOT STARTED]

- [ ] **8.1 Test in regular workspace**
  - Run all agents in non-symlinked directory
  - Verify state.json shows isSymlink: false
  - Confirm agents don't mention symlinks unnecessarily
  - Ensure all existing workflows unchanged
  - Source: RFC-003 Section 4.3

- [ ] **8.2 Verify no behavioral changes**
  - Test Scoville session initialization
  - Test Jalapeño file/git operations
  - Test Habanero code review
  - Confirm no new errors or warnings
  - Source: RFC-003 Section 4.3

- [ ] **8.3 Validate acceptance criteria**
  - Check all 7 AGENT.md files updated
  - Verify state.json v1.1.0 referenced
  - Confirm error reporting guidance present
  - Test no regressions in normal workspaces
  - Source: RFC-003 Section 1.3, Section 6

## Dependencies
- **Requires**: RFC-001 (✅ Implemented), RFC-002 (✅ Implemented)
- **Blocks**: None - enables better agent behavior in Ghost workspaces

## Risks
| Risk | Mitigation |
|------|------------|
| Inconsistent content across agents | Use tiered approach, follow RFC exactly |
| Incorrect section placement | Verify placement for each agent type |
| Breaking existing workflows | Documentation only, no code changes |
| Agents over-mentioning symlinks | Guidance to only mention in error scenarios |

## Acceptance Criteria
- [ ] All 7 AGENT.md files updated with symlink awareness section
- [ ] Each agent references state.json v1.1.0 workspace information
- [ ] Clear instructions on when to use real vs symlink paths
- [ ] Error reporting guidance includes both paths for clarity
- [ ] No behavioral regressions in non-symlinked workspaces
- [ ] Manual testing in Ghost workspace confirms awareness
- [ ] Regression testing in normal workspace passes

## Notes
- Documentation-only change - no code modifications
- Estimated time: 2-3 hours total
- Jalapeño section is MOST CRITICAL (performs operations)
- Single atomic commit for consistency
- Follow exact content from RFC-003 Section 3.1
