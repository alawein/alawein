---
type: canonical
source: none
sync: none
sla: none
title: Operator Command Cheatsheet
description: Preferred slash commands for daily operation across any repo or directory, with ecosystem and org-specific add-ons.
last_updated: 2026-03-16
category: governance
audience: [ai-agents, contributors]
status: active
---

# Operator Command Cheatsheet

Use this as the shortest reliable command set.

## Universal (Any Repo or Directory)

Preferred command family:

- `/workspace:session-start`
- `/workspace:context`
- `/workspace:check-patterns`
- `/workspace:check-complexity`
- `/workspace:audit-deps`

Compatibility aliases (still supported):

- `/repo-superpowers:session-start`
- `/repo-superpowers:context`
- `/repo-superpowers:check-patterns`
- `/repo-superpowers:check-complexity`
- `/repo-superpowers:audit-deps`

Cursor-local parity (if using Cursor plugin directly):

- `/workspace-universal:session-start`
- `/workspace-universal:context`

## Feature Workflow (Fast Path)

1. `/workspace:session-start`
2. `/compound-engineering:workflows:plan <feature>`
3. `/compound-engineering:workflows:work`
4. `/compound-engineering:workflows:review`
5. Run project validate/test commands

## Research Workflow

1. `/workspace:context`
2. `/parallel:parallel-search <query>`
3. `/context7:docs <library> [topic]`
4. `/parallel:parallel-extract <url>`

## Bug Workflow

1. `/workspace:session-start`
2. `/compound-engineering:reproduce-bug <issue-number>`
3. `/compound-engineering:workflows:review`

## Morphism Add-On (Only in kohyr repos)

- `/morphism:session-start`
- `/morphism:context`
- `/morphism:tenet-check`
- `/morphism:validate --quick`
- `/morphism:review`

## Alawein Add-On (Only in alawein repo)

Not slash commands. Run:

- `python scripts/sync-readme.py --check`
- `./scripts/validate-doc-contract.sh --full`

## Deploy

- App deploy: `/vercel:vercel-deploy`
- Docs deploy prep: `/compound-engineering:deploy-docs`

