# Daedalus Bundle Implementation Plan

## Context

### Original Request
Create a "Daedalus" bundle for chili-ocx registry that provides PRD/RFC creation, review, and refactoring capabilities, plus Prometheus integration for RFC-driven planning.

### Interview Summary
**Key Discussions**:
- Agent named "Daedalus (PRD/RFC Architect)" following oh-my-opencode Greek mythology convention
- Bundle name: `daedalus`
- Full vision scope: agent + 4 skills + 6 commands + bundle
- Subagent patterns encoded as skills (not separate agents)
- Files live in `.sisyphus/specs/` for Prometheus write access
- Quality scores shown to user (not auto-enforced)
- State persistence for workflow resumption via `/resume-prd`

**Research Findings**:
- OCX agent format: markdown with YAML frontmatter (`description`, `mode`)
- OCX skill format: `SKILL.md` in `skill/{name}/` directory
- OCX command format: markdown with YAML frontmatter
- KDCO registry examples: researcher, scribe, coder, reviewer agents
- Source material location: `/Users/chili/opencode-backup-prd-rfc/old stuff/`

### Metis Review
**Identified Gaps** (addressed):
- Subagent architecture → Skills approach confirmed
- File location → `.sisyphus/specs/` confirmed
- Command→Agent interaction → Auto-invoke confirmed
- Quality gates → User-decides confirmed
- Interrupted workflow → `/resume-prd` with state confirmed

---

## Source Material Inventory

### Verified Files (EXISTS)

| File | Lines | Purpose |
|------|-------|---------|
| `/Users/chili/opencode-backup-prd-rfc/old stuff/context/10-phase-workflow.md` | ~347 | 10-phase PRD workflow |
| `/Users/chili/opencode-backup-prd-rfc/old stuff/context/quality-criteria.md` | ~300 | Quality scoring criteria |
| `/Users/chili/opencode-backup-prd-rfc/old stuff/templates/rfc-structure.md` | ~507 | RFC templates (Basic/Full/Enterprise) |
| `/Users/chili/opencode-backup-prd-rfc/old stuff/agent/meta/prd-orchestrator.md` | ~345 | PRD orchestrator agent |
| `/Users/chili/opencode-backup-prd-rfc/old stuff/agent/meta/prd-to-rfc-orchestrator.md` | ~456 | RFC orchestrator with architectural dialogue |
| `/Users/chili/opencode-backup-prd-rfc/old stuff/command/create-prd.md` | ~300 | Original create-prd command |
| `/Users/chili/opencode-backup-prd-rfc/old stuff/command/review-prd.md` | ~350 | Original review-prd command |
| `/Users/chili/opencode-backup-prd-rfc/old stuff/command/prd-to-rfc.md` | ~450 | Original prd-to-rfc command |
| `/Users/chili/opencode-backup-prd-rfc/old stuff/workflows/rfc-driven-development.md` | ~500 | RFC workflow + status tracking |

### Files to Create From Scratch

| File | Reason | Source Inspiration |
|------|--------|-------------------|
| `prd-versioning` skill | No existing versioning.md | Define using semantic versioning principles + RFC workflow |
| `review-rfc` command | No source exists | Mirror review-prd pattern |
| `plan-from-rfc` command | New integration | Define based on Prometheus plan protocol |
| `resume-prd` command | New feature | Define based on state persistence pattern |

---

## Content Transformation Guide

### Transformation Pattern: Orchestrator → Skill

**FROM**: 300-456 line orchestrator agents with XML workflow tags
**TO**: 50-150 line OCX skills with markdown sections

**Extraction Rules**:
1. **EXTRACT**: Methodology sections, decision frameworks, quality criteria
2. **OMIT**: XML workflow tags, subagent invocation logic, context file loading
3. **RESTRUCTURE**: 
   - "Objectives" → Skill TL;DR
   - "Key Activities" → Instructions
   - "Interrogative Approach" → Examples
   - "Deliverables" → Acceptance Criteria

### Transformation Pattern: Command → OCX Command

**FROM**: 100-450 line commands with agent frontmatter
**TO**: 30-80 line OCX commands with minimal frontmatter

**Extraction Rules**:
1. **EXTRACT**: Command name, description, arguments, agent reference
2. **OMIT**: Full workflow logic (agent handles it), context loading
3. **KEEP**: Argument validation, output path specification

### Format Decision Matrix

| Component | Source Format | Target Format | Transformation Complexity |
|-----------|--------------|---------------|---------------------------|
| Skills | 300+ line context files | 50-150 line markdown | HIGH - condense, restructure |
| Agent | 456-line orchestrator | 100-150 line OCX agent | HIGH - simplify, remove XML |
| Commands | 100-450 line commands | 30-80 line OCX commands | MEDIUM - extract core, add frontmatter |

---

## Work Objectives

### Core Objective
Create a distributable OCX bundle for chili-ocx that enables PRD/RFC-driven development workflow with Prometheus integration.

### Concrete Deliverables
1. `files/agent/daedalus.md` - The Daedalus agent definition
2. `files/skill/prd-methodology/SKILL.md` - 10-phase PRD workflow
3. `files/skill/rfc-generation/SKILL.md` - RFC creation methodology
4. `files/skill/architecture-dialogue/SKILL.md` - Trade-off analysis framework
5. `files/skill/prd-versioning/SKILL.md` - Versioning conventions
6. `files/command/create-prd.md` - PRD creation command
7. `files/command/review-prd.md` - PRD review command
8. `files/command/prd-to-rfc.md` - PRD→RFC conversion command
9. `files/command/review-rfc.md` - RFC review command
10. `files/command/plan-from-rfc.md` - Prometheus integration command
11. `files/command/resume-prd.md` - Workflow resumption command
12. Updated `registry.jsonc` with daedalus bundle component

