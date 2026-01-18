---
name: work
description: Start or resume execution of current plan
agent: scoville
---

# Continue Work

The user wants to continue working on the current plan.

**Your task (Scoville):**

1. Check if `.pepper/plan.md` exists:
   - If not: Tell user to create a plan first (need RFC → `/plan`)

2. Read `.pepper/plan.md` and find the line with `← CURRENT` marker

3. Identify the task type from the current task:
   - Contains "implement", "code", "build" → Delegate to **Jalapeño** (jalapeno-coder)
   - Contains "document", "write docs", "README" → Delegate to **Chipotle** (chipotle-scribe)
   - Contains "review", "check" → Delegate to **Habanero** (habanero-reviewer)
   - Contains "research", "explore", "investigate" → Delegate to **Ghost** (ghost-explorer)
   - Contains "plan", "design" → Delegate to **Sprout** (sprout-execution-planner)

4. Use the `task` tool to delegate to the appropriate agent with the task description

5. After the agent completes:
   - Update the plan (move `← CURRENT` marker to next task)
   - Check `auto_continue` in state.json:
     - If true: Continue to next task automatically
     - If false: Ask user if they want to continue

## Example Task Detection

```markdown
## Phase 1: Foundation

- [x] Set up project structure
- [ ] Implement user authentication ← CURRENT
- [ ] Create database schema
```

Task: "Implement user authentication"  
Keywords: "implement" → Delegate to **Jalapeño**

## Related Commands

- `/status` - Check current progress
- `/plan` - Create or update execution plan
