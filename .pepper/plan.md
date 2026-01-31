---
status: not-started
phase: 1
updated: 2026-01-31
---

# Implementation Plan: RFC-010 - Skill Tool Implementation

## Goal
Implement a custom `skill` tool in pepper-plugin that enables name-based loading of knowledge skills from Registry and Local directories, with automatic fallback to `pepper_skill` if registration fails.

## Context & Decisions

| Decision | Rationale | Source |
|----------|-----------|--------|
| Registry > Local priority | Stability over development flexibility | RFC-010 Section 3.1 |
| Auto-fallback to `pepper_skill` | Mitigates risk of host tool conflict | RFC-010 Section 3.3 |
| Path traversal regex `/^[a-zA-Z0-9_-]+$/` | Security - only safe characters | RFC-010 Section 6 |
| Include metadata header | Debugging and transparency | RFC-010 Section 3.4 |

## Phase 1: Create SkillResolver Utility [PENDING]
- [ ] **1.1 Create skill-resolver.ts file** ← CURRENT
  - Create `plugin/src/utils/skill-resolver.ts`
  - Implement `SkillResolver` class with:
    - Constructor taking `ctxDirectory`
    - `resolve(name)` method with Registry-first priority
    - `sanitize(name)` with regex validation
    - `listAvailable()` to scan directories
  - Export `SkillResolver` class
  - Reference: RFC-010 Section 3.4
  - Acceptance: File compiles without errors

- [ ] **1.2 Add necessary imports**
  - Import `join` from `path`
  - Import `existsSync`, `readFileSync`, `readdirSync` from `fs`
  - Import types if needed
  - Acceptance: No import errors

## Phase 2: Register Skill Tool [PENDING]
- [ ] **2.1 Import SkillResolver in index.ts**
  - Add import: `import { SkillResolver } from './utils/skill-resolver.js'`
  - Reference: RFC-010 Section 3.4
  - Acceptance: Import resolves

- [ ] **2.2 Create skill tool definition**
  - Define `skillTool` using `tool()` helper
  - Args: `name: tool.schema.string()`
  - Execute: Instantiate resolver, call resolve, format output
  - Include metadata header in response
  - Handle 'not-found' case with available skills list
  - Acceptance: Tool definition is valid TypeScript

- [ ] **2.3 Register with fallback logic**
  - Try/catch around `tools["skill"] = skillTool`
  - On error: Log warning, register as `tools["pepper_skill"]` instead
  - Log success/failure to `/tmp/pepper-debug.log`
  - Reference: RFC-010 Section 4.1
  - Acceptance: Both registration paths compile

## Phase 3: Build and Test [PENDING]
- [ ] **3.1 Run plugin build**
  - Execute: `npm run build:plugin`
  - Verify no TypeScript errors
  - Verify `files/plugin/pepper-plugin.js` is updated
  - Acceptance: Build succeeds

- [ ] **3.2 Run registry build**
  - Execute: `npm run build:registry`
  - Verify `dist/` contains updated plugin
  - Acceptance: Registry builds successfully

- [ ] **3.3 Verify skill tool exists in bundle**
  - Check `files/plugin/pepper-plugin.js` contains "skill" tool definition
  - Acceptance: Grep finds skill-related code

## Phase 4: Verification [PENDING]
- [ ] **4.1 Test skill loading**
  - Call `skill(name="rfc-format")` in OpenCode
  - Verify content is returned with metadata header
  - Acceptance: Returns Registry content

- [ ] **4.2 Test error handling**
  - Call `skill(name="invalid-skill-name")`
  - Verify error message lists available skills
  - Acceptance: Helpful error returned

- [ ] **4.3 Test path traversal protection**
  - Attempt: `skill(name="../../../etc/passwd")`
  - Verify: Error "Invalid skill name" returned
  - Acceptance: Security check works

- [ ] **4.4 Verify fallback (if applicable)**
  - If `skill` blocked by host, verify `pepper_skill` is available
  - Acceptance: Fallback tool works

## Phase 5: Commit and Deploy [PENDING]
- [ ] **5.1 Stage changes**
  - Stage: `plugin/src/utils/skill-resolver.ts` (new)
  - Stage: `plugin/src/index.ts` (modified)
  - Acceptance: All changes staged

- [ ] **5.2 Commit and push**
  - Message: "feat: implement skill tool with name-based loading (RFC-010)"
  - Push to main
  - Acceptance: Deployed successfully

## Notes
- 2026-01-31: Plan created based on RFC-010
- Total estimated effort: 40 minutes
- Dependencies: None (self-contained)
- Risk: Low (fallback mitigates conflict risk)
