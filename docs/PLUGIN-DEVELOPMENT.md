# Plugin Development Guide

This guide covers how to develop, build, test, and deploy plugins for the Chili-OCX OpenCode bundle.

## Overview

Chili-OCX uses OpenCode's plugin system to extend functionality with custom tools that agents can use. Our main plugin provides three MCP-style tools:

- `pepper_init` - Initialize .pepper/ directory structure
- `pepper_status` - Get current harness status
- `pepper_notepad_add` - Add entries to persistent notepads

## Architecture

### Plugin Structure

```
plugin/
├── src/
│   ├── index.ts              # Plugin entry point & tool registration
│   ├── types.ts              # TypeScript type definitions
│   ├── utils/
│   │   ├── pepper-io.ts      # Core .pepper/ operations
│   │   ├── workspace.ts      # Workspace path resolution (symlinks)
│   │   ├── logger.ts         # Plugin logging utilities
│   │   ├── plan-parser.ts    # Parse plan.md files
│   │   └── agent-switch.ts   # Agent switching utilities
│   └── commands/
│       ├── executor.ts       # Command execution framework
│       ├── loader.ts         # Dynamic command loading
│       └── handlers/
│           ├── pepper-init.ts
│           ├── status.ts
│           ├── prd.ts
│           ├── rfc.ts
│           └── ...
├── package.json              # Plugin dependencies
└── tsconfig.json             # TypeScript config

dist/
└── bundle.js                 # Built plugin bundle
```

### How OpenCode Loads Plugins

OpenCode plugins are registered in `registry.json` under the `plugin` type:

```json
{
  "id": "chili-ocx/pepper-plugin",
  "name": "pepper-plugin",
  "type": "plugin",
  "files": {
    "index.js": "./files/plugin/pepper-plugin.js"
  }
}
```

When an agent loads this component, OpenCode:
1. Loads `pepper-plugin.js` (our bundled plugin)
2. Calls the default export function with context
3. Registers the returned tools in the MCP tool registry
4. Makes tools available to the agent via function calling

## Build Process

### Build Commands

```bash
# Clean build artifacts
npm run clean

# Build plugin only
npm run build:plugin

# Build registry only
npm run build:registry

# Full build (plugin + registry)
npm run build

# Clean + full rebuild
npm run rebuild
```

### What `npm run build:plugin` Does

```bash
cd plugin && npm install && npm run build && \
cp dist/bundle.js ../plugin/pepper-plugin.js && \
cp dist/bundle.js ../files/plugin/pepper-plugin.js
```

**Steps:**
1. `cd plugin` - Enter plugin directory
2. `npm install` - Install plugin dependencies (@opencode-ai/plugin, zod)
3. `npm run build` - TypeScript → bundled JavaScript (uses esbuild/tsup)
4. Copy bundle to **two locations**:
   - `plugin/pepper-plugin.js` - Legacy location
   - `files/plugin/pepper-plugin.js` - Main plugin location (used by registry)

### Build Output

The build process creates a single `bundle.js` that:
- Bundles all TypeScript source into one file
- Includes all dependencies (except @opencode-ai/plugin)
- Is CommonJS compatible for OpenCode
- Contains source maps for debugging

## Adding New Tools

### 1. Create Tool Implementation

Add your tool logic to `plugin/src/utils/` or a dedicated file:

```typescript
// plugin/src/utils/my-tool.ts
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export function myToolFunction(projectDir: string, arg: string): string {
  // Your implementation
  return "Tool executed successfully";
}
```

### 2. Register Tool in Plugin

Edit `plugin/src/index.ts` to register your tool:

```typescript
import { tool } from "@opencode-ai/plugin";
import { myToolFunction } from "./utils/my-tool";

const ChiliOcxPlugin: Plugin = async (ctx) => {
  const tools = {
    "my_tool_name": tool({
      description: "Clear description of what this tool does",
      args: {
        argName: tool.schema.string().describe("Argument description")
      },
      execute: async (args, context) => {
        const result = myToolFunction(ctx.directory, args.argName);
        return result;
      }
    }),
    
    // ... other tools
  };
  
  return { tool: tools };
};
```

### 3. Tool Schema Types

OpenCode plugins use Zod-like schema definitions:

