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
Check the `reference_sync_github_destructive_defaults.md` memory entry for
the full policy on sync:manual repos.

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
