---
title: Handoff — Design & Branding Plan Completion
description: Context and automation for next session or agent to push, PR, merge, and deploy.
last_updated: 2026-03-12
---

# Handoff: Design & Branding Plan

## Project context

- **Goal:** Complete the design/branding agent-executable plan across alawein workspace repos.
- **Current state:** Phase 1–4 and **local** Phase 5 (branch + commit) are done for 12 repos. All work is on branch `feature/branding-and-standardization` in each; **nothing has been pushed or PR’d**.
- **Authority:** [DESIGN-BRANDING-SUMMARY.md](governance/DESIGN-BRANDING-SUMMARY.md), [remaining-steps-per-repo.md](governance/remaining-steps-per-repo.md), [bulk-execution-progress.md](governance/bulk-execution-progress.md).

## What was done

- Phase 1 analysis docs (alawein, devkit, repz, frontends).
- README/design sections and links to devkit/repz branding in most repos.
- Format (Prettier/ruff) and lint run; meshal-web Navigation lint fix.
- Tests run; results and known failures documented.
- Branch `feature/branding-and-standardization` created and committed in: **alawein, event-discovery-framework, meshal-web, repz, devkit, bolts, gainboy, attributa, rounaq-atelier, qmlab, scribd, shared-utils.**

## Key locations

| What | Where |
|------|--------|
| One-page summary | `docs/governance/DESIGN-BRANDING-SUMMARY.md` |
| Step-by-step per repo | `docs/governance/remaining-steps-per-repo.md` |
| Progress log & status | `docs/governance/bulk-execution-progress.md` |
| Phase 5 + Vercel table | `docs/governance/phase5-version-control-and-deployment.md` |
| Design authority | `repz/branding/`, `devkit/tokens/` |

## Next steps (in order)

1. **Push** each repo’s feature branch to `origin`.
2. **Open a PR** to `main` (or `develop`) per repo.
3. **Merge** after review.
4. **Pull main** in each repo.
5. **Deploy** to Vercel for repos with `vercel.json` (see phase5 table).

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

- **README sync check:** `python scripts/sync-readme.py --check` (requires `README-backup-20250807.md`).
- **Doc contract validation:** `./scripts/validate-doc-contract.sh --full` (bash; use Git Bash or WSL on Windows).

## Success criteria

- All 12 repos: feature branch pushed, PR opened and merged, main pulled.
- Vercel deployments green for: devkit, repz, meshal-web, llmworks, attributa, simcore, qmlab, bolts, gainboy, rounaq-atelier, event-discovery-framework (and any other with `vercel.json`).
