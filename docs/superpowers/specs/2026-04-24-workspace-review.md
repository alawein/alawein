---
title: Workspace Comprehensive Review — A → C → B
date: 2026-04-24
status: active
type: canonical
feeds: [master-execution-plan]
last_updated: 2026-04-24
---

# Workspace Comprehensive Review — A → C → B

**Date:** 2026-04-24
**Scope:** alawein org workspace (~30 repos)
**Approach:** Layered review — external benchmarking → governance critique → compliance synthesis
**Input specs:** 8 existing 2026-04-23 audit specs (products, research, infrastructure, governance, triage, master plan)

---

## Purpose

This review evaluates the workspace across three ordered lenses:

- **A — External best-practices benchmarking**: Does the workspace conform to widely accepted GitHub/OSS standards independent of internal governance?
- **C — Governance framework critique**: Are the internal conventions and rules themselves well-designed, appropriately scoped, and maintainable?
- **B — Internal compliance synthesis**: Where does the actual workspace fall short of the (validated) governance, and what is the priority order for remediation?

The order is intentional. A establishes a neutral external reference frame. C critiques the governance against that frame — distinguishing rules that are well-designed from those that are overspecified or undermaintained. B synthesizes existing audit findings using that validated frame, so compliance gaps are only prioritized against rules worth enforcing.

Existing 2026-04-23 specs are treated as the B-layer input rather than re-auditing 30 repos from scratch. Spot-checks on 3–4 representative repos validate spec accuracy (~88% per prior session data) before the action table is finalized.

---

## Layer A — External Best-Practices Benchmarking

### Reference standards

| Standard | Source | Areas covered |
|----------|--------|---------------|
| GitHub community health | GitHub docs + community health API | README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, LICENSE, issue templates |
| CNCF sandbox/incubating criteria | CNCF project maturity model | CI, security scanning, documentation completeness, contributor guidelines |
| Conventional commits | conventionalcommits.org v1.0.0 | Commit message format, scope discipline, changelog generation |
| Semantic versioning | semver.org v2.0.0 | Package versioning, pre-release conventions, lockfile hygiene |
| SHA-pinned Actions | GitHub security hardening guide | All `uses:` references pinned to full commit SHA, no floating tags |
| OSS README conventions | GitHub, Write the Docs, and OSS norms | One-sentence opener, stack, quick start, contribution path |
| Branch protection | GitHub branch protection docs | Require PR reviews, status checks, no force-push on default branch |
| Secret scanning | GitHub Advanced Security / OSS equivalents | Secrets not committed, `.gitignore` coverage, no API keys in history |

### Sampling strategy

Full coverage of the control plane (`alawein/`). Representative sampling across tiers:

- **Infrastructure**: `design-system`, `workspace-tools`, `knowledge-base`
- **Product**: `bolts`, `repz`, `meshal-web`
- **Research**: `alembiq`, `fallax`

### Assessment method

Read actual files in each sampled repo. Score each criterion: **Pass** / **Partial** / **Fail** / **N/A**. Record evidence (file path or explicit absence). Produce a per-standard findings table with a gap list.

### Finding format

```
Area | Criterion | Verdict | Evidence | Recommendation | Effort
```

---

## Layer C — Governance Framework Critique

### Subsystems under review

| Subsystem | Canonical file(s) | Critique focus |
|-----------|------------------|----------------|
| Voice contract | `docs/style/VOICE.md` | Are the rules enforceable? Are any missing, overspecified, or untestable by the existing validators? |
| Enforcement tiers | `VOICE.md` § Enforcement, `CLAUDE.md` § Enforcement | Is the blocking vs. advisory split drawn correctly? Are any blocking rules unenforceable in CI? |
| Documentation doctrine | `docs/governance/documentation-contract.md` | Is the document class taxonomy the right size? Are freshness SLAs realistic? |
| Workflow baseline | `github-baseline.yaml`, `ci-node.yml`, `ci-python.yml`, `codeql.yml` | Are the CI conventions well-chosen? Is the SHA-pinning governance sound? Is the `sync: manual` escape hatch overused? |
| Validation scripts | `validate-doc-contract.sh`, `validate.py`, `validate-doctrine.py`, `build-style-rules.py`, `style-advisory-audit.py` | Do the scripts enforce what the contracts claim? Are there coverage gaps or false-positive patterns? |
| Governance overhead | All docs in `docs/governance/` (30+ files) | Is the governance volume maintainable for a solo/small-team workspace? Is any layer redundant or stale? |

