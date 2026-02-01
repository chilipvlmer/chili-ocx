# AGENTS.md

Guidelines for AI agents working on this OCX registry.

## Overview

This is an OCX component registry - a collection of reusable AI components that extend OpenCode.
OCX follows the "Copy. Paste. Own." philosophy: components are copied into projects, giving users
full ownership and control.

**Runtime:** Bun (v1.3.5+)  
**Build Tool:** OCX CLI (`bunx ocx build`)  
**Deploy:** Cloudflare Pages (automatic builds on push to main)  
**Live URL:** https://chili-ocx.pages.dev

---

## What You Need to Know

### Only Three Things Matter

When working on this registry, you only edit:

1. **`files/`** - Component source files (skills, plugins, agents)
2. **`registry.jsonc`** - Component manifest (register components here)
3. **`package.json`** - Dependencies (only if building plugins with external deps)

**Everything else is automated or already configured.**

### How Deployment Works

```
Source Files (files/ + registry.jsonc)
  ↓ git push origin main
GitHub Actions
  ↓ runs: bun run build (creates dist/)
  ↓ deploys: dist/
Cloudflare Pages (LIVE)
```

**Key insight:** `dist/` is in `.gitignore` because it's built fresh on every deploy by GitHub Actions.

---

## Quick Reference

```bash
# Build locally
bun run build

# Test on a branch (without deploying)
./scripts/build-branch.sh feature/my-skill
ocx registry add file://$(pwd)/dist-feature-my-skill --name test
ocx add test/my-skill
ocx oc -p test

# Deploy to production
git checkout main
git merge feature/my-skill
git push origin main  # Auto-deploys via GitHub Actions
```

---

## Profile Update Workflow

### Testing Profile Changes Locally

When making changes to profile files (agents, opencode.jsonc, AGENTS.md), test before deploying:

```bash
# 1. Build locally
bun run build

# 2. Test the profile (requires file:// registry support)
# Note: OCX doesn't support file:// for profiles yet, so test via bundle instead
ocx add file://$(pwd)/dist/pepper-harness --cwd /tmp/test-profile

# 3. Verify changes
cat /tmp/test-profile/agent/your-modified-agent.md
```

### Deploying Profile Updates

Profile updates deploy the same way as component updates:

```bash
# 1. Make changes to profile files
vim files/profiles/pepper/opencode.jsonc
vim files/agent/jalapeno-coder.md

# 2. Update version in registry.jsonc
# - Bump pepper profile version (e.g., 1.0.0 → 1.0.1)
# - Bump pepper-harness version if dependencies changed

# 3. Build and test locally
bun run build

# 4. Commit and push
git add .
git commit -m "feat(profile): update jalapeno permissions"
git push origin main  # Auto-deploys via GitHub Actions
```

### Fast Profile Refresh (End User)

End users can update their profile in under 2 seconds:

```bash
# Update to latest version
ocx profile remove pepper && ocx profile add pepper --from chili-ocx/pepper
```

**Timing Results:**
- Profile removal: ~0.1s
- Profile installation: ~1.5s  
- **Total: ~1.7s** ✅

This is the key benefit of the profile architecture - no re-downloading skills/dependencies on every update.

---

## Adding a Component

### 1. Create the File

```bash
# For a skill
mkdir -p files/skill/my-skill
vim files/skill/my-skill/SKILL.md

# For a plugin
vim files/plugin/my-plugin.ts

# For an agent
vim files/agent/my-agent.md
```

### 2. Register in registry.jsonc

```json
{
  "components": [
    {
      "name": "my-skill",
      "type": "ocx:skill",
      "description": "What it does",
      "files": ["skill/my-skill/SKILL.md"]
    }
  ]
}
```

### 3. Test Locally (Optional but Recommended)

```bash
git checkout -b feature/my-skill
./scripts/build-branch.sh feature/my-skill
ocx registry add file://$(pwd)/dist-feature-my-skill --name test
ocx add test/my-skill
ocx oc -p test
```

### 4. Deploy

```bash
git add files/ registry.jsonc
git commit -m "Add my-skill component"
git push origin main  # Deploys automatically
```

---

## Component Types

