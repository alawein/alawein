---
title: Workspace Comprehensive Review — Findings
date: 2026-04-24
status: active
type: canonical
feeds: [master-execution-plan]
---

# Workspace Comprehensive Review — Findings

**Date:** 2026-04-24
**Design spec:** [2026-04-24-workspace-review.md](2026-04-24-workspace-review.md)
**Scope:** alawein org workspace (~30 repos)

---

## Executive Summary

> _To be written last (Task S1)._

---

## Layer A — External Best-Practices Findings

### A1. Community Health Files

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| Community Health | README.md | all sampled | Pass | present in all 9 repos | — | — |
| Community Health | CONTRIBUTING.md | all sampled | Pass | present in all 9 repos | — | — |
| Community Health | CODE_OF_CONDUCT.md | all sampled | Pass | present in all 9 repos | — | — |
| Community Health | SECURITY.md | all sampled | Pass | present in all 9 repos | — | — |
| Community Health | LICENSE | all sampled | Pass | present in all 9 repos | — | — |
| Community Health | .github/ISSUE_TEMPLATE/ | meshal-web | Fail | absent at repo root | Add .github/ISSUE_TEMPLATE/ following alawein template | S |
| Community Health | .github/PULL_REQUEST_TEMPLATE.md | meshal-web | Fail | absent at repo root | Add .github/PULL_REQUEST_TEMPLATE.md following alawein template | S |

