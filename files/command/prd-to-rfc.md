---
name: prd-to-rfc
description: Convert PRD to implementation-ready RFCs
---

# /prd-to-rfc

Convert a PRD into technical RFCs with architectural dialogue.

## Usage

```bash
/prd-to-rfc <prd-path>
```

## Arguments

- `prd-path` (required): Path to PRD file to convert (default: `.sisyphus/specs/prd/`)

## Behavior

Routes to Daedalus agent with the following workflow:

1. **Load Skills**: Activates rfc-generation and architecture-dialogue skills
2. **Analyze PRD**: Extracts technical requirements and constraints from `.sisyphus/specs/prd/`
3. **Conduct Dialogue**: Engages in technology decision discussion with trade-off analysis
4. **Generate RFCs**: Creates implementation-ready RFC files using standardized 12-section structure with high accuracy
5. **Map Dependencies**: Documents dependency relationships and implementation sequence
6. **Update Status**: Maintains RFC status tracking in JSON format

## Output

Generated files are written to:

- **RFC Files**: `.sisyphus/specs/rfc/v{version}/RFC-{NNN}-{slug}.md`
- **Status File**: `.sisyphus/rfc-status.json`

Where:
- `{version}` is the PRD version (e.g., `1.0.0`)
- `{NNN}` is the RFC sequence number (001, 002, etc.)
- `{slug}` is the RFC title slug (e.g., `user-authentication`, `database-schema`)

The RFC generation uses high accuracy mode to ensure technical precision and implementation readiness.

## RFC Structure

Each RFC follows a 12-section framework:

1. Overview & Objectives
2. Requirements Analysis
3. Architecture & Design
4. Implementation Details
5. Dependencies & Integration
6. Risk Assessment
7. Performance & Scalability
8. Security & Compliance
9. Testing & Quality
10. Deployment & Operations
11. Maintenance & Support
12. Timeline & Resources

## Status Tracking

The `.sisyphus/rfc-status.json` file tracks implementation progress with statuses:
- `pending`: Not yet started
- `in-progress`: Currently being implemented
- `implemented`: Completed and deployed
- `deprecated`: No longer applicable
