---
name: auto-continue
description: Toggle auto-continue mode
agent: scoville-orchestrator
---

# Auto-Continue

The user wants to toggle auto-continue mode.

**Your task (Scoville):**

1. Read current setting from `.pepper/state.json`

2. Show current status and ask using `question` tool:
   - "Enable auto-continue" - Automatically move to next task
   - "Disable auto-continue" - Ask before each task
   - "Cancel" - Keep current setting

3. Update `.pepper/state.json`:
   ```json
   {
     "auto_continue": true
   }
   ```

4. Explain the change:

**When enabled:**
- After completing a task, Scoville automatically starts the next one
- Faster workflow for focused development sessions
- You can still pause by switching agents or closing session

**When disabled:**
- After each task, Scoville asks if you want to continue
- Better for learning, reviewing, or taking breaks
- More control over pacing
