---
type: audit
last_updated: 2026-07-25
---

# GitHub repo keep roster (2026-07-25)

## Decision

Keep only active fleet repos. Archive dead / duplicate / experiment repos on
GitHub (reversible; no deletes). Catalog and weekly workspace audit matrix
follow this roster.

## Keep (40 + `.archive`)

`.archive`, `alawein`, `adil`, `alembiq`, `atelier-rounaq`, `attributa`,
`auditraise`, `bolts`, `chshlab`, `design-system`, `edfp`, `fallax`, `gymboy`,
`handshake`, `incore`, `knowledge-base`, `llmworks`, `loopholelab`, `maglogic`,
`meatheadphysicist`, `mercor`, `meshal-web`, `optiqap`, `outpost`, `prompty`,
`provegate`, `qmatsim`, `qmlab`, `quantumalgo`, `qubeml`, `repz`,
`roka-oakland-hustle`, `scicomp`, `scribd`, `simcore`, `spincirc`, `turing`,
`veyra`, `workspace-control`, `workspace-tools`.

Overrides vs the initial “keep-tagged only” paste:

- Kept catalog-active infra/product: `design-system`, `knowledge-base`,
  `workspace-tools`, `meatheadphysicist`, `roka-oakland-hustle`
- Kept recently active control plane: `workspace-control`
- Cataloged keepers that were missing entries: `outpost`, `auditraise`,
  `workspace-control`

## Archived on GitHub (13)

`AGI`, `agi-lab`, `AI-Conversations`, `apps`, `argus`, `dotclaude`,
`guides_system`, `helios`, `ledger-voice-demo`, `lightcone-trace-eval`,
`qahwah-time`, `trace_eval`, `trace-eval`.

`helios` was already `type=archive` in catalog; GitHub archive now matches.

## Cursor indexing note

If Cursor GitHub “Repositories” still lists archived remotes as enabled, disable
them there so agents only index the keep roster. GitHub archive and Cursor
enable/disable are separate controls.
