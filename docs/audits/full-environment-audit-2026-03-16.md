---
title: Full Environment Audit 2026-03-16
description: Scoped security and config audit — GitHub workspaces, local env, IDE/LLM domains
category: audit
last_updated: 2026-03-16
---

# Full Environment Audit — 2026-03-16

**Date:** 2026-03-16  
**Scope:** GitHub dirs, workspace, local env (`.aws`, `.config`, `.ssh`, `.npmrc`, `.azure`, `.docker`), IDE/LLM (Cursor, Claude, Codex, AppData Roaming)  
**Constraints:** Read-only; metadata-only; no raw secret values reported

---

## 1. Scope and Coverage

### 1.1 Drives and Roots

| Drive | Root |
|-------|------|
| C | C:\ |
| Temp | C:\Users\mesha\AppData\Local\Temp\ |

### 1.2 GitHub / Workspace Structure

| Path | Exists | Contents |
|------|--------|----------|
| `C:\Users\mesha\Desktop\GitHub` | Yes | `.mypy_cache`, `.playwright-cli`, `.vscode`, `config`, `docs`, `github.com`, `workspace` |
| `C:\Users\mesha\Desktop\GitHub\workspace` | Yes | `notion-email-sync`, `scientific-pub-kit` |
| `C:\Users\mesha\Desktop\GitHub\github.com` | Yes | `.playwright-mcp`, `alawein`, `blackmalejournal`, `morphism-systems` |

### 1.3 Key Config Paths

| Path | Exists |
|------|--------|
| `C:\Users\mesha\.cursor` | Yes |
| `C:\Users\mesha\.claude` | Yes |
| `C:\Users\mesha\.codex` | Yes |
| `C:\Users\mesha\AppData\Roaming\Cursor` | Yes |
| `C:\Users\mesha\AppData\Roaming\Code` | Yes |
| `C:\Users\mesha\.ssh` | Yes |
| `C:\Users\mesha\.aws` | Yes |
| `C:\Users\mesha\.config` | Yes |

### 1.4 Blind Spots

- Full `C:\Users\mesha` recursive scans were avoided to prevent timeouts.
- `.ssh` contents not enumerated (may contain keys).
- Some `.config` subdirs may not have been fully traversed.

---

## 2. Findings by Severity

### 2.1 Critical (plaintext credentials in broadly readable paths)

| # | Path | Type | Confidence | Rationale |
|---|------|------|------------|-----------|
| 1 | `C:\Users\mesha\.aws\credentials` | Credentials | High | Contains `aws_access_key_id` and `aws_secret_access_key` in plaintext. Standard AWS path; readable by user and any process running as user. |
| 2 | `C:\Users\mesha\.cursor\mcp.json` | TrustBoundary | High | MCP server config contains hardcoded `GITHUB_PERSONAL_ACCESS_TOKEN` in `env` block for github server. Prefer env var reference. |
| 3 | `C:\Users\mesha\.claude\.credentials.json` | Credentials | High | Contains `claudeAiOauth.accessToken`, `claudeAiOauth.refreshToken`; OAuth tokens for Claude AI. Also `mcpOAuth` with plugin client secrets. |
| 4 | `C:\Users\mesha\.codex\auth.json` | Credentials | High | Contains `tokens.id_token`, `tokens.access_token`, `tokens.refresh_token` for OpenAI/ChatGPT auth. |
| 5 | `C:\Users\mesha\.config\gh\hosts.yml` | Credentials | High | Contains `oauth_token` for GitHub CLI. |
| 6 | `C:\Users\mesha\.npmrc` | Credentials | High | Contains `//registry.npmjs.org/:_authToken`. |
| 7 | `C:\Users\mesha\.config\stripe\config.toml` | Credentials | High | Contains `live_mode_api_key`, `test_mode_api_key`, `live_mode_pub_key`, `test_mode_pub_key`. |
| 8 | `C:\Users\mesha\.azure\msal_token_cache.json` | Credentials | High | Contains `AccessToken.secret` entries with Bearer tokens for Azure. |

