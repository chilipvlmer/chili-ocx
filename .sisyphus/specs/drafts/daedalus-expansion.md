# Draft: Daedalus oh-my-opencode Integration

## Requirements (confirmed)

### From Phase 1 (Daedalus Bundle - COMPLETED)
- Daedalus bundle built: 4 skills, 1 agent, 6 commands
- Current agent: 141 lines (needs expansion to ~500+ lines)
- Location: `files/agent/daedalus.md`
- Build verified: 18 components total

### Integration Requirements
- **Agent structure**: Solo agent (no companions)
- **Model selection**: User-configurable, no hardcoded model
- **Tool restrictions**: Write/edit only to `.sisyphus/specs/`
- **Prometheus handoff**: Manual (user calls `/plan-from-rfc`)
- **Hook required**: Yes, create `daedalus-specs-only` hook
- **Location**: Keep in chili-ocx as OCX bundle

## Technical Decisions

### Review Approach: Option B - Create "Theseus" Reviewer
- PRDs and RFCs have fundamentally different success criteria than work plans
- Momus is plan-specific (hardcoded to `.sisyphus/plans/*.md`)
- Theseus will have PRD/RFC-appropriate criteria:
  - User stories complete
  - Success metrics defined
  - Scope boundaries explicit
  - Stakeholder concerns addressed

### Metis Integration
- Metis is GENERIC enough to reuse as-is
- Will call Metis for pre-PRD gap analysis
- Same invocation pattern as Prometheus uses

### File Structure
- PRDs: `.sisyphus/specs/prd/`
- RFCs: `.sisyphus/specs/rfc/`
- Drafts: `.sisyphus/specs/drafts/`

## Research Findings

### Prometheus Analysis (989 lines)
- Intent classification (7 types with specific strategies)
- Interview mode with draft persistence
- Metis consultation before plan generation
- Momus review loop for high accuracy
- Model configuration (user-selectable)
- Hook integration (`prometheus-md-only`)

### OCX Constraints
- Agents are markdown files with YAML frontmatter
- No direct TypeScript config (unlike oh-my-opencode agents)
- Skills referenced by name, not embedded
- Model selection: OCX chooses, but can specify preferences

## Open Questions
- None remaining - all decisions made

## Scope Boundaries

### INCLUDE
1. Expand `daedalus.md` to ~500+ lines with Prometheus-like structure
2. Add intent classification (PRD creation, RFC conversion, review modes)
3. Add Metis integration for pre-PRD analysis
4. Add interview mode with draft persistence (`.sisyphus/specs/drafts/`)
5. Add quality scoring with user-decides philosophy
6. Create Theseus agent for PRD/RFC review
7. Create `daedalus-specs-only` hook
8. Update registry.jsonc with new components
9. Update existing commands to reference new paths

### EXCLUDE
- Modifying oh-my-opencode source code
- Creating Prometheus as OCX (already exists in oh-my-opencode)
- Automated Prometheus handoff (user manually calls `/plan-from-rfc`)
- Model hardcoding (user selects via OCX config)

## Artifacts Created
- This draft: `.sisyphus/specs/drafts/daedalus-expansion.md`

---
*Last updated: 2026-01-13*
*Session: Daedalus oh-my-opencode integration planning*
