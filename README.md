# chili-ocx 🌶️

An open-source component registry for [OpenCode](https://opencode.ai) - extending AI assistants with reusable skills, plugins, and agents.

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/deploy-cloudflare-orange)](https://chili-ocx.pages.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🚀 Installation

Install components from this registry using the [OCX CLI](https://github.com/kdcokenny/ocx):

```bash
# Install a component
ocx add chili-ocx/hello-world --registry https://chili-ocx.pages.dev

# Or add the registry to your OpenCode config
ocx registry add chili-ocx https://chili-ocx.pages.dev

# Then install with shorthand
ocx add chili-ocx/hello-world
```

## 📦 Available Components

### MCP Bundles

Install all MCP servers at once or pick individual ones:

```bash
# Install everything
ocx add chili-ocx/total

# Or install individual MCP servers
ocx add chili-ocx/mcp-shadcn
ocx add chili-ocx/mcp-exa
ocx add chili-ocx/mcp-context7
ocx add chili-ocx/mcp-gh-grep
```

| Name | Description | API Key Required |
|------|-------------|------------------|
| **total** | Meta bundle - installs all MCP servers | See individual MCPs |
| **mcp-shadcn** | shadcn/ui component browser and installer | ❌ No |
| **mcp-exa** | AI-powered web search via Exa | ✅ Yes ([Get key](https://exa.ai)) |
| **mcp-context7** | Library documentation and code examples | ❌ No |
| **mcp-gh-grep** | GitHub code search via grep.app | ❌ No |

#### 🔑 API Key Setup

If you install `mcp-exa` (or `total` bundle), you need to set an environment variable:

```bash
# Add to ~/.zshrc, ~/.bashrc, or .env
export EXA_API_KEY="your-api-key-here"

# Get your API key from: https://exa.ai
```

### Skills

| Name | Description | Version |
|------|-------------|---------|
| [hello-world](files/skill/hello-world/SKILL.md) | Example skill demonstrating the OCX skill format | 1.0.0 |

*More components coming soon! Check the [files/](files/) directory for all available components.*

## 🎯 What is OCX?

OCX is a component system for OpenCode that lets you:
- 📚 **Skills** - Teach AI assistants new capabilities
- 🔌 **Plugins** - Extend OpenCode with custom tools and hooks
- 🤖 **Agents** - Define specialized AI roles and behaviors
- 📦 **Bundles** - Distribute collections of related components

Learn more: [OCX Documentation](https://github.com/kdcokenny/ocx)

## 🛠️ For Developers

### Prerequisites

- [Bun](https://bun.sh) v1.3.5 or later
- [OCX CLI](https://github.com/kdcokenny/ocx)

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/chili-ocx.git
cd chili-ocx

# Install dependencies
bun install

# Build the registry
bun run build

# The built registry will be in dist/
```

### Adding a Component

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on creating and submitting new components.

**Quick start:**

1. **Create your component file:**
   ```bash
   mkdir -p files/skill/my-skill
   touch files/skill/my-skill/SKILL.md
   ```

2. **Register in `registry.jsonc`:**
   ```jsonc
   {
     "components": [
       {
         "name": "my-skill",
         "type": "ocx:skill",
         "description": "What your skill does",
         "files": ["skill/my-skill/SKILL.md"]
       }
     ]
   }
   ```

3. **Test locally:**
   ```bash
   bun run build
   # Verify dist/index.json contains your component
   ```

4. **Submit a PR:**
   ```bash
   git checkout -b add-my-skill
   git add .
   git commit -m "Add my-skill component"
   git push origin add-my-skill
   # Create PR on GitHub
   ```

## 🌐 Deployment

This registry auto-deploys to Cloudflare Pages when changes are pushed to the `main` branch.

**Registry URL:** https://chili-ocx.pages.dev

### Manual Deployment

You can also deploy manually using Wrangler:

```bash
bun run build
bunx wrangler pages deploy dist --project-name=chili-ocx
```

## 📚 Component Types

| Type | Purpose | Format | Example |
|------|---------|--------|---------|
| `ocx:skill` | AI behavior instructions | Markdown | [hello-world](files/skill/hello-world/SKILL.md) |
| `ocx:plugin` | OpenCode extensions | TypeScript | *Coming soon* |
| `ocx:agent` | Agent role definitions | Markdown | *Coming soon* |
| `ocx:bundle` | Component collections | JSON | *Coming soon* |

See [AGENTS.md](AGENTS.md) for detailed documentation on each component type and best practices.

## 🤝 Contributing

Contributions are welcome! This is an open-source project and we'd love to have your components in the registry.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Component guidelines
- Code of conduct
- Submission process
- Development workflow

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Registry:** https://chili-ocx.pages.dev
- **OpenCode:** https://opencode.ai
- **OCX CLI:** https://github.com/kdcokenny/ocx
- **Documentation:** [AGENTS.md](AGENTS.md)

## 🙏 Acknowledgments

Built with the [OCX Registry Starter](https://github.com/kdcokenny/ocx/tree/main/examples/registry-starter) template.

---

**Made with ❤️ by [chilipvlmer](https://github.com/chilipvlmer)**

