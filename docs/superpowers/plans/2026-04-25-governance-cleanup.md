---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last-verified: 2026-04-25
audience: [ai-agents, contributors]
last_updated: 2026-04-25
---

# Governance Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce governance overhead by archiving completed migration artifacts, rewriting an aspirational root document to reflect reality, and adding an explicit 90-day freshness SLA for managed governance docs.

**Architecture:** Three isolated changes — archive moves (git mv), a doc rewrite from root to docs/governance/, and a staleness check added to validate-doctrine.py. No shared state between changes; each can be committed independently. Task 1 is a guard that must complete before Task 2.

**Tech Stack:** bash (git mv), Python (validate-doctrine.py staleness check), Markdown (repo-standardization.md), GitHub Actions YAML (docs-validation.yml exemption updates).

---

## File Map

| File | Action | Task |
|------|--------|------|
| `docs/governance/bulk-execution-progress.md` | Move to `docs/archive/` | T2 |
| `docs/governance/phase1-design-branding-analysis-alawein.md` | Move to `docs/archive/` | T2 |
| `docs/governance/phase1-design-branding-analysis-frontends.md` | Move to `docs/archive/` | T2 |
| `docs/governance/phase3-refactor-and-centralization.md` | Move to `docs/archive/` | T2 |
| `docs/governance/phase4-testing-and-validation.md` | Move to `docs/archive/` | T2 |
| `docs/governance/phase5-version-control-and-deployment.md` | Move to `docs/archive/` | T2 |
| `docs/governance/dashboard-rollout-playbook.md` | Move to `docs/archive/` | T2 |
| `docs/governance/workspace-rename-matrix.md` | Move to `docs/archive/` | T2 |
| `docs/governance/remaining-steps-per-repo.md` | Move to `docs/archive/` | T2 |
| `docs/governance/skills-consolidation-reference-2026-03-17.md` | Move to `docs/archive/` | T2 |
| `docs/README.md` | Remove links to archived files; add link to repo-standardization.md | T2, T3 |
| `REPO_GOVERNANCE_INITIATIVE.md` | Delete from repo root | T3 |
| `docs/governance/repo-standardization.md` | Create — accurate replacement for REPO_GOVERNANCE_INITIATIVE.md | T3 |
| `SSOT.md` | Update reference if present (confirmed absent — no action needed) | T3 |
| `docs/governance/documentation-contract.md` | Update Managed governance docs row — add Freshness SLA: 90 days | T4 |
| `scripts/validate-doctrine.py` | Add 90-day staleness check for managed docs (warning, not error) | T5 |
| `.github/workflows/docs-validation.yml` | Update legacy_token_exempt_files — change paths to archive/ equivalents | T2 |

---

## Task 1: Verify no active references to files being archived

**Purpose:** Guard task. If any live script or CI workflow hard-references a file by path, update the reference before archiving. Do not skip.

- [ ] Run the reference check:

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"
grep -r \
  "bulk-execution-progress\|phase1-design-branding\|phase3-refactor\|phase4-testing\|phase5-version\|dashboard-rollout-playbook\|workspace-rename-matrix\|remaining-steps-per-repo\|skills-consolidation-reference-2026-03" \
  scripts/ .github/ 2>/dev/null
