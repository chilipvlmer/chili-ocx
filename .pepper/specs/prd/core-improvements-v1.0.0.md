# PRD: Chili-OCX Core Improvements - Workspace Detection

**Version**: 1.0.0  
**Status**: Draft  
**Author**: Jalapeño  
**Date**: 2026-01-18  
**Priority**: P0 - Critical

---

## 1. Executive Summary

Chili-OCX agents currently fail to detect git repositories and perform file operations when running in symlinked workspaces (e.g., OpenCode Ghost environments in `/tmp/ocx-ghost-*`). This blocks the meta-development workflow and causes cascading failures across all agent operations.

This PRD defines improvements to workspace detection, path resolution, and error handling to ensure agents work transparently with symlinks, improving reliability and developer experience.

**Impact**: Enables agents to operate correctly in Ghost workspaces and any symlinked development environment.

---

## 2. Problem Statement

### 2.1 Current State

- Agents fail to detect git repositories when the workspace is accessed through a symlink
- File operations fail due to path confusion between symlink and real paths
- Error messages are cryptic and don't indicate symlink-related issues
- No validation of `.pepper/` directory structure during initialization

### 2.2 Pain Points

**Critical (P0)**:
- **Symptom**: "Not a git repository" errors in valid git repos
- **Root Cause**: Git detection runs on symlink path without resolution
- **Frequency**: 100% of Ghost workspace sessions
- **Workaround**: None - blocks all git-aware agent operations

**High (P1)**:
- **Symptom**: Path confusion in error messages and logs
- **Impact**: Developers cannot debug issues effectively
- **Example**: Agent reports working in `/tmp/ocx-ghost-abc123` but git operations fail

### 2.3 User Impact

- **Meta-development blocked**: Cannot use Chili-OCX to improve itself in Ghost environments
- **Trust erosion**: Agents appear broken in standard development setups
- **Time waste**: Developers manually work around agent limitations

---

## 3. Goals and Success Metrics

### 3.1 Goals

1. **G1**: Agents correctly identify git repositories through symlinks
2. **G2**: All file and git operations work transparently with symlinked workspaces
3. **G3**: Error messages clearly indicate workspace setup issues
4. **G4**: `.pepper/` structure is validated and self-healing

### 3.2 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Git detection success rate in symlinked workspaces | 100% | Automated tests |
| False "not a git repo" errors | 0 | Error logs |
| Developer clarity on workspace setup | >90% | Error message comprehension |
| `.pepper/` structure validation coverage | 100% | Unit tests |

### 3.3 Non-Goals

- Git worktree detection and handling (future enhancement)
- Monorepo-specific path resolution (separate PRD)
- Advanced path normalization beyond symlinks (YAGNI)
- Windows junction handling beyond basic symlink resolution (defer until needed)

---

## 4. Solution Overview

### 4.1 Core Strategy

Implement **universal symlink resolution** across all agents using Node.js built-in `fs.realpathSync()`:

1. **Detection**: Check if workspace path is a symlink
2. **Resolution**: Resolve to canonical real path using `fs.realpathSync()`
3. **Caching**: Store resolved path in `state.json` for session persistence
4. **Transparency**: Report both symlink and real paths in logs/errors
5. **Validation**: Ensure `.pepper/` structure exists and is valid

### 4.2 Technical Approach

```javascript
// Pseudocode example
function resolveWorkspacePath(path) {
  try {
    const realPath = fs.realpathSync(path);
    if (realPath !== path) {
      log(`Symlink detected: ${path} → ${realPath}`);
    }
    return realPath;
  } catch (error) {
    throw new WorkspaceError(`Cannot resolve path: ${error.message}`);
  }
}
```

**Why `fs.realpathSync()`**:
- Cross-platform (Unix symlinks, Windows junctions)
- No shell command dependency
- Handles chained symlinks automatically
- Synchronous - simpler error handling

### 4.3 Implementation Points

