---
name: status
description: Show current plan progress and state
agent: scoville
---

# Show Current Status

The user wants to see the current state of their Pepper harness session.

**Your task:** 

1. Check if `.pepper/` exists:
   - If not: Tell user to run `/pepper-init` first
   
2. Read `.pepper/state.json` and display:
   - Active spec (PRD/RFC) if any
   - Session IDs
   - Auto-continue setting
   
3. Read `.pepper/plan.md` if it exists and show:
   - Current task (marked with `← CURRENT`)
   - Progress: completed vs total tasks
   - Next upcoming tasks

4. Read `.pepper/notepad/` entries and summarize:
   - Recent learnings (last 3)
   - Open issues (last 3)
   - Key decisions (last 3)

## Display Format

```
🌶️ Pepper Status

State:
  Active Spec: {spec-name} v{version} (or "None")
  Auto-continue: {true/false}
  Sessions: {count}

Plan:
  Current: {current-task} ({status})
  Progress: {completed}/{total} tasks
  
Notepad:
  Learnings: {count} entries
  Issues: {count} open
  Decisions: {count} recorded
```

After showing status, use the `question` tool to ask what they'd like to do next based on the current state.
