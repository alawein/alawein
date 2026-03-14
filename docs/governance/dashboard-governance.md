---
title: GitHub Dashboard Governance
description: Topic taxonomy and operational rules for the generated GitHub portfolio dashboard.
last_updated: 2026-03-14
category: governance
audience: [maintainers, contributors]
status: active
author: alawein maintainers
version: 1.0.0
tags: [github, dashboard, taxonomy, roadmap, operations]
---

# GitHub Dashboard Governance

## Purpose

This document defines the required repository metadata conventions that power
the static GitHub portfolio dashboard.

## Required Roadmap Topic Tags

Repositories that participate in roadmap reporting must use exactly one of:

- `roadmap-active`
- `roadmap-planned`
- `roadmap-complete`

Equivalent legacy tags are interpreted by the generator but must be migrated to
the canonical tags above.

## Category Rule

Category is derived from the first non-roadmap topic tag on a repository.

If no topics exist, category defaults to `uncategorized`.

## Attention Rule Inputs

Attention scoring uses these repository signals:

- stale activity on active repos (last push >= 90 days)
- stale release (latest release >= 180 days old)
- missing release
- missing license
- missing roadmap tag
- missing topics
- issue backlog (>= 25 open issues)
- pull request queue (>= 10 open pull requests)

## Scope and Ownership

- Dashboard snapshots are generated per owner scope.
- Owner scope is encoded in snapshot file names and payload metadata.
- Every generated artifact includes owner labels so outputs stay auditable.

## Change Management

- Any change to thresholds or tag semantics must update:
- `scripts/github_dashboard_lib.py`
- this governance document
- the unit tests under `scripts/tests/`
