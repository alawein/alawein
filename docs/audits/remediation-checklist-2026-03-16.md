---
title: Remediation checklist (full-environment audit)
description: Step-by-step actions to address findings from full-environment-audit-2026-03-16
last_updated: 2026-03-16
category: audit
audience: [operators, contributors]
---

# Remediation checklist — Full environment audit

Use this checklist after [full-environment-audit-2026-03-16.md](full-environment-audit-2026-03-16.md). All paths are on the audit machine (user profile); no repo file changes required for these steps.

## Immediate (Critical)

- [ ] **MCP: remove hardcoded GitHub token**
  - Open `%USERPROFILE%\.cursor\mcp.json` (or `~/.cursor/mcp.json`).
  - Find the `github` server’s `env` block.
  - Replace the literal token value with an env var, e.g. `"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"`.
  - Set `GITHUB_PAT` in user environment variables (Windows: System Properties → Environment Variables → User variables).
  - Save and restart Cursor if needed.

- [ ] **Rotate AWS keys**
  - In AWS IAM, revoke the access key listed in `%USERPROFILE%\.aws\credentials`.
  - Create a new access key and update `%USERPROFILE%\.aws\credentials` with the new key (or move to AWS CLI SSO/credential helper).

- [ ] **Rotate GitHub token(s)**
  - GitHub → Settings → Developer settings → Personal access tokens: revoke the token used in `%USERPROFILE%\.config\gh\hosts.yml` and in MCP.
  - Create a new token with the same scopes; update `hosts.yml` and, if you keep a token in env, set `GITHUB_PAT` to the new value.

- [ ] **Rotate npm auth token**
  - npm website: revoke the token in `%USERPROFILE%\.npmrc` (`//registry.npmjs.org/:_authToken`).
  - Run `npm login` or create a new token and update `.npmrc`.

- [ ] **Rotate Stripe keys**
  - Stripe Dashboard: roll API keys for the project in `%USERPROFILE%\.config\stripe\config.toml`.
  - Update `config.toml` with the new keys (or switch to env vars if the Stripe CLI supports it).

- [ ] **Claude / Codex**
  - Sign out and sign back in to refresh OAuth where possible; revoke old sessions in account settings if available.
  - Prefer env-based or app-managed credential storage over editing `.credentials.json` / `auth.json` by hand.

## Short-term (High / Medium)

- [ ] **Cursor: tighten auto-approve**
  - Open `%APPDATA%\Cursor\User\settings.json`.
  - Change `chat.tools.terminal.autoApprove` from `"*": true` to a limited set of safe commands (e.g. `cd`, `pwd`, `ls`, `dir`).
  - Optionally set `anthropic.claude.showApprovalPrompts` to `true` for sensitive flows.

## Reference

- [Credential hygiene](../governance/credential-hygiene.md) — rules and MCP env-var example
- [Full environment audit](full-environment-audit-2026-03-16.md) — findings and rationale
