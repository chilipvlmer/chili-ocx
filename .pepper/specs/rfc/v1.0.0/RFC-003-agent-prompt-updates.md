# RFC-003: Agent Prompt Updates for Workflow & Compliance

**Version**: 1.0.0  
**Status**: Draft  
**Author**: Seed (PRD-RFC Planner)  
**Date**: 2026-01-19  
**Priority**: P0 - Critical  
**Phase**: Integration (Phase 2)

**Parent PRD**: `core-improvements-v1.0.0.md`  
**Dependencies**: RFC-001 ✅, RFC-002 ✅  
**Blocks**: RFC-004, RFC-005

---

## 1. Executive Summary

All 7 Pepper agents currently have basic symlink awareness but lack two critical capabilities:

1. **Explicit workflow handoff protocol** - Agents don't guide users to the next appropriate agent, causing workflow confusion
2. **RFC compliance checking** - Habanero reviews code quality but doesn't verify RFC acceptance criteria are met

This RFC defines updates to all agent prompts (`files/agent/*/AGENT.md`) to add:
- Polished symlink awareness sections (consistency)
- Dedicated workflow handoff protocols (guide users through PRD → RFC → Plan → Work → Review)
- RFC compliance checking protocol for Habanero (verify acceptance criteria during review)

**Impact**: Improves agent coordination, reduces user confusion, ensures implementations meet specifications.

---

## 2. Problem Statement

### 2.1 Current Issues

**Issue #1: Agent Workflow Awareness Gap** (from notepad/issues.json)
- Agents skip workflow steps (e.g., Seed suggests Jalapeño, skipping Sprout)
- No explicit handoff suggestions after task completion
- Users don't know which agent to switch to next

**Issue #2: Habanero Review Process Missing RFC Compliance** (from notepad/issues.json)
- Reviews focus on code quality (style, security, performance)
- Does NOT verify RFC acceptance criteria are met
- Implementations can pass review but fail requirements

**Issue #3: Symlink Awareness Inconsistency** (minor)
- All agents have symlink sections but formatting/depth varies
- Some agents have more detail than others

### 2.2 User Impact

- **Workflow confusion**: Users don't follow PRD → RFC → Plan → Work → Review flow
- **Requirement gaps**: Code passes review but doesn't meet PRD/RFC specifications
- **Inconsistent experience**: Symlink handling varies between agents

---

## 3. Solution Overview

### 3.1 Three-Part Update

#### Part 1: Symlink Awareness Polish
- **Scope**: All 7 agents
- **Action**: Minor consistency updates, ensure uniform formatting
- **Effort**: Low (sections already exist)

#### Part 2: Workflow Handoff Protocol  
- **Scope**: All 7 agents
- **Action**: Add dedicated "## Workflow Handoff Protocol" section
- **Format**: Friendly suggestions triggered at task completion + out-of-scope requests
- **Example**: "✅ RFC-003 complete! Ready for the next step? Switch to **Sprout** (TAB key) to create an execution plan from this RFC."

#### Part 3: RFC Compliance Checking
- **Scope**: Habanero only
- **Action**: Add detailed "## RFC Compliance Checking Protocol" section
- **Process**: Read RFC → Extract acceptance criteria → Verify each → Report compliance status

### 3.2 Implementation Strategy

**Rollout**: All 7 agents updated simultaneously (atomic change)  
**Testing**: Manual workflow verification after update  
**Documentation**: Update ARCHITECTURE.md to reflect new handoff protocol

---

## 4. Detailed Specifications

### 4.1 Workflow Handoff Protocol (All Agents)

Add this section to each agent's AGENT.md after the role definition:

```markdown
## Workflow Handoff Protocol

The Pepper workflow follows this sequence:

```
PRD → RFC → Plan → Work → Review
Seed → Seed → Sprout → Jalapeño → Habanero
```

### When to Suggest Next Agent

**Trigger 1: Task Completion**
When you complete your primary task, guide the user to the next agent:

✅ **[Agent Name] task complete!** Ready for the next step?  
Switch to **[Next Agent]** (press TAB, select `[next-agent]`) to [action].

**Trigger 2: Out-of-Scope Request**
When user asks for something outside your role:

That's outside my role as [Your Role]. For [requested task], switch to **[Appropriate Agent]** (TAB → `[agent-name]`).

### Handoff Matrix

| After You Complete | Next Agent | Action |
|--------------------|------------|--------|
| [Agent-specific completion scenario] | [Next Agent] | [What next agent does] |

[Each agent gets custom matrix based on their role]
```

**Agent-Specific Handoff Matrices**:

