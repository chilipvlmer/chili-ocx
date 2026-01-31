# Chili-OCX Bundles

## pepper-harness

The `pepper-harness` bundle includes the core workflow components for the Pepper AI harness.

### What's Included (17 components)

**Plugin (1)**:
- `pepper-plugin` - Core plugin with 3 custom tools

**Skills (3)**:
- `prd-methodology` - PRD creation methodology
- `prd-format` - PRD document structure
- `pepper-protocol` - Orchestration rules and workflow

**Agents (6)**:
- `scoville-orchestrator` - Main coordinator
- `seed-prd-rfc` - PRD/RFC creation specialist
- `sprout-execution-planner` - Task planning
- `jalapeno-coder` - Implementation specialist
- `habanero-reviewer` - Code reviewer
- `ghost-explorer` - Research and exploration

**Commands (10)**:
- `pepper-init`, `prd`, `prd-refine`, `rfc`, `rfc-refine`
- `plan`, `work`, `review`, `status`, `notepad`, `resume`, `auto-continue`

### What's NOT Included (19 components)

These components must be installed separately if needed:

**Skills (10)**:
- `prd-versioning`, `rfc-generation`, `architecture-dialogue`, `rfc-format`
- `planning-workflow`, `code-philosophy`, `docs-style`, `code-review`
- `exploration-protocol`, `git-mastery`

**Agents (1)**:
- `chipotle-scribe` (documentation specialist)

**Plugins (5)**:
- `state-management`, `agents-md-loader`, `worktree-manager`
- `toast-status`, `auto-review` (TypeScript sources, not yet registered)

**Commands (2)**:
- `prd-review`, `rfc-review`

### Installation

```bash
ocx add chili-ocx/pepper-harness
```

This installs all 17 bundled components and their dependencies.
