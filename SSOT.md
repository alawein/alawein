---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last-verified: 2026-09-05
last_updated: 2026-09-05
audience: [ai-agents, contributors]
---

# SSOT: alawein

**Version:** 1.5
**Last Updated:** 2026-09-05
**Status:** Active

---

## Purpose

Organization profile and portfolio governance source for the `@alawein` GitHub
organization. This repository is docs-only and owns the canonical workspace
governance contract for naming, portfolio truth, and migration sequencing.

---

## Current State

- Organization profile and documentation: Active
- Workspace root on disk: `Desktop/GitHub/alawein` (not a git root). Sibling
  repos live under buckets `apps/`, `core/`, `lab/`, `sites/`, `work/`, and
  `_archive/`. This control plane is `core/alawein`. Disk SSOT:
  [`catalog/buckets.yaml`](catalog/buckets.yaml) and
  [`docs/governance/repo-topology-canon.md`](docs/governance/repo-topology-canon.md).
  Portfolio lanes (`platform` / `ship` / `lab` / `work` / `archive`) live in
  `catalog/index.yaml` and are a different axis from disk buckets.
- Workspace operating contract:
  [`docs/governance/workspace-master-prompt.md`](docs/governance/workspace-master-prompt.md)
  (layout tables may lag; prefer topology-canon + catalog `local_path`)
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
  `./scripts/doctrine/validate-doc-contract.sh --full`
- GitHub baseline manifest and sync path are active:
  `github-baseline.yaml`, `scripts/github/sync-github.sh`,
  `scripts/github/github-baseline-audit.py`
- Managed-doc canonical name/domain audit:
  `.github/workflows/docs-validation.yml` (with `docs/archive/**` exemption)
- Manifest-driven batch governance is active for multi-repo autonomous work
- README is generated from compiled `catalog/repos.json` (source: `catalog/index.yaml`)
  and `profile-from-guides.yaml`; `projects.json` remains derived output from
  `scripts/catalog/build-catalog.py`
- Read-only profile pin drift verification is active via
  `scripts/github/verify-profile-pins.py`
- Public readiness gate is active: every repo is private unless
  `catalog/index.yaml` carries a current `promotion` record (tier P0 or P1,
  scan under 90 days); pins require P0. Enforced by
  `scripts/github/validate-visibility.py` and the offline rules in
  `scripts/catalog/validate-catalog.py`. Design:
  `docs/internal/specs/2026-08-27-public-readiness-gate-design.md`
- Slack and Cursor MCP inventory SSOT:
  [`catalog/agent-integrations.yaml`](catalog/agent-integrations.yaml).
  Latest live rescan:
  [`docs/internal/audits/2026-09-05-slack-integrations-rescan.md`](docs/internal/audits/2026-09-05-slack-integrations-rescan.md).
  Channel policy: [`docs/governance/slack-agent-runbook.md`](docs/governance/slack-agent-runbook.md).
- README entrypoint surfaces are contract-exempt from doctrine frontmatter and
  remain render-first GitHub artifacts
- Hybrid corpus refinement is active under `docs/style/`; canonical prompt
  surfaces live under `prompt-kits/`
- Vale terminology/tone rules are derived from `docs/style/terminology-registry.yaml`
  via `scripts/doctrine/build-style-rules.py`
- Managed repo workflow consumers are generated from `github-baseline.yaml`
  using immutable reusable workflow refs
- Canonical naming policy is active; hard cutover completed on 2026-03-11 for
  `gymboy`, `meatheadphysicist`, `atelier-rounaq`, and `edfp`
- Transitional identifiers are retained in `projects.json` via `legacy_slugs`
  for one migration cycle
- Global `~/.claude/` platform source (agent config, skills, workflows):
  [`claude-agent-platform/`](claude-agent-platform/), apply changes with
  `bash claude-agent-platform/sync-to-home.sh` (push) or capture with
  `bash claude-agent-platform/sync-from-home.sh` (pull). Retired
  `scripts/ops/sync-claude.sh` and `render-configs.sh` live under
  `scripts/ops/_retired/`.
- Specs live in [`docs/internal/specs/`](docs/internal/specs/);
  plans live in [`docs/internal/plans/`](docs/internal/plans/)
- D-1 consolidation status: canonical token source is `tools/design-system/tokens/`;
  legacy `aw-devkit` physical retirement cutover completed on 2026-03-11
- Branch and deployment convention (feat/*, Vercel, multi-repo):
  [`docs/governance/branch-and-deployment-convention.md`](docs/governance/branch-and-deployment-convention.md)

## Structure

```text
core/alawein/                 (inside bucketed workspace root)
├── AGENTS.md
├── CLAUDE.md
├── SSOT.md
├── LESSONS.md
├── catalog/                  index.yaml -> repos.json; buckets.yaml
├── prompt-kits/
├── claude-agent-platform/
├── profile-from-guides.yaml
├── projects.json             generated
├── docs/
│   ├── README.md
│   ├── governance/           see docs/README.md for the golden path
│   ├── style/
│   ├── internal/             specs, plans, audits (doctrine-exempt)
│   └── operations/
├── github-baseline.yaml
└── scripts/
    ├── doctrine/             validate-doc-contract.sh, build-style-rules.py, ...
    ├── catalog/              build-catalog.py, sync-readme.py, catalog_lib.py
    ├── github/               sync-github.sh, github-baseline-audit.py, verify-profile-pins.py
    ├── ops/                  generate-index.sh; retired scripts in _retired/
    └── notion/               sync-to-notion.mjs
```

## What's Next

- Keep canonical files fresh (last-verified ≤ 30 days) and semantically true
  after layout or generator changes
- Keep README/project data/workspace docs synchronized for any naming or domain
  change
- Keep the GitHub baseline manifest and generated repo files in sync for the
  active cohort
- Before 2026-09-30: clear or renew public-readiness grace on `alawein` (and any
  remaining grace pins); see `docs/DEBT.md`
- Push catalog `about` text to GitHub About where drift remains (fleet hygiene)

---

_Governed by: [AGENTS.md](AGENTS.md)_
See [CLAUDE.md](CLAUDE.md) | [AGENTS.md](AGENTS.md)
