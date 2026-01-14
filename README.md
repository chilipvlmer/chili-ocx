# 🌶️ Chili-OCX

A pepper-themed AI coding harness for OpenCode. Orchestrate your development workflow with specialized agents, structured planning, and persistent state management.

## Features

- **Pepper-themed Agents** — Specialized agents for different tasks
- **Structured Planning** — PRD → RFC → Execution Plan workflow
- **Persistent State** — `.pepper/` directory tracks progress across sessions
- **Delegation-based Architecture** — Token-efficient orchestration
- **Context Recovery** — Resume work after context compaction

## Installation

```bash
npx ocx add @chili-ocx/total
```

Or install specific components:

```bash
npx ocx add @chili-ocx/scoville      # Orchestrator agent
npx ocx add @chili-ocx/pepper-protocol  # Orchestration skill
```

## Agents

| Agent | Role | Description |
|-------|------|-------------|
| 🌶️ **Scoville** | Orchestrator | Coordinates work, delegates to specialists |
| 🌱 **Seed** | Artifact Planner | Creates PRDs and RFCs |
| 🌿 **Sprout** | Execution Planner | Creates task plans from specs |
| 🫑 **Jalapeño** | Coder | Implements features and fixes |
| 🌮 **Chipotle** | Scribe | Documentation specialist |
| 🔥 **Habanero** | Reviewer | Code review and quality |
| 👻 **Ghost** | Explorer | Research and codebase navigation |

## Commands

### Setup
| Command | Description |
|---------|-------------|
| `/pepper-init` | Initialize `.pepper/` structure |

### Planning
| Command | Description |
|---------|-------------|
| `/prd` | Create new PRD |
| `/prd-refine` | Refine existing PRD |
| `/prd-review` | Review PRD quality |
| `/rfc` | Create new RFC |
| `/rfc-refine` | Refine existing RFC |
| `/rfc-review` | Review RFC quality |
| `/plan` | Generate execution plan |

### Execution
| Command | Description |
|---------|-------------|
| `/work` | Start/resume execution |
| `/review` | Review code changes |
| `/status` | Show current progress |
| `/resume` | Resume after compaction |
| `/auto-continue` | Toggle auto-continue |

### Notepad
| Command | Description |
|---------|-------------|
| `/notepad` | View/add to persistent notepad |

## .pepper/ Directory Structure

```
.pepper/
├── specs/
│   ├── prd/           # Product Requirements Documents
│   │   └── {project}-v{X.Y.Z}.md
│   └── rfc/           # Request for Comments
│       └── v{X.Y.Z}/
│           └── RFC-{NNN}-{slug}.md
├── tracking/
│   └── rfc-status.json
├── plans/             # Historical plans
├── plan.md            # Active execution plan
├── state.json         # Session state
├── notepad/           # Persistent memory
│   ├── learnings.json
│   ├── issues.json
│   └── decisions.json
└── drafts/            # Work in progress
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

## Skills

| Skill | Used By | Purpose |
|-------|---------|---------|
| pepper-protocol | Scoville | Orchestration rules |
| prd-format | Seed | PRD structure |
| rfc-format | Seed | RFC structure |
| planning-workflow | Sprout | Plan creation |
| code-philosophy | Jalapeño | 5 Laws of coding |
| docs-style | Chipotle | Documentation style |
| code-review | Habanero | Review methodology |
| exploration-protocol | Ghost | Research methodology |

## Plugins

| Plugin | Description |
|--------|-------------|
| state-management | Manages `.pepper/` state and context recovery |
| agents-md-loader | Loads AGENTS.md for project context |
| worktree-manager | Git worktree isolation for parallel work |
| toast-status | Dynamic delegation status display |

## Versioning

PRDs use Semantic Versioning:
- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Clarifications

RFCs are namespaced under their parent PRD version.

## License

MIT
