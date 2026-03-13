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

1. **Branch:** `git checkout -b feature/branding-and-standardization` (or `feature/<repo>-design-integration`).
2. **Stage:** `git add .`
3. **Commit:** `git commit -m "feat(<scope>): implement design system and branding integration"`
4. **Push:** `git push origin feature/branding-and-standardization`
5. **PR:** Open pull request to `main` (or `develop`); request review.
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

## Success criteria

- All changes committed and pushed on a feature branch; PR opened and merged.
- No uncommitted design/branding or refactor changes.
- Vercel builds complete without errors for repos that use Vercel.
