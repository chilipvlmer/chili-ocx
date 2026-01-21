---
status: in-progress
phase: 3
created: 2026-01-21
priority: P0-P1 (Critical), then P2-P3
rfc: none
type: technical-debt-cleanup
updated: 2026-01-21
---

# Technical Debt Cleanup - Ghost Exploration Report Remediation

## Goal

Address all critical, medium, and low priority issues identified by Ghost during codebase exploration. Clean up AI-generated slop, fix build/permission bugs, consolidate documentation, and remove obsolete artifacts.

## Context & Decisions

| Decision | Rationale | Source |
|----------|-----------|--------|
| Archive vs Delete slop files | Keep in `.pepper/archive/ai-slop/` for reference, not immediate deletion | Ghost's recommendation for documentation slop |
| Fix build script copy step | Add missing copy to `files/plugin/pepper-plugin.js` | Ghost H-4: Build script issue |
| Fix registry.json permissions | Sprout/Seed need "edit" permission for `.pepper/**` | Ghost Q-1: Permission issue lines 177-211 |
| Delete .sisyphus/ directory | Old harness name, superseded by Pepper | Ghost H-1: Legacy directory |
| Consolidate dist directories | Keep `dist/` only, remove `dist-dev-symlink-detection/` and `dist-main/` | Ghost H-2: Multiple dist directories |
| Fix README agent count | Update to reflect actual 7 agents (was showing 6 in table) | Ghost D-1: README inconsistency |
| Fix CONTRIBUTING references | Remove reference to non-existent AGENTS.md | Ghost D-2: Broken documentation link |
| Archive completed plan | Move RFC-004 plan to `.pepper/plans/RFC-004-COMPLETED.md` | Ghost L-1: Completed plan archival |
| Verify pepper-structure.md | Cross-check accuracy against actual `.pepper/` structure | Ghost D-3: Documentation accuracy |
| Archive test reports | Move to `.pepper/testing/archive/` | Ghost M-2: Test report cleanup |
| Document plugin development | Create PLUGIN-DEVELOPMENT.md with proper guidance | Ghost D-4: Missing plugin docs |

## Phase 1: Critical Bug Fixes (P0-P1) [COMPLETED]

### Build Script Fix

- [x] **1.1 Fix package.json build script** ✅ COMPLETED
  - Update `build:plugin` script in root `package.json`
  - Current: `cp dist/bundle.js ../plugin/pepper-plugin.js && cp dist/bundle.js ../files/plugin/executable-commands.js`
  - Add missing: `&& cp dist/bundle.js ../files/plugin/pepper-plugin.js`
  - Final: `cp dist/bundle.js ../plugin/pepper-plugin.js && cp dist/bundle.js ../files/plugin/executable-commands.js && cp dist/bundle.js ../files/plugin/pepper-plugin.js`
  - Source: Ghost H-4
  - Acceptance: `files/plugin/pepper-plugin.js` gets created on `npm run build`

### Permission Fix

- [x] **1.2 Fix Sprout agent permissions in registry.json** ✅ COMPLETED
  - File: `registry.json`
  - Lines: 177-211 (sprout-execution-planner config)
  - Current: `"edit": { ".pepper/**": "allow", "*": "deny" }`
  - Change: Add explicit edit permission for `.pepper/plan.md`
  - Keep: `"write": { ".pepper/**": "allow", "*": "deny" }`
  - Verify Seed agent has same pattern (lines 202-208)
  - Source: Ghost Q-1
  - Acceptance: Sprout can edit `.pepper/plan.md` without permission errors

## Phase 2: File Deletion & Consolidation (P0-P1) [COMPLETED]

### Legacy Directory Cleanup

- [x] **2.1 Delete .sisyphus/ directory** ✅ COMPLETED
  - Path: `.sisyphus/`
  - Contents: Old Sisyphus harness files (plans, specs, notepads)
  - Action: Delete entire directory recursively
  - Reason: Superseded by Pepper harness (`.pepper/`)
  - Source: Ghost H-1
  - Acceptance: `.sisyphus/` directory no longer exists

### Dist Directory Consolidation

