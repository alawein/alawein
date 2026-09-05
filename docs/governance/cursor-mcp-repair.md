---
type: canonical
source: none
sync: none
sla: on-change
title: Cursor MCP repair runbook
description: Repair steps for broken Cursor MCP integrations identified during the unified agent system audit.
last_updated: 2026-09-05
category: governance
audience: [ai-agents, contributors]
status: active
version: 1.0.0
tags: [cursor, mcp, integrations, repair]
---

# Cursor MCP repair runbook

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

Live-verified 2026-09-05 from a Cloud Agent session. Use this when
`catalog/agent-integrations.yaml` rows show `error` or `remove`.

## 1. Status snapshot

| Integration | Cursor MCP | Workaround | Action |
| --- | --- | --- | --- |
| GitHub | Error (discovery fails) | `gh` CLI scoped token works | Re-auth or fix server config (§2) |
| Supermemory | Error (`CURSOR_PLUGIN_ROOT`) | None in session | Reinstall plugin / fix env (§3) |
| Slack (duplicate) | Error | **Cursor Slack Tools** (built-in) | Remove duplicate entry (§4) |
| Gmail / Calendar / Drive | Ready | — | None |
| Railway | Ready | — | None |
| Notion | Needs auth | Notion AI in Slack | Authenticate in Cursor Settings → MCP |

## 2. GitHub MCP

**Symptom:** `Github` namespace fails tool discovery; agents cannot call GitHub MCP
tools. `gh` CLI operations (PR status, repo reads) still work via shell.

**Repair steps (desktop Cursor):**

1. Open **Cursor Settings → MCP** (or edit `~/.cursor/mcp.json` on the host).
2. Locate the GitHub MCP server entry (often `@modelcontextprotocol/server-github`
   or the GitHub plugin bundle).
3. Confirm a valid token is set:
   - Prefer **OAuth** via Cursor's GitHub integration when available.
   - Otherwise set `GITHUB_PERSONAL_ACCESS_TOKEN` via env reference, not a
     plaintext secret in a committed file.
4. Token scopes: `repo`, `read:org`, `workflow` (minimum for PR/CI reads).
5. Restart MCP servers (toggle off/on, or restart Cursor).
6. Verify: in Agent chat, GitHub MCP tools should appear in tool discovery.

**If still failing:** remove the GitHub MCP entry, re-add from the official GitHub
plugin, and re-authenticate. Use `gh auth status` in terminal as a parallel check.

## 3. Supermemory MCP

**Symptom:** Supermemory namespace unavailable; plugin cache references
`CURSOR_PLUGIN_ROOT` resolution failure.

**Repair steps:**

1. Open **Cursor Settings → MCP** and find Supermemory.
2. Disable, then re-enable the Supermemory plugin (or reinstall from the plugin
   marketplace).
3. Confirm the plugin path resolves on the host (local plugins live under
   `~/.cursor/plugins/local/<plugin-name>/`).
4. Restart Cursor after plugin reinstall.
5. Verify: `supermemory_search` should appear in dynamic tool discovery.

**Cloud Agent note:** Supermemory may not be available in Cloud Agent VMs even when
fixed on desktop. Treat desktop fix as canonical; Cloud Agent row stays
`action_required` until Cursor documents Cloud parity.

## 4. Slack MCP (duplicate — remove)

**Symptom:** A second `Slack` MCP namespace errors on discovery while **Cursor Slack
Tools** (built-in, bound to the launch thread) works.

**Repair steps:**

1. Open **Cursor Settings → MCP**.
2. Identify the **non-built-in** Slack MCP server (third-party or legacy entry).
3. **Remove** it. Keep only **Cursor Slack Tools** for Slack agent operations.
4. Restart MCP servers.
5. Verify: `Slack` namespace should either disappear or show only Cursor Slack
   Tools; `list_slack_channels` and `read_slack_messages` should work.

**Do not** remove Cursor Slack Tools — that is the canonical Slack surface for
Cloud Agents launched from Slack.

## 5. Verification checklist

After repairs, re-run this checklist in an Agent session:

- [ ] `Github` namespace: `namespaceStatus` = `ready`
- [ ] `Supermemory` namespace: `supermemory_search` callable
- [ ] No duplicate `Slack` MCP error alongside working Cursor Slack Tools
- [ ] Update `catalog/agent-integrations.yaml` `last_verified` and `cursor_mcp` rows
- [ ] Bump `last_updated` on this file if steps change

## 6. Related canon

| Doc | Role |
| --- | --- |
| [`unified-agent-system.md`](unified-agent-system.md) | Integration registry and dispatch |
| [`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml) | Machine-readable MCP status |
| [`credential-hygiene.md`](credential-hygiene.md) | Token handling |
