# Pepper Harness Commands - Quick Reference

All commands work the same way: Type the command, the agent reads the instruction, performs actions, and guides you forward.

## Workflow Commands

### `/pepper-init` 🌶️
**Agent**: Scoville  
**What it does**: Calls `pepper_init` tool to create `.pepper/` structure  
**Next**: Presents options via question tool (Create PRD, Quick task, Explore)

### `/status` 📊
**Agent**: Scoville  
**What it does**: Reads and displays current state, plan progress, notepad  
**Next**: Contextual options based on current state

### `/work` 🔨
**Agent**: Scoville  
**What it does**: Reads plan, finds current task, delegates to appropriate agent  
**Next**: Executes current task, updates plan, continues or asks

## Specification Commands

### `/prd` 📝
**Agent**: Seed (switch to)  
**What it does**: 10-phase interview to create Product Requirements Document  
**Next**: Creates PRD, tells you to switch back to Scoville

### `/prd-refine` ✏️
**Agent**: Seed (switch to)  
**What it does**: Refines existing PRD with version bumping  
**Next**: Updates PRD, tells you to switch back

### `/rfc` 🏗️
**Agent**: Seed (switch to)  
**What it does**: Creates technical design document (RFC)  
**Next**: Creates RFC, updates tracking, tells you to switch back

### `/rfc-refine` ✏️
**Agent**: Seed (switch to)  
**What it does**: Refines existing RFC with version bumping  
**Next**: Updates RFC, tells you to switch back

### `/plan` 📋
**Agent**: Sprout (delegates to)  
**What it does**: Creates execution plan from RFC  
**Next**: Creates `.pepper/plan.md`, marks first task as current

## Execution Commands

### `/review` 🔍
**Agent**: Habanero (delegates to)  
**What it does**: Reviews code for quality, security, best practices  
**Next**: Provides structured feedback, adds issues to notepad

## Utility Commands

### `/notepad` 📓
**Agent**: Scoville  
**What it does**: View or add learnings, issues, decisions  
**Next**: Shows entries or adds new entry

### `/auto-continue` ⚡
**Agent**: Scoville  
**What it does**: Toggle automatic task continuation  
**Next**: Updates state, explains the change

### `/resume` 🔄
**Agent**: Scoville  
**What it does**: Resume previous session  
**Next**: Loads state, presents options to continue

## Command Pattern

Every command follows this flow:

```
User types: /command
    ↓
OpenCode loads: COMMAND.md
    ↓
Agent reads instruction
    ↓
Agent performs actions:
  - Read state files
  - Call tools
  - Process data
  - Update state
    ↓
Agent uses question tool
    ↓
User selects next action
```

## Agent Responsibilities

| Agent | Commands | Role |
|-------|----------|------|
| **Scoville** | pepper-init, status, work, notepad, auto-continue, resume | Orchestrator |
| **Seed** | prd, prd-refine, rfc, rfc-refine | Specification Creator |
| **Sprout** | plan | Execution Planner |
| **Jalapeño** | (via /work) | Coder |
| **Habanero** | review | Code Reviewer |
| **Chipotle** | (via /work) | Documentation |
| **Ghost** | (via /work) | Explorer |

## Typical Session Flow

### Starting Fresh
```bash
/pepper-init          # Create .pepper/ structure
# → Select "Create a PRD"
# → Switch to Seed (TAB)
/prd my-app          # Create PRD
# → Seed conducts interview
# → Switch back to Scoville (TAB)
/rfc                 # Create technical design
# → Switch to Seed
# → Seed creates RFC
# → Switch back to Scoville
/plan                # Create execution plan
# → Sprout creates plan.md
/work                # Start first task
# → Jalapeño implements
# → Task complete
/work                # Continue next task
```

### Resuming Work
```bash
# Open OpenCode, say "hi"
# → Scoville shows current state
# → Select "Continue work"
/work                # Resume current task
# → Appropriate agent executes
# → Repeat
```

### Quick Tasks
```bash
/pepper-init
# → Select "Quick coding task"
# → Scoville asks what you want
# → Delegates to Jalapeño
# → Code gets written
```

## Tips

1. **Use `/status` frequently** to check progress
2. **Let Scoville guide you** - use question tool options
3. **Trust the workflow** - PRD → RFC → Plan → Work
4. **Review regularly** - Use `/review` after major changes
5. **Document learnings** - Use `/notepad add` to capture insights
6. **Enable auto-continue** for focused sessions, disable for learning

## File Structure

```
.pepper/
├── specs/
│   ├── prd/
│   │   └── my-app-v1.0.0.md
│   └── rfc/
│       └── auth-system-v1.0.0.md
├── plans/
│   └── plan.md
├── tracking/
│   └── rfc-status.json
├── notepad/
│   ├── learnings.json
│   ├── issues.json
│   └── decisions.json
├── drafts/
└── state.json
```

## State Management

**state.json** tracks:
- Active spec (PRD/RFC)
- Session IDs
- Auto-continue preference
- Current plan status

**plan.md** shows:
- Phases and tasks
- Current task marker (`← CURRENT`)
- Completion status (`[ ]` or `[x]`)
- Complexity estimates

**notepad/** captures:
- Things learned
- Issues encountered
- Decisions made

---

**Quick Start**: `/pepper-init` → Select "Create PRD" → Follow the flow! 🌶️
