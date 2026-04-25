---
title: Spec 5 — Per-Repo SHA Pinning
date: 2026-04-25
status: active
type: canonical
feeds: [master-execution-plan]
last_updated: 2026-04-25
---

# Spec 5 — Per-Repo SHA Pinning

**Repos:** knowledge-base, meshal-web, alembiq, fallax
**Track:** Parallel with Specs 1, 2, 3
**Source:** 2026-04-24 workspace review — Layer A (A3: SHA pinning failures, A2: meshal-web missing community health files); Layer B Quick Wins

---

## Purpose

Replace all floating GitHub Actions refs (`@v4`, `@v3`, `@main`) with full 40-character SHA pins in four repos. Fix meshal-web's missing permissions block, concurrency block, issue templates, and PR template. Each repo gets one commit.

---

## Actions requiring SHA pins

Look up current SHAs from the action's GitHub release page at implementation time. The following actions need pinning across one or more repos:

| Action | Used in |
|--------|---------|
| `actions/checkout` | knowledge-base, meshal-web, alembiq, fallax |
| `actions/setup-node` | knowledge-base, meshal-web |
| `actions/setup-python` | knowledge-base, alembiq, fallax |
| `astral-sh/setup-uv` | fallax |
| `github/codeql-action/init` | knowledge-base |
| `github/codeql-action/analyze` | knowledge-base |

**How to find the current SHA:** For each action, look at the action's GitHub releases page and find the latest release tag. Then look at that tag's commit SHA. Pin to that full 40-char SHA, not the tag. Example: `actions/checkout@v4` → `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683`.

The alawein control plane workflows at `alawein/.github/workflows/ci-node.yml` and `ci-python.yml` already have the correct pinned SHAs — use those as the reference source for `actions/checkout`, `actions/setup-node`, and `actions/setup-python`.

Additionally: the `doctrine-reusable.yml@main` ref in `design-system` and `meshal-web` must be replaced with the pinned `workflow_ref` SHA from `alawein/github-baseline.yaml` (`ed5ed61aef28cbdd761eeb0654808833bc4564be`).

---

## Per-repo changes

### knowledge-base

**Floating refs to fix:**
- Any `@v4` or `@v3` tags in `.github/workflows/` — replace with full SHAs
- `codeql-action` refs if present

**Files:** All workflow files under `knowledge-base/.github/workflows/`

**One commit:** `ci: pin all GitHub Actions refs to full SHAs`

---

### meshal-web

**Floating refs to fix:**
- `actions/checkout@v4` → full SHA
- `actions/setup-node@v4` → full SHA
- `github/codeql-action/*@v3` → full SHA
- `doctrine-reusable.yml@main` → `@ed5ed61aef28cbdd761eeb0654808833bc4564be`

**Additional fixes (missing from current ci.yml):**

1. **Permissions block** — add at workflow level:
```yaml
permissions:
  contents: read
```

2. **Concurrency block** — add at workflow level:
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

3. **Issue templates** — create two files:
   - `.github/ISSUE_TEMPLATE/bug-report.yml`
   - `.github/ISSUE_TEMPLATE/feature-request.yml`

   Use the alawein control plane templates as the source: `alawein/.github/ISSUE_TEMPLATE/`. Copy and adapt (change repo-specific references if any).

4. **PR template** — create `.github/PULL_REQUEST_TEMPLATE.md`. Use `alawein/.github/PULL_REQUEST_TEMPLATE.md` as source.

**One commit per concern** (3 commits total for meshal-web):
- `ci: pin all GitHub Actions refs to full SHAs`
- `ci: add permissions and concurrency blocks to workflow`
- `ci: add issue templates and PR template`

---

### alembiq

**Floating refs to fix:**
- Any `@v4`/`@v3` tags in `alembiq/.github/workflows/ci.yml` and any secondary workflows

**Verify:** The main `ci.yml` reusable workflow ref should already use the canonical SHA (`ed5ed61aef28cbdd761eeb0654808833bc4564be`). Spot-check confirmed this is correct — do not change it.

**Files:** `alembiq/.github/workflows/ci.yml` and any other workflow files with floating refs

**One commit:** `ci: pin all GitHub Actions refs to full SHAs`

---

### fallax

**Floating refs to fix:**
- `actions/checkout@v4` → full SHA (in `ci.yml` and `ci-smoke.yml`)
- `astral-sh/setup-uv@v6` → full SHA
- Any other `@v*` tags

**Files:** `fallax/.github/workflows/ci.yml`, `fallax/.github/workflows/ci-smoke.yml`

**One commit:** `ci: pin all GitHub Actions refs to full SHAs`

---

## Verification

After pinning, verify each workflow still passes by checking recent CI runs. The functional behavior of the workflows must not change — the only difference is the ref format.

For the reusable workflow consumers: confirm the pinned `workflow_ref` SHA resolves correctly by checking that the commit exists on `alawein/alawein`:

```bash
git -C alawein log --oneline ed5ed61aef28cbdd761eeb0654808833bc4564be -1
```

---

## Constraints

- Pin to the SHA of the current latest release, not a past release — do not downgrade
- Do not change any workflow logic, inputs, or steps — refs only (except meshal-web's permissions and concurrency additions, which are purely additive)
- Each repo is an independent git repo — run `git add` and `git commit` from inside the repo directory
- Do not use `git push --force` under any circumstance
