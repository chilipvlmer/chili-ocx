---
status: completed
phase: 3
updated: 2026-01-18
completed: 2026-01-18
commit: 8ee3c2419e1eee58ca92d60a37a70a8c49ccf1bb
rfc: RFC-002
---

# Implementation Plan: RFC-002 pepper_init Enhancement

## Goal
Integrate workspace path resolution into pepper_init to enable initialization in symlinked Ghost workspaces.

## Context & Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| Use getWorkspaceInfo() from RFC-001 | Reuse tested symlink resolution | RFC-002 Section 2.2 |
| Update state.json to v1.1.0 | Store workspace path information | RFC-002 Section 2.2 |
| Maintain backward compatibility | Don't break existing installations | RFC-002 Section 5 |
| Use resolved real path for file ops | Ensure .pepper/ created at correct location | RFC-002 Section 3.1 |

## Phase 1: Core Implementation [COMPLETED]

- [x] **1.1 Import workspace utilities**
  - Add import statement for getWorkspaceInfo and WorkspaceError
  - At top of plugin/src/utils/pepper-io.ts
  - Source: RFC-002 Section 2.2, 3.1 (line 88)

- [x] **1.2 Add workspace path resolution**
  - Call getWorkspaceInfo(projectDir) at function start
  - Wrap in try-catch for WorkspaceError
  - Store result in workspaceInfo variable
  - Source: RFC-002 Section 3.1 (lines 92-111)

- [x] **1.3 Add error handling for workspace resolution**
  - Catch WorkspaceError specifically
  - Return helpful error message with troubleshooting
  - Source: RFC-002 Section 2.3, 3.1 (lines 97-108)

- [x] **1.4 Use resolved path for all operations**
  - Replace projectDir with workspaceInfo.real
  - Update pepperDir = join(resolvedDir, ".pepper")
  - Ensure all mkdirSync and writeFileSync use resolvedDir
  - Source: RFC-002 Section 3.1 (lines 113-115)

- [x] **1.5 Update state.json schema to v1.1.0**
  - Change version to "1.1.0"
  - Add initialized timestamp
  - Add workspacePath object with full info
  - Source: RFC-002 Section 3.1 (lines 126-138), Section 8.1

- [x] **1.6 Update success message**
  - Check if workspace is symlinked
  - Show both symlink and real paths if applicable
  - Source: RFC-002 Section 3.1 (lines 165-172)

## Phase 2: Testing [COMPLETED]

- [x] **2.1 Manual test: Ghost workspace (symlinked)**
  - Create symlink to test directory
  - Run pepper_init from symlinked path
  - Verify .pepper/ created at real path
  - Verify state.json contains workspace info
  - Verify success message shows both paths
  - Source: RFC-002 Section 4.1 Test 1

- [x] **2.2 Manual test: Regular directory**
  - Run pepper_init in non-symlinked directory
  - Verify state.json shows symlink: null
  - Verify success message doesn't show symlink info
  - Verify no regressions
  - Source: RFC-002 Section 4.1 Test 2

- [x] **2.3 Manual test: Broken symlink**
  - Create broken symlink
  - Run pepper_init
  - Verify clear error message returned
  - Verify no .pepper/ created
  - Verify error includes troubleshooting guidance
  - Source: RFC-002 Section 4.1 Test 3

- [x] **2.4 Manual test: Already initialized**
  - Run pepper_init twice in same location
  - Verify second run returns "already initialized"
  - Verify no files overwritten
  - Source: RFC-002 Section 4.1 Test 4

- [x] **2.5 Verify state.json v1.1.0 schema**
  - Check version field is "1.1.0"
  - Check initialized timestamp is ISO 8601
  - Check workspacePath object structure
  - Validate against schema in RFC Section 8.1
  - Source: RFC-002 Section 4.2

## Phase 3: Review & Finalization [COMPLETED]

- [x] **3.1 Build and compile**
  - Run npm run build in plugin directory
  - Verify TypeScript compilation succeeds
  - Verify no new errors introduced
  - Source: Standard practice

