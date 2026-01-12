# Testing Guide

Complete guide for testing registry branches locally using OCX Ghost Mode.

## 🎯 Overview

This registry uses **OCX Ghost Mode** with **branch-specific profiles** to test components locally before deploying to production.

### Architecture

```
Branch                Ghost Profile          Build Directory
──────                ─────────────          ───────────────
main              →   main                →  dist-main/
feature/skill-a   →   feature-skill-a     →  dist-feature-skill-a/
experimental/x    →   experimental-x      →  dist-experimental-x/
```

## 🚀 Quick Start

### Test a Branch

```bash
# Switch to branch, build, and launch OpenCode for testing
./scripts/test-branch.sh feature/my-new-skill
```

That's it! The script will:
1. ✅ Switch to the branch
2. ✅ Build registry to `dist-feature-my-new-skill/`
3. ✅ Create/activate ghost profile `feature-my-new-skill`
4. ✅ Configure local registry
5. ✅ Launch OpenCode with the ghost profile

## 📋 Complete Workflow

### 1. Create Feature Branch

```bash
cd /Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx

# Create new feature branch
git checkout -b feature/code-review

# Add your component
mkdir -p files/skill/code-review
vim files/skill/code-review/SKILL.md

# Register in manifest
vim registry.jsonc
```

### 2. Build Registry

**Option A: Build only (no OpenCode launch)**
```bash
./scripts/build-branch.sh feature/code-review
```

**Option B: Build and test (launches OpenCode)**
```bash
./scripts/test-branch.sh feature/code-review
```

### 3. Install Components in Ghost Profile

Inside the launched OpenCode session:
```bash
# Install your new component
ocx ghost add chili-ocx/code-review

# Or install from local registry explicitly
ocx ghost add chili-ocx/code-review --registry file:///Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/dist-feature-code-review
```

### 4. Test in OpenCode

- Interact with the AI using your new component
- Verify behavior matches expectations
- Test edge cases
- Check documentation clarity

### 5. Iterate

```bash
# Exit OpenCode (Ctrl+C)

# Make changes
vim files/skill/code-review/SKILL.md

# Rebuild (still on feature branch)
bunx ocx build . --out dist-feature-code-review

# Test again
./scripts/test-branch.sh feature/code-review
```

### 6. Deploy to Production

Once testing is complete:

```bash
# Merge to main
git checkout main
git merge feature/code-review

# Push (auto-deploys to Cloudflare Pages)
git push

# Archive the test profile
./scripts/archive-profile.sh feature/code-review
```

## 🛠️ Available Scripts

### `test-branch.sh <branch-name>`
**Full testing workflow** - Build and launch OpenCode

```bash
./scripts/test-branch.sh main
./scripts/test-branch.sh feature/code-review
./scripts/test-branch.sh experimental/agents
```

### `build-branch.sh <branch-name>`
**Build only** - No OpenCode launch

```bash
./scripts/build-branch.sh feature/code-review
```

### `archive-profile.sh <branch-name>`
**Archive profile** - After merging/deleting branch

```bash
# After merging feature/code-review to main
./scripts/archive-profile.sh feature/code-review
```

### `list-profiles.sh`
**View all profiles** - Active and archived

```bash
./scripts/list-profiles.sh
```

### `clean-builds.sh`
**Clean old builds** - Remove unused dist-* directories

```bash
./scripts/clean-builds.sh
```

## 📂 Directory Structure

```
chili-ocx/
├── dist-main/                      # Main branch build
├── dist-feature-code-review/       # Feature branch build
├── dist-experimental-agents/       # Experimental branch build
│
├── .archived/                      # Archived profiles/builds
│   ├── profiles/
│   │   └── feature-code-review-20260112-153045.json
│   └── builds/
│       └── dist-feature-code-review-20260112-153045/
│
└── scripts/                        # Testing helper scripts
    ├── test-branch.sh
    ├── build-branch.sh
    ├── archive-profile.sh
    ├── list-profiles.sh
    └── clean-builds.sh
```

## 🔄 Multi-Branch Testing

Test multiple branches simultaneously in different terminals:

**Terminal 1:**
```bash
./scripts/test-branch.sh feature/skill-a
# OpenCode launches with feature-skill-a profile
```

**Terminal 2:**
```bash
./scripts/test-branch.sh feature/skill-b
# OpenCode launches with feature-skill-b profile
```

Each OpenCode instance is **completely isolated** with its own:
- Ghost profile
- Registry build
- Installed components

