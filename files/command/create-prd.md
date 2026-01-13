---
name: create-prd
description: Create a new PRD using 10-phase methodology
---

# /create-prd

Create a new Product Requirements Document through an interactive 10-phase interview process.

## Usage

```bash
/create-prd <project-name>
```

## Arguments

**Required:**
- `<project-name>`: Name of the project for which to create a PRD

## Behavior

Routes to the **Daedalus** agent which orchestrates the complete PRD creation workflow:

1. **Loads prd-methodology skill** - Guides through 10-phase interview process
2. **Phase-by-phase interview** - Conducts comprehensive requirements gathering:
   - Phase 1: Project Discovery
   - Phase 2: Problem Statement & Business Objectives
   - Phase 3: User Stories & Requirements
   - Phase 4: Functional Specifications
   - Phase 5: Acceptance Criteria
   - Phase 6: Technical Specifications
   - Phase 7: UX & Workflow Design
   - Phase 8: Non-Functional Requirements
   - Phase 9: Dependencies, Risks & Assumptions
   - Phase 10: Implementation Planning
3. **Quality validation** - Assesses PRD against 5 quality dimensions (target: 7.5+/10)
4. **Document generation** - Creates structured PRD at specified path
5. **State persistence** - Saves progress for resumption if interrupted

## Output

**Draft Output:**
- Draft PRD: `.sisyphus/specs/drafts/{project-name}.md` (during interview process)

**Final Output:**
- Final PRD: `.sisyphus/specs/prd/{project-name}-v1.0.0.md`

**Supporting Files:**
- State file (if process interrupted): `.sisyphus/prd-state.json`

**High Accuracy Mode:**
- Optional: Request Theseus review for enhanced quality validation and expert feedback on the generated PRD

## Expected Timeline

- **Time commitment**: 2-4 hours for full template
- **Interactive process**: 3-5 questions per phase (50+ total questions)
- **Quality-focused**: User decides whether to proceed based on quality scores

## Next Steps

After PRD creation, use:
- `/prd-to-rfc` - Convert PRD to technical RFC specifications
- `/review-prd` - Get quality assessment and improvement suggestions
