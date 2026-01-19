---
status: not-started
phase: 1
created: 2026-01-19
branch: dev-symlink-detection
updated: 2026-01-19
---

# Testing Plan: dev-symlink-detection Branch

## Goal
Validate that RFC-001 (Workspace Path Resolution), RFC-002 (pepper_init Enhancement), and RFC-003 (Agent Prompt Updates) work correctly together on the `dev-symlink-detection` branch before merging to main.

## Context & Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| Test all 3 RFCs together | They're interdependent and shipped together | RFC-003 depends on RFC-001/002 |
| Focus on integration testing | Unit tests exist but integration is critical | Learnings: tmux testing pattern |
| Manual testing primary approach | No test framework setup yet | RFC-001 Section 6.4 |
| Use tmux for interactive commands | Prevents blocking | Learnings entry timestamp 2026-01-18T21:37:48 |
| Test in real Ghost workspace | Matches production use case | RFC-001 Section 1.1 |

## Phase 1: Pre-Test Setup [NOT STARTED]

- [ ] **1.1 Verify branch state** ← CURRENT
  - Check current branch: Should be `dev-symlink-detection`
  - Check for uncommitted changes: Should be clean
  - List recent commits: Should show RFC-001, RFC-002, RFC-003 commits
  - Source: Git best practices

- [ ] **1.2 Build the branch**
  - Run: `bun run build`
  - Verify: `dist/` directory updated
  - Verify: No build errors
  - Expected output: "40 components built" or similar
  - Source: RFC-003 Phase 3 Task 3.1

- [ ] **1.3 Create isolated Ghost profile for testing**
  - Create profile: `ocx ghost profile add test-symlink-detection`
  - Switch to profile: `ocx ghost profile use test-symlink-detection`
  - Add local registry: `ocx ghost registry add file:///Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/dist --name test-dev`
  - Install pepper harness: `ocx ghost add test-dev/pepper-harness`
  - Source: Learnings entry "Dev Branch Testing Workflow"

## Phase 2: RFC-001 Testing (Workspace Path Resolution) [NOT STARTED]

### Test Group 2.1: Symlink Resolution

- [ ] **2.1.1 Test: Regular directory path resolution**
  - Setup: Use real chili-ocx directory (not symlinked)
  - Test: `resolveWorkspacePath('/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx')`
  - Expected: Returns same path (normalized)
  - Acceptance: Path resolved correctly, no errors
  - Source: RFC-001 Section 6.2 Test Case 2

- [ ] **2.1.2 Test: Symlinked Ghost workspace resolution**
  - Setup: Create symlink `ln -s /Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx /tmp/ocx-ghost-test-$(date +%s)`
  - Test: `resolveWorkspacePath('/tmp/ocx-ghost-test-*')`
  - Expected: Returns `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx`
  - Acceptance: Symlink resolved to real path
  - Cleanup: Remove test symlink
  - Source: RFC-001 Section 6.2 Test Case 1

- [ ] **2.1.3 Test: Broken symlink error handling**
  - Setup: Create broken symlink `ln -s /nonexistent /tmp/broken-test-$(date +%s)`
  - Test: `resolveWorkspacePath('/tmp/broken-test-*')`
  - Expected: WorkspaceError with code ENOENT and clear message
  - Acceptance: Error message is actionable
  - Cleanup: Remove broken symlink
  - Source: RFC-001 Section 6.2 Test Case 3

### Test Group 2.2: Workspace Info

- [ ] **2.2.1 Test: getWorkspaceInfo() for symlink**
  - Setup: Create test symlink
  - Test: `getWorkspaceInfo('/tmp/ocx-ghost-test-*')`
  - Expected: Returns object with isSymlink=true, symlink path, real path, timestamp
  - Acceptance: All fields populated correctly
  - Source: RFC-001 Section 5.1

- [ ] **2.2.2 Test: getWorkspaceInfo() for regular directory**
  - Test: `getWorkspaceInfo('/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx')`
  - Expected: Returns object with isSymlink=false, symlink=null, real path
  - Acceptance: Correctly identifies non-symlink
  - Source: RFC-001 Section 5.1

- [ ] **2.2.3 Test: isSymlink() detection**
  - Test symlink: `isSymlink('/tmp/ocx-ghost-test-*')` → true
  - Test regular dir: `isSymlink('/Users/chili/...')` → false
  - Expected: Correct boolean values
  - Source: RFC-001 Section 2.2.2

## Phase 3: RFC-002 Testing (pepper_init Enhancement) [NOT STARTED]

### Test Group 3.1: pepper_init in Symlinked Workspace

