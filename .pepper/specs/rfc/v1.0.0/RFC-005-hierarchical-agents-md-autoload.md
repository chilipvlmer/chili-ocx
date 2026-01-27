# RFC-005: Hierarchical AGENTS.md Auto-Injection

**Status**: Draft  
**Version**: 1.0.0  
**Author**: Seed  
**Created**: 2026-01-21  
**PRD Reference**: core-improvements-v1.0.0.md  
**Priority**: P1 - High  
**Phase**: Enhancement

---

## 1. Overview

### 1.1 Purpose

Implement automatic context injection from `AGENTS.md` files found in project directories, supporting hierarchical directory-specific context similar to how Cursor loads `.cursorrules`. This enables project-specific instructions to be automatically available to all Pepper agents without manual injection.

### 1.2 Scope

This RFC covers the implementation of a hierarchical AGENTS.md loader plugin that:
- Discovers AGENTS.md files from current working directory up to project root
- Merges multiple files with proper precedence (child overrides parent)
- Caches content with file watching for performance
- Re-injects context after compaction events
- Applies to all Pepper agents automatically

**In Scope**:
- Hierarchical file discovery (walk up directory tree)
- In-memory caching with chokidar file watching
- Context merging strategy (concatenation)
- Compaction-aware re-injection
- Integration with existing agents-md-loader plugin
- Plain markdown format support
- Working directory tracking via tool execution monitoring

**Out of Scope**:
- YAML frontmatter parsing (future enhancement)
- Section-based merging strategies (future enhancement)
- Per-agent opt-out mechanisms (future enhancement)
- Token limit configuration UI (use hardcoded 1000 token limit)
- Multi-project workspace support (focus on single project)

### 1.3 Success Criteria

- [ ] AGENTS.md files discovered at all levels from working dir to root
- [ ] Context properly merged with root-first precedence
- [ ] File changes detected within 100ms and cache invalidated
- [ ] Context re-injected after compaction with <1000 token limit
- [ ] Zero performance regression (< 50ms overhead per message)
- [ ] Works with existing oh-my-opencode agents without modification
- [ ] Comprehensive test coverage for hierarchy, caching, and compaction

---

## 2. Problem Statement

### 2.1 Current Limitations

**Existing agents-md-loader.ts**:
- Only loads `AGENTS.md` from project root
- No directory-specific context support
- No caching (reads from disk every message)
- No compaction re-injection
- Cannot provide context relevant to subdirectory work

**Pain Points**:
1. **Monorepo projects**: Cannot provide frontend-specific vs backend-specific context
2. **Performance**: File I/O on every chat message
3. **Context loss**: AGENTS.md context lost after compaction
4. **Static context**: Must manually re-load when switching between project areas

### 2.2 User Impact

- Developers in monorepos cannot provide targeted context per module
- Performance degradation with large AGENTS.md files
- Agents lose project context during long sessions
- Manual workarounds needed to re-establish context

---

## 3. Detailed Design

### 3.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  OpenCode Plugin: pepper-hierarchical-agents-md-loader      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ File Discovery   │  │  Cache Manager   │               │
│  │                  │  │                  │               │
│  │ - Walk up tree   │  │ - In-memory map  │               │
│  │ - Find AGENTS.md │  │ - chokidar watch │               │
│  │ - Max 10 levels  │  │ - Invalidation   │               │
│  └────────┬─────────┘  └────────┬─────────┘               │
│           │                     │                          │
│           └──────────┬──────────┘                          │
│                      │                                     │
│           ┌──────────▼─────────┐                          │
│           │  Context Merger    │                          │
│           │                    │                          │
│           │ - Concatenate all  │                          │
│           │ - Root → Child     │                          │
│           │ - Wrap in XML tags │                          │
│           └──────────┬─────────┘                          │
│                      │                                     │
│  ┌───────────────────▼────────────────────┐               │
│  │  Hook: chat.system.transform            │               │
│  │  - Inject merged context into system    │               │
│  └───────────────────┬─────────────────────┘               │
│                      │                                     │
│  ┌───────────────────▼─────────────────────┐              │
│  │  Hook: experimental.session.compacting  │              │
│  │  - Re-inject context (truncate to 1000) │              │
│  └─────────────────────────────────────────┘              │
│                                                             │
│  ┌─────────────────────────────────────────┐              │
│  │  Hook: tool.execute.before              │              │
│  │  - Track working directory              │              │
│  └─────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 File Discovery Algorithm

