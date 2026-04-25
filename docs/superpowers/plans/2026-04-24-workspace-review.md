---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last-verified: 2026-04-24
audience: [ai-agents, contributors]
---

# Workspace Comprehensive Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a populated findings document (`2026-04-24-workspace-review-findings.md`) covering external benchmarking (A), governance critique (C), and compliance synthesis (B) for the alawein org workspace.

**Architecture:** Three sequential phases. Phase A reads 8 sampled repos against external OSS standards and produces a scored findings table. Phase C reads the governance control plane and verdicts each subsystem as Sound/Overspecified/Undermaintained/Missing. Phase B synthesizes the 8 existing 2026-04-23 audit specs, spot-checks 4 repos to validate accuracy, then maps findings to priority buckets filtered by Phase C verdicts.

**Tech Stack:** Bash file reads, existing audit specs in `alawein/docs/superpowers/specs/2026-04-23-*.md`, output written to `alawein/docs/superpowers/specs/2026-04-24-workspace-review-findings.md`.

---

## File Map

| File | Role |
|------|------|
| `docs/superpowers/specs/2026-04-24-workspace-review-findings.md` | **Create** — output document; each task populates one section |
| `docs/superpowers/specs/2026-04-24-workspace-review.md` | **Read** — design spec; reference throughout |
| `docs/superpowers/specs/2026-04-23-active-products-audit.md` | **Read** — Layer B input (Spec A) |
| `docs/superpowers/specs/2026-04-23-shared-infrastructure-audit.md` | **Read** — Layer B input (Spec B) |
| `docs/superpowers/specs/2026-04-23-governance-audit.md` | **Read** — Layer B input (Spec C) |
| `docs/superpowers/specs/2026-04-23-research-portfolio-audit.md` | **Read** — Layer B input (Spec D) |
| `docs/superpowers/specs/2026-04-23-master-execution-plan.md` | **Read** — sequencing reference for Layer B |
| `docs/superpowers/specs/2026-04-23-workspace-triage.md` | **Read** — triage reference for Layer B |
| `docs/style/VOICE.md` | **Read** — Layer C governance critique |
| `docs/governance/documentation-contract.md` | **Read** — Layer C governance critique |
| `github-baseline.yaml` | **Read** — Layer C workflow baseline critique |
| `.github/workflows/ci-node.yml` | **Read** — Layer C workflow critique |
| `.github/workflows/ci-python.yml` | **Read** — Layer C workflow critique |
| `.github/workflows/codeql.yml` | **Read** — Layer C workflow critique |
| `.claude/settings.json` | **Read** — Layer C broken hooks |
| `scripts/validate-doc-contract.sh` | **Read** — Layer C validation script coverage |
| `scripts/validate.py` | **Read** — Layer C validation script coverage |
| `scripts/validate-doctrine.py` | **Read** — Layer C validation script coverage |

Sampled repos (read-only): `alawein/`, `design-system/`, `workspace-tools/`, `knowledge-base/`, `bolts/`, `repz/`, `meshal-web/`, `alembiq/`, `fallax/`.

---

> **Working directory note:** All `git` commands run from inside `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/` (the git repo). File read commands that check sibling repos use the workspace root `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/` as the base. Do not confuse the two.

## Phase A — External Best-Practices Benchmarking

---

### Task A1: Create the output document skeleton

**Files:**
- Create: `docs/superpowers/specs/2026-04-24-workspace-review-findings.md`

- [ ] **Step 1: Create the output document with section stubs**

```bash
# Run from: alawein/ repo root
cat > docs/superpowers/specs/2026-04-24-workspace-review-findings.md << 'ENDDOC'
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
| | | | | | | |

### A2. CI/CD and SHA Pinning

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| | | | | | | |

### A3. Branch Protection and Secrets Hygiene

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| | | | | | | |

### A4. OSS README Conventions

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| | | | | | | |

### A5. Conventional Commits and Semver

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| | | | | | | |

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

### Quick Wins (High impact, S–M effort)

| Repo | Severity | Finding | Area | Gov Rule | Effort | Source |
|------|----------|---------|------|----------|--------|--------|
| | | | | | | |

### Critical Path (High impact, L–XL effort)

| Repo | Severity | Finding | Area | Gov Rule | Effort | Source |
|------|----------|---------|------|----------|--------|--------|
| | | | | | | |

### Deferred (Low impact)

| Repo | Severity | Finding | Area | Gov Rule | Effort | Source |
|------|----------|---------|------|----------|--------|--------|
| | | | | | | |

### Rule Changes (Fix the governance rule, not the repo)

| Repo | Finding | Current Rule | Recommended Rule Change | Source |
|------|---------|-------------|------------------------|--------|
| | | | | |

---

## Cross-Cutting Recommendations

> _To be written last (Task S1)._
ENDDOC
```

