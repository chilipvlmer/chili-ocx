# Agent Skills Framework

Agent Skills are declarative, step-by-step workflows that agents can execute to perform complex, multi-step operations reliably. They bridge the gap between simple tool calls and complex agentic behavior.

## What is a Skill?

A **Skill** is a Markdown file containing:
1.  **Frontmatter**: Metadata defining the skill (name, description, inputs).
2.  **Steps**: A JSON array defining the sequence of actions.

Skills are "compiled" at runtime into **Smart Tools** (e.g., `skill_git_mastery`) that agents can call like any other tool.

## Skill File Format

Skills live in `plugin/src/skills/` (source) or `.pepper/skills/` (user-defined).

```markdown
---
name: my-skill
description: Does something awesome
inputs:
  target_file:
    type: string
    description: File to process
    required: true
  mode:
    type: string
    description: fast or slow
    default: fast
---

[
  {
    "name": "step_1",
    "type": "shell",
    "command": "echo 'Processing ${inputs.target_file}'"
  }
]
```

## Available Step Types

The Skill Runner supports the following step types:

### 1. `shell`
Executes a shell command.
- **Properties**: `command`, `cwd` (optional), `ignore_errors` (optional).
- **Security**: Restricted commands (e.g., `rm -rf /`) are blocked.
- **Variables**: Supports `${inputs.var}` substitution.

```json
{
  "name": "check_status",
  "type": "shell",
  "command": "git status"
}
```

### 2. `regex_scan`
Scans files for patterns (useful for security checks or validation).
- **Properties**: `file` (path or glob), `pattern` (regex), `fail_if_match`, `fail_if_no_match`.
- **Features**: Supports git-aware scanning (ignores `.gitignore`).

```json
{
  "name": "scan_secrets",
  "type": "regex_scan",
  "file": "${inputs.files}",
  "pattern": "(AKIA|SK)[A-Z0-9]{16}",
  "fail_if_match": true
}
```

### 3. `llm_generate`
Generates content using an internal LLM (or heuristic fallback).
- **Properties**: `prompt`, `mock_output` (for testing).
- **Use Case**: Generating commit messages, PR descriptions, or summaries.

```json
{
  "name": "generate_msg",
  "type": "llm_generate",
  "prompt": "Generate a commit message for these changes:\n${steps.get_diff.output}"
}
```

### 4. `interactive`
Pauses execution to request user confirmation.
- **Properties**: `input_source` (optional step to propose).
- **Behavior**: Halts execution and returns a proposal. User must re-run with `confirm=true` to proceed.

```json
{
  "name": "confirm_commit",
  "type": "interactive",
  "input_source": "generate_msg"
}
```

## Example: Git Mastery Skill

The `git-mastery` skill demonstrates the power of this framework:

1.  **Status**: Checks `git status`.
2.  **Diff**: Captures `git diff` of staged changes.
3.  **Secret Scan**: Scans staged files for leaked secrets.
4.  **Message Gen**: Generates a Conventional Commit message.
5.  **Interactive**: Proposes the message to the user.
6.  **Commit**: Executes `git commit` if confirmed.

## Creating Your Own Skill

1.  Create a `.md` file in `.pepper/skills/`.
2.  Define the frontmatter with inputs.
3.  Write the steps JSON array.
4.  Restart the agent/plugin to load the new skill.
5.  Access it via `skill_<name>`.
