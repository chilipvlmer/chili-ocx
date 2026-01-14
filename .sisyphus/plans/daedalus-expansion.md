# Daedalus oh-my-opencode Integration

## Context

### Original Request
Expand the Daedalus OCX agent for better oh-my-opencode integration. Transform a 141-line basic agent into a ~500-600 line sophisticated agent matching Prometheus's quality, with Theseus reviewer agent and specs-only hook.

### Interview Summary
**Key Discussions**:
- Agent structure: Solo agent (no companions), but reuse Metis for gap analysis
- Model selection: User-configurable via OCX, no hardcoding
- Tool restrictions: Write/edit only to `.sisyphus/specs/`
- Prometheus handoff: Manual (user calls `/plan-from-rfc`)
- Review approach: Create "Theseus" agent (PRD/RFC-specific reviewer, like Momus for plans)

**Research Findings**:
- Prometheus prompt: 989 lines with intent classification, interview mode, Metis/Momus integration
- Momus pattern: Optional "high accuracy" mode, OKAY/REJECT loop until approved
- prometheus-md-only hook: 135 lines TypeScript, validates `.sisyphus/*.md` paths
- Metis: Generic gap analysis, reusable without modification

### Metis Review
**Identified Gaps** (addressed):
- Theseus scope: Review-only, no editing, no interview mode
- Draft promotion: Theseus OKAY triggers move from drafts/ to prd/ or rfc/
- Skip steps: Theseus is optional (user chooses "high accuracy")
- Metis timing: At beginning for gap analysis, same as Prometheus

---

## Work Objectives

### Core Objective
Expand Daedalus from 141 to ~500-600 lines with Prometheus-like sophistication, create Theseus reviewer agent, and create daedalus-specs-only hook for file path enforcement.

### Concrete Deliverables
- `files/agent/daedalus.md` - Expanded from 141 to ~500-600 lines
- `files/agent/theseus.md` - New PRD/RFC reviewer agent (~150-200 lines)
- `files/hook/daedalus-specs-only/` - Hook to enforce `.sisyphus/specs/` writes
- Updated `registry.jsonc` - Add Theseus agent and hook
- Updated commands - New file paths (`.sisyphus/specs/prd/`, `.sisyphus/specs/rfc/`, `.sisyphus/specs/drafts/`)

### Definition of Done
- [ ] `bunx ocx build . --out dist` succeeds with new components
- [ ] daedalus.md is 500-600 lines with intent classification, interview mode, Metis integration, Theseus loop
- [ ] theseus.md is 150-200 lines with OKAY/REJECT review pattern
- [ ] Hook validates paths match `.sisyphus/specs/**/*.md`
- [ ] All 6 existing commands updated with new paths

### Must Have
- Intent classification (max 5 types): New PRD, Refine PRD, PRD→RFC, Review, Resume
- Interview mode with draft persistence to `.sisyphus/specs/drafts/`
- Metis integration at session start (non-blocking gap analysis)
- "High accuracy" mode that invokes Theseus review loop
- Theseus OKAY triggers draft promotion to final location
- Hook enforcement of `.sisyphus/specs/` path restriction

### Must NOT Have (Guardrails)
- Theseus MUST NOT edit documents - only review and return OKAY/REJECT
- Theseus MUST NOT have interview mode or stateful sessions
- Max 5 intent types - no sub-types or nesting
- Single template per doc type - no variants
- No complex draft versioning/archiving - simple promotion on OKAY
- Metis is non-blocking - doesn't prevent document creation
- Daedalus line count: 500-600 lines - not 1000+
- No code generation - only spec documents

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (OCX bundle, no test framework)
- **User wants tests**: Manual verification
- **QA approach**: Structural verification + build validation

### Manual QA Procedures
Each TODO includes:
1. File existence verification
2. Line count verification
3. Required section/pattern verification
4. Build verification via `bunx ocx build . --out dist`

---

## Task Flow