- [ ] **Step 2: Verify the file was created correctly**

```bash
head -20 docs/superpowers/specs/2026-04-24-workspace-review-findings.md
```

Expected: frontmatter block followed by `# Workspace Comprehensive Review — Findings`.

- [ ] **Step 3: Commit the skeleton**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs: add workspace review findings skeleton"
```

---

### Task A2: Community health files check

**Files:**
- Read: README.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, LICENSE, `.github/ISSUE_TEMPLATE/` in each sampled repo
- Modify: `docs/superpowers/specs/2026-04-24-workspace-review-findings.md` — fill A1 table

GitHub's community health checklist requires all six: README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, LICENSE, at least one issue template.

- [ ] **Step 1: Check community health files across sampled repos**

Run each check and record in a scratch table before writing findings:

```bash
# For each of: alawein design-system workspace-tools knowledge-base bolts repz meshal-web alembiq fallax
# Run from workspace root: C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/

for repo in alawein design-system workspace-tools knowledge-base bolts repz meshal-web alembiq fallax; do
  echo "=== $repo ==="
  for f in README.md CONTRIBUTING.md CODE_OF_CONDUCT.md SECURITY.md LICENSE; do
    [ -f "$repo/$f" ] && echo "  PASS $f" || echo "  FAIL $f"
  done
  [ -d "$repo/.github/ISSUE_TEMPLATE" ] && echo "  PASS .github/ISSUE_TEMPLATE/" || echo "  FAIL .github/ISSUE_TEMPLATE/"
  [ -f "$repo/.github/PULL_REQUEST_TEMPLATE.md" ] && echo "  PASS .github/PULL_REQUEST_TEMPLATE.md" || echo "  FAIL .github/PULL_REQUEST_TEMPLATE.md"
done
```

- [ ] **Step 2: Fill the A1 table in the findings doc**

For each FAIL, add a row to the A1 table with this format:
```
| Community Health | <criterion> | <repo> | Fail | <criterion> absent at repo root | Add <filename> matching alawein control plane template | S |
```

For each PASS across all repos (a criterion that passes everywhere), add one summary row:
```
| Community Health | <criterion> | all sampled | Pass | present in all 9 repos | — | — |
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer A community health findings"
```

---

### Task A3: SHA pinning and CI/CD security check

**Files:**
- Read: `.github/workflows/ci.yml` in each sampled repo
- Read: `alawein/.github/workflows/ci-node.yml`, `ci-python.yml`, `codeql.yml`
- Modify: findings doc — fill A2 table

GitHub's security hardening guide requires all `uses:` references pinned to a full 40-character SHA. Floating refs (`@main`, `@v3`, `@latest`) are Fail. A short SHA (`@abc1234`) is Partial. A full SHA (`@de0fac2e4500dabe0009e67214ff5f5447ce83dd`) is Pass.

- [ ] **Step 1: Extract all `uses:` references from sampled workflows**

```bash
# Run from workspace root
for repo in alawein design-system workspace-tools knowledge-base bolts repz meshal-web alembiq fallax; do
  echo "=== $repo ==="
  grep -r "uses:" "$repo/.github/workflows/" 2>/dev/null | grep -v "^Binary"
done
```

- [ ] **Step 2: Classify each unique action ref**

For each `uses:` line, apply the rule:
- Full 40-char SHA after `@` → **Pass**
- Tag like `@v3`, `@v4.1`, `@main` → **Fail**
- Short SHA (< 40 chars) → **Partial**
- `./` local workflow → **N/A**

Also check: does each repo's `ci.yml` use the reusable workflow ref from `github-baseline.yaml`? The canonical ref is `ed5ed61aef28cbdd761eeb0654808833bc4564be`. A repo using a different SHA → **Partial** (stale pin).

- [ ] **Step 3: Check `permissions:` blocks**

```bash
for repo in bolts repz meshal-web alembiq fallax; do
  echo "=== $repo ==="
  grep -A2 "^permissions:" "$repo/.github/workflows/ci.yml" 2>/dev/null || echo "  MISSING permissions block"
done
```

Expected: `contents: read` at minimum. Absence → **Partial** (implicit read-all is the GitHub default for public repos but explicit declaration is the best-practice).

- [ ] **Step 4: Check concurrency blocks**

```bash
for repo in bolts repz meshal-web alembiq fallax; do
  grep -c "concurrency:" "$repo/.github/workflows/ci.yml" 2>/dev/null || echo "$repo: MISSING concurrency"
done
```

- [ ] **Step 5: Fill the A2 table**

Add one row per finding (Fail or Partial). Pass with no caveats across all repos gets one summary row.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer A CI/SHA pinning findings"
```

---

### Task A4: Branch protection and secrets hygiene check

