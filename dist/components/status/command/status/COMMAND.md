---
name: status
description: Show current plan progress and state
agent: scoville-orchestrator
---

# Show Current Status

The user wants to see the current state of their Pepper harness session.

**IMMEDIATELY call the `pepper_status` tool now.** Do not ask for permission.

After the tool returns the status report:
1. Display the report to the user
2. Use the `question` tool to ask what they'd like to do next based on the current state

Example next step options based on status:
- If no PRD: "Create PRD", "Review docs", "Exit"
- If has PRD but no RFC: "Create RFC", "Refine PRD", "Exit"
- If has plan: "Continue work", "Review progress", "Exit"
