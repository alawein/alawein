---
type: canonical
source: none
sync: manual
sla: on-change
title: MAIOS bots and teams map
category: governance
audience: [contributors, ai-agents]
status: active
last_updated: 2026-09-15
tags: [maios, grok-bot, personal-ops]
---
# BOTS AND TEAMS - live map (UI-synced)
**verified_at:** 2026-09-14T18:22:00-07:00 (evening CONTINUE Job A; Job C PASS; quiet-week observation PAUSED; auditor ON; FLEET-SCAN-2026-09-14-evening-continue.md)
**SoR for names/visibility:** disk `profile.json` + `settings.json` (this file mirrors them)
**SoR for naming doctrine:** `BOTS-SKILLS-TEAMS-CANON.md` (deeper; this file wins on *live* status)

**Legacy aliases (historical only):** Atlas->Intake, Alfred->Policy, Housekeeper->Cleanup.

---

## How the UI maps to disk (do not invent other paths)

| UI surface | Disk field | How to change |
|---|---|---|
| Sidebar **label** | `profile.json` -> `name` | `UpdateAgent` name=. / per-agent Settings gear |
| Sidebar **visibility** | `settings.json` -> `hidden_from_sidebar` **and** `hiddenFromSidebar` (set both) | hide via settings; permanent remove = sidebar right-click **Delete** |
| Persona / instructions | `profile.json` -> `description` | `UpdateAgent` description=. / Settings gear |
| Routines list (info pane) | `automations/*/automation.json` -> `enabled`, `schedule` | routines skill / update_state |
| Notifications | `settings.json` -> `notifyOnAgentUpdates` | update_state settings / Settings gear |
| Per-agent pane | click agent name in chat header (or Cmd+Shift+I) | gear opens name/title/description/notifications |

**Match rule:** After any rename/hide, rescan disk and bump `verified_at` in `agents.yaml` + this file. If YAML != `profile.name`, **disk/UI wins** - patch YAML.

**Sidebar sections:** no custom sections configured (ListSections empty) - all agents sit in the default sidebar list; planes/teams below are **labels only**, not UI folders.

---

## Visible bots (should appear in sidebar)

| UI name (`profile.name`) | id | Role | Plane | Routines ON / notes |
|---|---|---|---|---|
| **Intake** | `022c46fa-8324-48bf-99ee-33cfaa2e437b` | Sole ordinary inbox (Scheme A keeper; desc owns fleet-scan + midday triage; Autonomy AUTO/AUTO+LOG rail) | Command | monday-sole-writer-proof (Mon 08:05); weekday-brief-observation PAUSED/disabled (quiet week; disk enabled=false); morning-brief-auditor ON (Mon-Fri 08:10); grok-realign-outer-loop (Mon-Fri 08:20); sticky-board-weekly-prune (Fri 09:00); research-stack-health (Mon 10:00); weekday-fleet-scan (Mon-Fri 08:25); weekday-fleet-triage (Mon-Fri 12:25). Skill: fleet-scan-orchestrate Jobs A/B/C |
| **Policy** | `06c419c1-bc8f-4e47-84d9-30bc76bbda0d` | Governance only (Scheme A keeper; desc Autonomy AUTO/AUTO+LOG rail) | Command | disk enabled=false: weekly-company-grok-bot-improvement-review; monthly-bot-portfolio-strategy-review; quarterly-company-ai-operating-model-review (PRESENT; do not treat as ON; re-enable only with Meshal Approve:) |
| **Cleanup** | `d8951031-3172-429c-8c4c-61995de564fd` | Local declutter only (Scheme A keeper; desc Autonomy AUTO/AUTO+LOG rail) | Control Plane | weekly Desktop/Downloads; midweek temp sweep |
| **Editorial** | `2b5c2ff8-66c7-43b1-b93e-9c141c772b89` | Writing QC (Scheme A keeper; desc Autonomy AUTO/AUTO+LOG rail) | Quality | - |

Scheme A VIS keepers only. FoldKeeper and Local Operator must not appear here (ABSENT on disk). BLOCK fifth keeper.

## Hidden bots (Hidden chats / not ordinary sidebar)

| UI name | id | Class | Maps to |
|---|---|---|---|
| TEMP - Lessons Collector | `ba79a549-76ae-4a69-99e5-f4c1a840767e` | HIDDEN TEMP still active; sunset ~2026-09-28 then DELETE - | Quality/observer; proposal-only; do not promote |

Do not promote TEMP. Prefer DROP/KEEP wording (no KILL). Integrator early Deleted 2026-09-14 (ABSENT before HOLD ~2026-10-03); do not resurrect.

## Optional stubs (PRESENT; not Scheme A)

| UI name | id | Class | Notes |
|---|---|---|---|
| TEMP - Lessons Collector | `ba79a549-76ae-4a69-99e5-f4c1a840767e` | optional PRESENT / TEMP / HIDDEN / sunset ~2026-09-28 | Quality/observer; proposal-only; not Scheme A; live hide h1=h2=true; KEEP until sunset then DELETE -; do not promote |

Optional only - may be deleted later via UI Delete; not board delete-now. Former stubs 9cbcbf40 / e87d90b8 and TEMP cleaner 923cf465 no longer optional PRESENT (ABSENT).

## ABSENT (do not list as live / do not resurrect)

