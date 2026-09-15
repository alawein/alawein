---
type: canonical
source: none
sync: manual
sla: on-change
title: MAIOS bots skills teams canon
category: governance
audience: [contributors, ai-agents]
status: active
last_updated: 2026-09-15
tags: [maios, grok-bot, personal-ops]
---
# BOTS · SKILLS · TEAMS — FINAL CANON (for Claude Code)

> **Scheme A keepers:** Intake / Policy / Cleanup / Editorial. See [NAMING-CANON.md](./NAMING-CANON.md).

**SoR:** this file · grounded in `NAMING-CANON.md`, `RENAME-PROPOSALS.md`, `ops-shared-inventory/agents.yaml`, Master Handoff migration  
**OS:** [MAIOS.md](./MAIOS.md) — Meshal AI Operating System (control plane). This CANON details bots/skills/teams inside MAIOS.
**verified_at:** 2026-09-07 (Scheme A Windows SSOT flip; live Grok aliases until GROK-RENAME-PROOF)
**LIVE status/UI sync:** `BOTS-AND-TEAMS.md` + `agents.yaml` (wins on current hide/routines/display names — night sync 2026-09-06)
**Rule:** Prefer skills over personas. Logical teams ≠ sidebar bots. Durable renames / deletes = Meshal exact yes.
**Front door canon name:** Intake (live alias Atlas until GROK-RENAME-PROOF; never “Front Door” as the durable label).

---

## 0. Style rules (locked)

| Layer | Convention | Examples |
|---|---|---|
| Durable agents | Short proper name; role in description | Intake, Policy, Cleanup (live: Atlas, Alfred, Housekeeper) |
| Transitional | Preserve historical name; status in inventory | Handoff Integrator: hidden 2026-09-06 |
| Logical teams | Title Case lane names (control-plane only) | Command, Control Plane, Studio, Lab, Relay |
| Control services | Proper names, **not** sidebar bots | Fleet Ops, Forge, Gatekeeper |
| Skills | `kebab-case` outcome/verb; team prefix optional | `pist-methodology`, `ops-dual-writer-check`, `clip-pack-from-one-recording` |
| Routines | resource + cadence | `morning-brief-auditor` |
| Temps | `Temp <Job>` or session New Bot — never promote | Temp Naming Canon |
| Legacy shells | Keep historical name + `[HIDDEN/DEPRECATED]` | Clip Bot → Studio skills |

**Chat/status wording:** [RESPONSE-STYLE.md](./RESPONSE-STYLE.md) (rev c portable markers + dual-env adapters).

**Do not:** Bot 2 / Integrator 2 / Atlas Router / mega-router / per-capability durable bots / dual front door / dual Brief writer.

**Front door lock:** **Intake** (live alias **Atlas**) = sole ordinary inbox. **Policy** (live alias **Alfred**) = governance only (Master Handoff “Alfred CoS” maps here — not a second inbox).

---

## 1. DURABLE + TRANSITIONAL AGENTS (sidebar)

| Canon UI name | Live alias (until GROK-RENAME-PROOF) | maios_id | Class | Logical home | Disposition | exact_yes to rename/delete |
|---|---|---|---|---|---|---|
| **Intake** | Atlas | `maios.command.intake` | durable | Command | Sole front door + orchestration authority | Meshal UI for live Name; Windows SSOT flipped |
| **Policy** | Alfred | `maios.command.policy` | durable | Command | Governance / portfolio / approval framing; schedules ON | Meshal UI for live Name; Windows SSOT flipped |
| **Cleanup** | Housekeeper | `maios.control.cleanup` | durable | Control Plane | Local hygiene / declutter only | Meshal UI for live Name; Windows SSOT flipped |
| Handoff Integrator | Handoff Integrator | (transitional) | transitional | Command → absorb into Intake skills | HIDDEN early 2026-09-06; auditor on Intake | yes for profile rename; hide = UX |
| New Bot / Temp shells | Match full IDs in agents.yaml | TEMP | TEMP | ephemeral | Hidden per September 6 record; verify labels before deletion | Meshal exact yes + sidebar Delete |

---

## 2. PLANES AND TEAMS (control-plane lanes -- NOT new sidebar bots)

