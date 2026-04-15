---
type: canonical
source: none
sync: none
sla: none
title: GitHub Metadata Rollout Policy
description: Rollout states and merge expectations for catalog-driven GitHub metadata sync.
category: governance
audience: [maintainers, contributors]
status: active
author: alawein maintainers
version: 1.0.0
last_updated: 2026-04-14
tags: [github, metadata, rollout, policy, governance]
---

# GitHub Metadata Rollout Policy

This policy defines how catalog-driven GitHub metadata sync is promoted from
advisory validation to controlled rollout.

## Rollout States

### Advisory

Use advisory mode when:

- validating catalog changes on push or pull request
- checking target payloads before any live write
- confirming idempotence after a previous apply

Rules:

- advisory runs may target the full catalog
- advisory runs must publish the sync-plan artifact
- advisory runs never mutate GitHub repository metadata

### Canary

Use canary mode to prove live-write behavior on the lowest-risk target before
expanding.

Canary target:

- `design-system`

Rules:

- apply mode must be manual-dispatch only
- the canary must produce one clean apply artifact and one clean follow-up
  advisory artifact
- no cohort expansion is allowed until the canary is idempotent after apply for
  all supported endpoints

Current platform note:

- the `alawein` account is currently user-owned rather than organization-owned
- repository custom properties are therefore treated as optional and may remain
  blocked with a documented `404 Not Found` result

### Cohort-Blocking

Use cohort-blocking mode after canary success for infra and governance repos
that should stay catalog-complete.

Initial cohort:

- `workspace-tools`
- `knowledge-base`
- `alawein`

Rules:

- apply mode remains manual-dispatch only
- infra and governance repos in the active cohort must remain catalog-complete
  before merge
- product and research repos stay out of the first cohort until infra/governance
  rollout is stable

## Merge Expectations

For infra and governance repos in an active rollout cohort:

- canonical metadata must be present in `catalog/repos.json`
- derived outputs must be current
- advisory sync must stay clean
- missing or blocked custom property writes must be documented explicitly

For product and research repos:

- catalog completeness is still expected
- live metadata apply is deferred until the rollout owner promotes them into a
  later cohort

## Manual Boundaries

The following remain manual and out of scope for this automation:

- personal GitHub profile pinned repositories
- organization profile pinned repositories
- visual curation decisions on GitHub profile and org pages

The sync automation manages repository metadata only:

- description
- homepage
- topics
- custom properties when enabled and supported
