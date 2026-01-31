---
name: prd-format
description: PRD document structure, SemVer naming, and quality checklist for Seed
---

# PRD Format

You are **Seed**, the Artifact Planner. This skill defines how to create and structure Product Requirements Documents.

## Naming Convention

PRDs use Semantic Versioning: `{project}-v{MAJOR}.{MINOR}.{PATCH}.md`

| Version | Bump When... |
|---------|--------------|
| MAJOR | Breaking changes, complete re-architecture |
| MINOR | New features added (backward compatible) |
| PATCH | Clarifications, typos, formatting fixes |

**Location:** `.pepper/specs/prd/`

**Example:** `.pepper/specs/prd/my-app-v1.0.0.md`

## PRD Structure

```markdown
---
version: 1.0.0
status: draft | review | approved | superseded
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: <name>
---

# {Project Name} - Product Requirements Document

## 1. Overview
Brief description of the product/feature and its purpose.

## 2. Problem Statement
- What problem does this solve?
- Who experiences this problem?
- What's the impact of not solving it?

## 3. Goals & Success Metrics
| Goal | Metric | Target |
|------|--------|--------|
| ... | ... | ... |

## 4. User Stories
### 4.1 {Persona Name}
- As a {role}, I want {feature} so that {benefit}
- ...

## 5. Functional Requirements
### 5.1 {Feature Area}
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | ... | Must | ... |

## 6. Non-Functional Requirements
| ID | Category | Requirement |
|----|----------|-------------|
| NFR-001 | Performance | ... |
| NFR-002 | Security | ... |

## 7. Out of Scope
- What is explicitly NOT included
- ...

## 8. Dependencies
- External systems
- Other PRDs/RFCs
- Third-party services

## 9. Timeline
| Phase | Description | Target Date |
|-------|-------------|-------------|
| ... | ... | ... |

## 10. Open Questions
- [ ] Question 1
- [ ] Question 2
```

## Workflow

### Creating a New PRD
1. Check if `.pepper/specs/prd/` exists (create if not)
2. Determine version (v1.0.0 for new projects)
3. Use template above
4. Save as `{project}-v{version}.md`
5. Update `.pepper/state.json` with `active_spec` path

### Refining a PRD
1. Read existing PRD
2. Make requested changes
3. Bump PATCH version for small changes
4. Create new file with new version
5. Update frontmatter with new date

### Version Bumping
- **New feature section?** → MINOR bump
- **Breaking change to requirements?** → MAJOR bump
- **Clarifications only?** → PATCH bump

## Quality Checklist

Before marking PRD complete:
- [ ] All sections filled out
- [ ] No placeholder text remaining
- [ ] Success metrics are measurable
- [ ] User stories follow format
- [ ] Requirements have IDs and priorities
- [ ] Dependencies identified
- [ ] Open questions listed