Fixed 2026-09-05 (Claude Code review, section 9): "team" and "plane" were used for the same thing in three places -- this section (which called Command and Control Plane "teams"), section 6's own IA diagram (which treats COMMAND / CONTROL PLANE / TEAMS as three parallel top-level branches), and AGENT-OS-STATUS.md ("Command/Control/Teams logical agents"). One word, one meaning now: **Plane** = the 3 top-level branches Atlas routes to. **Team** = only the 3 things inside the Teams plane.

### Planes (top-level, parallel to each other)

| Plane id | Display | Owns | Sidebar bot? |
|---|---|---|---|
| `command` | Command | Intake (Atlas), Policy (Alfred) | only existing durables |
| `control` | Control Plane | Fleet Ops, Forge, Gatekeeper, Cleanup (Housekeeper) | Cleanup only as durable; others = services |
| `teams` | Teams | Relay, Studio, Lab (see below) | no |

### Teams (children of the Teams plane only)

| Team id | Display | Owns | Sidebar bot? |
|---|---|---|---|
| `relay` | Relay | Connectors: GitHub, Slack, Notion(R), files, browser, Drive... | no |
| `studio` | Studio | Writing, edit, anti-slop, video, clips, captions, publish prep | no |
| `lab` | Lab | Research, PIST, site audit, strategy, panels | no |

Not fixed here: the repo's `shared-inventory/migration.yaml` has its own `team:` field carrying plane values (COMMAND/CONTROL/TEAMS), same overlap, but it's part of the typed schema in `control-plane/src/inventory/types.ts`. That's a code change, not a doc edit; flagged for later, not done in this pass.

### Control Plane service names (finalize)

| Service | Display name | Role | Sidebar? |
|---|---|---|---|
| Fleet Ops | **Fleet Ops** | Observability / reliability metrics | no (was Fleet Ops Auditor shell) |
| Forge | **Forge** | Candidate skill/workflow engineer | no (ephemeral worker pattern only) |
| Gatekeeper | **Gatekeeper** | Independent eval / promote / rollback | no |
| Housekeeper | **Cleanup** (live alias Housekeeper) | Entropy / quarantine | yes (existing durable) |

---

## 3. LEGACY SHELLS → TEAM + SKILL HOME

| Current bot (hidden) | Final home | Canonical skill id(s) | Team | Action |
|---|---|---|---|---|
| Fleet Ops Auditor | Fleet Ops + skills | `ops-dual-writer-check` (+ PR/handoff skills as needed) | Control Plane | Keep hidden; optional description fix; delete later |
| Product Idea Stress Test | Lab skills | `pist-methodology`, `pist-evidence-investigator`, `pist-experiment-designer`, `pist-method-codifier` | Lab | Shell ARCHIVE when comfortable |
| Site Audit | Lab skill (**GAP**) | **`site-audit`** (author when site_url + exact yes) | Lab | Do **not** resurrect bot |
| Clip Bot | Studio skills | `clip-pack-from-one-recording`, `find-the-clippable-moments`, `cut-a-clip`, `clip-captions-and-post-copy`, … | Studio | Deferred until content cadence |
| Video Edit Desk | Studio | same media family + `footage-intake`, `transcribe-a-recording`, … | Studio | Deferred until content cadence |
| PR Hygiene / Researchy / Copy Humanizer | Atlas-run skills | `pr-hygiene-digest`, `grok-cli-research-pass`, `edit-a-draft` / `rewrite-a-draft` / `anti-slop-pass` | Relay / Lab / Studio | Hidden; delete when ready |
| Handoff probe / Prompt Pack Librarian | Atlas skills / archive | `agent-handoff-status-discipline` | Command | ARCHIVE_OK |

---

## 4. SKILL PORTFOLIO - approved 2026-09-06

Decision grade: implemented in this record. Grok skill MERGE NOW: implemented+draft-tested 2026-09-06 ~17:45 PT. Preserve existing entry points as thin aliases where needed. No source skill deletions in this pass.

