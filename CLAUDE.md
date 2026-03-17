---
type: guide
authority: canonical
last-verified: 2026-03-17
audience: [ai-agents, contributors]
---

# CLAUDE.md — alawein

> Repository profile + governance templates

---

## Overview

This repository is the org-level docs and governance control plane for the
`alawein` GitHub organization.

It owns:

- portfolio truth (`README.md` + `projects.json`)
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
- Slash commands catalog and workflows (any repo/dir):
  [`docs/governance/slash-commands-catalog.md`](docs/governance/slash-commands-catalog.md)
- Skills, agents & commands unification (universal vs ecosystem vs org):
  [`docs/governance/skills-agents-unification.md`](docs/governance/skills-agents-unification.md)
- Skills/agents maintenance and tailoring runbook:
  [`docs/governance/maintenance-skills-agents.md`](docs/governance/maintenance-skills-agents.md)
- Operator quick commands:
  [`docs/governance/operator-command-cheatsheet.md`](docs/governance/operator-command-cheatsheet.md)
- Audits (environment, codebase):
  [`docs/audits/full-environment-audit-2026-03-16.md`](docs/audits/full-environment-audit-2026-03-16.md);
  step-by-step remediation: [`docs/audits/remediation-checklist-2026-03-16.md`](docs/audits/remediation-checklist-2026-03-16.md)
- Credential hygiene (secrets, MCP, CI):
  [`docs/governance/credential-hygiene.md`](docs/governance/credential-hygiene.md)
- Profile sync from guides (README About / positioning):
  [`docs/governance/profile-sync-from-guides.md`](docs/governance/profile-sync-from-guides.md)
- Profile sync and PKOS alignment (single handoff for agents):
  [`docs/governance/cursor-agent-handoff-profile-sync.md`](docs/governance/cursor-agent-handoff-profile-sync.md)
- Branch naming, workflow, and Vercel deployment (single convention):
  [`docs/governance/branch-and-deployment-convention.md`](docs/governance/branch-and-deployment-convention.md)

## Required Files

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
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
  `scripts/sync-readme.py`. When `profile-from-guides.yaml` exists (from guides
  export), the same script updates the README About block; see
  [profile-sync-from-guides](docs/governance/profile-sync-from-guides.md).
- For profile sync or PKOS alignment work, read and follow
  [cursor-agent-handoff-profile-sync](docs/governance/cursor-agent-handoff-profile-sync.md).

---

## Repository Structure

```text
alawein/
  docs/
    README.md
    audits/
      full-environment-audit-YYYY-MM-DD.md
      remediation-checklist-YYYY-MM-DD.md
      codebase-audit-*.md
    governance/
      workspace-master-prompt.md
      documentation-contract.md
      credential-hygiene.md
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
