---
type: canonical
source: none
sync: none
sla: on-change
title: Workflow pin inventory and bundle v1 policy
description: >-
  Inventory of reusable workflow SHAs for the infrastructure spine and policy
  for when pins must align versus intentionally diverge.
last_updated: 2026-05-17
category: governance
audience: [agents, contributors, platform]
---

# Workflow pin inventory and bundle v1 policy

This document records **observed** reusable-workflow references under
`alawein/alawein/.github/workflows/` for the three spine repos. It defines
**workflow bundle v1** as a coordination policy; it does **not** by itself change
CI pins.

## Observed pins (`alawein/github-baseline.yaml`)

| Field | SHA | Role |
| ----- | --- | ---- |
| `workflow_ref` | `ed5ed61aef28cbdd761eeb0654808833bc4564be` | Declared baseline for `ci-*` and `codeql` reusables |

## Inventory by repo and workflow file

| Consumer repo | Workflow file | Reusable workflow | Pinned SHA |
| ------------- | ------------- | ------------------- | ---------- |
| design-system | `.github/workflows/ci.yml` | `ci-node.yml` | `ed5ed61aef28cbdd761eeb0654808833bc4564be` |
| design-system | `.github/workflows/codeql.yml` | `codeql.yml` | `ed5ed61aef28cbdd761eeb0654808833bc4564be` |
| design-system | `.github/workflows/docs-doctrine.yml` | `doctrine-reusable.yml` | `9779fa3333e1b2001542b3da162d488963236631` |
| workspace-tools | `.github/workflows/ci.yml` | `ci-python.yml` | `ed5ed61aef28cbdd761eeb0654808833bc4564be` |
| workspace-tools | `.github/workflows/codeql.yml` | `codeql.yml` | `ed5ed61aef28cbdd761eeb0654808833bc4564be` |
| workspace-tools | `.github/workflows/docs-doctrine.yml` | `doctrine-reusable.yml` | `9779fa3333e1b2001542b3da162d488963236631` |
| alawein | _(no `uses: alawein/alawein/.github/workflows/` lines in `*.yml`; reusables are defined here, not called via that pattern)_ | (none) | (none) |

### Mismatch table (baseline vs observed)

| Check | Result |
| ----- | ------ |
| Baseline `workflow_ref` vs `ci.yml` / `codeql.yml` pins (design-system, workspace-tools) | **Match** on `ed5ed61…` |
| Baseline `workflow_ref` vs `docs-doctrine.yml` doctrine pin | **Mismatch**: doctrine uses `9779fa…`, not `ed5ed61…` |
| Baseline comment | Baseline encodes a single `workflow_ref`; it does **not** declare a second SHA for `doctrine-reusable.yml` |

**Inference:** `github-baseline-audit.py` requires every `alawein/alawein/.github/workflows/` reference **inside the control-plane repo’s own workflows** to equal `workflow_ref` **Observed from audit script**. Consumer repos with `sync: manual` are skipped by sibling checks **Observed**. Doctrine workflows therefore diverge without failing baseline audit for design-system / workspace-tools.

## Workflow bundle v1 · policy

**Bundle v1 (declared policy):**

1. **Primary pin (`workflow_ref`):** `ed5ed61aef28cbdd761eeb0654808833bc4564be` applies to **`ci-node.yml`**, **`ci-python.yml`**, and **`codeql.yml`** call sites in spine consumers **Observed**.
2. **Doctrine pin:** `9779fa3333e1b2001542b3da162d488963236631` for **`doctrine-reusable.yml`** in design-system and workspace-tools **Observed**.
3. **Intentional multi-SHA:** Until doctrine and the CI reusables ship from the same immutable tag or coordinated bump process, **two SHAs are allowed** for spine consumers: one for build/security reusables and one for markdown doctrine. **Inference:** Aligning them to a single SHA is optional and requires validating doctrine behavior after bump **risk**.

**Do-not (until documented in a follow-up change):** Bump pins fleet-wide without reconciling doctrine versus CI behavior and without updating this inventory.

## Risks if pins drift further

- Doctrine checks may run against different validator behavior than expected **Inference**.
- Operators may assume `workflow_ref` covers all reusables **Observed mismatch risk**.

## Related

- `scripts/github/github-baseline-audit.py`; control-plane and `sync: auto` sibling checks **Observed**.
- `docs/governance/docs-doctrine.md`; examples still showing `@main` **Observed elsewhere**; treat as documentation debt, out of scope for this P0 patch.
