---
rfc: RFC-009
title: Remove Redundant executable-commands.js Plugin File
prd_version: 1.1.1
status: implemented
created: 2026-01-31
updated: 2026-01-31
author: Seed (Artifact Planner)
---

# RFC-009: Remove Redundant executable-commands.js Plugin File

## 1. Summary

This RFC proposes the removal of the redundant `files/plugin/executable-commands.js` file from the chili-ocx registry distribution. The file is identical to `pepper-plugin.js` and is not referenced in `registry.json`, yet the build script currently generates both, creating unnecessary redundancy and maintenance overhead.

## 2. Motivation

### Problem Statement
- **Redundancy**: Two identical 8.5KB plugin files exist in `files/plugin/`
- **Build Complexity**: `package.json` build script copies bundle to both locations
- **Documentation Drift**: 43 references to `executable-commands.js` across 6 documentation files create confusion
- **Single Source of Truth Violation**: No clear authoritative file

### PRD Requirements
- **PRD Section 2**: Must delete `files/plugin/executable-commands.js`
- **PRD Section 2**: Must update `package.json` build script
- **PRD Section 2**: Must update all documentation references
- **PRD Section 3**: Must preserve distinction between registry files vs profile testing files

## 3. Detailed Design

### 3.1 Architecture

```
BEFORE (Current State):
┌─────────────────────────────────────┐
│  Build Script (package.json)        │
│  ├── cp bundle.js → pepper-plugin.js│
│  └── cp bundle.js → executable-...  │  ← REDUNDANT
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  files/plugin/                      │
│  ├── pepper-plugin.js     ✅ KEEP   │
│  └── executable-commands.js ❌ REMOVE│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Registry (registry.json)           │
│  └── references: pepper-plugin.js   │
└─────────────────────────────────────┘

AFTER (Target State):
┌─────────────────────────────────────┐
│  Build Script (package.json)        │
│  └── cp bundle.js → pepper-plugin.js│  ← SINGLE FILE
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  files/plugin/                      │
│  └── pepper-plugin.js     ✅ ONLY   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Registry (registry.json)           │
│  └── references: pepper-plugin.js   │
└─────────────────────────────────────┘

NOTE: Profile testing (local) still uses executable-commands.js
      in ~/.config/opencode/profiles/default/plugin/
      This is INTENTIONAL and SEPARATE from registry distribution.
```

### 3.2 Component Design

| Component | Current State | Target State |
|-----------|---------------|--------------|
| **Registry Plugin** | Two identical files | One file: `pepper-plugin.js` |
| **Build Script** | Copies to both locations | Copies to `pepper-plugin.js` only |
| **Documentation** | References both files | References `pepper-plugin.js` only for registry |

### 3.3 Critical Distinction

**TWO SEPARATE CONTEXTS** (must not be conflated):

1. **Registry Distribution** (`files/plugin/` → Cloudflare Pages)
   - Single file: `pepper-plugin.js`
   - Referenced in `registry.json`
   - What users download via `ocx add`

2. **Local Profile Testing** (`~/.config/opencode/profiles/default/plugin/`)
   - File: `executable-commands.js`
   - Required by OpenCode's hardcoded loading preference
   - For developer testing only

Documentation must clearly preserve this distinction.

## 4. Implementation Plan

### 4.1 Phases

| Phase | Description | Effort | Files |
|-------|-------------|--------|-------|
| 1 | Delete redundant file | 2 min | `files/plugin/executable-commands.js` |
| 2 | Update build script | 3 min | `package.json` (line 4) |
| 3 | Update documentation | 30 min | `AGENTS.md`, `README.md`, `docs/PLUGIN-DEVELOPMENT.md`, `docs/AUDIT-REPORT.md` |
| 4 | Verification | 10 min | Build and test |

**Total Effort**: ~45 minutes

### 4.2 File Changes

| File | Change | Details |
|------|--------|---------|
| `files/plugin/executable-commands.js` | DELETE | Entire file |
| `package.json` | EDIT | Remove `&& cp dist/bundle.js ../files/plugin/executable-commands.js` from `build:plugin` |
| `AGENTS.md` | EDIT | Update lines 277-278, 336, 340, 353, 449, 464, 476, 488, 494, 497, 507, 510 |
| `README.md` | EDIT | Update line 215 |
| `docs/PLUGIN-DEVELOPMENT.md` | EDIT | Update lines 91, 101, 297 |
| `docs/AUDIT-REPORT.md` | EDIT | Update lines 134, 136, 345, 368, 528, 591 |

### 4.3 Dependencies

- **None**: This is a standalone cleanup task
- **No other RFCs** must be completed first
- **No external dependencies**

## 5. Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| Keep both files | Zero risk of breaking changes | Wastes space, confusing, maintenance burden | Violates "Single Source of Truth" principle |
| Rename to executable-commands.js | Aligns with OpenCode preference | Breaks registry references, confusing naming | `pepper-plugin.js` is the established registry name |
| **Remove redundant file** ✅ | Clean, simple, correct | Requires doc updates (minor) | **SELECTED**: Aligns with best practices |

## 6. Security Considerations

- **No security impact**: No functional changes to plugin
- **No authentication changes**
- **No data privacy concerns**
- **No new vulnerabilities introduced**

## 7. Performance Considerations

- **Build Performance**: Slightly faster (one less copy operation)
- **Bundle Size**: No change (same bundle, just one copy instead of two)
- **Registry Size**: Reduced by ~8.5KB (negligible but cleaner)

## 8. Testing Strategy

### 8.1 Unit Tests
- N/A: No code logic changes

### 8.2 Integration Tests
1. Run `npm run build:plugin`
2. Verify `files/plugin/` contains only `pepper-plugin.js`
3. Run `npm run build:registry`
4. Verify `dist/` builds successfully
5. Verify `dist/index.json` references correct plugin file

### 8.3 E2E Tests
- N/A: No user-facing changes

## 9. Rollout Plan

### 9.1 Migration Steps
1. Execute Phase 1-4 of Implementation Plan
2. Commit changes with message: "chore: remove redundant executable-commands.js plugin file (RFC-009)"
3. Push to main
4. Deploy via GitHub Actions

### 9.2 Rollback Procedure
If issues discovered:
```bash
git revert <commit-sha>
git push origin main
```

Rebuild will restore both files.

## 10. Open Questions

- [x] Should we archive historical references? → Yes, archive obsolete testing docs
- [x] Does this affect profile-level testing? → No, local profile testing still uses `executable-commands.js`
- [ ] Any downstream consumers expecting `executable-commands.js` in registry? → Risk: Low (not referenced in registry.json)

## 11. References

### Related RFCs
- RFC-003: Agent Prompt Updates (plugin development context)
- RFC-004: Fix Plugin Log Output (related to plugin infrastructure)

### External Documentation
- [AGENTS.md Plugin Development Section](/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/AGENTS.md)
- [Plugin Investigation Findings (Jan 18, 2026)](/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/AGENTS.md#L379)
- [Cleanup Summary (Jan 21, 2026)](/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/.pepper/notepad/cleanup-2026-01-21-summary.md)

### PRD Reference
- [PRD: Cleanup Redundant Plugin File v1.1.1](/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/.pepper/specs/prd/cleanup-redundant-plugin-v1.1.1.md)
