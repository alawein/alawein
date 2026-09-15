---
type: evidence
status: active
source: alawein audit cleanup 2026-09-15
last_updated: 2026-09-15
owner: meshal
---
# F002 Code-scanning dismiss (stale monorepo paths) — 2026-09-15

**Repo:** `alawein/alawein`  
**Branch context:** `fix/audit-cleanup-2026-09-15`  
**API:** `PATCH repos/alawein/alawein/code-scanning/alerts/{number}`

## Policy

Dismiss open alerts whose `most_recent_instance.location.path` starts with:

- `platforms/`
- `organizations/`
- `packages/`

Do **not** dismiss alerts under current-tree prefixes:

- `scripts/`, `tools/`, `catalog/`, `config/`, `schemas/`, `tests/`, `.github/`, `docs/`

**Dismiss payload (all):**

```json
{
  "state": "dismissed",
  "dismissed_reason": "won't fix",
  "dismissed_comment": "Stale: finding targets paths removed from main (pre-consolidation monorepo history). Current tree clean of those lockfiles. See audit F002 2026-09-15."
}
```

## Method

1. Paginate `GET .../code-scanning/alerts?state=open&per_page=100`
2. Filter by path prefix
3. PATCH in parallel batches of 10, with short sleeps and retry awareness

## Counts (this session)

| Metric | Count | Notes |
|--------|------:|-------|
| Open at dismiss start | 1541 | After concurrent churn from prior classify (1582) |
| Targeted (stale prefixes) | 1416 | platforms 1200 + organizations 213 + packages 3 |
| PATCH ok | 1408 | Batch run |
| Extra PATCH ok | 1 | Alert `#120` leftover `organizations/...` after post-check |
| **Dismissed total** | **1409** | 1408 + 1 |
| Errors | 8 | HTTP 400 "Alert is already dismissed" (race; end state dismissed) |
| Skipped (current-tree keep) | 53 | Intentionally left open |
| Other prefixes (not in scope) | 72 at start | `research/`, `templates/`, `src/`, `.metaHub/` |

## Post-verify (after dismiss)

| Metric | Count |
|--------|------:|
| Remaining open | 51 |
| Remaining stale prefixes (`platforms/` / `organizations/` / `packages/`) | **0** |
| Remaining current-tree keep prefixes | 42 |
| Remaining other prefixes | 9 |

### Sample remaining current-tree paths (not dismissed)

| number | path |
|-------:|------|
| 1591 | scripts/testing/test-performance.js |
| 1590 | scripts/testing/test-integration.js |
| 1589 | scripts/testing/test-deployment-wrapper.js |
| 310 | docs/src/projects/pages/talai/TalAIDashboard.tsx |
| 309 | docs/src/projects/pages/optilibria/OptiLibriaDashboard.tsx |
| 308 | docs/src/projects/pages/qmlab/QMLabDashboard.tsx |
| 307 | docs/src/projects/pages/mezan/MEZANDashboard.tsx |
| 306 | docs/src/projects/pages/ProjectsHub.tsx |
| 220 | scripts/testing/test-performance.js |
| 216 | tools/cli/devops.ts |

Open total fell faster than dismiss-only math (1541 − 1409 ≈ 132 expected vs 51 observed). Likely concurrent auto-close / other dismissals; no secrets inspected or recorded.

## F003 Actions snapshot (verify after parent may have changed settings)

**Before (declared for F003):**

| Setting | Value |
|---------|-------|
| allowed_actions | all |
| sha_pinning_required | false |
| default_workflow_permissions | read |
| can_approve_pull_request_reviews | true |

**After (verified this session via `gh api`):**

| Setting | Value |
|---------|-------|
| enabled | true |
| allowed_actions | selected |
| sha_pinning_required | true |
| default_workflow_permissions | read |
| can_approve_pull_request_reviews | true |
| selected patterns | `actions/*`, `github/*`, `aquasecurity/*`, `gitleaks/*`, `trufflesecurity/*`, `hashicorp/*` + github_owned + verified |

Canonical F003 write-up: `docs/superpowers/plans/2026-09-15-audit-f003-actions.md`
