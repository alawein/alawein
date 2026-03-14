---
type: guide
authority: canonical
last-verified: 2026-03-11
audience: [ai-agents, contributors]
---

# CLAUDE.md — alawein

> Repository profile + governance templates

---

## Overview

This repository is the org-level docs and governance control plane for the
`alawein` GitHub organization.

It owns:

- portfolio truth (`README-backup-20250807.md` + `projects.json`)
- workspace governance rules
- documentation contract and validation scripts

**Repository Type**: Organization Profile  
**Primary Language**: N/A (documentation and policies)  
**Build System**: N/A (static organizational content)

---

## Governance Sources

- Workspace operating contract:
  [`docs/governance/workspace-master-prompt.md`](docs/governance/workspace-master-prompt.md)
- Documentation contract:
  [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md)
- Repo boundaries:
  [`AGENTS.md`](AGENTS.md)
- Current state:
  [`SSOT.md`](SSOT.md)
- Design/branding plan summary and remaining steps:
  [`docs/governance/design-branding-summary.md`](docs/governance/design-branding-summary.md),
  [`docs/governance/remaining-steps-per-repo.md`](docs/governance/remaining-steps-per-repo.md),
  [`docs/HANDOFF-DESIGN-BRANDING.md`](docs/HANDOFF-DESIGN-BRANDING.md)

## Required Files

- `AGENTS.md`
- `CLAUDE.md`
- `README-backup-20250807.md`
- `SSOT.md`
- `LESSONS.md`
- `CONTRIBUTING-backup-20250807.md`
- `CODE_OF_CONDUCT.md`
- `LICENSE`
- `SECURITY.md`
- `CHANGELOG.md`
- `docs/governance/documentation-contract.md`
- `docs/governance/workspace-master-prompt.md`
- `scripts/validate-doc-contract.sh`

---

## Naming and Migration Rules

- Use canonical names in docs and inventory tables.
- When canonical name and physical repo slug differ, use:
  `canonical-name (repo: physical-slug)`.
- Keep links pointed at physical slugs until cutover.
- Hard-cutover status (2026-03-11): `gymboy`, `meatheadphysicist`,
  `atelier-rounaq`, and `edfp` now use canonical physical slugs.
- Regenerate README sync blocks from `projects.json` with
  `scripts/sync-readme.py`.

---

## Repository Structure

```text
alawein/
  docs/
    README-backup-20250807.md
    governance/
      workspace-master-prompt.md
      documentation-contract.md
      operating-model.md
      workflow.md
      git-operations.md
      feature-lifecycle.md
      review-playbook.md
      merge-policy.md
      release-playbook.md
      clean-slate-workflow.md
      changelog-entry.md
      workspace-standardization.md
      workspace-rename-matrix.md
      workspace-layout-audit.md
      workspace-resource-map.md
  .github/
    ISSUE_TEMPLATE/
    workflows/
    CODEOWNERS
    pull_request_template.md
  scripts/
    validate-doc-contract.sh
    sync-readme.py
    sync-to-notion.mjs
  projects.json
```

---

## Development Workflow

1. Read [`AGENTS.md`](AGENTS.md) and [`SSOT.md`](SSOT.md).
2. Read
   [`docs/governance/workspace-master-prompt.md`](docs/governance/workspace-master-prompt.md).
3. Read
   [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md).
4. Run `python scripts/sync-readme.py --check`.
5. Run `./scripts/validate-doc-contract.sh --full`.

---

## Quality Gates

Before proposing changes:

- `python scripts/sync-readme.py --check`
- `./scripts/validate-doc-contract.sh --full`
- markdown lint/link checks for managed docs (same commands as CI workflows)

---

## Governance

See [AGENTS.md](AGENTS.md) for boundaries and [SSOT.md](SSOT.md) for current
state.
