---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last-verified: 2026-04-15
audience: [ai-agents, contributors]
---

# SSOT — alawein

**Version:** 1.4
**Last Updated:** 2026-04-15
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
- Canonical voice contract:
  [`docs/style/VOICE.md`](docs/style/VOICE.md)
- Canonical prompt kits:
  [`prompt-kits/AGENT.md`](prompt-kits/AGENT.md),
  [`prompt-kits/PORTFOLIO.md`](prompt-kits/PORTFOLIO.md)
- GitHub baseline contract:
  [`docs/governance/github-baseline.md`](docs/governance/github-baseline.md)
- Governance suite navigation:
  [`docs/README.md`](docs/README.md)
- Canonical governance validation:
  `./scripts/validate-doc-contract.sh --full`
- GitHub baseline manifest and sync path are active:
  `github-baseline.yaml`, `scripts/sync-github.sh`,
  `scripts/github-baseline-audit.py`
- Managed-doc canonical name/domain audit:
  `.github/workflows/docs-validation.yml` (with `docs/archive/**` exemption)
- Manifest-driven batch governance is active for multi-repo autonomous work
- README is generated from canonical `catalog/repos.json` data and
  `profile-from-guides.yaml`; `projects.json` remains derived output from
  `scripts/build-catalog.py`
- Read-only profile pin drift verification is active via
  `scripts/verify-profile-pins.py`
- README entrypoint surfaces are contract-exempt from doctrine frontmatter and
  remain render-first GitHub artifacts
- Hybrid corpus refinement is active under `docs/style/`; canonical prompt
  surfaces live under `prompt-kits/`
- Vale terminology/tone rules are derived from `docs/style/terminology-registry.yaml`
  via `scripts/build-style-rules.py`
- Managed repo workflow consumers are generated from `github-baseline.yaml`
  using immutable reusable workflow refs
- Canonical naming policy is active; hard cutover completed on 2026-03-11 for
  `gymboy`, `meatheadphysicist`, `atelier-rounaq`, and `edfp`
- Transitional identifiers are retained in `projects.json` via `legacy_slugs`
  for one migration cycle
- D-1 consolidation status: canonical token source is `design-system/tokens/`;
  legacy `aw-devkit` physical retirement cutover completed on 2026-03-11
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
│       ├── workspace-resource-map.md
│       └── github-baseline.md
├── github-baseline.yaml
└── scripts/
    ├── validate-doc-contract.sh
    ├── build-catalog.py
    ├── build-style-rules.py
    ├── sync-readme.py
    ├── style-advisory-audit.py
    ├── verify-profile-pins.py
    ├── sync-github.sh
    ├── github-baseline-audit.py
    └── sync-to-notion.mjs
```

## What's Next

- Keep canonical files fresh (last-verified ≤ 30 days)
- Keep README/project data/workspace docs synchronized for any naming or domain
  change
- Keep the GitHub baseline manifest and generated repo files in sync for the
  active cohort
- Complete phased workspace directives (D-1 through D-5) with org README sync
  at each structural milestone

---

_Governed by: [AGENTS.md](AGENTS.md)_
See [CLAUDE.md](CLAUDE.md) | [AGENTS.md](AGENTS.md)