**Scoville (Orchestrator)**:
- After understanding request → Appropriate specialist
- After reading `.pepper/` state → Agent matching current phase

**Seed (Artifact Planner)**:
- After creating PRD → Seed again (for RFCs)
- After creating RFC(s) → Sprout (for execution plan)

**Sprout (Execution Planner)**:
- After creating plan → Jalapeño (for implementation)

**Jalapeño (Coder)**:
- After implementation → Habanero (for review)
- After fixes from review → Habanero again (for re-review)

**Habanero (Reviewer)**:
- After APPROVE → Scoville (for next RFC or task)
- After REQUEST_CHANGES → Jalapeño (for fixes)

**Chipotle (Scribe)**:
- After documentation → Scoville (for next task)

**Ghost (Explorer)**:
- After research → Scoville (to decide next steps)

### 4.2 RFC Compliance Checking Protocol (Habanero Only)

Add this section to Habanero's AGENT.md before "The 4 Review Layers":

```markdown
## RFC Compliance Checking Protocol

**CRITICAL**: Always verify implementation meets RFC acceptance criteria.

### Step 1: Locate the RFC

```bash
# Find the relevant RFC
ls .pepper/specs/rfc/v*/RFC-*.md

# Or ask user: "Which RFC does this implement?"
```

### Step 2: Extract Acceptance Criteria

Read the RFC and find sections:
- **Success Criteria** (usually Section 1.3)
- **Acceptance Criteria** (usually dedicated section)
- **Testing Requirements**

### Step 3: Verify Each Criterion

For each criterion, check:
- ✅ **Met**: Evidence in code/tests
- ⏳ **Partial**: Some progress, needs work
- ❌ **Not Met**: No evidence
- ⚠️ **Cannot Verify**: Need more info

### Step 4: Report Compliance

Add this section BEFORE code quality review:

```markdown
## RFC Compliance Check

**RFC**: [RFC-NNN: Title]

### Acceptance Criteria Verification

- [x] **Criterion 1**: [Description]
  - Status: ✅ Met
  - Evidence: [File:line or test name]

