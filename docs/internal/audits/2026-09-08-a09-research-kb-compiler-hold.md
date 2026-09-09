---
type: audit
status: draft
last_updated: 2026-09-08
owner: meshal
---

# A09 research-KB / compiler backlog HOLD (2026-09-08)

Cursor lane item A09 only. Separate from A05 / MES-12.
Cloud Agent run `bc-1ff2dca9-5a41-4adf-9631-39deb4fac6c8`
(https://cursor.com/agents/bc-1ff2dca9-5a41-4adf-9631-39deb4fac6c8).
Assigned scope: resume the research-KB / kcompiler backlog only if exports and
the correct compiler host exist in-repo or are documented; otherwise record HOLD
and keep the existing 46 catalog compliance classifications. Executor: Cursor.
Independent review: not performed this turn (default reviewer when Cursor
executes is ChatGPT; Slack `@ChatGPT` is replaced). Final approval: pending
Meshal.

MAIOS is the human brand. Wire IDs may use `mai.*`. This note does not write
Morning Brief, rotate secrets, spend, or merge #239, #232, or #238.

## Verdict checklist

| Item | Grade | Note |
| --- | --- | --- |
| Resume kcompiler / research-KB ingest | HOLD | Host, exports, and feature branch are not on this VM |
| Preserve edited-message revisions | HOLD | Fix lives on unreachable host branch; do not invent PASS |
| Keep 46 standing `compliance` values | OK | Copied from `catalog/repos.json` into `catalog/index.yaml` |
| Rebuild a second inventory | BLOCK | Not done |
| Merge #239 / #232 / #238 | BLOCK | Not touched |
| Spend / secret rotate / Notion Morning Brief | OK | Not done |

Failed reads stay HOLD or GAP. This is not a compiler PASS.

## Missing prerequisites (do not resume)

Documented host and export path, none reachable from this checkout:

1. **Compiler host.** Notion Cross-System Taxonomy (packet
   `2026-09-07-research-consolidation-01`) names
   `C:\Users\mesha\Projects\kcompiler` with live `kbase.db` and `evidence/`.
   That Windows tree is not mounted here.
2. **Catalog checkout.** `catalog/repos.json` `local_path` is `core/kcompiler`.
   `docs/governance/kernel-spec.md` already records that path as unreachable
   (with `chshlab-paper` and `dotclaude`). Confirmed absent on this VM.
3. **GitHub repo.** `GET https://api.github.com/repos/alawein/kcompiler` and
   `alawein/knowledge-base` both returned 404 with the current `gh` identity
   (`alawein`). Catalog URLs remain declarations, not live-host proof.
4. **Exports.** No ChatGPT or Claude conversation exports, and no
   `Desktop/ops-shared-inventory/chatgpt-research-stack-handoff-2026-09-08/`
   pack, exist in this repo. Raw corpus inputs stay out of version control
   (`CLAUDE.md` hard constraint 8).
5. **Pilot branch.** Feature HEAD `e7505cd` on
   `feat/research-consolidation-pilot` (worktree
   `.worktrees/research-consolidation-pilot`, start `b51e0bc`) is not in this
   clone. Eval path
   `knowledge/08-inbox/2026-09-07-research-consolidation-eval.md` is not here.

Do not clone a substitute host, invent `kbase.db`, or treat Notion as the
compiler. `alawein/knowledge-base` stays a separate Command Center domain.

## Edited-message revisions

The 2026-09-07 pilot recorded an event-versioning defect: a synthetic refresh
kept two raw export versions but only the original two message events, so
changed content with the same message identity never entered the event table.

The same note says the defect was fixed and tested on that host feature branch
(`content_sha` / revision ids; `test_event_revisions.py` 6/6; sandbox ALL
PASSED) and that host live `events` is still 0 pending schema migrate on the
publish path. None of those files or test results are in `alawein/alawein`.

HOLD: do not resume incremental conversation ingest until the host branch (or
an equivalent in-repo export plus a reachable `kcompiler` checkout) is
present. Preserving edited-message revisions is a host resume gate, not a
control-plane claim.

## 46 compliance classifications (kept, not rebuilt)

PR #237 reported 46 standing `compliance` values in `catalog/repos.json` that
are missing from `catalog/index.yaml`. A forward compile after #237's
symmetric override would drop them, including `pii` on `bolts`, `gymboy`, and
`repz`, and `regulated` on `adil`. Only `ai-ops` already had
`compliance: internal-only` in the index.

This run does not merge #237 and does not run `compile_index.py --export`
(main `slim_entry` still omits `compliance`, so export would rewrite the
index and drop the field). Existing `repos.json` values were copied onto the
matching index entries. No new inventory, no guessed class, no drop.

Kept counts from `catalog/repos.json` `github_custom_properties.compliance`:

| Value | Slugs |
| --- | --- |
| `regulated` | `adil` |
| `pii` | `bolts`, `gymboy`, `repz` |
| `internal-only` | `ai-ops` (already present), `alembiq`, `android-coding-phone`, `attributa`, `auditraise`, `design-system`, `handshake`, `helios`, `incore`, `knowledge-base`, `mercor`, `prompty`, `provegate`, `qmlab`, `quantumalgo`, `simcore`, `turing`, `veyra`, `workspace-control`, `workspace-tools` |
| `public-data` | remaining catalog slugs, including `kcompiler` |

`kcompiler` stays `public-data` because that is the standing repos.json
value, not a new host classification.

## Sources read (not adopted as host proof)

- Notion: Cross-System Taxonomy
  (https://app.notion.com/p/e45ab23ef22a45f9b31b0895de8cf65a)
- Notion: MAIOS Project Handoff 2026-09-08
  (https://app.notion.com/p/3d56d8de221581f19d52fd1d555ceb08)
- Notion: MAIOS Research Stack Direction 2026-09-08
  (https://app.notion.com/p/3d56d8de22158145805bd0d44aa21a14)
- Git: `catalog/index.yaml`, `catalog/repos.json`, PR #237
- Live: `gh api repos/alawein/kcompiler` 404; no `core/kcompiler` on disk

## Next (Meshal)

1. Attach or mount the Windows compiler host, or make `alawein/kcompiler`
   readable to this token, before any A09 ingest resume.
2. Land the host event-versioning fix before incremental export refresh.
3. Review the kept `pii` / `regulated` lines; they are historical standing
   values, not a new scan.
4. Leave #237 Draft until that review. Do not let a scheduled catalog sync
   drop the 46 values.
