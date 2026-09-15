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

## Before

| Setting | Value |
|---------|-------|
| enabled | true |
| allowed_actions | all |
| sha_pinning_required | false |
| default_workflow_permissions | read |
| can_approve_pull_request_reviews | true |

## After (applied this session)

| Setting | Value |
|---------|-------|
| enabled | true |
| allowed_actions | selected |
| sha_pinning_required | true |
| default_workflow_permissions | read |
| can_approve_pull_request_reviews | true (exception for Sync Catalog / docs-auto-gen / sync-vercel) |
| selected patterns | `actions/*`, `github/*`, `aquasecurity/*`, `gitleaks/*`, `trufflesecurity/*`, `hashicorp/*` + github_owned + verified |

## Notes

- Required workflow green check deferred to PR CI on `fix/audit-cleanup-2026-09-15`.
- If a required third-party action is blocked, extend `patterns_allowed` with the exact owner org, not `*`.
