---
type: canonical
source: none
sync: none
sla: on-change
title: Commit, Branch, and Release Convention
description: Single source of truth for commit authority, commit messages, branches, merge policy, and releases across the alawein workspace
category: governance
audience: [ai-agents, contributors]
status: active
last_updated: 2026-06-09
tags: [commits, branches, merge, releases, semver, agents, convention]
---

# Commit, Branch, and Release Convention

The single source of truth for how work is committed, branched, merged, and
released across the `alawein` workspace and its sibling repos. It consolidates
and supersedes `branch-and-deployment-convention.md`, `release-playbook.md`,
`merge-policy.md`, `feature-lifecycle.md`, and `changelog-entry.md`. The
operational runbooks stay the how-to references and are linked where relevant:
`git-operations.md` (day-to-day mechanics), `clean-slate-workflow.md` (resetting
a messy worktree), `review-playbook.md` (author and reviewer checklist).

## 1. Commit authority and modes

Agents may author commits. Authority is set per repo by a `commit_mode` field in
`catalog/repos.json`; an absent field means `full`.

| Mode | The agent may | Gated to the maintainer |
|------|---------------|-------------------------|
| `full` (default) | commit, push, and merge to `main`, including releases and `.github/` | nothing beyond the invariants below |
| `guardrailed` | commit and push a branch, open a PR | merge to `main` |
| `local` | commit on a branch | push and merge |

Two invariants hold in every mode, including `full`:

1. Never commit secrets, `.env` files, or credentials. A secret is flagged for
   rotation, never committed or reproduced.
2. Force-push or history rewrite on a shared branch (`main` or any branch already
   pushed) requires explicit maintainer confirmation.

Attribution and identity: no AI attribution anywhere in the message (subject,
body, or trailers). Agent commits are authored under the maintainer's canonical
git identity, `contact@meshal.ai` (the Kohyr identity), workspace-wide. A repo on
a placeholder or divergent identity is corrected to `contact@meshal.ai` first.

Quality bar before any commit, in every mode: the relevant checks pass (repo
tests/lint, and the doctrine gate when governance docs change) and the author has
self-reviewed the diff.

## 2. Commit messages

Conventional Commits, house-tuned:

- Subject: `type(scope): subject`. Imperative mood, lowercase, no trailing
  period, target 50 and hard cap 72 characters.
- Types: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `perf`, `build`,
  `ci`, `style`, `revert`.
- Scope: the component or area touched (package, module, bucket). Optional but
  encouraged, for example `feat(catalog): ...`.
- Body: explain why the change is made and any non-obvious context. Wrap at 72.
- Footers: `BREAKING CHANGE: <description>` for incompatible changes; issue
  references such as `Closes #123` or `Refs #123`.
- Hard rules: no AI attribution, no em-dashes, American spelling.

Commit types drive the version bump (section 5). Keep commits small and frequent;
keep unrelated changes out of the same commit.

## 3. Branches

Branch taxonomy (canonical):

| Prefix | Use when | Merge strategy |
|--------|----------|----------------|
| `main` | Protected default; PR-first | n/a |
| `feat/*` | Additive scoped work (features, docs, governance) | Squash |
| `fix/*` | Scoped bugfix or drift correction | Squash |
| `chore/*` | Non-feature chores (deps, config, rename) | Squash |
| `hotfix/*` | Urgent fix, fast-tracked | Merge commit allowed |
| `release/*` | Pre-tag stabilization | Merge commit allowed |
| `fast/*` | Short-lived spike or discovery | Delete or promote to `feat/*` |
| `codex/<batch-id>/<slug>` | Autonomous batch, one branch per repo | Squash |

Naming rules: kebab-case, intent-revealing, four path segments or fewer; prefer
`feat/domain-outcome` (for example `feat/docs-governance-suite`). Legacy
`feature/*` branches are accepted until merged and deleted; new branches use
`feat/*`.

Workflow (any repo):

1. Branch from `main`: `git switch main && git pull --ff-only origin main && git switch -c feat/your-scope`.
2. Work: scoped changes only; no direct push to `main`.
3. Validate: repo lint and tests, plus the org doctrine gate in `alawein` when
   touching governance (`bash ./scripts/doctrine/validate-doc-contract.sh --full`).
