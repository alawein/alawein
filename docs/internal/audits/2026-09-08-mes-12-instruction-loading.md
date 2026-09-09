---
type: audit
status: draft
last_updated: 2026-09-08
owner: meshal
---

# MES-12 instruction-loading evidence (A05)

Cursor Cloud run `bc-27c04412-e217-4651-84dc-bf6cf7a88d07`
(https://cursor.com/agents/bc-27c04412-e217-4651-84dc-bf6cf7a88d07).
Lane: Cursor A05 only. Linear:
[MES-12](https://linear.app/meshal/issue/MES-12)
(Define solo-maintainer execution and independent tool review).
Account: `contact@meshal.ai`. Brand: MAIOS (human); wire IDs `mai.*`.

This note is Cloud Cursor evidence for the instruction-loading slice of
MES-12 remaining acceptance. It is not MES-12 organizational acceptance.
It is not local Cursor evidence. It is not local system-map acceptance.

## OK / HOLD / BLOCK

**OK**

- MES-12 policy text is already on `main` in
  `docs/governance/operating-model.md` (people and agents; track source
  presence, installation, instruction loading, and behavioral verification
  separately) and `docs/governance/work-record-taxonomy.md` (change
  evidence).
- This Cloud session loaded repo `AGENTS.md`, `CLAUDE.md`,
  `.cursor/rules.md`, and `.cursor/rules/*.mdc`.
- Repo catalog already uses Scheme A UI names
  (`catalog/index.yaml` MAIOS about line; `docs/internal/kernel-skills-drift-mapping-2026-09-08.md`).
- Bounded instruction update on this branch: `.cursor/rules.md` and
  `docs/governance/claude-code-configuration-guide.md` now state MAIOS
  naming and keep the Windows home mirror as a separate local surface.

**HOLD**

- Windows home naming mirror was not present on this Cloud VM:
  no `~/AGENTS.md`, no `~/.codex/AGENTS.md`, no
  `~/.cursor/rules/agents-md-global.mdc`, no
  `~/.cursor/prompts/global-standards.md`. Local Cursor instruction-loading
  stays unverified from this run.
- Notion Systems Architecture KB (2026-09-07) still says
  "Atlas/MAIOS ops SSOT". Desktop SoR is
  `Desktop/ops-shared-inventory/NAMING-CANON.md` (not readable here).
  No Notion Brief write from this lane.
- Independent review: not performed. Default reviewer when Cursor
  executes is ChatGPT; Slack `@ChatGPT` is replaced. Self-review is
  separate.
- MES-12 stays In Review until Meshal records organizational acceptance
  against the Linear issue. A merged or open PR is evidence, not Done.
- #239 stays open Draft (`e582e72` already on that branch). #232 stays
  parked. #238 keeps the R10 freshness land; this PR does not copy that
  freshness bump.

**BLOCK**

- None for this bounded evidence lane.
- Do not merge this PR as MES-12 Done.
- Do not spend, rotate secrets, or write Notion Briefs from this lane.

## Surfaces (do not collapse)

| Surface | Authority | This run |
| --- | --- | --- |
| Cursor Cloud instruction load | Repo `AGENTS.md`, `CLAUDE.md`, `.cursor/rules.md`, `.cursor/rules/*.mdc` | Proved loaded |
| Local Cursor instruction load | Windows `~/AGENTS.md` linked to `~/.codex/AGENTS.md` and `~/.cursor/rules/agents-md-global.mdc` | Unverified (paths absent on Cloud VM) |
| Local system-map | Laptop files such as `docs/internal/handoffs/2026-09-08-maios-system-map-gpt-6-astra.md` | Out of scope; different acceptance |
| MES-12 organizational acceptance | Linear MES-12, Meshal final decision | Pending |

## Naming reconcile (instruction-update only)

Stale human names in older notes: Atlas, Alfred, Housekeeper as live
roles. Current Scheme A: Intake (`mai.command.intake`), Policy
(`mai.command.policy`), Cleanup (`mai.control.cleanup`), Editorial
(`mai.quality.editorial`). Historical Atlas/Alfred/Housekeeper IDs remain
aliases only.

This branch updates the repo Cursor instruction surface so Cloud sessions
load current names. It does not edit the Windows home mirror (not on this
VM). It does not fold Desktop `ops-shared-inventory` into git.

## Out of scope (left untouched)

- A09 research-KB backlog (separate Cloud run)
- PR #232 (parked), #238 (R10 freshness), #239 (Draft, no merge)
- Prompt kit version, `catalog/agent-integrations.yaml`
- Secret rotation, spend, Notion Brief writes
- Local system-map generator or handoff files

## Change evidence

| Field | Recorded value |
| --- | --- |
| Source | Linear MES-12; MAIOS handoff T3 A05; Cloud run `bc-27c04412-e217-4651-84dc-bf6cf7a88d07` |
| Work kind | docs / research (evidence note) |
| Author | Git author on the branch (`contact@meshal.ai`) |
| Executor | Cursor Cloud Agent, scope: A05 MES-12 instruction-loading evidence only |
| Independent reviewer | Not performed this turn |
| Checks | Listed on the PR after the local doctrine commands run |
| Final approval | Pending Meshal |
| Acceptance | Prepared evidence only. Not MES-12 organizational acceptance. |
