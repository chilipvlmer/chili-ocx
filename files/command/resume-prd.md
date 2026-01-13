---
name: resume-prd
description: Resume interrupted PRD creation workflow
---

# /resume-prd

Resume an interrupted PRD creation workflow.

## Usage

```
/resume-prd [project-name]
```

## Arguments

- `project-name` (optional): Project to resume. If omitted, shows available projects with saved state.

## Behavior

1. Reads state from `.sisyphus/specs/drafts/`
2. If no argument provided: lists all projects with saved state
3. Resumes Daedalus agent at the saved phase
4. **Cannot jump phases** - workflow resumes sequentially from saved checkpoint

## State File Format

`.sisyphus/specs/drafts/{project-name}.json`:

```json
{
  "my-project": {
    "version": "1.0.0",
    "currentPhase": 4,
    "completedPhases": [1, 2, 3],
    "partialContent": "...",
    "lastUpdated": "2026-01-13T10:30:00Z"
  }
}
```

## Output

- Continues PRD creation at the saved phase
- Updates state file on each phase completion
- Follows standard 10-phase workflow from prd-methodology skill

## Example

```
User: /resume-prd ecommerce-platform
Daedalus: Resuming PRD creation for 'ecommerce-platform' at Phase 4: Functional Requirements...
```

## Notes

- State is automatically saved after each phase completion
- Sequential workflow enforcement prevents skipping phases
- Use `/prd` command to start a new PRD from scratch
