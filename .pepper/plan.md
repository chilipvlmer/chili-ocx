---
status: not-started
phase: 8
created: 2026-01-19
branch: dev-symlink-detection
updated: 2026-01-19
priority: P0-BLOCKER
type: end-to-end-testing
meta-learning: true
---

# Phase 8 Execution Plan: End-to-End Installation & Launch Test

## Goal
Verify that the `dev-symlink-detection` branch can be successfully installed from the local registry and launched in Ghost OpenCode with all functionality working correctly.

**CRITICAL**: This is not just a test - this is establishing the **definitive E2E testing protocol** for all future chili-ocx development.

## Meta-Learning Focus
While executing this plan, we will capture:
- Installation patterns that work/don't work
- Common pitfalls and workarounds
- Ghost profile management best practices
- Component conflict resolution strategies
- Manual verification techniques
- Automation opportunities for future

## Context & Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| Test in completely fresh Ghost profile | Avoid conflicts with existing installations | Learnings: E2E protocol |
| Use tmux for Ghost session management | Prevents blocking, allows automated testing | Learnings: tmux pattern |
| Test all critical components, not just pepper-plugin | Comprehensive verification of full harness | Risk assessment |
| Manual verification of UI elements | Agent prompts, handoffs require visual inspection | Testing gap identified |
| Document any workarounds needed | Future developers need installation knowledge | Best practices |
| **Capture meta-learnings as we go** | **Build institutional knowledge** | **User directive** |

## Phase 8: End-to-End Installation & Launch Test

### Task Group 8.1: Environment Preparation [NOT STARTED]

- [ ] **8.1.1 Create Fresh Ghost Profile** ← CURRENT
  - Action: Create completely new profile with unique timestamp name
  - Command: 
    ```bash
    PROFILE="test-e2e-$(date +%s)"
    ocx ghost profile add "$PROFILE"
    ocx ghost profile use "$PROFILE"
    ```
  - Expected: Profile created and activated successfully
  - Verification: `ocx ghost profile list` shows new profile with asterisk
  - Meta-learning: Document profile creation behavior, any quirks
  - Source: Learnings notepad E2E protocol step 1

- [ ] **8.1.2 Verify Profile is Clean**
  - Action: Check that no components are pre-installed
  - Command: `ocx ghost list`
  - Expected: "No components found" or minimal/default components only
  - If not clean: Document what's pre-installed and assess impact
  - Meta-learning: Do profiles inherit components? How does isolation work?
  - Source: Testing best practices

- [ ] **8.1.3 Add Local Dev Registry**
  - Action: Register the local `dist/` directory as a Ghost registry
  - Command: 
    ```bash
    REPO_PATH="/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx"
    ocx ghost registry add "file://$REPO_PATH/dist" --name dev-test
    ```
  - Expected: "Added registry: dev-test" confirmation
  - Verification: `ocx ghost registry list` shows dev-test registry
  - Meta-learning: How do file:// registries work? Any limitations?
  - Source: Learnings notepad E2E protocol step 2

### Task Group 8.2: Registry Verification [NOT STARTED]

- [ ] **8.2.1 Verify Registry Index is Discoverable**
  - Action: Search for components in the dev-test registry
  - Command: `ocx ghost search dev-test` or `ocx ghost search`
  - Expected: Should list all 40 components from the build
  - If empty: Registry index.json may be malformed - CRITICAL BUG
  - Meta-learning: How does `ocx ghost search` work with file:// registries?
  - Source: Learnings notepad E2E protocol step 3

- [ ] **8.2.2 Verify Component Metadata**
  - Action: Check that key components show correct metadata
  - Components to verify:
    - `dev-test/pepper-plugin` (ocx:plugin)
    - `dev-test/scoville-orchestrator` (ocx:agent)
    - `dev-test/seed-prd-rfc` (ocx:agent)
    - `dev-test/habanero-reviewer` (ocx:agent)
  - Expected: Correct type, description for each
  - Meta-learning: What metadata fields are critical? What's optional?
  - Source: Registry structure validation

- [ ] **8.2.3 List All Available Components**
  - Action: Document complete list of available components
  - Command: `ocx ghost search dev-test > /tmp/dev-test-components.txt`
  - Expected: 40 components listed
  - Verification: Count matches build output
  - Meta-learning: Component count vs registry structure
  - Source: Comprehensive verification

