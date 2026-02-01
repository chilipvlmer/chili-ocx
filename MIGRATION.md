# Migration Guide: Bundle to Profile

**Date**: 2026-02-01  
**Version**: 1.0.1  
**Status**: Live at https://chili-ocx.pages.dev

---

## Overview

Chili-OCX v1.0.1 introduces a new **profile-based installation** method that provides significantly faster updates and cleaner organization. This guide helps you migrate from the legacy bundle installation to the new profile approach.

## Why Migrate?

### Before (Bundle)
```bash
# Update workflow (slow, unreliable)
ocx update --all
# Wait for content hash comparison... might not work at all!
# Time: Variable (5-60+ seconds, often fails)
```

### After (Profile)
```bash
# Update workflow (fast, guaranteed fresh)
ocx profile remove pepper && ocx profile add pepper --from chili-ocx/pepper
# Time: ~1.8 seconds ✅ (3x faster than target!)
```

### Key Benefits

| Aspect | Bundle | Profile |
|--------|--------|---------|
| **Update Speed** | 5-60+ seconds | **1.8 seconds** |
| **Update Reliability** | Content hash (unreliable) | **Force refresh (guaranteed)** |
| **Installation Path** | `.opencode/.opencode/` (nested) | **`~/.config/opencode/profiles/pepper/`** (clean) |
| **Global Access** | Requires `--global` flag | **Built-in profile system** |
| **Configuration** | Mixed with other configs | **Isolated per profile** |

## Migration Steps

### Step 1: Remove Old Bundle Installation

If you previously installed the `pepper-harness` bundle globally:

```bash
# Remove nested .opencode directory
rm -rf ~/.config/opencode/.opencode/
```

If you installed it per-project:

```bash
# In each project directory
rm -rf .opencode/.opencode/
```

### Step 2: Ensure Registry is Added

The profile requires the chili-ocx registry to be configured globally:

```bash
# Add registry (if not already added)
ocx registry add https://chili-ocx.pages.dev --name chili-ocx --global

# Verify registry is added
cat ~/.config/opencode/ocx.jsonc
# Should show:
# "chili-ocx": {
#   "url": "https://chili-ocx.pages.dev"
# }
```

### Step 3: Install Pepper Profile

```bash
# Install the profile
ocx profile add pepper --from chili-ocx/pepper

# Verify installation
ls ~/.config/opencode/profiles/pepper/
# Should show:
# - ocx.jsonc
# - opencode.jsonc
# - AGENTS.md
# - skills/ (directory with 14 skills)
# - agent/ (directory with 7 agents)
# - command/ (directory with 14 commands)
# - plugin/ (directory with pepper-plugin.js)
```

### Step 4: Use the Profile

Launch OpenCode with the pepper profile:

```bash
# Method 1: Via flag
ocx oc -p pepper

# Method 2: Via environment variable
export OCX_PROFILE=pepper
ocx oc

# Method 3: Set as default (add to shell config)
echo 'export OCX_PROFILE=pepper' >> ~/.zshrc  # or ~/.bashrc
```

### Step 5: Verify Agents are Available

In your OpenCode session, check that all 7 agents are available:

```
Press TAB to see available agents:
- scoville-orchestrator
- seed-prd-rfc
- sprout-execution-planner
- jalapeno-coder
- habanero-reviewer
- ghost-explorer
- chipotle-scribe
```

## What Changed?

### Installation Location

**Before:**
```
~/.config/opencode/
└── .opencode/                    ← Nested, confusing
    ├── skills/
    ├── agent/
    ├── plugin/
    └── command/
```

**After:**
```
~/.config/opencode/
└── profiles/
    └── pepper/                   ← Clean, isolated
        ├── ocx.jsonc            # Registry config
        ├── opencode.jsonc       # Profile settings
        ├── AGENTS.md            # Agent instructions
        ├── skills/              # 14 skills
        ├── agent/               # 7 agents
        ├── command/             # 14 commands
        └── plugin/              # 1 plugin
```

