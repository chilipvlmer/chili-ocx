---
status: not-started
phase: 1
updated: 2026-02-01
---

# Implementation Plan: RFC-012 - Convert Bundle to Profile

## Goal
Convert the pepper-harness bundle to an ocx:profile for better update workflow, enabling 5-second refresh via profile remove/add.

## Context & Decisions

| Decision | Rationale | Source |
|----------|-----------|--------|
| Create new profile component | Keep bundle for backward compatibility | RFC-012 Section 3.2 |
| Profile references bundle as dependency | Reuses existing component installation logic | RFC-012 Section 3.1 |
| Clean profile location | ~/.config/opencode/profiles/pepper/ vs messy .opencode/.opencode/ | User requirement |
| 4-phase implementation | Logical progression: files → registry → build → test | RFC-012 Section 4 |

## Phase 1: Create Profile Files [PENDING]
- [ ] **1.1 Create profiles/pepper/ directory** ← CURRENT
  - Create `files/profiles/pepper/` directory structure
  - Reference: RFC-012 Section 3.3
  - Acceptance: Directory exists and is git-tracked

- [ ] **1.2 Create ocx.jsonc profile config**
  - File: `files/profiles/pepper/ocx.jsonc`
  - Content: Registry URL, exclude/include patterns for AGENTS.md
  - Reference: RFC-012 Section 3.3 (ocx.jsonc example)
  - Acceptance: Valid JSONC, proper schema reference

- [ ] **1.3 Create opencode.jsonc profile settings**
  - File: `files/profiles/pepper/opencode.jsonc`
  - Content: Profile name, all 7 agent names
  - Reference: RFC-012 Section 3.3 (opencode.jsonc example)
  - Acceptance: Valid JSONC, all agents listed

- [ ] **1.4 Create AGENTS.md profile instructions**
  - File: `files/profiles/pepper/AGENTS.md`
  - Content: Profile overview, agent descriptions, workflow steps
  - Reference: RFC-012 Section 3.3 (AGENTS.md example)
  - Acceptance: Markdown format, comprehensive instructions

## Phase 2: Update Registry [PENDING]
- [ ] **2.1 Add pepper profile component to registry.jsonc**
  - Add new component entry with type "ocx:profile"
  - Include all 3 file references (ocx.jsonc, opencode.jsonc, AGENTS.md)
  - Add dependency on "pepper-harness" bundle
  - Reference: RFC-012 Section 3.2 (component definition)
  - Acceptance: registry.jsonc validates without errors

- [ ] **2.2 Bump registry version**
  - Update registry version field to trigger deployment
  - Change from current version to next patch/minor
  - Reference: RFC-012 Section 4
  - Acceptance: Version bumped in registry.jsonc line 5

## Phase 3: Build and Deploy [PENDING]
- [ ] **3.1 Run plugin build**
  - Execute: `npm run build:plugin`
  - Verify pepper-plugin.js is updated
  - Acceptance: Build succeeds, no errors

- [ ] **3.2 Run registry build**
  - Execute: `npm run build:registry`
  - Verify dist/ contains profile files
  - Check dist/components/pepper/ exists with profile files
  - Acceptance: Build succeeds, profile component in dist/

- [ ] **3.3 Commit changes**
  - Stage: New profile files, updated registry.jsonc
  - Message: "feat: add pepper profile component (RFC-012)"
  - Acceptance: Clean commit, all changes staged

- [ ] **3.4 Push and verify deployment**
  - Push to main branch
  - Wait for GitHub Actions to complete (2-3 minutes)
  - Verify Cloudflare Pages deployment
  - Acceptance: Deployed successfully, workflow #83+ passes

## Phase 4: Test and Document [PENDING]
- [ ] **4.1 Test profile installation**
  - Execute: `ocx registry add https://chili-ocx.pages.dev --name chili-ocx --global` (if not already)
  - Execute: `ocx profile add pepper --from chili-ocx/pepper`
  - Verify: ~/.config/opencode/profiles/pepper/ exists with 3 files
  - Acceptance: Profile installs without errors

- [ ] **4.2 Test profile functionality**
  - Launch OpenCode with profile: `ocx opencode -p pepper`
  - Verify all agents available in the session
  - Test skill loading: `skill(name="rfc-format")` should work
  - Acceptance: All 7 agents available, skills loadable

- [ ] **4.3 Test update workflow (The Big Win)**
  - Execute: `ocx profile remove pepper`
  - Execute: `ocx profile add pepper --from chili-ocx/pepper`
  - Verify: Command completes in < 10 seconds
  - Acceptance: Fast refresh works, under 10 seconds total

- [ ] **4.4 Document new workflow**
  - Update README.md with profile installation instructions
  - Update AGENTS.md with profile update workflow
  - Add example commands for quick reference
  - Acceptance: Documentation clear and accurate

## Phase 5: Cleanup and Migration [PENDING]
- [ ] **5.1 Create migration guide for existing users**
  - Document steps to switch from bundle to profile
  - Include: remove old .opencode/, install new profile
  - Reference: RFC-012 Section 5 (Migration Guide)
  - Acceptance: Migration guide complete

- [ ] **5.2 Update notepad with completion status**
  - Record RFC-012 as implemented
  - Note the 5-second update workflow achievement
  - Acceptance: Notepad updated

## Notes
- 2026-02-01: Plan created based on RFC-012
- Estimated effort: 40-60 minutes
- Critical path: Phase 3 deployment wait time (2-3 min)
- Dependencies: None (self-contained)
- Risk: Low - additive change, doesn't break existing bundle
- Success criteria: 5-second profile refresh workflow functional