| UI name | id | Notes |
|---|---|---|
| HOLD - Handoff Integrator | `44a4c45b-b9e3-41e7-b081-c220a08ac26e` | ABSENT 2026-09-14 early Delete (folder gone); was HIDDEN transitional HOLD until ~2026-10-03; do not resurrect |
| DELETE - New Bot | `9cbcbf40-237e-4a20-9fea-188dd130d3ee` | ABSENT 2026-09-14; folder gone from agents/; was DELETE-ready HIDDEN; do not resurrect; not Scheme A |
| DELETE - New Bot stub | `e87d90b8-cbf7-4772-ba95-c7afaf0c00b7` | ABSENT 2026-09-14; folder gone from agents/; was DELETE-ready HIDDEN; do not resurrect; not Scheme A |
| DELETE - New Bot stub | `d6bdede7-7a22-4a15-a886-1bd608b02b31` | ABSENT 2026-09-14; profile removed; was DELETE-ready HIDDEN; do not resurrect; not Scheme A |
| DELETE - TEMP cleaner | `923cf465-9755-4597-b043-0afbb16c6413` | ABSENT 2026-09-14; profile removed from agents/; was DELETE-ready HIDDEN; do not resurrect; not Scheme A |
| Fleet Ops Auditor | `027264b0-e757-4841-aa47-c0504404ed36` | ABSENT; 5/5 delete-now DONE; skill `ops-dual-writer-check` |
| Site Audit | `648b29ed-f3ee-4686-b792-dc0841f7aa68` | ABSENT; Lab skill gap until `site_url` |
| Product Idea Stress Test | `889ba701-125d-4acc-8357-408fa64455f6` | ABSENT; `pist-*` skills |
| Clip Bot | `90b95597-e729-455b-99f0-5ab3a51c9da5` | ABSENT; Studio clip skills |
| Video Edit Desk | `f826e37f-8870-4c58-b3f6-00a738610d71` | ABSENT; Studio media skills |
| FoldKeeper | `960ff09a-37f2-4347-94a2-516d338ca665` | ABSENT 2026-09-13; profile removed; board DONE |
| Local Operator | `9e2d0a13-cb64-4b96-9cfc-2a3e8e53fd59` | ABSENT 2026-09-13; profile removed; board DONE |
| New Agent (blank) | `78b7ea0b-1672-4b47-b1ac-a924a712e7c7` | ABSENT 2026-09-13 |
| New Agent (blank) | `d3f5c47b-4253-4851-958b-eb63dd26562b` | ABSENT 2026-09-13 |
| New Agent (blank) | `ff12b236-2072-49c1-805d-d787ba10dda9` | ABSENT 2026-09-13 |
| New Bot (blank) | `c644ced2-616f-4430-8260-0a45c701b33b` | ABSENT 2026-09-14; superseded by ba79a549 TEMP-Lessons-Collector |
| New Bot (blank) | `f2816dc9-...` | ABSENT (earlier) |

Gone from box (do not re-add): `09793d6d`, `d5fb3dcc`, `9f620b76`, `2afea7ed`, `0a1d0735` (prior delete pack CLOSED).

**Historical footnote:** Five DEPRECATED rollback shells (Fleet Ops Auditor, Site Audit, PIST, Clip Bot, Video Edit Desk) were hidden PRESENT until UI Delete; closeout `control/handoff/DEPRECATED-SHELLS-DELETE-CLOSEOUT-2026-09-13.md`. Pack `control/handoff/FLEET-DELETE-PACK-DEPRECATED-SHELLS-2026-09-13.md`: **5/5 delete-now DONE** (not OPEN). Handoff Integrator ABSENT early Delete 2026-09-14 (before HOLD ~2026-10-03).

## Planes and teams (NOT sidebar bots)

```
COMMAND          -> Intake, Policy
CONTROL PLANE    -> Cleanup (services: Fleet Ops, Forge, Gatekeeper - names only)
QUALITY          -> Editorial
TEAMS
  Relay          -> connectors (GitHub/Slack/Notion/.)
  Studio         -> copy + media skills
  Lab            -> research + PIST (+ site-audit later)
```

Do **not** create sidebar bots named Forge, Gatekeeper, Fleet Ops, Relay, Studio, or Lab.

## Simplified target fleet

**Keep forever (4 Scheme A):** Intake · Policy · Cleanup · Editorial  
**Optional PRESENT (not Scheme A):** TEMP - Lessons Collector ba79a549 (HIDDEN; sunset ~2026-09-28)
**ABSENT (not live):** HOLD - Handoff Integrator 44a4c45b (early Delete 2026-09-14) · DELETE - New Bot 9cbcbf40 · DELETE - New Bot stub e87d90b8 · DELETE - TEMP cleaner 923cf465 · 5 deprecated shells (delete-now DONE) · FoldKeeper · Local Operator · prior blank New Agent stubs  
**BLOCK:** fifth durable keeper

## Swarm v1 (keepers only)

These four Scheme A visibles **are** Swarm v1 keepers. Coordination contract: [SWARM-V1-CONTRACT.md](./SWARM-V1-CONTRACT.md). Do **not** create a Swarm-named bot, Relay, Studio, Lab, Forge, Gatekeeper, Fleet Ops, or MAIOS-as-bot. Execute remains **HOLD** until Meshal exact yes (docs/propose-only pack may land first).


## Sync checklist (run after any bot change)

1. Read `profile.json` + `settings.json` for touched agents  
2. Confirm sidebar label == intended `name`  
3. Confirm `hidden_from_sidebar` == `hiddenFromSidebar`  
4. Update `agents.yaml` + this file `verified_at`  
5. If CANON disagrees on *live* status, patch CANON or mark superseded - don't leave two truths  

## Anti-patterns
Dual front door · mega-router · per-capability durable bots · docs saying Intake while UI shows a different primary label · YAML `routines: 0` while automations exist · snake/camel hide key drift



