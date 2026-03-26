---
type: guide
authority: canonical
last-verified: 2026-03-27
last_updated: 2026-03-27
audience: [ai-agents, contributors]
---

<!-- CUSTOM OVERRIDE: entire file — org-level governance hub with portfolio truth, workspace contract, naming policy, and cross-repo coordination. Not a standard project template. [Task 1.4 audit 2026-03-22] -->

# CLAUDE.md — alawein

> Repository profile + governance templates

---

## Overview

This repository is the org-level docs and governance control plane for the
`alawein` GitHub organization.

It owns:

- portfolio truth (`README.md` + `projects.json`)
- workspace governance rules
- documentation contract and validation scripts

**Repository Type**: Organization Profile  
**Primary Language**: N/A (documentation and policies)  
**Build System**: N/A (static organizational content)

---

## Governance Sources

- Workspace operating contract:
  [`docs/governance/workspace-master-prompt.md`](docs/governance/workspace-master-prompt.md)
- Documentation contract:
  [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md)
- Repo boundaries:
  [`AGENTS.md`](AGENTS.md)
- Current state:
  [`SSOT.md`](SSOT.md)
- Design/branding plan summary and remaining steps:
  [`docs/governance/design-branding-summary.md`](docs/governance/design-branding-summary.md),
  [`docs/governance/remaining-steps-per-repo.md`](docs/governance/remaining-steps-per-repo.md),
  [`docs/HANDOFF-DESIGN-BRANDING.md`](docs/HANDOFF-DESIGN-BRANDING.md)
- Slash commands catalog and workflows (any repo/dir):
  [`docs/governance/slash-commands-catalog.md`](docs/governance/slash-commands-catalog.md)
- Skills, agents & commands unification (universal vs ecosystem vs org):
  [`docs/governance/skills-agents-unification.md`](docs/governance/skills-agents-unification.md)
- Skills/agents maintenance and tailoring runbook:
  [`docs/governance/maintenance-skills-agents.md`](docs/governance/maintenance-skills-agents.md)
- **Global skills install** (IDEs, collision rules, MCP vs skills):
  [`docs/governance/skills-install-policy.md`](docs/governance/skills-install-policy.md)
- **Claude Code** (product repos with `.claude/` — layout, rules, skills, agents):
  [`docs/governance/claude-code-configuration-guide.md`](docs/governance/claude-code-configuration-guide.md);
  copy-paste **worked examples** (CLAUDE.md, rules, skills, hooks):
  [`docs/governance/claude-code-worked-examples.md`](docs/governance/claude-code-worked-examples.md);
  audit/migration **prompts**:
  [`docs/governance/claude-code-migration-prompts.md`](docs/governance/claude-code-migration-prompts.md)
- **Cursor (this org hub):** shared IDE rules live under [`.cursor/rules/`](.cursor/rules/) (e.g. `alawein-governance.mdc`, `claude-code-governance.mdc`); other `.cursor/**` paths stay gitignored.
- Operator quick commands:
  [`docs/governance/operator-command-cheatsheet.md`](docs/governance/operator-command-cheatsheet.md)
- Universal **repo sweep** prompt (any workspace repo):
  [`docs/governance/repo-sweep-prompt.md`](docs/governance/repo-sweep-prompt.md)
- Audits (environment, codebase, skills):
  [`docs/audits/full-environment-audit-2026-03-16.md`](docs/audits/full-environment-audit-2026-03-16.md);
  remediation: [`docs/audits/remediation-checklist-2026-03-16.md`](docs/audits/remediation-checklist-2026-03-16.md);
  skills unification (complete): [`docs/audits/skills-unification-workstream-completion-2026-03-17.md`](docs/audits/skills-unification-workstream-completion-2026-03-17.md);
  machine audit: [`docs/audits/machine-audit-mesha-2026-03-17.md`](docs/audits/machine-audit-mesha-2026-03-17.md)
- Credential hygiene (secrets, MCP, CI):
  [`docs/governance/credential-hygiene.md`](docs/governance/credential-hygiene.md)
- Profile sync from _pkos (README About / positioning):
  [`docs/governance/profile-sync-from-guides.md`](docs/governance/profile-sync-from-guides.md)
- Profile sync and PKOS alignment (single handoff for agents):
  [`docs/governance/cursor-agent-handoff-profile-sync.md`](docs/governance/cursor-agent-handoff-profile-sync.md)
- Branch naming, workflow, and Vercel deployment (single convention):
  [`docs/governance/branch-and-deployment-convention.md`](docs/governance/branch-and-deployment-convention.md)

## Required Files

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `SSOT.md`
- `LESSONS.md`
- `CODE_OF_CONDUCT.md`
- `LICENSE`
- `SECURITY.md`
- `CHANGELOG.md`
- `docs/governance/documentation-contract.md`
- `docs/governance/workspace-master-prompt.md`
- `scripts/validate-doc-contract.sh`

---

## Naming and Migration Rules

- Use canonical names in docs and inventory tables.
- When canonical name and physical repo slug differ, use:
  `canonical-name (repo: physical-slug)`.
- Keep links pointed at physical slugs until cutover.
- Hard-cutover status (2026-03-11): `gymboy`, `meatheadphysicist`,
  `atelier-rounaq`, and `edfp` now use canonical physical slugs.
- Regenerate README sync blocks from `projects.json` with
  `scripts/sync-readme.py`. When `profile-from-guides.yaml` exists (from _pkos
  export), the same script updates the README About block; see
  [profile-sync-from-guides](docs/governance/profile-sync-from-guides.md).
- For profile sync or PKOS alignment work, read and follow
  [cursor-agent-handoff-profile-sync](docs/governance/cursor-agent-handoff-profile-sync.md).
- End file-changing work with **commit, push**, merge per policy, and clean
  `git status` — [ide-llm-agent-completion-lessons-2026-03](docs/audits/ide-llm-agent-completion-lessons-2026-03.md).

---

## Repository Structure

```text
alawein/
  docs/
    README.md
    audits/
      full-environment-audit-YYYY-MM-DD.md
      remediation-checklist-YYYY-MM-DD.md
      codebase-audit-*.md
    governance/
      workspace-master-prompt.md
      documentation-contract.md
      credential-hygiene.md
      operating-model.md
      workflow.md
      git-operations.md
      feature-lifecycle.md
      review-playbook.md
      merge-policy.md
      release-playbook.md
      clean-slate-workflow.md
      changelog-entry.md
      workspace-standardization.md
      workspace-rename-matrix.md
      workspace-layout-audit.md
      workspace-resource-map.md
  .github/
    ISSUE_TEMPLATE/
    workflows/
    CODEOWNERS
    pull_request_template.md
  scripts/
    validate-doc-contract.sh
    sync-readme.py
    sync-to-notion.mjs
  projects.json
```

---

## Development Workflow

1. Read [`AGENTS.md`](AGENTS.md) and [`SSOT.md`](SSOT.md).
2. Read
   [`docs/governance/workspace-master-prompt.md`](docs/governance/workspace-master-prompt.md).
3. Read
   [`docs/governance/documentation-contract.md`](docs/governance/documentation-contract.md).
4. Run `python scripts/sync-readme.py --check`.
5. Run `./scripts/validate-doc-contract.sh --full`.

---

## Quality Gates

Before proposing changes:

- `python scripts/sync-readme.py --check`
- `./scripts/validate-doc-contract.sh --full`
- markdown lint/link checks for managed docs (same commands as CI workflows)

---

## Governance

See [AGENTS.md](AGENTS.md) for boundaries and [SSOT.md](SSOT.md) for current
state.
