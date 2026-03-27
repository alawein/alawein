---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last-verified: 2026-03-17
audience: [ai-agents, contributors]
---

# SSOT — alawein

**Version:** 1.2
**Last Updated:** 2026-03-17
**Status:** Active

---

## Purpose

Organization profile and portfolio governance source for the `@alawein` GitHub
organization. This repository is docs-only and owns the canonical workspace
governance contract for naming, portfolio truth, and migration sequencing.

## Current State

- Organization profile and documentation: ✅ Active
- Workspace operating contract:
  [`docs/governance/workspace-master-prompt.md`](docs/governance/workspace-master-prompt.md)
- Workspace batch execution contract:
  [`docs/governance/parallel-batch-execution.md`](docs/governance/parallel-batch-execution.md)
- Local documentation contract:
  [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md)
- Governance suite navigation:
  [`docs/README.md`](docs/README.md)
- Canonical governance validation:
  `./scripts/validate-doc-contract.sh --full`
- Managed-doc canonical name/domain audit:
  `.github/workflows/docs-validation.yml` (with `docs/archive/**` exemption)
- Manifest-driven batch governance is active for multi-repo autonomous work
- README sections are generated from `projects.json` via
  `scripts/sync-readme.py`
- Canonical naming policy is active; hard cutover completed on 2026-03-11 for
  `gymboy`, `meatheadphysicist`, `atelier-rounaq`, and `edfp`
- Transitional identifiers are retained in `projects.json` via `legacy_slugs`
  for one migration cycle
- D-1 consolidation status: canonical token source is `devkit/tokens/`; legacy
  `aw-devkit` physical retirement cutover completed on 2026-03-11
- Branch and deployment convention (feat/*, Vercel, multi-repo):
  [`docs/governance/branch-and-deployment-convention.md`](docs/governance/branch-and-deployment-convention.md)

## Structure

```text
alawein/
├── AGENTS.md
├── CLAUDE.md
├── SSOT.md
├── LESSONS.md
├── docs/
│   ├── README.md
│   └── governance/
│       ├── workspace-master-prompt.md
│       ├── operating-model.md
│       ├── documentation-contract.md
│       ├── workflow.md
│       ├── parallel-batch-execution.md
│       ├── git-operations.md
│       ├── feature-lifecycle.md
│       ├── review-playbook.md
│       ├── merge-policy.md
│       ├── release-playbook.md
│       ├── clean-slate-workflow.md
│       ├── changelog-entry.md
│       ├── workspace-standardization.md
│       ├── workspace-rename-matrix.md
│       ├── workspace-layout-audit.md
│       └── workspace-resource-map.md
└── scripts/
    ├── validate-doc-contract.sh
    ├── sync-readme.py
    └── sync-to-notion.mjs
```

## What's Next

- Keep canonical files fresh (last-verified ≤ 30 days)
- Keep README/project data/workspace docs synchronized for any naming or domain
  change
- Complete phased workspace directives (D-1 through D-5) with org README sync
  at each structural milestone

---

_Governed by: [AGENTS.md](AGENTS.md)_
See [CLAUDE.md](CLAUDE.md) | [AGENTS.md](AGENTS.md)
