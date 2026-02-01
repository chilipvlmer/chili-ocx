---
rfc: RFC-012
title: Convert Bundle to Profile for Better Update Workflow
prd_version: 1.1.2
status: draft
created: 2026-02-01
updated: 2026-02-01
author: Seed (Artifact Planner)
---

# RFC-012: Convert Bundle to Profile for Better Update Workflow

## 1. Summary

This RFC proposes converting the `pepper-harness` bundle component to an `ocx:profile` component. This change enables a cleaner update workflow where users can quickly refresh their installation by removing and reinstalling the profile, rather than fighting with OCX's content-hashing versioning system.

## 2. Motivation

### Problem Statement
Current workflow using `ocx:bundle` type has critical update issues:

1. **Version Bump Ineffectiveness**: Bumping component versions in `registry.jsonc` has no effect on updates
2. **Content Hashing Opacity**: OCX uses content hashing for updates, but the algorithm is opaque and unreliable
3. **Stuck Updates**: Changes pushed to main take hours/days to propagate, or never update at all
4. **Nested Installation**: Bundle installs to `.opencode/.opencode/` creating confusing nested paths
5. **Cache Hell**: Cloudflare CDN caching prevents fresh deployments from being immediately available

### Real-World Impact
During RFC-011 implementation (adding YAML frontmatter to skills), we experienced:
- 5+ hours of debugging why updates weren't working
- Multiple version bumps (1.0.1 → 1.0.2) with zero effect
- Workflow changes (npx → bunx) with no improvement
- Confirmed that `ocx build` ignores registry component versions entirely

### Proposed Solution
Convert to `ocx:profile` type which:
- Installs to clean location: `~/.config/opencode/profiles/pepper/`
- Can be **force-refreshed**: `ocx profile remove pepper && ocx profile add pepper --from chili-ocx/pepper`
- Takes 5 seconds to update vs hours of debugging
- Matches OCX's intended workflow for shareable configurations

## 3. Detailed Design

### 3.1 Architecture Change

**Current (Bundle):**
```
~/.config/opencode/
└── .opencode/                    ← Nested, messy
    ├── skills/
    ├── agent/
    ├── plugin/
    └── command/
```

**New (Profile):**
```
~/.config/opencode/
└── profiles/
    └── pepper/                   ← Clean, isolated
        ├── ocx.jsonc            # Registry config
        ├── opencode.jsonc       # OpenCode settings
        └── AGENTS.md            # Agent instructions
```

Profile references the bundle as a dependency, triggering installation of all components.

### 3.2 Component Definition

Add to `registry.jsonc`:

```json
{
  "name": "pepper",
  "type": "ocx:profile",
  "description": "Pepper Harness profile for structured AI development workflow",
  "files": [
    {
      "path": "profiles/pepper/ocx.jsonc",
      "target": "ocx.jsonc"
    },
    {
      "path": "profiles/pepper/opencode.jsonc",
      "target": "opencode.jsonc"
    },
    {
      "path": "profiles/pepper/AGENTS.md",
      "target": "AGENTS.md"
    }
  ],
  "dependencies": ["pepper-harness"]
}
```

### 3.3 Profile Files Structure

Create `files/profiles/pepper/` directory with:

**ocx.jsonc:**
```jsonc
{
  "$schema": "https://ocx.kdco.dev/schemas/ocx.json",
  "registries": {
    "chili-ocx": {
      "url": "https://chili-ocx.pages.dev"
    }
  },
  "exclude": [
    "**/CLAUDE.md",
    "**/CONTEXT.md"
  ],
  "include": [
    "**/AGENTS.md"
  ]
}
```

**opencode.jsonc:**
```jsonc
{
  "name": "Pepper Harness",
  "agents": [
    "scoville-orchestrator",
    "seed-prd-rfc",
    "sprout-execution-planner",
    "jalapeno-coder",
    "habanero-reviewer",
    "ghost-explorer",
    "chipotle-scribe"
  ]
}
```

**AGENTS.md:**
```markdown
# Pepper Harness Profile

You are operating with the Pepper Harness - a structured AI development workflow.

## Available Agents
- **Seed**: PRD and RFC creation
- **Sprout**: Execution planning
- **Jalapeño**: Implementation
- **Habanero**: Code review
- **Ghost**: Research and exploration
- **Scoville**: Orchestration
- **Chipotle**: Documentation

## Workflow
1. Create PRD (Seed)
2. Create RFC (Seed)
3. Plan execution (Sprout)
4. Implement (Jalapeño)
5. Review (Habanero)
```

## 4. Implementation Plan

### Phase 1: Create Profile Files (15 min)
- [ ] Create `files/profiles/pepper/` directory
- [ ] Create `ocx.jsonc`
- [ ] Create `opencode.jsonc`
- [ ] Create `AGENTS.md`

### Phase 2: Update Registry (10 min)
- [ ] Add `pepper` profile component to `registry.jsonc`
- [ ] Keep existing `pepper-harness` bundle (for backward compatibility)
- [ ] Bump registry version

### Phase 3: Build and Deploy (5 min)
- [ ] Run `npm run build:registry`
- [ ] Commit and push
- [ ] Verify deployment

### Phase 4: Test Profile Installation (10 min)
- [ ] Test: `ocx profile add pepper --from chili-ocx/pepper`
- [ ] Verify: `~/.config/opencode/profiles/pepper/` exists
- [ ] Test update: Remove and reinstall
- [ ] Document new workflow

## 5. Migration Guide

### For New Users
```bash
# Add the registry
ocx registry add https://chili-ocx.pages.dev --name chili-ocx --global

# Install the profile
ocx profile add pepper --from chili-ocx/pepper

# Use the profile
ocx opencode -p pepper
```

### For Existing Users (Migrating from Bundle)
```bash
# Remove old bundle installation
rm -rf ~/.config/opencode/.opencode/

# Install new profile
ocx profile add pepper --from chili-ocx/pepper
```

### Update Workflow (The Big Win!)
```bash
# When you want fresh updates:
ocx profile remove pepper
ocx profile add pepper --from chili-ocx/pepper

# Done! 5 seconds, guaranteed fresh install.
```

## 6. Alternatives Considered

| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| Keep bundle, fix OCX | Works if fixed | Requires upstream changes | Rejected - out of our control |
| Use local install | Immediate updates | Per-project only | Rejected - we want global |
| **Profile approach** ✅ | Clean updates, fast refresh, OCX-supported | Requires profile definition | **Selected** |

## 7. Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Users confused by both bundle and profile | Document clearly, recommend profile |
| Profile doesn't install components | Verify dependencies work correctly |
| Breaking change for existing users | Keep bundle as legacy option |

## 8. Success Criteria

- [ ] Profile installs cleanly via `ocx profile add`
- [ ] All 7 agents available after profile install
- [ ] All skills loadable via `skill()` command
- [ ] Update workflow (remove + add) works in < 10 seconds
- [ ] No nested `.opencode/.opencode/` paths

## 9. References

- [OCX Profiles Documentation](https://github.com/kdcokenny/ocx/blob/main/docs/PROFILES.md)
- RFC-011: Add YAML Frontmatter to Skills (update issues encountered)
- [OCX Registry Protocol](https://github.com/kdcokenny/ocx/blob/main/docs/REGISTRY_PROTOCOL.md)

---

**Ready for review!** This RFC addresses the core issue: making updates fast, reliable, and frustration-free.
