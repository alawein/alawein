---
type: plan
status: active
source: writing-plans session 2026-09-13
last_updated: 2026-09-13
owner: meshal
---

# Cursor-first absorb 2026-09-13 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to
> implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Land derived absorb evidence (synthesis, Desktop reorg plan, E2E
plan, DOC/OPS red-team) under the existing internal convention, with CV and
Cloudflare status recorded honestly.

**Architecture:** These files are derived evidence, not a second SoR. Live
git plus `AGENTS.md` win for repo fields. Desktop `ops-shared-inventory`
wins for ops doctrine. Notion is the human operating view. Chat and Slack
are transport. Handoffs are inputs.

**Tech Stack:** Markdown, existing doctrine validators, GitHub draft PR.

## Global Constraints

- Assigned scope: Cursor Cloud absorb executor for Meshal Alawein / MAIOS.
- Executor: Cursor Cloud. Independent reviewer: ChatGPT (default when Cursor
  executes). Record if review is not performed.
- Dual SoR B WITH PATCHES: Desktop ops doctrine; Outpost/phone KEEP skill
  bodies; Grok profiles, routines, and memory stay Grok-local; no sync
  daemon; skills beat durable bots.
- Exact-yes gates (list and stop): send, spend, publish, delete, merge,
  secret rotate, Slack posts, new OAuth, Notion Morning Brief body writes.
  This mission authorizes commit, push, and a draft PR for these absorb
  files only.
- Hard BLOCKs: no Notion Brief body writes; no durable Research/Grok bots;
  no invented Grok Bot HTTP agents API; no phone KEEP evening/maios/arch
  work roots; no secret rotate; no merge without Meshal exact yes.
- Desktop pack
  `C:\Users\mesha\Desktop\ops-shared-inventory\CURSOR-FIRST-ABSORB-2026-09-13\`
  is absent on this VM. Reconstruct from this prompt plus live git. Mark
  Desktop-only claims UNVERIFIED.
- `alawein/knowledge-base` returns 404 to this token. Do not invent CV
  dates. HOLD the patch.
- Do not copy Desktop SoR into git. Do not thrash RESPONSE-STYLE drafts.
- Path: `docs/maios/` does not exist. Use
  `docs/internal/maios/cursor-first-absorb-2026-09-13/` (existing
  derived-evidence convention). Do not invent a new managed-doc class.
- American spelling. No em dash. No forbidden register from `docs/style/VOICE.md`.

---

### Task 1: Absorb pack files

**Files:**
- Create: `docs/internal/maios/cursor-first-absorb-2026-09-13/ABSORB-SYNTHESIS.md`
- Create: `docs/internal/maios/cursor-first-absorb-2026-09-13/OPS-INVENTORY-REORG-PLAN.md`
- Create: `docs/internal/maios/cursor-first-absorb-2026-09-13/E2E-EXECUTION-PLAN.md`
- Create: `docs/internal/maios/cursor-first-absorb-2026-09-13/RED-TEAM.md`
- Create: `docs/internal/maios/cursor-first-absorb-2026-09-13/IMPLEMENTATION-PLAN.md`

**Interfaces:**
- Consumes: live `alawein/alawein` at `c9eb9aa2` (#264), catalog
  `agent-integrations.yaml`, Cloudflare deprecation page, this prompt.
- Produces: four named deliverables plus this plan.

- [x] **Step 1: Write ABSORB-SYNTHESIS.md**

Locked / conflict / unverified table with evidence. Style ACK for Desktop
rev f. Proposed Intake memory line. CV HOLD. Cloudflare HOLD. Open Meshal
decisions.

- [x] **Step 2: Write OPS-INVENTORY-REORG-PLAN.md**

Desktop folder reorg. MOVE + MANIFEST for Cleanup later. No delete. No
sync daemon. Phone KEEP roots stay BLOCKED.

- [x] **Step 3: Write E2E-EXECUTION-PLAN.md**

Ordered checkboxes, verify commands, exact-yes gates, stop on failed
verify.

- [x] **Step 4: Write RED-TEAM.md**

DOC/OPS only. Columns: claim, evidence, authority, severity, remediation,
gate. No offensive cyber, exploits, or secret theft.

- [x] **Step 5: Confirm knowledge-base still 404**

Run: `gh repo view alawein/knowledge-base`

Expected: repository cannot be resolved. Do not invent `cv_body.tex` or
`career-main-overlays.json` patches.

- [x] **Step 6: Verify validators**

```bash
python scripts/catalog/sync-readme.py --check
bash ./scripts/doctrine/validate-doc-contract.sh --full
python scripts/doctrine/validate.py --ci
```

Expected: pass. Stop if any fail.

- [ ] **Step 7: Commit and draft PR**

```bash
git add docs/internal/maios/cursor-first-absorb-2026-09-13/
git commit -m "docs: add Cursor-first absorb pack for 2026-09-13"
git push -u origin cursor/cursor-first-absorb-295b
```

Open a draft PR. Do not merge.
