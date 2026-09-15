---
type: canonical
source: none
sync: manual
sla: on-change
title: MAIOS Grok Bot naming canon
category: governance
audience: [contributors, ai-agents]
status: active
last_updated: 2026-09-15
tags: [maios, grok-bot, personal-ops]
---
# NAMING-CANON — Scheme A
**Status:** ACTIVE-SSOT (Windows)  
**Promoted from:** `NAMING-CANON-PROPOSAL.md` (SUPERSEDED)  
**Unison:** `UNISON-a8a70f08-NAMING-2026-09-07.md`  
**Locked architecture:** [MAIOS.md](./maios-charter.md) Approach A  
**Date:** 2026-09-07  
**Live Grok:** Meshal attested rename 2026-09-07 ~08:52 PT → Intake / Policy / Cleanup (`GROK-RENAME-PROOF-2026-09-07.txt`). Historical Names Atlas / Alfred / Housekeeper are aliases for maios_id only.

---

## Why

Atlas / Alfred read as two inboxes. Housekeeper tone clashes. Planes sound like bots. Fix names; keep structure.

## Bots (UI)

| Role | Historical Name | Canon UI name | maios.* | maios.* alias |
|---|---|---|---|---|
| Sole inbox | Atlas | **Intake** | `maios.command.intake` | `maios.command.atlas` |
| Governance | Alfred | **Policy** | `maios.command.policy` | `maios.command.alfred` |
| Local hygiene | Housekeeper | **Cleanup** | `maios.control.cleanup` | `maios.control.housekeeper` |

**Do not** name any bot MAIOS. **Do not** add durables. Live Grok is not mutated from Windows disk.

### Labels (Set A PERSONAL)

| Bot | Label |
|---|---|
| Intake | Front door · triage · research |
| Policy | Governance · portfolio · reviews |
| Cleanup | Local hygiene · Desktop · Downloads |

### Description stems (keep gates)

- **Intake:** Sole ordinary inbox. Triage, draft, research, route via skills. Brief auditor R/O; Notion Custom Agent sole Brief writer. No ambient send/spend/publish/delete/commit/merge/approve/git push without Meshal exact yes.
- **Policy:** Governance only. Policy, inventory, evals, routine health. Default zero new durables. Not the ordinary inbox.
- **Cleanup:** Inventory Desktop/Downloads first; archive in approved scope with manifest. Permanent delete needs exact yes. Route decisions through Intake.

## Planes (display gloss; IDs stay)

| ID (locked) | Display gloss |
|---|---|
| `command` | Direct |
| `control` | Rules |
| `teams` | Work |

## Teams / services

| Kind | Keep / change |
|---|---|
| Teams Relay · Studio · Lab | keep |
| Services | Fleet Ops → **Ops**; Forge → **Build**; Gatekeeper → **Access** (labels only) |

## Workflow types (max 8; skills not bots)

| Type | Meaning | Typical owner |
|---|---|---|
| triage | sort, route, propose | Intake |
| draft | write / rewrite | Studio skills |
| research | gather, cite | Lab skills |
| review | approval framing, audit | Policy |
| hygiene | disk cleanup | Cleanup |
| brief-audit | Morning Brief dual-writer check | Intake R/O |
| handoff | MAIOS-HANDOFF packet | Relay skills |
| eval | promote / rollback labels | Access (service) |

## Rejected (from panel)

- Steward / Janitor / Mailroom (metaphor or tone clash)
- Verb-first Sort/Guard/Prune (collides with CLI verbs)
- Putting Cleanup under `teams` (wrong plane)

## Brand lane (not a keeper)

**Brand** is a workflow **LANE**, not a bot and not a Scheme A keeper. Public-surface inventory lives in `BRAND-MATRIX-2026-09-09.md`. Do not name any bot Brand, Marketing, Social, or MAIOS. Keepers stay Intake / Policy / Cleanup (+ Editorial QC). X handle split: `X-HANDLE-MATRIX-2026-09-09.md`.

## Career lane (not a keeper)

**Career** is a workflow **LANE under Intake**, not a bot and not a Scheme A keeper. Pipeline doctrine lives in `CAREER-PIPELINE-2026-09-09.md`. Do not name any bot Career, Recruiter, Jobs, or MAIOS. Gmail stays RO classify (Swarm 4.4 stub). Outbound/apply need Meshal exact yes. Keepers stay Intake / Policy / Cleanup (+ Editorial QC).

## Apply order

1. ~~Promote proposal → this file~~ DONE (Windows SSOT).
2. Update `MAIOS-DESCRIPTION-PACK.md`, `agents.yaml` `ui_name` + `maios_id`, `BOTS-SKILLS-TEAMS-CANON.md`, `MAIOS.md` role table.
3. Meshal (or Intake UpdateAgent under live alias Atlas): Grok Edit Profile for three keepers.
4. Paste style + role card on Grok / ChatGPT.
5. Alias period: docs say `Intake (Atlas)` until `GROK-RENAME-PROOF` exists.


