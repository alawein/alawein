---
type: plan
status: draft
source: cursor-first absorb 2026-09-13
last_updated: 2026-09-13
owner: meshal
---

# OPS-INVENTORY-REORG-PLAN

Cleanup later. MOVE + manifest. No delete. No sync daemon. Not executable
from this Cloud VM.

Desktop tree below is **UNVERIFIED**. The pack path was named in the
mission and is absent here. Do not treat this file as proof the folders
exist.

## Authority

| Object | Writer | This plan |
| --- | --- | --- |
| Desktop `ops-shared-inventory` | Meshal / Cleanup on the laptop | Propose MOVE only |
| Outpost KEEP skills | Outpost repo / device | Do not relocate onto Desktop SoR |
| coding-phone KEEP skills | `alawein/coding-phone` | Do not add evening/maios/arch work roots |
| Grok profiles / routines / memory | Grok Bot computer | No Cloud write |
| Git catalog and kits | `alawein/alawein` | Already SoR for repo fields |
| Notion operating records | Notion | Link, do not copy |

## Keep in place (do not MOVE)

| Path (declared) | Why |
| --- | --- |
| `C:\Users\mesha\Desktop\ops-shared-inventory\` | Desktop ops SoR |
| `C:\Users\mesha\Desktop\ops-shared-inventory\RESPONSE-STYLE.md` | Live rev f pointer |
| `C:\Users\mesha\Desktop\ops-shared-inventory\AGENTS.md` | Desktop ops AGENTS if present |
| `C:\Users\mesha\Desktop\GitHub\alawein\` | Workspace root (not a git root) |
| `C:\Users\mesha\Desktop\AGI\` | Employer quarantine. Outside Alawein |

## Proposed MOVE set (Cleanup, after Meshal exact yes)

Dated absorb and handoff packs become archive inputs once this git pack
is accepted. Destination is a dated Desktop archive under
`ops-shared-inventory\_absorbed\`, not git, not Downloads deletion.

| From (declared) | To (proposed) | After |
| --- | --- | --- |
| `ops-shared-inventory\CURSOR-FIRST-ABSORB-2026-09-13\` | `ops-shared-inventory\_absorbed\2026-09-13-cursor-first\` | This PR accepted |
| `sources\chatgpt-with-zip-pack.md` | same `_absorbed` tree | Keep next to manifest |
| `sources\claude-sonnet-with-zip.md` | same | Keep |
| `sources\claude-haiku-without-zip.md` | same | Keep |
| `sources\maios-ecosystem-handoff\` | same | Keep |
| `sources\maios-cv-employment-handoff\` | same | Keep |

Do not MOVE:

- Live `RESPONSE-STYLE.md`
- Live Desktop `AGENTS.md` / `agents.yaml` if those are the SoR copies
- Grok-local profiles
- Outpost or phone KEEP skill bodies
- `Desktop\AGI`

## Manifest fields (required before any MOVE)

Cleanup writes one manifest next to the destination. Minimum fields:

| Field | Value |
| --- | --- |
| `as_of` | UTC timestamp |
| `operator` | Meshal or Cleanup skill |
| `authorization` | Exact yes ID / thread |
| `from` | Full source path |
| `to` | Full destination path |
| `sha256` | Per file |
| `action` | `MOVE` only |
| `delete` | `false` |
| `git` | `false` (Desktop only) |

Reuse Cleanup's existing MOVE + manifest skill. Do not invent
`hygiene.ps1 -Apply` from Cloud. Owner CONFIRM stays required on the
laptop.

## Layout target (ops doctrine, not a new SoR)

```text
Desktop/ops-shared-inventory/     live SoR (stay)
  RESPONSE-STYLE.md               rev f
  AGENTS.md                       Desktop ops copy if present
  agents.yaml                     Desktop ops copy if present
  _absorbed/                      dated packs after accept
Desktop/GitHub/alawein/           workspace
  core/alawein                    this control plane
  core/knowledge-base             CV repo (UNAVAILABLE this VM)
Desktop/AGI/                      quarantine
```

Phone / Outpost:

- KEEP skill bodies stay on device.
- No evening / maios / arch work roots on phone.
- coding-phone sessions end on Home. Kill leftover `:8787` hubs.

## Explicit non-goals

- No sync daemon Desktop <-> Outpost <-> phone <-> Grok.
- No copy of Desktop SoR into git.
- No second inventory in Slack Canvas.
- No durable Research or Grok bots.
- No delete, spend, or secret rotate.

## Verify (laptop only)

```text
[ ] Manifest exists and lists every MOVE
[ ] sha256 matches before and after
[ ] Live RESPONSE-STYLE.md still at SoR root
[ ] _absorbed pack is complete
[ ] git status in core/alawein is clean of Desktop files
[ ] Phone has no new KEEP work roots
```

Failed verify: stop. Do not retry MOVE.
