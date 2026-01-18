---
name: prd
description: Create a new Product Requirements Document
agent: seed
---

# Create PRD

The user wants to create a new Product Requirements Document.

**Your task (Seed):**

1. Check if `.pepper/` exists:
   - If not: Suggest running `/pepper-init` first
   
2. Use the `prd-methodology` skill for the 10-phase interview process

3. Create the PRD at `.pepper/specs/prd/{name}-v1.0.0.md`

4. Update `.pepper/state.json`:
   ```json
   {
     "active_spec": {
       "type": "prd",
       "name": "{name}",
       "version": "1.0.0",
       "path": ".pepper/specs/prd/{name}-v1.0.0.md"
     }
   }
   ```

5. After completion, tell user to switch back to Scoville (TAB → scoville-orchestrator) to decide next steps

## Interview Process

Follow the 10-phase methodology from the `prd-methodology` skill:
1. Vision & Problem
2. Success Metrics  
3. User Personas
4. Core Features
5. User Flows
6. Technical Constraints
7. Risks & Mitigations
8. Timeline & Milestones
9. Dependencies
10. Review & Finalize

Use the `question` tool for each phase to gather structured input.
