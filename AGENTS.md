---
type: normative
authority: canonical
audience: [ai-agents, contributors]
last-verified: 2026-03-23
---

# AGENTS — alawein

**Purpose:** Organization profile repository for `@alawein` portfolio truth and
governance coordination.

---

## Governance Sources

- Workspace operating contract:
  [`docs/governance/workspace-master-prompt.md`](docs/governance/workspace-master-prompt.md)
- Autonomous batch execution guide:
  [`docs/governance/parallel-batch-execution.md`](docs/governance/parallel-batch-execution.md)
- Documentation contract:
  [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md)
- Repository state:
  [`SSOT.md`](SSOT.md)
- Branch naming, workflow, and Vercel deployment:
  [`docs/governance/branch-and-deployment-convention.md`](docs/governance/branch-and-deployment-convention.md)

## Governance Boundaries

### Always do

- Keep `README.md` current with active repos, domains, and canonical naming.
- Use canonical names first and transitional alias notation when a physical repo
  slug has not yet been renamed.
- Keep `AGENTS.md`, `CLAUDE.md`, `SSOT.md`, `LESSONS.md`, and governance docs
  aligned.
- Use manifest-driven batch execution for multi-repo autonomous work.
- Keep `docs/governance/documentation-contract.md` and
  `scripts/validate-doc-contract.sh` aligned.
- Regenerate README sections from `projects.json` instead of hand-editing synced
  blocks.
- When `profile-from-guides.yaml` is present, run `sync-readme.py` to update the
  README About block; profile/positioning copy is sourced from guides (see
  [profile-sync-from-guides](docs/governance/profile-sync-from-guides.md)).
- For profile sync, README About block updates, _pkos rename/location, or
  meshal-web/LinkedIn export: **read and follow**
  [cursor-agent-handoff-profile-sync](docs/governance/cursor-agent-handoff-profile-sync.md);
  it is the single handoff for revision and enhancements.
- Before ending a task that changes files: **commit, push** (and PR/merge per
  policy), then confirm **`git status` is clean**—see
  [ide-llm-agent-completion-lessons-2026-03](docs/audits/ide-llm-agent-completion-lessons-2026-03.md).

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
  `devkit`, `_ops/gmail-ops`).
- During phased migration, if canonical name differs from physical repo slug,
  use this format in docs: `canonical-name (repo: physical-slug)`.
- Physical links stay pointed at the actual GitHub repo slug until cutover.
- Hard-cutover status (2026-03-11): `gymboy`, `meatheadphysicist`,
  `atelier-rounaq`, and `edfp` now use canonical physical slugs.

## Design & branding plan (agent-executable)

- **Summary:** [docs/governance/design-branding-summary.md](docs/governance/design-branding-summary.md)
- **Remaining steps per repo:** [docs/governance/remaining-steps-per-repo.md](docs/governance/remaining-steps-per-repo.md)
- **Handoff (push, PR, deploy):** [docs/HANDOFF-DESIGN-BRANDING.md](docs/HANDOFF-DESIGN-BRANDING.md)

## Audits

- Full environment audit (credentials, config, IDE/LLM):
  [docs/audits/full-environment-audit-2026-03-16.md](docs/audits/full-environment-audit-2026-03-16.md)
- Remediation checklist (step-by-step): [docs/audits/remediation-checklist-2026-03-16.md](docs/audits/remediation-checklist-2026-03-16.md)
- Credential hygiene (no secrets in repo; MCP env vars; CI secrets):
  [docs/governance/credential-hygiene.md](docs/governance/credential-hygiene.md)

## Quick Reference

| Task | Command |
|------|---------|
| Sync README from data | `python scripts/sync-readme.py` |
| Verify README sync | `python scripts/sync-readme.py --check` |
| Governance check | `./scripts/validate-doc-contract.sh --full` |

Profile/About section can be updated from _pkos via `profile-from-guides.yaml`;
see [profile-sync-from-guides](docs/governance/profile-sync-from-guides.md).
For a full revision and syncing plan for agents, see [cursor-agent-handoff-profile-sync](docs/governance/cursor-agent-handoff-profile-sync.md). Branch/workflow/deploy: [branch-and-deployment-convention](docs/governance/branch-and-deployment-convention.md).

---

_See [CLAUDE.md](CLAUDE.md) | [SSOT.md](SSOT.md) | [docs/governance/workspace-master-prompt.md](docs/governance/workspace-master-prompt.md)_