- [ ] **3.1.1 Test: pepper_init in Ghost symlinked workspace**
  - Setup: Start Ghost OpenCode in tmux session (use tmux pattern from learnings)
  - Create symlink workspace (or use existing Ghost workspace)
  - Test: Run `/pepper-init` command in Ghost session
  - Expected: 
    - `.pepper/` created at REAL path (not symlink path)
    - state.json v1.1.0 contains workspacePath object
    - Success message shows both symlink and real paths
  - Verification:
    - Check `.pepper/state.json` exists at real path
    - Verify `state.json` has version "1.1.0"
    - Verify `workspacePath.isSymlink === true`
    - Verify `workspacePath.symlink` matches Ghost workspace path
    - Verify `workspacePath.real` matches actual repo path
  - Cleanup: Remove `.pepper/` directory after test
  - Source: RFC-002 Section 4.1 Test 1

- [ ] **3.1.2 Test: pepper_init in regular directory**
  - Setup: Use non-symlinked directory
  - Test: Run `/pepper-init`
  - Expected:
    - `.pepper/` created normally
    - state.json v1.1.0 with workspacePath.isSymlink = false
    - workspacePath.symlink = null
    - Success message doesn't show symlink info
  - Verification:
    - Check state.json structure
    - Verify workspacePath fields correct
  - Source: RFC-002 Section 4.1 Test 2

- [ ] **3.1.3 Test: pepper_init with broken symlink**
  - Setup: Create broken symlink workspace
  - Test: Run `/pepper-init`
  - Expected:
    - Error message: "Failed to resolve workspace path: Path does not exist..."
    - No `.pepper/` directory created
    - Helpful troubleshooting message shown
  - Acceptance: Error handling works, clear user guidance
  - Source: RFC-002 Section 4.1 Test 3

- [ ] **3.1.4 Test: pepper_init already initialized**
  - Setup: Run `/pepper-init` once successfully
  - Test: Run `/pepper-init` again
  - Expected: "✅ .pepper/ already initialized" message
  - Acceptance: No files overwritten, safe to re-run
  - Source: RFC-002 Section 4.1 Test 4

### Test Group 3.2: State Schema Validation

- [ ] **3.2.1 Verify state.json v1.1.0 schema**
  - After pepper_init, read `.pepper/state.json`
  - Verify fields exist:
    - `version` === "1.1.0"
    - `initialized` (ISO 8601 timestamp)
    - `workspacePath` object with: symlink, real, isSymlink, resolvedAt
    - `session_ids` array
    - `auto_continue` boolean
  - Acceptance: Schema matches RFC-002 Section 2.2 exactly
  - Source: RFC-002 Section 2.2

- [ ] **3.2.2 Verify all .pepper/ directories created**
  - Check existence:
    - `.pepper/specs/prd/`
    - `.pepper/specs/rfc/`
    - `.pepper/plans/`
    - `.pepper/tracking/`
    - `.pepper/notepad/`
    - `.pepper/drafts/`
    - `.pepper/state.json`
    - `.pepper/plan.md`
    - `.pepper/notepad/learnings.json`
    - `.pepper/notepad/issues.json`
    - `.pepper/notepad/decisions.json`
    - `.pepper/tracking/rfc-status.json`
  - Acceptance: All directories and files exist
  - Source: RFC-002 Section 3.1

## Phase 4: RFC-003 Testing (Agent Workflow & Compliance) [NOT STARTED]

### Test Group 4.1: Workflow Handoff Protocol

- [ ] **4.1.1 Test: Scoville → Seed handoff**
  - Start Ghost OpenCode session
  - Switch to Scoville agent
  - User message: "yo" or similar greeting
  - Expected: Scoville suggests switching to appropriate agent
  - Acceptance: Handoff message present and helpful
  - Source: RFC-003 Section 6.1

- [ ] **4.1.2 Test: Seed → Sprout handoff**
  - Switch to Seed agent
  - Create small test RFC (RFC-TEST-001)
  - After RFC creation, check Seed's response
  - Expected: Message suggests "Switch to **Sprout** (TAB key) to create execution plan"
  - Acceptance: Clear handoff with TAB key instruction
  - Source: RFC-003 Section 6.1, Example handoff messages

- [ ] **4.1.3 Test: Sprout → Jalapeño handoff**
  - Switch to Sprout agent
  - Create plan for RFC-TEST-001
  - After plan creation, check Sprout's response
  - Expected: Message suggests "Switch to **Jalapeño** to implement"
  - Acceptance: Clear handoff message
  - Source: RFC-003 Section 6.1

