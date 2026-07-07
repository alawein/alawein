---
type: internal
source: none
sync: none
sla: none
title: Portfolio Conformance Map and Placement Recommendations
description: Advisory architectural map of the 37-repo alawein portfolio plus per-repo recommendations to fix bucket/type drift, archive hygiene, and tools/ clutter against the fixed Repo Framework doctrine.
category: spec
audience: [ai-agents, contributors]
status: completed
last_updated: 2026-07-07
tags: [portfolio, repos, governance, buckets, conformance, organization]
---

# Portfolio Conformance Map and Placement Recommendations

Status: draft (advisory)
Owner: alawein
Date: 2026-06-19
Doctrine basis: `docs/governance/repo-framework.md` (treated as fixed for this pass)

## Summary

The 2026-05 reorg landed: `apps/` is dissolved, eight intent-buckets exist, and a
written doctrine plus a CI validator enforce them. Of 37 catalogued repos, 28 are
conformant and need no change. This document is the revised architectural map plus
recommendations for the 9 catalogued repos that drifted, plus 3 uncatalogued local
directories cluttering `tools/`: two product-typed web apps sitting in `tools/`, three
research-typed entries in `ventures/` that are not research, and one already-archived
repo still living in `research/`.

Scope decisions for this pass (set by the owner):

- **Doctrine is fixed.** No bucket splits, merges, or renames. This is conformance
  cleanup against the existing 8 buckets, not a taxonomy redesign.
- **Deliverable is advisory.** A map plus a recommendations table. No moves, renames,
  or archives are performed here. Executing any accepted row is a separate cycle.
- **Archive hygiene only.** Relocate the one already-archived repo. Do not evaluate the
  7 `frozen` research repos for archiving; freezing is a deliberate state.

All recommendations are reversible and per-repo. Accept or override any row.

## Revised architectural map (current state, all 37)

Grouped by bucket. Fields are from `catalog/repos.json` (last_verified varies per repo).

### products/ (4) — shipped, monetizing
| Repo | Type | Surface | Lifecycle |
|---|---|---|---|
| Bolts | product | web | active |
| Gymboy | product | web | active |
| REPZ | product | web | active |
| Scribd | product | web | active |

### personal/ (2)
| Repo | Type | Surface | Lifecycle |
|---|---|---|---|
| meshal.ai | product | web | maintained |
| Roka: Oakland Hustle | product | service | active |

### family/ (1)
| Repo | Type | Surface | Lifecycle |
|---|---|---|---|
| Atelier Rounaq | product | web | active |

### research/ (15)
| Repo | Type | Surface | Lifecycle |
|---|---|---|---|
| Alembiq | research | library | active |
| CHSH Lab | research | web | active |
| Event Discovery Framework (edfp) | research | service | frozen |
| Fallax | tooling | service | active |
| Helios | archive | dataset | archived |
| MagLogic | research | library | frozen |
| OptiQAP | research | library | maintained |
| meatheadphysicist | research | service | active |
| qmatsim | research | library | frozen |
| qmlab.online | research | web | frozen |
| quantumalgo | research | library | active |
| qubeml | research | library | frozen |
| scicomp | research | library | frozen |
| simcore.dev | research | web | active |
| spincirc | research | library | frozen |

### tools/ (8 catalogued)
| Repo | Type | Surface | Lifecycle |
|---|---|---|---|
| Attributa | product | web | active |
| LLMWorks | product | web | active |
| alawein (hub) | governance | docs-hub | active |
| design-system | infra | monorepo | active |
| incore | tooling | cli | active |
| knowledge-base | infra | docs-hub | active |
| prompty | tooling | monorepo | active |
| workspace-tools | infra | cli | active |

### ventures/ (4)
| Repo | Type | Surface | Lifecycle |
|---|---|---|---|
| Adil | research | cli | active |
| Loophole Lab | research | web | frozen |
| Provegate | research | workflow | active |
| Veyra | product | monorepo | active |

### jobs-projects/ (3)
| Repo | Type | Surface | Lifecycle |
|---|---|---|---|
| Handshake AI Eval | tooling | monorepo | active |
| Mercor LLM Failsafe | archive | service | archived |
| Turing engagements | tooling | docs-hub | active |

