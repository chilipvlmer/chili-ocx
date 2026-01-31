# Changelog

All notable changes to this project will be documented in this file.

## [0.1.2] - 2026-01-31

### Breaking Changes
- **Skill Directory Rename**: Changed from `skill/` to `skills/` for OCX v1.4.6 compliance (PR #115)
  - All 13 skill paths updated in registry.json
  - Physical directory renamed from `files/skill/` to `files/skills/`

### Changed
- Updated OCX CLI version requirement from 1.0.16 to 1.4.6
- Updated GitHub Actions workflow to use `npx ocx@1.4.6`
- Build now validates against OCX v1.4.6 schema

### Added
- Comprehensive audit report (docs/AUDIT-REPORT.md)
- Bundle documentation (docs/BUNDLES.md)
- Plugin file duplication notes in README.md

### Migration Guide
To migrate existing installations:
1. Re-install the registry: `ocx registry remove chili-ocx && ocx registry add https://chili-ocx.pages.dev`
2. Re-install components: `ocx add chili-ocx/pepper-harness`
3. Skills will now install to `.opencode/skills/` (plural)

### Fixed
- CF-001: Skill directory mismatch for OCX v1.4.6
- CF-002: OCX CLI version alignment
- MF-001: Documented plugin file duplication
- MF-002: Added bundle dependency documentation

## [Unreleased]

### Fixed
- Build script now copies plugin to all required locations (package.json)
  - Added missing copy to `files/plugin/pepper-plugin.js`
  - Ensures plugin deploys correctly for all use cases
- Seed agent permissions in registry.json
  - Changed from `"edit": "deny"` to proper `.pepper/**` allow pattern
  - Seed and Sprout now have consistent edit permissions
- CONTRIBUTING.md broken references to non-existent AGENTS.md
  - Updated to point to README.md#agents section
  - All documentation links now valid

### Removed
- Legacy .sisyphus/ directory (old Sisyphus harness)
  - Superseded by Pepper harness (.pepper/)
  - 6 files removed
- Obsolete build artifact directories
  - dist-dev-symlink-detection/ (testing artifacts)
  - dist-main/ (old main branch dist)
  - Only canonical dist/ directory remains

### Changed
- AI-generated documentation archived to .pepper/archive/ai-slop/
  - SESSION-SUMMARY.md, PLUGIN-TESTING.md, COMMANDS.md, ARCHITECTURE.md
  - Preserved for historical reference with retention policy
- Completed plans archived to .pepper/plans/
  - RFC-004 completion archived (with noted issues)
- Test reports archived to .pepper/testing/archive/
  - dev-symlink-detection-test-report
  - RFC-004-phase-8-manual-checklist
- Documentation accuracy improvements
  - Updated docs/pepper-structure.md with state.json v1.1.0 schema
  - Fixed README agent table (verified 7 agents correct)

### Added
- Comprehensive plugin development guide (docs/PLUGIN-DEVELOPMENT.md)
  - 507 lines covering architecture, build, testing, debugging
  - 15+ code examples for developers
- Archive structure (.pepper/archive/) with retention policy
  - Subdirectories: ai-slop/, testing/, plans/
  - README explaining archival guidelines
- Development section in README.md
  - Links to plugin development guide
  - Links to Pepper structure documentation