- [x] **2.2 Delete dist-dev-symlink-detection/ directory** ✅ COMPLETED
  - Path: `dist-dev-symlink-detection/`
  - Contents: Development build artifacts from symlink detection testing
  - Action: Delete entire directory recursively
  - Reason: Obsolete testing artifact, not needed in repo
  - Source: Ghost H-2
  - Acceptance: `dist-dev-symlink-detection/` no longer exists

- [x] **2.3 Delete dist-main/ directory** ✅ COMPLETED
  - Path: `dist-main/`
  - Contents: Old main branch dist artifacts
  - Action: Delete entire directory recursively
  - Reason: Only `dist/` should exist as the canonical build output
  - Source: Ghost H-2
  - Acceptance: `dist-main/` no longer exists, only `dist/` remains

- [x] **2.4 Verify .gitignore excludes dist variants** ✅ COMPLETED
  - File: `.gitignore`
  - Check: `dist/`, `dist-*/`, and `plugin/dist/` are excluded
  - Add if missing: `dist-*/` pattern to catch future variants
  - Source: Ghost H-2 prevention
  - Acceptance: No dist artifacts tracked in git

## Phase 3: AI Slop Removal (P2) [COMPLETED]

### Documentation Slop Cleanup

- [x] **3.1 Archive SESSION-SUMMARY.md** ✅ COMPLETED
  - Current: Root `SESSION-SUMMARY.md` (261 lines of AI-generated session notes)
  - Action: Move to `.pepper/archive/ai-slop/SESSION-SUMMARY-2026-01-18.md`
  - Reason: Contains useful historical context but is AI slop in wrong location
  - Source: Ghost M-1
  - Acceptance: Root clean, file archived with date

- [x] **3.2 Archive PLUGIN-TESTING.md** ✅ COMPLETED
  - Current: Root `PLUGIN-TESTING.md` (216 lines of testing notes)
  - Action: Move to `.pepper/archive/ai-slop/PLUGIN-TESTING-2026-01-18.md`
  - Reason: Temporary testing documentation, AI-generated
  - Source: Ghost M-1
  - Acceptance: Root clean, file archived

- [x] **3.3 Archive COMMANDS.md** ✅ COMPLETED
  - Current: Root `COMMANDS.md` (200 lines of command reference)
  - Action: Move to `.pepper/archive/ai-slop/COMMANDS-2026-01-18.md`
  - Reason: Redundant with actual COMMAND.md files, AI-generated
  - Alternative: Extract useful bits into README if valuable
  - Source: Ghost M-1
  - Acceptance: Root clean, content preserved if needed

- [x] **3.4 Archive ARCHITECTURE.md** ✅ COMPLETED
  - Current: Root `ARCHITECTURE.md` (375 lines of architecture notes)
  - Action: Move to `.pepper/archive/ai-slop/ARCHITECTURE-2026-01-18.md`
  - Reason: Verbose AI slop, useful info should go in proper docs
  - Alternative: Extract key architecture diagrams for README
  - Source: Ghost M-1
  - Acceptance: Root clean, useful content extracted

- [x] **3.5 Create .pepper/archive/ structure** ✅ COMPLETED
  - Directories:
    - `.pepper/archive/ai-slop/` - Temporary AI-generated docs
    - `.pepper/archive/testing/` - Old test reports
    - `.pepper/archive/plans/` - May exist, ensure it does
  - Add README: Explain archive purpose and retention policy
  - Source: Ghost M-1, M-2, L-1
  - Acceptance: Archive structure exists with README

## Phase 4: Documentation Fixes (P2) [NOT STARTED]

### README Corrections

- [ ] **4.1 Fix README agent count inconsistency** ← CURRENT
  - File: `README.md`
  - Line 9: Claims "7 agents"
  - Table (lines 20-30): Shows only 6 agents
  - Issue: Missing one agent in table
  - Fix: Verify actual agent count (7 is correct: Scoville, Seed, Sprout, Jalapeño, Chipotle, Habanero, Ghost)
  - Ensure table lists all 7
  - Source: Ghost D-1
  - Acceptance: README claim matches table count

### CONTRIBUTING Fixes