**Files:**
- Read: `.gitignore` in each sampled repo
- Read: `.env.example` presence in product repos (bolts, repz, meshal-web)
- Read: CONTRIBUTING.md for branch model
- Modify: findings doc — fill A3 table

External standard: `.gitignore` must cover `.env`, `*.pem`, `*.key`, `node_modules/`, `__pycache__/`, `.DS_Store`. Product repos with env vars must have `.env.example`. CONTRIBUTING must document the branch naming model.

- [ ] **Step 1: Check .gitignore coverage**

```bash
for repo in bolts repz meshal-web alembiq fallax design-system workspace-tools knowledge-base; do
  echo "=== $repo ==="
  for pattern in ".env" "*.pem" "*.key" "node_modules/" "__pycache__/" ".DS_Store"; do
    grep -qF "$pattern" "$repo/.gitignore" 2>/dev/null && echo "  PASS $pattern" || echo "  FAIL $pattern"
  done
done
```

- [ ] **Step 2: Check .env.example in product repos**

```bash
for repo in bolts repz meshal-web; do
  [ -f "$repo/.env.example" ] && echo "$repo: PASS .env.example" || echo "$repo: FAIL .env.example"
done
```

- [ ] **Step 3: Check CONTRIBUTING branch model documentation**

For each repo with a CONTRIBUTING.md, check whether it documents the `feat/`, `fix/`, `chore/` branch naming convention from `alawein/CLAUDE.md`. Read the first 60 lines of each:

```bash
for repo in bolts repz meshal-web design-system workspace-tools; do
  echo "=== $repo CONTRIBUTING.md (first 60 lines) ==="
  head -60 "$repo/CONTRIBUTING.md" 2>/dev/null || echo "  MISSING"
done
```

- [ ] **Step 4: Fill the A3 table and commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer A secrets hygiene and branch protection findings"
```

---

### Task A5: OSS README conventions check

**Files:**
- Read: README.md in all 9 sampled repos
- Read: `alawein/docs/style/VOICE.md` § README.md rules
- Modify: findings doc — fill A4 table

External OSS README norms (cross-referenced with VOICE.md):
1. Open with repo name + one factual sentence (no motivational opener)
2. Second paragraph: what it does, for whom, how it differs from the obvious alternative
3. Quick start with exact commands
4. Stack/dependencies listed
5. No badges unless CI badge for a live, passing pipeline (VOICE.md: "current, verifiable state only")
6. No emoji in headings
7. Contribution path present or link to CONTRIBUTING.md

- [ ] **Step 1: Check each README against the 7-point checklist**

Read each README (head -80 is sufficient for most checks) and score each criterion:

```bash
for repo in alawein design-system workspace-tools knowledge-base bolts repz meshal-web alembiq fallax; do
  echo "=== $repo README.md ==="
  head -80 "$repo/README.md" 2>/dev/null
  echo ""
done
```

Score each repo against:
- Factual one-sentence opener: Pass/Fail
- "for whom + how it differs" paragraph: Pass/Partial/Fail
- Quick start with exact commands: Pass/Partial/Fail
- Stack listed: Pass/Fail
- Badges: Pass (none or CI-only) / Fail (marketing badges, unverifiable state)
- No emoji in headings: Pass/Fail
- Contribution path: Pass/Partial (link only) / Fail

Note: `meshal-web` and `fallax` and `alembiq` carry status/version badges. Check whether those badge states are actually current and verifiable (link to live CI run or live version). If the badge links to a currently-passing CI run on the default branch, that is Pass by VOICE.md's "current, verifiable state" rule.

- [ ] **Step 2: Fill the A4 table and commit**

One row per Fail or Partial finding. Aggregate all Pass criteria in a summary note above the table.

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer A README conventions findings"
```

---

### Task A6: Conventional commits and semver check

**Files:**
- Read: recent git log in bolts, design-system, workspace-tools (3 repos)
- Read: package.json version fields in design-system packages
- Modify: findings doc — fill A5 table

Conventional commits spec: subject line must be `<type>(<optional-scope>): <description>`. Valid types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`, `perf`, `style`, `revert`. Description starts lowercase, no period at end.

Semver: packages under `packages/@alawein/` should follow `MAJOR.MINOR.PATCH`. Pre-release repos (no npm publish) are exempt but should still use semver internally.

- [ ] **Step 1: Sample recent commit messages**

```bash
# Run from workspace root
for repo in bolts design-system workspace-tools; do
  echo "=== $repo (last 20 commits) ==="
  git -C "$repo" log --oneline -20 2>/dev/null
done
```

Count and categorize: correct conventional format vs. freeform. Score:
- ≥ 90% conventional → **Pass**
- 70–89% → **Partial**
- < 70% → **Fail**

- [ ] **Step 2: Check package versions in design-system**

```bash
grep -r '"version"' C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system/packages/ --include="package.json" | grep -v node_modules | sort
```

Check: do versions follow semver? Are there packages still at `0.0.1` or `1.0.0` that have shipped functional changes (indicating version wasn't bumped)?

- [ ] **Step 3: Fill A5 table and commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer A conventional commits and semver findings"
```

