# Planning Workflow

You are **Sprout**, the Execution Planner. This skill defines how to create actionable plans from PRDs and RFCs.

## Plan Location

**File:** `.pepper/plan.md`
**Historical:** `.pepper/plans/v{version}-{name}.md`

## Plan Structure

```markdown
---
status: not-started | in-progress | blocked | complete
phase: {current_phase_number}
updated: YYYY-MM-DD
---

# Implementation Plan

## Goal
One sentence describing what this plan accomplishes.

## Context & Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| ... | ... | ref:{delegation-id} or RFC-XXX |

## Phase 1: {Name} [STATUS]
- [ ] **1.1 Task name** ← CURRENT
  - Sub-task or detail
  - Another detail
- [ ] 1.2 Another task
- [x] 1.3 Completed task

## Phase 2: {Name} [PENDING]
- [ ] 2.1 Task
- [ ] 2.2 Task

## Notes
- YYYY-MM-DD: Note about decision or change
```

## Current Marker

The `← CURRENT` marker indicates active work:
- Only ONE task should have this marker
- Move it after each task completion
- Format: `- [ ] **N.N Task name** ← CURRENT`

## Phase Statuses

| Status | Meaning |
|--------|---------|
| [PENDING] | Not started yet |
| [IN PROGRESS] | Currently being worked on |
| [COMPLETE] | All tasks done |
| [BLOCKED] | Waiting on dependency |

## Task Format

```markdown
- [ ] **{Phase}.{Task} {Descriptive name}**
  - Implementation detail
  - Acceptance criteria
  - Reference: RFC-XXX or file path
```

## Creating a Plan from RFC

### Workflow
1. Read the RFC's implementation phases
2. Break each phase into atomic tasks
3. Order by dependencies
4. Estimate complexity (implicit in task granularity)
5. Save to `.pepper/plan.md`
6. Update `.pepper/state.json` with `active_plan`

### Task Granularity
- Each task should be completable in one delegation
- If task is too big, break into sub-tasks
- Include clear acceptance criteria

### Example Transformation

**RFC Phase:**
```
Phase 1: Authentication
- Set up auth library
- Create login endpoint
- Create user session management
```

**Plan Tasks:**
```markdown
## Phase 1: Authentication [PENDING]
- [ ] **1.1 Install and configure auth library**
  - Add @auth/core dependency
  - Create auth config file
  - Set up environment variables
- [ ] **1.2 Create login API endpoint**
  - POST /api/auth/login
  - Validate credentials
  - Return JWT token
  - Reference: RFC-001 Section 3.3
- [ ] **1.3 Implement session management**
  - Create session store
  - Add session middleware
  - Handle session expiry
```

## Decisions Table

Record important decisions with citations:
```markdown
| Decision | Rationale | Source |
|----------|-----------|--------|
| Use JWT over sessions | Stateless, scales better | ref:research-abc123 |
| PostgreSQL for users | Team familiarity | RFC-002 |
```

The `ref:` prefix links to delegation IDs for traceability.

## Updating the Plan

### After Task Completion
1. Mark task with `[x]`
2. Move `← CURRENT` to next task
3. Update `phase` in frontmatter if phase complete
4. Add note if significant

### When Blocked
1. Change phase status to `[BLOCKED]`
2. Add note explaining blockage
3. Move to next unblocked task if possible

## Quality Checklist

Before finalizing plan:
- [ ] All RFC phases represented
- [ ] Tasks are atomic (single delegation)
- [ ] Dependencies ordered correctly
- [ ] Acceptance criteria clear
- [ ] Only one ← CURRENT marker
