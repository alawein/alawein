---
type: internal
source: slack cursor dm 2026-09-10
sla: none
last_updated: 2026-09-10
audience: [ai-agents, contributors]
---

# Control-gap source index (2026-09-10)

Working packet list for the Claude Code red-team. This file is a pointer
index. It is not a catalog, not Slack SSOT, and not a career dashboard.
Do not commit the ChatGPT career export. It contains personal and
immigration material.

Label every later claim `PROVED`, `OBSERVED`, `INFERRED`, `UNVERIFIED`,
`BLOCKED`, or `GAP`.

## 1. Native git (authoritative for policy)

| ID | Path or URL | Role | Status |
| --- | --- | --- | --- |
| G1 | `docs/governance/control-plane.md` | Admission, envelopes, receipts | On [PR #252](https://github.com/alawein/alawein/pull/252) (`bfb49cbf`). *GAP* on `main` until merge |
| G2 | `schemas/run-envelope.schema.json` | Envelope schema | Same PR |
| G3 | `scripts/catalog/validate_run_envelope.py` | Read-only checker | Same PR |
| G4 | `catalog/examples/run-envelope.example.yaml` | Observed-read example | Same PR |
| G5 | `docs/governance/operating-model.md` | Roles, delivery path | On `main` |
| G6 | `docs/governance/work-record-taxonomy.md` | Field writers | On `main` |
| G7 | `docs/governance/unified-agent-system.md` | Inventory and Slack dispatch | On `main`. Opening now points at G1 only after #252 lands. Current text names kit 1.7.0. Changelog v1.4.3 still records 1.6.0 as history |
| G8 | `catalog/agent-integrations.yaml` | Machine inventory | `lastVerified` 2026-09-07 |
| G9 | `prompt-kits/AGENT.md` | Shared session kit 1.7.0 | On `main`. `parent-version` 1.6.0 |
| G10 | `docs/style/VOICE.md` | Voice | On `main` |
| G11 | `docs/governance/slack-agent-voice.md` | Slack thread voice | On `main` |
| G12 | `docs/governance/slack-agent-runbook.md` | Channels and bots | 2026-09-19 gate. Changelog v1.4.0 records kit 1.6.0 as history |
| G13 | `AGENTS.md`, `CLAUDE.md`, `SSOT.md` | Repo instruction trio | On `main`; #252 adds G1 pointers |
| G14 | `LESSONS.md` | Short observed bullets | #252 adds control-gap bullets |
| G15 | `config/model-routing.yaml` | OpenRouter routes | `lastVerified` 2026-08-27. Routes: fast, code, code_batch, reason, reason_fast, docs, heavy |
| G16 | `scripts/ops/openrouter_route.py` | OpenRouter caller | `--model` override, `--stdin`, `--list-routes`. Loads key from `~/.openrouter.env` / `.env.local` |
| G17 | `docs/internal/practices-handbook.md` | Living practices | Draft [PR #251](https://github.com/alawein/alawein/pull/251) only. *GAP* on `main` |
| G18 | `docs/internal/plans/2026-09-08-kernel-canonicalization.md` | Occupancy and untracked laptop files | On `main`. Names the two *GAP* handoff files in section Occupancy |
| G19 | `docs/internal/kernel-skills-drift-mapping-2026-09-08.md` | Desktop inventory vs catalog | On `main`. Reads `Desktop/ops-shared-inventory/*.yaml` as comparison only |
| G20 | `docs/governance/documentation-contract.md` | Governed-doc freshness | On `main`. `docs/internal/` is doctrine-exempt |
| G21 | `docs/internal/audits/2026-09-05-slack-integrations-rescan.md` and `2026-09-06-slack-integrations-rescan.md` | Slack lane evidence | On `main`. Codex `needs_auth` / ChatGPT replaced |
| G22 | `scripts/tests/test_run_envelope.py` | Envelope unit tests | On PR #252 only |

## 2. Slack canvases (working pointers, not SSOT)

| ID | Canvas | Last useful write | Use |
| --- | --- | --- | --- |
| C1 | MAIOS operating model `F0C0A1H7258` | 2026-09-08 | ACCEPT 1,2,4,5,6. Stale open-PR rows (#232/#239 closed 2026-09-09). *OBSERVED* |
| C2 | Lane inventory `F0C0KEF150C` | 2026-09-09 | Cursor Cloud filled. Codex, Notion AI Slack, GitHub Slack, Kilo, Grok empty. Do not retag. *PROVED* |
| C3 | Cursor Cloud cleanup `F0C1PDU320G` | 2026-09-10 | Keep/retire/reconfigure. Scope-proved block is stale vs current `main` (session-log dirt, leftover probe branch, "only #249", main 19 behind). *PROVED* |
| C4 | SUPERSEDED set named on C1 | 2026-09-08 | Emptied bodies. Leave marked. Meshal UI delete after 2026-09-19 |

Do not @Cursor on a canvas. That spawned idle Cloud Agents. Do not treat a
canvas fold as acceptance.

## 3. Attached analyst packets (this Slack turn)

These live in the Cloud Agent upload dir. They are evidence of what other
front ends produced. They are not git.

| ID | File | Origin | Commit? |
| --- | --- | --- | --- |
| A1 | `ChatGPT-Career_status_dashboard-20260910-0345_*.md` | ChatGPT `6aa1d277` 2026-09-09 14:41 to 2026-09-10 03:45. Two uploads (`_260e`, `_678a`), same chat | **No.** PII. Career, Gmail, immigration |
| A2 | `Gemini-Report_7ea7.md` | Gemini deep-research, 4-tier practice library. No repo access | Quote structure only |
| A3 | `MAIOS_Unified_Operating_Model_8fe1.md` | Draft merge of control plane + 4-tier, 2026-09-10. Calls itself Tier 4 | Quote structure only |
| A4 | `Claude_Code___Finalized_Workflow_Synthesis_Prompt_6fcb.md` | Prompt asking Claude Code for a fifth workflow SSOT | May be cited. Replaced by the red-team prompt |
| A5 | Sider Operator paste in Slack, 2026-09-10 | Linux `workspace-brain`, Cursor dashboard as Meshal Ultra | Quote in judgement |

## 4. Scattered or missing named files

| Claim | Verdict |
| --- | --- |
| `HANDOFF-CURSOR.md` | *GAP* in git, Drive (near-miss response file), Notion, Downloads |
| `docs/internal/handoffs/2026-09-08-maios-system-map-gpt-6-astra.md` | Named in G18 as untracked on a laptop checkout. *GAP* in this Cloud git |
| `docs/internal/plans/2026-09-08-maios-system-map-generator.md` | Same. *GAP* here |
| `probe_integrations.py` / 2026-09-08 integration probe | On leftover branch `cursor/integration-probe-1170`. *GAP* on `main`. PR #239 closed |
| Desktop `ops-shared-inventory/{agents,workflows,routines}.yaml` | Exists per Grok 2026-09-08 and G19. Operator inbox. Not git SSOT |
| Linux `knowledge/objects/` on `workspace-brain` | Sider SoR claim. Not alawein canon |
| Windows `~/.cursor` agents/skills/mcp twins | Sider 2026-09-07. *UNVERIFIED* from Cloud |
| ChatGPT spine `00/10/20/30/40` | Do not copy into Cursor projects (Sider) |
| `TASKS.md` / second inventory YAML / Canvas SSOT | Forbidden. Do not create |
| `Desktop/AGI` / AGI Inc / `theagi.company` | Quarantine. Never import, copy, summarize, or operate on |
| `docs/operations/session-log.md` | Dirt. Do not commit from Cloud sessions |
| `docs/internal/handoffs/2026-06-07-fleet-sweep.md` | Old handoff on `main`. Historical. Not current SoR |

## 5. Naming canon (use these strings)

| Use | Do not use |
| --- | --- |
| `MAIOS` for the operating idea | `MAI` unless a named exception is proved in git |
| `Kohyr` (Cache Me Outside LLC) for the company | Treating Kohyr as the control-plane repo |
| `alawein/alawein` / `core/alawein` for this control plane | `alawein-hub` (retired). Historical clone path in `docs/internal/plans/2026-06-20-portfolio-conformance-execution.md` is archive, not a revival |
| `workspace-brain` as Kilo Linux mirror / backup | Windows MAIOS SoR |
| `ops-shared-inventory` as Desktop operator inbox | Git or dispatch SSOT |
| Kit `prompt-kits/AGENT.md` 1.7.0 | Treating changelog 1.6.0 rows as current kit |
| Account `contact@meshal.ai` | Other Google or GitHub accounts |
| Slack team `T0APHHXJV4J`, command `#admin-ops` | Routing into `#me-agents-*` before 2026-09-19 |
| ChatGPT Slack `U0BUNH33CCA` = replaced | Tagging `@ChatGPT` |
| Grok = Windows / Meshal-user MCP | Installing `@Grok` bot |

`Astra` in `gpt-6-astra` is a missing handoff filename. It is not an
OpenRouter model id until `GET https://openrouter.ai/api/v1/models` lists it.

## 6. Open PRs that collide with this packet

| PR | Topic | Note |
| --- | --- | --- |
| #252 | Control-plane contract | Draft. CI green at `bfb49cbf`. Merge is Meshal exact yes |
| #251 | Practices handbook | Draft. *GAP* on `main` |
| #250 | Auto architecture diagram | Ready. Same class as old #236 |

Leftover remote: `cursor/integration-probe-1170` (closed #239). Delete after
Meshal confirms.

## 7. What this index forbids

- Copying A1 into git
- Promoting C1, C2, or C3 to SSOT
- Treating A2, A3, or A4 as accepted policy
- Treating A5 SoR swap as accepted
- Creating `TASKS.md`, a second inventory YAML, or a MAIOS Slack app
- Running the OpenRouter panel from a Cloud agent unless Meshal asks
- Updating canvases unless Meshal names the canvas id
