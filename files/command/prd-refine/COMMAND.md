---
name: prd-refine
description: Refine an existing PRD
agent: seed
---

# Refine PRD

The user wants to refine an existing Product Requirements Document.

**Your task (Seed):**

1. Check `.pepper/state.json` for active PRD:
   - If no active PRD: Ask user which PRD to refine (list files in `.pepper/specs/prd/`)
   - If active PRD exists: Use that one

2. Read the current PRD file

3. Ask user what they want to refine using the `question` tool:
   - "Update vision/problem statement"
   - "Revise success metrics"
   - "Modify features"
   - "Adjust timeline"
   - "Complete rewrite of specific section"
   - "Other changes" (let them describe)

4. Based on their selection, use the `question` tool to gather updates for that section

5. Update the PRD:
   - Increment version appropriately (patch/minor/major)
   - Update the modified sections
   - Add changelog entry at the top
   - Save as new version: `.pepper/specs/prd/{name}-v{new-version}.md`

6. Update `.pepper/state.json` with new version

7. Tell user to switch back to Scoville (TAB → scoville-orchestrator)

## Version Bumping

- **Patch** (1.0.0 → 1.0.1): Minor clarifications, typo fixes
- **Minor** (1.0.0 → 1.1.0): New features, updated metrics
- **Major** (1.0.0 → 2.0.0): Significant vision change, major rewrites

## Changelog Format

```markdown
## Changelog

### v1.1.0 (2026-01-18)
- Updated success metrics to include user engagement
- Added new feature: Social sharing
- Revised timeline for Phase 2
```