```
Phase 0: Pre-flight
    └── Task 0.1: Verify current state

Phase 1: Expand Daedalus Agent
    └── Task 1.1: Add intent classification
    └── Task 1.2: Add interview mode with draft persistence
    └── Task 1.3: Add Metis integration
    └── Task 1.4: Add Theseus "high accuracy" loop
    └── Task 1.5: Update file paths and forbidden actions

Phase 2: Create Theseus Agent (parallel with Phase 1 completion)
    └── Task 2.1: Create theseus.md

Phase 3: Create Hook
    └── Task 3.1: Create daedalus-specs-only hook

Phase 4: Update Commands (parallel)
    └── Task 4.1: Update create-prd.md
    └── Task 4.2: Update review-prd.md
    └── Task 4.3: Update prd-to-rfc.md
    └── Task 4.4: Update review-rfc.md
    └── Task 4.5: Update plan-from-rfc.md
    └── Task 4.6: Update resume-prd.md

Phase 5: Registry & Verification
    └── Task 5.1: Update registry.jsonc
    └── Task 5.2: Final build verification
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 4.1-4.6 | Independent command files |

| Task | Depends On | Reason |
|------|------------|--------|
| 1.2 | 1.1 | Interview mode uses intent classification |
| 1.3 | 1.2 | Metis integrates with interview flow |
| 1.4 | 1.3 | Theseus loop follows Metis pattern |
| 1.5 | 1.4 | Final cleanup after all additions |
| 2.1 | 1.4 | Theseus agent matches Daedalus invocation pattern |
| 3.1 | 2.1 | Hook needs to know agent names |
| 5.1 | 2.1, 3.1, 4.* | Registry needs all components |
| 5.2 | 5.1 | Build verification is final step |

---

## TODOs

### Phase 0: Pre-flight

- [ ] 0.1 Verify current state and file locations

  **What to do**:
  - Verify ghost session has correct files
  - Confirm daedalus.md exists at expected path
  - List all command files
  - Check registry.jsonc has Daedalus bundle

  **Must NOT do**:
  - Modify any files yet

  **Parallelizable**: NO (first task)

  **References**:
  - `files/agent/daedalus.md` - Current 141-line agent to expand
  - `files/command/*.md` - 6 command files to update
  - `registry.jsonc:107-203` - Current Daedalus bundle registration

  **Acceptance Criteria**:
  - [ ] `ls files/agent/daedalus.md` shows file exists
  - [ ] `ls files/command/` shows 6 .md files
  - [ ] `grep -c "daedalus" registry.jsonc` returns 4+ matches

  **Commit**: NO (verification only)

---

### Phase 1: Expand Daedalus Agent

- [ ] 1.1 Add intent classification to daedalus.md

  **What to do**:
  - Add "## Step 0: Intent Classification" section after Role section
  - Define 5 intent types with signals and interview focus:
    1. **New PRD** - "create prd", "new prd", greenfield requirements
    2. **Refine PRD** - "improve", "update", existing PRD path provided
    3. **PRD→RFC** - "convert", "generate rfc", PRD path provided
    4. **Review** - "review", "check", "assess" with document path
    5. **Resume** - "continue", "resume", interrupted session
  - Add complexity assessment (Trivial/Simple/Complex)
  - Add intent-specific interview strategies for each type

  **Must NOT do**:
  - Create more than 5 intent types
  - Add sub-types or nested intents
  - Copy Prometheus plan-specific intents (Refactoring, Architecture, Research)

  **Parallelizable**: NO (first expansion task)

  **References**:
  **Pattern References**:
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/prometheus-prompt.ts:194-218` - Intent classification structure (7 types with signals and interview focus table)
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/prometheus-prompt.ts:210-218` - Complexity assessment (Trivial/Simple/Complex)
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/prometheus-prompt.ts:222-305` - Intent-specific interview strategies format
  
  **Current File**:
  - `files/agent/daedalus.md:1-141` - Current agent to expand (insert after line 23)

  **Acceptance Criteria**:
  - [ ] File contains "## Step 0: Intent Classification" section
  - [ ] Contains exactly 5 intent types: New PRD, Refine PRD, PRD→RFC, Review, Resume
  - [ ] Each intent has: Signal, Interview Focus columns
  - [ ] Contains complexity assessment table (Trivial/Simple/Complex)
  - [ ] Line count increased by ~80-100 lines

  **Commit**: NO (groups with 1.2-1.5)

---

- [ ] 1.2 Add interview mode with draft persistence

  **What to do**:
  - Add "## Interview Mode (Default)" section
  - Add draft persistence rules:
    - Draft location: `.sisyphus/specs/drafts/{name}.md`
    - Update triggers: After every meaningful response, after research results
    - Draft structure template (Requirements, Decisions, Findings, Open Questions)
  - Add interview guidelines for PRD creation:
    - Phase-by-phase questioning (reference prd-methodology skill)
    - Adaptive questioning based on user responses
    - Research delegation to explore/librarian agents
  - Add "NEVER skip draft updates" rule

  **Must NOT do**:
  - Build complex draft versioning system
  - Add draft archiving functionality
  - Create multiple draft templates

  **Parallelizable**: NO (depends on 1.1)

  **References**:
  **Pattern References**:
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/prometheus-prompt.ts:139-185` - Draft persistence rules and structure template
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/prometheus-prompt.ts:269-305` - Build from scratch interview example with research delegation
  
  **Current Skills**:
  - `files/skill/prd-methodology/SKILL.md` - 10-phase workflow to reference for interview questions

  **Acceptance Criteria**:
  - [ ] Contains "## Interview Mode (Default)" section
  - [ ] Draft location specified as `.sisyphus/specs/drafts/{name}.md`
  - [ ] Draft structure template with 4+ sections
  - [ ] Contains "NEVER skip draft updates" or similar rule
  - [ ] References prd-methodology skill for phase questions
  - [ ] Line count increased by ~60-80 lines

  **Commit**: NO (groups with 1.1, 1.3-1.5)

---

- [ ] 1.3 Add Metis integration

  **What to do**:
  - Add "## Pre-Document Generation: Metis Consultation" section
  - Add Metis invocation pattern (before PRD/RFC generation):
    ```typescript
    sisyphus_task(
      agent="Metis (Plan Consultant)",
      prompt=`Review this session before I generate the document:
      **User's Goal**: {summarize}
      **What We Discussed**: {key points}
      Please identify: Questions missed, guardrails needed...`,
      background=false
    )
    ```
  - Add post-Metis workflow: Present findings → Ask final questions → Confirm guardrails
  - Emphasize Metis is non-blocking (consultation, not gate)

  **Must NOT do**:
  - Make Metis a blocking dependency
  - Skip document creation if Metis fails
  - Create Daedalus-specific Metis agent

  **Parallelizable**: NO (depends on 1.2)

  **References**:
  **Pattern References**:
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/prometheus-prompt.ts:556-578` - Metis consultation pattern and prompt template
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/prometheus-prompt.ts:582-597` - Post-Metis workflow (present findings, ask questions, confirm)

  **Acceptance Criteria**:
  - [ ] Contains "Metis Consultation" section
  - [ ] Shows sisyphus_task invocation with agent="Metis (Plan Consultant)"
  - [ ] Prompt template includes User's Goal and What We Discussed
  - [ ] States Metis is non-blocking/optional
  - [ ] Line count increased by ~40-50 lines

  **Commit**: NO (groups with 1.1-1.2, 1.4-1.5)

---

- [ ] 1.4 Add Theseus "high accuracy" loop

  **What to do**:
  - Add "## High Accuracy Mode: Theseus Review" section
  - Add the critical question prompt:
    ```
    "Do you need high accuracy?
    If yes, I'll have Theseus (our spec reviewer) verify the document.
    Theseus won't approve until the PRD/RFC meets all quality criteria.
    If no, I'll save the document directly."
    ```
  - Add Theseus review loop pattern:
    ```typescript
    while (true) {
      const result = sisyphus_task(
        agent="Theseus (Spec Reviewer)",
        prompt=".sisyphus/specs/drafts/{name}.md",
        background=false
      )
      if (result.verdict === "OKAY") {
        // Move to final location
        break
      }
      // Fix issues and resubmit
    }
    ```
  - Add rules: Fix every issue, keep looping until OKAY, no excuses
  - Add draft promotion logic: On OKAY, move from drafts/ to prd/ or rfc/

  **Must NOT do**:
  - Skip the loop if Theseus rejects
  - Auto-approve without Theseus OKAY in high accuracy mode
  - Limit retry count

  **Parallelizable**: NO (depends on 1.3)

  **References**:
  **Pattern References**:
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/prometheus-prompt.ts:588-598` - High accuracy question prompt
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/prometheus-prompt.ts:604-670` - Momus review loop pattern and critical rules
  
  **Key Adaptation**:
  - Change "Momus (Plan Reviewer)" → "Theseus (Spec Reviewer)"
  - Change ".sisyphus/plans/" → ".sisyphus/specs/drafts/"
  - Add draft promotion step after OKAY

  **Acceptance Criteria**:
  - [ ] Contains "High Accuracy Mode" section
  - [ ] Shows "Do you need high accuracy?" prompt
  - [ ] Shows sisyphus_task with agent="Theseus (Spec Reviewer)"
  - [ ] Loop continues until result.verdict === "OKAY"
  - [ ] Contains draft promotion logic (drafts/ → prd/ or rfc/)
  - [ ] Line count increased by ~60-70 lines

  **Commit**: NO (groups with 1.1-1.3, 1.5)

---

- [ ] 1.5 Update file paths and forbidden actions

  **What to do**:
  - Update File Output Convention section with new paths:
    - Drafts: `.sisyphus/specs/drafts/{name}.md`
    - PRDs: `.sisyphus/specs/prd/{project}-v{version}.md`
    - RFCs: `.sisyphus/specs/rfc/v{version}/RFC-{NNN}-{slug}.md`
  - Update FORBIDDEN ACTIONS:
    - Add: "NEVER modify files outside `.sisyphus/specs/` directory"
    - Add: "NEVER skip Theseus loop in high accuracy mode"
    - Add: "NEVER auto-promote drafts without user approval or Theseus OKAY"
  - Update Communication Style with Prometheus-like patterns
  - Verify total line count is 500-600 lines

  **Must NOT do**:
  - Change existing skill references
  - Remove quality framework section
  - Exceed 600 lines

  **Parallelizable**: NO (depends on 1.4)

  **References**:
  **Current File**:
  - `files/agent/daedalus.md:69-84` - Current File Output Convention section
  - `files/agent/daedalus.md:124-133` - Current FORBIDDEN ACTIONS section

  **Acceptance Criteria**:
  - [ ] Drafts path: `.sisyphus/specs/drafts/`
  - [ ] PRDs path: `.sisyphus/specs/prd/`
  - [ ] RFCs path: `.sisyphus/specs/rfc/`
  - [ ] FORBIDDEN ACTIONS includes "outside `.sisyphus/specs/`"
  - [ ] Total line count: 500-600 lines
  - [ ] `wc -l files/agent/daedalus.md` returns value in range

  **Commit**: YES
  - Message: `feat(daedalus): expand agent with intent classification, interview mode, Metis/Theseus integration`
  - Files: `files/agent/daedalus.md`
  - Pre-commit: Line count verification

---

### Phase 2: Create Theseus Agent

- [ ] 2.1 Create theseus.md agent

  **What to do**:
  - Create `files/agent/theseus.md` with YAML frontmatter:
    ```yaml
    ---
    description: PRD/RFC Spec Reviewer - validates specification quality
    mode: subagent
    ---
    ```
  - Add role description: Review PRDs/RFCs, return OKAY/REJECT with feedback
  - Add review criteria sections:
    - PRD Review Criteria (5 dimensions from prd-methodology)
    - RFC Review Criteria (12-section completeness, technical accuracy)
  - Add OKAY Requirements (all must be met):
    - 100% required sections present
    - Quality score ≥7.5/10 (PRD) or all 12 sections complete (RFC)
    - No critical gaps in requirements
    - Clear scope boundaries
  - Add output format: `**[OKAY / REJECT]**` with findings
  - Add FORBIDDEN ACTIONS: Never edit, never create, only review

  **Must NOT do**:
  - Add interview mode
  - Add stateful sessions
  - Allow editing documents
  - Create complex scoring beyond existing frameworks

  **Parallelizable**: NO (depends on 1.4 for invocation pattern)

  **References**:
  **Pattern References**:
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/momus.ts:1-376` - Momus agent structure (adapt for PRD/RFC review)
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/momus.ts:304-327` - OKAY Requirements pattern
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/agents/momus.ts:327` - Output format `**[OKAY / REJECT]**`
  
  **Content References**:
  - `files/skill/prd-methodology/SKILL.md` - PRD quality criteria (5 dimensions)
  - `files/skill/rfc-generation/SKILL.md` - RFC 12-section structure

  **Acceptance Criteria**:
  - [ ] File exists at `files/agent/theseus.md`
  - [ ] YAML frontmatter with description and mode: subagent
  - [ ] Contains PRD Review Criteria section (5 dimensions)
  - [ ] Contains RFC Review Criteria section (12 sections)
  - [ ] Contains OKAY Requirements section
  - [ ] Contains `**[OKAY / REJECT]**` output format
  - [ ] Contains FORBIDDEN ACTIONS (never edit, only review)
  - [ ] Line count: 150-200 lines
  - [ ] `wc -l files/agent/theseus.md` returns value in range

  **Commit**: YES
  - Message: `feat(theseus): add PRD/RFC spec reviewer agent`
  - Files: `files/agent/theseus.md`
  - Pre-commit: Line count verification

---

### Phase 3: Create Hook

- [ ] 3.1 Create daedalus-specs-only hook

  **What to do**:
  - Create directory: `files/hook/daedalus-specs-only/`
  - Create `index.ts` with:
    - Export createDaedalusSpecsOnlyHook function
    - Hook into "tool.execute.before" event
    - Check if agent is "Daedalus" or "Theseus"
    - For Write/Edit tools, validate path matches `.sisyphus/specs/**/*.md`
    - Block writes outside `.sisyphus/specs/` with clear error message
    - Allow reads anywhere (read-only operations)
  - Create `constants.ts` with:
    - HOOK_NAME = "daedalus-specs-only"
    - DAEDALUS_AGENTS = ["Daedalus", "Theseus (Spec Reviewer)"]
    - ALLOWED_PATH_PREFIX = ".sisyphus/specs"
    - BLOCKED_TOOLS = ["Write", "Edit", "write", "edit"]
  - Ensure Theseus is blocked from ALL writes (review only)

  **Must NOT do**:
  - Block read operations
  - Affect other agents
  - Use hardcoded absolute paths

  **Parallelizable**: NO (depends on 2.1 for agent names)

  **References**:
  **Pattern References**:
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/hooks/prometheus-md-only/index.ts:1-135` - Hook implementation pattern
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/hooks/prometheus-md-only/index.ts:20-47` - isAllowedFile() cross-platform path validator
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/hooks/prometheus-md-only/index.ts:75-134` - Hook function structure
  - `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/oh-my-opencode-dev/src/hooks/prometheus-md-only/constants.ts:1-31` - Constants file pattern

  **Key Adaptation**:
  - Change PROMETHEUS_AGENTS → DAEDALUS_AGENTS
  - Change ALLOWED_PATH_PREFIX from ".sisyphus" → ".sisyphus/specs"
  - Add special rule: Theseus blocked from ALL writes (not just non-.sisyphus)

  **Acceptance Criteria**:
  - [ ] Directory exists: `files/hook/daedalus-specs-only/`
  - [ ] `index.ts` exports createDaedalusSpecsOnlyHook function
  - [ ] `constants.ts` defines DAEDALUS_AGENTS with both agent names
  - [ ] Path validation checks for `.sisyphus/specs/`
  - [ ] Theseus is blocked from ALL writes
  - [ ] Error message explains restriction clearly

  **Commit**: YES
  - Message: `feat(hook): add daedalus-specs-only path enforcement`
  - Files: `files/hook/daedalus-specs-only/index.ts`, `files/hook/daedalus-specs-only/constants.ts`
  - Pre-commit: TypeScript syntax check

