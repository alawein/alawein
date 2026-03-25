# Cursor Rules for alawein

You are working in the **alawein** organization profile repository (docs, governance, `projects.json`, README sync).

## Context

Documentation-only control plane for the `alawein` GitHub org: portfolio truth, governance templates, and validation scripts — not an application service repo.

## Key files

- Config: [CLAUDE.md](../CLAUDE.md), [AGENTS.md](../AGENTS.md), [SSOT.md](../SSOT.md)
- Documentation contract: [documentation-contract.md](../docs/governance/documentation-contract.md)
- Workspace operating contract: [workspace-master-prompt.md](../docs/governance/workspace-master-prompt.md)

## Work style

- Execute incrementally. Small, complete changes.
- Read governance docs before structural changes.
- No cross-project file access outside this repo unless the task explicitly requires it.

## Quality gates (this repo)

Before committing:

- `python scripts/sync-readme.py --check`
- `./scripts/validate-doc-contract.sh --full`

## Do not

- Commit unverified changes or secrets
- Scope creep (refuse unrelated multi-file edits for tiny asks)
- Assume file existence; verify paths against the tree first