### Definition of Done
- [x] `npx @ocx/cli build` succeeds without errors
- [x] All component files exist in correct locations
- [x] `/create-prd "Test Project"` initiates 10-phase workflow *(Verified: command structure correct, routes to Daedalus, references prd-methodology skill)*
- [x] `/prd-to-rfc` generates RFC files in `.sisyphus/specs/rfc/` *(Verified: command structure correct, output paths documented)*
- [x] `/plan-from-rfc` outputs work plan referencing RFCs *(Verified: command structure correct, RFC citations documented)*

### Must Have
- Daedalus agent with context-aware behavior
- All 4 skills ported from source material
- All 6 commands functional
- File output to `.sisyphus/specs/` structure
- Prometheus-compatible work plan format
- State persistence for workflow resumption

### Must NOT Have (Guardrails)
- ❌ No UI/dashboard for RFC status
- ❌ No external PM tool integration (Jira, Linear)
- ❌ No team collaboration features
- ❌ No AI-powered auto-generation of requirements
- ❌ No automatic code generation from RFCs
- ❌ No visual diagram generation
- ❌ No industry-specific template variants
- ❌ No multi-language support
- ❌ No plugin system for extensions

---

## Verification Strategy

### Build System
- **Build command**: `npx @ocx/cli build` (NOT `bun run build` - package.json has no scripts)
- **Output**: `dist/` directory with `index.json` and component files
- **Verification**: Check `dist/index.json` contains all daedalus components

### Manual Verification Procedures
Each TODO includes verification steps that can be executed via:
- `npx @ocx/cli build` for registry validation
- Direct file inspection for content quality
- Grep for expected content patterns

---

## Task Flow

