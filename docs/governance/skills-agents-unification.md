---
type: canonical
source: none
sync: none
sla: none
title: Skills, Agents and Commands Unification
description: Pointer to the skills taxonomy and maintenance hub. Do not duplicate inventory here.
last_updated: 2026-09-06
category: governance
audience: [ai-agents, contributors]
status: active
---

# Skills, Agents and Commands Unification

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

This file is a pointer. Do not add another inventory or revision plan here.

| Concern | Canonical source |
| --- | --- |
| Maintenance, scope, artifact map | [`maintenance-skills-agents.md`](maintenance-skills-agents.md) |
| Install policy (global vs repo vs plugin) | [`skills-install-policy.md`](skills-install-policy.md) |
| Slash command list | [`slash-commands-catalog.md`](slash-commands-catalog.md) |
| Org agent inventory | [`catalog/agent-integrations.yaml`](../../catalog/agent-integrations.yaml) |
| Platform skill registry | `claude-agent-platform/skills/` plus `python3 scripts/catalog/build-skill-registry.py --check` |

## Taxonomy (unchanged)

- **Universal:** any repo or directory (session, audit, plan, implement, review).
- **Ecosystem:** kohyr-only governance (tenets, promote, validate).
- **Org:** alawein control-plane checks (`sync-readme.py`,
  `validate-doc-contract.sh`, `validate-agent-integrations.py`).

Cursor project rules under `.cursor/rules/` are short pointers, not copies of
these docs.
