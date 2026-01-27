# RFC-006: Agent Skill Framework

**Status**: Draft
**Date**: 2026-01-25
**Author**: Chipotle (Scribe)
**References**:
- PRD: [Agent Skill Framework & Git Mastery](../../prd/agent-skills-v1.0.0.md)
- RFC: [RFC-007: Git Mastery Skill](./RFC-007-git-mastery-skill.md)

## 1. Goal
Create a system to load, parse, and register skills as dynamic tools. This framework enables agents to discover and execute standardized workflows defined in Markdown.

## 2. Approach

### 2.1 Skill Definition
Skills will be defined in Markdown files located in `.opencode/skills/`. Each skill file will contain:
- **Frontmatter**: Metadata including unique name, description, and input parameters.
- **Content**: A structured list of steps to execute.

### 2.2 Dynamic Registration
The system will:
1.  **Load**: Scan `.opencode/skills/*.md` files.
2.  **Parse**: Extract Frontmatter and Steps into a JSON structure.
3.  **Register**: Dynamically create a tool for each skill (e.g., `skill_git_mastery`).
    - **Description**: Derived from the Markdown description.
    - **Arguments**: Derived from the Markdown `inputs` field.

### 2.3 Execution Engine (Capabilities)
To support advanced skills (like `git-mastery`), the execution engine must support:

1.  **Step Types**:
    - `shell`: Execute bash commands.
    - `regex_scan`: Scan file contents or variables against patterns (e.g., for secrets).
    - `llm_generate`: Query an internal LLM to generate text (e.g., commit messages) based on context.
    - `conditional`: Simple logic (if/else) based on previous step outputs or variables.
    - `interactive`: Pause execution and request user confirmation. For v1, this returns a proposal and requires re-invocation with `confirm: true`.

2.  **Context Management**:
    - **Variable Injection**: Steps can reference outputs from previous steps (e.g., `${step1.stdout}`).
    - **Smart Summarization**: The engine must handle large outputs (like `git diff`) by supporting strategies like "chunking" or "head/tail" truncation to avoid context overflow.

3.  **Safety & Middleware**:
    - Support for "guardrail" steps that can abort execution (e.g., if a secret is found).

## 3. Technical Details

### 3.1 File Structure
- `plugins/skills/loader.js`: Handles reading and parsing of Markdown files.
- `plugins/skills/registry.js`: Manages the registration of parsed skills as executable tools.
- `plugins/skills/runner.js`: The execution engine that processes steps and handles state/context.

### 3.2 Integration
- Update `index.js` (or the main entry point) to initialize the skill loader and registry at startup.
- Ensure the `run_skill` capability or individual dynamic tools are exposed to the agent context.

### 3.3 Parsing Logic
The parser must robustly handle standard Markdown and YAML frontmatter. It should interpret code blocks as executable steps where applicable.

## 4. Dependencies
- **Node.js**: Filesystem and child_process modules.
- **LLM Interface**: Access to an internal LLM provider for `llm_generate` steps.

## 5. Risks
- Malformed Markdown files could cause registration failures.
- Infinite loops in conditional logic.
- **Security**: "Shell" steps allow arbitrary code execution; skills must be vetted (e.g., only load from trusted `.opencode/skills/` directory).
