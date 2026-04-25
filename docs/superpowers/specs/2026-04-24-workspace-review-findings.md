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
| README Conventions | No emoji in headings | all sampled | Pass | No emoji found in any heading across all 9 repos | — | — |
| README Conventions | Factual one-sentence opener | design-system, workspace-tools, knowledge-base, bolts, repz | Pass | All open with repo name + factual one-sentence description | — | — |
| README Conventions | Factual one-sentence opener | alawein | Partial | Profile README opens with a person name, not a repo description; generated output so not a traditional code repo opener | Acceptable for a profile README; note in doc contract that profile READMEs follow different rules | — |
| README Conventions | Factual one-sentence opener | meshal-web | Partial | Opener is "Personal site for Meshal Alawein — Tokyo Dusk." — theme name appended reads as aesthetic, not factual description | Rewrite: "meshal-web is the personal site and portfolio for Meshal Alawein." | S |
| README Conventions | Factual one-sentence opener | alembiq | Partial | Opener is a run-on that leads with the failure-mode problem statement rather than a factual "Alembiq is X" sentence | Rewrite opener to: "Alembiq is LLM training, alignment, and evaluation infrastructure." then start problem context on the next line | S |
| README Conventions | Factual one-sentence opener | fallax | Partial | H1 "Fallax" is followed by bold-formatted opener `**Fallax** evaluates...` — bold name-in-body is a style affectation, not a clean opener | Remove bold; write as plain sentence | S |
| README Conventions | For-whom + differentiator paragraph | design-system, workspace-tools, bolts, repz | Partial | Each describes what it does but omits an explicit differentiator vs the obvious alternative (a generic npm monorepo, ad hoc scripts, a generic SaaS template) | Add one sentence per repo naming the alternative it replaces or why its approach is preferred | S |
| README Conventions | For-whom + differentiator paragraph | alawein | Fail | Profile README has no for-whom section (expected for a profile but is a gap vs the checklist criterion) | Out of scope for a profile README; record as N/A | — |
| README Conventions | For-whom + differentiator paragraph | knowledge-base | Partial | States it is "successor to _pkos/" but does not explain what _pkos was or why this approach differs | Add one sentence: "It replaces the retired _pkos repo and adds a dashboard, config-audit tooling, and a career lane on a single explicit schema contract." | S |
| README Conventions | For-whom + differentiator paragraph | fallax | Fail | "Why Fallax" section lists features only; no audience named, no alternative named | Add a paragraph: who this is for (researchers, engineers running evals), and what alternative it replaces (single-turn benchmarks) | S |
| README Conventions | Quick start with exact commands | alawein | Fail | Profile README has no quick-start section (expected for a profile) | N/A for a profile README; mark as exempted | — |
| README Conventions | Quick start with exact commands | design-system, workspace-tools, knowledge-base, bolts, repz, meshal-web, alembiq, fallax | Pass | All 8 non-profile repos include runnable commands | — | — |
| README Conventions | Stack listed | bolts, fallax, meshal-web | Pass | Explicit "Stack" or "Tech Stack" section present | — | — |
| README Conventions | Stack listed | design-system | Fail | No explicit stack section; Turborepo/TypeScript/Node not stated | Add a one-line "Stack" entry: TypeScript, Turborepo, Node.js | S |
| README Conventions | Stack listed | repz | Fail | No explicit "Stack" section; Vite + React Router + Supabase mentioned inline only | Add explicit "Stack" section | S |
| README Conventions | Stack listed | alembiq | Fail | No explicit "Stack" section; Python implied throughout but not declared | Add a one-line "Stack" entry: Python 3.12+, PyTorch, HuggingFace Transformers | S |
| README Conventions | Stack listed | workspace-tools, knowledge-base | Partial | Stack (Python, Next.js) is mentioned inline in descriptions but there is no dedicated "Stack" section | Add a brief "Stack" line | S |
| README Conventions | Stack listed | alawein | Fail | Profile README lists projects and focus areas but no technical stack | N/A for a profile README | — |
| README Conventions | Badges — version badges | meshal-web | Fail | TypeScript 5.7, React 19, Vite 7 version badges — all pin specific versions that will go stale | Remove version badges; keep only License badge | S |
| README Conventions | Badges — version badges | alembiq | Partial | CI badge (live, Pass) + Python 3.10+ version badge (unverifiable state) + License badge | Remove Python version badge; CI and License badges are acceptable | S |
| README Conventions | Badges — version badges | fallax | Partial | Python 3.10+ version badge + License badge; no CI badge | Remove Python version badge; consider adding a CI badge instead | S |
| README Conventions | Badges | alawein, design-system, workspace-tools, knowledge-base, bolts, repz | Pass | No badges or only license badges | — | — |
| README Conventions | Contribution path | design-system, alembiq, fallax | Pass | CONTRIBUTING.md explicitly linked in README | — | — |
| README Conventions | Contribution path | workspace-tools, knowledge-base, bolts, repz, meshal-web | Fail | CONTRIBUTING.md exists in each repo but is not linked or mentioned in README | Add a "Contributing" section with a link to CONTRIBUTING.md | S |
| README Conventions | Contribution path | alawein | Fail | Profile README has no contribution path (CONTRIBUTING.md exists but not linked) | Add a brief "Contributing" or "Contact" section linking CONTRIBUTING.md | S |

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
