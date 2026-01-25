---
status: in-progress
phase: 1
updated: 2026-01-25
---

# Implementation Plan: Agent Skills & Git Mastery

## Goal
Implement the Agent Skill Framework (RFC-006) and the Git Mastery Skill (RFC-007) to standardize agent workflows.

## Context & Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| MD -> JSON Parsing | Load-time conversion for speed and robustness | RFC-006 |
| Dynamic Tools | Each skill becomes `skill_<name>` for agent visibility | RFC-006 |
| One-shot Execution | Git Mastery runs in a single blocking call for autonomy | RFC-007 |
| Internal LLM | Skill runner generates commit messages internally | RFC-007 |
| Safety First | Secret scanning and diff chunking added to RFC-007 | User Request |

## Phase 1: Framework Foundation (RFC-006) [STATUS]
- [x] **1.1 Scaffold plugin structure**
  - Create `plugin/src/skills/` directory
  - Create `plugin/src/skills/loader.ts` (empty)
  - Create `plugin/src/skills/registry.ts` (empty)
  - Create `plugin/src/skills/runner.ts` (empty)
- [x] **1.2 Implement Markdown Loader**
  - Implement parsing logic in `loader.js` (Frontmatter + content)
  - Test parsing with a dummy skill
- [x] **1.3 Implement Skill Registry**
  - Implement `registry.js` to manage loaded skills
  - Add logic to generate tool definitions (`skill_*`) from skill metadata
- [x] **1.4 Implement Skill Runner**
  - Implement `runner.js` to execute steps
  - Support 'regex_scan' step type in runner
  - Add "Internal LLM" capability stub (mocked for now)
- [x] **1.5 Wire up to Main Entry Point**
  - Update `index.js` (or equivalent) to load skills on startup

## Phase 2: Git Mastery Skill (RFC-007) [STATUS]
- [ ] **2.1 Create Skill Definition** ← CURRENT
  - Create `.opencode/skills/git-mastery.md`
  - Write steps as defined in RFC-007 (Status, Diff, Msg, Commit)
- [ ] **2.2 Implement Step Logic**
  - Update `runner.js` to handle:
    - Shell execution (`git status`, `git add`)
    - LLM generation (Message creation)
- [ ] **2.3 Bind "Smart Tool" Logic**
  - Ensure `runner.js` can parse the specific "Stage All" vs "Stage Files" logic
- [ ] **2.4 Implement Secret Scanner**
  - Add logic to scan staged files for high-entropy strings (AWS, Keys)
- [ ] **2.5 Implement Diff Chunking**
  - Add logic to summarize diffs > 10k chars

## Phase 3: Testing & Verification [STATUS]
- [ ] **3.1 Test Framework Loading**
  - Verify `skill_git_mastery` appears in agent tool list
- [ ] **3.2 Test Dry Run**
  - Execute skill in a dirty repo (dry run mode if available, or verify logs)
- [ ] **3.3 Verify Conventional Commits**
  - Check if generated messages match standard

## Phase 4: Documentation [STATUS]
- [ ] **4.1 Update README**
  - Document new Skill Framework
  - Add "Skills" section
- [ ] **4.2 Create SKILLS.md**
  - Guide for users to create their own skills
