---
type: canonical
source: none
sync: none
sla: on-change
title: Claude Tag migration
description: Admin runbook to migrate the Alawein Slack workspace from legacy Claude in Slack to Claude Tag.
last_updated: 2026-09-06
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.0.0
tags: [slack, claude, claude-tag, integrations]
---

# Claude Tag migration

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

Legacy `@Claude` (`U0AQQFJT8AC`) still answers in Slack. Claude Tag replaces the
per-user legacy bot with one org-provisioned identity, shared thread sessions, and
admin-controlled GitHub access bundles.

**Inventory row:** `claude-slack` in
[`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml).

**Prerequisite:** Claude Team or Enterprise plan. Primary Owner or Owner role on
the Claude org (Admin alone cannot complete setup).

## 1. Pre-migration checklist

| Step | Action | Done when |
| --- | --- | --- |
| 1 | Confirm Claude plan tier (Team or Enterprise) | Billing page shows eligible plan |
| 2 | Confirm Slack Primary Owner or Owner access | Can open workspace admin settings |
| 3 | List GitHub repos Claude Tag must reach | Table in §4 filled |
| 4 | Decide agent lanes | `#me-agents-ops` for Claude Tag; `#me-agents-eng` for Cursor |
| 5 | Mute Claude DM session-complete noise | Mobile/desktop notifications off for Claude app |

## 2. Pair workspace (one-time)

1. Open the [Claude Tag admin console](https://claude.com/docs/claude-tag/admins/migrate-from-earlier) (Settings → Claude Tag).
2. In any Slack channel, send: `@Claude connect`
3. Copy the pairing code from Claude's reply.
4. Paste the code in the Claude admin console and finish workspace pairing.
5. If Claude requests extra Slack scopes, approve the install link as Slack admin.

**Verify:** workspace appears under **Where Claude Tag works** in the admin console.

## 3. Set version to New (not Legacy)

For each scope under **Claude Tag's access → Slack**:

1. Open the scope (Default Slack, workspace, or channel).
2. **Advanced → Claude Tag version → New**
3. Save.

On Team plan, a single **Enable Claude Tag** switch may replace per-scope controls
when no scope still routes to Legacy.

**Verify:** `@Claude` in `#admin-ops` no longer shows the legacy-bot banner.

## 4. Wire GitHub access bundles

Legacy Claude used each user's linked GitHub account. Claude Tag uses org
credentials. Code tasks fail until bundles are configured.

1. In Claude Tag admin, open **Connections** (or Access bundles).
2. Add the GitHub org/repos Claude should clone and open PRs against.
3. Attach the bundle to scopes that need code work (`#me-agents-ops`, `#team-eng`).
4. In the first message of a code thread, name the target repo explicitly.

**Verify:** ask `@Claude` to list branches on a known repo; response cites the
Claude GitHub App, not your personal GitHub user.

## 5. Channel routing after migration

| Surface | Agent | Channel | Posting rule |
| --- | --- | --- | --- |
| Analysis, audits, planning | Claude Tag | `#me-agents-ops` | One task = one thread; link docs, do not paste full canvases |
| Code, PRs, repo edits | Cursor | `#me-agents-eng` | One task = one thread; include repo + goal |
| Quick Q&A | Claude Tag | Claude DM | Short questions only |
| Claude Code in Slack | Deprioritize | — | Use Cursor or local Claude Code instead |

## 6. User comms (copy-paste)

Post in `#admin-ops` after migration:

> **Claude Tag is live.** Channel threads are shared: anyone can continue a
> thread. Code work is authored by the Claude GitHub App. DMs still use your
> personal Claude account. Use `#me-agents-ops` for multi-step Claude work;
> do not cross-post the same prompt to DM and channel.

## 7. Post-migration inventory update

After live verification, update machine SSOT:

1. `catalog/agent-integrations.yaml` → `claude-slack`:
   - `llm_default: claude-tag`
   - `status: ready`
   - `notes`: remove legacy-bot references; record migration date
2. `docs/internal/audits/YYYY-MM-DD-slack-integrations-rescan.md` → Claude Tag row
3. `python3 scripts/catalog/validate-agent-integrations.py --strict`

## 8. Rollback

Set affected scopes to **Legacy** (not Off) to restore prior per-user behavior
without uninstalling the Slack app. Off silences both versions in that scope.

## 9. Related canon

| Doc | Role |
| --- | --- |
| [`slack-agent-runbook.md`](slack-agent-runbook.md) | Current channel policy |
| [`slack-channel-migration-plan.md`](slack-channel-migration-plan.md) | Proposed channel renames |
| [`unified-agent-system.md`](unified-agent-system.md) | Dispatch routing |
| [Anthropic migrate guide](https://claude.com/docs/claude-tag/admins/migrate-from-earlier) | Vendor source |
