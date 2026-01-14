---
name: rfc
description: Create a new Request for Comments (technical design)
agent: seed
---

# /rfc

Create a new RFC for a feature.

## Usage

```
/rfc [feature-name]
```

## What It Does

1. Identifies parent PRD version
2. Gets next RFC number
3. Delegates to **Seed** with rfc-format skill
4. Creates RFC at `.pepper/specs/rfc/v{version}/RFC-{NNN}-{slug}.md`
5. Updates `.pepper/tracking/rfc-status.json`

## Related Commands

- `/rfc-refine` — Refine existing RFC
- `/rfc-review` — Review RFC quality
- `/plan` — Create execution plan from RFCs
