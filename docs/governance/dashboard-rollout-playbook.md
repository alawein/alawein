---
type: canonical
source: none
sync: none
sla: none
title: Dashboard Rollout Playbook
description: Operational procedure for token setup, dirty-file remediation, backup, rollback, and dashboard promotion.
last_updated: 2026-03-14
category: governance
audience: [maintainers, contributors]
status: active
author: alawein maintainers
version: 1.0.0
tags: [dashboard, rollout, remediation, backup, rollback]
---

# Dashboard Rollout Playbook

## 1) Token Setup

Use the token helper to configure the dashboard secret and session environment:

```powershell
Set-Location C:\Users\mesha\Desktop\GitHub\github.com\alawein\alawein
.\scripts\set-dashboard-token.ps1 -Repository alawein/alawein -SetRepoSecret -SetUserEnvironment
```

This sets:

- repository secret `DASHBOARD_GITHUB_TOKEN` via GitHub CLI
- current session `DASHBOARD_GITHUB_TOKEN`
- optional user-level environment variable
- compatibility session variable `GITHUB_DASHBOARD_TOKEN`

## 2) Standard Rollout Sequence

From repo root:

```powershell
python scripts\dashboard-rollout.py snapshot --label pre-rollout
python scripts\dashboard-rollout.py audit --strict
python scripts\dashboard-rollout.py validate --skip-generator-check
python scripts\build-github-dashboard.py --owners alawein --output docs/dashboard --retention 180
```

Optional drift check (live token):

```powershell
python scripts\build-github-dashboard.py --owners alawein --output docs/dashboard --retention 180 --check
```

## 3) Dirty File Remediation

If strict audit fails:

```powershell
python scripts\dashboard-rollout.py remediate
```

Then either:

- stash out-of-scope paths using the generated `git stash push ...` command, or
- restore out-of-scope tracked files, then rerun strict audit

## 4) Backup and Rollback

Snapshots are written to `.tools/dashboard-rollout/<timestamp>-<label>/` and
include:

- porcelain status
- tracked diff patch
- staged diff patch
- untracked file list
- metadata (`branch`, `head`, capture time)

Rollback planning:

```powershell
python scripts\dashboard-rollout.py rollback --snapshot <snapshot_dir>
```

Rollback execution:

```powershell
python scripts\dashboard-rollout.py rollback --snapshot <snapshot_dir> --execute
```

## 5) CI and Scheduled Sync

Automated snapshot sync runs in `.github/workflows/github-dashboard-sync.yml`
and only commits `docs/dashboard/**`.

Secret requirement:

- `DASHBOARD_GITHUB_TOKEN` must exist in repository secrets