| Action | Canonical entry / source skills | Reason |
|---|---|---|
| KEEP | `agent-handoff-status-discipline`, `permission-delta-approval`, `ops-dual-writer-check` | Evidence, authority, and Brief ownership are distinct checks. |
| KEEP | `opportunity-screen`, `pr-hygiene-digest` | On demand, draft/propose only. Friday automation stays OFF. |
| MERGE | `getting-started` -> thin pointer to Desktop `START_HERE.md` | One onboarding source. Deleted -2/-3 clones stay retired. |
| KEEP | `prompt-adapter-optimizer` | Intake skill using Prompty engine; activation held pending Prompty branch integration. |
| KEEP + MERGE | `pist-methodology` absorbs `pist-evidence-investigator`, `pist-experiment-designer`, `pist-method-codifier` as modules | One PIST entry with distinct evidence/experiment/learning steps. |
| KEEP | `grok-cli-research-pass` | General research beyond PIST. |
| KEEP + MERGE | `edit-a-draft` absorbs `rewrite-a-draft` and `anti-slop-pass` as modes/checks | One editing entry. |
| KEEP | `draft-for-a-channel` | New channel-specific drafts. |
| KEEP + MERGE | `audit-repair-govern` absorbs `pilot-test-activate`, `workflow-automation-decision`, `forge-ephemeral-worker-plan` as optional steps | One governance procedure; retain authority, evaluation, and rollback gates. |
| KEEP | `declutter-housekeeping`, `public-share-security-audit` | Local archive and pre-distribution checks are distinct; neither grants sending authority. |
| DEFER | `openrouter-expert-panel`, `site-audit` | Real research need or site_url required; no credential chase. |
| DEFER | `grok-bot-organization-discovery-architecture`, `grok-bot-system-design` | Reopen only for an evidenced structural problem. |

Media stays deferred until a recording and recurring output need exist. Then use existing `clip-pack-from-one-recording` as the entry:
- `short-clips-from-a-long-video`: alias to that entry.
- `footage-intake`, `find-the-clippable-moments`, `cut-a-clip`, `cut-from-your-notes`, `platform-versions-and-delivery-check`: modules.
- `transcribe-a-recording` + `captions-and-transcript`: one transcript/caption stage.
- `clip-captions-and-post-copy`: use `draft-for-a-channel`.
- `build-the-voice-profile`, `learn-from-what-shipped`: defer until shipped examples exist.

Relay remains connector capabilities, not a bot. Notion Brief access from Grok is read-only. Sending/publishing remains separately gated.

---

## 5. ROUTINES (keep ids; fix ownership)

| Routine id | Display | Current owner | Final owner (propose) | Enabled |
|---|---|---|---|---|
| `monday-sole-writer-proof` | Monday sole-writer proof | **Atlas** | **Atlas** | yes (live-applied 2026-09-05 ~23:05 PT) |
| `weekday-brief-observation` | Weekday Brief observation | **Atlas** | **Atlas** | yes (live-applied 2026-09-05 ~23:05 PT) |
| `morning-brief-auditor` | Morning Brief auditor | Atlas | Atlas, READ_ONLY | yes, rehomed September 6 |
| `integrator-sunset-hide-reminder` | Integrator sunset hide | Integrator | Already hidden September 6 | no |
| `friday-pr-hygiene` | Friday PR hygiene | Integrator | keep id | **OFF** per September 6 record; exact yes to enable |
| Alfred weekly/monthly/quarterly | (keep ON) | Alfred | keep | **ON** (2026-09-05 ~23:10 PT) |

---

## 6. UX INFORMATION ARCHITECTURE (names Claude/Cursor must use)

**OS context:** [MAIOS.md](./MAIOS.md) — IA naming map for bots/skills/teams inside MAIOS.

```
COMMAND
  Intake (Atlas)   — sole front door
  Policy (Alfred)  — governance

CONTROL PLANE
  Fleet Ops      — observes (service)
  Forge          — proposes candidates (service)
  Gatekeeper     — evaluates / promotes (service)
  Cleanup (Housekeeper) — hygiene (durable)

TEAMS
  Relay          — systems / connectors
  Studio         — production / content
  Lab            — research / analysis

ACTIVE WORK / RECENT
  projects · runs · traces   — ephemeral workers live HERE, not sidebar
```

