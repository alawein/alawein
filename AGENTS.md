---
type: normative
authority: canonical
audience: [ai-agents, contributors]
last-verified: 2026-03-11
---

# AGENTS — alawein

**Purpose:** Organization profile repository for `@alawein` portfolio truth and
governance coordination.

---

## Governance Sources

- Workspace operating contract:
  [`docs/governance/workspace-master-prompt.md`](docs/governance/workspace-master-prompt.md)
- Documentation contract:
  [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md)
- Repository state:
  [`SSOT.md`](SSOT.md)

## Governance Boundaries

### Always do

- Keep `README-backup-20250807.md` current with active repos, domains, and canonical naming.
- Use canonical names first and transitional alias notation when a physical repo
  slug has not yet been renamed.
- Keep `AGENTS.md`, `CLAUDE.md`, `SSOT.md`, `LESSONS.md`, and governance docs
  aligned.
- Keep `docs/governance/documentation-contract.md` and
  `scripts/validate-doc-contract.sh` aligned.
- Regenerate README sections from `projects.json` instead of hand-editing synced
  blocks.

### Ask first

- Before changing governance template structure (affects all repos).
- Before changing canonical naming policy or transitional alias semantics.
- Before adding new automation that rewrites managed docs.

### Never do

- Store secrets or credentials.
- Add build artifacts or non-documentation files.
- Perform destructive git operations to force consistency.

## Canonical Naming Policy

- Canonical names are workspace authority (`gymboy`, `meatheadphysicist`,
  `devkit`, `_gmail-ops`).
- During phased migration, if canonical name differs from physical repo slug,
  use this format in docs: `canonical-name (repo: physical-slug)`.
- Physical links stay pointed at the actual GitHub repo slug until cutover.
- Hard-cutover status (2026-03-11): `gymboy`, `meatheadphysicist`,
  `atelier-rounaq`, and `edfp` now use canonical physical slugs.

## Design & branding plan (agent-executable)

- **Summary:** [docs/governance/design-branding-summary.md](docs/governance/design-branding-summary.md)
- **Remaining steps per repo:** [docs/governance/remaining-steps-per-repo.md](docs/governance/remaining-steps-per-repo.md)
- **Handoff (push, PR, deploy):** [docs/HANDOFF-DESIGN-BRANDING.md](docs/HANDOFF-DESIGN-BRANDING.md)

## Quick Reference

| Task | Command |
|------|---------|
| Sync README from data | `python scripts/sync-readme.py` |
| Verify README sync | `python scripts/sync-readme.py --check` |
| Governance check | `./scripts/validate-doc-contract.sh --full` |

---

_See [CLAUDE.md](CLAUDE.md) | [SSOT.md](SSOT.md) | [docs/governance/workspace-master-prompt.md](docs/governance/workspace-master-prompt.md)_