4. Push: `git push -u origin feat/your-scope` (modes `full` and `guardrailed`).
5. PR: open into `main`; request review (`review-playbook.md`).
6. Merge: per the merge policy in section 4.
7. After merge: `git switch main && git pull --ff-only origin main`; delete the
   local and remote branch.

Multi-repo work uses one branch per repo via `parallel-batch-execution.md`.
Hygiene: delete merged branches locally and on origin; `git fetch --prune` stale
remotes; prefer short-lived branches. Day-to-day mechanics: `git-operations.md`.

## 4. Merge policy

Approved strategies: squash is the default for `feat/*`, `fix/*`, `chore/*`, and
`fast/*`; a merge commit is allowed for `hotfix/*` and `release/*` when
chronology matters; rebase merge is not the documented default.

A branch is merge-ready when the branch type matches the work, the diff is
reviewable, required docs are updated, validation evidence exists, and the chosen
strategy fits the branch class and risk.

Prohibited: direct push to `main` (outside `full`-mode automated commits and
admin emergencies), plain `git push --force`, merging a branch whose summary no
longer matches the diff, and bundling unrelated work without a documented reason.

Force-merge is an exception, acceptable only when the change is urgent enough that
delay is worse than the known risk, the blocking CI failure is external or
unrelated to the branch logic, and the risk is documented. Even then, review the
final diff locally, run the relevant checks, and record the follow-up.

Resolve conflicts on the branch before merge: pull latest `main`, update the
branch, resolve with current policy text as the source of truth, rerun
validation. If a conflict reveals a policy contradiction, fix the governing doc
rather than patching around it in the PR.

Automation branches may keep provider-generated names; they still need green or
understood checks, a human decision when they touch governance truth, and
cleanup after merge. After merge: delete the branch remotely and locally, update
`CHANGELOG.md`, and prune stale branches.

Recommended `main` protection: require pull requests, require the fast CI checks,
allow squash merge, allow merge commits for the approved exception classes, and
disable direct pushes except for explicit admin emergencies.

## 5. Releases and versioning (uniform semver)

Every repo uses semantic versioning, not milestone-only tagging:

- Tags `vX.Y.Z` (for example `v2.1.0`). `0.x` is allowed before the first stable
  release.
- A `CHANGELOG.md` in Keep a Changelog form: an `Unreleased` section plus dated,
  versioned sections.
- A GitHub release created per tag.

Version anchor: the git tag and the top `CHANGELOG.md` entry are canonical; the
version in `pyproject.toml`, `package.json`, and any `__init__.py` derives from
them. The `version-coherence` check enforces agreement.

Bump rule, from the commits since the last tag: a `feat` is a minor bump; a `fix`
or other non-feat change is a patch bump; a `BREAKING CHANGE` is a major bump.

### 5.1 Pre-release identifiers

Order pre-releases `X.Y.Z-alpha.N` < `X.Y.Z-beta.N` < `X.Y.Z-rc.N` < `X.Y.Z`.
Use `-rc.N` tags on `release/*` stabilization. A pre-release tag may carry a
provisional CHANGELOG entry; on final release those entries roll up into the
single dated `X.Y.Z` entry. A pre-release tag never sets a new stable baseline
for `version-coherence`.

### 5.2 0.x semantics and the 1.0.0 trigger

In `0.x` there is no MAJOR digit, so MINOR absorbs features and breaks: `feat`
and `BREAKING CHANGE` both bump MINOR (`0.Y.0`); `fix` and other
backward-compatible changes bump PATCH (`0.y.Z`). This keeps continuity with the
`1.x` mapping; the only `0.x` deviation is that a break lands as MINOR.
Graduating `0.x` to `1.0.0` is an outcome decision (first stable public contract,
first external consumer, or the declared launch outcome), the single sanctioned
coupling between versioning and outcomes (see `release-roadmap-and-outcomes.md`).
Past `1.0`, strategy never forces a MAJOR; only a contract break (5.4) does.

### 5.3 Monorepo versioning mode

A repo is either fixed (one version, tag, and CHANGELOG for the whole repo) or
independent (per-package, via changesets). Record the mode per repo in
`catalog/repos.json` alongside `commit_mode` (for example `release_mode: fixed`);
absent means fixed.

