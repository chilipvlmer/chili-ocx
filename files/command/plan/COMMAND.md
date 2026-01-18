---
name: plan
description: Create execution plan from RFC
agent: sprout
---

# Create Execution Plan

The user wants to create an actionable execution plan from an RFC.

**Your task (Sprout):**

1. Check for active RFC in `.pepper/state.json`:
   - If no RFC: Tell user to create one first (`/rfc`)
   
2. Read the RFC document

3. Analyze the RFC and break it down into phases and tasks:
   - **Phase 1**: Foundation (setup, infrastructure)
   - **Phase 2**: Core Implementation (main features)
   - **Phase 3**: Integration (connecting pieces)
   - **Phase 4**: Testing & Quality (tests, docs, review)
   - **Phase 5**: Deployment (release preparation)

4. For each task, specify:
   - Clear, actionable description
   - Estimated complexity (S/M/L)
   - Dependencies (if any)
   - Suggested agent (Jalapeño, Chipotle, etc.)

5. Create plan at `.pepper/plan.md` with format:
   ```markdown
   # Execution Plan: {rfc-name}
   
   Based on: RFC {name} v{version}
   Created: {date}
   
   ## Phase 1: Foundation
   
   - [ ] Set up project structure (S)
   - [ ] Configure build system (M)
   - [ ] Initialize database schema (M) ← CURRENT
   - [ ] Set up testing framework (S)
   
   ## Phase 2: Core Implementation
   ...
   ```

6. Mark the first task with `← CURRENT`

7. Update `.pepper/state.json` to indicate plan exists

8. Tell user they can now use `/work` to start execution or switch back to Scoville

## Task Format

```markdown
- [ ] Task description (complexity) [agent-hint] ← CURRENT
```

- `[ ]` = pending
- `[x]` = completed
- `(S)` = Small (1-2 hours)
- `(M)` = Medium (half day)
- `(L)` = Large (full day+)
- `[agent-hint]` = Suggested agent (optional)
- `← CURRENT` = Current task marker
