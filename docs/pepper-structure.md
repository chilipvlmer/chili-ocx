# .pepper/ Directory Structure

This is the project-local state directory for the Chili-OCX harness.

## Structure

```
.pepper/
├── specs/
│   ├── prd/
│   │   └── {project}-v{MAJOR}.{MINOR}.{PATCH}.md
│   └── rfc/
│       └── v{X.Y.Z}/
│           └── RFC-{NNN}-{slug}.md
├── tracking/
│   └── rfc-status.json
├── plans/
│   └── v{X.Y.Z}-execution-plan.md
├── plan.md              # Living document with ← CURRENT marker
├── state.json           # Session coordination
├── notepad/
│   ├── learnings.json
│   ├── issues.json
│   └── decisions.json
└── drafts/              # WIP artifacts
```

## Files

### plan.md

The active execution plan with Markdown + Zod schema validation.
Uses `← CURRENT` marker to track progress.

```markdown
## Phase 1: Setup
- [x] Task 1.1: Initialize project
- [ ] Task 1.2: Configure dependencies ← CURRENT
- [ ] Task 1.3: Create base structure
```

### state.json

Session coordination and workspace tracking (v1.1.0):

```json
{
  "version": "1.1.0",
  "initialized": "2026-01-20T20:16:00.000Z",
  "workspacePath": {
    "symlink": null,
    "real": "/path/to/project",
    "isSymlink": false,
    "resolvedAt": "2026-01-20T21:54:00.000Z"
  },
  "session_ids": [],
  "auto_continue": false
}
```

**Fields:**
- `version` - State schema version (current: 1.1.0)
- `initialized` - When .pepper/ was first created
- `workspacePath` - Resolved workspace paths (handles symlinks like Profile mode)
  - `symlink` - Symlink path if workspace is symlinked, null otherwise
  - `real` - Real filesystem path (always present)
  - `isSymlink` - Boolean flag
  - `resolvedAt` - When path was resolved
- `session_ids` - Array of active session IDs
- `auto_continue` - Auto-continue mode flag

### notepad/

Persistent memory across sessions:

- **learnings.json** - Discovered patterns and insights
- **issues.json** - Failed attempts, gotchas, blockers
- **decisions.json** - Architecture choices and rationale

### specs/

Versioned specification documents:

- **prd/** - Product Requirements Documents
- **rfc/** - Request for Comments (technical specs)

### tracking/

Status tracking for artifacts:

- **rfc-status.json** - RFC lifecycle states (draft → review → approved → implemented)

### drafts/

Work-in-progress artifacts before they are finalized and versioned.

## Initialization

The `.pepper/` directory is created by the `pepper-init` command:

```bash
/pepper-init
```

This creates the full structure with empty JSON files and initial state.

## Gitignore Recommendations

Add to your `.gitignore`:

```
# Keep specs and plans versioned
!.pepper/specs/
!.pepper/plans/

# Ignore transient state
.pepper/state.json
.pepper/drafts/
```
