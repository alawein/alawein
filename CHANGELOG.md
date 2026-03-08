---
title: Changelog
description: Version history and notable changes to the alawein organization repository
category: documentation
audience: all
status: active
author: Morphism Systems LLC
version: 1.0.0
last_updated: 2026-03-08
tags: [changelog, version-history, releases]
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added a repository-local documentation contract and validator script for
  freshness, frontmatter, BOM, and local-link enforcement.
- Added a clean-slate workflow guide for stash hygiene, branch recovery, and
  notebook or asset separation.
- Added a full governance doc suite covering the operating model, Git
  operations, feature lifecycle, review, merge, and release flow.

### Changed

- Updated the shared package migration guidance to reflect the active consumer pattern: in-workspace repositories now resolve `@alawein/*` packages through local `devkit` `file:` references, with refreshed installs across the first consumer batch.
- Replaced the placeholder Node build assumptions with docs-only CI and a
  slower documentation audit workflow.
- Updated canonical governance docs to document explicit GitHub-file exemptions
  and local validation commands.
- Refactored overview docs into a hub-and-spoke navigation model so task
  routing lives in `docs/README.md`, `workflow.md`, and the new specialized
  governance guides.

## [2.0.4] — 2026-03-07

### Changed
- Started the `@alawein/*` producer-side namespace migration in `devkit/` and updated shared workspace registries to use the lowercase `qaplibria` repo slug.
- Reconfirmed that the live `QAPlibria` root rename is still blocked by a Windows filesystem handle, so the physical rename remains deferred.

## [2.0.3] — 2026-03-06

### Added
- Added a shared package namespace matrix to track `@malawein` consumers and migration dependencies across the workspace.

### Changed
- Updated the workspace migration contract with confirmed repository slug audit results and the current blocker on the live `qaplibria` root rename.

## [2.0.2] — 2026-03-06

### Added
- Added a canonical workspace standardization guide covering root naming, stack-based layouts, shared package migration, and implementation phases.

### Changed
- Started workspace cleanup by renaming safe non-repository support directories with a leading underscore and documenting the deferred cases.

## [2.0.1] — 2026-03-06

### Added
- Added a dedicated changelog entry guide for drafting Keep a Changelog releases from recent commits.

### Changed
- Promoted changelog authoring to a first-class governance workflow alongside the existing contribution and release guidance.

## [2.0.0] — 2026-03-06

### Added
- Workspace standardization (P1-P20) across all 21 repos (#58)
- HackerRank.ipynb problem-solving notebook
- RevisionNotebook.ipynb for revision and prep
- Canonical governance files with YAML frontmatter (SSOT.md, cross-links)
- npm packages, governance model, and research repos

### Changed
- Rewrote GitHub profile README: AI Research Engineer focus with real projects and tech stack
- Updated profile README and cleaned submodule refs
