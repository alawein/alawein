---
type: canonical
source: none
sync: none
sla: none
title: Admin-ops integration checklist
description: Click-path runbook for Slack agent bots, Cursor Cloud MCP auth, Notion account alignment, and GitHub sync prep.
last_updated: 2026-09-04
category: operations
audience: [ai-agents, contributors]
status: active
related:
  - ./notion-projects-database.md
  - ./github-notion-sync-glossary.md
  - ../../.env.example
---

# Admin-ops integration checklist

Use this page after adding or re-auditing Slack agent bots in `#admin-ops`. It complements the
[GitHub ↔ Notion sync glossary](./github-notion-sync-glossary.md) and the
[Notion Projects runbook](./notion-projects-database.md).

## Quick status matrix

| Integration | Symptom when broken | Fix owner | Section |
|-------------|---------------------|-----------|---------|
| **@Cursor** | No agent launch from Slack | Meshal | [Cursor in Slack](#cursor-in-slack) |
| **@Claude** | "Legacy Claude in Slack" / no response | Claude workspace admin | [Claude Tag](#claude-tag) |
| **@Notion AI** | Silent on @mention | Meshal (Slack + Notion) | [Notion AI](#notion-ai-slack) |
| **Notion sync** | Wrong account / Gmail label drift | Meshal | [Notion account](#notion-account-and-sync) |
| **Cursor MCPs** | Agent cannot reach GitHub, Gmail, etc. | Meshal (Cursor env) | [Cursor Cloud MCPs](#cursor-cloud-mcps) |
| **Vercel** | Stale deployments on `alawein` team | Meshal | [Vercel cleanup](#vercel-cleanup) |

---

## Cursor in Slack

### Verify

1. In any channel: `@Cursor list agents` — should list or confirm no active agents.
2. In `#admin-ops`: `@Cursor [task]` — should launch a Cloud Agent bound to the thread.
3. Confirm repo binding: agent should target `alawein/alawein` unless you name another repo.

### Expand channel access

The Cursor bot can **read only channels it has been invited to**. To audit or summarize other channels:

1. Open the target channel (e.g. `#kohyr-dev`, `#all-alawein-workspace`).
2. Run `/invite @Cursor`.
3. Retry: `Read #channel-name and summarize recent activity`.

### Commands reference

| Goal | Command |
|------|---------|
| Start agent | `@Cursor [task description]` |
| Pick repo explicitly | `@Cursor Fix X in alawein/meshal-web` |
| Settings | `@Cursor settings` |
| New agent (not follow-up) | `@Cursor agent [task]` |
| Post updates elsewhere | `@Cursor channel=#eng-bots [task]` |

---

## Claude Tag

### Symptom

Every `@Claude` mention returns:

> Using the legacy Claude in Slack bot. Ask your Claude workspace owner to enable Claude Tag.

Followed by "Unable to generate a response at this time."

### Fix

1. Sign in at [claude.ai](https://claude.ai) with the **workspace owner** account.
2. Open workspace settings → **Integrations** (or [Claude Tag product page](https://claude.com/product/tag)).
3. Enable **Claude Tag** for the Slack workspace.
4. In Slack: remove the legacy Claude app if a duplicate remains (Slack → **Settings** → **Apps** → Claude).
5. Re-install Claude for Slack from the Claude console if prompted.
6. Test in `#admin-ops`: `@Claude connect`, then a simple question.

### After Claude Tag is live

- `@Claude` reads thread context on mention only (per bot welcome message).
- For code tasks, Claude may show a repo picker; confirm the intended GitHub repo before continuing.

---

## Notion AI (Slack)

### Symptom

`@Notion` (or the Notion AI bot user) is in the channel but **does not reply** to @mentions.

### Fix

1. **Slack** → **Settings & administration** → **Manage apps** → **Notion**.
2. **Reinstall** or **Re-authenticate** the Notion app for this workspace.
3. **Notion** → **Settings** → **Connections** → confirm the connected workspace is **Meshal/Alawein** (not a legacy AGI account).
4. In Notion → **Settings** → **My connections**, revoke stale integrations tied to the old account.
5. Test: `@Notion summarize this channel's purpose` in `#admin-ops`.

### Gmail label drift (downstream)

If Notion was authenticated to the wrong account, Gmail filters/labels that depend on Notion automations may drift. **Re-auth Notion first**, then audit Gmail labels tied to Notion-triggered rules.

---

## Notion account and sync

Canonical project rows flow: `projects.json` → `scripts/notion/sync-to-notion.mjs` → Notion **Projects (Canonical)**. See the [glossary](./github-notion-sync-glossary.md) for what **does not** push to Notion (per-repo GitHub sync reports).

### Pre-flight (no secrets required)

From repo root:

```bash
python3 scripts/catalog/validate-projects-json.py
python3 scripts/catalog/sync-readme.py --check
python3 scripts/catalog/build-catalog.py --check
bash ./scripts/doctrine/validate-doc-contract.sh --full
```

### Local sync (secrets required)

1. Copy `.env.example` → `.env.local`.
2. Set `NOTION_TOKEN` and `NOTION_DB_ID` from [notion.so/my-integrations](https://www.notion.so/my-integrations).
3. Run:

```bash
pwsh -File scripts/notion/run-notion-local.ps1
```

Or step by step:

```bash
python3 scripts/catalog/validate-projects-json.py
node scripts/notion/sync-to-notion.mjs
node scripts/notion/verify-notion-canonical-state.mjs
```

Property mapping matches `notion-sync.yml` in the private ops repo (`Status`, `Stack`, `Domain`, etc.).

### Cloud Agent tokens

To let a Cursor Cloud Agent run Notion sync or Vercel audit remotely, add secrets to the Cloud Agent environment (Cursor dashboard → **Cloud Agents** → **Environments** → your environment → **Secrets**):

| Secret | Used by |
|--------|---------|
| `NOTION_TOKEN` | `sync-to-notion.mjs`, `verify-notion-canonical-state.mjs` |
| `NOTION_DB_ID` | Same |
| `VERCEL_TOKEN` | `scripts/github/vercel_alias_audit.py` |
| `DASHBOARD_GITHUB_TOKEN` | GitHub dashboard / extended API scripts |

---

## Cursor Cloud MCPs

MCP servers are configured per Cloud Agent environment. Re-auth in **Cursor** → **Dashboard** → **Cloud Agents** → **Environments** → **MCP**.

| MCP | Typical use | If broken |
|-----|-------------|-----------|
| **Cursor Slack Tools** | Thread read/post from Slack agents | Should always be ready for Slack-launched agents |
| **Github** | PR/issue automation | Re-auth GitHub OAuth in environment MCP settings |
| **Gmail** | Label/filter triage | Re-auth Google; fix Notion account first if labels drift |
| **Google Drive / Calendar** | Doc and schedule context | Re-auth Google |
| **Granola** | Meeting context for features | Re-auth Granola |
| **Supermemory** | Cross-session project memory | Re-auth or reinstall plugin; check `CURSOR_PLUGIN_ROOT` in environment |
| **Slack** (standalone MCP) | Workspace API beyond Cursor Slack Tools | Re-auth Slack app in environment |

After re-auth, launch a test agent from `#admin-ops` and ask it to confirm MCP namespace status.

---

## Vercel cleanup

### Symptom

Stale deployments from a prior employer or team remain on the `alawein` Vercel team.

### Fix (UI)

1. [vercel.com](https://vercel.com) → team **alawein** → **Deployments**.
2. Filter by project; delete or unlink deployments that do not belong to current portfolio repos.
3. Confirm production aliases match [`scripts/github/vercel_alias_audit.py`](../../scripts/github/vercel_alias_audit.py) expectations.

### Fix (CLI / agent)

With `VERCEL_TOKEN` in the environment:

```bash
python3 scripts/github/vercel_alias_audit.py
```

---

## Slack workspace hygiene

From the 2026-09-04 audit (manual Slack admin actions):

- [ ] Archive or repurpose **empty channels** (no real content since creation).
- [ ] Disable or remove **workflow bots** that have received zero replies for months.
- [ ] Confirm `#admin-ops` topic and pinned welcome post still match current scope (infra, DNS, billing, subscriptions).
- [ ] Identify silent bots (e.g. users that join but never respond) and reinstall or remove the underlying Slack app.

---

## Repo health pass (agent-runnable)

A Cursor agent on `alawein/alawein` can run this suite without extra OAuth:

```bash
python3 scripts/doctrine/build-style-rules.py --check
python3 scripts/doctrine/validate.py --ci
python3 scripts/doctrine/validate-doctrine.py .
bash ./scripts/doctrine/validate-doc-contract.sh --full
python3 scripts/catalog/sync-readme.py --check
python3 scripts/catalog/build-catalog.py --check
python3 scripts/catalog/validate-projects-json.py
python3 scripts/github/verify-profile-pins.py --skip-live --check
python3 scripts/github/validate-visibility.py --offline
python3 scripts/github/github-baseline-audit.py
```

`local_path` warnings in `validate-projects-json.py` are expected when sibling repos are not checked out in the Cloud Agent VM.

---

## Verification log

Record manual fixes in `#admin-ops` (date, what changed, who verified). For repo-side changes, reference the PR that updated this checklist or the Notion sync scripts.
