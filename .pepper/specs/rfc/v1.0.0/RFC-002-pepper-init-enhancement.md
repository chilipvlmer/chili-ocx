# RFC-002: pepper_init Enhancement - Workspace Path Resolution Integration

**Status**: Implemented
**Version**: 1.0.0
**Author**: Seed
**Created**: 2026-01-18
**Implemented**: 2026-01-18
**Commit**: 8ee3c2419e1eee58ca92d60a37a70a8c49ccf1bb
**PRD Reference**: core-improvements-v1.0.0.md
**Priority**: P0 - Critical
**Phase**: Foundation (Phase 1)
**Dependencies**: RFC-001 (Implemented)

---

## 1. Overview

### 1.1 Purpose
Integrate workspace path resolution utilities (from RFC-001) into the `pepper_init` tool to enable Pepper harness initialization in symlinked Ghost workspaces.

### 1.2 Scope

**In Scope**:
- Import and use `getWorkspaceInfo()` from `./workspace`
- Resolve `projectDir` parameter to handle symlinks
- Update `state.json` schema from v1.0.0 to v1.1.0
- Store workspace path information (symlink, real, isSymlink, resolvedAt)
- Use resolved real path for all file operations
- Maintain backward compatibility

**Out of Scope**:
- Agent prompt updates (RFC-003)
- Error message improvements (RFC-004)
- Structure validation beyond initialization (RFC-005)

### 1.3 Success Criteria
- [x] pepper_init works in symlinked Ghost workspaces
- [x] state.json v1.1.0 contains workspace path info
- [x] All file operations use resolved real path
- [x] Backward compatible with existing .pepper/ directories
- [x] No external dependencies added
- [x] Manual testing in Ghost workspace passes

---

## 2. Technical Design

### 2.1 Current Implementation

File: `plugin/src/utils/pepper-io.ts`
Function: `initPepperStructure(projectDir: string): string`

**Current Behavior**:
- Takes `projectDir` as-is (no symlink resolution)
- Creates `.pepper/` at `join(projectDir, ".pepper")`
- Writes state.json v1.0.0 with simple structure
- No workspace path information stored

**Current state.json v1.0.0**:
```json
{
  "version": "1.0.0",
  "session_ids": [],
  "auto_continue": false
}
```

### 2.2 Proposed Changes

**New state.json v1.1.0**:
```json
{
  "version": "1.1.0",
  "initialized": "2026-01-18T12:00:00.000Z",
  "workspacePath": {
    "symlink": "/tmp/ocx-ghost-abc123",
    "real": "/Users/dev/chili-ocx",
    "isSymlink": true,
    "resolvedAt": "2026-01-18T12:00:00.000Z"
  },
  "session_ids": [],
  "auto_continue": false
}
```

**Implementation Changes**:

1. Import workspace utilities:
```typescript
import { getWorkspaceInfo, WorkspaceError } from './workspace';
```

2. Resolve workspace path at function start:
```typescript
export function initPepperStructure(projectDir: string): string {
  // NEW: Resolve workspace path
  let workspaceInfo;
  try {
    workspaceInfo = getWorkspaceInfo(projectDir);
  } catch (error) {
    if (error instanceof WorkspaceError) {
      return `❌ Failed to resolve workspace path: ${error.message}`;
    }
    throw error;
  }

  // Use real path for all operations
  const resolvedDir = workspaceInfo.real;
  const pepperDir = join(resolvedDir, ".pepper");
  
  // ... rest of function uses resolvedDir
}
```

3. Update state.json structure:
```typescript
const initialState = {
  version: "1.1.0",  // CHANGED
  initialized: new Date().toISOString(),  // NEW
  workspacePath: workspaceInfo,  // NEW
  session_ids: [],
  auto_continue: false
};
```

4. Update success message to show both paths if symlinked:
```typescript
let successMessage = `✅ Initialized .pepper/ structure`;

if (workspaceInfo.isSymlink) {
  successMessage += `\n\n📍 Workspace resolved:\n`;
  successMessage += `  Symlink: ${workspaceInfo.symlink}\n`;
  successMessage += `  Real path: ${workspaceInfo.real}`;
}

successMessage += `\n\nCreated:...`;
```

### 2.3 Error Handling