**Walk-up strategy** (similar to EditorConfig):

```typescript
function findHierarchicalAgentsMd(
  currentPath: string,
  workspaceRoot: string,
  maxLevels: number = 10
): string[] {
  const files: string[] = [];
  let dir = currentPath;
  let level = 0;

  while (dir.startsWith(workspaceRoot) && level < maxLevels) {
    const agentsMdPath = join(dir, 'AGENTS.md');
    
    if (existsSync(agentsMdPath)) {
      files.unshift(agentsMdPath); // Add to front (root first)
    }
    
    if (dir === workspaceRoot) break;
    
    dir = dirname(dir);
    level++;
  }

  return files; // Ordered: [root, parent, child]
}
```

**Precedence**: Root → Parent → Child (later files conceptually override earlier, but we concatenate all)

**Depth limit**: 10 levels maximum to prevent pathological cases

### 3.3 Context Merging Strategy

**Concatenation approach** (simple, transparent):

```typescript
function mergeContexts(filePaths: string[], contents: string[]): string {
  if (filePaths.length === 0) return '';

  const sections = filePaths.map((path, idx) => {
    const relPath = relative(workspaceRoot, path);
    return `## Context from ${relPath}\n\n${contents[idx].trim()}`;
  });

  const merged = sections.join('\n\n---\n\n');
  return `<project-context>\n${merged}\n</project-context>`;
}
```

**Example output**:
```markdown
<project-context>
## Context from AGENTS.md

General project guidelines...

---

## Context from frontend/AGENTS.md

Frontend-specific rules...

</project-context>
```

### 3.4 Caching Strategy

**In-memory cache with file watching**:

```typescript
interface CacheEntry {
  files: string[];           // Paths of AGENTS.md files found
  mergedContent: string;     // Pre-merged context
  timestamp: number;         // Cache creation time
  mtimes: Map<string, number>; // File modification times
}

class HierarchicalAgentsMdCache {
  private cache = new Map<string, CacheEntry>();
  private watchers = new Map<string, chokidar.FSWatcher>();

  async get(workingDir: string, workspaceRoot: string): Promise<string> {
    const cacheKey = `${workspaceRoot}:${workingDir}`;
    const cached = this.cache.get(cacheKey);

    // Return cached if still valid
    if (cached && await this.isValid(cached)) {
      return cached.mergedContent;
    }

    // Load fresh
    const files = findHierarchicalAgentsMd(workingDir, workspaceRoot);
    const contents = await Promise.all(
      files.map(f => readFile(f, 'utf-8'))
    );
    const merged = mergeContexts(files, contents);

    // Store and watch
    const mtimes = new Map();
    for (const file of files) {
      const stats = await stat(file);
      mtimes.set(file, stats.mtimeMs);
    }

    this.cache.set(cacheKey, {
      files,
      mergedContent: merged,
      timestamp: Date.now(),
      mtimes
    });

    this.startWatching(cacheKey, files);

    return merged;
  }

  private startWatching(cacheKey: string, files: string[]) {
    if (this.watchers.has(cacheKey)) return;

    const watcher = chokidar.watch(files, {
      persistent: false,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50
      },
      ignoreInitial: true
    });

    watcher.on('change', () => {
      this.cache.delete(cacheKey);
    });

    watcher.on('unlink', () => {
      this.cache.delete(cacheKey);
    });

    this.watchers.set(cacheKey, watcher);
  }

  cleanup() {
    for (const watcher of this.watchers.values()) {
      watcher.close();
    }
    this.watchers.clear();
    this.cache.clear();
  }
}
```

**Cache invalidation**:
- File modification detected by chokidar
- File deletion detected by chokidar
- Manual cleanup on session end

**Performance target**: < 1ms for cache hits, < 50ms for cache misses

### 3.5 Working Directory Tracking

**Challenge**: OpenCode doesn't provide current file context in hooks

**Solution**: Track via tool execution monitoring

```typescript
let lastWorkingDirectory: string = process.cwd();

