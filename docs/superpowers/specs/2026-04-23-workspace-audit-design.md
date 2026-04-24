---
title: Workspace Audit and Improvement Planning — Design Spec
date: 2026-04-23
status: active
type: canonical
---

# Workspace Audit and Improvement Planning

## Purpose

Design spec for a comprehensive audit and improvement planning system covering all 32 repos in the `@alawein` workspace. Feeds a reset, produces an execution plan, becomes a living reference.

## Context

**Workspace:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/` — 32 repos, not a git repo itself.

**Priority order (stated):** Portfolio/credibility → Debt reduction → Scalability → Engineering onboarding.

**Active products:** bolts, repz, gymboy, scribd, llmworks, meshal-web, attributa, atelier-rounaq — all equally important for portfolio.

**Debt distribution:** Spread across all dimensions — front-end quality, cross-repo infrastructure, individual product architecture, research repo noise.

**Intended outcome:** Audit feeds a reset → reset produces an execution plan → execution plan becomes living reference.

---

## Output System: Six Documents

All documents live in `alawein/docs/superpowers/specs/`:

```
alawein/docs/superpowers/specs/
├── 2026-04-23-workspace-triage.md           # Phase 0: Reset map (executed this session)
├── 2026-04-23-active-products-audit.md      # Spec A: Front-end, UX, architecture
├── 2026-04-23-shared-infrastructure-audit.md  # Spec B: design-system, workspace-tools, KB
├── 2026-04-23-governance-audit.md           # Spec C: Standards enforcement, CI, doctrine
├── 2026-04-23-research-portfolio-audit.md   # Spec D: Research repo disposition
└── 2026-04-23-master-execution-plan.md      # Phase 5: Living reference + work backlog
```

**Document relationships:**
- Phase 0 is partially executed in this session with real filesystem findings
- Specs A–D are generated in subsequent sessions, each informed by Phase 0
- Master execution plan synthesizes A–D and is maintained as work completes
- Individual specs are read-only after writing; findings are superseded by master plan items, not edited in place
- Each document uses `status: draft | active | superseded` frontmatter

---

## Phase 0 — Workspace Triage

**Purpose:** Reset map. Classify every repo before committing to deep audit work.

**Execution:** Run in this session against the live filesystem. No code review — structure, health signals, and git activity only.

**Output structure:**

### Part 1 — Repo Registry Table

Every repo classified on four axes:

| Repo | Status | Health | Disposition | Audit Tier |
|------|--------|--------|-------------|------------|
| ... | Active / Maintained / Planned / Archived / Dead | Green / Yellow / Red | Keep / Needs-work / Freeze / Archive / Delete | Deep (A/B/C/D) / Lightweight / Skip |

**Health signals checked per repo:**
- SSOT.md `last-verified` date (stale > 60 days = Yellow; stale > 180 days = Red)
- CHANGELOG.md last entry date
- CI workflow file presence and last known run
- package.json version drift vs. published (TS/JS repos)
- pyproject.toml currency (Python repos)
- Has live URL — is it reachable?

### Part 2 — Workspace-Level Findings

Problems at the workspace root, not inside any single repo:
- Root `package.json` — purpose and risk
- Root-level files that shouldn't exist
- `projects.json` inconsistencies (duplicate slugs, stale categories, missing repos)
- Cross-repo naming drift

### Part 3 — Infrastructure Health Snapshot

Single-pass check of design-system, workspace-tools, knowledge-base:
- Build passing, packages published, known drift
- No code review — readiness signal only

### Part 4 — Governance Effectiveness Check

- Does docs-doctrine CI catch real problems or produce false positives?
- `github-baseline.yaml` gap between spec and actual repo state
- Which validation scripts produce actionable signal vs. noise
- Is the `REPO_GOVERNANCE_INITIATIVE.md` "RepoReady" program delivered or aspirational?

---

## Spec A — Active Products Audit

**Repos:** bolts, repz, gymboy, scribd, llmworks, meshal-web, attributa, atelier-rounaq

**Per-product findings:**
- Front-end component quality and design-system adoption (`@alawein/tokens`, theme packages)
- UX consistency: loading/empty/error states, navigation, form patterns, responsive behavior
- Architecture: state management, data fetching patterns, bundle structure, dead code
- Portfolio presentation: does the live site hold up under technical scrutiny?
- Feature gaps: what's obviously missing that weakens the product story?

**Cross-product findings:**
- Unjustified divergence between products vs. justified divergence
- Shared component candidates currently duplicated across products
- Design-system adoption gaps: which products drift furthest from `@alawein/tokens`

**Finding format:**

| Title | Repo | Severity | Area | Evidence | Action | Effort |
|-------|------|----------|------|----------|--------|--------|
| ... | ... | Critical/High/Medium/Low | FE/Arch/UX/DX | ... | Patch/Refactor/Redesign/Remove | S/M/L/XL |

---

## Spec B — Shared Infrastructure Audit

**Repos:** design-system, workspace-tools, knowledge-base

**design-system:**
- Token architecture health and two-layer model integrity
- Theme package contract stability (29 themes, 8 families)
- `@alawein/ui` component coverage vs. what active products actually need
- Storybook: real development surface or neglected artifact?
- Build performance and Turborepo pipeline correctness

**workspace-tools:**
- `workspace-batch` CLI reliability — is it used or bypassed?
- Python package health and test coverage
- Config packages (`@alawein/eslint-config`, `@alawein/prettier-config`, `@alawein/tsconfig`) — current vs. stale

**knowledge-base:**
- Next.js 16 + Tailwind v4 app health
- `kb.meshal.ai` deployment stability
- DB/career/config audit scripts — active vs. stale vs. abandoned

---

## Spec C — Governance Audit

**Repo:** alawein (meta-repo) + workspace-level enforcement

**Coverage:**
- docs-doctrine: are the 10 rules actually enforced in CI, or failing silently?
- github-baseline: gap between `github-baseline.yaml` and actual repo state
- `validate-doc-contract.sh`, `config_audit.py`, `sync-github.sh`: actionable signal vs. noise
- CLAUDE.md / AGENTS.md drift: per-repo files vs. workspace root versions
- `REPO_GOVERNANCE_INITIATIVE.md` "RepoReady": delivered vs. aspirational
- Governance theater: checks that pass but validate nothing meaningful

**Output:** A governance scorecard — what's real enforcement vs. documentation of intent.

---

## Spec D — Research Portfolio Audit

**Repos:** adil, alembiq, chshlab, edfp, fallax, helios, loopholelab, maglogic, meatheadphysicist, optiqap, provegate, qmatsim, qmlab, qubeml, scicomp, simcore, spincirc

**Per-repo assessment:**
- Last meaningful code commit (not docs/governance commits)
- Public-facing URL: live and showing something real, or dead?
- Portfolio value: adds credibility or creates noise on public profile?

**Disposition options:**
- **Keep-live:** Actively maintained, real portfolio value, stay public and current
- **Freeze:** Complete, worth showing, no active work needed — archive-ready but keep public
- **Archive:** No longer relevant, remove from active public profile, GitHub archive flag
- **Delete:** Never finished, adds no value, creates maintenance burden — remove entirely

No code review. Disposition decisions and one-line rationale only.

---

## Phase 5 — Master Execution Plan

**Purpose:** Single sequenced work backlog. The document you open to answer "what do I work on next?"

### Part 1 — Reset Decisions

What gets killed, frozen, or archived before any improvement work begins. From Phase 0 + Spec D. Every repo archived is permanent maintenance debt eliminated.

### Part 2 — Work Backlog

Every finding from Specs A–D as a discrete work item:

| # | Title | Repo(s) | Severity | Effort | Phase | Blocked By | Status |
|---|-------|---------|----------|--------|-------|------------|--------|
| ... | ... | ... | Critical/High/Medium/Low | S/M/L/XL | 1/2/3/4 | ... | open/done |

**Four work phases (priority order):**
1. **Portfolio** — Front-end polish, dead pages, missing states, design-system adoption, live site health
2. **Debt reduction** — Consolidation, dead code, dependency cleanup, config drift, governance theater
3. **Architecture** — State management, API boundaries, shared component extraction, product scalability
4. **Onboarding** — CLAUDE.md accuracy, runbook completeness, CI reliability, contributor path

### Part 3 — Maintenance Model

- Completed items: mark `done` with date + commit reference
- New findings: add as new items — do not edit spec documents
- Quarterly: reclassify repos whose status has changed
- After 90 days: completed items move to `archive/` section
- This document is the single source of truth for planned work

---

## Governance Integration

**Does not replace:**
- `REPO_GOVERNANCE_INITIATIVE.md` — standards specification stays as-is
- `docs/governance/` contents — remain as reference

**Supersedes:**
- Open items in `docs/governance/bulk-execution-progress.md` — migrate to master plan, do not maintain in parallel

**Updates required after spec is written:**
- `alawein/SSOT.md` — add section pointing to these specs
- Workspace root `CLAUDE.md` — add pointer to master execution plan for future session discoverability

**Doctrine exemption:**
- `docs/superpowers/specs/*.md` files are exempt from docs-doctrine frontmatter rules — they use this spec's frontmatter format

---

## Session Plan

| Session | Output | Notes |
|---------|--------|-------|
| This session | This design doc + Phase 0 triage | Phase 0 executed with live filesystem scan |
| Session 2 | Spec A — Active products | Deepest audit; portfolio priority |
| Session 3 | Spec B — Shared infrastructure | design-system, workspace-tools, knowledge-base |
| Session 4 | Spec C — Governance | alawein meta-repo + enforcement audit |
| Session 5 | Spec D — Research portfolio | Disposition decisions only |
| Session 6 | Master execution plan | Synthesize A–D into sequenced backlog |