### 2.2 High (token/key in config or workspace-visible)

| # | Path | Type | Confidence | Rationale |
|---|------|------|------------|-----------|
| 1 | `C:\Users\mesha\AppData\Roaming\Cursor\User\settings.json` | Config | High | `chat.tools.terminal.autoApprove` with `"*": true`; `anthropic.claude.showApprovalPrompts: false`; `openai.chatgpt.confirmBeforeSend: false`; `ai_agent_permissions` note indicates full autonomy. Broad auto-approve increases risk. |

### 2.3 Medium (risky automation defaults)

| # | Path | Type | Confidence | Rationale |
|---|------|------|------------|-----------|
| 1 | `C:\Users\mesha\AppData\Roaming\Cursor\User\settings.json` | Config | High | `geminicodeassist.confirmRequired: false`, `geminicodeassist.autoSubmit: true`, `cline.autonomous.enable: true`. Multiple AI tools bypass approval. |

### 2.4 Low (weak hygiene)

| # | Path | Type | Confidence | Rationale |
|---|------|------|------------|-----------|
| 1 | `C:\Users\mesha\Desktop\GitHub\.env.example` | Config | High | Template only; placeholder values. No secrets. |

---

## 3. Findings by Domain

### 3.1 GitHub / Workspace

| Finding | Severity |
|---------|----------|
| `.env.example` at repo root — template only; no leakage | Low |
| `scripts/set-dashboard-token.ps1` — uses SecureString for token input; sets repo secret via `gh`; no credential file persisted | None |
| `.github/workflows/*` — use `secrets.DASHBOARD_GITHUB_TOKEN`, `secrets.NOTION_TOKEN`, `secrets.NOTION_DB_ID` (correct) | None |
| `.gitignore` — excludes `.env`, `credentials`, `*_KEY`, `*_TOKEN`, etc. | None |

### 3.2 Local Environment

| Path | Severity | Notes |
|------|----------|-------|
| `~/.aws/credentials` | Critical | Plaintext AWS keys |
| `~/.aws/config` | None | Region/output only; no secrets |
| `~/.config/gh/hosts.yml` | Critical | `oauth_token` |
| `~/.npmrc` | Critical | `_authToken` |
| `~/.config/stripe/config.toml` | Critical | API keys |
| `~/.azure/msal_token_cache.json` | Critical | Access tokens |
| `~/.docker/config.json` | None | `credsStore: desktop`; no inline creds |

### 3.3 IDE / LLM

| Path | Severity | Notes |
|------|----------|-------|
| `~/.cursor/mcp.json` | Critical | Hardcoded GitHub PAT in env |
| `~/.claude/.credentials.json` | Critical | OAuth tokens, client secrets |
| `~/.codex/auth.json` | Critical | OpenAI tokens |
| `AppData\Roaming\Cursor\User\settings.json` | High / Medium | Broad autoApprove, bypass confirmations |
| `AppData\Roaming\Cursor\User\mcp.json` | None | Uses `"${GITHUB_PAT}"` env var |

---

## 4. Remediation Backlog

### 4.1 Immediate (Critical)

1. **Remove hardcoded credentials from MCP configs**
   - Replace `GITHUB_PERSONAL_ACCESS_TOKEN` in `~/.cursor/mcp.json` with env var reference (e.g. `"${GITHUB_PAT}"`).
   - Ensure `GITHUB_PAT` is set in environment (e.g. via User env vars or secure credential store).

2. **Rotate exposed credentials**
   - Rotate AWS keys in `~/.aws/credentials`.
   - Rotate GitHub tokens in `~/.config/gh/hosts.yml` and any MCP configs.
   - Rotate npm `_authToken` in `~/.npmrc`.
   - Rotate Stripe keys in `~/.config/stripe/config.toml`.
   - Revoke and reissue Claude tokens in `~/.claude/.credentials.json`.
   - Revoke and reissue Codex/OpenAI tokens in `~/.codex/auth.json`, then migrate to env var storage.

