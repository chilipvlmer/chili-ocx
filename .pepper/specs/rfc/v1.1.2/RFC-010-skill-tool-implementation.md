---
rfc: RFC-010
title: Implement Skill Tool for Knowledge Loading
prd_version: 1.1.2
status: draft
created: 2026-01-31
updated: 2026-01-31
author: Seed (Artifact Planner)
---

# RFC-010: Implement Skill Tool for Knowledge Loading

## 1. Summary
Implement a robust `skill` tool in `pepper-plugin` that allows agents to load "Knowledge Skills" (markdown files) by name. This overrides/replaces the broken native `skill` tool and supports both registry and local skill paths.

## 2. Motivation
The current `skill` tool fails to load skills by name, blocking agents from accessing critical instructions like `prd-methodology` or `rfc-format`.

## 3. Detailed Design

### 3.1 Tool Interface
- **Name**: `skill` (primary) / `pepper_skill` (fallback)
- **Args**: `name` (string)
- **Returns**: String (Markdown content with metadata header)

### 3.2 Resolution Logic (`skill-reader.ts`)
1. **Input**: Skill name (e.g. "rfc-format")
2. **Search Paths**:
   - `files/skills/{name}/SKILL.md` (Registry)
   - `.opencode/skills/{name}.md` (Local)
3. **Precedence**: Registry > Local
4. **Validation**: Regex `^[a-zA-Z0-9_-]+$` to prevent path traversal.

### 3.3 Registration Logic (`index.ts`)
- Try to register tool named `skill`.
- If OpenCode throws error (name conflict), catch it and register `pepper_skill`.
- Log warning if fallback is used.

## 4. Implementation Plan

### 4.1 Phase 1: Utility Implementation
- Create `plugin/src/utils/skill-reader.ts`
- Implement `readSkill(name, projectRoot)` function.
- Implement `listAvailableSkills(projectRoot)` function.

### 4.2 Phase 2: Tool Registration
- Update `plugin/src/index.ts`
- Import `readSkill`.
- Register `skill` tool.
- Add try/catch for fallback.

### 4.3 Phase 3: Agent Prompts
- Check if agent prompts need updates. (If override works, no updates needed).

## 5. Security
- Path traversal prevention is critical.

## 6. Testing
- Verify loading `prd-methodology` (Registry).
- Verify loading a fake local skill (Local).
- Verify error message for missing skill.
