---
type: canonical
source: none
sync: manual
sla: on-change
title: MAIOS personal decision ledger
category: governance
audience: [contributors, ai-agents]
status: active
last_updated: 2026-09-15
tags: [maios, grok-bot, personal-ops]
---
# DECISIONS — do not re-litigate
**Updated:** 2026-09-15 PT (action protocol terminal fold; #299 Cursor-first on alawein main) - Append-only.

## 2026-09-15 - Action protocol terminal CLI folded (OBSERVED)

- **OBSERVED:** Native terminal consume path landed on the bridge (`scripts/actionprotocol`: `status`, `enter`, `palette`, `render-json`, `resolve`). Spec copied into this pack. Runtime stays on `ops-shared-inventory` (`python -m scripts.actionprotocol.cli`). Default `SOR_COMPAT=0`. `/keep v0` policy unchanged.
- **GIT:** Grok-thin Cursor-first docs landed on `alawein/alawein` via [#299](https://github.com/alawein/alawein/pull/299) squash `1ccf54e7` (2026-09-15T05:39:31Z). Overlapping [#298](https://github.com/alawein/alawein/pull/298) CONFLICTING; close as superseded (do not squash).
- **BOUND:** No FLEET-BOARD write. No Grok Name/Description/routines/memory apply. No curses TUI. No `git init` of this pack or the bridge.
- **EVIDENCE:** `docs/superpowers/specs/2026-09-14-action-protocol-v0.md`; bridge `control/handoff/AUTOLOG-ACTION-PROTOCOL-TERMINAL-2026-09-15.md`; `control/handoff/AUTOLOG-GROK-THIN-ENFORCE-2026-09-14.md`.

## 2026-09-14 - MAIOS v1 architecture lock (LOCKED)

- **DECISION/APPLY:** Meshal `Approve: stamp MAIOS v1 architecture lock to DECISIONS`.
- **DONE:** v1 lock is doctrine, not only a bridge checker. Six locks: `product_boundary: control_plane_only`; `runtime: invoke_on_demand`; `integrations_now: github, grok_native, cursor, notion_brief_ro, slack_pointer`; `stack: python_powershell_markdown_yaml`; `git_strategy: local_unversioned_pack`; success `cold_start_orient`, `system_status`, `deterministic_handoffs`, `audit_receipts`, `zero_authority_conflicts`.
- **FORBID:** `invent_alawein_maios_remote`; `sync_daemon`; `tauri_desktop_v1`; `fifth_keeper`; `brief_dual_write`; `grok_identity_from_windows`.
- **BOUND:** `Authority: maios is MISSING`. Do not invent `alawein/maios`. Do not `git init` the pack, the bridge, or Dropbox. `alawein/alawein` `docs/governance/control-plane.md` remains Git governance SSOT. No v1 Tauri/React/SQLite desktop app. `lab/maios-dashboard` remains KEEP; remote/deploy HOLD. No FLEET-BOARD write from this stamp. No Grok Name/Description/routines/memory apply. Host Readiness H01-H14 remain unpassed.
- **EVIDENCE:** pack this entry; bridge `control/catalog/maios-v1-architecture-lock.yaml`; `docs/superpowers/specs/2026-09-14-maios-v1-architecture-lock.md`; `python -m scripts.maios_v1.check_architecture_lock` exit 0; `control/handoff/RECEIPT-MAIOS-V1-ARCHITECTURE-LOCK-2026-09-14.md`.

## 2026-09-14 - Greenfield G1/MQ1/MQ2 + B1 C (LOCKED)

- **DECISION/APPLY:** Meshal batch (Cursor chat): pick most-recommended options end-to-end.
  - `Boundary: C` (full inventory boundary; MQ1)
  - `Authority: maios is MISSING` (GitHub `alawein/maios` HTTP 404 reconfirmed 2026-09-14)
  - B1 option **C**: discard dirty `docs/operations/session-log.md` (+11 duplicate rows), attach `core/alawein` to `main`, ff to `origin/main`
- **DONE:** `core/alawein` clean on `main` @ `3aa64cc0` (0 ahead / 0 behind `origin/main`). Was detached `0f2a7240`.
- **BOUND:** GitHub remote `alawein/maios` remains MISSING. Local pack `Desktop/GitHub/solo/alawein/maios` stays cutover-B Windows fleet doctrine pack (not GitHub-backed). `alawein/alawein` `docs/governance/control-plane.md` remains Git SSOT for governance delegation. Desktop `RESPONSE-STYLE.md` + `~/AGENTS.md` remain Cursor voice/policy adapters. Do not demote those without a separate G2. No Grok Name/Description/routines apply. No FLEET-BOARD write. No DELETE duplicate clones (C2 still needs dirty-diff proof).
- **GROK ALIGN PATH:** Windows writers use handoff packets + SSOT only; live Grok apply still needs `Approve: APPLY grok-align scheme-a-rev-g` after native confirm.
- **EVIDENCE:** bridge `control/handoff/BATCH-G1-B1C-GROK-BUS-2026-09-14.md`; greenfield spine MQ1/MQ2; authority ledger § Gate G1.

## 2026-09-14 - Fold greenfield + Agent OS into maios pack docs (OBSERVED; G1 closed later same day)

- **OBSERVED:** Cutover B live pack is `Desktop/GitHub/solo/alawein/maios`. Bridge `ops-shared-inventory` holds receipts/lint/archive. Cursor Agent OS (`AGENT-OS.md`, response-style + job-orchestration skills, stop/session hooks, model-by-difficulty) landed and copied into this pack under `docs/superpowers/`.
- **DOC FOLD:** Updated `MAIOS.md`, `START_HERE.md`, `MAIOS-OPERATING-MAP.md` to match on-disk cutover; added CURRENT-STATE (worker) + Agent OS copies. No FLEET-BOARD mutate. No Grok apply. No DELETE clones.
- **SUPERSEDED OPEN:** Authority line closed in entry above (`MISSING` on GitHub).
- **EVIDENCE:** bridge `control/handoff/AGENT-OS-ENFORCE-RECEIPT-2026-09-14.md`, `SSOT-POINTER-RETARGET-2026-09-14.md`, greenfield spine §14–§16.

## 2026-09-14 - LQ-018 skills>bots vigilance stamp (doctrine LOCKED; board OPEN)

- **DECISION:** skills>bots / no fifth durable sidebar bot remains **LOCKED** (Authority Graph 2026-09-14; Scheme A four keepers only). LQ-018 stays **OPEN on FLEET-BOARD as Policy vigilance** only — not a doctrine reopen.
- **MIRROR:** Prefer skills/KEEP over new durable bots (LC-004; LC-031). Teams Relay/Studio/Lab/Forge/Gatekeeper/Fleet Ops stay skill/service names.
- **BOUND:** Do not create a fifth keeper; do not promote TEMP Lessons Collector to Scheme A.
- **RELATED OPEN (not stamped DONE):** LQ-017 write-set + `base_rev` before parallel Desktop applies (LC-027) — land command/template. LQ-020 kit PR merge != adapter stamp (LC-032) — land checklist after kit bump.
- **EVIDENCE:** `control/LESSONS-QUEUE-2026-09-14.md` LQ-017/018/020; `control/MAIOS-LESSONS-CURATED-CATALOG-2026-09-14.md`; FLEET-BOARD rows `lq-018-skills-gt-bots-vigilance-2026-09-14`, `lq-017-write-set-base-rev-2026-09-14`, `lq-020-kit-pr-ne-adapter-stamp-2026-09-14`.



## 2026-09-14 - SA-08 Grok config drift repair + Integrator C2 (LOCKED)

- **DECISION/APPLY:** Meshal `Approve: set Integrator both hide keys true (44a4c45b); no Delete; no unhide.` and `Approve: SA-08` standing authority for reversible Grok configuration drift repair when a deterministic eval proves the intended value from doctrine; must not alter identity, memory, routines, permissions, inbox ownership, external actions, or other hard-gated surfaces; AUTO+LOG with before/after, verification, rollback.
- **DONE:** Integrator `44a4c45b` settings before `(true,false)` after `(true,true)`; dual-hide-key golden `checked=7 mismatches=0`. SA-08 standing ACTIVE.
- **BOUND:** No Delete; no unhide beyond equalizing keys to doctrine-hidden; no Name/Description/memory/routines; no hard-gate verbs.
- **EVIDENCE:** `control/handoff/AUTOLOG-C2-SA08-2026-09-14.md`; `control/evals/dual-hide-key/`; live settings.json read-back.


## 2026-09-14 - MAIOS autonomy-by-default adopt (LOCKED)

- **DECISION/APPLY:** Meshal `Approve: adopt MAIOS autonomy plan 2026-09-14, including AUTO / AUTO+LOG / hard-gate model and SA-01..07, and execute G1–G3 now under their assigned owners.`
- **DONE:** Principle Autonomy by default / Approval by exception / Evidence always. Standing SA-01..08 active (SA-08 added same day). G1 getting-started AUTO+LOG; G2 fleet mirror refresh AUTO+LOG; G3 dual-hide-key golden AUTO+LOG; C2 Integrator dual-hide equalized `(true,true)` with golden mismatches=0. SA-08 narrow: eval-proven reversible Grok config drift only.
- **HARD GATES unchanged:** send, spend, publish, permanent delete, commit, push, PR create/close/merge/approve, consequential deploy, secret rotate, material permission expansion, Grok Name/Description/memory/routines, Brief body (Notion only), Friday PR enable, webhooks.
- **EVIDENCE:** `docs/superpowers/plans/2026-09-14-maios-autonomous-execution.md`; `control/handoff/AUTOLOG-G1-G3-AUTONOMY-ADOPT-2026-09-14.md`


## 2026-09-14 - Keeper health P0-P3 optimization (LOCKED)

- **DECISION/APPLY:** Meshal `Approve: all Ps (P0 Truth to P1 Measure to P2 Compound to P3 Fitness)` for keeper-health plan 2026-09-14.
- **DONE (doctrine):** Routine liveness gate - an **enabled** routine with **null `lastRunAt`** is **Blocked** (not green / not Ready). Evidence (real lastRunAt or demotion) is required before treating the routine as live.
- **SEQUENCE:** P0 Truth to P1 Measure to P2 Compound to P3 Fitness (liveness before evals before doctrine fitness).
- **BOUND:** No new durable bots; no webhooks without separate Approve:; C-profile P2 parked on Drive remount; stubs remain human UI Delete; Policy sole-commits FLEET-BOARD; Intake commissions Research Stack Health + Grok realign (rev g) tonight.
- **OPEN work:** board row `keeper-health-liveness-evals-2026-09-14` (goldens, mirror CI dry-run, force formerly-null routines lastRunAt or demote).
- **EVIDENCE:** `control/handoff/KEEPER-HEALTH-PANEL-SYNTHESIS-2026-09-14.md`; `control/handoff/openrouter-keeper-health-panel-2026-09-14.md`.




## 2026-09-14 - RESPONSE-STYLE rev g waiting-source LOCKED

- **DECISION/APPLY:** Meshal `Approve: apply RESPONSE-STYLE rev g to Desktop SoR` (Exact-yes equivalent accepted).
- **DONE:** Desktop `RESPONSE-STYLE.md` stamped rev g (2026-09-14 PT); response surface replaced with optional Ready/Waiting/Blocked posture + waiting-source lanes (On you / On system / Blocked / Parked / Next); chat gate phrase `Approve:`; Notes plain Lesson:/Todo:; `control/catalog/RESPONSE-SURFACE-PLANS-V0.md` twins rewritten; golden fixtures A-J + Gemini Flash grill prompt landed under `control/handoff/`.
- **KEEP:** Authority rails unchanged (Intake inbox; Policy sole FLEET-BOARD; Cleanup MOVE+manifest; Editorial QC; Notion Custom Agent sole Morning Brief). Soft 250; American spelling; no em dashes; Scheme A; Dual SoR Desktop policy SoR.
- **MIGRATE:** Exact-yes -> Approve: in new chat/status copy only. Historical DECISIONS / AGENTS / Policy list Exact-yes strings not mass-rewritten. Legacy Exact-yes paste remains valid gate equivalent.
- **HOLD:** Account-synced Cursor User Rules UI; ChatGPT/Claude.ai web pastes; native Grok profile apply of `GROK-STYLE-PASTE.md` (Grok owner only); ChatOutput code lint updates (separate plan).
- **BOUND:** No FLEET-BOARD edit by non-Policy agents. No Notion Brief write. No mass archive rewrite.
- **EVIDENCE:** `docs/superpowers/specs/2026-09-14-response-style-rev-g-design.md`; `docs/superpowers/plans/2026-09-14-response-style-rev-g.md`; `control/handoff/RESPONSE-STYLE-REV-G-APPLY-RECEIPT.md`.


## 2026-09-14 - Authority Graph + Board Exhaust (LOCKED)

- **DECISION:** Adopt Authority Graph + Board Exhaust as MAIOS ops doctrine:
  1. Field-level sole writers: `profile.json` = Grok-only bot identity; `FLEET-BOARD.md` = Policy sole commit; Desktop SoR = doctrine; Notion Custom Agent = Brief body; `agents.yaml` / `BOTS-AND-TEAMS.md` = generated mirrors from disk rescan.
  2. Board Exhaust: FLEET-BOARD rows are exhaust of gated work; required fields id/title/owner/status/next_action/blocked_by/acceptance/last_verified/evidence; ROT if last_verified >14d; Policy cannot wave-close with ROT nonempty; `fleet-board-sync` is a thin reconcile skill (no daemon).
  3. Teams (Relay/Studio/Lab/Forge/Gatekeeper/Fleet Ops) remain skill/service names - no new durable sidebar bots.
  4. Swarm execute-lite may proceed under separate exact-yes (Slack RO + gh RO + one MAIOS-HANDOFF; webhooks deferred).
- **WHY:** Sep 13 OpenRouter panel consensus (board rot); ARCH-2026-09-14 research; locks Scheme A / Dual SoR B / skills>bots.
- **IMPACT:** No fifth keeper. No sync daemon. Policy sole board writer unchanged.
- **APPLY:** Meshal exact yes 2026-09-13 PT: commit two OPEN board rows and append Authority Graph DECISIONS. Policy governance review of handoff af8665ae.
- **BOUND:** No create durable bots; no sync daemon; no Brief dual-write; no webhook install; no ambient send/merge; do not promote TEMP New Bot.
- **EVIDENCE:** `research-briefs/ARCH-2026-09-14-authority-graph-swarm-execute-lite.md`; `control/handoff/DOCTRINE-PROPOSE-AUTHORITY-GRAPH-2026-09-14.md`; Swarm RO closeouts under `control/handoff/SWARM-EXECUTE-LITE-*`.



## 2026-09-13 — Stamp adapters to kit 1.8.3 / RESPONSE-STYLE rev f
- **DECISION/APPLY:** Meshal exact yes `stamp adapters 1.8.3` after #264 merge.
- **DONE:** `~/AGENTS.md` + `~/.codex/AGENTS.md` twins; `~/.cursor/rules/agents-md-global.mdc`; `~/.claude/CLAUDE.md`; `~/.claude/rules/maios-response-style.md`; `~/.github/copilot-instructions.md`.
- **HOLD:** Cursor account-synced User Rules UI (separate from disk rule); ChatGPT/Claude.ai web pastes still human; Downloads kit paste files 1.8.2 may lag.
- **EVIDENCE:** this entry; AGENTS twins hash-equal; kit tip `c9eb9aa`.

## 2026-09-13 — alawein/alawein #264 MERGED (kit rev f / AGENT 1.8.3)
- **DECISION/APPLY:** Meshal exact yes `merge 264`.
- **MERGED:** squash `c9eb9aa` — Cite RESPONSE-STYLE rev f in AGENT.md 1.8.3 (#264).
- **NOTE:** Resolved Copilot thread on live adapters still citing 1.8.2/rev e; admin merge after Work taxonomy FAIL (policy_drift open records) + Kilo ACTION_REQUIRED.
- **HOLD:** Stamp Desktop/home AGENTS + Cursor rule twins to 1.8.3 / rev f (separate apply).
- **EVIDENCE:** https://github.com/alawein/alawein/pull/264 · main tip `c9eb9aa`.

## 2026-09-13 — RESPONSE-STYLE rev f + iterate loop (approved apply)
- **DECISION/APPLY:** Meshal approved all plans and started iterative loop (dual rich/terminal panels, Next/Notes, lesson distill).
- **DONE:** rev f SoR + RESPONSE-SURFACE-PLANS-V0; ChatOutput `missing-next`; skill `control/skills/lesson-distill`; `Propose-LessonDistill.ps1` + autopilot task; PLAN future section updated.
- **BOUND:** Kit git stamp and ~/.cursor sessionStart still HOLD separate exact yes.
- **EVIDENCE:** `docs/superpowers/plans/2026-09-13-response-iterate-lesson-distill.md`; pytest chatoutput. Deeper history: box `knowledge/DECISIONS.md`, pack `DESIGN-DECISIONS.md`.

## 2026-09-12 — Graphite CLI install + auth
- **DECISION/APPLY:** Meshal “Approve and continue” + Graphite onboarding paste (install CLI + `gt auth`).
- **DONE:** `npm i -g @withgraphite/graphite-cli@stable` → `gt` 1.8.6; authenticated as **alawein** (token stored under user Graphite config, not in SoR).
- **HOLD:** Graphite onboarding steps 3–5 (create PR, stack, Slack notifications) need a real repo workflow + Meshal Slack enable.
- **SECURITY:** Auth token was pasted in chat — **rotate/revoke** at https://app.graphite.com/settings/cli and issue a new one. Do not re-paste into SoR files.
- **BOUND:** No uncapped PR spam; no meshal merge without `promote it`.

## 2026-09-12 — Run A: coding distill + MOL P3–P8
- **DECISION/APPLY:** Meshal “you have my exact yeses, go” for two-run batch; Run A = this Desktop SoR apply.
- **DONE:** Distill freeze `docs/superpowers/specs/2026-09-13-maios-coding-distill-design.md`; Run B pack `control/handoff/RUN-B-OUTSIDE-PACK-2026-09-13.md`; MOL P3–P8 (registry solo path + DualSoR verify paths; OPERATING-LAYER-V0; plan-home copies + README; write-set/handoff/receipt/autopilot scripts + pytest; adapters catalog; vault INDEX stray map pointer cleaned).
- **VERIFY:** Dual-SoR T1–T10 EXIT 0; `Test-RegistryKitPath` EXIT 0; pytest `control/tests/test_write_set_claim.py` 4 passed; START_HERE one `## Current operating layer`.
- **BOUND:** Run B human/UI outside; P9+ parked; no `~/.cursor` hook edit; no OpenRouter spend; no meshal `promote it`; no Grok profile writes.
- **EVIDENCE:** this entry; `.superpowers/sdd/2026-09-12-maios-minimal-operating-layer/progress.md`.

## 2026-09-12 — MAIOS ID residual scrub (`mai.*` → `maios.*`)
- **DECISION/APPLY:** Meshal “MAIOS all the way, cleanup MAI. everywhere.” Live Desktop SoR uses `maios.*` IDs, `maios_id`, and `MAIOS-HANDOFF` only. Completes residual drift left after `MAIOS-ID-RENAME-RECEIPT-2026-09-12.md`.
- **MAP:** `MAI-HANDOFF` → `MAIOS-HANDOFF`; bare `mai.` machine-ID prefix → `maios.`; `mai_id` → `maios_id`.
- **BOUND:** `archive/` untouched (historical evidence). CSV move manifests that quote on-disk historical filenames left as path literals. Rename-receipt map file kept as evidence of the first pass.
- **EVIDENCE:** this entry; root `HANDOFF-TEMPLATE.md`; `SWARM-V1-CONTRACT.md`; `AGENTS.md`.

## 2026-09-13 — Remaining optional steps YES-applied
- **DECISION/APPLY:** Meshal YES all remaining/optional. Archive A/B/C already archived (UI Unarchive). Kit rev e via #263 already on main. Linear/Slack/HF MCP auth refreshed. Claude paste packet staged. S4 closed ABSENT. Receipt: `control/synthesis/2026-09-13-dual-sor-b-wave-close/deferred/REMAINING-APPLY-2026-09-13.md`.
- **BOUND:** OpenRouter still needs named job. No sync daemon.

## 2026-09-13 — Synthesis vault Approach B (C0–C8) deployed
- **DECISION/APPLY:** Meshal exact-yes (“most comprehensive and autonomous approach”). Desktop synthesizer at `control/synthesis/2026-09-13-dual-sor-b-wave-close/`. Lands Prompt B artifacts, evidence corpus **copy**, deferred lanes (W5/W7/Grok/Cleanup/settings/S4). No Downloads KEEP MOVE; no Cloud archive; no Grok profile mutation; no OpenRouter spend; no git prune.
- **EVIDENCE:** `control/synthesis/2026-09-13-dual-sor-b-wave-close/00-INDEX.md` · `MANIFEST.md` · START_HERE current synthesizer tip.

## 2026-09-13 — Dual SoR B WITH PATCHES: #262 landed; inventory PR wave closed
- **DECISION/APPLY:** Meshal exact-yes (UNIFIED_PLAN rev 1 Approach A). Squash-merged `alawein/alawein#262` after resolving review threads. Last inventory land. No third catalog PR.
- **MERGED WAVE:** #258 `d1912c3f` · #259 `0b168adf` · #260 `5a5fb225` · #257 `8bb8e532` · #261 `fdffcf36` · #262 `3e63f204` (2026-09-13T02:21:51Z).
- **main tip:** `3e63f204` — Refresh Slack inventory from the 2026-09-13 live re-read (#262).
- **HOLD:** S4 local chat still absent. OpenRouter named-job still required before spend (cap USD 200/week set).
- **OPENROUTER:** Spend allowed with cap **USD 200 per week** (Meshal 2026-09-12). Still no uncapped swarm; name each spend job before launch.
- **KIT 1.8.0 PASTE:** Cursor User Rule updated; `~/AGENTS.md` + `~/.codex/AGENTS.md` + Claude rule + Copilot instructions + cursor mdc stamped with kit 1.8.0 (Desktop rev e still SoR). Slack Shared session posted to Meshal DM (2-part thread). ChatGPT Custom Instructions: Meshal confirmed loaded 2026-09-12 (ChatGPT reported kit 1.8.0 rich adapter available). Claude.ai web: file staged; prove still HOLD if unused.
- **PROMPT 10:** Intake YAML accepted 2026-09-13T02:46:09Z (`session_ref` 001070c5-c7f7-4380-859a-d28faa794a4e; status partial). Cloud acceptance in pack `CLOUD-ACCEPTANCE.md` + #admin-ops note.
- **DELTA B0–B6:** Subagent-driven closeout complete; final-review APPROVED. Ledger `.superpowers/sdd/delta-2026-09-13/progress.md`.
- **BOUND:** No Grok profile/routine/memory writes from Cursor. No sync daemon.
- **EVIDENCE:** https://github.com/alawein/alawein/pull/262 ; reconcile Prompt B chat; `Downloads\alawein-cloud-v1-2026-09-13\STATUS.md`; convergence plan `docs/superpowers/plans/2026-09-13-maios-session-convergence.md`

## 2026-09-12 — Evening PARK deleted (post-restart exact-yes)
- **DECISION/APPLY:** Meshal exact-yes delete `...\android-coding-phone-evening`. Removed; verify T5 PASS.
- **EVIDENCE:** `control/handoff/EVENING-DELETE-APPLIED-2026-09-12.md`

## 2026-09-12 — Dual SoR Cursor lane closed; evening delete after restart
- **DECISION:** No further Cursor Dual SoR implement work pending. Evening PARK delete deferred until after PC restart + Cursor project close + exact-yes.
- **EVIDENCE:** `control/handoff/CURSOR-DUAL-SOR-CLOSED-AWAIT-RESTART-2026-09-12.md`; residual apply receipt; verify EXIT 0.

## 2026-09-12 — Dual SoR B residual ops plan locked
- **DECISION:** Residual work from Grok POV is docs-only registry expand + entry links + M1–M5 + evening packet prepare. No sync daemon. Evening delete remains human-gated.
- **PLAN:** `docs/superpowers/plans/2026-09-12-dual-sor-b-residual-ops.md`
- **SPEC:** `control/handoff/GROK-DUAL-SOR-SYNC-STATUS-POV-2026-09-12.md`

## 2026-09-12 — Dual SoR B P1 verify + closeout
- **DECISION:** P1 report-only verifier landed; P2 shim gen declined (keep `canon_plus_host_filtered_adapters` 28/27/27). Dual SoR B Cursor-plane work closed.
- **EVIDENCE:** `scripts/dual-sor/Verify-DualSorT1T10.ps1` exit 0; `control/handoff/DUAL-SOR-B-FINAL-2026-09-12.md`; Grok paste `GROK-DUAL-SOR-B-PASTE-2026-09-12.md`.
- **HOLD:** evening PARK delete (human Cursor lock). **BLOCK:** phone KEEP mutate / Grok profile edits from this track.

## 2026-09-12 — Dual SoR B P0: phone canon + skill registry stub
- **DECISION:** Q9.1=(a) phone product skill canon = KEEP `.claude/skills`. Adapters = `.agents/prompts` + `.cursor/rules/outpost` via Outpost `install.py`. T3 expects 28/27/27 (`converge` Claude-only).
- **APPLY:** Created `CODING-PLANE-SKILL-REGISTRY.md`; ownership + red-team T3/T6 patched under grant `exact yes P0 docs Dual SoR B registry stub`.
- **BOUND:** No phone git mutate; no evening delete; no Grok profile edits; P1 verify script still HOLD.

## 2026-09-12 — Outpost content SoR for grill/prove/handoff-session; Claude mirrors
- **DECISION:** Q1=A Outpost wins for kit skill bodies. Claude `~/.claude/skills/{grill,prove,handoff}` refreshed from Outpost (handoff keeps slash name; Outpost id `handoff-session`).
- **Q2:** Evening folder stays PARK; stop delete retries.
- **EVIDENCE:** `control/handoff/OUTPOST-CLAUDE-SKILL-RECONCILE-2026-09-12.md`; backup `Downloads\_archive\run-20260912-063812-claude-skills-backup`.

## 2026-09-12 — Style length machine-enforced (Cursor stop)
- **DECISION:** Prompt-only stop hook was insufficient. Replace with command hook `~\.cursor\hooks\maios-stop-style.py` calling ChatOutput `lint-output`. Add chat soft cap 250 prose words (`too-long`) unless requested doc shape.
- **WHY PRIOR FAILED:** Style lived in docs/rules; lint omitted length; stop hook was non-deterministic prompt.
- **IMPACT:** Failures emit one rewrite follow-up (`loop_limit` 1). Docs still exempt via `#` / `##` shape.

## 2026-09-10 — RESPONSE-STYLE dual-environment adapters (rev c)
- **DECISION:** Primary status stays plain `OK` / `HOLD` / `BLOCK`. Surface adapters: optional rich overlay (emoji and/or HTML) only where the renderer is known; CLI and terminal surfaces use ASCII-only primary words (no emoji-primary status).
- **SoR lock:** `Desktop/ops-shared-inventory/RESPONSE-STYLE.md` rev c when the SoR header is bumped (propagate pass found SoR still rev b; adapter pointers landed; SoR bump HOLD).
- **IMPACT:** Adapters point at SoR; ChatOutput remains alias of the SoR contract, not a parallel style system.

## 2026-09-09 - Exact yes to all post-closure gates
- **DECISION:** Meshal: "You have exact yes to all" for `POST-CLOSURE-GATE-QUEUE-2026-09-09.md`.
- **APPLY:** Cursor executes WC registry PR, P6 CI PR, P1/P2 workflow consolidate, cutover green-bar, secrets UNPARK (Meshal UI rotates).
- **BOUND:** Grok profile fields = Grok UI only; Integrator Delete = Meshal sidebar; Android = other session; Slack rename needs target name; Brief observation continues.
- **EVIDENCE:** `EXACT-YES-APPLY-2026-09-09.md`

## 2026-09-09 - Career pipeline Optimize B docs
- **DECISION:** Career track v1 Optimize B docs landed 2026-09-09 on Desktop SoR (`CAREER-PIPELINE-2026-09-09.md`). Career = LANE under Intake not keeper; Gmail RO classify mirrors Swarm 4.4 stub; ambient send/apply BLOCK; outbound HOLD for Meshal exact yes; Phase 7 umbrella refreshed.

## 2026-09-09 - Brand matrix Optimize A docs
- **DECISION:** Brand track v1 Optimize A docs landed 2026-09-09 on Desktop SoR (`BRAND-MATRIX-2026-09-09.md`). Brand = LANE not keeper; public mutations HOLD; X OAuth HOLD; Career Optimize B docs DONE; outbound HOLD.

## 2026-09-09 - Benchmarks Top-20 landed
- **DECISION:** Benchmarks Top-20 landed 2026-09-09 on Desktop SoR (`MAIOS-BENCHMARKS-TOP20-2026-09-09.md`). Optimize A execute DONE; Brand not started.

## 2026-09-09 - Swarm v1 Option C doctrine locked
- **DECISION:** Swarm v1 Option C doctrine locked 2026-09-09. Scheme A keepers Intake/Policy/Cleanup/Editorial; Slack+GitHub active; Gmail RO + Linear ELSEWHERE stubs; webhooks deferred; Desktop doctrine pack.
- **IMPACT:** Execute HOLD until exact yes. No routine enable, bots, webhooks, commit/push/merge from design alone.
- **EVIDENCE:** `SWARM-V1-CONTRACT.md`; `.superpowers/specs/2026-09-09-maios-swarm-v1-design.md`.

## 2026-09-09 - Desktop-first hybrid SSOT codified
- **DECISION:** Desktop-first hybrid SSOT codified 2026-09-09. Desktop `ops-shared-inventory` wins; `/workspace` mirrors disposable; forbidden writers deny list in MAIOS.md; one-writer map refreshed in place.
- **IMPACT:** Agents must treat box copies as non-authoritative for operator doctrine. Registry cutover remains HOLD. No Brief writes from Grok.
- **EVIDENCE:** `.superpowers/plans/2026-09-09-maios-ssot-desktop-hybrid.md` Tasks A-E execute receipt.

## 2026-09-09 — R2: delete KB tracked registry + archive freeze repos
- **DECISION:** Execute exact-yes gates: delete tracked `knowledge-base` `registry/repos.json` after consumer green; archive `ops-control-plane-grok` and `workspace-brain`.
- **DONE:** Archives live (`archived: true`). Rollback tag `rollback/kb-registry-present-20260909`. Delete cutover via pin + sync (PR #47).
- **NOTE:** Decision A (retain brain as mirror) is superseded for archive by this exact R2 phrase; mirror docs remain historical in the archived repo.
- **IMPACT:** WC remains desired-state SoR; KB generates projection; freeze repos no longer active.

## 2026-09-09 — workspace-brain retain as Linux mirror (A)
- **DECISION:** Option **A**. Keep `alawein/workspace-brain` as documented Linux mirror + weekly backup only. Not Windows MAIOS SoR. Not a second control plane.
- **DONE:** Desktop DECISIONS entry; CONSTITUTION/OPS-RUNTIME language PR on brain clarifying mirror role.
- **HOLD:** Archive remains R2 (`Approve archive alawein/workspace-brain`) only after backup/mirror consumers move.
- **REJECTED for now:** Option B (migrate-then-archive) until a written migration checklist exists.
- **IMPACT:** Do not treat brain as desired-state registry or Windows doctrine writer.

## 2026-09-09 — Fleet voice DROP for convergence
- **DECISION:** DROP optional fleet voice (kcompiler em-dash + dotclaude README) from MAIOS convergence completion criteria.
- **IMPACT:** Convergence DONE does not depend on those repos.

## 2026-09-07 — Sole-writer evidence PASS (structure)
- **DECISION:** Accept `SOLE-WRITER-EVIDENCE-2026-09-07.md`. Notion brief present; Slack #posts pointer-only at 09:00:05 PT.
- **UNVERIFIED:** Custom Agent author field in Notion MCP.
- **GAP:** Grok Intake auditor log not on Windows host.
- **IMPACT:** Meshal may paste Sider one-liner from evidence file.

## 2026-09-07 — Phase B PR reviews complete
- **DECISION:** Accept independent PASS for #224, #225, #226, #229 (reports under `cohesion-handoff-2026-09-07/PHASE-B-*.md`). No merges.
- **HOLD:** Exact-yes per PR before merge; sole-writer evidence; Slack/Notion writes.
- **NOTE:** #224/#226 bases still behind main `8bb7f202`; rebase may be needed before merge.

## 2026-09-07 — Grok style pasted + cohesion ZIP ingest
- **DECISION:** Accept Meshal `style pasted` (~09:00 PT). Kit B closed. Ingest Perplexity ZIP `Cursor Cohesion Handoff (1).zip` SHA-256 `709e11a134b4ca618b93ab7455463148cb861804fe2069c7239fed4cdb61cde5` match True → `cohesion-handoff-2026-09-07/`.
- **HOLD:** Sole-writer after 09:15; cohesion Phase A–E live verify; no merge/send without exact yes.
- **IMPACT:** MAIOS UI sync complete except optional ChatGPT 07c refresh. Cohesion work becomes primary Cursor track.

## 2026-09-07 — GROK-STYLE-PASTE corrupt repair + post-rename SSOT
- **DECISION:** Prior `GROK-STYLE-PASTE.md` blurb was corrupt (truncated Cleanup line). Replaced with complete fence. ChatGPT pack → rev 2026-09-07c + NAMING-CANON.md. agents.yaml: rename_proof_at set; historical_ui_name replaces live_ui_alias.
- **HOLD:** Meshal must re-paste fixed Grok Instructions; sole-writer after 09:15 PT.
- **IMPACT:** Do not paste the corrupt blurb; use current GROK-STYLE-PASTE.md only.

## 2026-09-07 — Meshal UI rename + ChatGPT (reported 08:52 PT)
- **DECISION:** Accept Meshal report: Grok Names/Descriptions → Intake/Policy/Cleanup; ChatGPT instructions pasted. Proof stub `GROK-RENAME-PROOF-2026-09-07.txt`.
- **HOLD:** Kit B Grok Instructions style paste; sole-writer evidence after 09:15 PT; optional Description snippets in proof file.
- **IMPACT:** Live alias period ending; SSOT and live Names align on Meshal attestation.

## 2026-09-07 — MASTER-PROCEED disk apply (self-contained)
- **DECISION:** Meshal authorized end-to-end apply in this chat. Phase 0 peers ABSORBED-SKIP (`PEER-GAP-ABSORB-2026-09-07.md`). Windows SSOT Scheme A flip: Intake/Policy/Cleanup + maios.command.intake|policy + maios.control.cleanup. Live Grok aliases Atlas/Alfred/Housekeeper until GROK-RENAME-PROOF.
- **DONE:** `NAMING-CANON.md`, `agents.yaml`, `MAIOS.md`, `MESHAL-UI-APPLY-KIT.md`, paste packs, `AGENTS.md`+Codex twin, `SOLE-WRITER-WAIT.md`, `APPLY-REPORT-2026-09-07.md`, plan under `docs/superpowers/plans/`.
- **HOLD:** Meshal UI rename+pastes; sole-writer after 09:15 PT; peer dumps if ever recovered.
- **BLOCK:** Inventing peer plans; inventing Mon PASS; claiming live Grok rename without proof.
- **IMPACT:** Disk SSOT speaks Scheme A; sidebar may still show old names until Meshal kit.

## 2026-09-07 — Master proceed + peer ac9553fa
- **DECISION:** Accept `MASTER-PROCEED-2026-09-07.md` as today’s ordered human path (Phases 0–5). Naming still gated on exact-yes rename / keep / defer.
- **PEER:** `ac9553fa-4a5d-4787-b861-0656c7efce10` NOT FOUND on this host (same class as `a8a70f08`); both HOLD until dump or open.
- **IMPACT:** One proceed SoR; do not fan out parallel “next lists.”

## 2026-09-07 — Naming Scheme A + peer unison (a8a70f08)
- **DECISION:** Propose function-first UI names Intake / Policy / Cleanup (aliases Atlas / Alfred / Housekeeper until exact-yes + Grok UI). Plane IDs stay command/control/teams; display gloss Direct/Rules/Work. Teams Relay/Studio/Lab keep. Services labels Ops/Build/Access.
- **SORfiles:** `NAMING-CANON-PROPOSAL.md`, `MAIOS-ROLE-CARD.md`, `UNISON-a8a70f08-NAMING-2026-09-07.md`; paste packs refreshed.
- **HOLD:** Peer chat `a8a70f08-6005-40a0-8a42-90cbc7f4ed3b` not readable on this host (Composer resume miss); peer dump into unison file required before CLOSED.
- **HOLD:** Live Grok rename + ChatGPT/Grok UI paste apply (Meshal).
- **BLOCK:** New durables; dual naming SoR; treating Claude Orchestrator as MAIOS inbox.
- **IMPACT:** Windows SSOT proposal ready; live fleet names unchanged until exact-yes.

## 2026-09-07 — Unison pass (coding-plane + SSOT)
- **DECISION:** Accept `archive/status/2026-09/MAIOS-UNISON-2026-09-07.md`. Cursor Context7 stays plugin-only; VS Code uses User env quartet; Claude plugins enable quartet; Codex/Kilo stay lean unless a written SoR expands them.
- **LIVE:** Context7 `resolve-library-id` → `/vercel/next.js`; GitHub `get_me` → `alawein`.
- **CONNECTORS:** `connectors.yaml` verified_at refreshed; Grok error four remain DEFER; Windows `op.exe` noted (Grok ENOENT unchanged).
- **HOLD:** editor relaunch for process env; Sider `env done` ingest; Mon sole-writer evidence.
- **IMPACT:** Inventory consolidated; no MCP surface expansion.

## 2026-09-07 — VS Code MCP User env vars SET
- **DECISION:** Accept Cursor session set of all six User-scope MCP env vars (presence verified). Values never logged in DECISIONS.
- **SMOKES:** GitHub user API OK; Supabase project GET OK (ref=`kohyr`); Context7 search HTTP 200.
- **1Password:** Personal items titled `Supabase MCP vscode-mcp-maios-2026-09-07` and `Context7 MCP vscode-mcp-maios-2026-09-07`.
- **HOLD:** Relaunch VS Code/Cursor; optional rotate Supabase PAT if transcript exposure is a concern; tell Sider `env done`.
- **IMPACT:** Env HOLD from post-finalize closeout cleared on presence; runtime MCP still needs editor restart.

## 2026-09-07 — Sider post-finalize ingest (06:15 PT)
- **DECISION:** Accept `SIDER-POST-FINALIZE-2026-09-07`. Linux OK; Windows finalize ingested; `workspace-brain` pushed `3e2b87c`.
- **SYNC-BRIDGE:** **C1** locked for now (Windows sync-log SSOT; Linux INDEX summary after each Windows finalize). C2/C3 later if weekly twin reconciliation is wanted.
- **HEALTH:** Langfuse 83 traces; 4 crons healthy; gateway PID 715057; 71/16/12 exact; no Linux BLOCK.
- **HOLD (Meshal):** six Windows User MCP env vars (0/6); sole-writer ~08:00–09:15 PT; dashboard remote/Vercel on yes; KB FIN propose awaiting yes; 13 personal-* + catalog `local_path` PR.
- **WINDOWS:** `MAIOS-SYNC-LOG.md` second entry written. Cursor has nothing outstanding.
- **IMPACT:** Twin finalize closed on Linux side. Full close waits Meshal `env done` + sole-writer evidence.

## 2026-09-07 — Sider Linux intake CLOSED (04:20 PT)
- **DECISION:** Accept Sider status 2026-09-07 04:20 PT. All Linux open items CLOSED except KB captures (HOLD, need Meshal `file them`).
- **P1:** `alawein/workspace-brain` push LIVE. Remote HEAD `bb7edbb7ee82c85c8c32b766870e1292e4183729` on `master`. Deploy key authorized 04:17 PT. Weekly cron `workspace-brain-weekly-backup` Sun 04:30 PT enabled (next 2026-09-13).
- **Langfuse:** healthy Linux-only sink; 33 traces at 04:13 PT. Windows stays plugin-only (D9).
- **Inventory:** Linux = 71/16/12 exact; `ops-control-plane-grok` PRIVATE visible. Docs mirror committed on Linux (`bb7edbb`).
- **Windows deep dive:** already produced at `Desktop/ops-shared-inventory/archive/status/2026-09/MAIOS-REPO-DEEP-DIVE-2026-09-07.md` (Sider note that it was outstanding is stale).
- **HOLD (Meshal/Windows):** six VS Code MCP User env vars; Mon sole-writer evidence ~08:00–09:15 PT; `alawein-hub` retire decision; Grok connectors DEFER.
- **IMPACT:** P1 single-point-of-failure gap closed. Twin sync complete on Linux side.

## 2026-09-07 — TEMP delete pack CLOSED
- **DECISION:** Accept `GROK-DELETE-AFTER-PROOF-09793d6d-2026-09-07` at 03:40:22 PDT. `09793d6d…` EXISTS=no. Prior TEMPs remain NOT_FOUND. Keepers + Integrator present untouched.
- **WINDOWS:** `agents.yaml` TEMP list cleared; gone comments updated; `delete_pack_closed_at` set from Atlas proof.
- **IMPACT:** No TEMP New Bot shells remain. Sole inbox Atlas. Do not re-add gone ids.

## 2026-09-07 — GROK-FLEET-PASS ingest (HOLD)
- **DECISION:** Accept Atlas `GROK-FLEET-PASS-2026-09-07` + `GROK-DELETE-AFTER-PROOF-2026-09-07` at 03:15:28 PDT. `d5fb3dcc…` Delete CLOSED. Keepers Set A live. Integrator+5 hide flags equalized. Routines MATCH. autoReview compliant.
- **HOLD:** Unexpected TEMP `09793d6d-3317-4c81-a7dd-1693e2a84701` (New Bot, Meshal Alawein) quarantined hidden. Permanent Delete needs exact `yes delete 09793d6d-3317-4c81-a7dd-1693e2a84701` + Meshal UI Delete + Atlas after-proof.
- **WINDOWS:** `agents.yaml` updated (d5fb3dcc gone; 09793d6d TEMP; hide equalize notes). `verified_at` not reinvented; `fleet_pass_at` records Atlas proof time.
- **IMPACT:** Fleet pack remains HOLD until 09793d6d closed.

## 2026-09-07 — GROK-DELETE-PROOF ingest (partial)
- **DECISION:** Accept Atlas `GROK-DELETE-PROOF-2026-09-07` recorded 03:01:43 PDT. Agents cannot UI-Delete. `2afea7ed…` + `0a1d0735…` ALREADY_GONE; `9f620b76…` CONFIRMED NOT_FOUND; `d5fb3dcc…` STILL EXISTS (New Bot, hidden) — Meshal sidebar Delete required, then Atlas after-existence recheck.
- **ROUTINES:** Live Atlas schedules MATCH SSOT (auditor `10 8 * * 1-5` changed from :05). Protected agents untouched. No Notion Brief write.
- **GRADE:** DELETE pack OPEN until `d5fb3dcc` after-proof. Do not invent gone.
- **IMPACT:** Cursor waits for Meshal UI Delete of hidden New Bot only.

## 2026-09-07 — Tier-2 apply (Windows Cursor session)
- **DECISION (T2-03):** Keep **per-tool deltas**. Copilot `meshal-personal.instructions.md` stays self-contained for github.com/cloud agents. Kilo `personal-instructions.md` stays the managed AGENTS.md mirror (+ Kilo scope header). Do not merge into one file.
- **DECISION (T2-09):** Control-plane split stays three-shaped: `alawein/alawein` = portfolio governance SSOT; `workspace-tools` / `workspace-control` = coding/runtime helpers; `ops-control-plane-grok` = Grok pattern pack only. Do not dissolve into one repo this quarter.
- **DECISION (T2-07):** Stagger Atlas Monday race: `monday-sole-writer-proof` stays `5 8 * * 1`; `morning-brief-auditor` moves to `10 8 * * 1-5`. Live Grok routine sync still needs Atlas/UI apply (Sider).
- **DECISION (T2-04):** VS Code `%APPDATA%\Code\User\mcp.json` uses `${env:...}` only; dead gallery `inputs` cleared. Meshal must set User env: `GITHUB_TOKEN`, `CONTEXT7_API_KEY`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_READ_ONLY`, `SUPABASE_FEATURES`.
- **DECISION (T2-06):** Prior AUTHORIZED deletes stand; Windows still cannot prove Delete without Grok UI / `gbot`. Exact UUIDs remain in Sider prompt. "Approve all" does not invent GROK-DELETE-PROOF.
- **IMPACT:** Windows SSOT + local configs updated this session; Linux/Sider owns OTLP sink, Grok live mutations, env secret values.

## 2026-09-10 — RESPONSE-STYLE dual-environment adapters (rev c)
- **DECISION:** Keep primary portable words `OK` / `HOLD` / `BLOCK` (optional `INFO`). Add dual-environment adapters: Rich UI/IDE may use optional emoji overlays 🟢🟡🔴🔵 or legacy HTML dots **paired with** the word; Pure CLI/terminal is ASCII-only (`[ ]`/`[x]`/`[!]`, ASCII tables/diagrams, no emoji/HTML). Default Cursor chat = Rich UI.
- **SoR:** `RESPONSE-STYLE.md` rev c (2026-09-10). ChatOutput alias tracks rev c.
- **NON-DECISION:** Do not replace portable words with emoji-only or HTML-only status. Do not curiosity-auth new surfaces for style.
- **IMPACT:** Paste packs + validator + home AGENTS mirrors must point at rev c. Slack remains words-only (no pipe tables / Mermaid / emoji-as-only-status).

## 2026-09-07 — RESPONSE-STYLE portable markers (rev b)
- **DECISION:** Primary status markers are plain words `OK` / `HOLD` / `BLOCK`. HTML color `<span>` dots are optional overlay only; do not use as primary (Cursor/Slack often fail to render).
- **ADAPTERS:** AGENTS.md + Codex mirror, Cursor User Rules, agents-md-global.mdc, GROK/ChatGPT paste packs, kcompiler `VOICE.md`, OpenRouter `chat.py` system inject, `~/.cursor/hooks.json` (sessionStart env + stop compliance prompt).
- **IMPACT:** section 6 of ChatGPT handoff style body is superseded by CHATGPT-CUSTOM-INSTRUCTIONS.txt on disk. Slack keeps native contract (no HTML). Prior same-day HTML-as-primary OVERRIDE under `MAIOS Response Style locked (short + color)` is superseded by this rev b entry.
- **SUPERSEDED IN PART:** Dual-environment detail superseded by `## 2026-09-10 — RESPONSE-STYLE dual-environment adapters (rev c)`. Primary words unchanged.

## 2026-09-07 — TEMP Delete exact yes (chat) pending GROK-DELETE-PROOF
- **DECISION:** Meshal authorized permanent Delete for `2afea7ed…`, `0a1d0735…`, `d5fb3dcc…`. `9f620b76…` already GONE.
- **GRADE:** AUTHORIZED / NOT_PROVED until GROK-DELETE-PROOF. Do not invent gone on Windows.
- **IMPACT:** Atlas paste path remains the executor.

## 2026-09-07 — Audit trio reconciled (partial)
- **DECISION:** Accept `.superpowers/sdd/audit-{contradictions,id-map,naming-style}-2026-09-07.md`. Patched FLEET-STATUS `9f620b76` row, PLAN Task 5 hide line, workflows exact_yes_queue, CANON §7 supersession pointer.
- **IMPACT:** `grok-pack/.../ssot` stays non-SoR. NAMING-PROOF + deletes still Grok-side.

## 2026-09-07 — Bot naming finalized (personal + share)
- **DECISION:** Durable visible names stay **Atlas / Alfred / Housekeeper**. Two description audiences in `MAIOS-DESCRIPTION-PACK.md`: Set A PERSONAL (maios.* + Meshal exact-yes) and Set B SHARE (owner exact-yes; no personal paths). Labels must be role-specific (not identical "Research, marketing, admin"). TEMP/Integrator/deprecated shells are not shareable.
- **APPLY:** Grok Edit Profile / UpdateAgent only. Receiver chat for converge: `7ee0ec76-7df9-439c-b0f1-4decd0de2864`. Extractors for source chats in `grok-pack-2026-09-07/EXTRACTOR-FOR-SOURCES.txt` + `RECEIVER-7ee0ec76.txt`.
- **IMPACT:** Do not invent a fourth durable inbox. Do not name a bot MAIOS.

## 2026-09-07 — GROK-HIDE-PROOF accepted
- **DECISION:** Accept `GROK-HIDE-PROOF` verified_at 2026-09-07T07:32:00Z. `9f620b76…` agent dir NOT_FOUND (already gone; no Delete). `d5fb3dcc…` both hide flags true; sidebar not visible on disk. Keepers untouched. Box autoReview mirrored empty allowlist + block git push / automation_write. no_delete / no Notion Brief write honored.
- **WINDOWS:** SSOT + evidence refreshed; Windows settings keep empty allowlist and aligned blocks.
- **IMPACT:** Hide drift closed. Permanent TEMP Delete still needs `yes delete <uuid>`.

## 2026-09-07 — MAIOS Response Style locked (short + color)
- **DECISION:** Style locked 2026-09-07. SoR file: `Desktop/ops-shared-inventory/RESPONSE-STYLE.md`. Cross-tool policy SoR remains `~/AGENTS.md` (rev 2026-09-07; byte-identical `~/.codex/AGENTS.md`).
- **OVERRIDE:** HTML color status markers (`#22c55e` / `#eab308` / `#ef4444` span dots) override prior "plain ASCII only" for status dots. Skip ASCII phase grids unless asked.
- **SUPERSEDED:** HTML-as-primary OVERRIDE above is superseded by `## 2026-09-07 — RESPONSE-STYLE portable markers (rev b)`. Primary markers are plain `OK` / `HOLD` / `BLOCK`. HTML spans remain optional overlay only.
- **ADAPTERS:** Cursor `~/.cursor/rules/agents-md-global.mdc`; Claude thin pointers in `CLAUDE.md` + `doctrine/voice.md` + `voice-and-style.md`; Copilot/Kilo regenerated from AGENTS.md; paste packs for Cursor User Rules, Grok, ChatGPT (UI paste not auto-applied).
- **IMPACT:** Do not fork style into parallel trees. Grok/ChatGPT need Meshal paste. Parent applies Cursor User Rules via cursor_dialog. No Mon PASS invented.

## 2026-09-07 — Meshal exact yes: hide drifted TEMPs + keep autoReview tight
- **DECISION:** Meshal "I approve all" covers (1) Hide TEMP `9f620b76-e82b-46ff-af10-c690f8cc558c` and `d5fb3dcc-f13f-40a7-8f46-15155e36a879`; (2) keep Windows autoReview empty allowlist + block git push / automation_write. Permanent TEMP Delete not included (still requires `yes delete <uuid>`).
- **WINDOWS:** autoReview already applied. `gbot doctor` = no session; Hide must run in Grok UI or Atlas paste (`grok-pack-2026-09-07/PASTE-TO-ATLAS-HIDE.md`).
- **IMPACT:** Sole inbox remains Atlas. Record hide_authorized_at on those TEMP ids; live proof later in GROK-HIDE-PROOF.

## 2026-09-07 — GROK-AUDIT ingest (Windows apply)
- **DECISION:** Accept live GROK-AUDIT-2026-09-07 as box truth for that turn. Audit chat was New Bot `d5fb3dcc…`, not Atlas `022c46fa…`. Integrator + five deprecated + TEMP `2afea7ed`/`0a1d0735` = hidden VERIFIED on box. TEMP `9f620b76` + `d5fb3dcc` = missing `hidden_from_sidebar` (DRIFT). Chats `dd6865f0…` and `9c877254…` = NOT_FOUND on box disk.
- **WINDOWS APPLY:** `~/.grokbot/settings.json` autoReview `allowInstructions` emptied; block list for git push / automation_write / merge / APPROVE. Backup under `grok-pack-2026-09-07/evidence/`. `agents.yaml` hide_verified_at + TEMP orphan entry. No Hide/Delete/push from this agent.
- **MESHAL GATED:** Exact yes to Hide/Delete TEMP `9f620b76…`, `d5fb3dcc…` (and optional Delete of verified-hidden TEMPs). Confirm Grok app picked up autoReview tighten.
- **IMPACT:** Sole inbox remains Atlas. Do not treat New Bot audit shells as front door.

## 2026-09-07 — MAIOS SDD execution close-out (Tasks 1–13)
- **DECISION:** Agent track for `PLAN-MAIOS-IMPLEMENTATION-2026-09-06.md` is **complete on Windows SSOT**. Remaining fleet work is **Meshal-gated only** — no further agent-initiated Hide/Delete/OAuth/Mon invent.
- **AGENT FINISHED:** Approach A lock + pointers; `MAIOS-HANDOFF`; description pack + `agents.yaml` mirror (`maios_id`); Hide/delete prep lists; sunset schedule; early Mon check (NOT YET recorded); GitHub MCP RO defer doc; coding-plane + Notion/Slack boundaries; verify script awareness; close-out pack (`FLEET-STATUS-2026-09-07.md`).
- **MESHAL REMAINING:** (1) Grok UI Hide for six leaked bots (Task 5). (2) Exact-yes sidebar Deletes for TEMP ids (Task 6). (3) Mon ~09:15 PT sole-writer proof — evidence only. (4) Optional Grok GitHub MCP OAuth reconnect (Task 9).
- **HONEST GRADES:** Descriptions — SSOT + night read-back OK; optional fresh verify. Hide leak — **NOT CLEARED**. TEMP deletes — **NOT PERFORMED**. Mon runtime — **NOT_RUN** until 09:15 PT recheck. GitHub MCP RO — **DEFERRED**.
- **IMPACT:** Do not resume open-ended bot cleanup without plan gates. START_HERE Five next actions = gated list only.

## 2026-09-06 night — MAIOS control plane locked (Approach A)
- **DECISION:** Spoken name **MAIOS**; expansion **Meshal AI Operating System**. Class = personal control plane (authority, routing, continuity). Not a Grok bot. Atlas / Alfred / Housekeeper remain the only visible durables. Spec: `MAIOS.md`. Implementation plan: `PLAN-MAIOS-IMPLEMENTATION-2026-09-06.md`.
- **WHY:** Unify coding + ops surfaces under one SoR without mega-router or dual Brief writer.
- **IMPACT:** Expand via skills/connectors only. Hide/delete deprecated shells per exact yes. Monday sole-writer proof still evidence-gated.

## 2026-09-06 night — Coding-plane / AI OS unification
- **DECISION:** Cursor `mcp.json` = filesystem-only; Context7 on Cursor = `context7-plugin` only (not mcp.json). Doctrine allowlist has PLUGIN class. Cursor instruction adapter = `~/.cursor/rules/agents-md-global.mdc` (not `~/.cursor/prompts/global-standards.md`). Zombie homes `.gemini` `.codeium` `.augment` `.cagent` `.inventory-agent` archived under `Downloads\_archive\run-20260906-ai-os-unification`. `.config/ai/claude.json` = retired stub (no yoloMode). Companions: CODING-PLANE-INVENTORY / SKILL-OWNERSHIP / VALIDATION + AI-OS-FIGURES + MAIOS.
- **WHY:** Single coding-plane SoR; stop duplicate Context7 and stale global-standards path drift.
- **IMPACT:** Ops Mon sole-writer proof stays OPEN (calendar-gated). Do not invent PASS. Grok bot profiles unchanged by this decision.

## 2026-09-06 night — Stage 1 name+description finalize (SSOT sync)
- **DECISION:** Live Grok Bot Name/Description for Atlas / Alfred / Housekeeper (and deprecated shell copy) were applied in-app tonight. Windows SSOT (`agents.yaml`, START_HERE, CANON, workflows) synced after the fact. Keepers stay Atlas, Alfred, Housekeeper. Skills > bots. Teams are logical planes (command / control / teams with relay|studio|lab under teams), not sidebar group chats.
- **WHY:** Display/profile already live; inventory must not drift or claim YAML renames bots.
- **CLI AUTHORITY:** Official Grok Bot = UI Edit Profile / Hide / Delete only (no official management API). Unofficial `gbot` (npm `grok-bot-cli`) optional for hide/update using local session. Official `grok` Build CLI is a different product; do not use it for sidebar agents. Cursor/Claude/Codex edit Windows SSOT only.
- **IMPACT:** No new durable personas. Friday PR stays OFF. Mon sole-writer proof remains OPEN for 2026-09-07 runtime.

## 2026-09-06 — Finish remaining ops today (Meshal)
- **DECISION:** Execute remaining cleanup/ops items same day; early-hide Integrator; rehome Brief auditor to Atlas; start observation early; hide TEMP consolidator.
- **WHY:** Meshal: no hedging/delaying; stated Mon proof prompt + Notion dedupe already done.
- **IMPACT:** Integrator HIDDEN; dual-auditor avoided; Mon **runtime** proof still calendar-gated to 2026-09-07.
- **HONEST GRADE:** Runtime sole-writer PASS/FAIL = NOT_RUN until Mon fires.

## 2026-09-06 — Feature freeze end condition
- **DECISION:** Structural cleanup complete. Ordinary work via Atlas OK. Do not start new durable bots/frameworks. Mon runtime proof still required before treating sole-writer path as VERIFIED.
- **IMPACT:** Unfreeze = use Atlas + PLAN.md; not invent new org chart.

## 2026-09-06 — Friday PR hygiene OFF (exact yes)
- **DECISION:** Keep `friday-pr-hygiene` disabled. Alfred invariant `friday_pr_hygiene_disabled`.
- **WHY:** Meshal exact yes 2026-09-06. Brief inventory ON claim was stale vs disk.
- **IMPACT:** Do not re-enable without exact yes.

## 2026-09-06 — Disk automations beat inventory prose
- **DECISION:** Prefer live `automation.json` over YAML/FRESH-SESSION when they disagree; patch docs.
- **WHY:** Fleet audit: Friday PR OFF; Housekeeper 2 routines; Temp Continuator still blank New Agent on disk; Front Door display ≠ Atlas docs name.
- **IMPACT:** Reconciled 2026-09-06 ~15:30 PT.

## 2026-09-06 — Cleanup consolidates into Desktop SSOT (no redesign)
- **DECISION:** Canonical human/agent home = `Desktop/ops-shared-inventory/` with thin START_HERE + companions; do not invent a parallel `ai-system/` tree.
- **WHY:** Inventory + CANON already exist and are cross-tool SoR.
- **ALTERNATIVES:** New `ai-system/` folder; box-only SoR; ChatGPT-only docs.
- **IMPACT:** Agents begin at START_HERE; pilot/ remains deep evidence.

## 2026-09-05 — Full-approval live-apply batch
- **DECISION:** Rehome Mon/weekday routines to Atlas; Friday PR ON (propose-only); Alfred schedules ON; hide TEMP/HIDDEN shells; collapse getting-started clones.
- **WHY:** Shrink fleet; skills > bots; observation over ambient writes.
- **IMPACT:** Inventory YAML + CANON §9 live-applied.

## 2026-09-05 — Atlas sole front door
- **DECISION:** One ordinary inbox = Atlas. Alfred = governance only. No mega-router.
- **WHY:** Coordination cost of many near-identical bots exceeds benefit.
- **ALTERNATIVES:** Per-domain durable bots; Alfred CoS as second inbox.
- **IMPACT:** Logical planes/teams are labels, not sidebar bots.

## 2026-09-05 — Morning Brief sole writer
- **DECISION:** Notion Custom Agent writes; Grok auditor read-only; Slack 09:00 = Notion pointer-only (Choice B).
- **WHY:** Prevent dual-writer corruption.
- **ALTERNATIVES:** Grok writes Brief; disable Slack entirely.
- **IMPACT:** Mon proof is the runtime verification gate. **Note:** live Slack body still drifted as of 2026-09-05 night — fix before trusting PASS.

## 2026-09-05 — Skills over personas
- **DECISION:** Extract Clip/Video/PIST/SiteAudit/FleetOps into skills; keep shells hidden.
- **WHY:** Same capability with less org-chart debt.
- **IMPACT:** migration.yaml aliases; no bot resurrection without exact yes.

## 2026-09-05 — Secrets / credentials policy
- **DECISION:** Never paste secrets in chat; never nag for GitHub PAT / OpenRouter keys; use existing OAuth/connectors/`gh` keyring.
- **WHY:** Safety + burden.
- **IMPACT:** GitHub private pack via Windows `gh`; OpenRouter only if Meshal initiates.

## 2026-09-05 — Memory policy
- **DECISION:** Model memory is cache only; disk SoR under inventory + pilot/ledger.
- **IMPACT:** No “project brain” product; DECISIONS + YAML win on conflict.

## Stage 1 retained
- Authority classes R/D/A/N
- SAFETY ∧ QUALITY ∧ BURDEN before more autonomy
- Preserve planned | implemented | tested | verified

## 2026-09-06 - Approved finalization and writer boundary
- Decision: Meshal approved the Codex patch plan and requested all locally possible work followed by a Grok prompt.
- Applied scope: reconcile existing Desktop records; record profile/skill patches in CANON; harden and fixture-test the verifier; finalize the Monday checklist.
- Boundaries: Grok alone applies bot profiles/routines/memory. No permanent Deletes, new durable bots, Friday PR activation, outbound sends, or credential changes in this local pass.
- Precedence: Desktop is the inventory/doc SSOT; Grok disk/UI controls actual bot state. verified_at advances only after live evidence, never merely after editing text.
- Evidence: September 6 Desktop snapshots read by Codex; live bot/connector and box evidence not rechecked. Runtime remains NOT_RUN until September 7 08:00-09:15 PT.
- Remaining: PLAN finalization checklist. Append box ledger when Grok receives the handoff; do not invent that write from Windows.


## 2026-09-13 - Minimal disk / governance freeze (LOCKED)

- **DECISION:** Promote FoldKeeper MAIOS Minimal Design LOCKED rows into Desktop SoR. Doctrine SoR remains Desktop `ops-shared-inventory` only (above alawein and Kohyr). Kohyr is a sibling under `solo\kohyr` and never holds policy SoR, Brief writer, secret vault, second control plane, or a bot named MAIOS. Default Cursor roots: `solo\alawein\core\coding-phone` and `solo\alawein\sites\meshal-web`. Top `Desktop\GitHub` catalogs: collaborations, others, solo, `_archive`, `_notes`. AGI on Desktop = KEEP (Meshal exact keep). Canon site HEAD (verified 2026-09-13 Wave D): `sites\meshal-web` @ `main` / `212cdc3` (`212cdc3608e07b8d2c3121c3644b440ad3845b6f`); vitest 4.1.11 landed via #96. Branch `chore/vitest-4.1.11` @ `0dd2a1f` is historical tip only.
- **KEEPERS:** Scheme A remains Intake, Policy, Cleanup, **and Editorial** (Meshal exact yes 2026-09-13: keep Editorial). Do **not** treat FoldKeeper "3 durable bots" cleanup language as SoR. Skills still beat new durable bots.
- **WHY:** One homes-of-truth for doctrine; firewall product lines; freeze disk layout without collapsing Editorial QC.
- **EVIDENCE:** `C:\Users\mesha\Desktop\_cleanup-manifests\maios-minimal-design-pack\` (INTAKE-HANDOFF, EXECUTED, cut checklist, Intake triage). Meshal exact yes via FoldKeeper: promote LOCKED rows to DECISIONS+MAIOS+START_HERE; keep Editorial.
- **NON-GOALS:** Auto-promote PROPOSAL rows (plane daily-vocabulary drop; 7/30-day cut items) without separate exact yes. No sync daemon. No Brief dual-write.

## 2026-09-13 - meshal-web canon tip -> main (Wave D)

- **DECISION:** Align Desktop SoR canon site HEAD to live `alawein/meshal-web` `main` @ `212cdc3` (merge of `chore/vitest-4.1.11` / PR #96). Prior tip `chore/vitest-4.1.11` @ `0dd2a1f` is no longer canon.
- **WHY:** Wave D exact yes after GitHub org red-team; SoR tip was behind `main`.
- **EVIDENCE:** `gh api repos/alawein/meshal-web/commits/main`; compare `chore/vitest-4.1.11...main` ahead_by 1 (the merge commit).
- **NON-GOALS:** No branch delete in this yes (leftover branch delete stays a separate named exact-yes).

## 2026-09-13 - meshal-web delete chore/vitest-4.1.11 (Wave D closeout)

- **DECISION:** Delete remote branch `alawein/meshal-web` `chore/vitest-4.1.11` after SoR tip moved to `main` @ `212cdc3`. Local `sites\meshal-web` checked out to matching `main`.
- **WHY:** Meshal authorized Wave D optional closeout (promote #273, then remaining optional steps).
- **EVIDENCE:** Compare ahead_by 0 / behind_by 1 before delete; `DELETE` ref returned success; subsequent GET ref 404.
- **NON-GOALS:** No mass delete of other `ahead=0` meshal-web branches; no Dependabot / design-system / #72–74 closes.