- [ ] **4.2 Fix CONTRIBUTING.md broken reference**
  - File: `CONTRIBUTING.md`
  - Lines: 201, 238
  - Current: References `AGENTS.md` (doesn't exist)
  - Fix Option 1: Create `AGENTS.md` with agent documentation
  - Fix Option 2: Change references to point to README.md agent table
  - Fix Option 3: Remove references if not needed
  - Source: Ghost D-2
  - Acceptance: No broken links in CONTRIBUTING.md

## Phase 5: Documentation Consolidation (P2-P3) [NOT STARTED]

### Verify pepper-structure.md Accuracy

- [ ] **5.1 Cross-check docs/pepper-structure.md**
  - File: `docs/pepper-structure.md`
  - Action: Compare documented structure vs actual `.pepper/` implementation
  - Check: Directory tree, file purposes, state.json schema
  - Update: Fix any discrepancies found
  - Source: Ghost D-3
  - Acceptance: Documentation matches implementation

### Create Plugin Development Documentation

- [ ] **5.2 Create PLUGIN-DEVELOPMENT.md**
  - Location: `docs/PLUGIN-DEVELOPMENT.md`
  - Content:
    - Plugin architecture overview
    - Build process (`npm run build:plugin`)
    - How to add new tools
    - Testing methodology
    - Deployment to files/plugin/
  - Source: Ghost D-4
  - Acceptance: Clear plugin development guide exists

- [ ] **5.3 Update README to link new docs**
  - Add section: "## Development"
  - Link to `docs/PLUGIN-DEVELOPMENT.md`
  - Link to `docs/pepper-structure.md`
  - Source: Ghost D-4
  - Acceptance: Developers can find plugin docs from README

## Phase 6: Archive and Cleanup (P3) [NOT STARTED]

### Archive Completed Plans

- [ ] **6.1 Archive RFC-004 completed plan**
  - Current: `.pepper/plan.md` (334 lines, status: complete)
  - Action: Move to `.pepper/plans/RFC-004-fix-log-output-leak-COMPLETED.md`
  - Update: Add completion timestamp to filename
  - Source: Ghost L-1
  - Acceptance: Completed plan archived, `.pepper/plan.md` ready for new work

### Archive Test Reports

- [ ] **6.2 Archive dev-symlink-detection test report**
  - Current: `.pepper/testing/dev-symlink-detection-test-report.md`
  - Action: Move to `.pepper/testing/archive/dev-symlink-detection-test-report-2026-01-20.md`
  - Source: Ghost M-2
  - Acceptance: Active testing/ directory contains only current work

- [ ] **6.3 Archive phase-8-manual-checklist**
  - Current: `.pepper/testing/phase-8-manual-checklist.md`
  - Action: Move to `.pepper/testing/archive/RFC-004-phase-8-manual-checklist.md`
  - Source: Ghost M-2
  - Acceptance: Checklist archived with RFC reference

### Unused Plugin Files Review

- [ ] **6.4 Review files/plugin/ directory**
  - Current files: `executable-commands.js`, `pepper-plugin.js`
  - Question: Are both needed or is one redundant?
  - Check: Registry references, deployment scripts
  - Decision: Document purpose or remove redundant file
  - Source: Ghost M-3
  - Acceptance: Clear understanding of plugin file purposes

## Phase 7: Verification & Testing (P3) [NOT STARTED]

### Build Verification

- [ ] **7.1 Run full build**
  - Command: `npm run rebuild`
  - Expected: No errors
  - Verify: All three plugin copies created
    - `plugin/dist/bundle.js`
    - `plugin/pepper-plugin.js`
    - `files/plugin/executable-commands.js`
    - `files/plugin/pepper-plugin.js` (NEW)
  - Source: Phase 1.1 verification
  - Acceptance: Clean build with all artifacts

### Registry Validation

- [ ] **7.2 Validate registry.json syntax**
  - Command: `bunx ocx build . --out dist`
  - Expected: No errors, valid JSON output
  - Verify: All components loadable
  - Source: Phase 1.2 verification
  - Acceptance: Registry builds successfully

### Documentation Link Check

- [ ] **7.3 Check all documentation links**
  - Files: `README.md`, `CONTRIBUTING.md`, `docs/*.md`
  - Tool: Manual review or link checker
  - Verify: No broken internal links
  - Verify: External links still valid
  - Source: Phase 4 verification
  - Acceptance: All links resolve correctly

### Repository Cleanliness Check

- [ ] **7.4 Verify repository state**
  - Check: `git status` shows no unexpected changes
  - Check: No `dist-*/` directories remain
  - Check: No AI slop in root directory
  - Check: `.sisyphus/` deleted
  - Source: Phase 2 verification
  - Acceptance: Clean repository structure

## Phase 8: Final Documentation (P3) [NOT STARTED]

### Update CHANGELOG

- [ ] **8.1 Document cleanup in CHANGELOG**
  - File: `CHANGELOG.md` (create if doesn't exist)
  - Section: `## [Unreleased]`
  - Subsections:
    - ### Fixed
      - Build script now copies to all required plugin locations
      - Registry permissions for Sprout/Seed agents
    - ### Removed
      - Legacy .sisyphus/ directory
      - Obsolete dist-dev-symlink-detection/ and dist-main/
      - AI-generated documentation slop (archived)
    - ### Changed
      - Completed plans archived to .pepper/plans/
      - Test reports archived to .pepper/testing/archive/
  - Source: All phases summary
  - Acceptance: CHANGELOG documents all cleanup work

### Create Cleanup Summary

- [ ] **8.2 Create cleanup summary report**
  - File: `.pepper/notepad/cleanup-2026-01-21-summary.md`
  - Content:
    - Issues addressed (P0-P3)
    - Files deleted vs archived
    - Build fixes applied
    - Documentation improvements
    - Lessons learned
  - Source: Ghost report + plan execution
  - Acceptance: Summary document exists for future reference

---

## Acceptance Criteria

### Critical (P0-P1) - Must Complete
- [x] **AC-1**: Build script copies to all three plugin locations
- [x] **AC-2**: Registry permissions allow Sprout/Seed to edit `.pepper/**`
- [x] **AC-3**: `.sisyphus/` directory deleted
- [x] **AC-4**: Only `dist/` directory exists (no dist-* variants)

### High Priority (P2) - Should Complete
- [x] **AC-5**: AI slop archived (SESSION-SUMMARY, PLUGIN-TESTING, COMMANDS, ARCHITECTURE)
- [ ] **AC-6**: README agent count matches table
- [ ] **AC-7**: CONTRIBUTING.md has no broken links
- [ ] **AC-8**: Completed RFC-004 plan archived

### Medium Priority (P3) - Nice to Have
- [ ] **AC-9**: Plugin development documentation exists
- [ ] **AC-10**: Test reports archived
- [ ] **AC-11**: CHANGELOG updated
- [ ] **AC-12**: Cleanup summary created

---

## Estimated Timeline

- **Phase 1**: Critical Bug Fixes - 30 minutes
- **Phase 2**: File Deletion & Consolidation - 15 minutes
- **Phase 3**: AI Slop Removal - 30 minutes
- **Phase 4**: Documentation Fixes - 45 minutes
- **Phase 5**: Documentation Consolidation - 1 hour
- **Phase 6**: Archive and Cleanup - 30 minutes
- **Phase 7**: Verification & Testing - 30 minutes
- **Phase 8**: Final Documentation - 30 minutes

**Total: ~4 hours**

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking build with permission changes | Low | High | Test build after registry changes |
| Deleting needed files | Low | Medium | Archive instead of delete for unclear files |
| Broken links after cleanup | Medium | Low | Run link checker in Phase 7 |
| Missing plugin file after cleanup | Low | High | Verify all registry references before deletion |

---

## Notes

- This is a **cleanup/refactoring plan**, not tied to a specific RFC
- Focus on P0-P1 issues first, then proceed to P2-P3 if time allows
- Archive rather than delete when uncertain about file necessity
- All deletions should be committed separately for easy rollback
- Test build and registry after each phase

---

**Plan Status**: IN PROGRESS  
**Created**: 2026-01-21  
**Based On**: Ghost Exploration Report  
**Next Step**: Execute Phase 4, Task 4.1 (Fix README agent count inconsistency)
