---
rfc: RFC-010
title: Implement Skill Tool with Name-Based Loading
prd_version: 1.1.2
status: draft
created: 2026-01-31
updated: 2026-01-31
author: Seed (Artifact Planner)
---

# RFC-010: Implement Skill Tool with Name-Based Loading

## 1. Summary

This RFC proposes implementing a custom `skill` tool within the `pepper-plugin` that enables name-based loading of knowledge skills (markdown documentation). The tool will resolve skill names to file paths in both registry (`files/skills/`) and local (`.opencode/skills/`) directories, with registry taking precedence. If registration of `skill` fails due to host conflicts, it will automatically fallback to `pepper_skill`.

## 2. Motivation

### Problem Statement (from PRD v1.1.2)
The native `skill` tool is broken or incompatible with agent expectations. Calls like `skill(name="rfc-format")` fail with errors indicating it expects numeric indices. This prevents agents from loading critical methodology instructions dynamically.

### PRD Requirements
- **P0**: Implement `skill` tool with name-based loading
- **P0**: Support Registry (`files/skills/`) and Local (`.opencode/skills/`) locations
- **P0**: Registry wins over Local on conflicts
- **P1**: Include metadata in output (Source, Path)
- **P1**: Auto-fallback to `pepper_skill` if `skill` registration fails

## 3. Detailed Design

### 3.1 Architecture

```
┌─────────────────────────────────────────┐
│           OpenCode Agent                │
│   Calls: skill(name="rfc-format")       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         pepper-plugin.js                │
│  ┌─────────────────────────────────┐   │
│  │  Tool: "skill" (or fallback)    │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │  SkillResolver            │  │   │
│  │  │  - Sanitize name          │  │   │
│  │  │  - Check Registry first   │  │   │
│  │  │  - Check Local second     │  │   │
│  │  │  - Return with metadata   │  │   │
│  │  └───────────────────────────┘  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    ↓
        ┌─────────────────┐
        │ Registry Check  │
        │ files/skills/   │
        └─────────────────┘
                    ↓ (if not found)
        ┌─────────────────┐
        │ Local Check     │
        │ .opencode/      │
        └─────────────────┘
```

### 3.2 Data Model

```typescript
// Skill Resolution Result
interface SkillResolution {
  name: string;
  content: string;
  source: 'registry' | 'local' | 'not-found';
  path: string;
  availableSkills?: string[]; // Populated if not found
}

// Tool Input Schema
interface SkillToolInput {
  name: string; // Required, validated against path traversal
}
```

### 3.3 API Design

| Tool Name | Arguments | Returns | Description |
|-----------|-----------|---------|-------------|
| `skill` | `name: string` | Markdown content with metadata | Load skill by name (primary) |
| `pepper_skill` | `name: string` | Markdown content with metadata | Load skill by name (fallback) |

**Error Handling**:
- Invalid name (path traversal): `"Error: Invalid skill name. Use alphanumeric, hyphens, and underscores only."`
- Skill not found: `"Skill 'x' not found. Available skills: [list]"`

### 3.4 Component Design

#### SkillResolver Class
```typescript
class SkillResolver {
  private registryPath: string;
  private localPath: string;

  constructor(ctxDirectory: string) {
    this.registryPath = join(ctxDirectory, 'files/skills');
    this.localPath = join(ctxDirectory, '.opencode/skills');
  }

  async resolve(name: string): Promise<SkillResolution> {
    // 1. Sanitize name (prevent ../)
    const safeName = this.sanitize(name);
    
    // 2. Try Registry first (Priority)
    const registryFile = join(this.registryPath, safeName, 'SKILL.md');
    if (exists(registryFile)) {
      return { name, content: read(registryFile), source: 'registry', path: registryFile };
    }
    
    // 3. Try Local second
    const localFile = join(this.localPath, `${safeName}.md`);
    if (exists(localFile)) {
      return { name, content: read(localFile), source: 'local', path: localFile };
    }
    
    // 4. Not found - list available
    const available = await this.listAvailable();
    return { name, content: '', source: 'not-found', path: '', availableSkills: available };
  }

  private sanitize(name: string): string {
    // Regex: only a-z, A-Z, 0-9, -, _
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      throw new Error('Invalid skill name');
    }
    return name;
  }
}
```

