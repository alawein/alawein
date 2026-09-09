---
type: canonical
source: none
sync: none
sla: none
---

# Cursor Rules for alawein

This repo's agent contract lives in [CLAUDE.md](../CLAUDE.md); governance
boundaries live in [AGENTS.md](../AGENTS.md). Follow those two files; this
file intentionally repeats nothing from them.

## MAIOS naming

Human brand is MAIOS. Wire IDs stay `mai.*` (example `mai.command.intake`).
UI names are Scheme A: Intake, Policy, Cleanup, Editorial. Atlas, Alfred,
and Housekeeper are historical aliases only.

This file and `.cursor/rules/*.mdc` are the repo instruction surface for
Cursor Cloud. The Windows home naming mirror
(`~/.cursor/rules/agents-md-global.mdc`, linked from `~/AGENTS.md` and
`~/.codex/AGENTS.md`) is a separate local Cursor surface. Do not treat
`~/.cursor/prompts/global-standards.md` as that mirror.

## Quality gates (run before committing)

- `python scripts/catalog/sync-readme.py --check`
- `./scripts/doctrine/validate-doc-contract.sh --full`

## Do not

- Commit unverified changes or secrets
- Scope creep (refuse unrelated multi-file edits for tiny asks)
- Assume file existence; verify paths against the tree first