---

### Task A7: Write the Layer A gap list and section header

**Files:**
- Modify: findings doc — add gap list above A1 table and write a 2-sentence section summary

- [ ] **Step 1: Identify gaps** — external standards with no internal governance equivalent

Review the A1–A5 findings. For each pattern of Fail verdicts, determine: does `alawein/docs/governance/` or `alawein/docs/style/VOICE.md` have a corresponding rule? If not, it belongs in the gap list.

Common candidates based on exploration:
- Branch protection rules (require PR review, require status checks before merge) — check if `github-baseline.md` covers this
- Dependabot configuration — check if `github-baseline.yaml` requires it
- CODEOWNERS — check if `github-baseline.md` covers it
- Issue triage SLA — check if any governance doc defines this

```bash
grep -i "branch protection\|dependabot\|codeowners\|issue.*triage\|pr.*review.*required" \
  alawein/docs/governance/github-baseline.md alawein/docs/governance/*.md 2>/dev/null | head -40
```

- [ ] **Step 2: Write the gap list into the findings doc**

Add a gap list under `### A — Gap List` with one row per gap:

```
- **<Standard>**: No governance rule covers <requirement>. Recommendation: add to `docs/governance/github-baseline.md`. Effort: S.
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer A gap list complete"
```

---

## Phase C — Governance Framework Critique

---

### Task C1: Voice contract critique

**Files:**
- Read: `docs/style/VOICE.md` (full)
- Read: `scripts/validate.py` (to check what is actually enforced)
- Modify: findings doc — Layer C table row: Voice contract

Evaluate against four questions:
1. Are the rules testable by a script or CI gate?
2. Are they enforced by an existing validator?
3. Are any rules overspecified (too narrow to matter)?
4. Are any rules missing that external style guides recommend?

- [ ] **Step 1: Read VOICE.md and validate.py in full**

```bash
cat alawein/docs/style/VOICE.md
echo "---"
cat alawein/scripts/validate.py
```

- [ ] **Step 2: Apply the four-question checklist per rule category**

For each section of VOICE.md (Core prose rules, Forbidden register, Preferred register, Feynman register, Mathematical exposition, Code comments, Naming conventions, Surface-specific rules, Enforcement tiers), answer:

| Rule category | Testable? | Enforced in CI? | Overspecified risk? | Missing rule? |
|---------------|-----------|-----------------|--------------------|-|

Specific things to check:
- Forbidden register list: does `validate.py` check for these strings? Run `grep -n "passionate\|leveraging\|innovative\|cutting-edge" alawein/scripts/validate.py` to verify.
- Mathematical notation rules: these are advisory-only; check whether that is the correct tier or if they should have at least one automated check for LaTeX `\cite` patterns in `.md` files.
- README.md badge rule ("current, verifiable state only"): is there an automated check that validates badge URLs? If not, this is an Undermaintained enforcement.

```bash
grep -n "passionate\|leveraging\|innovative\|forbidden\|badge\|emoji" alawein/scripts/validate.py | head -30
```

- [ ] **Step 3: Write the Voice contract row in the Layer C table**

Format:
```
| Voice contract | <Sound/Overspecified/Undermaintained/Missing> | <2-3 sentence rationale citing any Layer A gap where applicable> | <recommendation> |
```

Cross-reference note: if Layer A found that badge URL staleness has no CI check, cite that gap here as evidence of an Undermaintained enforcement.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer C voice contract verdict"
```

---

### Task C2: Enforcement tiers critique

**Files:**
- Read: `docs/style/VOICE.md` § Enforcement tiers
- Read: `CLAUDE.md` § Enforcement tiers
- Read: `.github/workflows/docs-validation.yml`
- Modify: findings doc — Layer C table row: Enforcement tiers

The VOICE.md enforcement tier table declares README.md and CLAUDE.md as "Blocking" and code comments as "Advisory". The critique question: are the blocking-tier surfaces actually blocked in CI, or is "Blocking" aspirational?

- [ ] **Step 1: Cross-reference blocking surfaces against actual CI jobs**

```bash
cat alawein/docs/style/VOICE.md | grep -A 20 "Enforcement tiers"
echo "---"
cat alawein/.github/workflows/docs-validation.yml
```

For each surface marked "Blocking" (README.md, docs/README.md, CLAUDE.md, AGENTS.md, prompt kits), confirm there is a CI job step that:
1. Checks that surface specifically
2. Fails (exit code non-zero) on a violation

- [ ] **Step 2: Check what validate.py actually checks**

```bash
python3 alawein/scripts/validate.py --help 2>/dev/null || python alawein/scripts/validate.py --help 2>/dev/null
grep -n "def check\|def validate\|def lint" alawein/scripts/validate.py | head -20
```

- [ ] **Step 3: Write the Enforcement tiers row in the Layer C table**

Cross-reference note: if Layer A found CLAUDE.md or README.md violations in any sampled non-alawein repo that CI did not catch, cite those A findings as direct evidence that "Blocking" is not workspace-wide.

Key questions to answer in the rationale:
- Is "Blocking" meaningful if the check only runs on the alawein control plane repo, not on sibling repos?
- Should blocking tier be enforced via a `sync-github.sh`-generated workflow that runs on every managed repo?

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer C enforcement tiers verdict"
```

