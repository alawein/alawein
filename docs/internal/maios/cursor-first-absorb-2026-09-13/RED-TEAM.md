---
type: audit
status: draft
source: cursor-first absorb 2026-09-13 DOC/OPS red-team
last_updated: 2026-09-13
owner: meshal
---

# RED-TEAM (DOC/OPS)

Hostile review of this absorb. Docs and named repos only. No offensive
cyber, exploits, payloads, or secret theft.

**Scope:** `alawein/alawein` absorb pack plus declared secondary
`alawein/knowledge-base`. **Executor cannot certify this file as
independent review.** Independent review of the PR revision is still
pending.

## Findings

| ID | Claim | Evidence | Authority | Severity | Remediation | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| R01 | `docs/maios/` is the absorb home | Folder did not exist. `docs/internal/` is the derived-evidence convention. Vale would scan a new `docs/maios/` class | Documentation contract; CLAUDE.md exemption list | medium | Use `docs/internal/maios/...`. Record the path decision | Do not add a new managed-doc class without Meshal yes |
| R02 | Desktop pack was read | Path absent on this VM | Mission: mark UNVERIFIED | high | Keep Desktop claims UNVERIFIED | Do not treat reconstruction as file proof |
| R03 | knowledge-base CV bugs can be patched now | GitHub 404; catalog path absent | Live repo wins; employer isolation | high | HOLD. Need token or clone. Do not invent KAUST or AGI dates | No CV commit until files are read |
| R04 | Patching AGI overlays in alawein is allowed | Mission names knowledge-base only. `AGENTS.md` forbids AGI import into Alawein | Employer isolation | high | Patch only inside knowledge-base if Meshal opens it. Never copy overlays into this repo | BLOCK any AGI file in `alawein/alawein` |
| R05 | "82 integrations" is live truth | Catalog sum this checkout = 75 named rows (9+5+17+9+35) | `catalog/agent-integrations.yaml` | medium | Keep 82 as UNVERIFIED handoff count | Do not edit catalog from a handoff number |
| R06 | Kit is 1.8.2 / rev e | #264 merged 1.8.3 / rev f. Pointers in `AGENTS.md`, `CLAUDE.md`, `SSOT.md`, `maios-reply-style.mdc` still stale | Live `AGENT.md` | medium | Separate pointer-sync land | Do not thrash RESPONSE-STYLE drafts |
| R07 | Cloudflare rotate is in scope | Official EOL 2026-09-30. Account unread | Exact-yes secret rotate | high | HOLD note only. Meshal console | No rotate, no token create from Cloud |
| R08 | Handoffs can overwrite git | Ranked SoR puts handoffs last | J04; field authority | high | Filter handoffs through live git | Stop if a packet asks to swap SoR |
| R09 | Dual SoR B lets Desktop overwrite kits | Mission patches are ops / KEEP / Grok-local only | J04; Dual SoR B WITH PATCHES | medium | Keep the patch list narrow | BLOCK Desktop writes into `catalog/` or kits |
| R10 | This run may post Slack or write Brief | Mission lists those as exact-yes / hard BLOCK | AGENT.md; slack-agent-voice | high | Do not post. Do not write Brief | Slack / Notion Brief stay closed |
| R11 | A sync daemon would fix drift | Mission: no sync daemon. Skills beat bots | Dual SoR B | medium | Leave device SoRs local | BLOCK new daemons |
| R12 | Phone KEEP needs evening/maios/arch roots | Mission hard BLOCK | coding-phone user rule | medium | KEEP bodies stay on device | BLOCK new phone work roots |
| R13 | Grok Bot has an HTTP agents API this Cloud can call | Prior audits: do not invent that API | Grok-local writer boundary | high | Propose Intake memory line only | No Grok profile / routine / memory write |
| R14 | Merge of this PR is implied | Mission: draft PR; no merge without exact yes | operating-model; commit convention | high | Leave draft | Merge BLOCK |
| R15 | Independent review already happened | This file is executor-authored | Change-evidence contract | medium | Record review not performed. ChatGPT is the default reviewer when Cursor executes | Acceptance stays pending |
| R16 | Cleanup can delete the Desktop pack | Cleanup is MOVE + manifest | Scheme A Cleanup | high | MOVE only after accept | Delete BLOCK |
| R17 | PR 49 is a known open CV land | knowledge-base unread | Live repo | low | Leave UNVERIFIED | Do not cite PR 49 as merged or open |
| R18 | Discovery may edit `agent-integrations.yaml` | Kit 1.7.0 one-catalog-land; discovery no-mutate | AGENT.md; control-plane | medium | This PR does not touch the catalog | Stop if a later step wants a live rescan write |
| R19 | Sider should start in parallel | Meshal chose Cursor-first unison here | Mission | low | Other surfaces wait for Meshal tag | Do not @ other agents to start |
| R20 | Absorb docs are a new SoR | Frontmatter and this file say derived | Ranked SoR | medium | Keep language as derived evidence | Do not link this pack from `SSOT.md` as canon |

## What was not attacked

No exploit, payload, credential dump, or access-bypass work. Cloudflare
note is deprecation scheduling only. CV HOLD is a missing-repo stop, not
a date rewrite.

## Verdict

The absorb pack can land as derived evidence. CV patches and Cloudflare
mutation cannot. Desktop pack contents stay UNVERIFIED. Pointer drift
(R06) is real and should not be silently "fixed" inside this absorb
unless Meshal asks for that land.

**OK** to draft-PR the four docs. **HOLD** CV and Cloudflare. **BLOCK**
merge, Brief writes, Slack posts, secret rotate, and AGI import.