---

## 7. Approved profile patches - Grok writer only

**Superseded for Description text:** use [MAIOS-DESCRIPTION-PACK.md](./MAIOS-DESCRIPTION-PACK.md) Set A (personal) / Set B (share). Apply in Grok UI only; return NAMING-PROOF. Historical §7 blocks below kept for audit trail only.

Approved by Meshal in this Codex task on 2026-09-06. Application grade: implemented (descriptions applied+read back 2026-09-06 ~17:40 PT). Skill MERGE NOW: implemented+draft-tested 2026-09-06 ~17:45 PT (aliases retained; media/deferred untouched). Keep all three names unchanged. Apply through Grok Settings or UpdateAgent, never through Windows file edits or browser agents. Read back exact descriptions before marking implemented/verified. Skill lists live in section 4, not descriptions.

**Atlas** (`022c46fa-8324-48bf-99ee-33cfaa2e437b`)
> Sole ordinary inbox. Triage, draft, research, and route work through skills and bounded handoffs. Stage 1: shadow and draft. Audit the Morning Brief read-only; Notion Custom Agent is its sole writer. No ambient send, spend, publish, delete, commit, merge, or approval. Use permission-delta checks and Meshal's exact yes where required.

**Alfred** (`06c419c1-bc8f-4e47-84d9-30bc76bbda0d`)
> Governance only. Review policy, inventory, evaluations, and routine health. Recommend zero new bots by default. Atlas is the sole ordinary inbox. Propose changes with evidence; do not mutate bots without Meshal's exact yes.

**Housekeeper** (`d8951031-3172-429c-8c4c-61995de564fd`)
> Local Desktop and Downloads declutter. Inventory first; archive only within approved scope to Downloads\_archive\ with a manifest. Protect the Desktop SSOT, repositories, and active handoffs. Permanent deletion requires Meshal's exact yes. Route decisions through Atlas.

## 8. Remaining gates and retirement

Keep visible (live aliases until GROK-RENAME-PROOF): Intake/Atlas, Policy/Alfred, Cleanup/Housekeeper.

### Deprecated shell sunset schedule

| Shell | Earliest delete consider | Gate |
|---|---|---|
| Handoff Integrator | 2026-10-03 | Meshal exact yes; Morning Brief auditor already on Atlas; Friday PR OFF |
| Fleet Ops Auditor | after hide + skill exercise | Meshal exact yes; run `ops-dual-writer-check` via Atlas |
| Site Audit | after hide + skill exercise | Meshal exact yes; `site-audit` needs `site_url` before skill value |
| Product Idea Stress Test (PIST) | after hide + skill exercise | Meshal exact yes; run `pist-*` via Atlas |
| Clip Bot | after hide + skill exercise | Meshal exact yes; Studio deferred until content cadence |
| Video Edit Desk | after hide + skill exercise | Meshal exact yes; Studio deferred until content cadence |

Keep all legacy shells hidden until replacement skills are exercised and unique material retained. Do not resurrect durable bots for Lab, Studio, or Relay.

TEMP Delete candidates, Meshal sidebar right-click Delete only, after checking unique handoffs and enabled routines:
- New Bot consolidator: `2afea7ed-973c-47b6-8769-2acfb87dbedc`
- New Bot orphan: `0a1d0735-3798-4057-8a41-4ab82a75ba90`
- Optional session shell (naming pack): `9f620b76…` — **GONE** (GROK-HIDE-PROOF); do not re-list as delete target
- Audit orphan TEMP: `d5fb3dcc…` — hidden; Delete only with `yes delete` + GROK-DELETE-PROOF
- Cleanup / orphan TEMPs: `2afea7ed…`, `0a1d0735…` — same

Already deleted from disk (do not re-list as live): `d3f5c47b…`, `78b7ea0b…`, `ff12b236…`.

Integrator: keep hidden; do not delete before 2026-10-03 without exact yes. If still visible, Hide in UI (hide flag mismatch possible).

Plan approval does not substitute for target-specific exact yes for permanent Deletes. Friday PR stays OFF; activation needs exact yes. No new durable bots are recommended or authorized by this cleanup. No skill deletion, repository publishing, credential rotation, or connector expansion in this pass.

