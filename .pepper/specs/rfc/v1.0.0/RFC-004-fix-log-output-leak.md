# RFC-004: Fix Plugin Log Output Leaking to TUI

**Version**: 1.0.0  
**Status**: Draft  
**Author**: Seed (PRD-RFC Planner)  
**Date**: 2026-01-21  
**Priority**: P2 - Visual Bug  
**Phase**: Quality Improvements

**Parent PRD**: `core-improvements-v1.0.0.md`  
**Dependencies**: None  
**Blocks**: None

---

## 1. Executive Summary

The chili-ocx plugin currently writes log output to BOTH `/tmp/chili-ocx-plugin.log` AND `console.log()`, causing log messages to appear overlayed on the OpenCode TUI. This creates visual noise and disrupts the user experience.

This RFC defines a fix to remove all `console.log()` calls and implement silent file-only logging with an optional debug mode controlled by environment variable `CHILI_OCX_DEBUG`.

**Impact**: Clean TUI experience, professional appearance, no functional changes.

---

## 2. Problem Statement

### 2.1 Root Cause Analysis

**Files affected:**
1. `plugin/src/index.ts` - Line 11: `console.log(msg);`
2. `plugin/src/hooks/command-interceptor.ts` - Line 16: `console.log(msg);`
3. `plugin/src/utils/pepper-io.ts` - Lines 135, 150, 259: `console.error()`
4. `plugin/src/commands/loader.ts` - Lines 40, 68, 73: `console.log()` and `console.error()`

**Why it happens:**
- Both `log()` helper functions write to console AND file
- `console.log()` output is captured by OpenCode TUI and displayed as overlay
- No conditional logging based on environment

### 2.2 Current Behavior

```typescript
const log = (msg: string) => {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}\n`;
  console.log(msg);  // ← THIS LEAKS TO TUI
  try {
    writeFileSync(logFile, line, { flag: "a" });
  } catch (e) {
    // Ignore file write errors
  }
};
```

### 2.3 User Impact

- **Visual pollution**: Log messages appear on TUI during slash command execution
- **Confusing UX**: Users see "behind the scenes" technical details
- **Unprofessional**: Makes the plugin appear unpolished
- **No functional impact**: Functionality works correctly

---

## 3. Solution Design

### 3.1 Core Strategy

1. **Remove all `console.log()` and `console.error()` calls**
2. **Keep file-based logging** to `/tmp/chili-ocx-plugin.log`
3. **Add optional debug mode** via `CHILI_OCX_DEBUG` environment variable
4. **Centralize logging logic** in a shared utility

### 3.2 Technical Approach

**Create centralized logger** (`plugin/src/utils/logger.ts`):

```typescript
import { writeFileSync } from "fs";

const LOG_FILE = "/tmp/chili-ocx-plugin.log";
const DEBUG_MODE = process.env.CHILI_OCX_DEBUG === "1";

export function log(msg: string, level: "INFO" | "WARN" | "ERROR" = "INFO"): void {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level}] ${msg}\n`;
  
  // Only log to console if debug mode enabled
  if (DEBUG_MODE) {
    if (level === "ERROR") {
      console.error(msg);
    } else {
      console.log(msg);
    }
  }
  
  // Always log to file (silent fail on errors)
  try {
    writeFileSync(LOG_FILE, line, { flag: "a" });
  } catch (e) {
    // Silent fail - don't break plugin if log file inaccessible
  }
}

export function logInfo(msg: string): void {
  log(msg, "INFO");
}

export function logWarn(msg: string): void {
  log(msg, "WARN");
}

export function logError(msg: string): void {
  log(msg, "ERROR");
}
```

**Usage:**

```typescript
import { logInfo, logError } from "./utils/logger";

// Instead of: console.log("🌶️ plugin initializing");
logInfo("🌶️ plugin initializing");

// Instead of: console.error("Failed:", error);
logError(`Failed: ${error}`);
```

### 3.3 Migration Plan

**Phase 1: Create logger utility**
- Create `plugin/src/utils/logger.ts`
- Export `log`, `logInfo`, `logWarn`, `logError`
- Add unit tests

**Phase 2: Update index.ts**
- Replace inline `log()` function with `import { logInfo } from "./utils/logger"`
- Update all `log()` calls to `logInfo()`

**Phase 3: Update command-interceptor.ts**
- Replace inline `log()` function
- Update all logging calls

**Phase 4: Update pepper-io.ts**
- Replace `console.error()` with `logError()`

**Phase 5: Update loader.ts**
- Replace `console.log()` and `console.error()` with logger

---

## 4. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Remove all console.log() calls from plugin code | P0 |
| FR-2 | Remove all console.error() calls from plugin code | P0 |
| FR-3 | Maintain file-based logging to /tmp/chili-ocx-plugin.log | P0 |
| FR-4 | Add CHILI_OCX_DEBUG environment variable support | P1 |
| FR-5 | When DEBUG=1, log to console AND file | P1 |
| FR-6 | When DEBUG not set, log to file only (silent) | P0 |
| FR-7 | Centralize logging in shared utility module | P2 |

---

## 5. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Zero performance regression | <1ms logging overhead |
| NFR-2 | Silent failure on log write errors | No exceptions thrown |
| NFR-3 | Backward compatibility | Existing log file format unchanged |
| NFR-4 | Code maintainability | Single logging utility, DRY |

---

## 6. Implementation Details

### 6.1 Files to Modify

1. **CREATE**: `plugin/src/utils/logger.ts` (new file)
   - Centralized logging utility
   - Debug mode support
   - File write error handling

