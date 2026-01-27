# RFC-007: Git Mastery Skill

**Status**: Draft
**Date**: 2026-01-25
**Author**: Chipotle (Scribe)
**References**:
- PRD: [Agent Skill Framework & Git Mastery](../../prd/agent-skills-v1.0.0.md)
- RFC: [RFC-006: Agent Skill Framework](./RFC-006-agent-skill-framework.md)

## 1. Goal
Implement the first reference skill, **`git-mastery`**, as a "Smart Tool" that autonomously stages changes, checks for safety, generates a Conventional Commit message, and commits.

## 2. Approach

### 2.1 Skill Definition File
Create `.opencode/skills/git-mastery.md` with the following logic:

**Inputs**:
- `files` (optional): Specific files to stage. If omitted, stages ALL changes.
- `context` (optional): Hint for the commit message.
- `confirm` (boolean, default false): Set to true to execute the commit.
- `verify_cmd` (string, optional): Command to run before committing (e.g., `npm test`).

**Steps**:
1.  **Check Status**: Run `git status --porcelain`.
2.  **Verify Clean**: If clean, return "Clean - Nothing to commit" and exit.
3.  **Safety Check (Secret Scan)**:
    - Run a regex scan on changed files for high-entropy strings (AWS keys, Private Keys).
    - If secrets found: **ABORT** and return error "Possible secret detected in <file>".
4.  **Stage Changes**:
    - If `files` provided: Run `git add <files>`.
    - If `files` omitted: Run `git add .` (Stage All).
5.  **Analyze Diff (Chunking Strategy)**:
    - Run `git diff --cached`.
    - **Smart Logic**:
        - If diff < 10,000 chars: Use full diff for prompt.
        - If diff > 10,000 chars: Use `git diff --stat` + `git diff --name-only` + first 50 lines of each file (summarized context).
6.  **Verification**:
    - If `verify_cmd` is present, run it.
    - If output contains error or exit code != 0, **ABORT** and return error.
7.  **Generate Message (Internal LLM)**:
    - Use the (chunked) diff + `context` to generate a Conventional Commit message.
    - **Rule**: Prefer "Atomic Commits". If multiple distinct changes, focus on the primary one or use a broader scope.
    - Format: `type(scope): description`.
8.  **Confirmation Logic**:
    - If `confirm` is FALSE: Return "Proposed Commit: <generated_message>. Re-run with confirm=true to execute."
    - If `confirm` is TRUE: 
        - Run `git commit -m "<generated_message>"`.
        - Return commit hash and message.

## 3. Technical Details

### 3.1 Dependencies
- **RFC-006**: Skill runner must support "Secret Scan" step (regex helper) and "Diff Chunking" logic.
- **Git**: Local git installation.

### 3.2 Execution Flow (One-shot)
- Agent calls `skill_git_mastery()`.
- System performs Safety -> Stage -> Smart Diff -> Gen Message -> Commit.
- Returns result: "✅ Committed: fix: typo in login (abc1234)".

## 4. Success Criteria
- **Safety First**: Zero secrets committed.
- **Robustness**: Handles large diffs without crashing context.
- **Quality**: Messages are descriptive even for large changes.