## 🎯 Best Practices

### 1. Profile Naming

Profiles mirror branch names (with `/` replaced by `-`):
- `main` → Profile: `main`
- `feature/code-review` → Profile: `feature-code-review`
- `experimental/agents` → Profile: `experimental-agents`

### 2. Build Strategy

Always **rebuild** after making changes:

```bash
# Make changes
vim files/skill/my-skill/SKILL.md

# Get current branch
BRANCH=$(git branch --show-current)
PROFILE=$(echo "$BRANCH" | sed 's/\//-/g')

# Rebuild
bunx ocx build . --out "dist-${PROFILE}"

# Test
./scripts/test-branch.sh "$BRANCH"
```

### 3. Profile Lifecycle

```
Create → Test → Merge → Archive

1. Create:  ./scripts/test-branch.sh feature/new-skill
2. Test:    Use OpenCode, iterate, rebuild
3. Merge:   git merge feature/new-skill
4. Archive: ./scripts/archive-profile.sh feature/new-skill
```

### 4. Cleanup

Periodically clean up old builds:

```bash
# Remove all old builds except current branch
./scripts/clean-builds.sh

# View what's archived
./scripts/list-profiles.sh
```

## 🐛 Troubleshooting

### Profile Already Exists

```bash
# If profile exists, test-branch.sh reuses it
# To start fresh, archive first:
./scripts/archive-profile.sh feature/code-review
./scripts/test-branch.sh feature/code-review
```

### Build Directory Issues

```bash
# Clean all builds and start fresh
rm -rf dist-*
./scripts/test-branch.sh main
```

### Ghost Mode Not Initialized

```bash
# Initialize manually
ocx ghost init

# Then retry
./scripts/test-branch.sh main
```

### Registry Not Found in Ghost Profile

```bash
# Check registry configuration
ocx ghost registry list

# Add local registry manually
BRANCH=$(git branch --show-current)
PROFILE=$(echo "$BRANCH" | sed 's/\//-/g')
ocx ghost registry add chili-local "file://$(pwd)/dist-${PROFILE}"
```

## 📚 Examples

### Example 1: Testing a New Skill

```bash
# 1. Create branch
git checkout -b feature/git-workflow

# 2. Add component
mkdir -p files/skill/git-workflow
cat > files/skill/git-workflow/SKILL.md << 'EOF'
# Git Workflow

A skill for managing git branches and commits effectively.

## TL;DR
...
EOF

# 3. Register component
# Edit registry.jsonc and add:
# {
#   "name": "git-workflow",
#   "type": "ocx:skill",
#   "description": "Git branch and commit management",
#   "files": ["skill/git-workflow/SKILL.md"]
# }

# 4. Test
./scripts/test-branch.sh feature/git-workflow

# 5. In OpenCode, install and test
ocx ghost add chili-ocx/git-workflow

# 6. Iterate until satisfied
# Exit OpenCode, edit files, rebuild, retest

# 7. Deploy
git checkout main
git merge feature/git-workflow
git push

# 8. Clean up
./scripts/archive-profile.sh feature/git-workflow
```

### Example 2: Testing Multiple Versions

```bash
# Test stable version (main)
./scripts/test-branch.sh main
# → Opens OpenCode with production components

# In another terminal, test experimental version
./scripts/test-branch.sh experimental/new-feature
# → Opens OpenCode with experimental components

# Compare behavior side-by-side
```

## 🎓 Advanced Usage

### Custom Registry URL

```bash
# Build to custom location
bunx ocx build . --out ~/Desktop/test-registry

# Add to ghost profile
ocx ghost registry add custom-test file://~/Desktop/test-registry
```

### Manual Profile Management

```bash
# Create profile manually
ocx ghost profile add my-test-profile

# Switch profiles
ocx ghost profile use my-test-profile

# View profile config
ocx ghost profile show my-test-profile

# Launch OpenCode with specific profile
ocx ghost opencode --profile my-test-profile
```

### Testing Production Before Deploy

```bash
# Test what will be deployed (main branch)
git checkout main
./scripts/test-branch.sh main

# Verify everything works
# Then deploy:
git push
```

## 📖 Related Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) - Component creation guidelines
- [AGENTS.md](AGENTS.md) - Component best practices
- [README.md](README.md) - Registry overview
- [OCX Documentation](https://github.com/kdcokenny/ocx) - Official OCX docs

---

**Happy Testing! 🌶️**
