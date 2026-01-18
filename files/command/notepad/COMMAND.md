---
name: notepad
description: View or add notepad entries
agent: scoville
---

# Notepad

The user wants to interact with the notepad.

**Your task (Scoville):**

1. Ask what they want to do using the `question` tool:
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
- Use `question` tool to ask for entry type and content
- Append to appropriate notepad file
- Confirm addition

## Notepad Structure

Each notepad file (`.pepper/notepad/{type}.json`) has:
```json
{
  "version": "1.0.0",
  "entries": [
    {
      "timestamp": "2026-01-18T10:30:00Z",
      "content": "Learned that async/await improves code readability",
      "context": "Implementing user authentication"
    }
  ]
}
```

## Entry Types

- **learnings.json**: Things learned during development
- **issues.json**: Problems encountered and their status
- **decisions.json**: Architectural and design decisions made