No new dashboards, routers, or service runtimes. Fleet Ops, Forge, and Gatekeeper are capability labels only. Defer typed taxonomy changes until repository work requires them.

---

Historical addenda below are retained verbatim. September 6 current sections and DECISIONS supersede their live-status and approval-queue claims.

## 9. Addendum 2026-09-05 ~22:06 PT (Claude Code review)

Full naming-taxonomy review against PR #1 (`alawein/ops-control-plane-grok`, 53 tests passing, 58 files changed) and this pack. Verdict: PR #1 and this CANON already agreed on structure and names before this review; no Grok-vs-Claude realignment was needed. Code (tested) is the anchor for spelling; this doc got patched to match it and to stop contradicting itself.

Changes made this pass:
- Split section 2 into Planes (Command, Control Plane, Teams) and Teams (Relay, Studio, Lab only). Section 2 previously called Command and Control Plane "teams," contradicting section 6's own diagram and PR #1's mermaid.
- Applied exact yes (2026-09-05, Meshal): rename "New Bot (temp continuator)" to "Temp Continuator"; rehome `monday-sole-writer-proof` + `weekday-brief-observation` to Atlas. Recorded in section 1, section 5, section 8 above, and in `agents.yaml` / `routines.yaml` notes. **LIVE-APPLIED 2026-09-05 ~23:05 PT** by Grok Bot session: UpdateAgent rename on `d3f5c47b-4253-4851-958b-eb63dd26562b`; Atlas created both routines (`5 8 * * 1` and `15 8 * * 1-5`, enabled); Temp Continuator deleted both. "Not yet live-applied" notes cleared.
- Added `ops-shared-inventory/migration.yaml`, mirrored verbatim from the repo's `shared-inventory/migration.yaml` (it did not previously exist on Desktop). It is the code-consumed alias table (`kind` / `destination` / `agent` per legacy name). `MIGRATION-BOTS.md` stays as the separate human-readable status table; both now note the split.
- `INVENTORY-SCHEMA.md`'s file list was 6 files behind what actually lives in this folder; updated.

Flagged, not done (out of scope for a doc-only pass): `migration.yaml`'s `team:` field holds plane values, the same plane/team overlap fixed in section 2 above, but fixing it means a code and type change in `control-plane/src/inventory/types.ts`, not a doc edit.

Could not do from this session: append a ledger line under `/workspace/pilot/ledger.md` per `INVENTORY-SCHEMA.md` edit rule 7, that path is on the box and unreachable from here. Someone with box access should add one.

No GitHub write was made in the Claude Code doc pass. Later: PR #1 squash-merged to main 2026-09-06 05:57 UTC; rename + routine rehome live-applied 2026-09-05 ~23:05 PT.

## 9b. Live-apply 2026-09-05 ~23:05 PT (Grok Bot / box)

P0 from FRESH-SESSION-CONTINUATION-2026-09-06 complete:
1. Sidebar display: New Bot (`d3f5c47b…`) → **Temp Continuator**
2. Routines `monday-sole-writer-proof` + `weekday-brief-observation` now owned by **Atlas** (enabled); removed from Temp Continuator
3. Cleared pending notes in `agents.yaml`, `routines.yaml`, `workflows.yaml`, and CANON §§1/5/8/9

## 9c. Full-approval live-apply 2026-09-05 ~23:10 PT

Meshal: full approval on remaining exact-yes queue + stop asking for GitHub/OpenRouter keys.

Applied:
1. Friday PR hygiene → enabled on Integrator (`0 9 * * 5`)
2. Alfred weekly/monthly/quarterly → enabled
3. Hidden from sidebar: Temp Continuator, Finalize (temp), New Bot leftover, Fleet Ops Auditor, Site Audit, PIST, Clip Bot, Video Edit Desk
4. Deleted skills `getting-started-2` and `getting-started-3` (kept [getting-started](sand-workflow:getting-started))
5. Standing rule: never nag for PATs/API keys; use existing connectors/auth only
6. `site-audit` skill still blocked (no `site_url`); Integrator hide remains 2026-09-19

