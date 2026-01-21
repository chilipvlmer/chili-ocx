# Contributing to chili-ocx

Thank you for your interest in contributing to the chili-ocx registry! This document provides guidelines and instructions for adding new components.

## 🌟 Types of Contributions

We welcome:
- ✅ **New components** (skills, plugins, agents)
- ✅ **Component improvements** (better docs, bug fixes)
- ✅ **Documentation updates**
- ✅ **Bug reports and feature requests**

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.3.5+
- [OCX CLI](https://github.com/kdcokenny/ocx)
- Git

### Setup

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/chili-ocx.git
   cd chili-ocx
   ```
3. **Install dependencies:**
   ```bash
   bun install
   ```
4. **Create a branch:**
   ```bash
   git checkout -b add-my-component
   ```

## 📦 Adding a Component

### 1. Choose Component Type

| Type | Use Case | File Location |
|------|----------|---------------|
| **Skill** | Teach AI new behaviors | `files/skill/{name}/SKILL.md` |
| **Plugin** | Extend OpenCode functionality | `files/plugin/{name}.ts` |
| **Agent** | Define AI personas | `files/agent/{name}.md` |
| **Bundle** | Group related components | `files/bundle/{name}.json` |

### 2. Create Component File

#### For a Skill:

```bash
mkdir -p files/skill/my-skill
touch files/skill/my-skill/SKILL.md
```

**Template:**
```markdown
# My Skill

Brief description of what this skill enables.

## TL;DR

One-paragraph summary for quick reference.

## When to Use

- Condition 1
- Condition 2
- Condition 3

## Instructions

Detailed instructions the AI should follow...

## Examples

Show good and bad examples...

## What NOT to Do

- Anti-pattern 1
- Anti-pattern 2
```

#### For a Plugin:

```bash
touch files/plugin/my-plugin.ts
```

**Template:**
```typescript
import type { Plugin, PluginContext, ToolDefinition } from "opencode"

export default {
  name: "my-plugin",
  version: "1.0.0",

  onSessionStart: async (ctx: PluginContext) => {
    // Initialization logic
  },

  tools: [
    // Custom tools
  ],

  config: {
    // Configuration injection
  }
} satisfies Plugin
```

### 3. Register in `registry.jsonc`

Add your component to the `components` array:

```jsonc
{
  "components": [
    // ... existing components
    {
      "name": "my-skill",
      "type": "ocx:skill",
      "description": "Clear, concise description of what it does",
      "files": ["skill/my-skill/SKILL.md"]
    }
  ]
}
```

### 4. Test Locally

```bash
# Build the registry
bun run build

# Verify your component appears in dist/index.json
cat dist/index.json

# Test installation locally (if you have OCX CLI)
ocx add my-skill --registry file://$(pwd)/dist
```

### 5. Submit Pull Request

```bash
# Commit your changes
git add .
git commit -m "Add my-skill component"

# Push to your fork
git push origin add-my-component

# Create PR on GitHub
```

## ✅ Component Guidelines

### General Rules

1. **Be specific** - Components should do one thing well
2. **Clear naming** - Names should be descriptive and kebab-case
3. **Complete documentation** - Include examples and anti-patterns
4. **Test thoroughly** - Build and test before submitting
5. **Follow conventions** - Match the style of existing components

### Skills

- ✅ Include a TL;DR section
- ✅ Provide concrete examples (good and bad)
- ✅ List clear "When to Use" conditions
- ✅ Add "What NOT to Do" anti-patterns
- ✅ Keep instructions scannable (use headers, bullets)
- ❌ Don't make skills too broad or vague
- ❌ Don't assume prior knowledge

### Plugins

- ✅ Use TypeScript with strict typing
- ✅ Handle errors gracefully
- ✅ Keep dependencies minimal
- ✅ Document all hooks and tools
- ✅ Include JSDoc comments
- ❌ Don't swallow exceptions silently
- ❌ Don't use any global state

### Agents

- ✅ Define clear scope and boundaries
- ✅ List explicit permissions
- ✅ Include forbidden actions
- ✅ Specify response format
- ❌ Don't create overly permissive agents
- ❌ Don't leave behavior ambiguous

## 🎨 Code Style

Follow "The 5 Laws of Elegant Defense" (see [README.md](README.md#agents)):

1. **Early Exit** - Guard clauses at the top
2. **Parse, Don't Validate** - Use Zod schemas
3. **Atomic Predictability** - Pure functions
4. **Fail Fast, Fail Loud** - Clear errors
5. **Intentional Naming** - Self-documenting code

## 📋 PR Checklist

Before submitting your PR, ensure:

- [ ] Component file(s) created in `files/`
- [ ] Entry added to `registry.jsonc`
- [ ] `bun run build` succeeds
- [ ] Component appears in `dist/index.json`
- [ ] README.md updated (if adding to Available Components table)
- [ ] Code follows style guidelines
- [ ] Documentation is complete
- [ ] No secrets or sensitive data included
- [ ] Commit message is clear and descriptive

## 🐛 Reporting Issues

Found a bug or have a feature request?

1. **Check existing issues** first
2. **Create a new issue** with:
   - Clear title
   - Detailed description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment info (Bun version, OS, etc.)

## 💬 Questions?

- Open an issue with the `question` label
- Check existing documentation in [README.md](README.md)
- Review the [OCX documentation](https://github.com/kdcokenny/ocx)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions help make OpenCode more powerful for everyone. We appreciate your time and effort! ❤️

---

**Happy Contributing! 🌶️**
