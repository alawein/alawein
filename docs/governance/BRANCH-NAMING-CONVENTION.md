---
title: 'Branch Naming Convention'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Branch Naming Convention

This document defines the branch naming conventions for the Alawein monorepo.

## Branch Types

### Protected Branches (Never Deleted)

| Branch       | Purpose                                   |
| ------------ | ----------------------------------------- |
| `main`       | Production-ready code, always deployable  |
| `develop`    | Integration branch for features (if used) |
| `staging`    | Pre-production testing environment        |
| `production` | Mirror of what's deployed to production   |

### Feature Branches

**Format:** `feat/<short-description>`

Use lowercase, hyphen-separated words.

**Examples:**

- `feat/portfolio-fixes`
- `feat/quantum-visualization`
- `feat/payment-integration`
- `feat/50-phase-completion`

### Hotfix Branches

**Format:** `hotfix/<issue-description>`

For urgent fixes that need to go directly to production.

**Examples:**

- `hotfix/security-vulnerability`
- `hotfix/login-crash`
- `hotfix/payment-timeout`

### Release Branches

**Format:** `release/v<major>.<minor>.<patch>`

For preparing releases with version numbers.

**Examples:**

- `release/v1.0.0`
- `release/v2.1.0`
- `release/v1.2.3`

### Dependabot Branches

**Format:** `dependabot/<package-manager>/<dependency-name>`

Automatically created by Dependabot. Do not rename.

**Examples:**

- `dependabot/npm_and_yarn/vite-5.4.22`
- `dependabot/pip/numpy-1.26.0`
- `dependabot/github_actions/actions/checkout-4`

### Experiment/Personal Branches

**Format:** `exp/<username>/<description>` or `user/<username>/<description>`

For experimental work that may not be merged.

**Examples:**

- `exp/meshal/new-algorithm`
- `user/meshal/prototype-viz`

## Automated Cleanup Rules

### Merged Branch Deletion

- All branches are automatically deleted after PR merge
- Exception: Protected branches (main, develop, staging, production)

### Stale Branch Cleanup

- Branches with no commits in 60+ days are deleted weekly
- Exception: Protected branches
- Runs every Sunday at 3 AM UTC

### Dependabot PR Management

- Uses `rebase-strategy: auto` to keep PRs up-to-date
- Newer updates automatically supersede older ones
- Grouped updates reduce PR noise

## Best Practices

1. **Keep branches short-lived** - Merge within 1-2 weeks
2. **Use descriptive names** - Anyone should understand the purpose
3. **Delete after merge** - Don't accumulate stale branches
4. **Prefix consistently** - Always use the correct prefix
5. **No spaces or special chars** - Use hyphens for separation

## Workflow Example

```bash
# Create a feature branch
git checkout -b feat/add-user-dashboard

# Work on the feature
git add .
git commit -m "feat: Add user dashboard component"

# Push and create PR
git push -u origin feat/add-user-dashboard
gh pr create --title "feat: Add user dashboard" --base main

# After merge, branch is automatically deleted
```

## Configuration Files

- **Branch cleanup workflow:** `.github/workflows/branch-cleanup.yml`
- **Dependabot config:** `.github/dependabot.yml`
- **Auto-merge workflow:** `.github/workflows/auto-merge-dependabot.yml`
