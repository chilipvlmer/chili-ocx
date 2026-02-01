# 🌶️ Chili-OCX

A pepper-themed AI coding harness for OpenCode. Specialized agents, structured planning, and persistent state management.

## What This Is

A **profile** and **bundle** — a complete AI coding harness available in two installation methods:

**Pepper Profile** (Recommended):
- 7 agents (Scoville, Seed, Sprout, Jalapeño, Chipotle, Habanero, Ghost)
- 14 skills (orchestration, planning, review protocols)
- 1 plugin (Pepper custom tools)
- 14 commands (PRD, RFC, planning, execution workflow)
- Fast 2-second refresh for updates
- Global availability across all projects

**Pepper-Harness Bundle** (Alternative):
- Same components as profile
- Install into project or global config
- Traditional OCX bundle installation

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

You can add the Chili-OCX components to either your global/project configuration or a specific OCX Profile.

#### A) Global / Project Installation

Run these commands within your project directory (after `ocx init` if it's a new project) or globally:

```bash
ocx registry add https://chili-ocx.pages.dev --name chili-ocx
ocx add chili-ocx/pepper-harness
```

This installs the `pepper-harness` bundle and its dependencies into the current project's `.opencode` directory or your global OCX config.

#### B) Profile Installation (Recommended - Global)

**NEW:** As of version 1.0.1, Chili-OCX provides a dedicated **profile** for easy installation and updates:

```bash
# 1. Add the registry (one-time setup)
ocx registry add https://chili-ocx.pages.dev --name chili-ocx --global

# 2. Install the pepper profile
ocx profile add pepper --from chili-ocx/pepper
```

This installs all 35 components (7 agents, 14 skills, 14 commands) into `~/.config/opencode/profiles/pepper/`.

To use the profile:
```bash
ocx oc -p pepper
# or
export OCX_PROFILE=pepper
ocx oc
```

**🚀 Fast Updates:** The profile method enables 5-second refresh:
```bash
# Update to latest version (< 2 seconds!)
ocx profile remove pepper && ocx profile add pepper --from chili-ocx/pepper
```

**Why use profiles?**
- ✅ **Instant updates** - No re-downloading 14 skills on every update
- ✅ **Clean installs** - Complete refresh in under 2 seconds
- ✅ **Global availability** - Use in any project with `-p pepper`
- ✅ **Isolated config** - Profile-specific tool permissions and MCP servers

**Migrating from Bundle?** See [MIGRATION.md](MIGRATION.md) for step-by-step instructions.

#### Installing Individual Components

Instead of the `pepper-harness` bundle, you can install individual components:

```bash
# Global/Project
ocx add chili-ocx/scoville
ocx add chili-ocx/pepper-protocol

# Profile (global)
ocx add chili-ocx/scoville --cwd ~/.config/opencode/profiles/my-profile
ocx add chili-ocx/pepper-protocol --cwd ~/.config/opencode/profiles/my-profile
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

## Troubleshooting

### Installation Issues

#### "Failed to add components" with --global

If `ocx add chili-ocx/pepper-harness --global` fails, check:

1. **Registry must be added to global config first**:
   ```bash
   # Check if chili-ocx is in your global config
   cat ~/.config/opencode/ocx.jsonc
   ```
   
   You should see:
   ```json
   "chili-ocx": {
     "url": "https://chili-ocx.pages.dev"
   }
   ```

2. **Common mistake: URL typo**:
   - Wrong: `https://chili-ovx.pages.dev` (missing 'c')
   - Correct: `https://chili-ocx.pages.dev`

3. **Add registry globally if missing**:
   ```bash
   ocx registry add https://chili-ocx.pages.dev --name chili-ocx --global
   ```

#### Understanding --global vs local installation

- `--global` flag: Installs to `~/.config/opencode/` (available in all projects)
- Without flag: Installs to current project's `.opencode/` directory
- **Important**: `--global` only works if the registry is configured in your global config

#### Verify installation

```bash
# Check installed components
ocx list --installed

# Search for chili-ocx components
ocx search chili-ocx
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

The Chili-OCX framework includes a powerful **Agent Skills** system that allows you to define complex, multi-step workflows as declarative Markdown files.

See **[Agent Skills Documentation](docs/SKILLS.md)** for details on creating and using skills.

| Skill | Purpose |
|-------|---------|
| `skill_git_mastery` | Advanced git workflow with secret scanning, conventional commits, and interactive confirmation |
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

### Plugin File

The `pepper-plugin` is distributed as a single file in the registry:
- `files/plugin/pepper-plugin.js` - Registry plugin bundle

The build script (`npm run build:plugin`) copies the bundle from `plugin/dist/bundle.js` to this location. This is the authoritative plugin file referenced by `registry.json`.

**Note:** For local profile testing, OpenCode has a hardcoded preference for `executable-commands.js`. See [AGENTS.md](../AGENTS.md#plugin-development--deployment) for details on profile-level plugin deployment.

## Development

### Documentation

- **[Plugin Development Guide](docs/PLUGIN-DEVELOPMENT.md)** - How to develop, build, and deploy plugins
- **[Pepper Directory Structure](docs/pepper-structure.md)** - Understanding the `.pepper/` directory

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and agent workflow protocols.

## License

MIT