- [ ] **Criterion 2**: [Description]
  - Status: ❌ Not met
  - Gap: [What's missing]
  - Recommendation: [What needs to be done]

### Compliance Summary

- ✅ Met: X/Y criteria
- ⏳ Partial: X/Y criteria
- ❌ Not met: X/Y criteria

### Recommendation

- **APPROVE**: All P0 criteria met, P1 criteria acceptable
- **APPROVE WITH CONDITIONS**: [List P1 criteria to address post-merge]
- **REQUEST CHANGES**: [List blocking criteria]
```

### Example RFC Compliance Check

```markdown
## RFC Compliance Check

**RFC**: RFC-001: Workspace Path Resolution Utility

### Acceptance Criteria Verification

- [x] **100% success rate resolving valid symlinks**
  - Status: ✅ Met
  - Evidence: `workspace.ts:14-34` uses `fs.realpathSync()`, handles errors

- [x] **All edge cases handled with clear error messages**
  - Status: ✅ Met
  - Evidence: Lines 24-32 handle ENOENT, EACCES, circular symlinks

- [ ] **Cross-platform compatibility verified**
  - Status: ⏳ Partial
  - Gap: Tested on macOS only, not Windows/Linux
  - Recommendation: Add test matrix or document limitations

- [x] **Zero external dependencies beyond Node.js stdlib**
  - Status: ✅ Met
  - Evidence: Only uses `fs`, `path` from stdlib

- [ ] **100% test coverage of public API**
  - Status: ❌ Not met
  - Gap: No test file found (`workspace.test.ts` missing)
  - Recommendation: Add unit tests before merge

- [ ] **Performance: Path resolution < 10ms (99th percentile)**
  - Status: ⚠️ Cannot verify
  - Gap: No performance benchmarks
  - Recommendation: Add benchmark or accept based on `fs.realpathSync()` performance

### Compliance Summary

- ✅ Met: 3/6 criteria
- ⏳ Partial: 1/6 criteria
- ❌ Not met: 1/6 criteria  
- ⚠️ Cannot verify: 1/6 criteria

### Recommendation

**REQUEST CHANGES**: Must add tests (P0 criterion) before merge. Cross-platform testing and performance benchmarks can be P1 follow-ups.
```
```

### 4.3 Symlink Awareness Polish

**Changes**:
- Ensure all agents have "## Symlink Workspace Awareness" section
- Standardize formatting (headings, code blocks, checklists)
- Verify examples are consistent (use same paths: `/tmp/ocx-ghost-abc123`)
- Add reference to RFC-001, RFC-002, RFC-003

**No major content changes** - sections are already comprehensive.

---

## 5. Implementation Plan

### 5.1 File Changes

All changes in `files/agent/*/AGENT.md`:

| Agent | File | Changes |
|-------|------|---------|
| Scoville | `scoville-orchestrator/AGENT.md` | Add Workflow Handoff Protocol (Orchestrator version) |
| Seed | `seed-prd-rfc/AGENT.md` | Add Workflow Handoff Protocol (PRD/RFC → Sprout) |
| Sprout | `sprout-execution-planner/AGENT.md` | Add Workflow Handoff Protocol (Plan → Jalapeño) |
| Jalapeño | `jalapeno-coder/AGENT.md` | Add Workflow Handoff Protocol (Work → Habanero) |
| Habanero | `habanero-reviewer/AGENT.md` | Add RFC Compliance Protocol + Workflow Handoff |
| Chipotle | `chipotle-scribe/AGENT.md` | Add Workflow Handoff Protocol (Docs → Scoville) |
| Ghost | `ghost-explorer/AGENT.md` | Add Workflow Handoff Protocol (Research → Scoville) |

### 5.2 Implementation Steps

1. **Create working branch**: `git checkout -b feat/rfc-003-agent-prompt-updates`

2. **Update Scoville** (`scoville-orchestrator/AGENT.md`):
   - Add Workflow Handoff Protocol section
   - Update symlink section for consistency

3. **Update Seed** (`seed-prd-rfc/AGENT.md`):
   - Add Workflow Handoff Protocol section
   - Handoff: PRD done → Seed for RFCs, RFCs done → Sprout for plan

4. **Update Sprout** (`sprout-execution-planner/AGENT.md`):
   - Add Workflow Handoff Protocol section
   - Handoff: Plan done → Jalapeño for implementation

5. **Update Jalapeño** (`jalapeno-coder/AGENT.md`):
   - Add Workflow Handoff Protocol section
   - Handoff: Implementation done → Habanero for review

6. **Update Habanero** (`habanero-reviewer/AGENT.md`):
   - Add RFC Compliance Checking Protocol section (BEFORE review layers)
   - Add Workflow Handoff Protocol section
   - Handoff: APPROVE → Scoville, REQUEST_CHANGES → Jalapeño

7. **Update Chipotle** (`chipotle-scribe/AGENT.md`):
   - Add Workflow Handoff Protocol section
   - Handoff: Docs done → Scoville

8. **Update Ghost** (`ghost-explorer/AGENT.md`):
   - Add Workflow Handoff Protocol section
   - Handoff: Research done → Scoville

9. **Update ARCHITECTURE.md**:
   - Document new workflow handoff protocol
   - Update agent coordination section

10. **Build and test**:
    ```bash
    bun run build
    ```

11. **Manual testing** (see Section 6)

12. **Commit and review**:
    ```bash
    git add files/agent/*/AGENT.md ARCHITECTURE.md
    git commit -m "feat(agents): add workflow handoff protocol and RFC compliance checking

    - Add Workflow Handoff Protocol to all 7 agents
    - Add RFC Compliance Checking Protocol to Habanero
    - Polish symlink awareness sections for consistency
    - Update ARCHITECTURE.md with workflow documentation

    Implements RFC-003
    Fixes Agent Workflow Awareness issue
    Fixes Habanero Review Process issue"
    ```

---

## 6. Testing Strategy

### 6.1 Manual Workflow Testing

Test the complete workflow with a small RFC:

**Test Scenario**: Create RFC-006 (Test RFC) and implement it

1. **Start with Scoville**:
   - User: "yo"
   - ✅ Verify: Scoville suggests switching to Seed for PRD/RFC creation

2. **Switch to Seed**:
   - User: "I want to create RFC-006 for testing"
   - ✅ Verify: After RFC creation, Seed says "Switch to Sprout to create execution plan"

3. **Switch to Sprout**:
   - User: "Create plan for RFC-006"
   - ✅ Verify: After plan creation, Sprout says "Switch to Jalapeño to implement"

4. **Switch to Jalapeño**:
   - User: "Implement RFC-006"
   - ✅ Verify: After implementation, Jalapeño says "Switch to Habanero for review"

5. **Switch to Habanero**:
   - User: "Review RFC-006 implementation"
   - ✅ Verify: Review includes "## RFC Compliance Check" section
   - ✅ Verify: Acceptance criteria from RFC-006 are listed and verified
   - ✅ Verify: Handoff suggests either Scoville (APPROVE) or Jalapeño (REQUEST_CHANGES)

6. **Out-of-scope test**:
   - User asks Seed: "Implement this RFC"
   - ✅ Verify: Seed says "That's outside my role, switch to Jalapeño"

### 6.2 Acceptance Criteria

- [ ] All 7 agents have "## Workflow Handoff Protocol" section
- [ ] Habanero has "## RFC Compliance Checking Protocol" section
- [ ] Handoff messages use friendly suggestion format
- [ ] Handoff triggers at task completion
- [ ] Handoff triggers for out-of-scope requests
- [ ] Habanero's RFC compliance check includes:
  - [ ] RFC identification
  - [ ] Acceptance criteria extraction
  - [ ] Per-criterion verification
  - [ ] Compliance summary
  - [ ] Approval recommendation
- [ ] Symlink awareness sections are consistent across all agents
- [ ] ARCHITECTURE.md documents new workflow protocol
- [ ] Manual testing completes full workflow successfully
- [ ] No regressions (existing functionality still works)

---

## 7. Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Users skip workflow steps | High (issue reported) | 0% | User feedback after 2 weeks |
| RFCs with unmet criteria passing review | Unknown (suspected high) | 0% | Review all merged RFCs |
| Workflow confusion reports | Multiple in notepad | 0 new reports | Issue tracker |
| Agent handoff clarity | No explicit handoffs | 100% explicit | Code review |

---

## 8. Non-Functional Requirements

- **Performance**: No impact (prompt updates only)
- **Backward Compatibility**: Existing workflows unchanged, only enhanced
- **Documentation**: ARCHITECTURE.md updated
- **Rollout**: Atomic (all agents updated together)

---

## 9. Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Handoff messages too verbose | Medium | Low | Use concise, friendly format |
| RFC compliance adds review time | Medium | Medium | Worth the quality improvement |
| Inconsistent handoff behavior | High | Low | Manual testing catches this |
| Users ignore handoff suggestions | Low | Medium | Acceptable - they're suggestions, not enforcement |

---

## 10. Open Questions

**Q1**: Should handoffs be enforced (block out-of-scope actions) or just suggested?  
**A1**: Suggestions only - preserve user flexibility

**Q2**: Should RFC compliance be optional or mandatory for Habanero?  
**A2**: Mandatory when RFC exists, gracefully skip if no RFC

**Q3**: How to handle RFCs with no explicit acceptance criteria?  
**A3**: Habanero should note "RFC has no acceptance criteria section" and proceed with code quality review only

---

## 11. Appendix

### 11.1 Example Handoff Messages

**Seed → Sprout** (after RFC creation):
```
✅ RFC-003 complete and saved to `.pepper/specs/rfc/v1.0.0/RFC-003-agent-prompt-updates.md`

Ready for the next step? Switch to **Sprout** (press TAB, select `sprout-execution-planner`) to create an execution plan from this RFC.
```

**Jalapeño → Habanero** (after implementation):
```
✅ Implementation complete! Changes committed to `feat/rfc-003-agent-prompt-updates`.

Ready for review? Switch to **Habanero** (press TAB, select `habanero-reviewer`) for code review and RFC compliance checking.
```

**Habanero → Scoville** (after APPROVE):
```
✅ Code review complete - APPROVED

All RFC-003 acceptance criteria met. Ready for the next task? Switch to **Scoville** (press TAB, select `scoville-orchestrator`) to continue with RFC-004 or other work.
```

### 11.2 RFC Compliance Check Template

```markdown
## RFC Compliance Check

**RFC**: RFC-XXX: [Title]

### Acceptance Criteria Verification

- [x] **[Criterion 1]**: [Description]
  - Status: ✅ Met | ⏳ Partial | ❌ Not met | ⚠️ Cannot verify
  - Evidence: [File:line, test name, or explanation]
  - [Optional] Gap/Recommendation

[Repeat for all criteria]

### Compliance Summary

- ✅ Met: X/Y criteria
- ⏳ Partial: X/Y criteria  
- ❌ Not met: X/Y criteria
- ⚠️ Cannot verify: X/Y criteria

### Recommendation

**APPROVE** | **APPROVE WITH CONDITIONS** | **REQUEST CHANGES**: [Justification]
```

### 11.3 References

- **Parent PRD**: `.pepper/specs/prd/core-improvements-v1.0.0.md`
- **RFC-001**: Workspace Path Resolution Utility (dependency)
- **RFC-002**: pepper_init Enhancement (dependency)
- **Issue**: Agent Workflow Awareness (`.pepper/notepad/issues.json`)
- **Issue**: Habanero Review Process Missing RFC Compliance (`.pepper/notepad/issues.json`)
- **Workflow**: ARCHITECTURE.md (to be updated)

---

**Document Status**: Ready for review and implementation
