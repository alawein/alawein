---
title: Documentation Contract
description: Authoritative local rules for document classes, freshness metadata, naming, and CI truthfulness in the alawein repository
last_updated: 2026-03-08
category: governance
audience: [ai-agents, contributors]
status: active
author: Morphism Systems LLC
version: 1.0.0
tags: [documentation, governance, contract, validation, ci]
---

# Documentation Contract

This document is the authoritative local contract for documentation in the
`alawein` repository. When local files and inherited ecosystem guidance differ,
this contract defines what is required for this repo to remain truthful and
self-consistent.

## Repository Scope

- Repository type: documentation-only organization profile and governance repo
- Build system: none
- Primary outputs: README, community health files, governance docs, and links to
  canonical ecosystem references

## Document Classes

| Class | Files | Frontmatter | Freshness key | Freshness SLA |
| --- | --- | --- | --- | --- |
| Canonical normative docs | `AGENTS.md`, `CLAUDE.md`, `SSOT.md` | Required | `last-verified` | Must be <= 30 days old |
| Observed lessons | `LESSONS.md` | Required | `last-updated` | Must change whenever lesson content changes |
| Managed governance docs | `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `DOCUMENTATION_PHILOSOPHY.md`, `docs/**/*.md` excluding `docs/archive/**` | Required | `last_updated` | Must change whenever document content changes |
| GitHub/profile exemptions | `README.md`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/*.md` | Optional | None | Exempt to preserve GitHub rendering and template compatibility |
| Historical archive | `docs/archive/**` | Preserve as-is | Optional | No freshness SLA |

## Required Files

The repository must contain these files:

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `LICENSE`
- `SECURITY.md`
- `CHANGELOG.md`
- `SSOT.md`
- `LESSONS.md`
- `docs/README.md`
- `docs/governance/documentation-contract.md`
- `docs/governance/workflow.md`
- `scripts/validate-doc-contract.sh`

## Naming Rules

- Root community and governance files keep their conventional filenames:
  `README.md`, `AGENTS.md`, `CLAUDE.md`, `SSOT.md`, `LESSONS.md`,
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`,
  `DOCUMENTATION_PHILOSOPHY.md`.
- Files under `docs/governance/` use `kebab-case.md`.
- `.github` templates keep GitHub-managed naming conventions.
- `docs/archive/**` keeps historical filenames unless a targeted migration is
  explicitly required.

## Truthfulness Rule

Repository docs may only claim validations that actually run in this repo via
local scripts or GitHub Actions workflows. Do not describe placeholder build,
test, accessibility, or policy checks unless they exist here.

## Local Validation

- Full repository validation: `./scripts/validate-doc-contract.sh --full`
- Diff-scoped validation: `./scripts/validate-doc-contract.sh --changed-only <base_ref>`

The validator enforces:

- required file existence
- frontmatter requirements for managed docs
- required freshness keys by document class
- `last-verified` age for canonical docs
- freshness-field updates when managed docs change in the current diff
- UTF-8 BOM prohibition for canonical docs
- local relative markdown link integrity

## CI Contract

### Fast CI

`/.github/workflows/ci.yml` is the mandatory fast gate for pushes and pull
requests. It runs:

- the local documentation contract validator
- markdown linting for managed docs

### Documentation Audit

`/.github/workflows/docs-validation.yml` is the slower documentation audit. It
runs:

- full contract validation
- markdown linting for managed docs
- legacy domain enforcement
- external link audit for governance docs

## Update Rules

- If you edit a managed doc, update its freshness field in the same change.
- If you edit `AGENTS.md`, `CLAUDE.md`, or `SSOT.md`, re-verify all normative
  claims those files make.
- If you add a new managed doc class, update this contract and the validator in
  the same change set.
