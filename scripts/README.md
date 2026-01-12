# Testing Scripts

Helper scripts for testing registry branches locally with OCX Ghost Mode.

## Quick Reference

| Script | Purpose | Example |
|--------|---------|---------|
| `test-branch.sh` | Build + launch OpenCode | `./test-branch.sh feature/my-skill` |
| `build-branch.sh` | Build only (no launch) | `./build-branch.sh main` |
| `archive-profile.sh` | Archive after merge | `./archive-profile.sh feature/my-skill` |
| `list-profiles.sh` | View all profiles/builds | `./list-profiles.sh` |
| `clean-builds.sh` | Remove old builds | `./clean-builds.sh` |

## Full Documentation

See [TESTING.md](../TESTING.md) for complete workflow and examples.

## Quick Start

```bash
# Test a branch (full workflow)
./scripts/test-branch.sh feature/code-review

# View all profiles and builds
./scripts/list-profiles.sh

# Clean up after merging
./scripts/archive-profile.sh feature/code-review
```