```

**Known results (pre-verified during plan authoring):**

| Reference | File | Context | Resolution |
|-----------|------|---------|------------|
| `docs/governance/bulk-execution-progress.md` | `.github/workflows/docs-validation.yml` line 210 | `legacy_token_exempt_files` set — exempts the file from legacy-token checks | After move: update the path to `docs/archive/bulk-execution-progress.md` in the exempt set |
| `docs/governance/remaining-steps-per-repo.md` | `.github/workflows/docs-validation.yml` line 212 | Same exempt set | After move: update to `docs/archive/remaining-steps-per-repo.md` |
| `docs/governance/dashboard-rollout-playbook.md` | `scripts/dashboard-rollout.py` line 24 | `DEFAULT_ALLOW` list — controls which files the dirty-state audit allows | After move: update to `docs/archive/dashboard-rollout-playbook.md` |
| `docs/governance/phase*` prefix | `.github/workflows/docs-validation.yml` line 205 | `legacy_token_exempt_prefixes` tuple | The prefix `"docs/governance/phase"` covers phase1/3/4/5 by prefix match. After archive move, the prefix becomes `"docs/archive/phase"` — update accordingly |

- [ ] Confirm `SSOT.md` has no reference to `REPO_GOVERNANCE_INITIATIVE.md` (verified absent — no action needed).

- [ ] Confirm `docs/README.md` links to `workspace-rename-matrix.md` (line 70 — will be removed in Task 2).

- [ ] If any additional references appear in the grep output beyond the four listed above, update those references before proceeding to Task 2.

---

## Task 2: Archive one-time migration docs

**Pre-condition:** Task 1 complete. All known references identified.

### 2a. Move files to docs/archive/

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"

git mv docs/governance/bulk-execution-progress.md docs/archive/bulk-execution-progress.md
git mv docs/governance/phase1-design-branding-analysis-alawein.md docs/archive/phase1-design-branding-analysis-alawein.md
git mv docs/governance/phase1-design-branding-analysis-frontends.md docs/archive/phase1-design-branding-analysis-frontends.md
git mv docs/governance/phase3-refactor-and-centralization.md docs/archive/phase3-refactor-and-centralization.md
git mv docs/governance/phase4-testing-and-validation.md docs/archive/phase4-testing-and-validation.md
git mv docs/governance/phase5-version-control-and-deployment.md docs/archive/phase5-version-control-and-deployment.md
git mv docs/governance/dashboard-rollout-playbook.md docs/archive/dashboard-rollout-playbook.md
git mv docs/governance/workspace-rename-matrix.md docs/archive/workspace-rename-matrix.md
git mv docs/governance/remaining-steps-per-repo.md docs/archive/remaining-steps-per-repo.md
git mv docs/governance/skills-consolidation-reference-2026-03-17.md docs/archive/skills-consolidation-reference-2026-03-17.md
```

### 2b. Update docs/README.md — remove links to archived files

Remove the entire "Workspace migration" section (lines 67–74) since `workspace-rename-matrix.md` is the only link there that pointed to a now-archived file, and the other files in that section remain active. The only archived file linked in that section is `workspace-rename-matrix.md`.

**Diff to apply:**

```diff
-## Workspace migration
-
-- [`workspace-standardization.md`](./governance/workspace-standardization.md)
-- [`workspace-layout-audit.md`](./governance/workspace-layout-audit.md)
-- [`workspace-rename-matrix.md`](./governance/workspace-rename-matrix.md)
-- [`package-namespace-matrix.md`](./governance/package-namespace-matrix.md)
-- [`workspace-resource-map.md`](./governance/workspace-resource-map.md)
-- [`workspace-master-prompt.md`](./governance/workspace-master-prompt.md)
+## Workspace migration
+
+- [`workspace-standardization.md`](./governance/workspace-standardization.md)
+- [`workspace-layout-audit.md`](./governance/workspace-layout-audit.md)
+- [`package-namespace-matrix.md`](./governance/package-namespace-matrix.md)
+- [`workspace-resource-map.md`](./governance/workspace-resource-map.md)
+- [`workspace-master-prompt.md`](./governance/workspace-master-prompt.md)
```

Only `workspace-rename-matrix.md` is removed from the list. The section heading and remaining links stay.

### 2c. Update .github/workflows/docs-validation.yml — fix exempt paths

The `legacy_token_exempt_files` set currently exempts `docs/governance/bulk-execution-progress.md` and `docs/governance/remaining-steps-per-repo.md`. After the move, those paths no longer exist — update to the archive location so the exemption continues to function.

The `legacy_token_exempt_prefixes` tuple currently contains `"docs/governance/phase"`. After the move, the phase files live under `docs/archive/`. Update the prefix.

**Diff to apply** (around line 204 in docs-validation.yml):