- [ ] **4.1.4 Test: Jalapeño → Habanero handoff**
  - Switch to Jalapeño agent
  - Implement simple RFC-TEST-001
  - After implementation, check Jalapeño's response
  - Expected: Message suggests "Switch to **Habanero** for review"
  - Acceptance: Clear handoff message
  - Source: RFC-003 Section 6.1

- [ ] **4.1.5 Test: Out-of-scope request handoff**
  - Switch to Seed agent
  - Ask: "Please implement this RFC for me"
  - Expected: Seed says "That's outside my role... switch to **Jalapeño**"
  - Acceptance: Polite redirect to correct agent
  - Source: RFC-003 Section 6.1 Step 6

### Test Group 4.2: Habanero RFC Compliance Checking

- [ ] **4.2.1 Test: RFC compliance check appears in review**
  - Setup: Have Jalapeño implement RFC-TEST-001
  - Switch to Habanero agent
  - Request: "Review the RFC-TEST-001 implementation"
  - Expected:
    - Review includes "## RFC Compliance Check" section
    - Section appears BEFORE code quality review
    - Acceptance criteria from RFC listed
    - Each criterion has status (✅/⏳/❌/⚠️)
    - Compliance summary included
    - Recommendation provided (APPROVE/APPROVE WITH CONDITIONS/REQUEST CHANGES)
  - Acceptance: All 5 subcriteria from RFC-003 Section 6.2 present
  - Source: RFC-003 Section 6.1 Step 5

- [ ] **4.2.2 Test: RFC compliance check format**
  - From previous test, verify format matches:
    - RFC identification section
    - Acceptance Criteria Verification (checklist)
    - Compliance Summary (counts)
    - Recommendation (decision)
  - Expected: Format matches RFC-003 Appendix 11.2 template
  - Source: RFC-003 Section 4.2

- [ ] **4.2.3 Test: Habanero handoff after APPROVE**
  - If Habanero approves implementation
  - Expected: Suggests "Switch to **Scoville** for next task"
  - Source: RFC-003 Section 4.1 Lines 141-143

- [ ] **4.2.4 Test: Habanero handoff after REQUEST_CHANGES**
  - If Habanero requests changes
  - Expected: Suggests "Switch to **Jalapeño** to fix issues"
  - Source: RFC-003 Section 4.1 Lines 141-143

### Test Group 4.3: Agent Prompt Content Verification

- [ ] **4.3.1 Verify all agents have Workflow Handoff Protocol section**
  - Read each AGENT.md file:
    - `files/agent/scoville-orchestrator/AGENT.md`
    - `files/agent/seed-prd-rfc/AGENT.md`
    - `files/agent/sprout-execution-planner/AGENT.md`
    - `files/agent/jalapeno-coder/AGENT.md`
    - `files/agent/habanero-reviewer/AGENT.md`
    - `files/agent/chipotle-scribe/AGENT.md`
    - `files/agent/ghost-explorer/AGENT.md`
  - Verify each has "## Workflow Handoff Protocol" section
  - Verify section contains handoff matrix
  - Acceptance: All 7 agents have section
  - Source: RFC-003 Section 6.2

- [ ] **4.3.2 Verify Habanero has RFC Compliance Protocol**
  - Read `files/agent/habanero-reviewer/AGENT.md`
  - Verify has "## RFC Compliance Checking Protocol" section
  - Verify section appears BEFORE "## The 4 Review Layers"
  - Verify includes 4-step protocol (Locate → Extract → Verify → Report)
  - Verify includes example compliance check
  - Acceptance: Section complete and well-placed
  - Source: RFC-003 Section 6.2

- [ ] **4.3.3 Verify ARCHITECTURE.md updated**
  - Read `ARCHITECTURE.md`
  - Verify has "## Agent Workflow Handoff Protocol" section
  - Verify section documents workflow sequence
  - Verify includes handoff matrix and examples
  - Acceptance: Documentation complete
  - Source: RFC-003 Section 6.2

### Test Group 4.4: Symlink Awareness Consistency

- [ ] **4.4.1 Verify symlink sections consistent across agents**
  - Read all 7 AGENT.md files
  - Check symlink awareness sections for:
    - Consistent formatting (headings, code blocks)
    - Consistent examples (use same paths)
    - Reference to RFC-001, RFC-002, RFC-003
  - Acceptance: All sections polished and consistent
  - Source: RFC-003 Section 4.3

## Phase 5: Integration Testing [NOT STARTED]

### Test Group 5.1: End-to-End Workflow

