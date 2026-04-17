---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [ai-agents, contributors]
last_updated: 2026-04-15
last-verified: 2026-04-15
---

# AGENTS — alawein

## Workspace identity

This repo is the control plane for the `alawein` workspace. It owns shared
governance, README/profile generation, style rules, prompt kits, and managed
rollout scripts for the sibling repos.

## Governance sources

- `docs/governance/workspace-master-prompt.md`
- `docs/governance/parallel-batch-execution.md`
- `docs/governance/documentation-contract.md`
- `docs/style/VOICE.md`
- `prompt-kits/AGENT.md`
- `prompt-kits/PORTFOLIO.md`
- `SSOT.md`

## Governance rules

1. Keep `README.md` aligned with the current portfolio and canonical repo
   metadata.
2. Keep `catalog/repos.json` as the authored metadata source and
   `projects.json` as derived output.
3. Keep README entrypoints frontmatter-free and path-validated.
4. Treat `VOICE.md` and `prompt-kits/` as the canonical style authority.
5. Fix generators and validators instead of patching synced output by hand.
6. Use manifest-driven batch execution for multi-repo rollout work.
7. Do not store secrets, build artifacts, or incidental local files in this
   repo.
8. Do not use destructive git operations to force consistency.

## Ask first

- Before changing governance template structure across the repo fleet
- Before changing canonical naming policy
- Before adding new automation that rewrites managed docs or repo surfaces

## Quick reference

| Task | Command |
|------|---------|
| Sync README | `python scripts/sync-readme.py` |
| Check README drift | `python scripts/sync-readme.py --check` |
| Check live profile drift | `python scripts/verify-profile-pins.py --check` |
| Check style-rule drift | `python scripts/build-style-rules.py --check` |
| Validate governed style surfaces | `python scripts/validate.py --ci` |
| Run advisory style audit | `python scripts/style-advisory-audit.py --repo-root .` |
| Run governance validation | `./scripts/validate-doc-contract.sh --full` |

## Notes

- `profile-from-guides.yaml` is the public-profile declaration surface.
- Cursor rules under `.cursor/rules/` are committed governance text in this
  repo and should be treated like other maintained instruction surfaces.
- For profile-sync or README About-block work, follow the dedicated governance
  runbooks instead of inventing ad hoc flows.