**Scenario 1: Broken Symlink**
```typescript
// Input: /tmp/broken-link → /nonexistent
// WorkspaceError thrown with code ENOENT
// Return: "❌ Failed to resolve workspace path: Path does not exist: /tmp/broken-link"
```

**Scenario 2: Permission Denied**
```typescript
// Input: /restricted-symlink
// WorkspaceError thrown with code EACCES
// Return: "❌ Failed to resolve workspace path: Permission denied accessing path: ..."
```

**Scenario 3: Already Initialized**
```typescript
// Check happens AFTER path resolution
// If .pepper/ exists at resolved path, return early as before
```

---

## 3. Implementation Details

### 3.1 Complete Updated Function

```typescript
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";
import { getWorkspaceInfo, WorkspaceError } from './workspace';

export function initPepperStructure(projectDir: string): string {
  // Resolve workspace path (handles symlinks)
  let workspaceInfo;
  try {
    workspaceInfo = getWorkspaceInfo(projectDir);
  } catch (error) {
    if (error instanceof WorkspaceError) {
      return `❌ Failed to resolve workspace path: ${error.message}

Please ensure:
- The path exists and is accessible
- You have permission to read the directory
- If using a symlink, the target exists`;
    }
    throw error;
  }

  // Use resolved real path for all operations
  const resolvedDir = workspaceInfo.real;
  const pepperDir = join(resolvedDir, ".pepper");
  
  if (existsSync(pepperDir)) {
    return "✅ .pepper/ already initialized\n\nRun /status to see current state.";
  }

  // Create directory structure
  const dirs = [
    "specs/prd",
    "specs/rfc",
    "plans",
    "tracking",
    "notepad",
    "drafts"
  ];

  for (const dir of dirs) {
    mkdirSync(join(pepperDir, dir), { recursive: true });
  }

  // Write initial state.json with workspace info
  const initialState = {
    version: "1.1.0",
    initialized: new Date().toISOString(),
    workspacePath: {
      symlink: workspaceInfo.symlink,
      real: workspaceInfo.real,
      isSymlink: workspaceInfo.isSymlink,
      resolvedAt: workspaceInfo.resolvedAt
    },
    session_ids: [],
    auto_continue: false
  };

  writeFileSync(
    join(pepperDir, "state.json"),
    JSON.stringify(initialState, null, 2)
  );

  // Write empty notepad files
  const emptyNotepad = {
    version: "1.0.0",
    entries: []
  };

  for (const notepadFile of ["learnings.json", "issues.json", "decisions.json"]) {
    writeFileSync(
      join(pepperDir, "notepad", notepadFile),
      JSON.stringify(emptyNotepad, null, 2)
    );
  }

  // Write empty tracking files
  writeFileSync(
    join(pepperDir, "tracking/rfc-status.json"),
    "{}"
  );

  // Create empty plan.md template
  const planTemplate = `# Execution Plan

> Created: ${new Date().toISOString().split('T')[0]}

## Current Status
- No active plan yet
- Run /prd to create a Product Requirements Document
- Run /plan to generate an execution plan from a PRD

---

## Tasks
(Tasks will appear here after running /plan)
`;

  writeFileSync(join(pepperDir, "plan.md"), planTemplate);

  // Build success message
  let successMessage = `✅ Initialized .pepper/ structure`;

  if (workspaceInfo.isSymlink) {
    successMessage += `\n\n📍 Workspace resolved:\n`;
    successMessage += `  Symlink: ${workspaceInfo.symlink}\n`;
    successMessage += `  Real path: ${workspaceInfo.real}`;
  }

  successMessage += `\n\nCreated:
- specs/prd/ - Product Requirements Documents
- specs/rfc/ - Request for Comments (technical designs)
- plans/ - Execution plans
- tracking/ - Progress tracking
- notepad/ - Learnings, issues, decisions
- state.json - Session state

Next steps:
- Run /prd to create your first PRD
- Run /status to verify setup`;

  return successMessage;
}
```

### 3.2 Backward Compatibility

**Existing .pepper/ directories** (created with v1.0.0):
- Will continue to work
- `readPepperState()` should handle both schemas
- Consider migration function for future RFC

**Reading state.json**:
```typescript
// Current readPepperState works with both versions
// v1.0.0: workspacePath is undefined (graceful degradation)
// v1.1.0: workspacePath object available
```

