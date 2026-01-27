# PRD: Agent Skill Framework & Git Mastery

**Version**: 1.1.0
**Status**: Draft
**Author**: Seed (Agentic Assistant)
**Date**: 2026-01-25
**Priority**: P1 - High

---

## 1. Executive Summary

Agents currently lack standardized execution protocols for complex tasks, leading to inconsistent results and reliance on ad-hoc prompt instructions. This PRD defines the **Agent Skill Framework**, a system for defining reusable, standardized capabilities in Markdown, and specifies the first reference implementation: **`git-mastery`**, a skill for enforcing Conventional Commits.

**Impact**: Enables reliable, repeatable, and high-quality agent actions across sessions and users.

---

## 2. Problem Statement

### 2.1 Current State
- Agents "wing it" when performing tasks like git commits, leading to messy history.
- "Teaching" an agent a process requires repetitive prompting.
- No central repository of "best practice" workflows.

### 2.2 Pain Points
- **Inconsistency**: Commits vary from "fixed bug" to "chore: update logic" depending on the agent's mood.
- **Safety**: Agents may accidentally commit secrets or break builds without a standardized check process.
- **Opacity**: Users don't know what capabilities an agent has until they try (and fail).

---

## 3. Goals and Success Metrics

### 3.1 Goals
1.  **G1**: Establish a standard Markdown-based "Skill" format compatible with LLMs.
2.  **G2**: Implement a `run_skill` tool that agents can discover and use.
3.  **G3**: Ship `git-mastery` to guarantee 100% Conventional Commit compliance.

### 3.2 Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Skill Discovery | 100% | Agents identify available skills in `.opencode/skills/` |
| Commit Compliance | 100% | `git log` shows Conventional Commits format |
| Error Transparency | 100% | Failures return verbose git stderr logs |

---

## 4. User Stories and Requirements

### 4.1 Users
- **Agents**: Need structured tools to execute complex plans.
- **Developers**: Need to write skills in simple English/Markdown.
- **User Story**: "As a user, I want to approve any commit before it happens."

### 4.2 Functional Requirements (P0)
- **FR-1**: Skills must be defined in Markdown files with Frontmatter metadata.
- **FR-2**: Skills must live in `.opencode/skills/`.
- **FR-3**: Agents must auto-discover skills via the `run_skill` tool.
- **FR-4**: `git-mastery` must perform **Safety Checks** (secret scanning) before staging.
- **FR-5**: `git-mastery` must enforce Conventional Commits.
- **FR-6**: "Dry run" mode must be available for dangerous operations.
- **FR-7**: Interactive Confirmation. Skill must pause and request approval for side-effects.
- **FR-8**: Pre-commit Verification. Skill must support running a verification command (e.g., `npm test`) before committing.
- **FR-9**: Permission-aware Shell. Shell steps must respect agent permissions.
- **FR-10**: `git-mastery` must support **Diff Chunking** to handle large contexts efficiently.

### 4.3 Non-Functional Requirements
- **NFR-1**: Skill parsing overhead < 500ms.
- **NFR-2**: Verbose error logging (full stderr).
- **NFR-3**: No external dependencies beyond `git` and Node.js stdlib.

---

## 5. Technical Specifications

### 5.1 Skill Format
Skills are Markdown files in `.opencode/skills/`.
```markdown
---
name: skill-name
description: What it does
inputs:
  param1: description
---
# Steps
1. Step one
2. Step two
```

### 5.2 System Architecture
1.  **Registry**: Scans `.opencode/skills/*.md` at startup.
2.  **Tool**: `run_skill(name, args)` exposed to agents.
3.  **Runner**:
    - Parses Markdown.
    - Executes steps (LLM-driven or code-mapped).
    - Returns structured result `{ status: "success", output: "..." }`.

### 5.3 Git Mastery Spec
- **Name**: `git-mastery`
- **Logic**:
    1. Run `git status`.
    2. If clean -> Exit.
    3. **Safety Check**: Scan for secrets (AWS, Stripe, keys). Abort if found.
    4. Stage changes (`git add`).
    5. **Smart Diff**: Chunk large diffs (>10k chars) to avoid context overflow.
    6. Generate message conforming to `(feat|fix|chore|docs|style|refactor|perf|test): <description>`.
    7. `git commit -m "..."`.
    8. Return hash and message.

---

## 6. UX and Workflow

### 6.1 Discovery
- Agent sees `run_skill` in tool list.
- Description: "Execute a specialized workflow. Available: git-mastery, ..."

### 6.2 Execution
- **User**: "Commit this."
- **Agent**: Calls `run_skill('git-mastery')`.
- **Output**:
    - Success: "✅ Committed: `feat: add user login` (hash: a1b2c3d)"
    - Failure: "❌ Git Error: `fatal: pathspec '...' did not match`"

---

## 7. Implementation Planning Hints

### 7.1 RFC Breakdown
- **RFC-006: Agent Skill Framework**: The loader, parser, and `run_skill` tool.
- **RFC-007: Git Mastery Skill**: The `.md` file and any specific logic binding.

### 7.2 Phasing
1.  **Phase 1**: Build the Framework (RFC-006).
2.  **Phase 2**: Implement Git Mastery (RFC-007).
3.  **Phase 3**: Integration Testing.

---

## 8. Dependencies and Risks
- **Dep**: Local `git` installation.
- **Risk**: LLM might hallucinate steps in Markdown if not parsed strictly.
- **Mitigation**: Use a structured parser or "Code Mode" for critical skills in the future.

---
**End of PRD**
