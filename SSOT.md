---
type: normative
authority: canonical
audience: [ai-agents, contributors]
last-verified: 2026-03-08
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
- Canonical governance validation:
  `./scripts/validate-doc-contract.sh --full`
- Fast CI checks: local contract validation plus markdown lint for managed docs

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
│       ├── documentation-contract.md
│       └── workflow.md
└── scripts/
    └── validate-doc-contract.sh
```

## What's Next

- Keep canonical files fresh (last-verified ≤ 30 days)
- Keep workflow and CI descriptions truthful for a docs-only repository

---

_Governed by: [AGENTS.md](AGENTS.md)_
See [CLAUDE.md](CLAUDE.md) | [AGENTS.md](AGENTS.md)
