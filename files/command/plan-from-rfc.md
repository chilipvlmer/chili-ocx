---
name: plan-from-rfc
description: Generate work plan from RFCs for Prometheus
---

# /plan-from-rfc

Generate a Prometheus-compatible work plan from RFCs.

## Usage

```bash
/plan-from-rfc [rfc-path]
```

## Arguments

- `rfc-path` (optional): Specific RFC to plan. If omitted, shows available RFCs.

## Behavior

Routes to the **Prometheus** agent which orchestrates work plan generation:

1. **RFC Discovery** - Scans `.sisyphus/specs/rfc/` for available RFC files
2. **Interactive Selection** - If no argument provided:
   - Presents numbered list of RFCs with current status (pending, in-progress, implemented)
   - User selects one or more RFCs to implement
3. **Plan Generation** - Creates detailed work plan with phased task breakdown
4. **Output** - Saves plan to `.sisyphus/plans/{rfc-slug}.md`

## Work Plan Format

Generated plans follow Prometheus plan-protocol with:

- **YAML frontmatter** - Status tracking, phase progression
- **Goal section** - Clear objectives from RFC
- **Context & Decisions** - RFC references and rationales
- **Phased task breakdown** - Organized implementation steps

### RFC Reference Citations

Plans include traceable citations to RFC sections:

```markdown
## Context & Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| Use JWT for auth | Stateless authentication | `ref:RFC-001-auth:section-3` |
| PostgreSQL database | ACID compliance needed | `ref:RFC-002-data:section-2.1` |
```

## Output

**Primary Output:**
- Work plan: `.sisyphus/plans/{rfc-slug}.md`

**Status Update:**
- RFC status file: `.sisyphus/rfc-status.json` (updated to "in-progress")

## Next Steps

After plan creation, use:
- `/execute-plan` - Begin implementation with Prometheus orchestration