---

### Phase 4: Update Commands

- [ ] 4.1 Update create-prd.md with new paths

  **What to do**:
  - Update Output section paths:
    - Draft: `.sisyphus/specs/drafts/{project-name}.md`
    - Final: `.sisyphus/specs/prd/{project-name}-v1.0.0.md`
  - Add mention of "high accuracy" option
  - Reference Theseus for quality verification

  **Must NOT do**:
  - Change command name or arguments
  - Remove existing functionality

  **Parallelizable**: YES (with 4.2-4.6)

  **References**:
  - `files/command/create-prd.md` - Current command file

  **Acceptance Criteria**:
  - [ ] Contains `.sisyphus/specs/drafts/` path
  - [ ] Contains `.sisyphus/specs/prd/` path
  - [ ] Mentions "high accuracy" or Theseus review

  **Commit**: NO (groups with 4.2-4.6)

---

- [ ] 4.2 Update review-prd.md with new paths

  **What to do**:
  - Update file path examples to use `.sisyphus/specs/prd/`
  - Clarify this is separate from Theseus (Theseus is automatic in high accuracy mode)

  **Parallelizable**: YES (with 4.1, 4.3-4.6)

  **References**:
  - `files/command/review-prd.md` - Current command file

  **Acceptance Criteria**:
  - [ ] Path examples use `.sisyphus/specs/prd/`

  **Commit**: NO (groups with 4.1, 4.3-4.6)