### Update Workflow

**Before:**
```bash
# Try to update (unreliable)
ocx update --all
# Often reports "All components are up to date" even when new version exists
# Reason: Content hashing doesn't detect changes reliably
```

**After:**
```bash
# Force fresh install (guaranteed latest)
ocx profile remove pepper && ocx profile add pepper --from chili-ocx/pepper
# Takes ~1.8 seconds
# Always gets the latest version from https://chili-ocx.pages.dev
```

### Component Count

The profile includes **35 components total**:
- **7 agents** (Scoville, Seed, Sprout, Jalapeño, Chipotle, Habanero, Ghost)
- **14 skills** (pepper-protocol, prd-format, rfc-format, planning-workflow, code-philosophy, docs-style, code-review, exploration-protocol, git-mastery, and more)
- **14 commands** (/pepper-init, /prd, /rfc, /plan, /work, /review, /status, etc.)
- **1 plugin** (pepper-plugin.js with 3 custom tools)

## Troubleshooting

### "Profile not found"

**Issue**: `ocx profile add pepper --from chili-ocx/pepper` fails with "Profile not found"

**Solution**: Ensure registry is added globally:
```bash
ocx registry add https://chili-ocx.pages.dev --name chili-ocx --global
```

### "All components are up to date" (Old Behavior)

**Issue**: After migration, `ocx update --all` still shows no updates

**Solution**: Use the new profile refresh workflow instead:
```bash
ocx profile remove pepper && ocx profile add pepper --from chili-ocx/pepper
```

### Agents Not Available

**Issue**: After installation, TAB doesn't show agents

**Solution**: 
1. Verify profile is active: `echo $OCX_PROFILE` should show "pepper"
2. Check installation: `ls ~/.config/opencode/profiles/pepper/agent/` should show 7 agents
3. Restart OpenCode: `pkill -f "ocx oc"` then relaunch with `ocx oc -p pepper`

### Nested .opencode Still Exists

**Issue**: Old `.opencode/.opencode/` directory still present after migration

**Solution**: Safe to delete:
```bash
rm -rf ~/.config/opencode/.opencode/
```

This was from the old bundle installation and is no longer used.

## Backward Compatibility

### Can I Still Use the Bundle?

**Yes!** The `pepper-harness` bundle is still available for users who prefer the traditional installation method:

```bash
ocx add chili-ocx/pepper-harness
```

However, we **strongly recommend** using the profile method for:
- Faster updates (1.8s vs 5-60s)
- Reliable refresh (force reinstall vs content hashing)
- Cleaner organization (isolated profile vs nested .opencode)

### Will the Bundle Be Deprecated?

The bundle will remain available for backward compatibility, but new features and improvements will prioritize the profile installation method.

## Performance Metrics

Real-world testing results (2026-02-01):

| Operation | Time | Status |
|-----------|------|--------|
| `ocx profile remove pepper` | ~0.1s | ✅ Instant |
| `ocx profile add pepper --from chili-ocx/pepper` | ~1.7s | ✅ Fast |
| **Total refresh time** | **~1.8s** | **✅ 3x faster than 5s target!** |

Components installed:
- 35 total components
- All 7 agents available immediately
- All 14 skills loadable
- All 14 commands functional

## Next Steps

1. ✅ Complete migration using steps above
2. ✅ Verify all agents are available (`TAB` in OpenCode)
3. ✅ Test a workflow: `/pepper-init` → `/prd` → `/rfc` → `/plan` → `/work`
4. ✅ Bookmark the fast update command:
   ```bash
   ocx profile remove pepper && ocx profile add pepper --from chili-ocx/pepper
   ```

## Questions or Issues?

- **Documentation**: See [README.md](README.md) for full installation guide
- **Architecture**: See [AGENTS.md](AGENTS.md) for workflow details
- **Issues**: Report at https://github.com/chilipvlmer/chili-ocx/issues

---

**Migration Complete!** Enjoy your faster, cleaner Pepper Harness experience. 🌶️