| Type | Purpose | File Format |
|------|---------|-------------|
| `ocx:skill` | Instructions for AI behavior | Markdown (SKILL.md) |
| `ocx:plugin` | Code that extends OpenCode | TypeScript (.ts) |
| `ocx:agent` | Agent role definitions | Markdown (.md) |
| `ocx:bundle` | Collection of components | JSON manifest |

### Skill Template (files/skill/name/SKILL.md)

```markdown
# Skill Name

Brief description of what this skill enables.

## TL;DR

One-paragraph summary for quick reference.

## When to Use

- Condition 1
- Condition 2

## Instructions

Detailed steps the AI should follow...

## Examples

Show good and bad examples...

## What NOT to Do

- Anti-pattern 1
- Anti-pattern 2
```

### Plugin Template (files/plugin/name.ts)

```typescript
import type { Plugin } from "opencode"

export default {
  name: "my-plugin",
  version: "1.0.0",
  
  onSessionStart: async (ctx) => {
    // Hook logic
  },
  
  tools: [
    // Custom tools
  ]
} satisfies Plugin
```

---

## The 5 Laws of Elegant Defense

All code should follow these principles:

1. **Early Exit** - Guard clauses at the top, fail fast
2. **Parse, Don't Validate** - Use Zod schemas at boundaries
3. **Atomic Predictability** - Same input → same output
4. **Fail Fast, Fail Loud** - Clear errors immediately
5. **Intentional Naming** - Code reads like a sentence

---

## Git Workflow (Branch Strategy)

### Development Branch Workflow

```bash
# 1. Create feature branch (LOCAL ONLY)
git checkout -b feature/my-component

# 2. Make changes
mkdir -p files/skill/my-component
vim files/skill/my-component/SKILL.md
vim registry.jsonc

# 3. Test locally
./scripts/build-branch.sh feature/my-component
# Test with OCX profile mode...

# 4. Commit (STILL LOCAL)
git add .
git commit -m "Add my-component"

# 5. Push branch to GitHub (VISIBLE, NOT DEPLOYED)
git push -u origin feature/my-component

# 6. Merge to main = DEPLOY TO PRODUCTION
git checkout main
git pull origin main
git merge feature/my-component
git push origin main  # ← THIS TRIGGERS DEPLOYMENT
```

### Key Points

- **Feature branches don't deploy** - Only `main` triggers Cloudflare deployment
- **`dist/` is built on every deploy** - Never commit dist/ to Git
- **Test before merging to main** - Use `./scripts/build-branch.sh` for local testing

---

## Troubleshooting

### Build Fails

1. Check `registry.jsonc` syntax (valid JSONC?)
2. Verify all files in `files` arrays exist
3. Run `bunx ocx build . --out dist --verbose`

### Component Not Found After Deploy

1. Verify GitHub Actions completed successfully: https://github.com/chilipvlmer/chili-ocx/actions
2. Check component appears in `dist/index.json` (build locally to verify)
3. Wait 30-60 seconds for Cloudflare CDN to update

### Plugin Not Loading

1. Ensure plugin exports a default object
2. Verify TypeScript syntax is valid
3. Check `satisfies Plugin` type assertion

---

## Plugin Development & Deployment

### Pepper Plugin (Custom Tools)

The Pepper Harness plugin provides 3 custom tools for OpenCode. **Critical deployment discovery:**

#### ⚠️ OpenCode Plugin Loading Behavior

**OpenCode has a hardcoded preference for `executable-commands.js` that overrides profile configuration.**

Even if your `opencode.jsonc` specifies:
```jsonc
"plugin": ["file:///.../pepper-plugin.js"]
```

**OpenCode will load `executable-commands.js` if it exists in the same directory.**

#### Correct Plugin Deployment Process

##### 1. Build the Plugin
```bash
cd plugin
npm run build
# Creates: dist/bundle.js (~8.5 KB)
```

##### 2. Deploy to Profile (for LOCAL testing)
```bash
# IMPORTANT: Deploy as executable-commands.js, NOT pepper-plugin.js
cp dist/bundle.js ~/.config/opencode/profiles/default/plugin/executable-commands.js
```

##### 3. Deploy to Registry (for DISTRIBUTION)
```bash
# For registry, keep the name pepper-plugin.js
cp dist/bundle.js ../files/plugin/pepper-plugin.js

# Rebuild registry
cd ..
npm run build:registry
```

