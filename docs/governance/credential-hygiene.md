---
type: canonical
source: none
sync: none
sla: none
title: Credential hygiene
description: Rules for storing and referencing secrets; aligns with full-environment audit findings
last_updated: 2026-03-16
category: governance
audience: [ai-agents, contributors]
---

# Credential hygiene

This document summarizes safe practices for credentials and secrets. It supports the remediation backlog from [docs/audits/full-environment-audit-2026-03-16.md](../audits/full-environment-audit-2026-03-16.md).

## Rules

1. **No secrets in the repository.** Do not commit `.env`, `credentials`, tokens, or API keys. Use `.env.example` with placeholders only; keep `.env` in `.gitignore`.

2. **MCP and IDE configs.** Do not hardcode tokens in `mcp.json` or similar. Use environment variable references (e.g. `"${GITHUB_PAT}"`) and set the variable in the environment or a secure store.

3. **CI/CD.** Use repository/organization secrets (e.g. GitHub Actions `secrets.*`) for tokens and keys. Never commit them.

4. **If credentials are exposed.** Rotate them immediately (AWS keys, GitHub tokens, npm auth, Stripe keys, etc.) and migrate to env vars or a credential store.

5. **Automation and approval.** Restrict broad auto-approve settings for terminal and tools to reduce risk from agent actions.

## MCP config example (safe pattern)

In user-level or project MCP config (e.g. `mcp.json`), reference tokens via environment variables instead of hardcoding:

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
  }
}
```

Set `GITHUB_PAT` in your environment (e.g. Windows user env vars, shell profile, or a secure credential helper) so the token never appears in config files.

## References

- Full environment audit: [docs/audits/full-environment-audit-2026-03-16.md](../audits/full-environment-audit-2026-03-16.md)
- Remediation checklist (step-by-step): [docs/audits/remediation-checklist-2026-03-16.md](../audits/remediation-checklist-2026-03-16.md)
- AGENTS.md: "Never do — Store secrets or credentials"