```diff
           legacy_token_exempt_prefixes = (
-              "docs/governance/phase",
+              "docs/archive/phase",
           )
           legacy_token_exempt_files = {
               "docs/HANDOFF-DESIGN-BRANDING.md",
               "docs/governance/branding-workflow-and-standards.md",
-              "docs/governance/bulk-execution-progress.md",
+              "docs/archive/bulk-execution-progress.md",
               "docs/governance/design-branding-summary.md",
-              "docs/governance/remaining-steps-per-repo.md",
+              "docs/archive/remaining-steps-per-repo.md",
               "docs/audits/technical-debt-report-20260311.md",
           }
```

### 2d. Update scripts/dashboard-rollout.py — fix DEFAULT_ALLOW path

**Diff to apply** (around line 24 in dashboard-rollout.py):

```diff
-    "docs/governance/dashboard-rollout-playbook.md",
+    "docs/archive/dashboard-rollout-playbook.md",
```

### 2e. Run doctrine validator

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"
python scripts/validate-doctrine.py .
```

Expected: PASS. The archived files are now under `docs/archive/` which is explicitly exempt from freshness SLAs per the documentation contract.

### 2f. Commit

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"
git add docs/README.md .github/workflows/docs-validation.yml scripts/dashboard-rollout.py
git commit -m "chore(docs): archive completed migration artifacts"
```

The `git mv` commands already staged the moves. This commit adds the reference updates.

---

## Task 3: Rewrite REPO_GOVERNANCE_INITIATIVE.md → repo-standardization.md

### 3a. Delete REPO_GOVERNANCE_INITIATIVE.md from repo root

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"
git rm REPO_GOVERNANCE_INITIATIVE.md
```

### 3b. Create docs/governance/repo-standardization.md

Create the file with this complete content:

```markdown
---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last_updated: 2026-04-25
audience: [ai-agents, contributors]
---

# Repository Standardization

This document describes the baseline governance that has shipped to managed
repos in the `alawein` organization.

## What the baseline covers

Every managed repo receives the following files via `scripts/sync-github.sh`:

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Fast CI gate — lint, type-check, test (language-appropriate) |
| `.github/workflows/codeql.yml` | CodeQL security analysis on push to main |
| `.github/dependabot.yml` | Automated dependency update PRs (weekly) |
| `.github/CODEOWNERS` | Org-level review assignment |
| `.github/PULL_REQUEST_TEMPLATE.md` | Standard PR checklist |
| `.github/ISSUE_TEMPLATE/bug_report.yml` | Bug report form |
| `.github/ISSUE_TEMPLATE/feature_request.yml` | Feature request form |

As of 2026-04-25 the baseline is deployed to 14+ repos. The authoritative
list is `projects.json` — any repo with `"managed": true` participates.

## How baseline changes propagate

`scripts/sync-github.sh` reads the baseline templates from
`templates/github-baseline/` and writes them into each managed repo.

Run in check mode to see what would change without writing:

```bash
./scripts/sync-github.sh --check --all
```

Run to apply to all managed repos:

```bash
./scripts/sync-github.sh --all
```

Run for a single repo:

```bash
./scripts/sync-github.sh --repo alawein/bolts
```

When a repo has intentional per-repo CI additions (not baseline drift), mark
it `"sync": "manual"` in `projects.json` to exclude it from automated sync.
Check `MEMORY.md` reference `reference_sync_github_destructive_defaults.md`
for the full policy.

## How to audit compliance

`scripts/github-baseline-audit.py` reports which managed repos are missing
baseline files or have drifted from the current template.

```bash
python scripts/github-baseline-audit.py
```

Output is a table per repo showing present / missing / drifted files.

## How to add a new repo to the managed cohort

1. Add an entry to `projects.json` with `"managed": true`.
2. Run `./scripts/sync-github.sh --repo alawein/<repo-slug>`.
3. Verify with `python scripts/github-baseline-audit.py`.
4. Merge the resulting PR in the target repo.

## What is not covered

- Product-specific CI steps (e.g., Vercel deploy, Supabase migrations) —
  these are managed per-repo.
