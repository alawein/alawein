---
type: design
status: approved
source: brainstorming 2026-09-13 gated leftovers apply
last_updated: 2026-09-13
owner: meshal
---

# Gated leftovers apply (2026-09-13)

Approved design. Derived evidence only. Not a second inventory. Not a Morning Brief.

## Goal

Apply remaining gated leftovers after absorb delivery closed on `alawein/alawein` `main` `61690116` (#266). No new absorb scaffolding.

## SoR for remaining work

**Git absorb pack + Sider quotes win** for what is left:

- Pack: `docs/internal/maios/cursor-first-absorb-2026-09-13/`
- Evidence branch: `cursor/sider-evidence-land-295b` (Sider KAUST quote + Cloudflare account check)

Desktop `CURSOR-FIRST-ABSORB-2026-09-13\CHECKLIST-SCOREBOARD.md` is input only. Do not add a third scoreboard file in git.

Grok Bot `86e1bc91-9e6f-41a4-a49e-68b4ef7fdf21` may curate a local unified plan and paste Intake. It does not overwrite `catalog/` or kits. No Grok HTTP agents API.

Git wins all repo fields.

## Architecture

1. Ungated Cursor work lands or reports the evidence PR, runs doctrine/catalog hygiene, freezes the leftover list to seven named exact-yes gates.
2. Meshal tags one agent per dispatch. Agents do not @ each other.
3. Exact-yes gates stop until Meshal names the gate and says yes. Approving this design is not yes for MOVE, TEMP delete, secret rotate, merge, or Brief body.

## Components

| Unit | Job | Writer |
| --- | --- | --- |
| Evidence PR | Open PR for `cursor/sider-evidence-land-295b` or report hard 500 | Cursor on `alawein/alawein` |
| Hygiene 6–11 | Catalog/doctrine validators; discovery no-mutate | Cursor |
| Grok local plan | Align CHECKLIST rows to git absorb + Sider; Intake line only | Grok Bot `86e1bc91` |
| Gate 1 rev f | Keep live rev f vs merge drafts | Meshal (default: keep) |
| Gate 2 operating-map | Header fix on Desktop map | Laptop exact yes |
| Gate 3 MOVE | Cleanup MOVE + sha256 manifest to `_absorbed\2026-09-13-cursor-first\` | Laptop exact yes |
| Gate 4 KB/CV | Grant Cursor App `89025369` Contents:Read on `knowledge-base`; quote overlays; no AGI import into alawein | Sider HAND + token |
| Gate 5 Cloudflare | Rotate nothing unless a Service Key appears | Meshal console |
| Gate 6 owners | alawein vs workspace-control field owners | Meshal decide |
| Gate 7 TEMP | Delete TEMP Absorb Synth + TEMP Red Team | Desktop exact yes |

## Data flow

```text
git absorb pack + sider branch
        |
        v
Cursor: evidence PR + hygiene --> leftover list = 7 gates
        |
        +--> Grok Bot: local plan match (no git write)
        |
        v
Meshal tags --> one agent / one done-when per gate
```

## Error handling

- PR create HTTP 500: report and stop retry thrash; leave branch pushed.
- Hygiene fail: stop; do not open unrelated fix PRs in this mission.
- knowledge-base 404: HOLD Gate 4; no invented KAUST/AGI dates; no AGI copy into alawein.
- Service Key absent: Gate 5 stays "nothing to rotate" until a key appears.

## Testing / verify

- `gh pr view` or create result for evidence branch.
- Commands: `sync-readme --check`, `validate-doc-contract.sh --full`, `validate.py --ci`, `build-style-rules.py --check`, `style-advisory-audit.py`, `validate-agent-integrations.py --strict`.
- Leftover list text equals the seven gates below. No twelfth-item absorb scaffolding.

## Constraints (hard)

- No AGI import into `alawein/alawein`
- No Notion Morning Brief body
- No unnamed secret rotate
- No Grok HTTP API
- No sync daemon
- Skills beat new durable bots
- Meshal tags the next agent

## Done when

1. Evidence PR open, or create reported as 500 with branch still on origin.
2. Remaining list is exactly the seven exact-yes gates.
3. Grok local plan (when Meshal runs the bot) matches git on repo rows.

## The seven exact-yes gates

1. rev f keep vs merge (default keep)
2. operating-map header
3. MOVE + manifest
4. KAUST / AGI / knowledge-base grant + test
5. Cloudflare: nothing to rotate unless a Service Key appears
6. alawein vs workspace-control owners
7. TEMP sidebar delete

## Out of scope

New absorb tree, third scoreboard in git, Brief body, sync daemon, new Grok/Research bots, Slack `@Grok` or `@ChatGPT`, Kilo on this control plane, AGI file landing in alawein.