##### 4. Verify Deployment
```bash
# Clear log
echo "=== TEST ===" > /tmp/chili-ocx-plugin.log

# Kill existing instances
pkill -f "ocx oc"
sleep 2

# Launch OpenCode
cd /tmp/pepper-test
ocx oc -p default &
sleep 10

# Check log - should show "Registered 3 custom tools"
cat /tmp/chili-ocx-plugin.log
```

#### Expected Output

**Success:**
```
[timestamp] 🌶️ chili-ocx plugin initializing...
[timestamp]   Context directory: /path/to/dir
[timestamp] 📋 Registered 3 custom tools
[timestamp] ✅ chili-ocx plugin loaded successfully
```

**Failure:**
```
📋 Registered 1 custom tools  ← WRONG! Old version loaded
```

#### Available Tools

| Tool | Command | Purpose |
|------|---------|---------|
| `pepper_init` | `/pepper-init` | Initialize .pepper/ directory structure |
| `pepper_status` | `/status` | Show harness status (PRDs, RFCs, plans) |
| `pepper_notepad_add` | `/notepad <type> "entry"` | Add entry to notepad (learnings/issues/decisions) |

#### Plugin Troubleshooting

**Issue: Plugin shows "1 custom tools"**
- **Cause:** Old version being loaded or wrong filename
- **Fix:** Ensure deployed to `executable-commands.js` with recent timestamp

**Issue: Plugin not loading at all**
- **Cause:** Syntax error or missing file
- **Fix:** Run `node --check ~/.config/opencode/profiles/default/plugin/executable-commands.js`

**Issue: Tools execute but fail**
- **Cause:** `.pepper/` directory not initialized
- **Fix:** Run `/pepper-init` first

#### Key Files

| File | Purpose | Size |
|------|---------|------|
| `plugin/src/index.ts` | Source code | 74 lines |
| `plugin/dist/bundle.js` | Built plugin | 8.5 KB |
| `files/plugin/pepper-plugin.js` | Registry copy | 8.5 KB |
| `~/.config/opencode/profiles/default/plugin/executable-commands.js` | **ACTIVE PLUGIN** | 8.5 KB |
| `/tmp/chili-ocx-plugin.log` | Runtime log | N/A |

#### Quick Test Script

```bash
# One-liner to build, deploy, and test
cd /Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/plugin && npm run build && \
cp dist/bundle.js ~/.config/opencode/profiles/default/plugin/executable-commands.js && \
pkill -f "ocx oc"; sleep 2; echo "TEST" > /tmp/chili-ocx-plugin.log && \
cd /tmp/pepper-test && ocx oc -p default & sleep 10 && \
cat /tmp/chili-ocx-plugin.log | grep "Registered"

# Expected: "Registered 3 custom tools"
```

---

## Documentation Sources

- **OpenCode Reference:** https://raw.githubusercontent.com/kdcokenny/ocx/main/docs/OPENCODE_REFERENCE.md
- **OCX CLI Documentation:** https://github.com/kdcokenny/ocx
- **Registry Protocol:** https://raw.githubusercontent.com/kdcokenny/ocx/main/docs/REGISTRY_PROTOCOL.md

---

## Appendix: Plugin Investigation Findings

### Investigation Summary (Jan 18, 2026)

After 2.5 hours of debugging why the Pepper plugin showed "Registered 1 custom tools" instead of 3, we discovered that **OpenCode has a hardcoded file loading preference** that overrides configuration.

#### Root Cause
- Profile config specified: `"plugin": ["file:///.../pepper-plugin.js"]`
- OpenCode actually loaded: `executable-commands.js` (if it exists)
- Updates to `pepper-plugin.js` were never loaded
- Old version at `executable-commands.js` kept running

#### Investigation Process

**Hypothesis 1: Schema Issue** ❌
- Thought: `tool.schema.enum()` causing silent failures
- Test: Verified Zod schema API was correct
- Result: Schema was fine, not the issue

**Hypothesis 2: Code Structure** ❌
- Thought: Inline object literal causing problems
- Test: Split into explicit variables with logging
- Result: Code structure was fine, but led to discovery

**Hypothesis 3: File Discovery** ✅
- Breakthrough: Diagnostic logs weren't appearing
- Discovery: Found `executable-commands.js` being loaded instead
- Solution: Deploy with correct filename
- Result: All 3 tools immediately worked

#### The Fix