---

## 4. Testing Strategy

### 4.1 Manual Test Cases

**Test 1: Ghost Workspace (Symlinked)**
```bash
# Setup
ln -s /Users/dev/chili-ocx /tmp/ocx-ghost-test123
cd /tmp/ocx-ghost-test123

# Execute
# Call pepper_init

# Expected Result:
# - .pepper/ created at /Users/dev/chili-ocx/.pepper (real path)
# - state.json shows symlink and real paths
# - Success message shows both paths
```

**Test 2: Regular Directory**
```bash
# Setup
cd /Users/dev/chili-ocx

# Execute  
# Call pepper_init

# Expected Result:
# - .pepper/ created at /Users/dev/chili-ocx/.pepper
# - state.json shows symlink: null, real: /Users/dev/chili-ocx
# - Success message doesn't show symlink info
```

**Test 3: Broken Symlink**
```bash
# Setup
ln -s /nonexistent /tmp/broken-link
cd /tmp/broken-link

# Execute
# Call pepper_init

# Expected Result:
# - Error message: "Failed to resolve workspace path: Path does not exist..."
# - No .pepper/ created
# - Helpful error message with troubleshooting
```

**Test 4: Already Initialized**
```bash
# Setup: Run pepper_init twice

# Expected Result:
# - Second run returns "already initialized" message
# - No files overwritten
```

### 4.2 Acceptance Criteria

- [x] Manual test 1 passes (Ghost workspace)
- [x] Manual test 2 passes (regular directory)
- [x] Manual test 3 passes (broken symlink)
- [x] Manual test 4 passes (already initialized)
- [x] state.json v1.1.0 schema validated
- [x] No regressions in existing functionality
- [x] Error messages are clear and actionable

---

## 5. Migration Considerations

**Future Enhancement** (not in this RFC):
- Add migration function to upgrade existing v1.0.0 state.json to v1.1.0
- Run on first /status call after upgrade
- RFC-005 (structure validation) can handle this

**Current Approach**:
- New installations get v1.1.0
- Existing installations continue with v1.0.0
- Both work correctly (graceful degradation)

---

## 6. Dependencies

**Requires**:
- RFC-001 workspace utilities (✅ Implemented)
  - `getWorkspaceInfo()` function
  - `WorkspaceError` class

**Blocks**:
- RFC-003 (agent prompts) - needs workspace info in state
- RFC-005 (structure validation) - needs consistent state schema

---

## 7. Implementation Checklist

### 7.1 For Jalapeño

- [ ] Import workspace utilities at top of pepper-io.ts
- [ ] Add workspace resolution at start of initPepperStructure()
- [ ] Update state.json structure to v1.1.0
- [ ] Use resolved path for all file operations
- [ ] Update success message to show symlink info
- [ ] Add error handling for WorkspaceError
- [ ] Test manually with all 4 test cases
- [ ] Verify backward compatibility
- [ ] Update any relevant documentation

### 7.2 For Code Review

- [ ] Workspace utilities imported correctly
- [ ] Error handling comprehensive
- [ ] Success message informative
- [ ] Backward compatibility maintained
- [ ] No breaking changes
- [ ] All test cases pass

---

## 8. Appendix

### 8.1 Schema Comparison

**v1.0.0 (Old)**:
```json
{
  "version": "1.0.0",
  "session_ids": [],
  "auto_continue": false
}
```

**v1.1.0 (New)**:
```json
{
  "version": "1.1.0",
  "initialized": "2026-01-18T12:00:00.000Z",
  "workspacePath": {
    "symlink": "/tmp/ocx-ghost-abc123",
    "real": "/Users/dev/chili-ocx",
    "isSymlink": true,
    "resolvedAt": "2026-01-18T12:00:00.000Z"
  },
  "session_ids": [],
  "auto_continue": false
}
```

### 8.2 Files Modified

- `plugin/src/utils/pepper-io.ts` - Update initPepperStructure()

### 8.3 References

- RFC-001: Workspace Path Resolution Utility
- PRD: core-improvements-v1.0.0.md Section 8.1
- Workspace utilities: `plugin/src/utils/workspace.ts`

---

**RFC Status**: Ready for Implementation
**Estimated Effort**: 1-2 hours
**Blocking**: None - can start immediately
