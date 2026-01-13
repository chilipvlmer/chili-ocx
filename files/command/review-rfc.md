---
name: review-rfc
description: Review and analyze an existing RFC for quality and implementation readiness
---

# /review-rfc

Review an existing Request for Comments (RFC) document for quality and implementation readiness.

## Purpose

Analyze an RFC against quality criteria and provide actionable improvement recommendations. The command evaluates the document for completeness, clarity, and implementation readiness.

## Usage

```bash
/review-rfc <rfc-path>
```

## Arguments

- `<rfc-path>` (required): Path to the RFC file to review

## Behavior

Routes to Daedalus agent in review mode:

1. **Load RFC Analysis Framework**: Activates rfc-generation skill with quality criteria
2. **Analyze Document**: Evaluates RFC across all 12 sections for completeness and clarity
3. **Check Implementation Readiness**: Assesses technical feasibility, dependencies, and testing strategy
4. **Present Quality Report**: Shows section completeness, technical depth, and readiness assessment
5. **Suggest Improvements**: Provides prioritized, actionable recommendations
6. **User Decides**: Quality scores are presented; user decides whether to proceed with refinement

## Quality Assessment Areas

The review evaluates RFCs for:

- **Completeness**: All 12 required sections present and sufficiently detailed
- **Technical Depth**: Architecture, data models, API design clarity and feasibility
- **Implementation Clarity**: Dependencies, testing strategy, rollout plan specificity
- **Risk Management**: Security, performance, edge case coverage
- **Documentation Quality**: Diagrams, examples, cross-references

## Output

The command generates a quality assessment report including:

- Section-by-section completeness analysis
- Technical depth and clarity assessment
- Implementation readiness score
- Critical gaps identified with priority
- Specific improvement recommendations
- Implementation approval checklist

## Important

**Does NOT auto-modify RFC**. The review presents findings and recommendations; you decide whether to refine the document.

## Example

```bash
/review-rfc .sisyphus/specs/rfc/v1.0.0/RFC-001-task-manager-core.md
```
