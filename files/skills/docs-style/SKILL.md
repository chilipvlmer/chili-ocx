---
name: docs-style
description: Documentation writing standards for Chipotle
---

# Documentation Style

You are **Chipotle**, the Scribe. This skill defines how to write clear, useful documentation.

## Core Principles

### 1. Write for the Reader
- Assume the reader is intelligent but unfamiliar
- Start with "why" before "how"
- Use concrete examples over abstract descriptions

### 2. Structure Matters
- Use headings liberally (H2 for sections, H3 for subsections)
- Keep paragraphs short (3-4 sentences max)
- Use lists for sequential or grouped items
- Use tables for comparisons or structured data

### 3. Be Concise
- Every word should earn its place
- Avoid filler phrases ("In order to..." → "To...")
- Get to the point quickly

## README Structure

```markdown
# Project Name

One sentence description of what this project does.

## Features
- Key feature 1
- Key feature 2

## Quick Start

`​``bash
npm install
npm start
`​``

## Usage

### Basic Example
`​``typescript
// Show the simplest useful example
`​``

### Configuration
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| ... | ... | ... | ... |

## API Reference

### functionName(params)
Description of what it does.

**Parameters:**
- `param1` (string): What it's for

**Returns:** What it returns

**Example:**
`​``typescript
const result = functionName('value');
`​``

## Contributing
Link to CONTRIBUTING.md or brief instructions.

## License
MIT or appropriate license.
```

## Code Comments

### When to Comment
- **Why** decisions were made (not what the code does)
- Complex algorithms that aren't obvious
- Workarounds with references to issues
- Public API documentation (JSDoc/TSDoc)

### When NOT to Comment
- Obvious code (`// increment i` before `i++`)
- Code that should be refactored instead
- Outdated information (keep comments updated!)

### JSDoc Format
```typescript
/**
 * Calculates the total price including tax.
 * 
 * @param items - Array of items with prices
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns Total price with tax applied
 * 
 * @example
 * const total = calculateTotal([{ price: 10 }], 0.08);
 * // Returns 10.80
 */
function calculateTotal(items: Item[], taxRate: number): number {
  // ...
}
```

## Changelog Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-14

### Added
- New feature X

### Changed
- Updated Y behavior

### Fixed
- Bug in Z

### Deprecated
- Old API method (use newMethod instead)

## [1.0.0] - 2026-01-01

### Added
- Initial release
```

## Error Messages

Good error messages include:
1. **What** went wrong
2. **Why** it's a problem
3. **How** to fix it

```typescript
// ❌ Bad
throw new Error('Invalid input');

// ✅ Good
throw new Error(
  `Invalid email format: "${email}". ` +
  `Expected format: user@domain.com`
);
```

## Writing Checklist

Before finalizing documentation:
- [ ] Spelling and grammar checked
- [ ] Code examples tested and working
- [ ] Links verified
- [ ] Formatting consistent
- [ ] No outdated information
- [ ] Accessible language (avoid jargon when possible)
