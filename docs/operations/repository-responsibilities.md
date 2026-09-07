---
type: derived
source: ../../catalog/governance-decisions.yaml
sync: manual
sla: on-change
title: Repository Responsibility Review
description: Navigation and review gates for repository responsibility decisions
last_updated: 2026-09-07
category: operations
audience: [ai-agents, contributors]
status: active
---

# Repository Responsibility Review

This page is a navigation aid, not a repository registry. It does not assign,
change, or consolidate responsibility.

## Owning records

Use the existing authority for each question:

| Question | Owning record |
| --- | --- |
| What is the curated public repository profile? | [`catalog/index.yaml`](../../catalog/index.yaml) |
| Which repository roles are established or proposed? | [`catalog/governance-decisions.yaml`](../../catalog/governance-decisions.yaml) |
| Where does a shared resource belong? | [Workspace resource map](../governance/workspace-resource-map.md) |
| What owns operational repository coverage? | Existing private workspace-control registry |
| What are the delivery and evidence rules? | [Work record taxonomy](../governance/work-record-taxonomy.md) |

An audit observation may identify an unresolved overlap, but it must not promote
a proposed role to established status. Update the owning record through its
review process when a decision is accepted.

## Consolidation gate

Before moving, renaming, archiving, or merging responsibilities, identify:

1. Current owner and lifecycle from the owning record.
2. Inbound and outbound consumers.
3. Runtime and automation dependencies.
4. Unique history and artifacts.
5. Replacement path and redirect plan.
6. Validation evidence.
7. Reversible rollback procedure.
8. Required review and final approval.

Similarity, age, inactivity, or duplicated content does not prove that a
repository is safe to consolidate.

## Existing contribution conventions

Do not create another convention layer. Use:

- [Commit and release convention](../governance/commit-release-convention.md)
  for branches, commits, pull requests, merges, and releases.
- [Work record taxonomy](../governance/work-record-taxonomy.md) for issues,
  labels, and change evidence.
- [Documentation contract](../governance/documentation-contract.md) and
  [voice guide](../style/VOICE.md) for READMEs and documentation.
- [Brand system](../style/brand-system.md) and
  [`catalog/assets.json`](../../catalog/assets.json) for visual identity.
- [Repository layout standard](../governance/repository-layout-standard.md)
  for repository structure.

Resolve conflicts in the owning source rather than copying a new standard here.