- [ ] **5.1.1 Test: Complete workflow in Ghost workspace**
  - Setup: Create fresh Ghost symlinked workspace
  - Step 1: Run `/pepper-init` → Verify success
  - Step 2: Switch to Scoville → Verify context awareness
  - Step 3: Switch to Seed → Create small PRD
  - Step 4: Seed creates RFC from PRD → Verify handoff message
  - Step 5: Switch to Sprout → Create plan → Verify handoff
  - Step 6: Switch to Jalapeño → Implement → Verify handoff
  - Step 7: Switch to Habanero → Review with RFC compliance → Verify
  - Acceptance: Complete workflow works smoothly
  - Source: RFC-003 Section 6.1 Test Scenario

- [ ] **5.1.2 Test: Workspace resolution throughout workflow**
  - During above workflow, verify:
    - All file operations use real path (not symlink)
    - state.json correctly shows workspace paths
    - No path-related errors occur
    - Files created at expected locations
  - Acceptance: Workspace resolution transparent to user
  - Source: RFC-001 + RFC-002 integration

- [ ] **5.1.3 Test: No regressions in regular (non-symlinked) workspace**
  - Repeat Phase 5.1.1 workflow in non-symlinked directory
  - Expected: Everything works identically
  - Acceptance: No regressions, backward compatible
  - Source: RFC-002 Section 3.2 backward compatibility

## Phase 6: Acceptance Criteria Verification [NOT STARTED]

### RFC-001 Acceptance Criteria

- [ ] **6.1.1 100% success rate resolving valid symlinks**
  - Evidence: Tests 2.1.2, 2.2.1 pass
  - Status: To be verified

- [ ] **6.1.2 All edge cases handled with clear error messages**
  - Evidence: Test 2.1.3 (broken symlink) passes with clear error
  - Status: To be verified

- [ ] **6.1.3 Cross-platform compatibility verified**
  - Evidence: Tests run on macOS (primary platform)
  - Note: Windows/Linux testing deferred (acceptable per RFC-001)
  - Status: Partial - macOS only

- [ ] **6.1.4 Zero external dependencies beyond Node.js stdlib**
  - Evidence: Code review shows only fs, path imports
  - Status: To be verified

- [ ] **6.1.5 100% test coverage of public API**
  - Evidence: Tests exist in workspace.test.ts.skip
  - Note: Pending test framework setup (acceptable per RFC-001)
  - Status: Tests written, not executed

- [ ] **6.1.6 Performance: Path resolution < 10ms**
  - Evidence: Manual validation passed (per RFC-001)
  - Status: Manually verified

### RFC-002 Acceptance Criteria

- [ ] **6.2.1 pepper_init works in symlinked Ghost workspaces**
  - Evidence: Test 3.1.1 passes
  - Status: To be verified

- [ ] **6.2.2 state.json v1.1.0 contains workspace path info**
  - Evidence: Test 3.2.1 passes
  - Status: To be verified

- [ ] **6.2.3 All file operations use resolved real path**
  - Evidence: Test 5.1.2 shows files at real path
  - Status: To be verified

- [ ] **6.2.4 Backward compatible with existing .pepper/ directories**
  - Evidence: Test 5.1.3 (non-symlinked) passes
  - Status: To be verified

- [ ] **6.2.5 No external dependencies added**
  - Evidence: Code review shows only workspace import
  - Status: To be verified

- [ ] **6.2.6 Manual testing in Ghost workspace passes**
  - Evidence: Test 3.1.1 and 5.1.1 pass
  - Status: To be verified

### RFC-003 Acceptance Criteria

- [ ] **6.3.1 All 7 agents have Workflow Handoff Protocol section**
  - Evidence: Test 4.3.1 passes
  - Status: To be verified

- [ ] **6.3.2 Habanero has RFC Compliance Checking Protocol section**
  - Evidence: Test 4.3.2 passes
  - Status: To be verified

- [ ] **6.3.3 Handoff messages use friendly suggestion format**
  - Evidence: Tests 4.1.1-4.1.5 show friendly format
  - Status: To be verified

- [ ] **6.3.4 Handoff triggers at task completion**
  - Evidence: Tests 4.1.2-4.1.4 verify completion handoffs
  - Status: To be verified

- [ ] **6.3.5 Handoff triggers for out-of-scope requests**
  - Evidence: Test 4.1.5 verifies out-of-scope handoff
  - Status: To be verified

