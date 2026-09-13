---
type: audit
status: draft
source: cursor-first absorb 2026-09-13
last_updated: 2026-09-13
owner: meshal
---

# ABSORB-SYNTHESIS (2026-09-13)

Derived evidence. Not SoR. Not a Morning Brief. Not a second inventory.

**Executor:** Cursor Cloud absorb. **Author:** Meshal Alawein
`<contact@meshal.ai>`. **Independent reviewer:** not performed this turn
(default reviewer when Cursor executes is ChatGPT; Slack `@ChatGPT` is
replaced). **Final approval:** pending Meshal. **Acceptance:** pending.

**Base:** `alawein/alawein` `c9eb9aa2` (#264 on `main`). **This pack:**
`docs/internal/maios/cursor-first-absorb-2026-09-13/`.

## Path decision (LOCKED)

Requested path `docs/maios/cursor-first-absorb-2026-09-13/` does not
exist. Creating `docs/maios/` would add a new managed-doc class under
Vale and the documentation contract. Existing derived-evidence home is
`docs/internal/` (handoffs, plans, audits). This pack uses that
convention. These files do not replace `AGENTS.md`, Desktop SoR, or
Notion.

## Source visibility (this VM)

| Source | Status | Evidence |
| --- | --- | --- |
| Live `alawein/alawein` | READ | `c9eb9aa2` after fetch of `origin/main` |
| `prompt-kits/AGENT.md` 1.8.3 / rev f | READ | Merged #264 |
| `catalog/agent-integrations.yaml` | READ | `lastVerified` 2026-09-13 Slack; MCP matrix 2026-09-12 |
| Desktop pack `C:\Users\mesha\Desktop\ops-shared-inventory\CURSOR-FIRST-ABSORB-2026-09-13\` | UNVERIFIED | Path absent on this VM |
| Desktop `RESPONSE-STYLE.md` rev f file bytes | UNVERIFIED | Pointer only. Git travel paste cites rev f |
| `alawein/knowledge-base` | UNAVAILABLE | GitHub MCP and `gh` 404. Catalog `local_path` `core/knowledge-base` absent |
| knowledge-base PR 49 | UNVERIFIED | Repo unread |
| ChatGPT / Claude zip handoffs | UNVERIFIED | Reconstructed from this prompt plus live git |
| Night realign / operating map / grok-bot-platform Desktop files | UNVERIFIED | Not mounted |

## Authority stack (LOCKED)

| Rank | Surface | Wins for |
| --- | --- | --- |
| 1 | Live repo + `AGENTS.md` | Repo identity, catalog, kits, CI, PRs |
| 2 | Desktop `ops-shared-inventory` | Ops doctrine, Cleanup MOVE+manifest, RESPONSE-STYLE SoR |
| 3 | Notion | Human operating view. Not ADR writer. Not Brief writer except Notion Custom Agent |
| 4 | Chat / Slack | Transport only |
| 5 | Handoffs | Derived evidence |

Dual SoR B WITH PATCHES (LOCKED from this mission, Desktop files UNVERIFIED):

- Desktop owns ops doctrine.
- Outpost and coding-phone KEEP skill bodies stay on those devices.
- Grok Name, Label, Description, routines, and memory stay Grok-local.
- No sync daemon.
- Skills beat durable bots.
- Git still wins for repo fields (J04). Desktop does not overwrite
  `catalog/` or kits.

## Locked / conflict / unverified

| ID | Claim | Grade | Evidence | Next |
| --- | --- | --- | --- | --- |
| L01 | Thin control contract already lives in git | LOCKED | `docs/governance/control-plane.md`; J01; #252 | Do not add a parallel constitution |
| L02 | Discovery does not mutate | LOCKED | Control-plane: tool ready is not a write grant | Inventory reads stay read-only |
| L03 | Intake is the only ordinary inbox | LOCKED | AGENT.md 1.8.3 RICH paste | Do not name a bot MAIOS |
| L04 | Notion Custom Agent alone writes Morning Brief | LOCKED | AGENT.md; this mission BLOCK | No Brief body writes |
| L05 | Git travel style is AGENT.md 1.8.3 / rev f | LOCKED | #264 merged `c9eb9aa2` | Do not revert to rev e |
| L06 | Cursor-first this cycle | LOCKED | Meshal chose align and execute here before Sider | Other surfaces wait |
| L07 | Employer isolation | LOCKED | `AGENTS.md` Never; catalog `employer_isolation` | No AGI import into alawein |
| C01 | Kit pointer drift after #264 | LOCKED | Live pointers moved to AGENT.md 1.8.3 / rev f on `cursor/kit-pointer-sync-295b` after #265 | Historical changelog rows may still cite 1.8.2 |
| C02 | Dual SoR vs J04 | CONFLICT if misread | J04 rejects Desktop winning over git for repo fields. Dual SoR B is ops/Grok/KEEP only | Keep the patch list above |
| C03 | "82 integrations" | CONFLICT with live catalog | This checkout: 9 agents, 5 workflow bots, 17 integrations, 9 Slack channels, 35 MCP names (16 ready, 2 error, 2 loading, 15 needs_auth). Sum of named rows = 75, not 82 | Treat 82 as UNVERIFIED handoff count |
| U01 | Desktop pack contents | UNVERIFIED | Path absent | [need this: pack on a mounted Desktop or paste] |
| U02 | KAUST date-range bug still open | UNVERIFIED | `cv_body.tex` unread. Repo 404 | HOLD patch |
| U03 | AGI overlays date still open | UNVERIFIED | `career-main-overlays.json` unread. Repo 404 | HOLD patch. Do not copy AGI files into alawein |
| U04 | knowledge-base PR 49 | UNVERIFIED | Repo unread | [need this: knowledge-base token or clone] |
| U05 | Cloudflare Service Key on Meshal accounts | UNVERIFIED | Official EOL is 2026-09-30. Account use unknown | HOLD. Meshal console only |
| U06 | Grok Bot fleet live state | UNVERIFIED | Laptop SoR. Cloud cannot write profiles | Leave Grok-local |

## Style ACK

Live Desktop SoR pointer is `RESPONSE-STYLE.md` **rev f** (2026-09-13).
Git travel paste is `prompt-kits/AGENT.md` **1.8.3**. #264 already landed
the kit bump. Do not thrash RESPONSE-STYLE drafts. Do not copy the
Desktop file into git.

Stale pointers (C01) are a separate land, not this absorb.

### Proposed Intake memory line (Grok-local write; do not apply here)

```text
Style ACK 2026-09-13: live Desktop RESPONSE-STYLE is rev f. Git travel paste is prompt-kits/AGENT.md 1.8.3. Do not revert to rev e. Cursor-first absorb pack is derived evidence in alawein docs/internal/maios/cursor-first-absorb-2026-09-13/.
```

## CV / employment (secondary repo)

Handoff names two bugs:

1. KAUST date range in `cv_body.tex`.
2. AGI date in `career-main-overlays.json`.

This run could not open `alawein/knowledge-base` (404) or
`core/knowledge-base`. Correct dates are unknown. No patch. No tests.
Do not invent dates. Do not import AGI Inc material into `alawein/alawein`.

**HOLD** until Meshal grants a knowledge-base read and names the correct
ranges.

## Cloudflare HOLD (Meshal console)

Official: Service Key authentication deprecated 2026-03-19; end of life
**2026-09-30**. Replacement is API Tokens. Source:
[Cloudflare API deprecations](https://developers.cloudflare.com/fundamentals/api/reference/deprecations/).

This run does not read Meshal's Cloudflare account, rotate secrets, or
change bindings. `Cloudflare-docs` is catalog-ready. Bindings, builds,
and observability stay `needs_auth` on the 2026-09-12 matrix.

**HOLD:** Meshal checks the Cloudflare dashboard for Service Keys before
2026-09-30 and replaces them with scoped API Tokens. Exact yes required
for any rotate.

## Ecosystem simplification (from handoff, filtered)

Keep:

- One thin control plane in git (already landed).
- Ranked SoR above.
- Discovery no-mutate.
- Skills over durable bots.
- Cursor-first this cycle.

Reject:

- New durable Research or Grok bots.
- Slack `@Grok` install.
- Sync daemon across Desktop / Outpost / phone / Grok.
- Second inventory YAML or Canvas constitution.
- Phone KEEP evening / maios / arch work roots.

## Open Meshal decisions

1. Accept this draft absorb PR (merge gated).
2. Grant knowledge-base read so CV bugs can be verified and patched.
3. Cloudflare console Service Key check before 2026-09-30.
4. Pointer-sync land is in progress on `cursor/kit-pointer-sync-295b`.
5. Apply the Intake memory line on Grok Bot (Grok-local).
6. Cleanup MOVE + manifest after this pack is accepted (Desktop only).
7. Whether 82 is a Desktop IDE count that should replace the catalog sum.

## Sibling files

- [OPS-INVENTORY-REORG-PLAN.md](OPS-INVENTORY-REORG-PLAN.md)
- [E2E-EXECUTION-PLAN.md](E2E-EXECUTION-PLAN.md)
- [RED-TEAM.md](RED-TEAM.md)
- [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md)
