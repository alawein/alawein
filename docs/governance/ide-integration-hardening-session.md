---
type: canonical
source: none
sync: none
sla: on-change
title: IDE integration hardening session
description: Copy-paste Cursor IDE session prompt for end-to-end Slack, MCP, and agent stack hardening after the 2026-09-05 unified agent audit.
last_updated: 2026-09-05
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.0.0
tags: [cursor, ide, slack, mcp, integrations, hardening]
---

# IDE integration hardening session

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

Use this doc to run a **desktop Cursor IDE** session that repairs integrations,
merges governance PRs, and smoke-tests the full agent stack. Cloud Agents from
Slack cannot complete MCP OAuth or desktop plugin repair — this session is
required for end-to-end verification.

**Open in IDE:** `alawein/alawein` repo, branch `main` (after PR merges) or
`cursor/phase-2-closeout-fbca` (before merges).

---

## Part 1 — Audit context (2026-09-05)

### What triggered this

Meshal asked multiple agents (Cursor, Claude, Computer, ChatGPT, GitHub, Notion AI)
to audit and unify the Slack workspace and connected integrations into a single
governed system with dispatch routing, inventories, and verified state.

Work ran in `#admin-ops` via Cloud Agent + Claude live Slack reads + Computer
browser verification.

### Corrections locked (myths debunked)

| Prior claim | Verdict |
| --- | --- |
| Monday Kickoff workflow bot broken | **Wrong** — fires Mon → `#posts` |
| 4 empty Slack channels | **Wrong** — all 7 have activity |
| Notion on old AGI account | **Wrong** — `contact@meshal.ai` / Meshal's Workspace |
| Gmail label AGI drift | **Partially wrong** — threads were unlabeled, not drift |
| Vercel "2 old-job deployments" | **Not supported** — 32 projects; 8 UNVERIFIED |

### Live-verified integration state

| Status | Items |
| --- | --- |
| 🟢 Ready | Gmail, Calendar, Drive, Railway, Cursor Slack Tools, Notion AI (Slack) |
| 🟡 Partial | Vercel (32 projects, 8 need browser inspect); governance on branch not `main` |
| 🔴 Broken | GitHub MCP, Supermemory MCP, Slack MCP duplicate |
| 🔴 No output | `@ChatGPT` in Slack (installed, never replied in dispatch) |
| 🔴 Blocked | `@Computer` Slack auth; Cursor reads only `#admin-ops` |

### Gmail cleanup (done via Cloud Agent)

- Label: `AGI (archive)` (`Label_367`)
- **22** `theagi.company` threads labeled and archived
- **0** remain in INBOX (`from:theagi.company in:inbox` → empty)

### Drive inventory (sampled)

50+ AGI-related files via fullText search; categories:

- Employment/legal: offer letter, NDA, separation, signing bonus, I-983
- Eval/research: `agi_eval_demo.ipynb`, Touchstone eval PDFs
- Personal prep: investor diligence brief, conversation notes
- Workspace: `AGI-workspace-reset-assessment.md`

All sampled files owned by `contact@meshal.ai`. Review sharing on parent folder
`1LIKjxbv296LhTWsYQeTdH8-S6hO-T3ar`.

### PRs (merge order)

