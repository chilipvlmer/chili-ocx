# RFC-004 Manual TUI Testing Guide

## Overview
This guide walks you through testing the plugin log fix to verify that console.log() calls no longer leak to the OpenCode TUI.

## Prerequisites
- ✅ Plugin built with logger changes (Jan 21 12:59)
- ✅ Plugin location: `/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/plugin/dist/`
- ⚠️ OpenCode must be **restarted** to load the updated plugin

## Quick Reference

### Helper Script
A test helper script is available at:
```bash
/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/plugin/test-tui.sh
```

Usage:
```bash
./test-tui.sh normal  # Instructions for Test 10.2
./test-tui.sh debug   # Instructions for Test 10.3
./test-tui.sh check   # View log file
./test-tui.sh clear   # Clear log file
```

---

## Test 10.2: Normal Mode (No Debug)

**Goal**: Verify that logs DO NOT appear on TUI in normal mode

### Steps:

1. **Prepare Environment**
   ```bash
   # Ensure DEBUG is not set
   unset CHILI_OCX_DEBUG
   
   # Clear log file
   rm -f /tmp/chili-ocx-plugin.log
   ```

2. **Restart OpenCode**
   - Close current OpenCode session completely
   - Reopen OpenCode (this reloads the plugin)

3. **Run Test**
   - In OpenCode TUI, run: `/pepper-status`
   - **Watch carefully**: Do you see ANY log messages on screen?

4. **Expected Results**
   - ✅ **PASS**: TUI is clean, no log messages visible
   - ❌ **FAIL**: You see messages like "🌶️ chili-ocx plugin initializing..."

5. **Verify File Logging**
   ```bash
   cat /tmp/chili-ocx-plugin.log
   ```
   - ✅ **PASS**: File contains log entries with timestamps
   - ❌ **FAIL**: File is empty or doesn't exist

### Acceptance Criteria Verified:
- ✅ AC-2: TUI shows no log overlays (DEBUG=0)
- ✅ AC-3: /tmp/chili-ocx-plugin.log receives entries
- ✅ AC-6: Manual TUI testing confirms no leaks

---

## Test 10.3: Debug Mode (DEBUG=1)

**Goal**: Verify that logs DO appear when debug mode is enabled

### Steps:

1. **Enable Debug Mode**
   ```bash
   export CHILI_OCX_DEBUG=1
   
   # Verify it's set
   echo $CHILI_OCX_DEBUG  # Should print: 1
   ```

2. **Restart OpenCode**
   - Close current OpenCode session
   - Reopen OpenCode with DEBUG mode active

3. **Clear Log**
   ```bash
   rm -f /tmp/chili-ocx-plugin.log
   ```

4. **Run Test**
   - In OpenCode TUI, run: `/pepper-status`
   - **Watch carefully**: Do you see log messages on console?

5. **Expected Results**
   - ✅ **PASS**: Console shows log messages (this is expected in debug mode)
   - ❌ **FAIL**: No console output even with DEBUG=1

6. **Verify File Logging**
   ```bash
   cat /tmp/chili-ocx-plugin.log
   ```
   - ✅ **PASS**: File also contains log entries
   - ❌ **FAIL**: File is empty

7. **Clean Up**
   ```bash
   unset CHILI_OCX_DEBUG
   ```
   - Restart OpenCode to return to normal mode

### Acceptance Criteria Verified:
- ✅ AC-4: CHILI_OCX_DEBUG=1 enables console logging

---

## Test 10.4: Performance Check

**Goal**: Verify no performance regression

### Steps:

1. **Run Commands Multiple Times**
   - In OpenCode TUI, run `/pepper-status` several times
   - Observe response time

2. **Expected Results**
   - ✅ **PASS**: Commands respond instantly (no noticeable delay)
   - ❌ **FAIL**: Noticeable slowdown compared to before

### Acceptance Criteria Verified:
- ✅ AC-7: No performance regression (<1ms overhead)

---

## Troubleshooting

### Plugin Not Loading
If `/pepper` commands are not available:
```bash
# Check if plugin is in the right location
ls -la /Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/plugin/dist/

# Verify OpenCode can find it
# Check opencode.jsonc or plugin configuration
```

### Logs Still Appearing on TUI (Test 10.2 fails)
Possible causes:
1. OpenCode not restarted - old plugin still loaded
2. DEBUG mode accidentally set - check `echo $CHILI_OCX_DEBUG`
3. Wrong plugin version loaded - check timestamps on dist/ files

### No Logs in File
Possible causes:
1. File permission issue - check `/tmp` is writable
2. Plugin not executing - verify commands work
3. Logger not imported correctly - check dist/index.js

---

## Reporting Results

After testing, update `.pepper/plan.md`:

### If All Tests Pass ✅
```markdown
### Test Results
- **10.2 Normal Mode**: ✅ PASS - No TUI logs, file logging works
- **10.3 Debug Mode**: ✅ PASS - Console logs appear, file logging works
- **10.4 Performance**: ✅ PASS - No noticeable slowdown
```

Mark tasks complete:
```markdown
- [x] **10.1 Restart OpenCode**
- [x] **10.2 Test normal mode (DEBUG not set)**
- [x] **10.3 Test debug mode (DEBUG=1)**
- [x] **10.4 Performance check**
```

Update acceptance criteria:
```markdown
- [x] **AC-2**: TUI shows no log overlays (DEBUG=0) ✅
- [x] **AC-3**: /tmp/chili-ocx-plugin.log receives entries ✅
- [x] **AC-4**: CHILI_OCX_DEBUG=1 enables console logging ✅
- [x] **AC-6**: Manual TUI testing confirms no leaks ✅
- [x] **AC-7**: No performance regression (<1ms) ✅
```

### If Tests Fail ❌
Document the failure:
```markdown
### Test Results
- **10.2 Normal Mode**: ❌ FAIL - [describe what happened]
- **Logs observed**: [paste log messages that appeared on TUI]
- **File check**: [empty/missing/correct]
```

Return to Jalapeño for debugging.

---

## Next Steps

Once all tests pass:
1. Update plan.md with results
2. Mark Phase 10 complete
3. Switch to **Habanero** for code review (TAB → `habanero-reviewer`)
4. Prepare for RFC-004 completion and merge

---

**Testing Priority**: P2 - Visual bug fix
**RFC**: RFC-004 v1.0.0
**Estimated Time**: 15-20 minutes
