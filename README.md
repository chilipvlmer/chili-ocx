# 🌶️ Chili-OCX

A pepper-themed AI coding harness for OpenCode. Specialized agents, structured planning, and persistent state management.

## What This Is

A **bundle** — a curated collection of components that work together:

- 7 agents (Scoville, Seed, Sprout, Jalapeño, Chipotle, Habanero, Ghost)
- 12 skills (orchestration, planning, review protocols)
- 5 plugins (state management, worktrees, notifications)
- 14 commands (PRD, RFC, planning, execution workflow)

## Architecture

(Diagram to be added)

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

See the [OCX repository](https://github.com/kdcokenny/ocx) for installation instructions.

### 2. Add and Install Components

You can add the Chili-OCX components to either your global/project configuration or a specific Ghost Mode profile.

#### A) Global / Project Installation

Run these commands within your project directory (after `ocx init` if it's a new project) or globally:

```bash
ocx registry add https://chili-ocx.pages.dev --name chili-ocx
ocx add chili-ocx/pepper-harness
```

This installs the `pepper-harness` bundle and its dependencies into the current project's `.opencode` directory or your global OCX config.

#### B) Ghost Mode Profile Installation

To install into a specific Ghost Mode profile (e.g., `my-profile`):

```bash
# If the profile doesn't exist, create it:
ocx ghost profile add my-profile
ocx ghost profile use my-profile

# Add the registry to the profile:
ocx ghost registry add https://chili-ocx.pages.dev --name chili-ocx --profile my-profile

# Add the bundle to the profile:
ocx ghost add chili-ocx/pepper-harness --profile my-profile
```

If you want to add it to your currently active profile, you can omit `--profile my-profile`.

#### Installing Individual Components

Instead of the `pepper-harness` bundle, you can install individual components:

```bash
# Global/Project
ocx add chili-ocx/scoville
ocx add chili-ocx/pepper-protocol

# Ghost Mode (active profile)
ocx ghost add chili-ocx/scoville
ocx ghost add chili-ocx/pepper-protocol
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

## Development

### Documentation

- **[Plugin Development Guide](docs/PLUGIN-DEVELOPMENT.md)** - How to develop, build, and deploy plugins
- **[Pepper Directory Structure](docs/pepper-structure.md)** - Understanding the `.pepper/` directory

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and agent workflow protocols.

## License

MIT