1. **Plugin Utility** (`plugins/utils/workspace.js`):
   - `resolveWorkspacePath(path)` - Symlink resolution
   - `validatePepperStructure(path)` - Structure validation
   - `getWorkspaceInfo(path)` - Combined detection logic

2. **pepper_init Enhancement**:
   - Resolve and store real path in `state.json`
   - Add `workspacePath.symlink` and `workspacePath.real` fields
   - Validate or create `.pepper/` structure

3. **Agent Prompt Updates** (all agents globally):
   - Document symlink awareness
   - Instruct to use resolved paths for git/file operations
   - Include both paths in error reporting

4. **Error Message Improvements**:
   - Detect symlink-related failures
   - Suggest running `pepper_init` if structure invalid
   - Show both symlink and real paths for clarity

5. **Structure Validation**:
   - Check required `.pepper/` subdirectories
   - Validate `state.json` schema
   - Auto-repair minor issues (missing subdirs)

---

## 5. Technical Requirements

### 5.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Detect if workspace path is a symlink | P0 |
| FR-2 | Resolve symlinks to canonical real path | P0 |
| FR-3 | Cache resolved path in `state.json` | P0 |
| FR-4 | Validate `.pepper/` directory structure | P0 |
| FR-5 | Report both symlink and real paths in errors | P1 |
| FR-6 | Refresh resolved path on ENOENT errors | P1 |
| FR-7 | Auto-repair missing `.pepper/` subdirectories | P2 |

### 5.2 Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Path resolution latency | <10ms (cached) |
| NFR-2 | Cross-platform compatibility | macOS, Linux, Windows |
| NFR-3 | Zero external dependencies | Node.js stdlib only |
| NFR-4 | Backward compatibility | Existing workspaces unaffected |

### 5.3 Edge Cases

