---
type: canonical
status: active
last_updated: 2026-09-08
owner: meshal
audience: [contributors, agents]
authority: canonical
related:
  - ./repo-topology-canon.md
  - ./repo-framework.md
  - ./repository-layout-standard.md
  - ./repo-standardization.md
  - ./workspace-standardization.md
  - ../adr/0003-kernel-conformance-engine.md
  - ../adr/0004-kernel-renderer-and-distribution.md
  - ../adr/0005-kernel-sync-merge-policy.md
  - ../adr/0006-worktree-fanout-substrate.md
  - ../adr/0007-research-lane-evidence-gate.md
  - ../internal/plans/2026-09-08-kernel-canonicalization.md
---

# Kernel spec

Single canonical structural spec for what every repo in the fleet must carry,
which files are kernel-managed versus repo-local, and how conformance is
verified. This document supersedes the overlapping structural guidance in
[`repo-framework.md`](./repo-framework.md),
[`repository-layout-standard.md`](./repository-layout-standard.md),
[`repo-topology-canon.md`](./repo-topology-canon.md),
[`repo-standardization.md`](./repo-standardization.md), and
[`workspace-standardization.md`](./workspace-standardization.md). Those five
documents are marked superseded with a pointer to this file; none of them are
deleted, since they carry historical rationale, change logs, and
migration-era detail this spec does not repeat.

For the source decisions behind this spec, see ADR 0003 through ADR 0007 and
the implementation plan at
[`docs/internal/plans/2026-09-08-kernel-canonicalization.md`](../internal/plans/2026-09-08-kernel-canonicalization.md).

## Scope

Applies to all 46 repos under `C:\Users\mesha\Desktop\GitHub\alawein`
(`apps`, `core`, `lab`, `sites`, `work`, one loose repo, `_archive`).
`_archive/*` repos are `archived: true`, renderer-exempt, checks warn-only.

## Profiles

Every repo is assigned exactly one `profile`, recorded in `catalog/repos.json`
and validated by `schemas/repo.schema.json`. A profile is derived from the
repo's `service-metadata.yaml` `type` + `runtime` when present, falling back
to the existing catalog `surface` + `stack` fields when
`service-metadata.yaml` is absent (33/46 repos have it as of 2026-09-08; the
gap closes per-repo during that repo's Phase 6 wave, not as a separate
sweep).

The profile enum in `schemas/repo.schema.json` must cover the stacks actually
observed in `catalog/repos.json`. As of 2026-09-08 the observed surface/stack
combinations are broader than the plan's original illustrative list
(`web-app-next`, `node-lib`, `python-lib`, `python-research`, `docs-hub`,
`paper`, `archive`): the fleet also carries Vite/React SPAs, Node/Turborepo
monorepos, Python CLI and service repos, a Godot game, and PowerShell
tooling. Extending the enum to match is a canonical-naming-policy change and
requires explicit sign-off before `schemas/repo.schema.json` is edited or
`profile` is backfilled across `catalog/repos.json` (see the open item
tracked in the plan).

## Canonical tree

Each entry below is marked kernel-managed (rendered and verified by the
kernel) or repo-local (human-owned content the renderer never touches).

```
README.md                      managed header, local body
AGENTS.md                      managed sections + local sections
SECURITY.md LICENSE            managed (public repos)
CHANGELOG.md                   managed skeleton (tier-1, tier-2)
service-metadata.yaml          managed, validated by schemas/repo.schema.json
.drift-rules.yaml              managed block + local overrides
.editorconfig .gitattributes .gitignore   managed
.kernel/hooks/{pre-commit,commit-msg,pre-push}   managed, core.hooksPath target
.kernel-manifest.json          managed, lists managed paths + sha256 + kernel version
.github/workflows/{ci,codeql,docs-doctrine,drift}.yml   managed, single pinned kernel SHA
.github/{CODEOWNERS,dependabot.yml,PULL_REQUEST_TEMPLATE.md,ISSUE_TEMPLATE/}   managed
.kilo/{kilo.json,agent/,command/,skills/}   managed subset + local additions
docs/{README.md,architecture/,adr/,operations/,internal/}   managed skeleton
src/ or <package>/, tests/, e2e/, tools/, scripts/   profile-specific, local content
```

Managed files carry a `kernel:managed v<version>` marker. `.kernel-manifest.json`
is the verification surface: `repo-drift`'s `kernel_conformance` detector
compares manifest hashes against the rendered output's expected hashes and
never re-renders on its own, keeping the detector dependency-free.

## Verification

- Renderer: `python -m kernel render --check` (hub-only, `scripts/kernel/`) is
  idempotent and byte-stable across two runs, for every repo and profile.
- Engine: `repo-drift` detectors `kernel_conformance`, `workflow_pin`,
  `agent_contract`, `metadata_schema`, `worktree_registry` (opt-in per
  `.drift-rules.yaml` until each repo's wave lands).
- Distribution: `.github/workflows/kernel-sync.yml` fanout PRs, guarded by
  `kernel-sync-guard.yml`, narrow auto-merge exception per ADR 0005.

## Relationship to predecessor docs

| Predecessor | What it still owns |
|---|---|
| `repo-framework.md` | Org/ownership map, bucket decision tree, archive/promotion procedure, naming forbidden-list. Not superseded; this spec only supersedes its structural-layout overlap. |
| `repository-layout-standard.md` | Historical archetype detail (`vite-react-spa`, `next-app-router`, etc.) as background; the canonical tree above is now the enforced surface. |
| `repo-topology-canon.md` | Fleet axes (`bucket`, `type`, `surface`, `stack`) remain canonical inputs to `profile` derivation above. |
| `repo-standardization.md` | Describes the pre-kernel `sync-github.sh` baseline mechanism; retained as historical record of what it replaces. |
| `workspace-standardization.md` | Canonical naming policy and directive tracking (D-1 through D-5) remain in force; its stack-layout sections are superseded by the canonical tree above. |

## Open items

- Profile enum extension (see Profiles section above) needs explicit
  sign-off before Phase 0 step 3 (schema extension + backfill) proceeds.
- `catalog/repos.json` currently holds 47 entries against the plan's stated
  scope of 46 repos; this discrepancy is noted here as a fact to resolve
  before treating `catalog/repos.json` as the authoritative 1:1 map of the
  46 on-disk checkouts, not resolved unilaterally by this document.