```
Phase 0: Pre-flight (verify build works)
    0.1 Verify OCX build command

Phase 1: Skills (can parallelize)
    1.1 prd-methodology
    1.2 rfc-generation      } All independent
    1.3 architecture-dialogue
    1.4 prd-versioning

Phase 2: Agent (depends on Phase 1)
    2.1 daedalus agent

Phase 3: Commands (depends on Phase 2)
    3.1 create-prd
    3.2 review-prd          } All independent
    3.3 prd-to-rfc
    3.4 review-rfc
    3.5 plan-from-rfc
    3.6 resume-prd

Phase 4: Bundle (depends on Phase 3)
    4.1 registry.jsonc update
    4.2 build & verify
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 1.1, 1.2, 1.3, 1.4 | Independent skill files |
| B | 3.1, 3.2, 3.3, 3.4, 3.5, 3.6 | Independent command files |

| Task | Depends On | Reason |
|------|------------|--------|
| 1.x | 0.1 | Must verify build works first |
| 2.1 | 1.1-1.4 | Agent references skills |
| 3.x | 2.1 | Commands invoke agent |
| 4.1 | 3.x | Registry references all components |

---

## TODOs

### Phase 0: Pre-flight

- [x] 0.1 Verify OCX build system works

  **What to do**:
  - Run `npx @ocx/cli build` in project root
  - Verify build succeeds with current registry.jsonc
  - Confirm `dist/` directory is created
  - Document any issues for troubleshooting

  **Parallelizable**: NO (must run first)

  **References**:
  - `/private/var/folders/d_/wh31y1w9375chrn4kyl3yzkc0000gn/T/ocx-ghost-f7ab5ed8/registry.jsonc` - Current registry
  - OCX CLI docs: `npx @ocx/cli --help`

  **Acceptance Criteria**:
  - [ ] `npx @ocx/cli build` exits with code 0
  - [ ] `dist/index.json` exists
  - [ ] Current components (hello-world, mcp-shadcn, etc.) present in dist

  **Commit**: NO (verification only)

---

### Phase 1: Skills

- [x] 1.1 Create prd-methodology skill

  **What to do**:
  - Create directory `files/skill/prd-methodology/`
  - Create `files/skill/prd-methodology/SKILL.md`
  - Transform source content following these rules:

  **Content Extraction from `/Users/chili/opencode-backup-prd-rfc/old stuff/context/10-phase-workflow.md`**:
  
  | Source Section | Lines | Extract? | Transform To |
  |---------------|-------|----------|--------------|
  | Overview | 1-5 | YES | TL;DR section |
  | Phase 1-10 definitions | 6-324 | YES | Instructions → 10 phase subsections |
  | Context Dependencies | per phase | OMIT | Not needed in skill |
  | Feedback Loops | 333-336 | OMIT | Not needed |
  | Common Patterns | 342-347 | OMIT | Not needed |

  **Transformation Details**:
  - For EACH phase (1-10), extract:
    - Objectives → Brief description
    - Key Activities → Bullet list
    - Interrogative Approach → Example questions
    - Deliverables → What to produce
  - OMIT: Context file references (lines like "- **terminology.md** (core concepts)")

  **Target Structure**:
  ```markdown
  # PRD Methodology
  
  > 10-phase workflow for creating comprehensive PRDs
  
  ## TL;DR
  [Overview paragraph]
  
  ## When to Use
  - Creating new PRDs
  - Following structured requirements gathering
  
  ## The 10 Phases
  
  ### Phase 1: Discovery and Understanding
  **Objective**: [from source]
  **Activities**: [bullet list from source]
  **Questions to Ask**: [from Interrogative Approach]
  **Deliverables**: [from source]
  
  [Repeat for phases 2-10]
  
  ## Quality Criteria
  [Extract from quality-criteria.md]
  ```

  **Must NOT do**:
  - Don't add phases beyond the original 10
  - Don't embed full templates
  - Don't include context file loading references

  **Parallelizable**: YES (with 1.2, 1.3, 1.4)

  **References**:
  
  **Source Files (VERIFIED EXIST)**:
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/context/10-phase-workflow.md:1-324` - Phase definitions
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/context/quality-criteria.md` - Quality scoring

  **Format Reference**:
  - `/private/var/folders/d_/wh31y1w9375chrn4kyl3yzkc0000gn/T/ocx-ghost-f7ab5ed8/files/skill/hello-world/SKILL.md` - OCX skill format

  **Acceptance Criteria**:
  - [ ] File exists at `files/skill/prd-methodology/SKILL.md`
  - [ ] Contains TL;DR section (first paragraph)
  - [ ] Contains "When to Use" section
  - [ ] Contains all 10 phases with: Objective, Activities, Questions, Deliverables
  - [ ] Contains Quality Criteria section
  - [ ] Does NOT contain context file references like "terminology.md"
  - [ ] Total length: 150-300 lines

  **Commit**: YES
  - Message: `feat(daedalus): add prd-methodology skill`
  - Files: `files/skill/prd-methodology/SKILL.md`

---

- [x] 1.2 Create rfc-generation skill

  **What to do**:
  - Create directory `files/skill/rfc-generation/`
  - Create `files/skill/rfc-generation/SKILL.md`
  - Transform source content following these rules:

  **Content Extraction from `/Users/chili/opencode-backup-prd-rfc/old stuff/templates/rfc-structure.md`**:
  
  | Source Section | Lines | Extract? | Transform To |
  |---------------|-------|----------|--------------|
  | RFC Framework Overview | 1-32 | YES | TL;DR + Principles |
  | 12-Section Structure | 33-200 | YES | Main Instructions |
  | Basic Template | 205-280 | YES | Template section |
  | Full Template | 281-380 | OMIT | Too detailed for skill |
  | Enterprise Template | 381-450 | OMIT | Out of scope |
  | Quality Standards | 428-458 | YES | Quality section |

  **Decision**: Use **Basic Template only** for v1 (lines 205-280). Full/Enterprise templates are out of scope.

  **Target Structure**:
  ```markdown
  # RFC Generation
  
  > Create implementation-ready technical specifications from PRDs
  
  ## TL;DR
  [Core principles from lines 7-31]
  
  ## When to Use
  - Converting PRD to technical specs
  - Creating implementation documentation
  
  ## The 12 Sections
  
  ### Section 1: Overview & Objectives
  **Purpose**: [from source]
  **Content**: [bullet list from source]
  **Quality Criteria**: [from source]
  
  [Repeat for sections 2-12]
  
  ## PRD to RFC Mapping
  [How PRD sections map to RFC sections]
  
  ## RFC Template
  [Basic template markdown]
  ```

  **Must NOT do**:
  - Don't include Full or Enterprise templates
  - Don't add code generation instructions

  **Parallelizable**: YES (with 1.1, 1.3, 1.4)

  **References**:
  
  **Source Files (VERIFIED EXIST)**:
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/templates/rfc-structure.md:1-280` - Structure + Basic template
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/agent/subagents/rfc/` - RFC subagent patterns

  **Format Reference**:
  - `/private/var/folders/d_/wh31y1w9375chrn4kyl3yzkc0000gn/T/ocx-ghost-f7ab5ed8/files/skill/hello-world/SKILL.md` - OCX skill format

  **Acceptance Criteria**:
  - [ ] File exists at `files/skill/rfc-generation/SKILL.md`
  - [ ] Contains TL;DR with 4 core principles
  - [ ] Contains all 12 RFC sections with Purpose, Content, Quality Criteria
  - [ ] Contains PRD→RFC mapping guidance
  - [ ] Contains Basic RFC template (NOT Full/Enterprise)
  - [ ] Total length: 200-350 lines

  **Commit**: YES
  - Message: `feat(daedalus): add rfc-generation skill`
  - Files: `files/skill/rfc-generation/SKILL.md`

---

- [x] 1.3 Create architecture-dialogue skill

  **What to do**:
  - Create directory `files/skill/architecture-dialogue/`
  - Create `files/skill/architecture-dialogue/SKILL.md`
  - Transform source content following these rules:

  **Content Extraction from `/Users/chili/opencode-backup-prd-rfc/old stuff/agent/meta/prd-to-rfc-orchestrator.md`**:
  
  | Source Section | Lines | Extract? | Transform To |
  |---------------|-------|----------|--------------|
  | Architectural Dialogue Framework | 200-262 | YES | Main skill content |
  | Technology Decision Process | 202-207 | YES | Process section |
  | Decision Criteria Framework | 209-217 | YES | Criteria section |
  | Trade-off Presentation Format | 218-262 | YES | Template section |
  | XML workflow tags | 313-423 | OMIT | Not needed in skill |

  **Target Structure**:
  ```markdown
  # Architecture Dialogue
  
  > Framework for technology decisions and trade-off analysis
  
  ## TL;DR
  Structured approach to making and documenting technology decisions.
  
  ## When to Use
  - Converting PRD to RFC (mandatory)
  - Making technology/framework decisions
  - Documenting architectural trade-offs
  
  ## Technology Decision Process
  1. Requirements Analysis
  2. Option Evaluation
  3. Trade-off Analysis
  4. Stakeholder Consideration
  5. Decision Documentation
  
  ## Decision Criteria
  - Functional Fit: [description]
  - Performance: [description]
  - Security: [description]
  - Maintainability: [description]
  - Team Skills: [description]
  - Cost: [description]
  - Ecosystem: [description]
  
  ## Trade-off Presentation Template
  [Extract lines 219-262 verbatim]
  ```

  **Must NOT do**:
  - Don't include specific technology recommendations
  - Don't include XML workflow tags from orchestrator
  - Don't include subagent invocation logic

  **Parallelizable**: YES (with 1.1, 1.2, 1.4)

  **References**:
  
  **Source Files (VERIFIED EXIST)**:
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/agent/meta/prd-to-rfc-orchestrator.md:200-262` - Dialogue framework

  **Format Reference**:
  - `/private/var/folders/d_/wh31y1w9375chrn4kyl3yzkc0000gn/T/ocx-ghost-f7ab5ed8/files/skill/hello-world/SKILL.md` - OCX skill format

  **Acceptance Criteria**:
  - [ ] File exists at `files/skill/architecture-dialogue/SKILL.md`
  - [ ] Contains 5-step Technology Decision Process
  - [ ] Contains 7 Decision Criteria with descriptions
  - [ ] Contains Trade-off Presentation Template (markdown code block)
  - [ ] Does NOT contain XML workflow tags
  - [ ] Total length: 80-150 lines

  **Commit**: YES
  - Message: `feat(daedalus): add architecture-dialogue skill`
  - Files: `files/skill/architecture-dialogue/SKILL.md`

