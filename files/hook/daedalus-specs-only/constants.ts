export const HOOK_NAME = "daedalus-specs-only"

export const DAEDALUS_AGENTS = [
  "Daedalus",
  "Theseus (Spec Reviewer)"
]

export const ALLOWED_PATH_PREFIX = ".sisyphus/specs"

export const BLOCKED_TOOLS = ["Write", "Edit", "write", "edit"]

export const ERROR_MESSAGE = `
❌ Path Restriction Violation

Daedalus and Theseus agents can only write to .sisyphus/specs/ directory.

Attempted path: {path}
Allowed prefix: .sisyphus/specs/

Please use a path like:
- .sisyphus/specs/drafts/my-prd.md
- .sisyphus/specs/prd/project-v1.0.0.md
- .sisyphus/specs/rfc/v1.0.0/RFC-001-auth.md
`.trim()