---

### Task C3: Documentation doctrine critique

**Files:**
- Read: `docs/governance/documentation-contract.md` (full)
- Modify: findings doc — Layer C table row: Documentation doctrine

Key questions:
- Is the document class taxonomy (Canonical normative, Observed lessons, Managed governance, GitHub/profile exemptions, Historical archive) the right set of classes?
- Are the freshness SLAs (≤30 days for normative docs, "must change when content changes" for managed docs) realistic for a solo/small-team workspace?
- How many docs currently fail their own freshness SLA?

- [ ] **Step 1: Read the documentation contract and check actual freshness**

```bash
cat alawein/docs/governance/documentation-contract.md
echo "---"
# Check freshness of normative docs (last-verified must be <= 30 days from 2026-04-24)
# 30-day cutoff: 2026-03-25
grep -r "last.verified\|last_verified\|last.updated\|last_updated" \
  alawein/AGENTS.md alawein/CLAUDE.md alawein/SSOT.md alawein/LESSONS.md 2>/dev/null
```

Anything with a date before 2026-03-25 is past SLA.

- [ ] **Step 2: Count total managed docs and check freshness compliance**

```bash
find alawein/docs/governance/ -name "*.md" | wc -l
grep -r "last_updated\|last-updated" alawein/docs/governance/*.md 2>/dev/null | grep -v archive | head -30
```

- [ ] **Step 3: Write the Documentation doctrine row**

Focus the rationale on whether the SLA is maintainable: if more than 30% of managed docs are past SLA, that is evidence the SLA is overspecified relative to actual maintenance capacity.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer C documentation doctrine verdict"
```

---

### Task C4: Workflow baseline critique

**Files:**
- Read: `github-baseline.yaml` (full)
- Read: `.github/workflows/ci-node.yml`, `ci-python.yml`, `codeql.yml`
- Modify: findings doc — Layer C table row: Workflow baseline

Key questions:
1. Are the Node/Python CI templates the right shape for OSS best practices?
2. Is `sync: manual` overused as an escape hatch (weakening the baseline)?
3. Is the SHA pin governance sound — what is the process for updating SHA pins?
4. Is the `workflow_ref` SHA at the top of `github-baseline.yaml` current?

- [ ] **Step 1: Read and count sync:manual repos**

```bash
cat alawein/github-baseline.yaml
echo "---"
grep -c "sync: manual" alawein/github-baseline.yaml
grep "repo:\|sync:" alawein/github-baseline.yaml | paste - -
```

A repo marked `sync: manual` is exempt from automated baseline enforcement. Count: if more than 30% of repos are manual, the baseline is effectively opt-in rather than enforced.

- [ ] **Step 2: Check CI template quality**

```bash
cat alawein/.github/workflows/ci-node.yml
echo "---"
cat alawein/.github/workflows/ci-python.yml
```

Check:
- Are `permissions:` blocks set to minimum required? (`contents: read`)
- Is caching configured for npm/pip (reduces CI time)?
- Are matrix strategies used for multiple Node/Python versions where specified?
- Are there any steps that could fail silently (no `|| exit 1`)?

- [ ] **Step 3: Check SHA update process**

There is no documented process for updating SHA pins when actions release new versions. Check if any governance doc covers this:

```bash
grep -r "sha.*pin\|pin.*sha\|update.*pin\|dependabot.*actions" alawein/docs/governance/ 2>/dev/null | head -10
```

If absent, this is a Missing governance gap.

- [ ] **Step 4: Write the Workflow baseline row and commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer C workflow baseline verdict"
```

---

### Task C5: Validation scripts coverage critique

**Files:**
- Read: `scripts/validate-doc-contract.sh` (full or head -100)
- Read: `scripts/validate.py` (full or head -100)
- Read: `scripts/validate-doctrine.py` (head -100)
- Modify: findings doc — Layer C table row: Validation scripts

The critique question: do the scripts enforce what the governance contracts claim, or are there coverage gaps?

- [ ] **Step 1: Map scripts to their claimed coverage**