```bash
# WRONG (what we were doing)
cp dist/bundle.js ~/.config/opencode/profiles/default/plugin/pepper-plugin.js

# RIGHT (what works)
cp dist/bundle.js ~/.config/opencode/profiles/default/plugin/executable-commands.js
```

#### Key Learnings

1. **Config can be misleading** - OpenCode ignored the profile configuration
2. **File naming is critical** - `executable-commands.js` has special meaning
3. **Always verify what's running** - Check logs to confirm which file loaded
4. **Test thoroughly** - Don't assume deployment worked, verify tool count
5. **The code was always correct** - 2.5 hours debugging a deployment issue!

#### Tools Created During Investigation

**Automated Testing**
```bash
# Test script with tmux and timeouts
# Launches OpenCode, waits for plugin load, analyzes output
./test-plugin-automated.sh  # (if available in /tmp)
```

**Quick Verification**
```bash
# One-liner to verify plugin loaded correctly
echo "TEST" > /tmp/chili-ocx-plugin.log && \
cd /tmp/pepper-test && ocx oc -p default & sleep 10 && \
cat /tmp/chili-ocx-plugin.log | grep "Registered"
# Expected: "Registered 3 custom tools"
```

#### File Naming Convention Reference

| Context | Filename | Why |
|---------|----------|-----|
| **Local Profile** | `executable-commands.js` | What OpenCode actually loads |
| **Registry** | `pepper-plugin.js` | What users download from registry |
| **Config** | `pepper-plugin.js` | What config says (but gets ignored!) |

#### Debugging Checklist

If plugin shows wrong tool count:

1. ✅ Check which file exists:
   ```bash
   ls -la ~/.config/opencode/profiles/default/plugin/
   ```

2. ✅ Verify file contents:
   ```bash
   grep -c "pepper_init\|pepper_status\|pepper_notepad" ~/.config/opencode/profiles/default/plugin/executable-commands.js
   # Should show: 9 (3 tools × 3 occurrences each)
   ```

3. ✅ Check what loaded:
   ```bash
   cat /tmp/chili-ocx-plugin.log
   # Should show: "Registered 3 custom tools"
   ```

4. ✅ Verify timestamps:
   ```bash
   ls -lh ~/.config/opencode/profiles/default/plugin/executable-commands.js
   # Should be recent (after your last build)
   ```

#### Common Mistakes

**Mistake 1: Deploying to wrong filename**
```bash
# ❌ WRONG - OpenCode won't load this
cp dist/bundle.js ~/.config/opencode/profiles/default/plugin/pepper-plugin.js

# ✅ RIGHT - OpenCode loads this preferentially
cp dist/bundle.js ~/.config/opencode/profiles/default/plugin/executable-commands.js
```

**Mistake 2: Not verifying deployment**
```bash
# ❌ WRONG - Assuming it worked
npm run build && cp dist/bundle.js ~/.../executable-commands.js

# ✅ RIGHT - Verify it loaded
npm run build && cp dist/bundle.js ~/.../executable-commands.js && \
echo "TEST" > /tmp/chili-ocx-plugin.log && \
cd /tmp/pepper-test && ocx oc -p default & sleep 10 && \
cat /tmp/chili-ocx-plugin.log | grep "Registered"
```

**Mistake 3: Multiple plugin files**
```bash
# ❌ WRONG - Causes confusion
ls ~/.config/opencode/profiles/default/plugin/
# Shows: executable-commands.js AND pepper-plugin.js

# ✅ RIGHT - Only one active plugin
# Remove pepper-plugin.js, keep only executable-commands.js
```

#### Success Indicators

When everything is working correctly, you'll see:

```
[timestamp] 🌶️ chili-ocx plugin initializing...
[timestamp]   Context directory: /path/to/dir
[timestamp] 📋 Registered 3 custom tools
[timestamp] ✅ chili-ocx plugin loaded successfully
```

And in OpenCode:
- `/pepper-init` command works
- `/status` command works
- `/notepad learnings "test"` command works

#### Further Investigation Needed

Questions for future work:
- Why does OpenCode prefer `executable-commands.js`?
- Is this documented anywhere in OpenCode?
- Can we report this as unexpected behavior?
- Should we add validation to prevent this confusion?

---

*Built with OCX Registry Starter. Visit https://github.com/kdcokenny/ocx for more information.*