### Verdict taxonomy

Each subsystem receives one of four verdicts:

- **Sound**: Rule is well-designed, appropriately scoped, and externally defensible. Compliance gaps are execution problems, not rule problems.
- **Overspecified**: Rule exists but is too narrow, too rigid, or enforces detail that doesn't affect outcomes. Recommend relaxing or removing.
- **Undermaintained**: Rule is sound in principle but the enforcement mechanism (script, CI, doc freshness) has decayed or is incomplete. Recommend fixing the mechanism.
- **Missing**: An external best-practice or obvious workspace need has no corresponding governance rule. Recommend adding.

### Finding format

```
Subsystem | Verdict | Rationale | Recommendation
```

---

## Layer B — Compliance Synthesis

### Input

The 8 existing 2026-04-23 specs:

| Spec | Scope |
|------|-------|
| `2026-04-23-active-products-audit.md` | bolts, repz, gymboy, scribd, llmworks, meshal-web, attributa, atelier-rounaq |
| `2026-04-23-research-portfolio-audit.md` | Research repos |
| `2026-04-23-shared-infrastructure-audit.md` | design-system, workspace-tools, knowledge-base |
| `2026-04-23-governance-audit.md` | alawein control plane |
| `2026-04-23-workspace-triage.md` | Cross-repo triage |
| `2026-04-23-master-execution-plan.md` | Sequencing and dependency map |
| `2026-04-23-workspace-audit-design.md` | Audit methodology |
| `2026-04-23-ui-primitives-error-empty-loading-design.md` | UI component design |

### Spot-check targets

Four repos chosen to cover the spread of drift risk:

- One infrastructure repo (`design-system` — high volume, complex build)
- One product repo (`bolts` — most Critical findings in Spec A)
- One research repo (`alembiq` — recently renamed, migration risk)
- One governance repo (`alawein` — control plane, self-referential)

Spot-checks are narrow: verify 2–3 Critical findings per repo to validate spec accuracy before synthesizing the action table.

### Priority model

Findings are scored on **impact** × **effort** and sorted into four buckets:

| Bucket | Criteria |
|--------|----------|
| **Quick wins** | High impact, S or M effort — act first |
| **Critical path** | High impact, L or XL effort — schedule and sequence |
| **Deferred** | Low impact regardless of effort — log and revisit |
| **Rule changes** | Finding is real but the right fix is revising the governance rule, not the repo |

Findings against governance rules that Layer C marks as Overspecified are automatically moved to **Rule changes** or **Deferred** rather than generating repo-level action items.

### Finding format

```
Repo | Severity | Finding | Area | Governance rule | Priority bucket | Effort | Source spec
```

---

## Deliverable

The review findings are written to a separate output document: `docs/superpowers/specs/2026-04-24-workspace-review-findings.md`. This file is the design spec; the output file is the populated review.

**Output document sections:**

1. Executive summary — overall health verdict, top 5 cross-cutting findings, highest-priority action items
2. Layer A findings — per-standard findings table, gap list
3. Layer C findings — per-subsystem verdict table with rationale and recommendations
4. Layer B action table — prioritized by bucket, cross-referenced to source specs and governance rules
5. Cross-cutting recommendations — changes that span all three layers (e.g., governance rules that need updating because compliance data reveals they are consistently ignored)

---

## Constraints

- Do not re-audit all 30 repos from scratch — use existing specs as B-layer input
- Spot-checks are validation, not re-audit: 2–3 Criticals per sampled repo
- Layer C verdicts must be externally grounded (cite A-layer reference where applicable)
- Findings against Overspecified rules become Rule changes, not repo action items
- Output must be actionable: every finding has a recommendation and an effort estimate
