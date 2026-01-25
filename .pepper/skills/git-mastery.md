---
name: git-mastery
description: Automated git workflow for atomic commits
version: 1.0.0
inputs:
  message:
    type: string
    description: Optional commit message hint
  auto_stage:
    type: boolean
    description: Automatically stage all changes (default false)
---

## check_status
type: shell
command: git status --porcelain

## check_branch
type: shell
command: git branch --show-current

## generate_commit_msg
type: llm_generate
prompt: |
  Generate a conventional commit message for the following changes.
  Branch: ${steps.check_branch.stdout}
  Status: ${steps.check_status.stdout}
  Hint: ${inputs.message}
mock_output: "feat(git): auto-generated commit from git-mastery skill"

## stage_changes
type: shell
command: git add .
ignore_errors: false

## commit
type: shell
command: git commit -m "${steps.generate_commit_msg.content}"