- [x] **3.2 Rebuild dev branch registry**
  - Run ./scripts/build-branch.sh dev-symlink-detection
  - Verify registry builds successfully
  - Source: Development workflow

- [x] **3.3 Code review preparation**
  - Verify all imports are correct
  - Check error handling is comprehensive
  - Confirm backward compatibility
  - Review success message clarity
  - Source: RFC-002 Section 7.2

- [x] **3.4 Git commit**
  - Stage changes to pepper-io.ts
  - Write descriptive commit message
  - Reference RFC-002 in commit
  - Source: Standard practice

## Implementation Complete

All phases completed successfully:
- Phase 1: Core Implementation (6/6 tasks) ✓
- Phase 2: Testing (5/5 tests passed) ✓
- Phase 3: Review & Finalization (4/4 tasks) ✓

**Commit**: 8ee3c2419e1eee58ca92d60a37a70a8c49ccf1bb
**Build**: dist-dev-symlink-detection/ updated
**Status**: Ready for code review
  - Create symlink to test directory
  - Run pepper_init from symlinked path
  - Verify .pepper/ created at real path
  - Verify state.json contains workspace info
  - Verify success message shows both paths
  - Source: RFC-002 Section 4.1 Test 1

- [ ] **2.2 Manual test: Regular directory**
  - Run pepper_init in non-symlinked directory
  - Verify state.json shows symlink: null
  - Verify success message doesn't show symlink info
  - Verify no regressions
  - Source: RFC-002 Section 4.1 Test 2

- [ ] **2.3 Manual test: Broken symlink**
  - Create broken symlink
  - Run pepper_init
  - Verify clear error message returned
  - Verify no .pepper/ created
  - Verify error includes troubleshooting guidance
  - Source: RFC-002 Section 4.1 Test 3

- [ ] **2.4 Manual test: Already initialized**
  - Run pepper_init twice in same location
  - Verify second run returns "already initialized"
  - Verify no files overwritten
  - Source: RFC-002 Section 4.1 Test 4

- [ ] **2.5 Verify state.json v1.1.0 schema**
  - Check version field is "1.1.0"
  - Check initialized timestamp is ISO 8601
  - Check workspacePath object structure
  - Validate against schema in RFC Section 8.1
  - Source: RFC-002 Section 4.2

## Phase 3: Review & Finalization [NOT STARTED]

- [ ] **3.1 Build and compile**
  - Run npm run build in plugin directory
  - Verify TypeScript compilation succeeds
  - Verify no new errors introduced
  - Source: Standard practice

- [ ] **3.2 Rebuild dev branch registry**
  - Run ./scripts/build-branch.sh dev-symlink-detection
  - Verify registry builds successfully
  - Source: Development workflow

- [ ] **3.3 Code review preparation**
  - Verify all imports are correct
  - Check error handling is comprehensive
  - Confirm backward compatibility
  - Review success message clarity
  - Source: RFC-002 Section 7.2

- [ ] **3.4 Git commit**
  - Stage changes to pepper-io.ts
  - Write descriptive commit message
  - Reference RFC-002 in commit
  - Source: Standard practice

## Dependencies
- **Requires**: RFC-001 workspace utilities (✅ Implemented)
- **Blocks**: RFC-003 (agent prompts), RFC-005 (validation)

## Risks
| Risk | Mitigation |
|------|------------|
| Breaking existing .pepper/ installations | Backward compatible design, both schemas work |
| Symlink resolution failures | Comprehensive error handling with helpful messages |
| Performance impact | Minimal - one additional fs call at init time only |

## Acceptance Criteria
- [ ] All 4 manual tests pass
- [ ] state.json v1.1.0 schema validated
- [ ] No regressions in existing functionality
- [ ] Error messages clear and actionable
- [ ] Backward compatible with v1.0.0
- [ ] TypeScript compiles without errors
- [ ] Code follows RFC-002 specification

## Notes
- This is a focused enhancement - single function modification
- Estimated time: 1-2 hours
- RFC-002 complete specification available for reference
- Follow same state management practices from RFC-001 closeout
