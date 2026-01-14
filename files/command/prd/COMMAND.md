---
name: prd
description: Create a new Product Requirements Document
agent: seed
---

# /prd

Create a new Product Requirements Document.

## Usage

```
/prd [project-name]
```

## Arguments

| Arg | Required | Description |
|-----|----------|-------------|
| project-name | No | Name for the PRD (prompted if not provided) |

## What It Does

1. Delegates to **Seed** agent
2. Seed uses `prd-format` skill
3. Creates PRD at `.pepper/specs/prd/{name}-v1.0.0.md`
4. Updates `.pepper/state.json` with `active_spec`

## Workflow

1. Scoville checks if `.pepper/` exists (inits if needed)
2. Delegates to Seed with project context
3. Seed interviews user about requirements
4. Creates PRD with proper structure
5. Reports completion

## Related Commands

- `/prd-refine` — Refine existing PRD
- `/prd-review` — Review PRD quality
- `/rfc` — Create RFC from PRD
