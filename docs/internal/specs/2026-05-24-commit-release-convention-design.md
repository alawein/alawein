---
type: canonical
source: brainstorming session 2026-05-24
sla: on-change
last_updated: 2026-05-24
audience: [ai-agents, contributors]
---

# Commit, Branch, and Release Convention: design spec

Design record for the workspace-wide contribution convention. It lifts the "the
maintainer authors every commit" rule, gives agents scoped commit authority, and
unifies the partial conventions already scattered across `CLAUDE.md`, `AGENTS.md`,
and the fleet remediation plan into one source of truth.

## Decision summary (approved 2026-05-24)

- Agents may commit. Authority is set per repo as one of three modes; the default is `full`.
- No AI attribution. Agent commits are authored under the maintainer's canonical git identity, `contact@meshal.ai` (the Kohyr identity), workspace-wide; never a placeholder, never an agent identity. Any repo on a divergent or placeholder identity (for example the roka clone's test placeholder, or a clone set to `meshal@kohyr.com`) is corrected to `contact@meshal.ai` during rollout.
- Uniform semver across the whole fleet: `vX.Y.Z` tags + `CHANGELOG.md` + a GitHub release per tag.

## Why

The single-committer rule was the program's main throughput bottleneck: every
prepared change waited on the maintainer to type the commit. Agents can now
commit, while two narrow invariants still guard against irreversible harm. The
substance of the convention (conventional commit subjects, the `feat/fix/...`
branch prefixes, the version anchor) already existed in fragments; this spec
makes it one documented standard and resolves a live contradiction (the global
config said add `Co-Authored-By`, the project config said never add AI
attribution; no attribution wins).

## 1. Commit modes

Three modes, set per repo, default `full`:

- `full` (default): the agent commits, pushes, and merges to `main` directly,
  including releases and `.github/` changes. No approval gate.
- `guardrailed`: the agent commits and pushes a branch and opens a PR; the
  maintainer merges to `main`.
- `local`: the agent commits on a branch and never pushes; the maintainer pushes
  and merges.

Storage: a `commit_mode` field per entry in `catalog/repos.json` (the authored
SSOT). Absent means `full`.

Invariants that hold in EVERY mode, including `full`:

1. Never commit secrets, `.env` files, or credentials. Secrets are flagged for
   rotation, never committed or reproduced.
2. Force-push or history rewrite on a shared branch (`main` or an
   already-pushed branch) requires explicit maintainer confirmation.

Everything else, including `.github/` workflow edits, is ungated in `full` mode.
The standard quality bar still applies before any commit: relevant tests pass and
the agent has self-reviewed the change.

## 2. Commit message format

Conventional Commits, house-tuned:

- Subject: `type(scope): subject`. Imperative mood, lowercase, no trailing
  period, target 50 and hard cap 72 characters.
- Types: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `perf`, `build`,
  `ci`, `style`, `revert`.
- Scope: the component or area touched (package, module, bucket). Optional but
  encouraged.
- Body: explain why the change is made and any non-obvious context. Wrap at 72.
- Footers: `BREAKING CHANGE: <desc>` for incompatible changes; issue references
  such as `Closes #123` or `Refs #123`.
- Hard rules: no AI attribution, no em-dashes, American spelling.

Commit types drive the semver bump (see section 4).

## 3. Branch naming

`type/short-kebab-slug` off `main`, for example `fix/baseline-resolver` or
`feat/ci-adoption`. The `type` matches the commit types. Branches are deleted
after merge. Existing program branches (`chore/cleanup`, `fix/ci-green`,
`docs/...`) already conform.

## 4. Releases and versioning (uniform semver)

Every repo:

- Tags `vX.Y.Z` (semver). `0.x` is allowed before the first stable release.
- A `CHANGELOG.md` in Keep a Changelog form: an `Unreleased` section plus dated,
  versioned sections.
- A GitHub release created per tag.

Version anchor: the git tag and the top CHANGELOG entry are canonical; the
version in `pyproject.toml`, `package.json`, and any `__init__.py` derives from
them. The existing `version-coherence` check enforces agreement.

Bump rule from the commits since the last tag: a `feat` is a minor bump, a `fix`
(or other non-feat change) is a patch bump, a `BREAKING CHANGE` is a major bump.

Release flow: move `Unreleased` to the new version and date it, bump the derived
version files, tag `vX.Y.Z`, push the tag, create the GitHub release. In `full`
mode the agent performs this; in `guardrailed`/`local` it proposes it.

## 5. Enforcement (phased)

Document the convention now; enforce in stages so the fleet is not born red:

1. Now: the convention doc is the reference; agents follow it.
2. Next: add a commit-subject lint and a CHANGELOG-updated check on pull requests
   (advisory first).
3. After repos converge: flip the `version-coherence` check from warn to blocking
   in the reusable CI.

Rejected alternatives: strict-from-day-one (clean but produces immediate red
across all 36 repos) and doc-only (no machine enforcement, drifts over time).

## 6. Governance reconciliation and rollout

The rollout (to be sequenced by a writing-plans implementation plan):

- Write the canonical doc `docs/governance/commit-release-convention.md` and link
  it from `CONTRIBUTING.md`; sync it fleet-wide.
- Update the surfaces that currently state "maintainer authors all commits":
  global `~/.claude/CLAUDE.md`, project `CLAUDE.md`, `AGENTS.md`, and the
  `project_fleet_remediation.md` memory. Replace the single-committer rule with
  the three-mode model and the two invariants.
- Resolve the attribution contradiction in favor of no attribution.
- Add `commit_mode` to `catalog/repos.json` (default `full`) and regenerate
  derived catalog outputs.
- Dogfood: commit this session's staged backlog under the new convention, in
  coherent per-repo commits.

## Open items, resolved by recommendation

- `.github/` is ungated in `full` mode; the two invariants (no secrets, confirm
  before destructive history) still apply.
- Enforcement is phased per section 5; not blocking on day one.