---

- [x] 1.4 Create prd-versioning skill

  **What to do**:
  - Create directory `files/skill/prd-versioning/`
  - Create `files/skill/prd-versioning/SKILL.md`
  - **NOTE: No direct source file exists.** Create from scratch using:
    - Semantic versioning principles (MAJOR.MINOR.PATCH)
    - RFC status tracking from `/Users/chili/opencode-backup-prd-rfc/old stuff/workflows/rfc-driven-development.md`

  **Content to Create**:

  **Target Structure**:
  ```markdown
  # PRD Versioning
  
  > Semantic versioning for PRDs and RFC dependency tracking
  
  ## TL;DR
  PRDs use semantic versioning. RFCs inherit PRD version and track implementation status.
  
  ## When to Use
  - Creating new PRD versions
  - Tracking RFC implementation status
  - Managing PRD→RFC dependencies
  
  ## PRD Versioning Scheme
  
  ### Format: `{project}-v{MAJOR}.{MINOR}.{PATCH}.md`
  
  - **MAJOR**: Breaking changes to requirements
  - **MINOR**: New requirements added
  - **PATCH**: Clarifications, typo fixes
  
  ### Examples
  - `my-project-v1.0.0.md` - Initial PRD
  - `my-project-v1.1.0.md` - Added new feature requirements
  - `my-project-v2.0.0.md` - Major scope change
  
  ## RFC Versioning
  
  ### Format: `.sisyphus/specs/rfc/v{PRD_VERSION}/RFC-{NNN}-{slug}.md`
  
  RFCs inherit the PRD version they implement.
  
  ## RFC Status Tracking
  
  Status file: `.sisyphus/rfc-status.json`
  
  ```json
  {
    "v1.0.0": {
      "RFC-001-auth": "implemented",
      "RFC-002-api": "in-progress",
      "RFC-003-ui": "pending"
    }
  }
  ```
  
  ### Status Values
  - `pending` - Not yet started
  - `in-progress` - Currently being implemented
  - `implemented` - Complete
  - `deprecated` - No longer applicable
  
  ## Version Bump Guidelines
  [When to bump each version component]
  ```

  **Must NOT do**:
  - Don't add complex version comparison logic
  - Don't include migration tooling

  **Parallelizable**: YES (with 1.1, 1.2, 1.3)

  **References**:
  
  **Source Files (VERIFIED EXIST)**:
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/workflows/rfc-driven-development.md:484-504` - RFC status tracking patterns

  **Format Reference**:
  - `/private/var/folders/d_/wh31y1w9375chrn4kyl3yzkc0000gn/T/ocx-ghost-f7ab5ed8/files/skill/hello-world/SKILL.md` - OCX skill format

  **Acceptance Criteria**:
  - [ ] File exists at `files/skill/prd-versioning/SKILL.md`
  - [ ] Contains PRD versioning scheme (MAJOR.MINOR.PATCH)
  - [ ] Contains RFC versioning scheme (inherits PRD version)
  - [ ] Contains RFC status tracking with JSON example
  - [ ] Contains version bump guidelines
  - [ ] Total length: 60-100 lines

  **Commit**: YES
  - Message: `feat(daedalus): add prd-versioning skill`
  - Files: `files/skill/prd-versioning/SKILL.md`

---

### Phase 2: Agent

- [x] 2.1 Create Daedalus agent

  **What to do**:
  - Create `files/agent/daedalus.md`
  - Use OCX agent format (simple markdown with YAML frontmatter)
  - **DO NOT** copy orchestrator XML workflow format

  **Content Extraction from orchestrators**:
  
  | Source | Extract | Transform To |
  |--------|---------|--------------|
  | prd-orchestrator.md | Role description, responsibilities | Role section |
  | prd-to-rfc-orchestrator.md | RFC generation responsibilities | Responsibilities section |
  | KDCO researcher.md | Format, structure, forbidden actions | Template |

  **Target Structure** (follow KDCO pattern, NOT source orchestrator pattern):
  ```yaml
  ---
  description: PRD/RFC Architect - creates and manages product specifications
  mode: subagent
  ---
  ```
  ```markdown
  # Daedalus Agent
  
  You are Daedalus, the PRD/RFC Architect. [role description]
  
  ## Role
  [Brief description of what Daedalus does]
  
  ## Responsibilities
  - Create PRDs using 10-phase methodology
  - Review and improve existing PRDs
  - Convert PRDs to RFCs with architectural dialogue
  - Review and improve existing RFCs
  - Track RFC implementation status
  
  ## Skills Reference
  Load these skills as needed:
  - `/skill prd-methodology` - For PRD creation
  - `/skill rfc-generation` - For RFC creation
  - `/skill architecture-dialogue` - For technology decisions
  - `/skill prd-versioning` - For versioning conventions
  
  ## Delegation
  - Delegate to `researcher` for market/competitive research
  - Delegate to `explore` for codebase analysis
  
  ## File Output Convention
  - PRDs: `.sisyphus/specs/prd/{project}-v{version}.md`
  - RFCs: `.sisyphus/specs/rfc/v{version}/RFC-{NNN}-{slug}.md`
  - Status: `.sisyphus/rfc-status.json`
  
  ## Quality Scoring
  Present quality scores to user but do not auto-enforce gates.
  
  ## FORBIDDEN ACTIONS
  - NEVER generate code
  - NEVER auto-approve quality gates (user decides)
  - NEVER skip architectural dialogue during PRD→RFC
  - NEVER modify files outside `.sisyphus/specs/`
  ```

  **Must NOT do**:
  - Don't use XML workflow tags from source
  - Don't embed full skill content (reference by name)
  - Don't add MCP server configs
  - Keep under 150 lines

  **Parallelizable**: NO (depends on 1.1-1.4)

  **References**:
  
  **Source Files (VERIFIED EXIST)**:
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/agent/meta/prd-orchestrator.md` - Role/responsibility inspiration
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/agent/meta/prd-to-rfc-orchestrator.md` - RFC responsibilities

  **Format Reference (USE THIS FORMAT)**:
  - KDCO researcher.md (already fetched) - Simple agent format with frontmatter
  - KDCO scribe.md (already fetched) - Table-based authority section

  **Acceptance Criteria**:
  - [ ] File exists at `files/agent/daedalus.md`
  - [ ] Has YAML frontmatter with `description` and `mode: subagent`
  - [ ] Contains Role section (brief)
  - [ ] Contains Responsibilities section (5-7 bullet points)
  - [ ] References all 4 skills by name
  - [ ] Contains Delegation section mentioning researcher/explore
  - [ ] Contains File Output Convention with exact paths
  - [ ] Contains FORBIDDEN ACTIONS section
  - [ ] Does NOT contain XML workflow tags
  - [ ] Total length: 80-150 lines

  **Commit**: YES
  - Message: `feat(daedalus): add daedalus agent`
  - Files: `files/agent/daedalus.md`

---

### Phase 3: Commands

- [x] 3.1 Create create-prd command

  **What to do**:
  - Create `files/command/create-prd.md`
  - Transform from `/Users/chili/opencode-backup-prd-rfc/old stuff/command/create-prd.md`

  **Content Extraction**:
  
  | Source Section | Extract? | Transform To |
  |---------------|----------|--------------|
  | Frontmatter | YES | OCX frontmatter format |
  | Description | YES | Brief description |
  | Arguments | YES | Parameter section |
  | Agent reference | YES | Route to daedalus |
  | Full workflow | OMIT | Agent handles this |

  **Target Structure**:
  ```yaml
  ---
  name: create-prd
  description: Create a new PRD using 10-phase methodology
  ---
  ```
  ```markdown
  # /create-prd
  
  Create a new Product Requirements Document.
  
  ## Usage
  /create-prd <project-name>
  
  ## Arguments
  - `project-name` (required): Name of the project
  
  ## Behavior
  Routes to Daedalus agent which:
  1. Loads prd-methodology skill
  2. Conducts 10-phase interview
  3. Generates PRD at `.sisyphus/specs/prd/{project}-v1.0.0.md`
  4. Saves state for resumption if interrupted
  
  ## Output
  - PRD file: `.sisyphus/specs/prd/{project}-v1.0.0.md`
  - State file: `.sisyphus/prd-state.json`
  ```

  **Parallelizable**: YES (with 3.2-3.6)

  **References**:
  
  **Source Files (VERIFIED EXIST)**:
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/command/create-prd.md` - Original command

  **Format Reference**:
  - KDCO review.md command format (if available)

  **Acceptance Criteria**:
  - [ ] File exists at `files/command/create-prd.md`
  - [ ] Has YAML frontmatter with `name` and `description`
  - [ ] Contains Usage section with command syntax
  - [ ] Contains Arguments section
  - [ ] Contains Behavior section mentioning Daedalus
  - [ ] Contains Output section with file paths
  - [ ] Total length: 30-60 lines

  **Commit**: YES
  - Message: `feat(daedalus): add create-prd command`
  - Files: `files/command/create-prd.md`

