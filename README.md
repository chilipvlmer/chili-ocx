# 🌶️ Chili-OCX

A pepper-themed AI coding harness for OpenCode. Specialized agents, structured planning, and persistent state management.

## What This Is

A **bundle** — a curated collection of components that work together:

- 7 agents (Scoville, Seed, Sprout, Jalapeño, Chipotle, Habanero, Ghost)
- 12 skills (orchestration, planning, review protocols)
- 5 plugins (state management, worktrees, notifications)
- 14 commands (PRD, RFC, planning, execution workflow)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SCOVILLE (Orchestrator)              │
│              Coordinates all specialist agents          │
└─────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    ┌─────────┐     ┌──────────┐     ┌─────────┐
    │  SEED   │     │  SPROUT  │     │ GHOST   │
    │ Planner │     │  Planner │     │Research │
    └─────────┘     └──────────┘     └─────────┘
         │                │                │
         ▼                ▼                ▼
    ┌─────────────────────────────────────────────┐
│              SPECIALISTS                         │
│  ┌──────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │ Jalapeño │ │ Chipotle│ │Habanero │ │  ...  │ │
│  │  Coder   │ │  Scribe │ │ Reviewer│ │       │ │
│  └──────────┘ └─────────┘ └─────────┘ └───────┘ │
└─────────────────────────────────────────────────────┘
```

## Components

### Agents

| Agent | Role | Description |
|-------|------|-------------|
| 🌶️ Scoville | Orchestrator | Coordinates work, delegates to specialists |
| 🌱 Seed | Artifact Planner | Creates PRDs and RFCs |
| 🌿 Sprout | Execution Planner | Creates task plans from specs |
| 🫑 Jalapeño | Coder | Implements features and fixes |
| 🌮 Chipotle | Scribe | Documentation specialist |
| 🔥 Habanero | Reviewer | Code review and quality |
| 👻 Ghost | Explorer | Research and codebase navigation |

### Commands

| Command | Description |
|---------|-------------|
| `/pepper-init` | Initialize `.pepper/` structure |
| `/prd` | Create new PRD |
| `/prd-refine` | Refine existing PRD |
| `/prd-review` | Review PRD quality |
| `/rfc` | Create new RFC |
| `/rfc-refine` | Refine existing RFC |
| `/rfc-review` | Review RFC quality |
| `/plan` | Generate execution plan |
| `/work` | Start/resume execution |
| `/review` | Review code changes |
| `/status` | Show current progress |
| `/resume` | Resume after compaction |
| `/notepad` | View/add to persistent notepad |
| `/auto-continue` | Toggle auto-continue |

## Installation

### 1. Install OCX

See the [OpenCode CLI repository](https://github.com/sst/opencode) for installation instructions.

### 2. Add the Chili-OCX Registry

```bash
ocx registry add --name chili-ocx https://chili-ocx.pages.dev
```

### 3. Install the Bundle

```bash
ocx add chili-ocx/total
```

Or install specific components:

```bash
ocx add chili-ocx/scoville      # Orchestrator agent
ocx add chili-ocx/pepper-protocol  # Orchestration skill
```

## Workflow

```
1. /pepper-init     → Initialize project
2. /prd             → Define requirements
3. /rfc             → Design implementation
4. /plan            → Create execution plan
5. /work            → Execute tasks
6. /review          → Quality check
```

## .pepper/ Directory

```
.pepper/
├── specs/
│   ├── prd/           # Product Requirements Documents
│   └── rfc/           # Request for Comments
├── plans/             # Historical plans
├── plan.md            # Active execution plan
├── state.json         # Session state
├── notepad/           # Persistent memory
│   ├── learnings.json
│   ├── issues.json
│   └── decisions.json
└── drafts/            # Work in progress
```

## Skills

| Skill | Purpose |
|-------|---------|
| pepper-protocol | Orchestration rules |
| prd-format | PRD structure |
| rfc-format | RFC structure |
| planning-workflow | Plan creation |
| code-philosophy | 5 Laws of coding |
| docs-style | Documentation style |
| code-review | Review methodology |
| exploration-protocol | Research methodology |

## Plugins

| Plugin | Description |
|--------|-------------|
| state-management | Manages `.pepper/` state and context recovery |
| agents-md-loader | Loads AGENTS.md for project context |
| worktree-manager | Git worktree isolation for parallel work |
| toast-status | Dynamic delegation status display |

## License

MIT
