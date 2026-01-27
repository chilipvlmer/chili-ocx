---
name: notepad
description: View or add notepad entries
agent: scoville-orchestrator
---

# Notepad

The user wants to interact with the notepad.

**Your task (Scoville):**

1. Use the `question` tool to ask what they want to do:
   - "View learnings" - Show recent learnings
   - "View issues" - Show open issues
   - "View decisions" - Show key decisions
   - "Add entry" - Add new entry

2. Based on selection:

**View entries:**
- Read `.pepper/notepad/{type}.json`
- Display entries with timestamps
- Show most recent first

**Add entry:**
- Use `question` tool to ask for entry type (learnings/issues/decisions) and content
- Call the `pepper_notepad_add` tool with:
  - `notepadType`: "learnings" | "issues" | "decisions"
  - `entry`: The content to add
- Display the tool's confirmation message

## Entry Types

- **learnings.json**: Things learned during development
- **issues.json**: Problems encountered and their status
- **decisions.json**: Architectural and design decisions made