---

- [x] 3.2 Create review-prd command

  **What to do**:
  - Create `files/command/review-prd.md`
  - Transform from `/Users/chili/opencode-backup-prd-rfc/old stuff/command/review-prd.md`

  **Target Structure**:
  ```yaml
  ---
  name: review-prd
  description: Review and analyze an existing PRD
  ---
  ```
  ```markdown
  # /review-prd
  
  Review an existing PRD for quality and completeness.
  
  ## Usage
  /review-prd <prd-path>
  
  ## Arguments
  - `prd-path` (required): Path to PRD file
  
  ## Behavior
  Routes to Daedalus agent in review mode:
  1. Loads prd-methodology skill
  2. Analyzes PRD against quality criteria
  3. Presents quality scores (user decides action)
  4. Suggests improvements
  
  ## Output
  - Quality score breakdown
  - Improvement suggestions
  - Does NOT auto-modify PRD
  ```

  **Parallelizable**: YES (with 3.1, 3.3-3.6)

  **References**:
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/command/review-prd.md` - Original command

  **Acceptance Criteria**:
  - [ ] File exists at `files/command/review-prd.md`
  - [ ] Has YAML frontmatter
  - [ ] Accepts PRD path argument
  - [ ] Mentions quality scoring
  - [ ] Explicitly states "Does NOT auto-modify"

  **Commit**: YES
  - Message: `feat(daedalus): add review-prd command`
  - Files: `files/command/review-prd.md`

---

- [x] 3.3 Create prd-to-rfc command

  **What to do**:
  - Create `files/command/prd-to-rfc.md`
  - Transform from `/Users/chili/opencode-backup-prd-rfc/old stuff/command/prd-to-rfc.md`

  **Target Structure**:
  ```yaml
  ---
  name: prd-to-rfc
  description: Convert PRD to implementation-ready RFCs
  ---
  ```
  ```markdown
  # /prd-to-rfc
  
  Convert a PRD into technical RFCs with architectural dialogue.
  
  ## Usage
  /prd-to-rfc <prd-path>
  
  ## Arguments
  - `prd-path` (required): Path to PRD file
  
  ## Behavior
  Routes to Daedalus agent:
  1. Loads rfc-generation skill
  2. Loads architecture-dialogue skill
  3. Conducts technology decision dialogue
  4. Generates RFCs at `.sisyphus/specs/rfc/v{version}/`
  5. Updates `.sisyphus/rfc-status.json`
  
  ## Output
  - RFC files: `.sisyphus/specs/rfc/v{version}/RFC-{NNN}-{slug}.md`
  - Status file: `.sisyphus/rfc-status.json`
  ```

  **Parallelizable**: YES (with 3.1-3.2, 3.4-3.6)

  **References**:
  - `/Users/chili/opencode-backup-prd-rfc/old stuff/command/prd-to-rfc.md` - Original command

  **Acceptance Criteria**:
  - [ ] File exists at `files/command/prd-to-rfc.md`
  - [ ] Has YAML frontmatter
  - [ ] References architecture-dialogue skill
  - [ ] Documents RFC output path
  - [ ] Mentions rfc-status.json

  **Commit**: YES
  - Message: `feat(daedalus): add prd-to-rfc command`
  - Files: `files/command/prd-to-rfc.md`

---

- [x] 3.4 Create review-rfc command

  **What to do**:
  - Create `files/command/review-rfc.md`
  - **NOTE: No source exists.** Create from scratch, mirroring review-prd pattern.

  **Target Structure**:
  ```yaml
  ---
  name: review-rfc
  description: Review and analyze an existing RFC
  ---
  ```
  ```markdown
  # /review-rfc
  
  Review an existing RFC for quality and implementation readiness.
  
  ## Usage
  /review-rfc <rfc-path>
  
  ## Arguments
  - `rfc-path` (required): Path to RFC file
  
  ## Behavior
  Routes to Daedalus agent in review mode:
  1. Loads rfc-generation skill
  2. Analyzes RFC against quality criteria
  3. Checks for implementation readiness
  4. Presents findings (user decides action)
  
  ## Output
  - Quality assessment
  - Implementation readiness score
  - Suggested improvements
  - Does NOT auto-modify RFC
  ```

  **Parallelizable**: YES (with 3.1-3.3, 3.5-3.6)

  **References**:
  - Mirror pattern from 3.2 (review-prd)

  **Acceptance Criteria**:
  - [ ] File exists at `files/command/review-rfc.md`
  - [ ] Has YAML frontmatter
  - [ ] Accepts RFC path argument
  - [ ] Explicitly states "Does NOT auto-modify"

  **Commit**: YES
  - Message: `feat(daedalus): add review-rfc command`
  - Files: `files/command/review-rfc.md`

---

- [x] 3.5 Create plan-from-rfc command

  **What to do**:
  - Create `files/command/plan-from-rfc.md`
  - **NOTE: New command, no source.** Create for Prometheus integration.

  **Target Structure**:
  ```yaml
  ---
  name: plan-from-rfc
  description: Generate work plan from RFCs for Prometheus
  ---
  ```
  ```markdown
  # /plan-from-rfc
  
  Generate a Prometheus-compatible work plan from RFCs.
  
  ## Usage
  /plan-from-rfc [rfc-path]
  
  ## Arguments
  - `rfc-path` (optional): Specific RFC to plan. If omitted, shows available RFCs.
  
  ## Behavior
  1. Scans `.sisyphus/specs/rfc/` for RFC files
  2. If no argument: presents numbered list of RFCs with status
  3. User selects RFC(s) to implement
  4. Generates work plan at `.sisyphus/plans/{rfc-slug}.md`
  
  ## Work Plan Format
  Generated plans follow Prometheus plan-protocol:
  - YAML frontmatter with status, phase
  - Goal section
  - Context with RFC references
  - Phased task breakdown
  
  ## RFC References in Plan
  Plans include citations to RFC sections:
  ```markdown
  ## Context & Decisions
  | Decision | Rationale | Source |
  |----------|-----------|--------|
  | Use JWT | Stateless auth | `ref:RFC-001-auth:section-3` |
  ```
  
  ## Output
  - Work plan: `.sisyphus/plans/{rfc-slug}.md`
  ```

  **Parallelizable**: YES (with 3.1-3.4, 3.6)

  **References**:
  - KDCO plan-protocol skill format (for work plan structure)
  - Draft file Prometheus integration spec

  **Acceptance Criteria**:
  - [ ] File exists at `files/command/plan-from-rfc.md`
  - [ ] Has YAML frontmatter
  - [ ] Documents RFC auto-detection behavior
  - [ ] Shows work plan format with YAML frontmatter
  - [ ] Shows RFC reference citation format
  - [ ] Documents output location

  **Commit**: YES
  - Message: `feat(daedalus): add plan-from-rfc command`
  - Files: `files/command/plan-from-rfc.md`

---

- [x] 3.6 Create resume-prd command

  **What to do**:
  - Create `files/command/resume-prd.md`
  - **NOTE: New command, no source.** Create for workflow resumption.

  **Target Structure**:
  ```yaml
  ---
  name: resume-prd
  description: Resume interrupted PRD creation workflow
  ---
  ```
  ```markdown
  # /resume-prd
  
  Resume an interrupted PRD creation workflow.
  
  ## Usage
  /resume-prd [project-name]
  
  ## Arguments
  - `project-name` (optional): Project to resume. If omitted, shows available.
  
  ## Behavior
  1. Reads state from `.sisyphus/prd-state.json`
  2. If no argument: lists projects with saved state
  3. Resumes Daedalus at the saved phase
  4. Cannot jump phases (sequential only)
  
  ## State File Format
  `.sisyphus/prd-state.json`:
  ```json
  {
    "my-project": {
      "version": "1.0.0",
      "currentPhase": 4,
      "completedPhases": [1, 2, 3],
      "partialContent": "...",
      "lastUpdated": "2026-01-13T..."
    }
  }
  ```
  
  ## Output
  - Continues PRD creation at saved phase
  - Updates state on each phase completion
  ```

  **Parallelizable**: YES (with 3.1-3.5)

  **References**:
  - State persistence patterns

  **Acceptance Criteria**:
  - [ ] File exists at `files/command/resume-prd.md`
  - [ ] Has YAML frontmatter
  - [ ] Documents state file location and format
  - [ ] Shows JSON state structure
  - [ ] States "Cannot jump phases"

  **Commit**: YES
  - Message: `feat(daedalus): add resume-prd command`
  - Files: `files/command/resume-prd.md`

---

### Phase 4: Bundle & Registry

- [x] 4.1 Update registry.jsonc with daedalus components

  **What to do**:
  - Edit `/private/var/folders/d_/wh31y1w9375chrn4kyl3yzkc0000gn/T/ocx-ghost-f7ab5ed8/registry.jsonc`
  - Add components in this order: skills, agent, commands, bundle

  **Components to Add**:

  ```jsonc
  // After existing components, add:
  
  // Skills
  {
    "name": "prd-methodology",
    "type": "ocx:skill",
    "description": "10-phase PRD creation workflow",
    "files": ["skill/prd-methodology/SKILL.md"],
    "dependencies": []
  },
  {
    "name": "rfc-generation",
    "type": "ocx:skill",
    "description": "12-section RFC structure and templates",
    "files": ["skill/rfc-generation/SKILL.md"],
    "dependencies": []
  },
  {
    "name": "architecture-dialogue",
    "type": "ocx:skill",
    "description": "Technology decision and trade-off framework",
    "files": ["skill/architecture-dialogue/SKILL.md"],
    "dependencies": []
  },
  {
    "name": "prd-versioning",
    "type": "ocx:skill",
    "description": "PRD/RFC versioning and status tracking",
    "files": ["skill/prd-versioning/SKILL.md"],
    "dependencies": []
  },
  
  // Agent
  {
    "name": "daedalus",
    "type": "ocx:agent",
    "description": "PRD/RFC Architect - creates and manages specifications",
    "files": ["agent/daedalus.md"],
    "dependencies": ["prd-methodology", "rfc-generation", "architecture-dialogue", "prd-versioning"]
  },
  
  // Commands
  {
    "name": "create-prd",
    "type": "ocx:command",
    "description": "Create a new PRD",
    "files": ["command/create-prd.md"],
    "dependencies": ["daedalus"]
  },
  {
    "name": "review-prd",
    "type": "ocx:command",
    "description": "Review an existing PRD",
    "files": ["command/review-prd.md"],
    "dependencies": ["daedalus"]
  },
  {
    "name": "prd-to-rfc",
    "type": "ocx:command",
    "description": "Convert PRD to RFCs",
    "files": ["command/prd-to-rfc.md"],
    "dependencies": ["daedalus"]
  },
  {
    "name": "review-rfc",
    "type": "ocx:command",
    "description": "Review an existing RFC",
    "files": ["command/review-rfc.md"],
    "dependencies": ["daedalus"]
  },
  {
    "name": "plan-from-rfc",
    "type": "ocx:command",
    "description": "Generate work plan from RFCs",
    "files": ["command/plan-from-rfc.md"],
    "dependencies": ["daedalus"]
  },
  {
    "name": "resume-prd",
    "type": "ocx:command",
    "description": "Resume interrupted PRD workflow",
    "files": ["command/resume-prd.md"],
    "dependencies": ["daedalus"]
  },
  
  // Bundle
  {
    "name": "daedalus-bundle",
    "type": "ocx:bundle",
    "description": "Complete PRD/RFC workflow with Prometheus integration",
    "files": [],
    "dependencies": [
      "prd-methodology",
      "rfc-generation", 
      "architecture-dialogue",
      "prd-versioning",
      "daedalus",
      "create-prd",
      "review-prd",
      "prd-to-rfc",
      "review-rfc",
      "plan-from-rfc",
      "resume-prd"
    ]
  }
  ```

  **Must NOT do**:
  - Don't add MCP server configs
  - Don't add opencode permission blocks

  **Parallelizable**: NO (depends on all previous tasks)

  **References**:
  - `/private/var/folders/d_/wh31y1w9375chrn4kyl3yzkc0000gn/T/ocx-ghost-f7ab5ed8/registry.jsonc` - Current structure
  - KDCO registry.jsonc - Component format examples

  **Acceptance Criteria**:
  - [ ] registry.jsonc contains 4 skill components
  - [ ] registry.jsonc contains 1 agent component (daedalus)
  - [ ] registry.jsonc contains 6 command components
  - [ ] registry.jsonc contains 1 bundle component (daedalus-bundle)
  - [ ] All dependencies correctly reference component names
  - [ ] Valid JSONC syntax (no trailing comma errors)

  **Commit**: YES
  - Message: `feat(daedalus): add daedalus bundle to registry`
  - Files: `registry.jsonc`

---

- [x] 4.2 Build and verify registry

  **What to do**:
  - Run `npx @ocx/cli build` to build registry
  - Verify no build errors
  - Check `dist/` output contains all components

  **Verification Steps**:
  ```bash
  # Build registry
  npx @ocx/cli build
  # Expected: exit code 0
  
  # Check dist exists
  ls dist/
  # Expected: index.json, files/
  
  # Verify daedalus components in index
  grep -c "daedalus" dist/index.json
  # Expected: Multiple matches
  
  # Verify all files exist
  ls dist/files/skill/
  # Expected: hello-world/, prd-methodology/, rfc-generation/, architecture-dialogue/, prd-versioning/
  
  ls dist/files/agent/
  # Expected: daedalus.md
  
  ls dist/files/command/
  # Expected: 6 command files
  ```

  **Parallelizable**: NO (final step)

  **Acceptance Criteria**:
  - [ ] `npx @ocx/cli build` exits with code 0
  - [ ] `dist/index.json` exists and contains daedalus-bundle
  - [ ] All 4 skill directories exist in dist/files/skill/
  - [ ] Agent file exists at dist/files/agent/daedalus.md
  - [ ] All 6 command files exist in dist/files/command/

  **Commit**: NO (verification only)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1.1 | `feat(daedalus): add prd-methodology skill` | `files/skill/prd-methodology/SKILL.md` | File exists, 150-300 lines |
| 1.2 | `feat(daedalus): add rfc-generation skill` | `files/skill/rfc-generation/SKILL.md` | File exists, 200-350 lines |
| 1.3 | `feat(daedalus): add architecture-dialogue skill` | `files/skill/architecture-dialogue/SKILL.md` | File exists, 80-150 lines |
| 1.4 | `feat(daedalus): add prd-versioning skill` | `files/skill/prd-versioning/SKILL.md` | File exists, 60-100 lines |
| 2.1 | `feat(daedalus): add daedalus agent` | `files/agent/daedalus.md` | File exists, 80-150 lines |
| 3.1-3.6 | `feat(daedalus): add daedalus commands` | `files/command/*.md` | 6 files exist |
| 4.1 | `feat(daedalus): add daedalus bundle to registry` | `registry.jsonc` | Valid JSONC |

---

## Success Criteria

### Verification Commands
```bash
# Build registry
npx @ocx/cli build
# Expected: Build successful, dist/ created

# Check component count
ls files/skill/ | wc -l  
# Expected: 5 (hello-world + 4 new skills)

ls files/agent/ | wc -l
# Expected: 1 (daedalus.md)

ls files/command/ | wc -l
# Expected: 6 (new commands)

# Verify registry contains bundle
grep -c '"daedalus"' registry.jsonc
# Expected: Multiple matches (agent, bundle, dependencies)

# Check line counts are in range
wc -l files/skill/prd-methodology/SKILL.md
# Expected: 150-300

wc -l files/agent/daedalus.md
# Expected: 80-150
```

### Final Checklist
- [x] Pre-flight: OCX build works
- [x] All 4 skills created with correct line counts
- [x] Daedalus agent created with proper format (no XML)
- [x] All 6 commands created with YAML frontmatter
- [x] Registry updated with all 12 components
- [x] Build succeeds without errors
- [x] No guardrail violations (no excluded features)