### Task Group 8.3: Component Installation [NOT STARTED]

- [ ] **8.3.1 Install Core Plugin**
  - Action: Install pepper-plugin (provides tools)
  - Command: `ocx ghost add dev-test/pepper-plugin`
  - Expected: Installation succeeds
  - If conflict: Document conflict resolution needed
  - Verification: Check `.opencode/plugin/pepper-plugin.js` exists
  - Meta-learning: Where do plugins get installed? File structure?
  - Source: Learnings notepad E2E protocol step 4

- [ ] **8.3.2 Install All Agent Components**
  - Action: Install all 7 agent components
  - Commands:
    ```bash
    ocx ghost add dev-test/scoville-orchestrator
    ocx ghost add dev-test/seed-prd-rfc
    ocx ghost add dev-test/sprout-execution-planner
    ocx ghost add dev-test/jalapeno-coder
    ocx ghost add dev-test/habanero-reviewer
    ocx ghost add dev-test/chipotle-scribe
    ocx ghost add dev-test/ghost-explorer
    ```
  - Expected: All install successfully
  - If conflicts: Document and resolve
  - Meta-learning: Agent installation patterns, dependencies?
  - Source: Complete agent testing

- [ ] **8.3.3 Install Critical Skills**
  - Action: Install skills needed for testing
  - Commands:
    ```bash
    ocx ghost add dev-test/prd-methodology
    ocx ghost add dev-test/rfc-generation
    ocx ghost add dev-test/planning-workflow
    ocx ghost add dev-test/code-review
    ```
  - Expected: All install successfully
  - Meta-learning: Skill loading mechanism, file structure
  - Source: Testing workflow requirements

- [ ] **8.3.4 Verify Installation Manifest**
  - Action: List all installed components
  - Command: `ocx ghost list`
  - Expected: All installed components listed with correct metadata
  - Count: Should show 11+ components (plugin + 7 agents + skills)
  - Meta-learning: How are installations tracked? Where is the manifest?
  - Source: Installation verification

### Task Group 8.4: Ghost Launch & Tool Testing [NOT STARTED]

- [ ] **8.4.1 Launch Ghost OpenCode in tmux**
  - Action: Start Ghost in background tmux session
  - Commands:
    ```bash
    SESSION="test-e2e-ghost-$(date +%s)"
    tmux new-session -d -s "$SESSION" "ocx ghost opencode"
    sleep 10  # Allow startup time
    ```
  - Expected: tmux session starts without errors
  - Verification: `tmux ls | grep "$SESSION"`
  - Meta-learning: Ghost startup time, startup logs location, error patterns
  - Source: Learnings notepad tmux pattern

- [ ] **8.4.2 Test /pepper-init Command**
  - Action: Send pepper-init command to Ghost session
  - Commands:
    ```bash
    tmux send-keys -t "$SESSION" "/pepper-init" C-m
    sleep 3
    tmux capture-pane -t "$SESSION" -p > /tmp/pepper-init-output.txt
    ```
  - Expected: "✅ Initialized .pepper/ structure" in output
  - Verification: Check output file contains success message
  - Meta-learning: How to capture Ghost command output reliably?
  - Source: RFC-002 testing

- [ ] **8.4.3 Verify .pepper/ Directory Created**
  - Action: Check that .pepper/ was created in workspace
  - Find workspace: Check tmux session's working directory or Ghost workspace location
  - Expected: `.pepper/` directory exists with all subdirectories
  - Verification: 
    ```bash
    # Find Ghost workspace path
    # ls -la <workspace>/.pepper/
    ```
  - Meta-learning: Where does Ghost create workspaces? How to find them?
  - Source: pepper_init functionality

- [ ] **8.4.4 Test /pepper-status Command**
  - Action: Send pepper-status command to Ghost session
  - Commands:
    ```bash
    tmux send-keys -t "$SESSION" "/pepper-status" C-m
    sleep 2
    tmux capture-pane -t "$SESSION" -p > /tmp/pepper-status-output.txt
    ```
  - Expected: Status information displayed (state.json contents)
  - Verification: Output shows version, workspace info, etc.
  - Meta-learning: Tool output format, error handling patterns
  - Source: pepper-status tool testing