2. **UPDATE**: `plugin/src/index.ts`
   - Remove inline `log()` function (lines 8-17)
   - Import `logInfo` from logger
   - Replace all `log()` calls

3. **UPDATE**: `plugin/src/hooks/command-interceptor.ts`
   - Remove inline `log()` function (lines 13-20)
   - Import `logInfo` from logger
   - Replace all `log()` calls

4. **UPDATE**: `plugin/src/utils/pepper-io.ts`
   - Import `logError` from logger
   - Replace `console.error()` calls (lines 135, 150, 259)

5. **UPDATE**: `plugin/src/commands/loader.ts`
   - Import `logInfo`, `logWarn`, `logError`
   - Replace all console calls (lines 40, 68, 73)

### 6.2 Debug Mode Usage

**Enable debug mode:**
```bash
export CHILI_OCX_DEBUG=1
ocx ghost opencode
```

**Disable debug mode (default):**
```bash
unset CHILI_OCX_DEBUG
ocx ghost opencode
```

**Check logs (always available):**
```bash
tail -f /tmp/chili-ocx-plugin.log
```

---

## 7. Testing Strategy

### 7.1 Unit Tests

**Test file**: `plugin/test/utils/logger.test.ts`

```typescript
describe("logger", () => {
  beforeEach(() => {
    delete process.env.CHILI_OCX_DEBUG;
  });

  it("should write to file only when DEBUG not set", () => {
    // Verify no console output
    // Verify file write
  });

  it("should write to console AND file when DEBUG=1", () => {
    process.env.CHILI_OCX_DEBUG = "1";
    // Verify console output
    // Verify file write
  });

  it("should handle file write errors silently", () => {
    // Mock writeFileSync to throw
    // Verify no exception thrown
  });
});
```

### 7.2 Integration Tests

**Test Scenario 1: Normal Mode (No Console Output)**
- Setup: Clean OpenCode session, CHILI_OCX_DEBUG not set
- Execute: Run `/pepper-init`
- Verify: No log overlay appears on TUI
- Verify: `/tmp/chili-ocx-plugin.log` contains entries

**Test Scenario 2: Debug Mode (Console Output Enabled)**
- Setup: `export CHILI_OCX_DEBUG=1`, launch OpenCode
- Execute: Run `/pepper-status`
- Verify: Console logs visible (acceptable in debug mode)
- Verify: Log file also written

**Test Scenario 3: All Console Calls Removed**
- Action: Search codebase for `console.log` and `console.error`
- Verify: Only found in `logger.ts` (controlled by DEBUG flag)
- Verify: Zero instances in other files

### 7.3 Manual TUI Verification

**Checklist:**
- [ ] Run `/pepper-init` - no log overlay
- [ ] Run `/pepper-status` - no log overlay
- [ ] Run `/pepper-notepad-add` - no log overlay
- [ ] Enable DEBUG mode - logs appear (expected)
- [ ] Disable DEBUG mode - logs disappear
- [ ] Check `/tmp/chili-ocx-plugin.log` - all entries present

---

## 8. Acceptance Criteria

- [ ] **AC-1**: No `console.log()` or `console.error()` in plugin code except `logger.ts`
- [ ] **AC-2**: OpenCode TUI shows no log overlays during normal operation (DEBUG=0)
- [ ] **AC-3**: `/tmp/chili-ocx-plugin.log` continues to receive all log entries
- [ ] **AC-4**: `CHILI_OCX_DEBUG=1` enables console logging (for debugging)
- [ ] **AC-5**: Unit tests pass with 100% coverage of logger.ts
- [ ] **AC-6**: Manual TUI testing confirms no visual log leaks
- [ ] **AC-7**: No performance regression (<1ms logging overhead)
- [ ] **AC-8**: Zero exceptions thrown on log write failures

---

## 9. Rollout Plan

### 9.1 Development
1. Create `logger.ts` utility
2. Write unit tests
3. Update all 5 files
4. Run unit tests
5. Build plugin (`npm run build`)

### 9.2 Testing
1. Install to test Ghost profile
2. Manual TUI verification
3. Test debug mode
4. Verify log file

### 9.3 Deployment
1. Merge to main
2. Bump version to v0.1.1 (patch)
3. Publish to registry
4. Update documentation

---

## 10. Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Debug mode not working | Medium | Low | Thorough testing of env var detection |
| Missing console.log in some file | Low | Medium | Automated grep search in tests |
| Log file write failures | Low | Low | Silent fail is already implemented |
| Performance regression | Low | Very Low | Logger is extremely lightweight |

---

## 11. Future Enhancements (Out of Scope)

- Structured JSON logging (defer to v2)
- Log rotation / size limits (defer to v2)
- Log level filtering (INFO/WARN/ERROR) (defer to v2)
- OpenCode native logging API integration (blocked on API availability)

---

## 12. References

- **Issue**: `.pepper/notepad/issues.json` entry #2
- **Suspected location**: Confirmed in code review
- **OpenCode TUI behavior**: console.log captured and displayed as overlay
- **Environment**: macOS, OpenCode v1.1.20, chili-ocx v0.1.0

---

**Document Status**: ✅ Ready for implementation

**Estimated Effort**: 2-3 hours (1h dev, 1h testing, 1h deployment)

**Next Steps**:
1. Switch to **Sprout** (execution planner) to create implementation plan
2. Switch to **Jalapeño** (coder) to implement the fix
3. Switch to **Habanero** (reviewer) to review the changes

---
