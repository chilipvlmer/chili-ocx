---
name: pepper-init
description: Initialize .pepper/ directory structure in the current project
agent: scoville
---

# Initialize Pepper Structure

The user wants to initialize the Pepper harness in this project.

**Your task:** Call the `pepper_init` tool to create the `.pepper/` directory structure.

After the tool completes successfully:
1. Confirm the initialization was successful
2. Use the `question` tool to ask what they'd like to do next:
   - "Create a PRD" - Define project vision
   - "Quick coding task" - Jump straight to implementation
   - "Explore codebase" - Understand existing code

## Tool to Call

```
pepper_init
```

This tool will create:
- `.pepper/specs/` (for PRDs and RFCs)
- `.pepper/plans/` (for execution plans)
- `.pepper/notepad/` (for learnings, issues, decisions)
- `.pepper/tracking/` (for RFC status)
- `.pepper/state.json` (session state)
- `.pepper/plan.md` (execution plan template)

The tool handles idempotency - safe to run if `.pepper/` already exists.