```bash
head -100 alawein/scripts/validate-doc-contract.sh
echo "---"
head -100 alawein/scripts/validate.py
echo "---"
head -60 alawein/scripts/validate-doctrine.py
```

Build a table:

| Script | Claims to check | Actually checks | Gap |
|--------|----------------|-----------------|-----|

- [ ] **Step 2: Check for false-positive risk from prior session context**

Spec C (governance audit from 2026-04-23) already found that `drift-detection.sh` always emits "No governance drift detected" due to a missing `_pkos/` directory. Verify this is still the case and note it in the findings.

```bash
cat alawein/.claude/hooks/drift-detection.sh 2>/dev/null | head -40
grep "_pkos\|template_source" alawein/.claude/hooks/drift-detection.sh 2>/dev/null
```

- [ ] **Step 3: Write the Validation scripts row and commit**

Note specifically: any script that can silently no-op (exit 0 with no real check) is **Undermaintained** even if sound in design.

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer C validation scripts verdict"
```

---

### Task C6: Governance overhead assessment

**Files:**
- Read: file listing of `docs/governance/` (all .md files)
- Read: `REPO_GOVERNANCE_INITIATIVE.md`
- Modify: findings doc — Layer C table row: Governance overhead

The critique question: is the volume of governance documentation maintainable? For a solo or small-team workspace, a governance stack with 30+ documents, freshness SLAs on each, and validation scripts for each creates a maintenance burden that can exceed the value it delivers.

- [ ] **Step 1: Count and categorize governance docs**

```bash
find alawein/docs/governance/ -name "*.md" -not -path "*/archive/*" | wc -l
find alawein/docs/governance/ -name "*.md" -not -path "*/archive/*" | sort
```

Categorize each doc into: **Active+Enforced** (CI checks it or it's cited by a script), **Active+Aspirational** (referenced in governance but not checked), **Stale** (last_updated > 60 days), **Redundant** (content duplicated by another doc).

- [ ] **Step 2: Check the REPO_GOVERNANCE_INITIATIVE.md status**

```bash
cat alawein/REPO_GOVERNANCE_INITIATIVE.md
```

Spec C (2026-04-23) already found that 5 promised deliverables in this document do not exist. Verify this is still the case:

```bash
ls alawein/docs/governance/repository-standardization-program.md 2>/dev/null || echo "MISSING"
ls alawein/docs/governance/templates/ 2>/dev/null || echo "MISSING"
ls alawein/docs/governance/migration-checklist.template.md 2>/dev/null || echo "MISSING"
ls alawein/docs/governance/repo-audit-scorecard.template.md 2>/dev/null || echo "MISSING"
ls alawein/docs/governance/compliance-dashboard-schema.yaml 2>/dev/null || echo "MISSING"
```

- [ ] **Step 3: Write the Governance overhead row**

The verdict will likely be **Overspecified** or **Undermaintained** depending on the ratio of Active+Enforced to Active+Aspirational docs. State the specific count and the specific redundancy or staleness patterns.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer C governance overhead verdict"
```

---

## Phase B — Compliance Synthesis

---

### Task B1: Spot-check bolts (most Criticals in Spec A)

**Files:**
- Read: `docs/superpowers/specs/2026-04-23-active-products-audit.md` § bolts (already read; see above)
- Read: `bolts/src/app/account/page.tsx`, `bolts/src/app/admin/page.tsx`, `bolts/node_modules/@alawein/tokens/package.json`
- Modify: findings doc — annotate source spec accuracy for bolts findings

Spec A flagged three Criticals for bolts: (1) mock data in account/dashboard with no auth gate, (2) admin panel publicly accessible, (3) installed `@alawein/tokens` at v0.1.0 when 0.2.0/0.3.0 declared. Verify all three.

- [ ] **Step 1: Verify finding 1 — mock data, no auth gate**

```bash
head -30 C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src/app/account/page.tsx 2>/dev/null
head -20 C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src/app/dashboard/page.tsx 2>/dev/null
```

Expected: `const mockUser = {` or similar hardcoded object, no `createClient()` or `supabase.auth.getUser()` call at the top of the file. Record: **Confirmed** or **Not confirmed** + current evidence.

- [ ] **Step 2: Verify finding 2 — admin panel auth**

```bash
head -30 C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src/app/admin/page.tsx 2>/dev/null
```

Expected: no auth middleware redirect, no `getServerSession()` or Supabase session check. Record verdict.

- [ ] **Step 3: Verify finding 3 — installed package version**

```bash
cat C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/node_modules/@alawein/tokens/package.json 2>/dev/null | grep '"version"'
cat C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/package.json | grep "@alawein/tokens"
```

Expected: installed version is 0.1.0 while package.json declares 0.2.0. Record verdict.

- [ ] **Step 4: Record spot-check accuracy note in findings doc**