---

- [ ] 4.3 Update prd-to-rfc.md with new paths

  **What to do**:
  - Update input path: `.sisyphus/specs/prd/`
  - Update output path: `.sisyphus/specs/rfc/v{version}/`
  - Add mention of "high accuracy" for RFC generation

  **Parallelizable**: YES (with 4.1-4.2, 4.4-4.6)

  **References**:
  - `files/command/prd-to-rfc.md` - Current command file

  **Acceptance Criteria**:
  - [ ] Input path: `.sisyphus/specs/prd/`
  - [ ] Output path: `.sisyphus/specs/rfc/`

  **Commit**: NO (groups with 4.1-4.2, 4.4-4.6)

---

- [ ] 4.4 Update review-rfc.md with new paths

  **What to do**:
  - Update file path examples to use `.sisyphus/specs/rfc/`

  **Parallelizable**: YES (with 4.1-4.3, 4.5-4.6)

  **References**:
  - `files/command/review-rfc.md` - Current command file

  **Acceptance Criteria**:
  - [ ] Path examples use `.sisyphus/specs/rfc/`

  **Commit**: NO (groups with 4.1-4.3, 4.5-4.6)

---

- [ ] 4.5 Update plan-from-rfc.md with new paths

  **What to do**:
  - Update RFC discovery path: `.sisyphus/specs/rfc/`
  - Keep output path: `.sisyphus/plans/` (Prometheus output, not Daedalus)

  **Parallelizable**: YES (with 4.1-4.4, 4.6)

  **References**:
  - `files/command/plan-from-rfc.md` - Current command file

  **Acceptance Criteria**:
  - [ ] RFC path: `.sisyphus/specs/rfc/`
  - [ ] Plan output stays at `.sisyphus/plans/`

  **Commit**: NO (groups with 4.1-4.4, 4.6)

