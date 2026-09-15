---
type: evidence
status: active
source: alawein audit cleanup 2026-09-15
last_updated: 2026-09-15
owner: meshal
---
# F003 Actions least-privilege — 2026-09-15

**Repo:** `alawein/alawein`  
**Evidence:** `gh api repos/alawein/alawein/actions/permissions*`

## Before (verified this session)

| Setting | Value |
|---------|-------|
| enabled | true |
| allowed_actions | all |
| sha_pinning_required | false |
| default_workflow_permissions | write |
| can_approve_pull_request_reviews | true |

## After (live API)

| Setting | Value |
|---------|-------|
| enabled | true |
| allowed_actions | selected |
| sha_pinning_required | true |
| default_workflow_permissions | read |
| can_approve_pull_request_reviews | true (exception: Sync Catalog / docs-auto-gen / sync-vercel still create PRs) |
| selected patterns | `actions/*`, `github/*`, `aquasecurity/*`, `gitleaks/*`, `trufflesecurity/*`, `hashicorp/*`, `peter-evans/*`, `anthropics/*`, `pnpm/*` + github_owned + verified |

## Notes

- Required workflow green check deferred until branch is pushed and PR checks run (no push in this agent pass).
- `can_approve_pull_request_reviews` left ON intentionally for named bot PR-create workflows.
- Cross-link: `docs/governance/github-baseline.md` §Actions least-privilege; `docs/superpowers/plans/2026-09-15-audit-f002-dismiss.md`.
- If a required third-party action is blocked, extend `patterns_allowed` with the exact owner org, not `*`.