### 5.4 Contract-surface definition

"Breaking" is meaningful only against a declared, closed-world surface list,
published where consumers see it (repo README or `CONTRACT.md`): anything not
listed carries no stability promise. Review the list whenever a new external
consumer appears. A `BREAKING CHANGE` footer is warranted only when a declared
surface breaks.

### 5.5 Independent contract versions

An artifact may carry its own SemVer line (for example an attestation or wire
schema). Independence is asymmetric: a backward-compatible schema bump is
independent of the product version, but a breaking schema change is, by 5.4, a
break of a declared surface and therefore also moves the product version. Keep a
per-repo registry of these contracts and their current versions.

### 5.6 Release operations

CHANGELOG entry flow: inspect recent commits (`git log --oneline -20`), group
them into Keep a Changelog categories (Added, Changed, Fixed, Removed, Security),
write the next version entry in past tense with user-facing outcomes, omit empty
categories, and prepend it directly below `## [Unreleased]`. Entry format:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- Added a capability (#PR when available)

### Fixed
- Fixed a regression
```

When the repo uses outcome-based releasing, add an `Outcome: <id(s)>` or
`Maintenance:` line immediately after the version and date header, per
`release-roadmap-and-outcomes.md`.

Release flow: move `Unreleased` into the new version and date it, bump the
derived version files, tag `vX.Y.Z`, push the tag, create the GitHub release. In
`full` mode the agent performs this; in `guardrailed` and `local` it proposes it.

Release checklist: `CHANGELOG.md` reflects the actual outcome; release-worthy
work is on `main`; validation passed on the final state; the version bump matches
the scope; the tag or release notes read without opening the full diff.

Automation prerequisites: a repo using `changesets/action` to open a release PR
must allow GitHub Actions to create and approve pull requests (repository
settings, Actions, General, Workflow permissions). Keep the release expectation
in `catalog/repos.json` under `repo_settings.release_pr_automation` and converge
the GitHub state from the catalog via `python scripts/sync-github-metadata.py`.
If `NPM_TOKEN` is absent, keep the workflow in version-only mode and skip npm
publication rather than letting `main` go red.

Rollback: prefer a targeted follow-up commit or `git revert`; do not rewrite
published history; if a release tag captured incorrect truth, fix the repo first
and decide whether a corrective patch tag is warranted.

## 6. Deployment and CI workflow naming

Vercel: production deploys from `main` (Vercel Git integration or `vercel deploy
--prod` after merge); every branch and PR gets a preview URL when connected. From
`alawein`, audit production aliases with `python scripts/vercel_alias_audit.py`
(add `--apply` to fix).

CI workflow filenames in `.github/workflows/` use descriptive kebab-case, one
workflow per concern: `ci.yml` (lint, typecheck, build), `test.yml` (full
suite), `codeql.yml` (security), `docs-doctrine.yml` (managed centrally; do not
modify per repo), `release.yml` (semantic release or changesets), `deploy.yml`
and `deploy-production.yml` (Vercel). Do not rename existing working workflows
(it breaks branch protection and badges).

## 7. Enforcement (phased)

1. Now: this convention is the reference; agents follow it.
2. Next: a commit-subject lint (`scripts/doctrine/commit_lint.py`) and a
   CHANGELOG-updated check run on pull requests, advisory first.
3. After repos converge on coherent versions: flip the `version-coherence` check
   from warn-only to blocking in the reusable CI.

A local `commit-msg` hook running `commit_lint.py` is optional, mirroring the
existing Docs Doctrine pre-commit hook.

## 8. Superseded docs and related references

Superseded by this convention (now redirect stubs): `branch-and-deployment-convention.md`,
`release-playbook.md`, `merge-policy.md`, `feature-lifecycle.md`,
`changelog-entry.md`.

Operational runbooks (current, complementary): `git-operations.md`,
`clean-slate-workflow.md`, `review-playbook.md`.

Related: `parallel-batch-execution.md` (multi-repo rollout), `docs-doctrine.md`
(documentation standards), `docs/style/VOICE.md` (voice and the em-dash ban),
`credential-hygiene.md` (secrets), `version-history-audit.md` (version-history
convergence protocol), `release-roadmap-and-outcomes.md` (outcome-to-version
bridge).