- [ ] **8.4.5 Test /pepper-notepad-add Command**
  - Action: Send pepper-notepad-add command
  - Commands:
    ```bash
    # This might require interactive input - may need to skip or modify
    ```
  - Expected: Notepad entry added successfully
  - Note: May be difficult to test non-interactively
  - Meta-learning: Interactive command testing strategies
  - Source: Tool completeness verification

### Task Group 8.5: Agent Prompt Verification [NOT STARTED]

- [ ] **8.5.1 Manually Inspect Scoville Agent Prompt**
  - Action: Switch to Scoville in the Ghost session and inspect
  - Method: Manual - requires visual inspection in OpenCode UI
  - What to verify:
    - Agent loads without errors
    - "## Workflow Handoff Protocol" section visible
    - Handoff matrix present
    - Symlink awareness section present
  - Meta-learning: How agent prompts are displayed, UI inspection techniques
  - Source: RFC-003 acceptance criteria

- [ ] **8.5.2 Verify Seed Agent Prompt**
  - Action: Switch to Seed and inspect prompt
  - What to verify:
    - Workflow Handoff Protocol section present
    - Handoff to Sprout documented
    - Symlink awareness present
  - Meta-learning: Prompt loading mechanism, section rendering
  - Source: RFC-003 testing

- [ ] **8.5.3 Verify Habanero Agent Prompt** (CRITICAL)
  - Action: Switch to Habanero and inspect prompt
  - What to verify:
    - **CRITICAL**: "## RFC Compliance Checking Protocol" section
    - Section appears BEFORE "The 4 Review Layers"
    - 4-step protocol present (Locate, Extract, Verify, Report)
    - Example compliance check present
    - Workflow Handoff Protocol also present
  - Meta-learning: Section ordering in UI, long prompt handling
  - Source: RFC-003 critical feature

- [ ] **8.5.4 Spot Check Other Agents**
  - Action: Check Sprout, Jalapeño, and one other agent
  - What to verify:
    - All load without errors
    - Workflow Handoff Protocol present
    - Content appears correct
  - Meta-learning: Agent switching patterns, prompt consistency
  - Source: Comprehensive verification

### Task Group 8.6: Workflow Testing [NOT STARTED]

- [ ] **8.6.1 Test Agent Switching**
  - Action: Try switching between agents using TAB key
  - Method: Manual in Ghost UI
  - What to verify:
    - TAB key shows agent list
    - All 7 agents appear in list
    - Switching works smoothly
  - Meta-learning: Agent discovery mechanism, TAB completion behavior
  - Source: User experience verification

- [ ] **8.6.2 Test Workflow Handoff Messages (If Possible)**
  - Action: Try to trigger a workflow handoff
  - Example: Have Seed create a simple RFC, see if it suggests Sprout
  - What to verify:
    - Handoff message appears after task completion
    - Message mentions next agent (e.g., "Switch to **Sprout**")
    - TAB key instruction included
  - Note: May require actual workflow execution
  - Meta-learning: When/how handoff triggers fire, message formatting
  - Source: RFC-003 critical feature

- [ ] **8.6.3 Test Out-of-Scope Handoff (If Possible)**
  - Action: Ask an agent to do something out of scope
  - Example: Ask Seed to "implement this code"
  - Expected: Seed suggests switching to Jalapeño
  - Meta-learning: Out-of-scope detection, redirect messaging
  - Source: RFC-003 acceptance criteria

### Task Group 8.7: Symlink Workspace Testing [NOT STARTED]

- [ ] **8.7.1 Test pepper-init in Symlinked Workspace**
  - Action: Create a symlinked test workspace and run pepper-init
  - Commands:
    ```bash
    # In a new terminal (not in tmux Ghost session)
    TIMESTAMP=$(date +%s)
    SYMLINK="/tmp/test-e2e-symlink-$TIMESTAMP"
    ln -s "$REPO_PATH" "$SYMLINK"
    
    # Launch Ghost from symlink
    cd "$SYMLINK"
    # Run pepper-init in this Ghost session
    ```
  - Expected:
    - .pepper/ created at REAL path (not symlink)
    - Success message shows both symlink and real paths
    - state.json has workspacePath with isSymlink: true
  - Meta-learning: Ghost symlink handling, workspace detection
  - Source: RFC-001 + RFC-002 integration