## Conformance findings and recommendations

Action rows below. The 28 catalogued repos not flagged anywhere in this section are
conformant and need no change.

| Repo | Current bucket / type | Issue | Recommended action | Rationale | Cost / reversibility |
|---|---|---|---|---|---|
| Attributa | tools / product | Product-typed web app in `tools/` (tools = infra/utility per the bucket tree). | Move `tools/` -> `ventures/`; keep `type: product`. | Privacy-first attribution web product with its own domain (attributa.dev), not infrastructure. Private and pre-revenue reads as MVP. Matches Veyra (a product-typed MVP already in `ventures/`). | Dir move + catalog `bucket` + README `Category`. Reversible. |
| LLMWorks | tools / product | Same as Attributa. | Move `tools/` -> `ventures/`; keep `type: product`. | LLM eval/benchmark "playground" web product (llmworks.dev), pre-launch. Same class as Attributa. | Same. Reversible. |
| Provegate | ventures / research | `type: research` but it is agent MCP tooling, not research. | Retype `research` -> `tooling`. Keep in `ventures/` if you intend to ship it; consider `tools/` if it is infra you use. | "Agent MCP tooling for drift control, memory, proof-oriented orchestration" is infrastructure, not papers/experiments. | Metadata-only if it stays in `ventures/`. Cheap. |
| Adil | ventures / research | `type: research` but it is a legal-ops CLI. | Retype `research` -> `tooling` (or `product`). Keep in `ventures/`. | Legal-ops evidence-packet CLI is a utility/MVP, not research. | Metadata-only. Cheap. |
| Helios | research / archive (archived) | `lifecycle: archived` but still physically in `research/`; README header is internally inconsistent (`Status: archived` yet `Category: research`, `Next action: continue`). | Relocate `research/helios` -> `_archive/2026-06-helios/`. Set `Category: archive`, `Next action: delete`. Add `archivedDate` in `projects.json`. | The doctrine's own archive procedure says archived repos move to `_archive/`. The header drift is a direct violation. | Follow archive procedure. Reversible. |
| tools/claude-templates | uncatalogued (no git remote) | Local-only assets (2 `.jsx` files + README), not a tracked repo; breaks the "every bucket dir is a tracked repo" invariant. | Move out of `tools/`: fold the prompt/template assets into `prompty` or `knowledge-base`, else `_archive`. | It is loose content, not a portfolio repo. | Move/fold. Reversible. |
| tools/inventory | uncatalogued (no git remote) | The `/inventory` skill's output store plus its CLI, sitting in a bucket as if it were a repo. | Move to the inventory output root (`$INVENTORY_OUTPUT_ROOT`) or gitignore it under `tools/`. | Generated skill output + tooling, not a catalogued repo. | Move or ignore. Reversible. |
| tools/packages | uncatalogued (no git remote) | Local `@alawein` npm mirror/cache, not a repo. | Move out of the bucket tree or gitignore. | Package cache, not a portfolio repo. | Move or ignore. Reversible. |

### Keep-as-is (flagged, no action)

- **meatheadphysicist** (research / research): the playful name reads like a personal
  brand, but the content is genuine research (Bell-inequality and CHSH analysis, claim
  verification, tied to the Kante collaboration). Correctly placed. No action.
- **Fallax** (research / tooling): an LLM adversarial-reasoning evaluation system.
  Research-support tooling, tightly coupled to the eval work, so `research/` holds.
  `tools/` is the only alternative and the coupling argues against it. Low priority.
- **Loophole Lab** (ventures / research, frozen): "adversarial claim stress-testing and
  loophole analysis" with quantum tags is genuinely research-flavored, so `type: research`
  is defensible here even though Adil and Provegate (same field value) are not. A frozen
  MVP surface. Leave it; revisit only if you decide it is a research artifact rather than a
  pre-launch product.

### Naming review

The "renaming" part of the request yields almost nothing, which is itself a finding:

- All local directories are `lowercase-kebab-case`. None hit the doctrine's forbidden
  names (`test`, `demo`, `new-*`, `*-final`, `app`, `tool`, `website`, `backend`,
  `frontend`). Display names with dots (`meshal.ai`, `qmlab.online`, `simcore.dev`,
  `mhphys.online`) are homepages; the directories are plain kebab. No rename required.
- `meshal-web` (dir) vs `meshal.ai` (display name) is fine; `_archive/meshal-web-legacy`
  is the retired predecessor, correctly archived.
- One optional, low-priority flag: **Scribd** (`products/scribd`) collides with the
  well-known scribd.com brand. It is currently private, so there is no urgency, but if it
  ever ships public, consider a rename to avoid trademark confusion.

## Lockstep sync notes (for any accepted row)

These make later execution mechanical. They are not performed here.

**Bucket move** (e.g. Attributa `tools/` -> `ventures/`):
1. Filesystem: move the repo directory to the new bucket folder.
2. `catalog/repos.json`: update `bucket` (and `local_path`). A pure local-bucket move does
   not rename the GitHub repo, so `legacy_slugs[]` is usually untouched.
3. Regenerate: `python scripts/catalog/build-catalog.py`, then `python scripts/catalog/validate-catalog.py`. Never hand-edit the generated `projects.json`.
4. README header: update the `Category:` line to the new bucket.
5. Validator: `scripts/doctrine/validate-repo-framework.py` must pass. Note the anti-rot
   rule: `products`, `ventures`, `tools`, and `research` require `docs/DEBT.md` and
   `docs/adr/`. Moving Attributa/LLMWorks `tools/` -> `ventures/` keeps them in a
   code-archetype bucket, so no artifact changes. Moving a repo OUT into
   `personal/family/jobs-projects/archive` drops that requirement.
6. GitHub: a local-bucket move needs no remote change. Only a repo *rename* needs
   `gh repo rename` plus reliance on the 301 redirect and a recorded `legacy_slugs[]`.

**Retype only** (e.g. Provegate `research` -> `tooling`, no move):
- Update `catalog/repos.json` `type`, regenerate, validate. No directory move, no README
  `Category:` change (`Category` tracks the bucket, not the type). Cheapest action class.

**Archive relocation** (Helios): follow the doctrine archive procedure in full:
`gh repo archive` if not already archived on GitHub; move to `_archive/2026-06-helios/`;
`projects.json` `status: archived` (already set) plus `archivedDate`; README `Status:
archived` (already), `Category: archive`, `Next action: delete`.

## Out of scope

- **Frozen-research archiving.** The 7 `frozen` research repos (edfp, MagLogic, qmatsim,
  qmlab.online, qubeml, scicomp, spincirc) are not evaluated against the 180-day archive
  criteria this pass (owner's hygiene-only call). Listed here only for awareness.
- **Taxonomy changes.** No bucket split, merge, or rename; the doctrine is fixed.
- **`research/` size.** It is 40% of the portfolio (15/37), a tight quantum/sim library
  family plus four non-quantum entries. No sub-grouping is proposed, since that would be a
  doctrine change.
- **Execution.** This spec is advisory. Nothing is moved, renamed, or archived. If you
  accept rows, executing them is a separate cycle (writing-plans).

## Open decisions for the owner

Two facts I cannot resolve from the catalog or code; they change a recommendation from a
move to a retype or vice versa:

1. **Attributa / LLMWorks: `products/` or `ventures/`?** I default to `ventures/`
   (pre-revenue MVP). If either has paying customers, it belongs in `products/`.
2. **Provegate / Adil: `tools/` or `ventures/`?** I default to keeping them in
   `ventures/` with a retype. If you treat them as infrastructure you use rather than
   products you will ship, move them to `tools/` instead.

## Counts

- 37 catalogued repos: 28 conformant; 9 flagged = 5 action rows (2 moves: Attributa,
  LLMWorks; 2 retypes: Provegate, Adil; 1 archive relocation: Helios) + 3 keep-with-flag
  (meatheadphysicist, Fallax, Loophole Lab) + 1 optional naming flag (Scribd).
- Plus 3 uncatalogued local directories to declutter out of `tools/` (claude-templates,
  inventory, packages), outside the 37.