- Branch protection rules — configured directly in GitHub repo settings.
- npm publish workflows — managed in `design-system/` independently.
```

### 3c. Update docs/README.md — add link to repo-standardization.md

Add a new "Repo governance" section after the "Start here" section, or append
to the "Workflow operations" list. The cleaner placement is a new short section
after "Start here":

**Diff to apply** (insert after the "Start here" section, before "## Governance by task"):

```diff
 - [`github-baseline.md`](./governance/github-baseline.md)
 - Governance operating model:
   [`operating-model.md`](./governance/operating-model.md)
 - Workflow overview: [`workflow.md`](./governance/workflow.md)
+- Repo standardization and baseline enforcement:
+  [`repo-standardization.md`](./governance/repo-standardization.md)
 
 ## Governance by task
```

### 3d. Check SSOT.md for stale references

```bash
grep "REPO_GOVERNANCE_INITIATIVE" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/SSOT.md"
```

Expected: no output (confirmed absent during plan authoring). If any reference appears, replace the path with `docs/governance/repo-standardization.md`.

### 3e. Run doctrine validator

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"
python scripts/validate-doctrine.py .
```

Expected: PASS.

### 3f. Commit

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"
git add docs/governance/repo-standardization.md docs/README.md
git commit -m "docs: replace aspirational initiative doc with accurate repo-standardization guide"
```

The `git rm REPO_GOVERNANCE_INITIATIVE.md` is already staged. Include it.

---

## Task 4: Update freshness SLA in documentation-contract.md

**File:** `docs/governance/documentation-contract.md`

### 4a. Locate the current table row

Current text (line 37):

```
| Managed governance docs | `SECURITY.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `docs/**/*.md` excluding `docs/archive/**` | Required | `last_updated` | Must change whenever document content changes |
```

### 4b. Apply the change

Replace the Managed governance docs row with:

```
| Managed governance docs | `SECURITY.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `docs/**/*.md` excluding `docs/archive/**` | Required | `last_updated` | Must change whenever document content changes. Freshness SLA: 90 days. A warning (not error) is emitted for docs older than 90 days; becomes an error after a 30-day grace period. |
```

### 4c. Update the Local Validation section

In the "Local Validation" section (lines 82–96), add a bullet for the staleness check:

**Diff to apply:**

```diff
 The validator enforces:
 
 - required file existence
 - frontmatter requirements for managed docs, excluding GitHub-facing README
   exemptions
 - required freshness keys by document class
 - `last-verified` age for canonical docs
 - freshness-field updates when managed docs change in the current diff
+- 90-day staleness warning for managed governance docs with `last_updated` older
+  than 90 days (warning on first rollout; converts to error after 30-day grace period)
 - UTF-8 BOM prohibition for canonical docs
 - local relative markdown link integrity
```

### 4d. Update the `last_updated` field in the file's own frontmatter

```diff
-last_updated: 2026-04-15
+last_updated: 2026-04-25
```

### 4e. Commit

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"
git add docs/governance/documentation-contract.md
git commit -m "docs(governance): add 90-day freshness SLA for managed governance docs"
```

---

## Task 5: Add 90-day staleness check to validate-doctrine.py

### 5a. Read the current validate function entry point

The `validate()` function in `scripts/validate-doctrine.py` starts at line 485. After the five check calls (lines 531–538), add a new `check_staleness()` call.

### 5b. Add imports

At the top of the file, after `import re` and `import argparse`, add:

```python
from datetime import date, timedelta
```

This is a stdlib import — no new dependencies.

### 5c. Add the staleness check function

Insert the following function before the `validate()` function definition (around line 485, after `check_zombies`):

```python
def check_staleness(managed_files, result):
    """Rule 10: Managed governance docs must have last_updated within 90 days.

    Emits a warning (not an error) on initial rollout. The grace period is
    30 days from 2026-04-25; after 2026-05-25 the warning converts to an error.
    """
    GRACE_PERIOD_END = date(2026, 5, 25)
    MAX_AGE_DAYS = 90
    today = date.today()
    grace_active = today <= GRACE_PERIOD_END

    for fp in managed_files:
        path = Path(fp)

        # Only apply to docs/**/*.md (managed governance class). Skip archive.
        parts = path.parts
        if "archive" in parts:
            continue
        if not any(p in ("docs",) for p in parts):
            continue
        if path.suffix != ".md":
            continue

        header, _ = parse_header(fp)
        if not header:
            continue

        # Only files with last_updated are in scope — others already fail R1/R4.
        raw_date = header.get("last_updated", "").strip()
        if not raw_date:
            continue

        # Parse ISO date. Accept YYYY-MM-DD only.
        try:
            doc_date = date.fromisoformat(raw_date)
        except ValueError:
            result.warn(fp, "R10", f"last_updated '{raw_date}' is not a valid ISO date (YYYY-MM-DD)")
            continue

        age_days = (today - doc_date).days
        if age_days > MAX_AGE_DAYS:
            msg = (
                f"last_updated is {age_days} days old (limit: {MAX_AGE_DAYS}). "
                f"Review and update this doc, or move to docs/archive/ if complete."
            )
            if grace_active:
                result.warn(fp, "R10", msg)
            else:
                result.error(fp, "R10", msg)