- [ ] **8.7.2 Verify Workspace Resolution**
  - Action: Check state.json in the workspace
  - Commands:
    ```bash
    cat "$REPO_PATH/.pepper/state.json" | jq .workspacePath
    ```
  - Expected:
    ```json
    {
      "symlink": "/tmp/test-e2e-symlink-...",
      "real": "/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx",
      "isSymlink": true,
      "resolvedAt": "2026-01-19T..."
    }
    ```
  - Meta-learning: State persistence, path resolution verification
  - Source: RFC-002 acceptance criteria

### Task Group 8.8: Error Scenarios [NOT STARTED]

- [ ] **8.8.1 Test Broken Symlink Handling**
  - Action: Try pepper-init with broken symlink
  - Commands:
    ```bash
    BROKEN="/tmp/broken-e2e-$(date +%s)"
    ln -s /nonexistent "$BROKEN"
    # Try to run pepper-init from broken symlink workspace
    ```
  - Expected: Clear error message about path not existing
  - Meta-learning: Error propagation in Ghost, user-facing error messages
  - Source: RFC-002 error handling

### Task Group 8.9: Cleanup & Documentation [NOT STARTED]

- [ ] **8.9.1 Kill tmux Session**
  - Action: Stop the Ghost OpenCode session
  - Command: `tmux kill-session -t "$SESSION"`
  - Expected: Session terminates cleanly
  - Meta-learning: Clean shutdown procedures, state cleanup
  - Source: Cleanup protocol

- [ ] **8.9.2 Document Any Issues Found**
  - Action: Record all bugs, warnings, unexpected behavior
  - Format: Create list of issues with severity
  - Include:
    - What was tested
    - Expected vs actual behavior
    - Severity (BLOCKER, CRITICAL, MAJOR, MINOR)
    - Proposed fix
  - Meta-learning: Issue categorization, severity assessment
  - Source: Bug tracking

- [ ] **8.9.3 Document Any Workarounds Needed**
  - Action: Record installation steps that required manual intervention
  - Examples:
    - Conflicts that needed resolution
    - Components that failed to install
    - Manual steps required
  - Meta-learning: Common installation patterns, conflict resolution
  - Source: User documentation

- [ ] **8.9.4 Clean Up Test Profile**
  - Action: Remove test profile and artifacts
  - Commands:
    ```bash
    ocx ghost profile use pepper-harness  # Switch back
    # Note: May not be able to delete profile if it has a workspace
    ```
  - Expected: Return to normal working state
  - Meta-learning: Profile lifecycle, workspace cleanup
  - Source: Cleanup protocol

- [ ] **8.9.5 Update Test Report**
  - Action: Add Phase 8 results to test report
  - Include:
    - All task results (PASS/FAIL)
    - Issues discovered
    - Workarounds needed
    - Screenshots if applicable (agent prompts, handoff messages)
    - Final merge recommendation
  - Meta-learning: Test reporting standards, evidence capture
  - Source: Documentation requirement

### Task Group 8.10: Meta-Learning Capture [NOT STARTED]

- [ ] **8.10.1 Compile E2E Testing Playbook**
  - Action: Create comprehensive E2E testing playbook from learnings
  - Include:
    - Step-by-step installation procedure
    - Common pitfalls and solutions
    - Verification checklist
    - Automation opportunities
    - Time estimates for each phase
  - Save to: `.pepper/testing/e2e-testing-playbook.md`
  - Source: Meta-learning focus

- [ ] **8.10.2 Document Ghost Profile Management Best Practices**
  - Action: Create guide for Ghost profile management
  - Include:
    - Profile creation patterns
    - Isolation strategies
    - Component installation order
    - Conflict resolution
    - Profile cleanup
  - Save to: `.pepper/testing/ghost-profile-management.md`
  - Source: Meta-learning focus

- [ ] **8.10.3 Create Component Installation Checklist**
  - Action: Document the exact component installation sequence
  - Include:
    - Dependency order
    - Required vs optional components
    - Verification steps
    - Common errors
  - Save to: `.pepper/testing/component-installation-checklist.md`
  - Source: Meta-learning focus

