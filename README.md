# 🌶️ Chili-OCX

A pepper-themed AI coding harness for OpenCode. Specialized agents, structured planning, and persistent state management.

## What This Is

A **bundle** — a curated collection of components that work together:

- 7 agents (Scoville, Seed, Sprout, Jalapeño, Chipotle, Habanero, Ghost)
- 13 skills (orchestration, planning, review protocols)
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

You can add the Chili-OCX components to either your global/project configuration or a specific OCX Profile.

#### A) Global / Project Installation

Run these commands within your project directory (after `ocx init` if it's a new project) or globally:

```bash
ocx registry add https://chili-ocx.pages.dev --name chili-ocx
ocx add chili-ocx/pepper-harness
```

This installs the `pepper-harness` bundle and its dependencies into the current project's `.opencode` directory or your global OCX config.

#### B) Profile Installation (Global)

To install Chili-OCX into a global profile (so it's available in any project using that profile):

```bash
# 1. Create the profile (if it doesn't exist)
ocx profile add my-profile

# 2. Add the registry to the profile
ocx registry add https://chili-ocx.pages.dev --name chili-ocx --profile my-profile

# 3. Install the harness into the profile directory
# Note: We must explicitly target the profile directory
ocx add chili-ocx/pepper-harness --cwd ~/.config/opencode/profiles/my-profile
```

To use this profile, run OpenCode with:
```bash
ocx oc -p my-profile
# or
export OCX_PROFILE=my-profile
ocx oc
```

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