---

- [ ] 4.6 Update resume-prd.md with new paths

  **What to do**:
  - Update state file path if needed
  - Ensure draft resumption points to `.sisyphus/specs/drafts/`

  **Parallelizable**: YES (with 4.1-4.5)

  **References**:
  - `files/command/resume-prd.md` - Current command file

  **Acceptance Criteria**:
  - [ ] References `.sisyphus/specs/drafts/` for resume

  **Commit**: YES
  - Message: `feat(commands): update all commands with new .sisyphus/specs/ paths`
  - Files: `files/command/create-prd.md`, `files/command/review-prd.md`, `files/command/prd-to-rfc.md`, `files/command/review-rfc.md`, `files/command/plan-from-rfc.md`, `files/command/resume-prd.md`
  - Pre-commit: Verify all files contain `.sisyphus/specs/`

---

### Phase 5: Registry & Verification

- [ ] 5.1 Update registry.jsonc

  **What to do**:
  - Add Theseus agent:
    ```jsonc
    {
      "name": "theseus",
      "type": "ocx:agent",
      "description": "PRD/RFC Spec Reviewer - validates specification quality",
      "files": ["agent/theseus.md"],
      "dependencies": ["prd-methodology", "rfc-generation"]
    }
    ```
  - Add hook component:
    ```jsonc
    {
      "name": "daedalus-specs-only",
      "type": "ocx:hook",
      "description": "Enforces .sisyphus/specs/ path restriction for Daedalus/Theseus",
      "files": ["hook/daedalus-specs-only/index.ts", "hook/daedalus-specs-only/constants.ts"],
      "dependencies": []
    }
    ```
  - Update daedalus agent dependencies to include theseus
  - Update daedalus-bundle dependencies to include theseus and hook

  **Must NOT do**:
  - Remove existing components
  - Change component names

  **Parallelizable**: NO (depends on 2.1, 3.1, 4.*)

  **References**:
  - `registry.jsonc:107-203` - Current Daedalus bundle section

  **Acceptance Criteria**:
  - [ ] Contains "theseus" agent entry
  - [ ] Contains "daedalus-specs-only" hook entry
  - [ ] daedalus-bundle includes theseus and hook in dependencies
  - [ ] JSONC syntax is valid (no trailing commas, proper brackets)

  **Commit**: NO (groups with 5.2)

