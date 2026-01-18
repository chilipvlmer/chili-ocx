# Pepper Harness - How It Works

## Architecture Overview

### The Command Flow

```
User types: /pepper-init
    ↓
OpenCode loads: .opencode/command/pepper-init/COMMAND.md
    ↓
Agent (Scoville) reads the instruction
    ↓
COMMAND.md says: "Call the pepper_init tool"
    ↓
Scoville calls: pepper_init tool
    ↓
Plugin executes: Creates .pepper/ structure
    ↓
Returns result to Scoville
    ↓
Scoville confirms & asks next steps (question tool)
```

### Why This Design?

**Problem**: Plugins can't intercept commands (OpenCode processes them first)

**Solution**: Use commands as **instructions to agents**, not executable code

**Benefits**:
- ✅ Familiar slash command UX (`/pepper-init`)
- ✅ Agent knows exactly what to do
- ✅ Tools handle the actual execution
- ✅ Flexible - can add context, checks, follow-ups

## Command Types

### 1. Tool-Calling Commands
Commands that instruct the agent to call a tool.

**Example: `/pepper-init`**
```markdown
**Your task:** Call the `pepper_init` tool

After the tool completes:
1. Confirm success
2. Use question tool to ask next steps
```

Agent flow:
1. Reads instruction
2. Calls `pepper_init` tool
3. Tool creates `.pepper/`
4. Agent confirms and presents options

### 2. State-Reading Commands  
Commands that instruct the agent to read and display state.

**Example: `/status`**
```markdown
**Your task:**
1. Read `.pepper/state.json`
2. Read `.pepper/plan.md`
3. Display current status
4. Ask next steps via question tool
```

Agent flow:
1. Reads instruction
2. Reads state files
3. Formats and displays
4. Presents contextual options

### 3. Delegation Commands
Commands that instruct Scoville to delegate to another agent.

**Example: `/work`**
```markdown
**Your task:**
1. Read `.pepper/plan.md`
2. Find current task (← CURRENT marker)
3. Determine agent based on task type
4. Delegate via task tool
```

Agent flow:
1. Reads instruction
2. Parses plan file
3. Identifies task type
4. Delegates to appropriate specialist

### 4. Agent-Switch Commands
Commands that switch to a specialized agent for interactive work.

**Example: `/prd`**
```markdown
**Your task (Seed):**
1. Check .pepper/ exists
2. Use prd-methodology skill
3. Create PRD via 10-phase interview
4. Update state.json
5. Tell user to switch back to Scoville
```

Agent flow:
1. User switches to Seed (TAB → seed-prd-rfc)
2. Seed reads instruction
3. Conducts interactive interview
4. Creates PRD document
5. Tells user to switch back

## Available Commands

| Command | Agent | Type | What It Does |
|---------|-------|------|--------------|
| `/pepper-init` | Scoville | Tool-calling | Calls `pepper_init` tool |
| `/status` | Scoville | State-reading | Displays current state |
| `/work` | Scoville | Delegation | Continues current task |
| `/prd` | Seed | Agent-switch | Creates PRD (interactive) |
| `/prd-refine` | Seed | Agent-switch | Refines PRD (interactive) |
| `/rfc` | Seed | Agent-switch | Creates RFC (interactive) |
| `/rfc-refine` | Seed | Agent-switch | Refines RFC (interactive) |
| `/plan` | Sprout | Delegation | Creates execution plan |
| `/review` | Habanero | Delegation | Reviews code |

## Plugin System

### Registered Tools

The plugin registers tools that agents can call:

```typescript
{
  "pepper_init": {
    description: "Initialize .pepper/ directory structure",
    execute: () => {
      // Create directories
      // Create state.json
      // Create notepad files
      // Return success message
    }
  }
}
```

### Future Tools