const hooks = {
  'tool.execute.before': async ({ tool }, { args }) => {
    // Track working directory from file operations
    if (['read', 'edit', 'write'].includes(tool) && args.filePath) {
      lastWorkingDirectory = dirname(args.filePath);
    }
  },

  'chat.system.transform': async ({ system, config }) => {
    const workspaceRoot = config.cwd || process.cwd();
    
    // Use tracked working directory for hierarchy discovery
    const context = await cache.get(lastWorkingDirectory, workspaceRoot);
    
    if (!context) return { system };
    
    return { system: `${context}\n\n${system}` };
  }
};
```

**Fallback**: Use workspace root if no file operations yet

### 3.6 Compaction Re-Injection

**Hook into compaction event**:

```typescript
'experimental.session.compacting': async ({ config }, output) => {
  const workspaceRoot = config.cwd || process.cwd();
  
  // Re-load hierarchical context
  const context = await cache.get(lastWorkingDirectory, workspaceRoot);
  
  if (!context) return;
  
  // Truncate to token limit (1000 tokens ≈ 4000 chars)
  const truncated = truncateToTokenLimit(context, 1000);
  
  output.context.push(`## Project Context (Re-injected)\n\n${truncated}`);
}
```

**Token limit**: 1000 tokens (≈ 4000 characters)

**Truncation strategy**: 
- If under limit: inject full context
- If over limit: truncate with "... (truncated)" marker
- Prioritize closest (most specific) AGENTS.md content

---

## 4. Implementation Details

### 4.1 File Structure

**New plugin file**:
```
plugin/src/
├── index.ts
├── tools/
└── utils/
    └── hierarchical-agents-md.ts   ← NEW