- [ ] **8.10.4 Document tmux Testing Patterns**
  - Action: Create guide for automated testing with tmux
  - Include:
    - Session management patterns
    - Command sending strategies
    - Output capture techniques
    - Timing considerations
    - Error detection
  - Save to: `.pepper/testing/tmux-testing-patterns.md`
  - Source: Meta-learning focus

### Task Group 8.11: Merge Decision [NOT STARTED]

- [ ] **8.11.1 Evaluate Results**
  - Action: Review all Phase 8 test results
  - Criteria for merge approval:
    - ✅ All components install successfully (or documented workarounds)
    - ✅ Ghost OpenCode launches without errors
    - ✅ /pepper-init works in live session
    - ✅ /pepper-status works in live session
    - ✅ Agent prompts load correctly
    - ✅ Workflow Handoff Protocol visible in agents
    - ✅ Habanero RFC Compliance Protocol visible
    - ✅ No BLOCKER or CRITICAL bugs found
    - ⚠️ MAJOR bugs: Acceptable if documented with fix plan
    - ✅ Symlink workspace resolution works
  - Source: Merge criteria

- [ ] **8.11.2 Update Merge Recommendation**
  - If all critical tests pass:
    - Status: ✅ **READY TO MERGE**
    - Confidence: HIGH
  - If BLOCKER/CRITICAL issues found:
    - Status: 🔴 **NOT READY TO MERGE**
    - Action: Fix issues, re-test Phase 8
  - If MAJOR issues found:
    - Status: ⚠️ **MERGE WITH CONDITIONS**
    - Document: Issues and mitigation plan
  - Source: Quality gates

- [ ] **8.11.3 Commit Test Documentation**
  - Action: Commit all Phase 8 documentation
  - Files:
    - Updated test report
    - Issue documentation
    - Screenshots (if any)
    - Updated notepad entries
    - All meta-learning playbooks
  - Source: Documentation standard

---

## Expected Timeline

- Task Group 8.1 (Preparation): 5 minutes
- Task Group 8.2 (Registry Verification): 10 minutes
- Task Group 8.3 (Installation): 15 minutes
- Task Group 8.4 (Tool Testing): 15 minutes
- Task Group 8.5 (Agent Verification): 20 minutes (manual)
- Task Group 8.6 (Workflow Testing): 15 minutes (manual)
- Task Group 8.7 (Symlink Testing): 10 minutes
- Task Group 8.8 (Error Scenarios): 5 minutes
- Task Group 8.9 (Cleanup): 10 minutes
- Task Group 8.10 (Meta-Learning Capture): 30 minutes
- Task Group 8.11 (Decision): 10 minutes

**Total Estimated Time**: 2.5 hours (includes meta-learning documentation)

---

## Success Criteria

**Minimum for PASS**:
- Registry installation works (with or without documented workarounds)
- Ghost OpenCode launches successfully
- Core tools (/pepper-init, /pepper-status) work in live session
- Agent prompts load and display correctly
- RFC Compliance Protocol visible in Habanero
- Workflow Handoff Protocol visible in all agents
- No BLOCKER bugs
- **Meta-learning playbooks created**

**Nice to Have**:
- Zero workarounds needed for installation
- All 40 components install cleanly
- Workflow handoff messages tested and working
- Complete symlink testing including error scenarios
- Comprehensive automation documentation

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Profile conflicts | Use completely unique profile name with timestamp |
| Installation failures | Document each failure with exact error message |
| Ghost won't launch | Check logs, verify component compatibility |
| Tools don't work | Test individually, check plugin loading |
| Agent prompts missing content | Compare with source files, check build output |
| Meta-learning capture incomplete | Dedicated task group 8.10 for documentation |

---

## Meta-Learning Goals

This Phase 8 execution will establish:

1. **E2E Testing Playbook** - The definitive guide for testing chili-ocx branches
2. **Ghost Profile Management** - Best practices for profile isolation and management
3. **Component Installation Guide** - Step-by-step installation with troubleshooting
4. **tmux Testing Patterns** - Automated testing strategies for Ghost sessions

These artifacts will serve as **institutional knowledge** for all future development.

---

**Plan Status**: Ready for execution  
**Priority**: P0 - BLOCKER (blocks merge)  
**Meta-Learning**: HIGH PRIORITY  
**Estimated Effort**: 2.5 hours  
**Next Step**: User approval to begin Phase 8
