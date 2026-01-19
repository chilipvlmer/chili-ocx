# Phase 8 Manual Testing Checklist

**Purpose**: Manual validation of OpenCode TUI interactions for dev-symlink-detection branch  
**Timeline**: Post-merge validation (within 24 hours)  
**Owner**: Project maintainer or designated tester  
**Priority**: P0 - Critical validation required

---

## Prerequisites

- [ ] Branch merged to main
- [ ] Fresh OpenCode workspace ready
- [ ] Dev registry available OR production registry updated
- [ ] Plugin log accessible: `/tmp/chili-ocx-plugin.log`

---

## Environment Setup

### 1. Launch Fresh OpenCode Workspace

```bash
# Start OpenCode
ocx ghost opencode

# Verify you're in a fresh workspace
pwd  # Should show /tmp/ocx-ghost-XXXXXXXX/
```

- [ ] OpenCode TUI launched successfully
- [ ] Workspace path confirmed: ________________

### 2. Verify Components Loaded

```bash
# Check plugin log
tail -20 /tmp/chili-ocx-plugin.log
```

- [ ] Log shows: "chili-ocx plugin loaded successfully"
- [ ] Log shows: "Registered 3 custom tools"
- [ ] No errors in log

---

## Test 8.5: /pepper-init Live Execution

**Objective**: Verify `/pepper-init` command works in OpenCode TUI

### Steps

1. Type slash to open command autocomplete
   - [ ] Slash commands menu appears

2. Type: `/pepper-init`
   - [ ] Command autocompletes
   - [ ] Description shows: "Initialize .pepper/ directory structure..."

3. Press Enter to execute
   - [ ] Agent (Scoville) processes command
   - [ ] Success message appears
   - [ ] Message includes directory structure list

4. Verify success message content
   - [ ] Shows "✅ Initialized .pepper/ structure"
   - [ ] Lists created directories (specs/prd, specs/rfc, plans, etc.)
   - [ ] Shows "Next steps" section

5. If workspace is symlinked, verify resolution message
   - [ ] Shows "📍 Workspace resolved:" section (if applicable)
   - [ ] Shows both symlink and real path

**Screenshot**: [Attach screenshot of success message]

**Result**: ☐ PASS  ☐ FAIL  
**Notes**: _______________________________________________

---

## Test 8.6: state.json v1.1.0 Schema Verification

**Objective**: Verify state.json created with correct v1.1.0 schema

### Steps

1. Open state.json file
   ```bash
   cat .pepper/state.json
   ```

2. Verify schema fields:
   - [ ] `version`: "1.1.0"
   - [ ] `initialized`: ISO timestamp present
   - [ ] `workspacePath` object exists
   - [ ] `workspacePath.symlink`: string or null
   - [ ] `workspacePath.real`: string (absolute path)
   - [ ] `workspacePath.isSymlink`: boolean
   - [ ] `workspacePath.resolvedAt`: ISO timestamp
   - [ ] `session_ids`: array
   - [ ] `auto_continue`: boolean

3. Verify workspacePath logic
   - [ ] If workspace is symlink: `isSymlink` = true, `symlink` = path
   - [ ] If workspace is regular: `isSymlink` = false, `symlink` = null
   - [ ] `real` path matches actual repository location

**state.json content**:
```json
[Paste state.json here]
```

**Result**: ☐ PASS  ☐ FAIL  
**Notes**: _______________________________________________

---

## Test 8.7: Agent Prompt Loading

**Objective**: Verify agent prompts load correctly with new workflow protocols

### Steps - Habanero (RFC Compliance)

1. Switch to Habanero agent
   - Press TAB key
   - [ ] Agent selector appears
   - [ ] Select: "habanero-reviewer"

2. Check system prompt (if accessible) OR ask Habanero to describe capabilities
   - Type: "Do you have RFC compliance checking capabilities?"
   - [ ] Habanero confirms RFC Compliance Checking Protocol
   - [ ] Mentions 4-step process (Locate → Extract → Verify → Report)

**Screenshot**: [Habanero response]

### Steps - Workflow Handoff Protocol

3. Switch to Jalapeño agent
   - [ ] Agent switch successful

