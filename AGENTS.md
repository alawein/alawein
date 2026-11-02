# Profile repository

This repository publishes the GitHub profile README and its approved artwork.

## Start here

1. Read this file and the latest entry in `docs/lessons.md`.
2. Check the branch and working tree before editing.
3. Run `just check` to establish the local baseline.
4. Follow the shared agent rules in [alawein/.github](https://github.com/alawein/.github/blob/main/docs/system/agents.md). This file adds profile-specific rules.

## Commands

| Task                 | Command       |
| -------------------- | ------------- |
| List tasks           | `just --list` |
| Lint Markdown        | `just lint`   |
| Check local links    | `just test`   |
| Build                | `just build`  |
| Run all local checks | `just check`  |
| Fix Markdown style   | `just fix`    |

Install `just`, Node.js 22 or newer, and lychee 0.24.2 before running local checks. The lint task uses the exact markdownlint-cli2 version used by CI. CI also validates the workflow and pull request title; a separate nightly job checks external links.

## Layout

| Path                 | Purpose                         |
| -------------------- | ------------------------------- |
| `README.md`          | Public profile text and links   |
| `assets/`            | Approved profile artwork        |
| `.github/workflows/` | Pull request and nightly checks |
| `docs/lessons.md`    | Short session lessons           |

## Rules

- Preserve the approved README copy, opening picture, and banner unless the owner asks for a specific change.
- Do not invent claims, titles, experience, prices, availability, or artwork.
- Do not add a license. This repository has no license by design.
- Do not weaken `.markdownlint-cli2.yaml`, `.lycheeignore`, or required CI checks to make a change pass.
- Keep credentials out of files and output. Do not read or change `.env` files or secrets.
- Keep one source of truth for agent rules here; `CLAUDE.md` only imports this file.
- Get the owner's authorization before commits, pushes, pull requests, settings changes, or publication. Only the owner merges.

## Verify

Run `just check` and validate workflow syntax before reporting completion. Open every changed page and check each new local link. State which checks ran and any that could not run.

## Review guidelines

Follow the shared [review policy](https://github.com/alawein/.github/blob/main/docs/system/reviewers.md).

- CodeRabbit becomes the sole automatic reviewer only after named owner approval for this repository's activation and review comments. Keep code-writing features disabled.
- Other reviewers require a named owner-approved request specifying the risk, paths, revision and any spend.
- Preserve required CI checks, exact toolchain pins, frozen inputs, and approved copy and artwork.
- Report actionable defects with affected lines, impact, evidence and a rule-file citation. Deduplicate existing findings and CI failures.
- Review findings authorize no gated action. Rule-file patterns and review filters do not restrict app access; effective account settings remain UNVERIFIED until inspected.