### A2. CI/CD and SHA Pinning

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| CI/CD Security | SHA pinning — actions/* (checkout, setup-node, etc.) | alawein, design-system, workspace-tools, bolts, repz | Pass | All uses: pinned to 40-char SHA (e.g. `actions/checkout@de0fac2e...`) | — | — |
| CI/CD Security | SHA pinning — reusable workflow ref | design-system, workspace-tools, bolts, repz, alembiq, knowledge-base | Pass | All reference `alawein/.github/workflows/*@ed5ed61aef28cbdd761eeb0654808833bc4564be` | — | — |
| CI/CD Security | SHA pinning — doctrine-reusable workflow ref | meshal-web, design-system (docs-doctrine.yml) | Fail | `alawein/alawein/.github/workflows/doctrine-reusable.yml@main` — mutable tag, not SHA | Pin to canonical SHA `ed5ed61aef28cbdd761eeb0654808833bc4564be` | S |
| CI/CD Security | SHA pinning — doctrine-reusable workflow ref | fallax | Partial | `doctrine-reusable.yml@e036032418348c7085ce1cd34eed6c3a4266fbb1` — SHA-pinned but different from canonical `ed5ed61...` | Update to canonical SHA `ed5ed61aef28cbdd761eeb0654808833bc4564be` | S |
| CI/CD Security | SHA pinning — actions/checkout, actions/setup-node | knowledge-base (career-profile-checks.yml, ci-app.yml, ci-smoke.yml, resume-latex.yml, smoke-production.yml) | Fail | `actions/checkout@v4`, `actions/setup-node@v4` — mutable tags | Pin to 40-char SHA | S |
| CI/CD Security | SHA pinning — actions/checkout, actions/setup-node | meshal-web (ci.yml, security.yml) | Fail | `actions/checkout@v4`, `actions/setup-node@v4` — mutable tags | Pin to 40-char SHA | S |
| CI/CD Security | SHA pinning — github/codeql-action | meshal-web (security.yml) | Fail | `github/codeql-action/init@v3`, `github/codeql-action/analyze@v3` — mutable tags | Pin to 40-char SHA | S |
| CI/CD Security | SHA pinning — actions/checkout, actions/setup-node, dorny/paths-filter | alembiq (ci.yml) | Fail | `actions/checkout@v4`, `actions/setup-node@v4`, `dorny/paths-filter@v3` — mutable tags (mixed: some steps SHA-pinned, some not) | Pin all uses to 40-char SHA | S |
| CI/CD Security | SHA pinning — actions/checkout, astral-sh/setup-uv | fallax (ci.yml, ci-smoke.yml) | Fail | `actions/checkout@v4`, `astral-sh/setup-uv@v6` — mutable tags | Pin to 40-char SHA | S |
| CI/CD Security | Permissions block — top-level `permissions: contents: read` | meshal-web, fallax | Partial | No top-level `permissions:` block in ci.yml | Add `permissions: contents: read` at workflow level | S |
| CI/CD Security | Permissions block — top-level `permissions: contents: read` | alawein (ci.yml) | Partial | No top-level `permissions:` block; relies on repo default | Add `permissions: contents: read` at workflow level | S |
| CI/CD Security | Concurrency block with `cancel-in-progress: true` | alawein, design-system, workspace-tools, knowledge-base, bolts, repz, alembiq, fallax | Pass | `concurrency:` block with `cancel-in-progress: true` present | — | — |
| CI/CD Security | Concurrency block with `cancel-in-progress: true` | meshal-web | Fail | No `concurrency:` block in ci.yml | Add `concurrency: group: ..., cancel-in-progress: true` | S |

### A3. Branch Protection and Secrets Hygiene

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| Secrets Hygiene | .env in .gitignore | bolts, repz, meshal-web, alembiq, design-system, knowledge-base | Pass | present in all 6 of these repos | — | — |
| Secrets Hygiene | .env in .gitignore | fallax, workspace-tools | Fail | `.env` absent from .gitignore | Add `.env` to .gitignore | S |
| Secrets Hygiene | *.pem in .gitignore | all sampled | Fail | `*.pem` absent from all 8 repos (bolts, repz, meshal-web, alembiq, fallax, design-system, workspace-tools, knowledge-base) | Add `*.pem` to .gitignore in all repos | S |
| Secrets Hygiene | *.key in .gitignore | all sampled | Fail | `*.key` absent from all 8 repos | Add `*.key` to .gitignore in all repos | S |
| Secrets Hygiene | node_modules/ in .gitignore | bolts, repz, meshal-web, design-system, workspace-tools, knowledge-base | Pass | present in all 6 of these repos | — | — |
| Secrets Hygiene | node_modules/ in .gitignore | alembiq, fallax | Fail | `node_modules/` absent from .gitignore | Add `node_modules/` to .gitignore | S |
| Secrets Hygiene | __pycache__/ in .gitignore | bolts, repz, alembiq, fallax, design-system, workspace-tools, knowledge-base | Pass | present in all 7 of these repos | — | — |
| Secrets Hygiene | __pycache__/ in .gitignore | meshal-web | Fail | `__pycache__/` absent from .gitignore (not a Python repo but still a gap) | Add `__pycache__/` to .gitignore | S |
| Secrets Hygiene | .DS_Store in .gitignore | bolts, repz, meshal-web, alembiq, design-system, knowledge-base | Pass | present in all 6 of these repos | — | — |
| Secrets Hygiene | .DS_Store in .gitignore | fallax, workspace-tools | Fail | `.DS_Store` absent from .gitignore | Add `.DS_Store` to .gitignore | S |
| Secrets Hygiene | .env.example | bolts, repz, meshal-web | Pass | present in all 3 product repos | — | — |
| Branch Model | feat/fix/chore naming documented | bolts, repz, meshal-web, design-system, workspace-tools | Pass | All 5 repos document branch prefixes (`feat/`, `fix/`, `docs/`, `chore/`, `test/`) in CONTRIBUTING.md | — | — |

### A4. OSS README Conventions

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|

### A5. Conventional Commits and Semver

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|

### A — Gap List

_Gaps from external standards with no internal governance equivalent._

---

## Layer C — Governance Framework Critique

| Subsystem | Verdict | Rationale | Recommendation |
|-----------|---------|-----------|----------------|
| Voice contract | | | |
| Enforcement tiers | | | |
| Documentation doctrine | | | |
| Workflow baseline | | | |
| Validation scripts | | | |
| Governance overhead | | | |

---

## Layer B — Compliance Action Table

### Spot-Check Accuracy Notes

_To be filled by Tasks B1–B4._

### Quick Wins (High impact, S–M effort)

| Repo | Severity | Finding | Area | Gov Rule | Effort | Source |
|------|----------|---------|------|----------|--------|--------|

### Critical Path (High impact, L–XL effort)

| Repo | Severity | Finding | Area | Gov Rule | Effort | Source |
|------|----------|---------|------|----------|--------|--------|

### Deferred (Low impact)

| Repo | Severity | Finding | Area | Gov Rule | Effort | Source |
|------|----------|---------|------|----------|--------|--------|

### Rule Changes (Fix the governance rule, not the repo)

| Repo | Finding | Current Rule | Recommended Rule Change | Source |
|------|---------|-------------|------------------------|--------|

---

## Cross-Cutting Recommendations

> _To be written last (Task S1)._