```typescript
// String argument
argName: tool.schema.string().describe("Description")

// Number argument
count: tool.schema.number().describe("Number of items")

// Boolean argument
enabled: tool.schema.boolean().describe("Enable feature")

// Enum (restricted values)
type: tool.schema.enum(["option1", "option2"]).describe("Choose type")

// Optional argument
optional: tool.schema.string().optional().describe("Optional arg")
```

### 4. Build and Test

```bash
npm run build:plugin
```

Your tool is now available to agents as `my_tool_name`.

## Testing Methodology

Since OpenCode plugins run in a sandboxed environment, testing follows a **manual integration testing** approach:

### 1. Make Changes

Edit plugin source files in `plugin/src/`

### 2. Rebuild Plugin

```bash
npm run build:plugin
```

### 3. Reload OpenCode

**In Profile Mode (recommended):**
- Changes are picked up automatically in new conversations
- OR: Exit profile mode and re-enter to force reload

**In OpenCode Extension:**
- Reload VS Code window (Cmd/Ctrl + Shift + P → "Developer: Reload Window")
- OR: Restart OpenCode server

### 4. Test in Conversation

Invoke your tool through an agent:

```
@jalapeño can you test the my_tool_name with argument "test"?
```

Or use the Question tool to verify it's registered:

```
@jalapeño what tools do you have available?
```

### 5. Check Logs

Plugin logs appear in OpenCode's output:

```
🌶️ chili-ocx plugin initializing...
  Context directory: /path/to/project
📋 Registered 4 custom tools
✅ chili-ocx plugin loaded successfully
```

### Common Testing Scenarios

**Test tool registration:**
```typescript
// Add log in index.ts
logInfo(`📋 Registered ${Object.keys(tools).length} custom tools`);
```

**Test tool execution:**
```typescript
// Add logs in your tool's execute function
execute: async (args, context) => {
  logInfo(`🔧 my_tool executing with: ${JSON.stringify(args)}`);
  const result = myToolFunction(ctx.directory, args.argName);
  logInfo(`✅ my_tool result: ${result}`);
  return result;
}
```

**Test error handling:**
```typescript
try {
  return myToolFunction(ctx.directory, args.argName);
} catch (error) {
  logError(`❌ my_tool failed: ${error}`);
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
```

## Deployment

### Production Deployment

The plugin is deployed as part of the Chili-OCX bundle:

1. **Build the plugin:**
   ```bash
   npm run build:plugin
   ```

2. **Build the registry:**
   ```bash
   npm run build:registry
   ```

3. **Deploy to registry:**
   The `dist/` directory contains the built registry with all components.
   Deploy this to your hosting provider (e.g., Cloudflare Pages).

4. **Users install via:**
   ```bash
   ocx registry add https://chili-ocx.pages.dev --name chili-ocx
   ocx add chili-ocx/pepper-harness
   ```

### File Locations After Build

| File | Purpose |
|------|---------|
| `plugin/dist/bundle.js` | Original build output |
| `plugin/pepper-plugin.js` | Legacy location |
| `files/plugin/pepper-plugin.js` | **Main plugin** (used by registry) |

### Work-in-Progress Plugins

The following TypeScript plugin sources exist but are not yet registered in the registry:

- `state-management.ts` - Manages `.pepper/` state
- `agents-md-loader.ts` - Loads AGENTS.md context
- `worktree-manager.ts` - Git worktree operations
- `toast-status.ts` - Status notifications
- `auto-review.ts` - Automated code review

These are under development and will be available in future releases. The currently registered plugin is `pepper-plugin` (JavaScript bundle).

### Registry References

The registry.json references the plugin:

```json
{
  "id": "chili-ocx/pepper-plugin",
  "files": {
    "index.js": "./files/plugin/pepper-plugin.js"
  }
}
```

## Debugging Tips

### Plugin Not Loading

**Check logs:**
```
❌ chili-ocx plugin failed to load: <error>
```

**Common causes:**
- Missing dependencies (run `cd plugin && npm install`)
- TypeScript compilation errors (check `npm run build:plugin` output)
- Syntax errors in index.ts

**Fix:**
```bash
cd plugin
npm install
npm run build
cd ..
npm run build:plugin
```

### Tool Not Registered

