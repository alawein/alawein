---
type: canonical
source: none
sync: none
sla: none
title: GitHub Baseline
description: Canonical GitHub profile, repository metadata, workflow, and community-health baseline for the alawein workspace.
last_updated: 2026-04-15
category: governance
audience: [ai-agents, contributors]
status: active
author: Morphism Systems Inc.
version: 1.0.0
tags: [github, ci, security, profile, governance]
---

# GitHub baseline

This guide defines the GitHub baseline for the `alawein` control plane and the
active repo cohort it manages.

## Profile policy

- The profile README stays minimal: a short bio, compact links, and no vanity
  widgets.
- Pinned repositories carry the portfolio signal; the README should not try to
  duplicate full project cards or activity dashboards.
- `catalog/repos.json` is the canonical source for repo descriptions, topics,
  and homepage metadata.
- `projects.json` is derived output for downstream consumers and should not be
  used as the canonical profile pin lookup source.
- `profile-from-guides.yaml` remains the canonical source for the public-facing
  profile copy and the pinned repo list.
- Live profile pin drift is verified read-only by `scripts/verify-profile-pins.py`;
  pin updates remain a manual GitHub UI operation.

## Repository metadata policy

- New repositories must use lowercase `kebab-case`.
- Repository descriptions and topic cleanup should be driven from canonical data
  in `catalog/repos.json` and `catalog/generated/github-metadata.json`, not from
  ad hoc edits.
- `CODEOWNERS` defaults to `* @alawein` unless a repo documents a narrower
  ownership model.

## Workflow baseline

- Shared GitHub workflow policy lives in this repo and is propagated from
  `scripts/sync-github.sh`.
- Reusable workflows under `.github/workflows/` are the canonical source for:
  - Node CI
  - Python CI
  - CodeQL scanning
- GitHub Actions must stay SHA-pinned.
- Managed repo reusable-workflow consumers must use the immutable
  `workflow_ref` declared in `github-baseline.yaml`; floating refs such as
  `@main` are not permitted.
- Node CI targets Node.js `22` and `24`.
- Python CI defaults to Python `3.12`.
- `github-baseline.yaml` is the manifest for repo-specific install, build, test,
  CodeQL, and sync decisions.

## Community-health baseline

- Issue templates must use YAML issue forms, not Markdown issue templates.
- Pull requests must use `PULL_REQUEST_TEMPLATE.md`.
- Dependabot must always include the `github-actions` ecosystem.
- This phase does not add Husky or commitlint enforcement; CI remains the
  enforcement layer.

## Security baseline

- Active supported repos should receive CodeQL coverage through the reusable
  workflow path.
- Planned, dormant, unsupported-language, or externally owned repos may be
  tracked in `github-baseline.yaml` with `sync: manual`.
- Manual GitHub settings remain out-of-repo work:
  - account-level secret scanning and push protection
  - rulesets requiring status checks, signed commits, and linear history
  - SSH commit signing
- Profile pin updates are manual and should end with a read-only rerun of
  `python scripts/verify-profile-pins.py --check`.

## Docs-doctrine exception

GitHub-native surfaces remain exempt from frontmatter rules where GitHub
requires raw filenames or schema-specific content:

- `README.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/*.yml`

Those files are still governed by this baseline and by
`scripts/validate-doc-contract.sh`, but they should not be wrapped in YAML
frontmatter.
