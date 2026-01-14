---
name: pepper-init
description: Initialize .pepper/ directory structure in the current project
agent: scoville
---

# /pepper-init

Initialize the Pepper harness structure in the current project.

## Usage

```
/pepper-init
```

## What It Does

1. Creates `.pepper/` directory structure:
   ```
   .pepper/
   ├── specs/
   │   ├── prd/
   │   └── rfc/
   ├── plans/
   ├── tracking/
   ├── notepad/
   │   ├── learnings.json
   │   ├── issues.json
   │   └── decisions.json
   ├── drafts/
   ├── state.json
   └── plan.md (empty template)
   ```

2. Creates initial `state.json`:
   ```json
   {
     "version": "1.0.0",
     "session_ids": [],
     "auto_continue": false
   }
   ```

3. Creates empty notepad files with structure:
   ```json
   {
     "version": "1.0.0",
     "entries": []
   }
   ```

4. Creates `tracking/rfc-status.json`:
   ```json
   {}
   ```

## Behavior

- If `.pepper/` already exists, reports status and skips
- Creates all directories recursively
- Safe to run multiple times (idempotent)

## After Initialization

Scoville will:
1. Confirm successful initialization
2. Ask if user wants to create a PRD
3. Explain next steps

## Related Commands

- `/prd` — Create a new PRD
- `/status` — Check current state