**Check registration:**
Look for log message:
```
📋 Registered 3 custom tools
```

If tool count is wrong:
- Verify tool is in `tools` object in `index.ts`
- Check for syntax errors in tool definition
- Rebuild: `npm run build:plugin`

### Tool Execution Fails

**Add debug logging:**
```typescript
execute: async (args, context) => {
  logInfo(`🔧 Tool args: ${JSON.stringify(args)}`);
  logInfo(`📂 Context dir: ${ctx.directory}`);
  
  try {
    const result = myFunction(ctx.directory, args);
    logInfo(`✅ Result: ${result.substring(0, 100)}`);
    return result;
  } catch (error) {
    logError(`❌ Error: ${error}`);
    throw error;
  }
}
```

### Workspace Path Issues (Profile Mode)

If working in profile mode (symlinked workspace), always use resolved paths:

```typescript
import { getWorkspaceInfo } from './workspace.js';

// Resolve symlinks
const workspaceInfo = getWorkspaceInfo(ctx.directory);
const realPath = workspaceInfo.real;  // Use this for file operations

// Don't use ctx.directory directly for file I/O in profile mode
```

See `plugin/src/utils/workspace.ts` for workspace resolution utilities.

## Advanced Topics

### Command Framework

Chili-OCX has a command framework for `/slash-commands`:

```typescript
// plugin/src/commands/handlers/my-command.ts
import type { PluginInput } from "@opencode-ai/plugin";

export async function handleMyCommand(
  ctx: PluginInput,
  args: string[]
): Promise<string> {
  // Command implementation
  return "Command result";
}
```

Commands are registered in `plugin/src/commands/loader.ts`.

### Notepad System

The notepad system provides persistent memory across sessions:

```typescript
import { addNotepadEntry } from "./utils/pepper-io";

addNotepadEntry(projectDir, "learnings", "Discovered X pattern works well");
addNotepadEntry(projectDir, "issues", "Failed to Y because Z");
addNotepadEntry(projectDir, "decisions", "Decided to use approach A over B");
```

### Plan Parsing

Parse execution plans from `plan.md`:

```typescript
import { parsePlan, findCurrentTask } from "./utils/plan-parser";

const plan = parsePlan(projectDir);
const currentTask = findCurrentTask(plan);
```

## Best Practices

### 1. Always Handle Errors

```typescript
try {
  const result = riskyOperation();
  return `✅ Success: ${result}`;
} catch (error) {
  logError(`Operation failed: ${error}`);
  return `❌ Error: ${error instanceof Error ? error.message : String(error)}`;
}
```

### 2. Use Descriptive Tool Names

- ✅ `pepper_init` - Clear action
- ✅ `pepper_notepad_add` - Namespaced and specific
- ❌ `init` - Too generic
- ❌ `add` - Ambiguous

### 3. Provide Clear Descriptions

```typescript
// ✅ Good
description: "Initialize the Pepper harness .pepper/ directory structure in the current project"

// ❌ Bad
description: "Init pepper"
```

### 4. Log Important Events

```typescript
logInfo("🔧 Tool executing");
logInfo(`✅ Created ${count} files`);
logError(`❌ Failed to read file: ${error}`);
```

### 5. Return Formatted Output

Tools should return human-readable markdown:

```typescript
return `✅ Initialized .pepper/ structure

Created:
- specs/prd/ - Product Requirements Documents
- specs/rfc/ - Request for Comments
- plans/ - Execution plans

Next steps:
- Run /prd to create your first PRD`;
```

### 6. Use Workspace Resolution

In profile mode or symlinked environments:

```typescript
import { getWorkspaceInfo } from './workspace.js';

const workspaceInfo = getWorkspaceInfo(projectDir);
const realPath = workspaceInfo.real;
// Use realPath for all file operations
```

## References

- [OpenCode Plugin API](https://github.com/kdcokenny/ocx)
- [MCP Tool Specification](https://modelcontextprotocol.io/)
- RFC-001: Workspace Path Resolution Utility
- RFC-002: pepper_init Enhancement

## Support

For questions or issues:
1. Check plugin logs in OpenCode output
2. Verify build completed successfully
3. Test with simple tool first
4. Review existing tools in `plugin/src/` for examples