```

**Modified files**:
- `plugin/src/index.ts` - Register new plugin hooks

### 4.2 Dependencies

**New dependency**:
- `chokidar@^4.0.0` - File watching (proven, cross-platform)

**Rationale**: 
- 30M+ downloads/week
- Powers Webpack, Vite, Parcel
- Handles edge cases (atomic writes, chunked writes)
- Cross-platform consistency

**Existing dependencies**:
- Node.js stdlib (`fs`, `path`)
- OpenCode SDK

### 4.3 Configuration

**No configuration required** - works out of the box

**Future configuration options** (`.pepper/config.json`):
```json
{
  "agentsMd": {
    "enabled": true,
    "maxDepth": 10,
    "compactionTokenLimit": 1000,
    "cacheEnabled": true
  }
}
```

### 4.4 Integration with Existing System

**Replace agents-md-loader.ts**:
- Current plugin only loads from project root
- New plugin supersedes with hierarchical support
- Backward compatible (still loads root AGENTS.md)

**Migration path**:
- Rename `agents-md-loader.ts` to `agents-md-loader.legacy.ts`
- Create new `hierarchical-agents-md-loader.ts`
- Update plugin index to use new loader
- Test with existing projects (should work identically for root-only setups)

---

## 5. Edge Cases and Error Handling

### 5.1 Edge Cases

| Scenario | Handling |
|----------|----------|
| No AGENTS.md found | Return empty context, no injection |
| Only root AGENTS.md | Behaves like current system |
| AGENTS.md in subdirectory but not root | Load subdirectory only |
| Circular directory structure | Prevented by max depth limit (10) |
| Symlinked AGENTS.md | Follow symlink (readFile handles this) |
| File deleted during session | Watcher invalidates cache, next load finds new hierarchy |
| File modified during read | chokidar's awaitWriteFinish prevents partial reads |
| Permission denied on AGENTS.md | Skip file, log warning, continue with available files |
| Binary/non-UTF8 AGENTS.md | readFile error caught, skip file, log warning |
| Very large AGENTS.md (>1MB) | Load but warn, truncate at compaction |
| Working directory outside workspace | Use workspace root as fallback |

### 5.2 Error Handling

**Philosophy**: Graceful degradation - never block agent operation

```typescript
async function safeLoadAgentsMd(filePath: string): Promise<string | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    if (error.code === 'EACCES') {
      console.warn(`[AGENTS.md] Permission denied: ${filePath}`);
    } else if (error.code === 'ENOENT') {
      // File disappeared - normal, don't warn
    } else {
      console.warn(`[AGENTS.md] Error loading ${filePath}:`, error.message);
    }
    return null;
  }
}
```

**Logging strategy**:
- Info: Context loaded successfully
- Warn: File errors (permissions, encoding)
- Error: Never (graceful degradation)

---

## 6. Testing Strategy

### 6.1 Unit Tests

**Test coverage**:

1. **File Discovery**:
   - Single AGENTS.md at root
   - Hierarchical AGENTS.md (root + subdirectories)
   - No AGENTS.md found
   - Max depth limit enforcement
   - Working directory outside workspace

2. **Context Merging**:
   - Single file merge
   - Multiple files merge (verify order)
   - Empty files handling
   - XML tag wrapping

3. **Caching**:
   - Cache hit returns same content
   - Cache invalidation on file change
   - Cache invalidation on file deletion
   - Multiple cache keys for different paths

4. **Compaction Re-injection**:
   - Context re-injected after compaction
   - Token limit enforced
   - Truncation applied correctly

5. **Error Handling**:
   - Permission denied on AGENTS.md
   - Non-UTF8 file content
   - File deleted during read
   - Broken symlink

### 6.2 Integration Tests

**Test scenarios**:

1. **Monorepo Structure**:
   ```
   /AGENTS.md                    (root context)
   /frontend/AGENTS.md           (frontend context)
   /backend/AGENTS.md            (backend context)
   ```
   - Agent works on `/frontend/src/app.ts`
   - Verify both root + frontend contexts loaded
   - Agent works on `/backend/api.ts`
   - Verify both root + backend contexts loaded

2. **Context Loss and Recovery**:
   - Start session, load context
   - Trigger compaction (simulate long conversation)
   - Verify context re-injected
   - Verify truncation if over limit

3. **File Watching**:
   - Load context
   - Modify AGENTS.md
   - Send new message
   - Verify updated context loaded

4. **Performance**:
   - Benchmark: 100 messages with caching
   - Verify < 50ms overhead per message
   - Benchmark: Cache hit latency < 1ms

### 6.3 Manual Testing

**Test cases**:

1. Create monorepo with hierarchical AGENTS.md
2. Use Jalapeño to work on frontend files
3. Verify frontend context appears in responses
4. Switch to backend files
5. Verify backend context appears
6. Modify AGENTS.md during session
7. Verify changes reflected in next message

---

## 7. Performance Considerations

### 7.1 Benchmarks (Estimated)

| Operation | Time (ms) | Impact |
|-----------|-----------|--------|
| File discovery (10 levels) | 5-20 | Low |
| Read single AGENTS.md | 1-5 | Negligible |
| Read 3 files (hierarchy) | 5-15 | Low |
| Merge contexts | 1-5 | Negligible |
| Cache hit | < 1 | Negligible |
| chokidar setup | 10-30 | One-time |
| **Total per message (cached)** | **< 1** | **Negligible** |
| **Total per message (uncached)** | **< 50** | **Acceptable** |

### 7.2 Memory Impact

- Cache entry: ~5-50 KB per path
- Typical project: 3-5 cache entries = 15-250 KB
- chokidar overhead: ~100 KB per watcher
- **Total**: < 1 MB (negligible)

### 7.3 Optimizations

1. **Lazy file discovery**: Only walk up when working directory changes
2. **Shared watchers**: Reuse watchers for same file across cache keys
3. **LRU eviction**: Limit cache to 50 entries (future enhancement)
4. **Debounced invalidation**: Wait 100ms after file change before invalidating

---

## 8. Migration and Rollout

### 8.1 Migration Path

**Phase 1: Development**
- Implement new plugin alongside existing
- Test in chili-ocx development environment
- Verify backward compatibility

**Phase 2: Testing**
- Enable for beta testers
- Gather feedback on performance
- Monitor for edge cases

**Phase 3: Rollout**
- Replace agents-md-loader with new implementation
- Document in README
- Provide example AGENTS.md structures

### 8.2 Backward Compatibility

**Guarantee**: Existing projects with root AGENTS.md work identically

**Testing**:
- Run all existing tests with new plugin
- Verify zero regression
- Performance benchmarks unchanged

### 8.3 Documentation Updates

**README.md**:
```markdown
## Hierarchical AGENTS.md

Pepper automatically loads context from AGENTS.md files in your project:

- `/AGENTS.md` - Project-wide context
- `/frontend/AGENTS.md` - Frontend-specific context  
- `/backend/AGENTS.md` - Backend-specific context

Agents automatically load relevant context based on which files they're working on.

### Example Structure

```
my-monorepo/
├── AGENTS.md           ← "Use TypeScript strict mode"
├── frontend/
│   ├── AGENTS.md       ← "Use React hooks, no class components"
│   └── src/
└── backend/
    ├── AGENTS.md       ← "Use Express.js conventions"
    └── api/
```

