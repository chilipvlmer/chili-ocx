---
status: in-progress
phase: 1
updated: 2026-01-31
---

# Implementation Plan: RFC-009 - Remove Redundant Plugin File

## Goal
Eliminate the redundant `executable-commands.js` plugin file from the registry distribution.

## Context & Decisions

| Decision | Rationale | Source |
|----------|-----------|--------|
| Remove `executable-commands.js` | File is identical to `pepper-plugin.js` and not referenced in registry.json | RFC-009 Section 2 |
| Preserve profile-level distinction | OpenCode has hardcoded preference for local profile testing | AGENTS.md Appendix |
| Version 1.1.1 (patch) | No functional changes, only cleanup | RFC-009 |

## Phase 1: File Removal [IN PROGRESS]
- [ ] **1.1 Delete redundant plugin file** ← CURRENT
  - Delete `files/plugin/executable-commands.js`
  - Verify deletion
  - Acceptance: Only `pepper-plugin.js` remains

## Phase 2: Build Script Update [PENDING]
- [ ] **2.1 Update package.json build script**
  - Remove `&& cp dist/bundle.js ../files/plugin/executable-commands.js`
  - Acceptance: Build script generates only 2 copies, not 3

## Phase 3: Documentation Updates [PENDING]
- [ ] **3.1 Update AGENTS.md**
  - Update lines 277-278, 336, 340, 353, 449, 464, 476, 488, 494, 497, 507, 510
  - Preserve profile vs registry distinction
  
- [ ] **3.2 Update README.md**
  - Update line 215
  
- [ ] **3.3 Update docs/PLUGIN-DEVELOPMENT.md**
  - Update lines 91, 101, 297
  
- [ ] **3.4 Update docs/AUDIT-REPORT.md**
  - Update lines 134, 136, 345, 368, 528, 591

## Phase 4: Verification [PENDING]
- [ ] **4.1 Verify build process**
  - Run `npm run build:plugin`
  - Verify only `pepper-plugin.js` generated
  
- [ ] **4.2 Verify registry build**
  - Run `npm run build:registry`
  - Verify dist/ builds correctly

## Phase 5: Commit and Deploy [PENDING]
- [ ] **5.1 Commit changes**
  - Message: "chore: remove redundant executable-commands.js plugin file (RFC-009)"
  
- [ ] **5.2 Merge and deploy**
  - Push to main
  - Verify GitHub Actions succeeds

## Notes
- 2026-01-31: Implementation started by Jalapeño
- Estimated effort: ~45 minutes
- Risk: Low - no functional changes