1. [PR #196](https://github.com/alawein/alawein/pull/196) — unified system + runbook + YAML (base governance)
2. [PR #197](https://github.com/alawein/alawein/pull/197) — Phase 2 closeout (Gmail sweep, MCP repair doc, YAML refresh)

Required CI passes on #196. Merge blocked on human approval. Doctrine Validation
fails on pre-existing sibling-repo `fallax` README (not introduced by these PRs).

### ChatGPT vs Codex (important)

| Thing | What it is |
| --- | --- |
| `@ChatGPT` in Slack | OpenAI "ChatGPT for Slack" app — Slack OAuth, **not** a Cursor MCP |
| Codex | OpenAI coding agent (ChatGPT/API) — separate product |
| "Codex" in `claude-agent-platform` | Behavioral profile name in workflows — **unrelated** to Slack |

`@ChatGPT` has no Cursor MCP. If it never replies in Slack, re-auth the Slack
app (Settings → Manage apps → ChatGPT), not Codex.

### Agent dispatch model (locked in docs)

| Task | Primary agent |
| --- | --- |
| Code, PR, governance commits | **Cursor** |
| Slack live reads | **Claude** or Cursor |
| Browser/GUI verification | **Computer** |
| Connector gap-fill (diff only) | **ChatGPT** (if working) |
| MCP integration live diff | **Cursor** |

### Output standards (every agent turn)

Tables + checklist + one-line next step. Icons: 🟢 verified · 🟡 partial · 🔴
blocked · ⚪ unverified. No duplicate audits; diff-only on open rows.

---

## Part 2 — Ideal setup (from scratch)

If rebuilding today with what we now know:

### Architecture (3 layers)

```text
Layer 1 — Canon (repo SSOT)
  alawein/docs/governance/unified-agent-system.md
  alawein/docs/governance/slack-agent-runbook.md
  alawein/catalog/agent-integrations.yaml
  alawein/docs/style/VOICE.md

Layer 2 — Surfaces
  Slack #admin-ops     → command center (human + agent traffic)
  Cursor IDE           → implement, MCP repair, E2E tests
  Cursor Cloud Agent   → audit, commit, PR from Slack threads

Layer 3 — Memory (optional convenience)
  Supermemory          → session prefs only; NOT inventory SSOT
```

### Slack (7 channels — keep)

| Channel | Role | Agents |
| --- | --- | --- |
| `#admin-ops` | Hub — dispatch, audits, PR links | Cursor, Claude, Computer*, Notion AI, GitHub, ChatGPT* |
| `#posts` | Workflow bot digest hub | bots only |
| `#kohyr-dev` | Product dev | invite Cursor |
| `#content-pipeline` | Content workflow | bots |
| `#job-search` | Job search domain | — |
| `#all-alawein-workspace` | Broadcast | invite Cursor |
| `#social` | Default | — |

\*Computer needs Slack re-auth; ChatGPT drop from dispatch until it proves it can reply.

### Agents (reduce to 4 active in dispatch)

| Agent | Keep? | Role |
| --- | --- | --- |
| Cursor | Yes | Implement, commit, MCP, governance |
| Claude | Yes | Slack reads, synthesis, §9 inventory |
| Computer | Yes (after auth) | Browser verification |
| Notion AI | Yes | Notion workspace reads |
| GitHub for Slack | Yes | PR mirror only (not an auditor) |
| ChatGPT | **Suspend** until re-auth proves reply | Was assigned gap-fill; never output |

### Cursor MCP (desktop IDE)

| MCP | Action |
| --- | --- |
| Gmail / Calendar / Drive | Keep — working |
| Railway | Keep — working |
| GitHub | **Fix** — re-auth OAuth or PAT |
| Supermemory | **Fix or remove** — decide after smoke test |
| Slack (third-party) | **Remove** — use Cursor Slack Tools for Cloud Agent only |
| Notion | Authenticate if needed for IDE reads |

### Context sharing rules

1. **Facts** → `catalog/agent-integrations.yaml` + governance docs (versioned)
2. **Preferences** → Supermemory (optional) or `~/.cursor/` user rules
3. **Coordination** → Slack thread + tagged dispatch (no agent-to-agent fake handoffs)
4. **Voice** → `docs/style/VOICE.md` mirrored to `~/.claude/CLAUDE.md` and Cowork

### Workflow bots

5 bots working, 0 engagement. Trial through **2026-09-19**; disable if still zero.

---

## Part 3 — Copy-paste IDE agent prompt

Paste everything below into a **new Cursor IDE Agent chat** (desktop, not Cloud
Agent from Slack):

```markdown
# IDE integration hardening session

You are a Cursor IDE agent working in `alawein/alawein` on Meshal's desktop.
Goal: merge governance PRs, repair broken MCPs, fix Slack agent auth, run E2E
smoke tests, and update `catalog/agent-integrations.yaml` with live results.

Account canon: `contact@meshal.ai`. Do not commit secrets.

## Context (from 2026-09-05 Slack audit)

We audited the Alawein Slack workspace + integrations. Key outcomes:

- Governance artifacts on branch (merge first):
  - PR #196: unified-agent-system.md, slack-agent-runbook.md, agent-integrations.yaml
  - PR #197: Phase 2 closeout (Gmail sweep done, cursor-mcp-repair.md, YAML refresh)
- Gmail: 22 AGI threads archived under label `AGI (archive)`; 0 in inbox
- Drive: 50+ AGI files; all sampled owned by contact@meshal.ai
- Broken MCPs: GitHub (discovery error), Supermemory (CURSOR_PLUGIN_ROOT), Slack dup
- @ChatGPT in Slack: installed but NEVER replied in multi-agent dispatch — NOT Codex
- @Computer: Slack auth blocked
- Cursor Cloud Agent: reads only #admin-ops; not invited to #kohyr-dev, #all-alawein-workspace
- Claude: legacy Slack bot; §9 handoff pending (Slack app list, bot LLM backends)

Read these before acting:
- docs/governance/unified-agent-system.md
- docs/governance/slack-agent-runbook.md
- docs/governance/cursor-mcp-repair.md
- catalog/agent-integrations.yaml

## Phase A — Merge governance (human may need to approve on GitHub)

1. Check PR #196 and #197 status on GitHub
2. If approved: squash-merge #196 to main, then #197
3. Pull main locally; confirm governance files exist on main

## Phase B — MCP repair (desktop only)

Follow docs/governance/cursor-mcp-repair.md:

1. **GitHub MCP:** Settings → MCP → re-auth GitHub OAuth or PAT (repo, read:org, workflow)
2. **Supermemory:** reinstall plugin; verify supermemory_search works; if not fixable in 15 min, document "drop" decision
3. **Slack duplicate:** remove third-party Slack MCP; keep Cursor Slack Tools for Cloud Agent
4. **Notion MCP:** authenticate if needs_auth

After each repair: note pass/fail in a table.

## Phase C — Slack agent fixes (human-assisted)

Guide Meshal through:

1. `/invite @Cursor` in #kohyr-dev and #all-alawein-workspace
2. Re-auth @Computer in Slack
3. ChatGPT Slack app: Settings → Manage apps → ChatGPT → re-auth OpenAI account
   - Test: DM @ChatGPT "Reply OK if connected"
   - If no reply in 2 min: uninstall/reinstall ChatGPT for Slack
   - Clarify: this is NOT Codex; Codex is a separate OpenAI product

## Phase D — Trigger tests (run each; record pass/fail)

### MCP smoke tests (IDE Agent)

| # | Test | Pass criteria |
| --- | --- | --- |
| T1 | Gmail MCP `list_labels` | Returns labels including `AGI (archive)` |
| T2 | Gmail `search_threads` query `from:theagi.company in:inbox` | 0 results |
| T3 | Drive `search_files` query `fullText contains 'AGI, Inc'` | Returns files; owner contact@meshal.ai |
| T4 | Railway `whoami` | contact@meshal.ai |
| T5 | GitHub MCP discovery | Github namespace status ready |
| T6 | Supermemory `supermemory_search` query "alawein governance" | Returns or graceful empty; not error |
| T7 | No duplicate Slack MCP error | Only Cursor Slack Tools or no errored Slack namespace |
| T8 | `gh pr view 196` / `gh pr view 197` | Shows merged or open with CI status |

### Slack agent smoke tests (post in #admin-ops; one message each)

| # | Tag | Prompt | Pass criteria |
| --- | --- | --- | --- |
| S1 | @Cursor | "List Slack channels you can read" | Lists 7; notes which are readable |
| S2 | @Claude | "List Slack apps installed in this workspace" | Table with app names |
| S3 | @Computer | "Confirm you can read #posts" | Evidence or UNVERIFIED |
| S4 | @ChatGPT | "Reply OK" | Any reply within 2 min |
| S5 | @Notion AI | "Confirm workspace identity" | contact@meshal.ai / Meshal's Workspace |

### Workflow bot check (read-only)

| # | Check | Pass criteria |
| --- | --- | --- |
| W1 | Monday Kickoff last post | Exists in #posts |
| W2 | All 5 bots | status working in YAML |

## Phase E — Update canon

1. Update `catalog/agent-integrations.yaml`:
   - MCP statuses from Phase B tests
   - ChatGPT status: ready | suspended | needs_auth
   - cursor_can_read per channel after invites
   - last_verified: today
2. Update `docs/governance/ide-integration-hardening-session.md` §4 Test results table
3. Run validation:
   - python3 scripts/catalog/sync-readme.py --check
   - bash ./scripts/doctrine/validate-doc-contract.sh --full
4. Commit + PR if changes; bump last_updated on edited .md files

## Phase F — Supermemory decision

After T6, recommend one of:
- **Keep:** fix works; use for session prefs only; document scope in YAML notes
- **Drop:** not worth maintenance; remove MCP entry; rely on repo SSOT + user rules

## Deliverables (this session)

Post a final summary table:

| Area | Before | After | Evidence |
| --- | --- | --- | --- |
| PR #196/#197 | ... | ... | merge commit / PR URL |
| GitHub MCP | error | ... | discovery status |
| Supermemory | error | ... | T6 result |
| ChatGPT Slack | no reply | ... | S4 result |
| Cursor channel read | admin-ops only | ... | S1 result |
| YAML | stale | ... | diff |

One-line next step for anything still blocked.

## Constraints

- Do not re-audit what's already locked in runbook unless a test fails
- Do not use Supermemory as SSOT for inventory
- Do not confuse ChatGPT Slack app with Codex
- Ask Meshal before destructive actions (uninstall apps, delete MCP entries)
- Voice: follow docs/style/VOICE.md in any doc edits
```

---

## Part 4 — Test results (fill during session)

| ID | Test | Result | Evidence | Date |
| --- | --- | --- | --- | --- |
| T1 | Gmail labels | | | |
| T2 | AGI inbox empty | | | |
| T3 | Drive AGI search | | | |
| T4 | Railway whoami | | | |
| T5 | GitHub MCP | | | |
| T6 | Supermemory | | | |
| T7 | Slack MCP dup removed | | | |
| T8 | PR merge status | | | |
| S1 | @Cursor channels | | | |
| S2 | @Claude apps | | | |
| S3 | @Computer #posts | | | |
| S4 | @ChatGPT reply | | | |
| S5 | @Notion AI identity | | | |
| W1 | Monday Kickoff | | | |
| W2 | Workflow bots | | | |

---

## Part 5 — Related canon

| Doc | Role |
| --- | --- |
| [`unified-agent-system.md`](unified-agent-system.md) | Orchestration SSOT |
| [`slack-agent-runbook.md`](slack-agent-runbook.md) | Channel and bot policy |
| [`cursor-mcp-repair.md`](cursor-mcp-repair.md) | MCP repair steps |
| [`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml) | Machine-readable inventory |
