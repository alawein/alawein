# Task 2 — F002 CodeQL/Trivy misconfiguration

**Repo:** `alawein/alawein` (station)  
**Branch:** `fix/audit-cleanup-2026-09-15`  
**Date:** 2026-09-15  
**Status:** DONE_WITH_CONCERNS (config fix committed locally; banner clearance needs workflow run on GitHub + optional scoped dismiss)

## Root cause (verified)

| Evidence | Finding |
|---|---|
| GitHub Actions workflow list | No `security.yml` or `unified-security.yml` (removed at `cd691bc3`, monorepo cleanup). |
| Latest successful code-scanning upload | 2025-12-11, analysis keys still reference deleted workflows (e.g. `.github/workflows/unified-security.yml:codeql-analysis`, `.github/workflows/security.yml:container-scan` for Trivy). |
| Local tree | No `platforms/`, `organizations/`, or root `packages/`; no lockfiles on current `main`. |
| `github-baseline.yaml` for `alawein` | `codeql_languages: []` — hub keeps reusable `.github/workflows/codeql.yml` (`workflow_call` only), not a station caller. |
| Open code scanning alerts | **1837** open (paginated API count); top path prefixes: `platforms/` (1410), `organizations/` (254), `packages/` (39). |

The Security tab error banner is from **missing upload workflows** after monorepo removal, while Advanced Security still holds **historic SARIF** from old paths. Trivy noise is almost entirely under removed `platforms/*` and `organizations/*` trees.

## Fix applied

Added station-scoped scanning aligned to the control-plane tree:

1. **`.github/workflows/station-security.yml`**
   - Python CodeQL on `scripts/`, `tools/`, `catalog/`, `config/`, `schemas/`, `tests/` (via config).
   - Trivy filesystem scans per directory (not repo root), avoiding monorepo-era lockfile sweep.
   - Weekly schedule + `workflow_dispatch` so uploads continue after merge.
   - SHA-pinned actions; passes `github-baseline-audit.py --local` and workflow hygiene tests.

2. **`.github/codeql/codeql-config.yml`**
   - `paths` / `paths-ignore` limit CodeQL to current control-plane code; explicitly ignore removed top-level trees.

**Not changed:** `github-baseline.yaml` still has `codeql_languages: []` for the hub entry (reusable workflow only). Fleet repos continue to use synced caller `codeql.yml` templates.

## Verification (local)

- `python scripts/github/github-baseline-audit.py --local` — pass
- `pytest scripts/tests/test_github_baseline_workflow_hygiene.py` — 3 passed

## Not done in this task (on purpose)

- **Workflow not triggered on GitHub** from this agent session (branch not pushed). After push, run **Station Security Scanning** via `workflow_dispatch` or merge to `main` and confirm Security → Code scanning shows fresh analyses under `station-security.yml`.
- **Mass alert dismiss** not executed. ~1703 alerts are safely scoped to removed prefixes below; ~134 alerts under `scripts/`, `tools/`, `src/`, etc. need human triage before dismiss.

## Scoped dismiss commands (controller — review before run)

Dismiss reason (use verbatim):

```text
Stale: finding targets paths removed from main (pre-consolidation monorepo history). Current tree clean of those lockfiles. See audit F002 2026-09-15.
```

Preview counts per prefix (read-only):

```bash
for prefix in platforms organizations packages; do
  echo -n "$prefix: "
  gh api repos/alawein/alawein/code-scanning/alerts --paginate \
    -q "[.[] | select(.state==\"open\") | select(.most_recent_instance.location.path | startswith(\"${prefix}/\"))] | length"
done
```

Dismiss one prefix at a time (example: `platforms`):

```bash
DISMISS_COMMENT='Stale: finding targets paths removed from main (pre-consolidation monorepo history). Current tree clean of those lockfiles. See audit F002 2026-09-15.'

gh api repos/alawein/alawein/code-scanning/alerts --paginate \
  -q '.[] | select(.state=="open") | select(.most_recent_instance.location.path | startswith("platforms/")) | .number' \
| while read -r n; do
  gh api --method PATCH "repos/alawein/alawein/code-scanning/alerts/${n}" \
    -f state='dismissed' \
    -f dismissed_reason="won't fix" \
    -f dismissed_comment="$DISMISS_COMMENT"
done
```

Repeat with `organizations/` and `packages/` prefixes. **Do not** use a blanket dismiss without the `startswith` filter.

PowerShell equivalent for preview only:

```powershell
foreach ($prefix in 'platforms','organizations','packages') {
  $n = gh api 'repos/alawein/alawein/code-scanning/alerts' --paginate `
    -q ".[] | select(.state==`"open`") | select(.most_recent_instance.location.path | startswith(`"$prefix/`")) | .number" |
    Measure-Object -Line
  Write-Output "${prefix}: $($n.Lines)"
}
```

## Concerns / follow-up

1. Push branch and run **Station Security Scanning**; confirm error banner clears and new `analysis_key` values appear.
2. After a clean upload, run scoped dismiss for the three removed prefixes (~1703 alerts).
3. Triage remaining open alerts on `scripts/`, `tools/`, `src/`, `templates/`, `research/` (may mix stale monorepo paths with real control-plane signal).

## Commit

**SHA:** `6bd517431b9c0901a9f9f0395e27e2a131453e26`
