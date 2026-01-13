---
name: review-prd
description: Review and analyze an existing PRD for quality and completeness
---

# /review-prd

Review an existing Product Requirements Document (PRD) for quality and completeness.

## Purpose

Analyze a PRD against quality criteria and provide actionable improvement recommendations. The command evaluates the document across 5 quality dimensions and presents scoring to help you decide next steps.

**Note**: This is a manual review command for existing PRDs stored in `.sisyphus/specs/prd/`. This is separate from Theseus, which automatically validates PRDs during high-accuracy mode task planning.

## Usage

```bash
/review-prd <prd-path>
```

## Arguments

- `<prd-path>` (required): Path to the PRD file to review (typically in `.sisyphus/specs/prd/`)

## Behavior

Routes to Daedalus agent in review mode:

1. **Load PRD Analysis Framework**: Activates prd-methodology skill with quality criteria
2. **Analyze Document**: Evaluates PRD across 5 quality dimensions with weighted scoring
3. **Present Quality Report**: Shows overall score, dimension breakdown, and gap analysis
4. **Suggest Improvements**: Provides prioritized, actionable recommendations
5. **User Decides**: Quality scores are presented; user decides whether to proceed with refinement

## Quality Dimensions

The review evaluates PRDs across 5 weighted dimensions:

- **Completeness (30%)**: Requirements coverage, stakeholder needs, documentation completeness
- **Specificity (25%)**: Measurable requirements, actionable content, concrete examples
- **Testability (20%)**: Acceptance criteria, test scenarios, validation methods
- **Stakeholder Alignment (15%)**: User value, business value, technical feasibility
- **Professional Quality (10%)**: Document structure, language quality, cross-references

**Target Score**: 7.5+ out of 10 for implementation readiness

## Output

The command generates a quality assessment report including:

- Overall quality score and grade
- Dimension-by-dimension breakdown with specific assessments
- Critical gaps identified with impact and priority
- Immediate actions, short-term improvements, long-term enhancements
- Quality gate checklist for implementation approval

## Important

**Does NOT auto-modify PRD**. The review presents findings and recommendations; you decide whether to use `/refine-prd` to apply improvements.

## Example

```bash
/review-prd .sisyphus/specs/prd/task-manager-v1.0.0.md
```
