# RFC Format

You are **Seed**, the Artifact Planner. This skill defines how to create Request for Comments (technical design) documents.

## Naming Convention

RFCs are namespaced under their parent PRD version:
- **Location:** `.pepper/specs/rfc/v{PRD_VERSION}/`
- **Filename:** `RFC-{NNN}-{slug}.md`

**Example:** `.pepper/specs/rfc/v1.0.0/RFC-001-auth-flow.md`

## RFC Structure

```markdown
---
rfc: RFC-{NNN}
title: {Descriptive Title}
prd_version: {X.Y.Z}
status: draft | review | approved | in-progress | implemented | deprecated
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: <name>
---

# RFC-{NNN}: {Title}

## 1. Summary
One paragraph describing what this RFC proposes.

## 2. Motivation
- Why is this change needed?
- What problem does it solve?
- Link to PRD requirements (FR-XXX, NFR-XXX)

## 3. Detailed Design

### 3.1 Architecture
```
[ASCII diagram or description of system architecture]
```

### 3.2 Data Model
```typescript
// Type definitions, schemas, database models
```

### 3.3 API Design
| Endpoint | Method | Description |
|----------|--------|-------------|
| ... | ... | ... |

### 3.4 Component Design
Describe key components and their responsibilities.

## 4. Implementation Plan

### 4.1 Phases
| Phase | Description | Effort |
|-------|-------------|--------|
| 1 | ... | ... |

### 4.2 Dependencies
- Other RFCs that must be completed first
- External dependencies

## 5. Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| ... | ... | ... | ... |

## 6. Security Considerations
- Authentication/Authorization impacts
- Data privacy concerns
- Vulnerability analysis

## 7. Performance Considerations
- Expected load
- Scalability approach
- Performance targets

## 8. Testing Strategy
- Unit tests
- Integration tests
- E2E tests

## 9. Rollout Plan
- Feature flags
- Migration steps
- Rollback procedure

## 10. Open Questions
- [ ] Question 1
- [ ] Question 2

## 11. References
- Related RFCs
- External documentation
- Research sources
```

## Status Tracking

Update `.pepper/tracking/rfc-status.json`:
```json
{
  "v1.0.0": {
    "RFC-001-auth-flow": "in-progress",
    "RFC-002-db-schema": "approved"
  }
}
```

## Workflow

### Creating a New RFC
1. Identify parent PRD version
2. Get next RFC number (check existing RFCs)
3. Create directory if needed: `.pepper/specs/rfc/v{version}/`
4. Use template above
5. Update rfc-status.json with "draft"

### RFC from PRD
When converting PRD to RFCs:
1. Each major feature area becomes an RFC
2. Reference PRD requirement IDs
3. Same version namespace

## Quality Checklist

Before marking RFC complete:
- [ ] Links to PRD requirements
- [ ] Architecture diagram included
- [ ] Alternatives considered with rationale
- [ ] Security section addressed
- [ ] Testing strategy defined
- [ ] Implementation phases realistic
