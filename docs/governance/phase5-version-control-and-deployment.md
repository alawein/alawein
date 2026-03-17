---
title: Phase 5 — Version Control and Deployment Readiness
description: Git operations and Vercel deployment checklist per agent-executable plan.
last_updated: 2026-03-12
category: governance
status: active
---

# Phase 5: Version Control and Deployment

Execute after Phase 4 (testing and validation) for each repository.

## Git workflow (per repo)

Canonical branch prefix is `feat/*` (see [branch-and-deployment-convention.md](branch-and-deployment-convention.md)). Legacy `feature/*` branches (e.g. `feature/branding-and-standardization`) remain valid until merged.

1. **Branch:** `git checkout -b feat/scope-outcome` (e.g. `feat/branding-integration` or `feat/docs-governance-suite`).
2. **Stage:** `git add .`
3. **Commit:** `git commit -m "feat(scope): description"`
4. **Push:** `git push -u origin feat/scope-outcome`
5. **PR:** Open pull request to `main`; request review.
6. **After merge:** `git checkout main && git pull origin main`

## Vercel deployment

Repos with `vercel.json` (deploy to Vercel when branch is merged):

| Repo | Build command | Output |
|------|----------------|--------|
| devkit | `npm run build -- --filter=@alawein/storybook` | `apps/storybook/dist` |
| repz | `npm run build` | `dist` |
| meshal-web | `npm run build` | (default Vite `dist`) |
| llmworks | `npm run build` | `dist` |
| attributa | `npm run build` | `dist` |
| simcore | `npm run build` | `dist` |
| qmlab | `npm run build` | `dist` |
| bolts | `npm run build` | (Next.js) |
| gainboy | `npm run build` | `dist` |
| rounaq-atelier | `npm run build` | `dist` |
| event-discovery-framework | (frontend) | (per vercel.json) |
| qaplibria, MeatheadPhysicist | (per vercel.json) | (per config) |

**Steps:**

- Confirm `vercel.json` in each repo has correct `buildCommand`, `outputDirectory`, `installCommand`.
- After merge to main: trigger deployment via `vercel deploy --prod` or integrated CI/CD (e.g. GitHub connection).
- Monitor deployment logs and verify production rollout.
- From the workspace meta repo, audit the production alias contract and apply missing aliases when needed:

```bash
cd alawein
python scripts/vercel_alias_audit.py
python scripts/vercel_alias_audit.py --apply
```

- The expected production preview alias is `https://[github-repo-name].vercel.app`. The audit derives that value from the GitHub repo name linked in Vercel, not from hidden local directory names such as `_devkit`.

**devkit-storybook (Vercel project):** If the dashboard shows "Connect Git Repository", in Vercel go to Project Settings → Git → Connect to GitHub → select `alawein/devkit`, set Production Branch to `main`. The repo already has `vercel.json` with `buildCommand: npm run build -- --filter=@alawein/storybook` and `outputDirectory: apps/storybook/dist`.

## Automation (GitHub CLI + Vercel)

**After pushing the branch**, from the repo directory:

```bash
gh pr create --base main --head feat/scope-outcome \
  --title "feat(scope): short description" \
  --body "Reference: alawein/docs/governance/branch-and-deployment-convention.md"
```

**After merging to main:**

```bash
git checkout main && git pull origin main
vercel deploy --prod
```

Or rely on Vercel’s Git integration for auto-deploy on push to main. Full handoff: [HANDOFF-DESIGN-BRANDING.md](../HANDOFF-DESIGN-BRANDING.md).

## Success criteria

- All changes committed and pushed on a feature branch; PR opened and merged.
- No uncommitted design/branding or refactor changes.
- Vercel builds complete without errors for repos that use Vercel.
- `python scripts/vercel_alias_audit.py` reports every local Vercel project as `compliant` or documents a real alias conflict that must be resolved in Vercel.
