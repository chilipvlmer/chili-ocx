---
name: git-mastery
description: Automated git workflow with safety checks, intelligent diffing, and conventional commits.
version: 1.0.0
---

## status
type: shell
command: git status --porcelain
ignore_errors: false

## check_clean
type: shell
command: if [ -z "$(git status --porcelain)" ]; then echo "Clean"; exit 0; fi
ignore_errors: false

## check_secrets
type: regex_scan
file: "${inputs.files}"
pattern: "(?i)(api_key|secret|password|token|access_key).*?(=|:|\\s)['\"]?[a-zA-Z0-9]{20,}['\"]?"
fail_if_match: true

## stage
type: shell
command: if [ -z "${inputs.files}" ]; then git add .; else git add ${inputs.files}; fi

## diff
type: shell
command: if [ -z "${inputs.files}" ]; then git diff --cached; else git diff --cached ${inputs.files}; fi

## verify_cmd
type: shell
command: if [ -n "${inputs.verify_cmd}" ]; then ${inputs.verify_cmd}; fi
ignore_errors: false

## generate_msg
type: llm_generate
system_prompt: |
  You are an expert developer writing Conventional Commits.
  Generate a single line commit message (max 72 chars) for the following diff.
  Format: <type>(<scope>): <description>
  Types: feat, fix, docs, style, refactor, perf, test, chore
  Do NOT add any explanation, just the message.
prompt: |
  Files: ${inputs.files}
  Diff:
  ${steps.diff.stdout}

## confirm_commit
type: interactive
input_source: generate_msg

## commit
type: shell
command: git commit -m "${steps.generate_msg.content}"
