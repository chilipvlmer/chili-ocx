# PRD Versioning

Semantic versioning for PRDs and RFC dependency tracking

## TL;DR

PRDs use semantic versioning (MAJOR.MINOR.PATCH). RFCs inherit PRD version and track implementation status.

## When to Use

- Creating new PRD versions
- Tracking RFC implementation status
- Managing PRD→RFC dependencies
- Determining when to bump version numbers

## PRD Versioning Scheme

### Format: `{project}-v{MAJOR}.{MINOR}.{PATCH}.md`

**Version Components:**

- **MAJOR**: Breaking changes to requirements or fundamental scope changes
- **MINOR**: New requirements or features added (backward-compatible)
- **PATCH**: Clarifications, typo fixes, documentation improvements

### Examples

```
my-project-v1.0.0.md    # Initial PRD
my-project-v1.1.0.md    # Added new feature requirements
my-project-v1.1.1.md    # Fixed typos and clarified requirements
my-project-v2.0.0.md    # Major scope change or requirement overhaul
```

## RFC Versioning

### Format: `.pepper/specs/rfc/v{PRD_VERSION}/RFC-{NNN}-{slug}.md`

RFCs inherit the PRD version they implement. This creates clear traceability between requirements and implementation plans.

**Example Directory Structure:**
```
.pepper/specs/rfc/
├── v1.0.0/
│   ├── RFC-001-authentication.md
│   ├── RFC-002-api-design.md
│   └── RFC-003-ui-framework.md
└── v1.1.0/
    └── RFC-004-new-feature.md
```

## RFC Status Tracking

### Status File: `.pepper/rfc-status.json`

```json
{
  "v1.0.0": {
    "RFC-001-authentication": "implemented",
    "RFC-002-api-design": "in-progress",
    "RFC-003-ui-framework": "pending"
  },
  "v1.1.0": {
    "RFC-004-new-feature": "pending"
  }
}
```

### Status Values

- `pending` - Not yet started
- `in-progress` - Currently being implemented
- `implemented` - Complete and verified
- `deprecated` - No longer applicable or superseded

## Version Bump Guidelines

### When to Bump MAJOR
- Removing or fundamentally changing existing requirements
- Complete redesign or architecture change
- Breaking changes that invalidate previous RFCs

### When to Bump MINOR
- Adding new requirements or features
- Expanding scope with new capabilities
- Adding new RFCs for additional functionality

### When to Bump PATCH
- Fixing typos or grammatical errors
- Clarifying ambiguous requirements without changing intent
- Formatting improvements or reorganization

## Best Practices

- Always start with `v1.0.0` for initial PRD
- Update RFC status file when implementation status changes
- Archive old PRD versions rather than deleting them
- Document version history in PRD changelog section
- Coordinate version bumps with team before publishing