Add a brief accuracy annotation above the Layer B table:
```
**Bolts spot-check (2026-04-24):** 3/3 Criticals confirmed. Spec A accuracy on bolts: verified.
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer B spot-check bolts"
```

---

### Task B2: Spot-check design-system (infra Criticals)

**Files:**
- Read: `docs/superpowers/specs/2026-04-23-shared-infrastructure-audit.md` § design-system
- Read: `design-system/packages/@alawein/ui/src/index.ts` (check exports)
- Read: `design-system/packages/@alawein/morphism-themes/package.json`

Spec B flagged three Criticals for design-system: (1) `@alawein/ui` missing ErrorBoundary, (2) missing EmptyState, (3) missing LoadingSpinner/PageLoader.

- [ ] **Step 1: Verify missing UI primitives**

```bash
grep -i "errorboundary\|error.boundary\|emptystate\|empty.state\|loadingspinner\|loading.spinner\|pageloader\|page.loader" \
  C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system/packages/@alawein/ui/src/index.ts 2>/dev/null
```

Expected: zero hits for all five terms. Record verdict.

- [ ] **Step 2: Verify morphism-themes deprecation status**

```bash
cat C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system/packages/@alawein/morphism-themes/package.json 2>/dev/null | grep -i "deprecated\|version\|description"
```

- [ ] **Step 3: Record accuracy note and commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer B spot-check design-system"
```

---

### Task B3: Spot-check alembiq (recently renamed, migration risk)

**Files:**
- Read: `docs/superpowers/specs/2026-04-23-research-portfolio-audit.md` § alembiq
- Read: `alembiq/README.md`, `alembiq/.github/workflows/ci.yml`, `alembiq/src/alembiq/` (check import names)

Spec D marked alembiq Keep-live. The migration risk is that the repo was renamed from `neper` and Python imports still use the old name (`import neper`).

- [ ] **Step 1: Check for legacy import names**

```bash
grep -r "import neper\|from neper" C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alembiq/src/ 2>/dev/null | head -10
grep -r "import alembiq\|from alembiq" C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alembiq/src/ 2>/dev/null | head -10
```

Expected per CLAUDE.md: "Python imports still use old names (e.g., `import neper`)". If `import neper` appears with no `import alembiq`, this is a confirmed finding. If both appear, the migration is partial.

- [ ] **Step 2: Check CI workflow health**

```bash
cat C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alembiq/.github/workflows/ci.yml 2>/dev/null | head -40
```

Check: is the reusable workflow ref the current SHA (`ed5ed61aef28cbdd761eeb0654808833bc4564be`)?

- [ ] **Step 3: Record accuracy note and commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer B spot-check alembiq"
```

---

### Task B4: Spot-check alawein control plane (governance theater)

**Files:**
- Read: `.claude/settings.json`
- Read: `.claude/hooks/drift-detection.sh`
- Read: `REPO_GOVERNANCE_INITIATIVE.md`

Spec C (governance audit) flagged three broken Claude Code hooks and five missing REPO_GOVERNANCE_INITIATIVE.md deliverables. These are in the control plane itself.

- [ ] **Step 1: Verify broken hook event names**

```bash
cat C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/.claude/settings.json 2>/dev/null
```

Expected: hook event keys `pre-commit`, `post-commit`, `hourly` — none of which are valid Claude Code events (`PreToolUse`, `PostToolUse`, `Stop`, `UserPromptSubmit`, `SessionStart`). Record: **Confirmed** or **Not confirmed**.

- [ ] **Step 2: Verify drift-detection.sh false-green**

```bash
grep -n "_pkos\|template_source\|No governance drift" \
  C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/.claude/hooks/drift-detection.sh 2>/dev/null
```

Expected: `_pkos` appears in `template_source`; `_pkos/` does not exist → drift check silently no-ops → script outputs "No governance drift detected."

- [ ] **Step 3: Record accuracy note and commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer B spot-check alawein control plane"
```

---

### Task B5: Synthesize existing specs into priority buckets

**Files:**
- Read: all 8 existing 2026-04-23 specs (already read above)
- Read: Layer C findings table (just written)
- Modify: findings doc — populate Layer B Quick Wins, Critical Path, Deferred, Rule Changes tables

This task applies the priority filter: findings against governance rules that Layer C marked as **Overspecified** → move to Rule Changes or Deferred. Findings against **Sound** rules → prioritize by impact × effort.

- [ ] **Step 1: Extract all Critical and High findings from existing specs**

Read each spec and list findings. Group by effort:
- S/M effort + Critical/High severity → **Quick Win** candidate
- L/XL effort + Critical/High severity → **Critical Path** candidate
- Any effort + Medium/Low severity → **Deferred** candidate

Cross-cutting findings that appear in 3+ repos → elevate priority tier by one.

- [ ] **Step 2: Apply the Layer C filter**

For each finding, ask: which governance rule does this violate? Check the Layer C verdict for that rule:
- Rule is **Overspecified** → move finding to **Rule Changes** table instead of repo action table
- Rule is **Undermaintained** → note that fixing the enforcement mechanism may address multiple findings at once
- Rule is **Missing** → the finding itself IS the missing rule; put it in the Layer A/C gap list, not Layer B

- [ ] **Step 3: Populate the four priority tables in the findings doc**

For each row, fill all columns:
```
| Repo | Severity | Finding | Area | Gov Rule | Effort | Source |
```

Source column: cite the input spec by date and title abbreviation, e.g., `Spec A §bolts`.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): Layer B priority action tables populated"
```