---

- [ ] 5.2 Final build verification

  **What to do**:
  - Run `bunx ocx build . --out dist`
  - Verify component count increased (was 18, now should be 20+)
  - Verify new components in dist/index.json
  - Check dist/components/ for new files

  **Must NOT do**:
  - Modify any files during verification

  **Parallelizable**: NO (final task)

  **References**:
  - Previous build output: "Built 18 components"

  **Acceptance Criteria**:
  - [ ] `bunx ocx build . --out dist` succeeds
  - [ ] Output shows "Built N components" where N ≥ 20
  - [ ] `grep -c "theseus" dist/index.json` returns ≥ 1
  - [ ] `grep -c "daedalus-specs-only" dist/index.json` returns ≥ 1
  - [ ] All files present in dist/components/

  **Commit**: YES
  - Message: `feat(registry): add Theseus agent and daedalus-specs-only hook to bundle`
  - Files: `registry.jsonc`
  - Pre-commit: `bunx ocx build . --out dist`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1.5 | `feat(daedalus): expand agent with intent classification, interview mode, Metis/Theseus integration` | files/agent/daedalus.md | wc -l returns 500-600 |
| 2.1 | `feat(theseus): add PRD/RFC spec reviewer agent` | files/agent/theseus.md | wc -l returns 150-200 |
| 3.1 | `feat(hook): add daedalus-specs-only path enforcement` | files/hook/daedalus-specs-only/* | TypeScript compiles |
| 4.6 | `feat(commands): update all commands with new .sisyphus/specs/ paths` | files/command/*.md | grep shows new paths |
| 5.2 | `feat(registry): add Theseus agent and daedalus-specs-only hook to bundle` | registry.jsonc | bunx ocx build succeeds |

---

## Success Criteria

### Verification Commands
```bash
# Daedalus line count
wc -l files/agent/daedalus.md  # Expected: 500-600

# Theseus line count  
wc -l files/agent/theseus.md  # Expected: 150-200

# Hook exists
ls files/hook/daedalus-specs-only/  # Expected: index.ts, constants.ts

# Build succeeds
bunx ocx build . --out dist  # Expected: Built N components (N ≥ 20)

# New components in registry
grep -c "theseus" registry.jsonc  # Expected: ≥ 2
grep -c "daedalus-specs-only" registry.jsonc  # Expected: ≥ 1
```

### Final Checklist
- [ ] All "Must Have" features present in daedalus.md
- [ ] All "Must NOT Have" guardrails respected
- [ ] Theseus agent review-only (no edit capability)
- [ ] Hook enforces `.sisyphus/specs/` restriction
- [ ] All 6 commands updated with new paths
- [ ] Build passes with ≥20 components
- [ ] No files modified outside `.sisyphus/specs/` by Daedalus/Theseus
