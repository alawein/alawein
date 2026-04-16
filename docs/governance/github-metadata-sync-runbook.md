---
type: canonical
source: none
sync: none
sla: none
title: GitHub Metadata Sync Runbook
description: Operator procedure for advisory runs, canary apply, verification, rollback, and cohort expansion of catalog-driven GitHub metadata sync.
category: governance
audience: [maintainers, contributors]
status: active
author: alawein maintainers
version: 1.1.0
last_updated: 2026-04-15
tags: [github, metadata, sync, rollout, canary, governance]
---

# GitHub Metadata Sync Runbook

Use this runbook to operate the catalog-driven GitHub metadata sync for the
`alawein` organization.

## Token Requirements

Recommended token type:

- fine-grained personal access token or GitHub App installation token

Recommended repository permissions:

- `Administration` (write) for repository description and homepage updates
- `Administration` (write) for repository topics via the repository topics
  endpoint
- `Administration` (write) for repository workflow permission settings
- `Custom properties` (write) for repository custom property values

Store the token as:

- repository or organization secret `ALAWEIN_METADATA_SYNC_TOKEN`

The workflow uses `GH_TOKEN` from that secret in apply mode. Advisory mode does
not require the secret.

## Manual Dispatch Inputs

Workflow:

- `.github/workflows/github-metadata-sync.yml`

Inputs:

- `target`
  - `canary`: sync only `design-system`
  - `cohort-1`: sync `workspace-tools`, `knowledge-base`, and `alawein`
  - `repo`: sync only the repo slug supplied in `repo`
- `repo`
  - required only when `target=repo`
- `apply`
  - `false`: advisory plan only
  - `true`: write to GitHub using `ALAWEIN_METADATA_SYNC_TOKEN`
- `include_custom_properties`
  - default `false` for the current user-owned `alawein` account
  - `true`: update custom properties as part of the run
  - `false`: skip custom property writes and only update description, homepage,
    and topics

Apply mode never supports a full-catalog fanout. Use only `canary`, `cohort-1`,
or `repo`.

## Canary Sequence

Canary repo:

- `design-system`

Sequence:

1. Run advisory mode with `target=canary` and `apply=false`.
2. Download the `github-metadata-sync-plan` artifact.
3. Confirm the plan for `design-system` matches the catalog exactly:
   - description
   - homepage
   - normalized topic list
   - repository workflow settings
   - custom property values
4. Run manual dispatch again with `target=canary` and `apply=true`.
5. Download the `github-metadata-sync-apply` artifact and confirm the apply
   report shows successful GitHub API calls.
6. Inspect `alawein/design-system` on GitHub and verify the live repository
   state matches the apply artifact.
7. Run advisory mode one more time with `target=canary` and `apply=false`.
8. Confirm the follow-up plan is clean and only differs by harmless ordering
   normalization, if any.
9. Record the result in the rollout log or release notes before expanding to
   `cohort-1`.

Observed canary result on 2026-04-14:

- `alawein/design-system` accepted description, homepage, and topic updates
- `repos/alawein/design-system/properties/values` returned `404 Not Found`
- treat custom properties as blocked for the current user-owned `alawein/*`
  repositories
- rerun the follow-up advisory check with `include_custom_properties=false`
  until the repos move under an organization that supports repository custom
  properties

## Expected Outputs

Advisory run:

- artifact `github-metadata-sync-plan`
- workflow summary with target, repo override, custom property mode, and audit
  context

Apply run:

- artifact `github-metadata-sync-apply`
- workflow summary with the same target metadata plus apply confirmation

Success criteria:

- no manual corrections needed on GitHub after apply
- follow-up advisory run is idempotent for all supported endpoints
- the artifact payload is sufficient to explain what changed

## Rollback

Rollback is manual because GitHub repository settings are mutated directly.

Rollback sources of truth:

- the pre-apply `github-metadata-sync-plan` artifact
- the previous GitHub repository state
- `catalog/generated/github-metadata.json` if a corrective catalog change is
  needed

Rollback procedure:

1. If the catalog is wrong, correct the catalog first and rebuild derived
   outputs.
2. Re-run the workflow in advisory mode and confirm the corrective target state.
3. Re-run apply mode for the same target to converge GitHub to the corrected
   catalog state.
4. If the failure is limited to custom properties, rerun with
   `include_custom_properties=false` and document custom properties as blocked.

Do not edit profile pins as part of rollback. Profile pinning remains manual and
outside this automation.

## Cohort Expansion Criteria

Only promote from canary to `cohort-1` when all of the following are true:

- canary advisory run is clean
- canary apply run completes without manual fixups
- follow-up advisory run is idempotent
- token permissions are confirmed sufficient for the target endpoints
- artifact and summary output are understandable without reopening the diff

First cohort:

- `workspace-tools`
- `knowledge-base`
- `alawein`

Keep product and research repos out of the first cohort.

## Related Commands

Local preflight:

```powershell
python scripts\build-catalog.py --check
python scripts\validate-catalog.py --strict
python scripts\sync-github-metadata.py --cohort canary
python scripts\sync-github-metadata.py --cohort cohort-1
python scripts\sync-vercel-projects.py --repo knowledge-base
```

Workspace-tools parity check:

```powershell
cd ..\workspace-tools
python -m workspace_batch.cli sync github-metadata --cohort canary
```

## Explicit Non-Goals

- GitHub profile pin automation
- organization profile pin automation
- GitHub Pages deployment for the static catalog export
- automatic apply on push
