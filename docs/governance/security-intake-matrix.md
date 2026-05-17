---
type: canonical
source: none
sync: none
sla: on-change
title: Security intake matrix
description: >-
  Single routing table for vulnerability reports across spine repositories.
last_updated: 2026-05-17
category: governance
audience: [contributors, researchers, agents]
---

# Security intake matrix

Use this matrix to pick the **first** reporting channel. Do **not** open a public
GitHub issue for undisclosed vulnerabilities.

| Situation | Preferred channel | Repos / scope |
| --------- | ----------------- | ------------- |
| Organizational governance, workspace-wide policy, catalog/baseline tampering, secrets in control-plane docs | **security@kohyr.com** | `alawein/alawein` |
| Published npm design packages (`@alawein/*`), Storybook/showcase supply chain | **contact@meshal.ai** | `alawein/design-system` |
| Python workspace automation (`workspace-batch`), drift tooling, execution safety | **GitHub private security advisory** on `alawein/workspace-tools` **or** email **security@kohyr.com** if unsure whether GitHub access applies | `alawein/workspace-tools` |
| Cross-cutting issue (affects more than one spine repo or unclear ownership) | **security@kohyr.com** with repo names and reproduction | Spine + consumers |

**Observed:** Repo-level `SECURITY.md` files previously listed different contacts **Observed in spine brief**; this matrix does not remove those files; it routes reporters consistently.

**Inference:** Kohyr security inbox triages cross-repo issues; repository-specific SLAs in each `SECURITY.md` still apply where relevant.

## What to include

- Repository name and affected paths or packages.
- Reproduction steps or proof of concept when safe to share.
- Impact and severity estimate.