3. **Migrate to env vars or credential store**
   - `.env.example` documents env vars; use `.env` (gitignored) for local secrets.
   - Use Windows Credential Manager or similar for AWS, npm, Stripe where supported.

### 4.2 Short-term (High)

1. **Tighten auto-approve settings**
   - In `AppData\Roaming\Cursor\User\settings.json`, restrict `chat.tools.terminal.autoApprove` to a whitelist of safe commands instead of `"*": true`.
   - Consider enabling `anthropic.claude.showApprovalPrompts` for sensitive operations.

### 4.3 Long-term (Medium / Low)

1. **Audit Azure MSAL cache**
   - `msal_token_cache.json` is standard Azure CLI behavior; ensure it is not world-readable.

2. **Document credential hygiene**
   - See [docs/governance/credential-hygiene.md](docs/governance/credential-hygiene.md) for rules on credential storage and MCP env var usage.

3. **Run remediation checklist**
   - Step-by-step actions: [docs/audits/remediation-checklist-2026-03-16.md](remediation-checklist-2026-03-16.md).

---

## 5. Appendices

### 5.1 Path Inventory (audit targets)

| Path | Exists |
|------|--------|
| `C:\Users\mesha\Desktop\GitHub` | Yes |
| `C:\Users\mesha\Desktop\GitHub\workspace` | Yes |
| `C:\Users\mesha\Desktop\GitHub\github.com\alawein\alawein` | Yes |
| `C:\Users\mesha\.cursor` | Yes |
| `C:\Users\mesha\.claude` | Yes |
| `C:\Users\mesha\.codex` | Yes |
| `C:\Users\mesha\AppData\Roaming\Cursor` | Yes |
| `C:\Users\mesha\AppData\Roaming\Code` | Yes |
| `C:\Users\mesha\.ssh` | Yes |
| `C:\Users\mesha\.aws` | Yes |
| `C:\Users\mesha\.config` | Yes |

### 5.2 Taxonomy (artifact types)

| Type | Description | Examples |
|------|-------------|----------|
| Credentials | Tokens, keys, certs, password stores | `.env`, `credentials`, `auth.json`, `hosts.yml` |
| Config | App/tool settings, manifests | `settings.json`, `plugin.json`, `manifest.json` |
| Execution | Hooks, scripts, automation | `*.sh`, `hooks.json`, `PreToolUse` |
| TrustBoundary | MCP, remote integrations | `mcp.json`, env vars with secrets |

### 5.3 Indicator Dictionary (filename patterns)

- `.env*`, `*secret*`, `*token*`, `*credential*`, `*auth*`
- `.pem`, `.p12`, `.key`, `.kdbx`
- `credentials`, `config`, `hosts.yml`, `settings.json`

### 5.4 Content Indicators (no value extraction)

- `aws_access_key_id`, `aws_secret_access_key`
- `GITHUB_PERSONAL_ACCESS_TOKEN`, `GITHUB_PAT`
- `access_token`, `refresh_token`, `client_id`, `client_secret`
- `_authToken`, `api_key`, `apiKey`

### 5.5 Severity Rules

- **Critical:** Plaintext credential in broadly readable path
- **High:** Token/key in config history, log, or workspace-visible file
- **Medium:** Risky automation defaults, overbroad permissions
- **Low:** Weak hygiene (examples, templates)

---

*Audit performed per [full-environment-audit-execution_5910b5fc.plan.md](c:\Users\mesha\.cursor\plans\full-environment-audit-execution_5910b5fc.plan.md). Governance: AGENTS.md, CLAUDE.md, docs/governance/documentation-contract.md.*
