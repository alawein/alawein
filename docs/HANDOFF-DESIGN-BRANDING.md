---
type: frozen
source: none
sync: none
sla: none
title: Handoff — Design & Branding Plan Completion
description: Context and automation for next session or agent to push, PR, merge, and deploy.
last_updated: 2026-03-14
---

# Handoff: Design & Branding Plan

## Project context

- **Goal:** Complete the design/branding agent-executable plan across alawein workspace repos.
- **Current state:** Phase 1–5 and Vercel deploy done for **11 of 12** Vercel repos. simcore PR #6 merged; repz and meshal-web fixes pushed and deployed. **Attributa:** add **GH_TOKEN** in Vercel (Settings → Environment Variables), then redeploy; see attributa README "Deployment (Vercel)" and `scripts/vercel-install.sh`.
- **Authority:** [design-branding-summary.md](governance/design-branding-summary.md), [remaining-steps-per-repo.md](governance/remaining-steps-per-repo.md), [bulk-execution-progress.md](governance/bulk-execution-progress.md).

## What was done

- Phase 1 analysis docs (alawein, devkit, repz, frontends).
- README/design sections and links to devkit/repz branding in most repos.
- Format (Prettier/ruff) and lint run; meshal-web Navigation lint fix.
- Tests run; results and known failures documented.
- Branch + commit + push in 13 repos; simcore PR #6 merged. **Vercel deploy — OK (11/12):** simcore, devkit, llmworks, qmlab, bolts, gainboy, rounaq-atelier, event-discovery-framework, repz, meshal-web. **Attributa:** install script and README added; add GH_TOKEN in Vercel to complete.

## Key locations

| What | Where |
|------|--------|
| One-page summary | `docs/governance/design-branding-summary.md` |
| Step-by-step per repo | `docs/governance/remaining-steps-per-repo.md` |
| Progress log & status | `docs/governance/bulk-execution-progress.md` |
| Phase 5 + Vercel table | `docs/governance/phase5-version-control-and-deployment.md` |
| Design authority | `repz/branding/`, `devkit/tokens/` |

## Next steps (in order)

1. **Attributa only:** In Vercel project → Settings → Environment Variables, add **GH_TOKEN** (GitHub PAT with `repo` scope). Redeploy.
2. **(Optional)** Phase 2 deep work and optional fixes per [remaining-steps-per-repo.md](governance/remaining-steps-per-repo.md).

## Automation & one-liners

### Push all 12 repos (from workspace root)

Use your actual parent path for repos (e.g. `../alawein` or `github.com/alawein`). Example (PowerShell, one repo):

```powershell
$repos = @("alawein","event-discovery-framework","meshal-web","repz","devkit","bolts","gainboy","attributa","rounaq-atelier","qmlab","scribd","shared-utils")
foreach ($r in $repos) {
  Set-Location "path/to/$r"
  git push origin feature/branding-and-standardization
}
```

### Open PR with GitHub CLI (`gh`)

After push, from each repo directory:

```bash
gh pr create --base main --head feature/branding-and-standardization \
  --title "feat: design system and branding integration (Phase 3-5)" \
  --body "Design and branding plan: Phase 3 format/lint, Phase 4 tests, Phase 5 branch. See alawein/docs/governance/bulk-execution-progress.md and remaining-steps-per-repo.md."
```

### Vercel deploy (after merge)

From each repo with `vercel.json`, after merging to main:

```bash
git checkout main && git pull origin main
vercel deploy --prod
```

Or rely on Vercel’s GitHub integration (auto-deploy on push to main).

## Scripts & validation (alawein repo)

- **README sync check:** `python scripts/sync-readme.py --check` (requires `README.md`).
- **Doc contract validation:** `./scripts/validate-doc-contract.sh --full` (bash; use Git Bash or WSL on Windows).

## Success criteria

- **Done:** Feature branches pushed/merged where applicable; simcore PR #6 merged; 11/12 Vercel deploys green (simcore, devkit, repz, meshal-web, llmworks, qmlab, bolts, gainboy, rounaq-atelier, event-discovery-framework).
- **Remaining:** Add GH_TOKEN in Vercel for attributa and redeploy to get 12/12 green.