| Scenario | Handling |
|----------|----------|
| Broken symlink (target doesn't exist) | Throw `WorkspaceError` with clear message |
| Permission denied on symlink target | Throw `WorkspaceError` with permission hint |
| Circular symlinks | `fs.realpathSync()` throws - catch and report |
| Symlink removed during session | Refresh on ENOENT, update `state.json` |
| Non-symlink regular directory | Pass through unchanged (no regression) |
| Windows junction vs symlink | `fs.realpathSync()` handles both |

---

## 6. User Stories

### 6.1 Primary User: Meta-Developer

**Story 1**: Git Detection in Ghost Workspace
```
AS A meta-developer
WHEN I run Chili-OCX in an OpenCode Ghost workspace
THEN agents should detect the git repository correctly
AND all git operations should work without errors
```

**Story 2**: Clear Error Messages
```
AS A developer debugging agent issues
WHEN an operation fails due to workspace setup
THEN I should see both the symlink path and real path
AND the error should suggest concrete next steps
```

**Story 3**: Transparent Operation
```
AS A developer using Chili-OCX
WHEN my workspace is symlinked
THEN agents should work identically to non-symlinked workspaces
AND I should not need to think about symlinks
```

---

## 7. Testing Strategy

### 7.1 Test Scenarios

**TS-1: Ghost Workspace Symlinks**
- Setup: Create symlink `/tmp/test-ghost-abc → /real/project`
- Execute: Run `pepper_init` and git detection
- Verify: Git repo detected, operations succeed

**TS-2: Manually Created Symlinks**
- Setup: `ln -s /real/path /symlink/path`
- Execute: Initialize and run agent commands
- Verify: All operations use resolved path

**TS-3: Regular Directories (No Regression)**
- Setup: Non-symlinked directory
- Execute: Run all agent operations
- Verify: Behavior unchanged from before

**TS-4: Broken Symlinks**
- Setup: Create symlink to non-existent target
- Execute: Run `pepper_init`
- Verify: Clear error message about broken symlink

**TS-5: Permission Errors**
- Setup: Symlink to directory with no read permissions
- Execute: Attempt workspace resolution
- Verify: Error message indicates permission issue

### 7.2 Acceptance Criteria

- [ ] All test scenarios pass on macOS, Linux
- [ ] Windows testing (if available) or documented as untested
- [ ] Zero regressions in existing non-symlinked workspaces
- [ ] Error messages tested for clarity with 3+ developers
- [ ] Performance: Path resolution <10ms (99th percentile)

---

## 8. Implementation Plan

### 8.1 RFC Breakdown

This PRD will be implemented via the following RFCs:

1. **RFC-001: Workspace Path Resolution Utility**
   - Scope: Create `plugins/utils/workspace.js` with symlink resolution
   - Deliverable: Tested utility functions

2. **RFC-002: pepper_init Enhancement**
   - Scope: Update `pepper_init` to resolve and store paths
   - Deliverable: Updated `state.json` schema and init logic

3. **RFC-003: Agent Prompt Updates**
   - Scope: Update all agent system prompts for symlink awareness
   - Deliverable: Updated prompt templates

4. **RFC-004: Error Message Improvements**
   - Scope: Enhanced error messages with path information
   - Deliverable: Updated error handling across plugins

5. **RFC-005: Structure Validation Utilities**
   - Scope: `.pepper/` directory validation and auto-repair
   - Deliverable: Validation functions and tests

### 8.2 Phases

**Phase 1: Foundation** (RFC-001, RFC-002)
- Implement core symlink resolution
- Update `pepper_init` and `state.json`
- **Milestone**: Symlinks resolved and cached

**Phase 2: Integration** (RFC-003, RFC-004)
- Update agent prompts globally
- Improve error messages
- **Milestone**: Agents work in symlinked workspaces

**Phase 3: Hardening** (RFC-005)
- Structure validation
- Edge case handling
- **Milestone**: Production-ready reliability

### 8.3 Dependencies

- None - uses Node.js stdlib only

### 8.4 Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Windows compatibility issues | High | Medium | Test on Windows, document limitations |
| Performance regression | Medium | Low | Cache resolved paths, benchmark |
| Breaking existing workflows | High | Low | Comprehensive regression testing |
| Symlink security concerns | Medium | Low | Document security model, no privilege escalation |

---

## 9. Open Questions

1. **Q**: Should we support relative symlinks vs absolute symlinks differently?
   **A**: No - `fs.realpathSync()` resolves both to absolute paths

2. **Q**: How often should we refresh the cached resolved path?
   **A**: Only on ENOENT errors - symlinks rarely change during sessions

3. **Q**: Should we warn users when operating on symlinked workspaces?
   **A**: Info log only - symlinks are common and valid

4. **Q**: What about symlinks within the workspace (not at workspace root)?
   **A**: Out of scope - handle workspace root only for now

---

## 10. Appendix

### 10.1 Current `state.json` Schema

```json
{
  "version": "1.0.0",
  "initialized": "2026-01-18T12:00:00Z",
  "workspacePath": "/tmp/ocx-ghost-abc123"
}
```

### 10.2 Proposed `state.json` Schema

```json
{
  "version": "1.1.0",
  "initialized": "2026-01-18T12:00:00Z",
  "workspacePath": {
    "symlink": "/tmp/ocx-ghost-abc123",
    "real": "/Users/dev/chili-ocx",
    "isSymlink": true,
    "resolvedAt": "2026-01-18T12:00:00Z"
  }
}
```

### 10.3 References

- Node.js `fs.realpathSync()`: https://nodejs.org/api/fs.html#fsrealpathsyncpath-options
- Git symlink handling: Git follows symlinks automatically when using real paths
- OpenCode Ghost workspace structure: Temporary symlinks in `/tmp/ocx-ghost-*`

### 10.4 Glossary

- **Ghost Workspace**: OpenCode temporary workspace accessed via symlink
- **Real Path**: Canonical absolute path after resolving all symlinks
- **Symlink Path**: Path containing symlink components
- **Workspace Root**: Top-level directory containing `.pepper/` and project files

---

**Document Status**: Ready for RFC breakdown and implementation