```

### 5d. Register the check in validate()

In the `validate()` function, after the existing five check calls, add:

```python
    check_staleness(managed_files, result)
```

The call block (currently lines 531–538) becomes:

```python
    for fp in managed_files:
        check_header(fp, result, root)

    check_duplicate_canonicals(managed_files, result)
    check_dual_sources(managed_files, result)
    check_domain_boundaries(managed_files, result, root)
    check_sla_ci_wiring(managed_files, result, root)
    check_zombies(managed_files, all_contents, result)
    check_staleness(managed_files, result)
```

### 5e. Test the addition

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"
python scripts/validate-doctrine.py . 2>&1 | head -40
```

The validator will now emit R10 warnings for managed docs with `last_updated` older than 90 days (i.e., before 2026-01-24). These are warnings, not errors — CI will not block. Identify the stale docs from the warning list and update their `last_updated` fields as part of this task.

To find all stale managed docs without running the full validator:

```bash
grep -rn "last_updated:" docs/ --include="*.md" | grep -v "archive" | sort
```

Update `last_updated` to `2026-04-25` for any doc that is legitimately current
(content still accurate) and is simply past 90 days. If a doc's content is
stale, update the content too, then update `last_updated`.

### 5f. Commit

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"
git add scripts/validate-doctrine.py
git commit -m "feat(docs): add 90-day staleness warning for managed governance docs"
```

---

## Task 6: Run full validation suite

Run all three validators to confirm nothing was broken by the changes:

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein"
python scripts/validate-doctrine.py .
bash ./scripts/validate-doc-contract.sh --full
python scripts/validate.py --ci
```

**Expected outcome:**

- `validate-doctrine.py`: PASS. R10 warnings may appear for managed docs with `last_updated` > 90 days old — these are warnings, not failures. If any R10 errors appear (which would only happen after the grace period ends on 2026-05-25), fix the stale doc dates first.
- `validate-doc-contract.sh --full`: PASS. The archived files are now in `docs/archive/`, which is exempt from the freshness contract. The new `repo-standardization.md` has required frontmatter.
- `validate.py --ci`: PASS. Style contract unchanged.

If any validator fails:

1. Read the failure message in full.
2. Do not patch generated output to silence failures — fix the classification boundary or the doc content.
3. Re-run the failing validator after fixing.

---

## Commit summary

| Task | Commit message |
|------|---------------|
| T2 | `chore(docs): archive completed migration artifacts` |
| T3 | `docs: replace aspirational initiative doc with accurate repo-standardization guide` |
| T4 | `docs(governance): add 90-day freshness SLA for managed governance docs` |
| T5 | `feat(docs): add 90-day staleness warning for managed governance docs` |

Tasks 4 and 5 may be combined into a single commit if preferred:
`feat(docs): add 90-day staleness SLA and validator check for managed docs`