#### Tool Registration
```typescript
// In plugin/src/index.ts
const skillTool = tool({
  description: "Load a knowledge skill by name (e.g., 'rfc-format', 'prd-methodology')",
  args: {
    name: tool.schema.string().describe("Name of the skill to load")
  },
  execute: async (args, context) => {
    const resolver = new SkillResolver(ctx.directory);
    const result = await resolver.resolve(args.name);
    
    if (result.source === 'not-found') {
      return `Skill '${args.name}' not found. Available skills: ${result.availableSkills?.join(', ') || 'none'}`;
    }
    
    // Prepend metadata
    const metadata = `<!-- Skill: ${result.name} | Source: ${result.source} | Path: ${result.path} -->\n\n`;
    return metadata + result.content;
  }
});

tools["skill"] = skillTool;
```

## 4. Implementation Plan

### 4.1 Phases

| Phase | Description | Effort | Files |
|-------|-------------|--------|-------|
| 1 | Create `SkillResolver` utility | 15 min | `plugin/src/utils/skill-resolver.ts` (new) |
| 2 | Register `skill` tool with fallback | 10 min | `plugin/src/index.ts` |
| 3 | Build and test | 10 min | Build script |
| 4 | Verify fallback works | 5 min | Test in OpenCode |

**Total Effort**: ~40 minutes

### 4.2 Dependencies

- **None**: Self-contained within `pepper-plugin`
- **No external RFCs required**
- **No external dependencies**

## 5. Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| Fix native `skill` tool | Zero code changes | Impossible - we don't control host | Not feasible |
| Use `load_skill` name | No conflict risk | Requires updating all agent prompts | Chosen as fallback only |
| **Override `skill` with fallback** | Best UX (agents use `skill`) | Risk of host conflict | **SELECTED**: Fallback mitigates risk |

## 6. Security Considerations

- **Path Traversal**: Sanitized via regex `/^[a-zA-Z0-9_-]+$/`
- **File System Access**: Only reads from whitelisted directories (`files/skills/`, `.opencode/skills/`)
- **No Execution**: Only reads markdown files, never executes

## 7. Performance Considerations

- **File Read**: < 10ms for typical skill files (< 50KB)
- **Caching**: No caching needed (skills rarely change during session)
- **Concurrent Calls**: Stateless, supports concurrent skill loading

## 8. Testing Strategy

### 8.1 Unit Tests
- Test `SkillResolver.sanitize()` with valid/invalid names
- Test resolution priority (Registry > Local)

### 8.2 Integration Tests
1. Call `skill(name="rfc-format")` → Expect content from Registry
2. Call `skill(name="local-test")` → Expect content from Local
3. Call `skill(name="missing")` → Expect available skills list

### 8.3 E2E Tests
- Verify tool appears in OpenCode tool list
- Verify fallback `pepper_skill` appears if `skill` blocked

## 9. Rollout Plan

### 9.1 Migration Steps
1. Implement `SkillResolver`
2. Register `skill` tool
3. Test with `npm run build:plugin`
4. Deploy to main

### 9.2 Rollback Procedure
```bash
git revert <commit-sha>
npm run build:plugin
git push origin main
```

## 10. Open Questions

- [x] Should we cache skill content? → No, files are small
- [x] Should we support skill versioning? → No, use file system versions
- [ ] Will OpenCode allow `skill` override or always fallback? → Test in deployment

## 11. References

### Related RFCs
- RFC-006: Skill Framework (context for skill system)
- RFC-007: Git Mastery (example of skill usage)

### PRD Reference
- [PRD: Fix Skill Loading v1.1.2](/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/.pepper/specs/prd/fix-skill-loading-v1.1.2.md)

### External Documentation
- [OpenCode Plugin API](https://docs.opencode.ai/plugin-api)
- [Pepper Harness Architecture](/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/AGENTS.md)