- [ ] **6.3.6 Habanero RFC compliance check complete**
  - Sub-criteria:
    - [ ] RFC identification - Test 4.2.1
    - [ ] Acceptance criteria extraction - Test 4.2.1
    - [ ] Per-criterion verification - Test 4.2.1
    - [ ] Compliance summary - Test 4.2.1
    - [ ] Approval recommendation - Test 4.2.1
  - Status: To be verified

- [ ] **6.3.7 Symlink awareness sections consistent**
  - Evidence: Test 4.4.1 passes
  - Status: To be verified

- [ ] **6.3.8 ARCHITECTURE.md documents workflow protocol**
  - Evidence: Test 4.3.3 passes
  - Status: To be verified

- [ ] **6.3.9 Manual testing completes full workflow successfully**
  - Evidence: Test 5.1.1 passes
  - Status: To be verified

- [ ] **6.3.10 No regressions**
  - Evidence: Test 5.1.3 passes, existing features work
  - Status: To be verified

## Phase 7: Documentation & Reporting [NOT STARTED]

- [ ] **7.1 Document test results**
  - Create test report summarizing:
    - Pass/fail status for each test
    - Any issues discovered
    - Performance observations
    - Recommendations for merge
  - Save to: `.pepper/testing/dev-symlink-detection-test-report.md`
  - Source: Testing best practices

- [ ] **7.2 Update RFC status tracking**
  - Update `.pepper/tracking/rfc-status.json`:
    - RFC-001: status → "tested" or "complete"
    - RFC-002: status → "tested" or "complete"
    - RFC-003: status → "tested" or "complete"
  - Add test date and results
  - Source: RFC tracking convention

- [ ] **7.3 Record learnings**
  - Add notepad entries for:
    - Testing insights
    - Issues discovered
    - Workflow improvements identified
  - Use: `pepper_notepad_add`
  - Source: Notepad best practices

- [ ] **7.4 Merge decision**
  - Based on test results, decide:
    - ✅ READY TO MERGE: All critical tests pass
    - ⏳ NEEDS FIXES: Address blocking issues first
    - ❌ MAJOR ISSUES: Requires significant rework
  - Document decision and rationale
  - Source: Git workflow best practices

---

## Testing Execution Notes

### Tools & Commands

**tmux Pattern for Interactive Testing** (from learnings):
```bash
# Start Ghost in background
tmux new-session -d -s test-ghost "ocx ghost opencode"
sleep 5

# Send commands
tmux send-keys -t test-ghost "/pepper-init" C-m
sleep 2

# Capture output
timeout 30s tmux capture-pane -t test-ghost -p > output.txt

# Verify
grep -q "✅ Initialized" output.txt

# Cleanup
tmux kill-session -t test-ghost
```

**Manual Node.js Testing**:
```bash
# Test workspace utilities directly
node -e "
  const { getWorkspaceInfo } = require('./plugin/src/utils/workspace');
  console.log(getWorkspaceInfo(process.argv[1]));
" /tmp/test-symlink
```

### Environment Requirements

- **Ghost Profile**: test-symlink-detection (isolated)
- **Registry**: Local file:// pointing to dist/
- **Test Workspace**: Create temp symlinks as needed
- **Cleanup**: Remove all test symlinks and `.pepper/` dirs after testing

### Expected Timeline

- Phase 1 (Setup): 15 minutes
- Phase 2 (RFC-001): 30 minutes
- Phase 3 (RFC-002): 45 minutes
- Phase 4 (RFC-003): 60 minutes
- Phase 5 (Integration): 45 minutes
- Phase 6 (Acceptance): 30 minutes
- Phase 7 (Documentation): 30 minutes

**Total**: ~4 hours (manual testing)

### Success Criteria

**Minimum for Merge**:
- All P0 acceptance criteria met (RFC-001, RFC-002, RFC-003)
- No critical bugs discovered
- End-to-end workflow completes successfully
- No regressions in non-symlinked workspaces

**Nice to Have**:
- All P1 acceptance criteria met
- Performance benchmarks recorded
- Comprehensive test report documented

---

## Next Steps After Testing

**If tests pass**:
1. Document results in test report
2. Update RFC status to "complete"
3. Merge `dev-symlink-detection` → `main`
4. Create GitHub release/tag
5. Update production Ghost profile
6. Move to next roadmap item (tackle remaining issues)

**If tests fail**:
1. Document failures in detail
2. Create issues for each blocking problem
3. Switch to Jalapeño to fix issues
4. Re-test after fixes
5. Repeat until ready

---

**Plan Status**: Ready for Jalapeño execution  
**Estimated Effort**: 4 hours manual testing  
**Blocking**: None - can start immediately  
**Next Agent**: Jalapeño (to execute this testing plan)
