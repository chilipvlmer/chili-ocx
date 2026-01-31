# PRD: Fix Skill Loading System

**Version**: 1.1.2
**Created**: 2026-01-31
**Status**: Draft
**Scope**: Bug Fix / Enhancement

## 1. Problem Statement

### Current Situation
The `skill` tool provided by the environment is broken or incompatible with agent expectations. Calls like `skill(name="rfc-format")` fail with errors indicating it expects numeric indices. This prevents agents from loading critical methodology instructions (knowledge skills) dynamically.

### Pain Points
- **Blocking Workflow**: Agents cannot read their own instructions (e.g. `prd-methodology`).
- **Manual Workaround**: Users must manually find and read files for agents.

### Proposed Solution
Implement a robust custom `skill` tool within `pepper-plugin` that handles name-based skill loading, resolving to markdown files in both registry and local paths.

### Goals
1. Enable reliable `skill(name="...")` execution.
2. Support Registry (`files/skills/`) and Local (`.opencode/skills/`) locations.
3. Provide helpful context/metadata in output.

## 2. User Stories

- **As an Agent**, I want to load a skill by name so I can access its instructions without knowing its file path.
- **As a Developer**, I want to override the broken native tool so my agents work autonomously.

## 3. Functional Specifications

### Tool Definition
- **Name**: `skill` (Primary)
- **Fallback Name**: `pepper_skill` (If `skill` registration fails due to conflict)
- **Argument**: `name` (string, required)

### Logic Flow
1. Receive `name` (e.g., "rfc-format").
2. **Search Order**:
   - Priority 1: Registry (`files/skills/{name}/SKILL.md`)
   - Priority 2: Local (`.opencode/skills/{name}.md`)
3. **If Found**:
   - Read file content.
   - Prepend metadata header.
   - Return string.
4. **If Not Found**:
   - Scan both directories for available skills.
   - Return error message: "Skill '{name}' not found. Available skills: [list]"

### Conflict Resolution
- **Registry Wins**: If a skill exists in both Registry and Local, load the Registry version (Stability > Dev).

## 4. Acceptance Criteria

- [ ] `skill(name="rfc-format")` returns content from `files/skills/rfc-format/SKILL.md`.
- [ ] `skill(name="local-test")` returns content from `.opencode/skills/local-test.md` (if exists).
- [ ] `skill(name="missing")` returns list of valid skills.
- [ ] Output includes metadata header (Source, Path).
- [ ] If `skill` is blocked by host, `pepper_skill` is registered and works.

## 5. Technical Specifications

- **Implementation**: TypeScript in `plugin/src/`.
- **Files**:
  - `plugin/src/index.ts` (Registration logic)
  - `plugin/src/utils/skill-reader.ts` (New utility for file reading/resolution)
- **Security**: Sanitize `name` to prevent `../` path traversal.

## 6. Implementation Planning Hints

1. **Phase 1**: Create `skill-reader.ts` utility.
2. **Phase 2**: Update `index.ts` to register `skill` tool with fallback logic.
3. **Phase 3**: Verify with `npm run build:plugin` and manual test.