```typescript
{
  "pepper_status": {
    description: "Get current Pepper state as JSON",
    execute: () => {
      // Read state.json
      // Read plan.md
      // Return structured data
    }
  },
  
  "pepper_notepad_add": {
    description: "Add entry to notepad",
    args: {
      type: z.enum(["learning", "issue", "decision"]),
      content: z.string()
    },
    execute: (args) => {
      // Append to notepad file
      // Return confirmation
    }
  }
}
```

## Session Flow Example

### Starting Fresh

1. **User**: Opens OpenCode in new project
2. **Scoville**: "Welcome! 🌶️ What would you like to do?" (question tool)
3. **User**: Selects "Create a PRD"
4. **Scoville**: "First, let's initialize Pepper. One moment..."
5. **Scoville**: Calls `pepper_init` tool
6. **Plugin**: Creates `.pepper/` structure
7. **Scoville**: "✅ Initialized! Now switching you to Seed for PRD creation. Press TAB → seed-prd-rfc"
8. **User**: Switches to Seed
9. **Seed**: Conducts 10-phase interview
10. **Seed**: Creates PRD, tells user to switch back
11. **User**: Switches to Scoville
12. **Scoville**: "PRD created! What's next?" (question tool with RFC/coding options)

### Resuming Work

1. **User**: Opens OpenCode, types "hi"
2. **Scoville**: Reads `.pepper/state.json`
3. **Scoville**: "Welcome back! Active RFC: auth-system v1.0.0. Current task: Implement user login (3/10 tasks)" (question tool)
4. **User**: Selects "Continue work"
5. **Scoville**: Reads plan, sees "implement" keyword
6. **Scoville**: Delegates to Jalapeño via task tool
7. **Jalapeño**: Implements user login
8. **Jalapeño**: Returns to Scoville
9. **Scoville**: Updates plan, asks if user wants to continue

### Using Commands

1. **User**: Types `/pepper-init`
2. **OpenCode**: Loads `pepper-init/COMMAND.md`
3. **Scoville**: Reads instruction: "Call pepper_init tool"
4. **Scoville**: Calls `pepper_init`
5. **Plugin**: Executes, creates structure
6. **Scoville**: "✅ Initialized! What's next?" (question tool)

## Key Principles

### 1. Commands Are Instructions
- COMMAND.md files tell agents what to do
- Not executable code themselves
- Provide context and workflow guidance

### 2. Tools Are Actions  
- Registered via plugin
- Execute actual operations
- Return results to agents

### 3. Agents Are Workers
- Scoville orchestrates
- Specialists execute (Seed, Jalapeño, etc.)
- Always use question tool for choices

### 4. State Is Truth
- `.pepper/state.json` - Current session state
- `.pepper/plan.md` - Execution roadmap
- `.pepper/notepad/` - Historical context

## Benefits of This Architecture

1. **User-Friendly**: Familiar `/command` syntax
2. **Flexible**: Commands can be complex instructions
3. **Extensible**: Easy to add new tools
4. **Maintainable**: Clear separation of concerns
5. **Contextual**: Agents can add checks, validations, follow-ups
6. **Interactive**: Question tool provides guided workflows

## Debugging

### Check Plugin Loading
```bash
cat /tmp/chili-ocx-plugin.log
```

Should show:
```
[timestamp] 🌶️ chili-ocx plugin initializing...
[timestamp] Context directory: ...
[timestamp] 📋 Registered 1 custom tools
[timestamp] ✅ chili-ocx plugin loaded successfully
```

### Check Tool Execution
```bash
tail -f /tmp/chili-ocx-plugin.log
```

Then type `/pepper-init` and watch:
```
[timestamp] 🔧 pepper_init tool executing
[timestamp] ✅ pepper_init result: Successfully initialized .pepper/...
```

### Check State
```bash
cat .pepper/state.json
cat .pepper/plan.md
ls -la .pepper/notepad/
```

---

**Last Updated**: 2026-01-18  
**Architecture**: Command → Instruction → Tool → Result → Question
