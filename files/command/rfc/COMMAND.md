---
name: rfc
description: Create a new Request for Comments (technical design)
agent: seed
---

# Create RFC

The user wants to create a Request for Comments (technical design document).

**Your task (Seed):**

1. Check if `.pepper/` exists:
   - If not: Suggest running `/pepper-init` first

2. Check for active PRD in `.pepper/state.json`:
   - If PRD exists: Use it as context for the RFC
   - If no PRD: Proceed without (user doing technical-first approach)

3. Use the `rfc-generation` skill for the RFC structure

4. Conduct interview to gather:
   - Problem statement (link to PRD if exists)
   - Proposed solution overview
   - Technical architecture
   - Data models
   - API design
   - Security considerations
   - Performance requirements
   - Testing strategy
   - Deployment plan
   - Risks and mitigations
   - Alternatives considered

5. Create RFC at `.pepper/specs/rfc/{name}-v1.0.0.md`

6. Create initial status entry in `.pepper/tracking/rfc-status.json`:
   ```json
   {
     "{name}": {
       "version": "1.0.0",
       "status": "draft",
       "created": "2026-01-18",
       "last_updated": "2026-01-18"
     }
   }
   ```

7. Update `.pepper/state.json`:
   ```json
   {
     "active_spec": {
       "type": "rfc",
       "name": "{name}",
       "version": "1.0.0",
       "path": ".pepper/specs/rfc/{name}-v1.0.0.md"
     }
   }
   ```

8. Tell user to switch back to Scoville (TAB → scoville-orchestrator) to create execution plan

## Use the question tool for each section

Gather structured input for all RFC sections using the `question` tool.
