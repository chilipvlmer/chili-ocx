# Plugin Testing Guide - Executable Commands

## Status: ✅ Ready for Real-World Testing

Plugin loads successfully, discovers commands correctly, and is deployed to production.

## Quick Summary

### ✅ What's Working
- Plugin loads without errors
- Command discovery finds all installed commands
- No ESM import issues
- Proper static imports (no dynamic requires)

### 🧪 What Needs Testing
- Execute mode commands (`/pepper-init`, `/status`)
- Delegate mode commands (`/prd`, `/prd-refine`)
- Hybrid mode commands (`/work`)
- Argument passing
- Error handling

### 📦 Current Installation
```bash
Test directory: /tmp/chili-ocx-test
Plugin: chili-ocx/chili-ocx-plugin@0.1.0
Commands installed: pepper-init, prd, prd-refine, status, work
```

## Test in Real OpenCode Session

### 1. Start OpenCode
```bash
cd /tmp/chili-ocx-test
ocx ghost opencode
```

**Expected console output:**
```
🌶️ chili-ocx plugin loaded
🌶️ Discovered 5 OCX commands
📋 Loaded commands: pepper-init, prd, prd-refine, status, work
```

### 2. Test `/pepper-init`
Type in chat: `/pepper-init`

**Should:**
- Intercept command
- Create `.pepper/` directory structure
- Return success message

**Verify:**
```bash
ls -la .pepper/
cat .pepper/state.json
```

### 3. Test `/status`
Type in chat: `/status`

**Should:**
- Show current state
- Or show "not initialized" if no state

### 4. Test `/prd my-project`
Type in chat: `/prd my-project`

**Should:**
- Show "🌶️ Starting prd..." message
- Switch to `seed-prd-rfc` agent
- Seed begins PRD interview with project name "my-project"

### 5. Test `/work`
Type in chat: `/work`

**Should:**
- Check for `.pepper/plan.md`
- Either show error (no plan) or find current task
- Delegate to appropriate agent

## Installation Commands

### Fresh Install
```bash
cd /tmp/chili-ocx-test
ocx ghost add chili-ocx/chili-ocx-plugin
ocx ghost add chili-ocx/pepper-init chili-ocx/status chili-ocx/prd chili-ocx/work
```

### Update Plugin
```bash
ocx ghost update chili-ocx/chili-ocx-plugin
```

### Add More Commands
```bash
ocx ghost add chili-ocx/rfc chili-ocx/rfc-refine chili-ocx/plan chili-ocx/review
```

## Debug Commands

### Check Plugin
```bash
# View plugin file
head -30 ~/.config/opencode/profiles/default/.opencode/plugin/executable-commands.js

# Verify no dynamic requires
grep "require.*os" ~/.config/opencode/profiles/default/.opencode/plugin/executable-commands.js
# Should be empty
```

### Check Commands
```bash
# List installed commands
ls ~/.config/opencode/profiles/default/.opencode/command/

# View command definition
cat ~/.config/opencode/profiles/default/.opencode/command/pepper-init/COMMAND.md
```

### Check Deployment
```bash
# View remote registry
curl -s https://chili-ocx.pages.dev/index.json | jq '.components[] | select(.name == "chili-ocx-plugin")'

# Check plugin bundle
curl -s https://chili-ocx.pages.dev/components/chili-ocx-plugin/plugin/executable-commands.js | head -10
```

## Known Limitations

### Not Yet Implemented
- `/plan` - Create execution plan
- `/review` - Code review
- `/notepad` - View notepad entries
- `/auto-continue` - Toggle auto-continue
- `/resume` - Resume session

### Potential Issues
1. **Path resolution**: Commands assume `.pepper/` is in current working directory
2. **Error handling**: Some handlers may not handle missing files gracefully
3. **State management**: Race conditions with multiple sessions possible
4. **Agent switching**: Async setTimeout timing

## Success Criteria

### Minimum Viable (MVP)
- [ ] Plugin loads without errors ✅ (verified in unit test)
- [ ] Commands discovered correctly ✅ (verified in unit test)
- [ ] `/pepper-init` creates directory structure ⏳ (needs real session test)
- [ ] `/status` shows state ⏳ (needs real session test)
- [ ] `/prd` switches to Seed agent ⏳ (needs real session test)

### Full Feature
- [ ] All execute mode commands work
- [ ] All delegate mode commands switch correctly
- [ ] Arguments passed to agents
- [ ] State files read/written correctly
- [ ] `/work` task detection works
- [ ] Error messages helpful and clear

## Recent Fixes

### Commit `7453093` - Command Directory Path
**Problem**: Plugin looked for commands in `~/.config/opencode/command/` instead of `~/.config/opencode/profiles/default/.opencode/command/`

**Fix**: Updated path in `loader.ts`

**Verification**:
```bash
node -e "console.log(require('os').homedir() + '/.config/opencode/profiles/default/.opencode/command')"
```

### Commit `4dde859` - Dynamic Require
**Problem**: `require("os")` caused dynamic require wrapper in bundle

**Fix**: Changed to `import { homedir } from "os"`

**Verification**:
```bash
grep "import.*homedir" ~/.config/opencode/profiles/default/.opencode/plugin/executable-commands.js
# Should show: import { homedir } from "os";
```

## Unit Test Results

```
✅ Plugin loads successfully
✅ No dynamic require errors
✅ Discovered 5 OCX commands
✅ Commands: pepper-init, prd, prd-refine, status, work
✅ Hook registered: chat.message
```

Error in unit test is expected (mock context incomplete):
```
TypeError: Cannot read properties of undefined (reading 'parts')
```

This is normal - real OpenCode provides full context.

## Next Steps

1. **Manual Testing** - Run `ocx ghost opencode` in `/tmp/chili-ocx-test`
2. **Test Each Command** - Follow test plan above
3. **Report Results** - Document any issues found
4. **Implement Missing Commands** - If tests pass
5. **Create User Documentation** - After successful testing

---

**Last Updated**: 2026-01-18 16:50 UTC  
**Plugin Version**: 0.1.0  
**Latest Commit**: `7453093`  
**Test Status**: Ready for manual testing in real OpenCode session
