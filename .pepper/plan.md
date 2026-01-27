---
status: completed
phase: 4
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
| One-shot Execution | Interactive Execution (Proposal -> Confirm) | v1.1.0 |
| Internal LLM | Skill runner generates commit messages internally | RFC-007 |
| Safety First | Secret scanning and diff chunking added to RFC-007 | User Request |

## Phase 1: Framework Foundation (RFC-006) [COMPLETED]
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

## Phase 2: Git Mastery Skill (RFC-007) [COMPLETED]
- [x] **2.1 Create Skill Definition**
  - Create `.opencode/skills/git-mastery.md`
  - Write steps as defined in RFC-007 (Status, Diff, Msg, Commit)
- [x] **2.2 Implement Step Logic**
  - Update `runner.js` to handle:
    - Shell execution (`git status`, `git add`)
    - LLM generation (Message creation)
- [x] **2.3 Bind "Smart Tool" Logic**
  - Ensure `runner.js` can parse the specific "Stage All" vs "Stage Files" logic
- [x] **2.4 Implement Secret Scanner**
  - Add logic to scan staged files for high-entropy strings (AWS, Keys)
- [x] **2.5 Implement Diff Chunking**
  - Add logic to summarize diffs > 10k chars
- [x] **2.6 Implement Interactive Step**
  - Update `runner.ts` to support `interactive` steps (pause and return proposal)
- [x] **2.7 Update Git Mastery Definition**
  - Update `.opencode/skills/git-mastery.md` to use the new v1.1.0 flow (Verify -> Prop -> Confirm)
- [x] **2.8 Fix Glob & Regex**
  - Updated regex to handle unquoted secrets
  - Implemented `git ls-files` with `--others --exclude-standard` for robust scanning
  - Fixed variable substitution to handle empty/default values (`||`)
- [x] **2.9 Permission Check**
  - Add permission check to `shell` steps (Mock/Stub for now)

## Phase 3: Testing & Verification [COMPLETED]
- [x] **3.1 Test Framework Loading**
  - Verify `skill_git_mastery` appears in agent tool list
- [x] **3.2 Test Dry Run**
  - Execute skill in a dirty repo (dry run mode if available, or verify logs)
- [x] **3.3 Verify Conventional Commits**
  - Check if generated messages match standard

## Phase 4: Documentation [COMPLETED]
- [x] **4.1 Update README**
  - Document new Skill Framework
  - Add "Skills" section
- [x] **4.2 Create SKILLS.md**
  - Guide for users to create their own skills
