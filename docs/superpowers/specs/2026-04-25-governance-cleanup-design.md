---
title: Spec 4 — Governance Cleanup
date: 2026-04-25
status: active
type: canonical
feeds: [master-execution-plan]
---

# Spec 4 — Governance Cleanup

**Repo:** `alawein/` (control plane)
**Track:** Sequential with Spec 1 (runs after); parallel with Specs 2, 3, 5
**Source:** 2026-04-24 workspace review — Layer C (Overspecified: documentation doctrine, governance overhead); Layer B Rule Changes

---

## Purpose

Reduce governance overhead without removing substantive enforcement. Three targeted changes: archive completed migration artifacts, rewrite an aspirational document to match reality, and relax an unmaintainable freshness SLA.

---

## Change 1 — Archive one-time migration artifacts

**Current state:** 51 non-archive governance docs, 14+ of which record completed one-time migrations. These create noise in the governance index, inflate the doc count, and make it harder to find active governance.

**Artifacts to archive** (move to `docs/archive/`):

| File | Reason |
|------|--------|
| `docs/governance/bulk-execution-progress.md` | Completed migration; last-updated 2026-03-15 |
| `docs/governance/phase1-design-branding-analysis-alawein.md` | Phase 1 complete |
| `docs/governance/phase1-design-branding-analysis-frontends.md` | Phase 1 complete |
| `docs/governance/phase3-refactor-and-centralization.md` | Phase complete |
| `docs/governance/phase4-testing-and-validation.md` | Phase complete |
| `docs/governance/phase5-version-control-and-deployment.md` | Phase complete |
| `docs/governance/dashboard-rollout-playbook.md` | Dashboard shipped |
| `docs/governance/workspace-rename-matrix.md` | All renames complete 2026-03-11 |
| `docs/governance/remaining-steps-per-repo.md` | Sprint complete |
| `docs/governance/skills-consolidation-reference-2026-03-17.md` | Consolidation complete |

Before archiving: verify no active script or CI workflow `source`s or references these files by path. Run:
```bash
grep -r "bulk-execution-progress\|phase1-design\|phase3-refactor\|phase4-testing\|phase5-version\|dashboard-rollout\|workspace-rename-matrix\|remaining-steps-per-repo\|skills-consolidation-reference-2026-03-17" alawein/scripts/ alawein/.github/ 2>/dev/null
```

If any reference is found, update that reference before moving the file.

Update `docs/README.md` to remove links to archived files.

**Files:**
- Move: 10 governance docs → `docs/archive/`
- Modify: `docs/README.md`

---

## Change 2 — Rewrite REPO_GOVERNANCE_INITIATIVE.md

**Current state:** `REPO_GOVERNANCE_INITIATIVE.md` (at repo root, 87 lines) promises five deliverables — all five are absent. The document describes a future state as if it is planned. It is not referenced by any CI or script. It is visible to any visitor to the repo.

**Fix:** Rewrite the document to accurately describe the governance that has actually shipped. Rename to `docs/governance/repo-standardization.md`. Remove from repo root (it does not belong there).

The rewritten document describes:
- What the baseline enforcement actually covers (CI, CodeQL, dependabot, CODEOWNERS, PR template, issue templates — all rolled out to 14+ repos)
- How `sync-github.sh` propagates baseline changes
- How `github-baseline-audit.py` audits compliance
- How to add a new repo to the managed cohort

It does not describe unshipped features as planned.

**Files:**
- Delete: `alawein/REPO_GOVERNANCE_INITIATIVE.md`
- Create: `alawein/docs/governance/repo-standardization.md`
- Modify: `alawein/docs/README.md` — add link to new file, remove reference to old one
- Modify: `alawein/SSOT.md` — update reference from `REPO_GOVERNANCE_INITIATIVE.md` to new path (if present)

---

## Change 3 — Freshness SLA update

**Current state:** `documentation-contract.md` sets a 30-day `last-verified` SLA on canonical normative docs (`AGENTS.md`, `CLAUDE.md`, `SSOT.md`, `LESSONS.md`). Managed governance docs have no explicit SLA — they use "must change whenever content changes." 14+ managed docs are past any reasonable staleness threshold with no automated catch.

**Fix:** Two targeted SLA changes:

**Canonical normative docs** — keep 30 days. These are agent-facing and must stay accurate. The 30-day cadence is defensible.

**Managed governance docs** — set an explicit 90-day SLA (quarterly review). Add a CI gate: `docs-doctrine.yml` already validates `last_updated` exists; extend it to fail if `last_updated` is more than 90 days before today on non-archived managed docs.

**Files:**
- Modify: `alawein/docs/governance/documentation-contract.md` — update the Managed governance doc class to add `Freshness SLA: 90 days` and document the CI gate
- Modify: `alawein/scripts/validate-doctrine.py` — add the 90-day staleness check for managed docs (emit warning, not error, on first pass; convert to error after 30 days grace period from today)

---

## Validation

```bash
python scripts/validate-doctrine.py .
bash ./scripts/validate-doc-contract.sh --full
python scripts/validate.py --ci
```

All must pass. The doctrine validator will now flag managed docs with `last_updated` > 90 days old — fix those dates as part of this change.

---

## Constraints

- Archive, do not delete — every archived file keeps its content intact
- The rewritten `repo-standardization.md` must not contain aspirational language ("we will", "planned", "upcoming") — describe only what exists
- Do not tighten the canonical normative SLA beyond 30 days
- The 90-day CI gate must emit a warning (not a hard failure) on initial rollout to avoid blocking CI on existing stale docs