4. Ask about workflow handoffs
   - Type: "What do you do when a task requires code review?"
   - [ ] Mentions handing off to Habanero
   - [ ] References workflow handoff protocol

5. Spot check one more agent (e.g., Sprout)
   - [ ] Switch successful
   - [ ] Agent mentions appropriate handoffs

**Result**: ☐ PASS  ☐ FAIL  
**Notes**: _______________________________________________

---

## Test 8.8: /pepper-status Command

**Objective**: Verify `/pepper-status` tool works correctly

### Steps

1. Execute command
   ```
   /pepper-status
   ```

2. Verify output includes:
   - [ ] State version
   - [ ] Auto-continue status
   - [ ] Document counts (PRDs, RFCs, Plans)
   - [ ] Current plan status
   - [ ] Next steps suggestions

**Screenshot**: [Status output]

**Result**: ☐ PASS  ☐ FAIL  
**Notes**: _______________________________________________

---

## Test 8.9: Plugin Log Monitoring

**Objective**: Verify no errors during basic workflow

### Steps

1. Clear or note current log position
   ```bash
   tail -f /tmp/chili-ocx-plugin.log
   ```

2. Execute basic workflow:
   - [ ] Run `/pepper-init` (if not already done)
   - [ ] Run `/pepper-status`
   - [ ] Switch between 2-3 agents

3. Check log for:
   - [ ] Tool execution logs present
   - [ ] No ERROR messages
   - [ ] No WARNING messages
   - [ ] Success confirmations present

**Log excerpt**:
```
[Paste relevant log lines]
```

**Result**: ☐ PASS  ☐ FAIL  
**Notes**: _______________________________________________

---

## Test 8.10: Workflow Handoff (Interactive)

**Objective**: Test real workflow handoff between agents

### Steps

1. Ask Scoville to create a plan
   - Type: "Create a simple execution plan for testing"
   - [ ] Scoville suggests switching to Sprout
   - [ ] Handoff message is friendly and clear

2. Follow the handoff
   - [ ] Switch to Sprout
   - [ ] Sprout acknowledges task
   - [ ] Creates a basic plan

3. Ask for code review
   - [ ] Agent suggests Habanero
   - [ ] Handoff message clear

**Screenshot**: [Handoff messages]

**Result**: ☐ PASS  ☐ FAIL  
**Notes**: _______________________________________________

---

## Test 8.11: Workspace Resolution in Symlinked Environment

**Objective**: Verify workspace resolution works correctly (if applicable)

**Note**: Only applicable if testing in symlinked Ghost workspace

### Steps

1. Verify workspace is symlink
   ```bash
   pwd -P  # Shows real path
   pwd     # Shows symlink path (if different)
   ```
   - [ ] Workspace is symlinked

2. Check state.json workspacePath
   - [ ] `symlink` matches `pwd` output
   - [ ] `real` matches `pwd -P` output
   - [ ] `isSymlink` is `true`

3. Verify .pepper/ created at real location
   ```bash
   ls -la $(pwd -P)/.pepper
   ```
   - [ ] .pepper/ exists at real path
   - [ ] Contains expected structure

**Result**: ☐ PASS  ☐ FAIL  ☐ N/A (not symlinked)  
**Notes**: _______________________________________________

---

## Summary

### Results

- **Total Tests**: 7
- **Passed**: ___
- **Failed**: ___
- **N/A**: ___

### Pass Criteria (from Post-Merge Validation Plan)

1. ☐ `/pepper-init` creates `.pepper/state.json` with version "1.1.0"
2. ☐ state.json contains workspacePath object with all fields
3. ☐ Agent prompts visible in OpenCode TUI (Habanero, Jalapeño verified)
4. ☐ No errors in plugin log during basic workflow
5. ☐ `/pepper-status` command works correctly

**Overall Result**: ☐ ALL PASS ✅  ☐ ISSUES FOUND ⚠️

### Issues Found

[List any issues discovered during testing]

### Rollback Decision

☐ No rollback needed - all tests passed  
☐ Rollback recommended - P0 issues found

---

**Tester**: _______________  
**Date**: _______________  
**Time Spent**: _______________  
**Validation Status**: ☐ COMPLETE  ☐ IN PROGRESS  