---

## Phase S — Final Synthesis

---

### Task S1: Write executive summary and cross-cutting recommendations

**Files:**
- Modify: findings doc — fill Executive Summary and Cross-Cutting Recommendations sections

- [ ] **Step 1: Draft the executive summary**

The executive summary must answer five questions in 10 sentences or fewer:

1. Overall workspace health verdict (Green/Yellow/Red) — one sentence
2. Top 3 external standards where the workspace underperforms (Layer A)
3. Verdict on governance framework design quality — is it sound, overspecified, or undermaintained overall? (Layer C)
4. Top 3 Quick Win actions from Layer B (highest impact, lowest effort)
5. The most urgent single action for the workspace

Write this directly into the `## Executive Summary` section of the findings doc. Do not use bullet lists — write in short declarative sentences per VOICE.md.

- [ ] **Step 2: Write cross-cutting recommendations**

Cross-cutting recommendations are findings that span all three layers — a pattern visible in A, confirmed as a governance gap in C, and showing up as compliance failures in B. Typically 3–5 such patterns exist. Common candidates based on the audit data:

- If badge rules are failing in A and there is no CI check in C, and multiple repos have stale badges in B → "Add badge URL staleness check to docs-validation workflow"
- If broken hooks were found in A (no enforcement mechanism) and C (scripts are theater) and B (control plane itself) → "Replace broken `pre-commit`/`post-commit` hooks with valid `Stop` and `PreToolUse` Claude Code hooks"
- If REPO_GOVERNANCE_INITIATIVE.md promises things that don't exist (found in B) and this represents a documentation honesty violation (found in A under community health) and no governance rule explicitly prohibits aspirational promises (gap in C) → "Add 'no aspirational deliverables in published docs' rule to VOICE.md blocking tier"

Write 3–5 such recommendations, each with: the cross-cutting pattern, which layers surfaced it, and a concrete action.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): executive summary and cross-cutting recommendations"
```

---

### Task S2: Final review pass and close

**Files:**
- Read: `docs/superpowers/specs/2026-04-24-workspace-review-findings.md` (full)
- Modify: findings doc — fix any remaining stubs or placeholder rows

- [ ] **Step 1: Scan for empty table rows**

```bash
grep "| |" alawein/docs/superpowers/specs/2026-04-24-workspace-review-findings.md | head -20
```

Any row that is entirely `| | | | | | | |` is an unfilled placeholder. Either fill it or remove it.

- [ ] **Step 2: Verify all section headers are populated**

Check that none of the `> _To be written last_` stubs remain:

```bash
grep "To be written last\|stub\|TBD\|TODO" \
  alawein/docs/superpowers/specs/2026-04-24-workspace-review-findings.md
```

Expected: zero matches.

- [ ] **Step 3: Final commit**

```bash
git add docs/superpowers/specs/2026-04-24-workspace-review-findings.md
git commit -m "docs(review): workspace comprehensive review complete"
```

---

## Self-Review Notes

**Spec coverage check:**
- Layer A reference standards: A2 (community health), A3 (SHA pinning + CI), A4 (secrets + branch), A5 (README), A6 (commits + semver), A7 (gap list) — all 8 standards covered
- Layer C subsystems: C1 (voice), C2 (enforcement tiers), C3 (doc doctrine), C4 (workflow baseline), C5 (validation scripts), C6 (governance overhead) — all 6 covered
- Layer B spot-checks: B1 (bolts), B2 (design-system), B3 (alembiq), B4 (alawein) — all 4 covered
- Layer B synthesis: B5 — covered
- Executive summary + cross-cutting: S1 — covered
- Final cleanup: S2 — covered

**Constraints from spec:**
- No full re-audit of 30 repos: satisfied — plan reads sampled repos only
- Spot-checks are 2–3 Criticals each: satisfied — each B task checks 2–3 findings
- Layer C verdicts cite Layer A where applicable: reminder in C1–C6 tasks to cross-reference
- Every finding has recommendation + effort: enforced in table format definitions

**No placeholders remain in this plan.**
