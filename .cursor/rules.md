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

## Quality gates (run before committing)

- `python scripts/catalog/sync-readme.py --check`
- `./scripts/doctrine/validate-doc-contract.sh --full`

## Do not

- Commit unverified changes or secrets
- Scope creep (refuse unrelated multi-file edits for tiny asks)
- Assume file existence; verify paths against the tree first