When working on `frontend/src/App.tsx`, agents see both project-wide AND frontend-specific context.
```

---

## 9. Open Questions and Future Enhancements

### 9.1 Open Questions

1. **Q**: Should we support `.agents.md` (lowercase) as well?
   **A**: No - keep it simple with AGENTS.md only. Can add later if requested.

2. **Q**: Should AGENTS.md support a `root: true` marker to stop hierarchy search?
   **A**: Defer to future enhancement. YAGNI for now.

3. **Q**: How to handle conflicts between root and child contexts?
   **A**: Concatenate all - let LLM resolve conflicts naturally.

### 9.2 Future Enhancements

**P2: YAML Frontmatter Support**
```markdown
---
merge: override
priority: high
apply_to: [jalapeno-coder, habanero-reviewer]
---
```

**P2: Section-Based Merging**
- Parse markdown headers
- Merge by section name
- Child sections override parent

**P3: Per-Agent Opt-Out**
```markdown
---
exclude_agents: [chipotle-scribe]
---
```

**P3: Configurable Token Limits**
```json
{
  "agentsMd": {
    "compactionTokenLimit": 2000
  }
}
```

**P3: Smart Truncation**
- Prioritize closest AGENTS.md
- Summarize root context if over limit
- Use LLM to compress context

---

## 10. Acceptance Criteria

**Definition of Done**:

- [ ] File discovery algorithm implemented and tested
- [ ] Context merging works with 1-10 files
- [ ] Cache with chokidar file watching functional
- [ ] Compaction re-injection working with token limit
- [ ] Working directory tracking via tool execution
- [ ] Integration with existing agents-md-loader replaced
- [ ] Unit tests: 90%+ coverage
- [ ] Integration tests: monorepo scenarios pass
- [ ] Performance: < 50ms overhead per uncached message
- [ ] Performance: < 1ms overhead per cached message
- [ ] Documentation: README updated with examples
- [ ] Zero regressions in existing projects
- [ ] chokidar dependency added and documented

---

## 11. References

### 11.1 Research

- Ghost exploration session: Hierarchical context patterns (2026-01-21)
- Ghost exploration session: Caching strategies in coding assistants (2026-01-21)
- EditorConfig specification: Hierarchical config resolution
- oh-my-opencode codebase: agents-md-loader.ts current implementation

### 11.2 Related RFCs

- RFC-001: Workspace Path Resolution Utility (symlink handling)
- RFC-002: pepper_init Enhancement (state.json structure)
- RFC-003: Agent Prompt Updates (prompt engineering)

### 11.3 External Documentation

- chokidar: https://github.com/paulmillr/chokidar
- Node.js fs module: https://nodejs.org/api/fs.html
- OpenCode SDK hooks: (internal documentation)

---

## 12. Appendix

### 12.1 Example AGENTS.md Hierarchy

**`/AGENTS.md`**:
```markdown
# Project-Wide Context

This is the Chili-OCX plugin for OpenCode.

## Tech Stack
- TypeScript (strict mode)
- OpenCode SDK
- Node.js 18+

## Code Style
- Use functional programming
- Prefer immutability
- Use Zod for validation
```

**`/plugin/AGENTS.md`**:
```markdown
# Plugin Development Context

When working on plugin code:
- Register tools in `src/index.ts`
- Use `definePlugin()` from SDK
- Follow plugin naming conventions
```

**`/tests/AGENTS.md`**:
```markdown
# Testing Context

When working on tests:
- Use Vitest as test framework
- Follow AAA pattern (Arrange, Act, Assert)
- Mock file system with `memfs`
```

### 12.2 Compaction Re-Injection Example

**Before compaction** (full context available):
```
<project-context>
## Context from AGENTS.md
[2000 characters of content]

## Context from plugin/AGENTS.md
[1500 characters of content]
</project-context>
```

**After compaction** (truncated to 1000 tokens ≈ 4000 chars):
```
## Project Context (Re-injected)

<project-context>
## Context from AGENTS.md
[2000 characters]

## Context from plugin/AGENTS.md
[1500 characters]
</project-context>

... (truncated to fit 1000 token limit)
```

---

**Status**: Ready for implementation  
**Next Steps**: Assign to Jalapeño for development
