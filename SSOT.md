---
type: normative
authority: canonical
last-verified:  2026-03-08
audience: [ai-agents, contributors]
---

# SSOT — alawein

**Version:** 1.0
**Last Updated:** 2026-03-08
**Status:** Active

---

## Purpose

Organization profile and portfolio governance for the `@alawein` GitHub
organization. This repository is a docs-only org-profile and governance-pointer
repo.

## Current State

- Organization profile and documentation: ✅ Active
- Local documentation contract:
  [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md)
- Governance suite entrypoint:
  [`docs/governance/operating-model.md`](docs/governance/operating-model.md)
- Canonical governance validation:
  `./scripts/validate-doc-contract.sh --full`
- Fast CI checks: local contract validation plus markdown lint for managed docs
- Specialized workflow guides: Git operations, feature lifecycle, review,
  merge, release, and clean-slate workflow are all documented locally under
  `docs/governance/`

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
│       ├── operating-model.md
│       ├── documentation-contract.md
│       ├── workflow.md
│       ├── git-operations.md
│       ├── feature-lifecycle.md
│       ├── review-playbook.md
│       ├── merge-policy.md
│       ├── release-playbook.md
│       ├── clean-slate-workflow.md
│       └── changelog-entry.md
└── scripts/
    └── validate-doc-contract.sh
```

## What's Next

- Keep canonical files fresh (last-verified ≤ 30 days)
- Keep workflow and CI descriptions truthful for a docs-only repository
- Keep the governance suite navigable by task rather than re-centralizing it
  into one oversized guide

---

_Governed by: [AGENTS.md](AGENTS.md)_
See [CLAUDE.md](CLAUDE.md) | [AGENTS.md](AGENTS.md)
