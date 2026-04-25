---
title: Spec 1 — Workspace Tooling Fixes
date: 2026-04-25
status: active
type: canonical
feeds: [master-execution-plan]
---

# Spec 1 — Workspace Tooling Fixes

**Repo:** `alawein/` (control plane)
**Track:** Sequential with Spec 4; parallel with Specs 2, 3, 5
**Source:** 2026-04-24 workspace review — Layer A gaps (SHA pinning, .gitignore), Layer C (Undermaintained: hooks, drift-detection, workflow baseline, enforcement tiers)

---

## Purpose

Fix four enforcement mechanisms in the alawein control plane that are currently broken or missing. All four are S-effort changes that propagate immediately to all 19 `sync:auto` repos via `sync-github.sh`.

---

## Change 1 — Claude Code hooks

**Current state:** `.claude/settings.json` declares hooks under `pre-commit`, `post-commit`, and `hourly` — none of which are valid Claude Code hook events. Hooks never fire.

**Fix:** Rewrite `.claude/settings.json` hooks block using valid event keys. Map existing scripts to appropriate events:

| Script | New event | Trigger condition |
|--------|-----------|-------------------|
| `scope-binding-check.sh` | `PreToolUse` | `matcher: "Edit\|Write\|Bash"` — blocks unsafe path patterns |
| `observability-log.sh` | `Stop` | Runs after every session ends |
| `drift-detection.sh` | `Stop` | Runs after every session ends (after rewrite in Change 2) |

**Files:**
- Modify: `alawein/.claude/settings.json`

---

## Change 2 — drift-detection.sh rewrite

**Current state:** Script resolves `template_source` to `../../../_pkos` — a path that no longer exists. When the template directory is missing, the script silently continues and prints "No governance drift detected." unconditionally. This is a false-green.

**Fix:** Rewrite `drift-detection.sh` as a real governance drift check. Instead of diffing against a template directory, compare SHA-256 checksums of the four canonical governance files against a committed baseline in `.claude/hooks/governance-checksums.json`.

Logic:
1. Compute `sha256sum` of `AGENTS.md`, `CLAUDE.md`, `SSOT.md`, `docs/style/VOICE.md`
2. Compare against `.claude/hooks/governance-checksums.json`
3. If any file differs → print diff summary and exit 1 (Stop hooks that exit 1 surface a message to the user)
4. If all match → print "Governance files unchanged." and exit 0

**Files:**
- Modify: `alawein/.claude/hooks/drift-detection.sh`
- Create: `alawein/.claude/hooks/governance-checksums.json` (initial checksums of current canonical files)

**Update process:** When a canonical file is intentionally changed, run `bash .claude/hooks/update-checksums.sh` to regenerate the baseline. Add `update-checksums.sh` alongside `drift-detection.sh`.

---

## Change 3 — Dependabot for GitHub Actions

**Current state:** `github-baseline.md` requires SHA-pinned Actions refs, but no Dependabot config exists in any repo. When Actions release new versions, pins go stale and repos drift toward floating tags.

**Fix:** Add `dependabot.yml` to the `sync-github.sh` template set so it propagates to all `sync:auto` repos.

Template content:
```yaml
version: 2
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
      day: monday
    commit-message:
      prefix: "ci"
    labels:
      - "dependencies"
    open-pull-requests-limit: 5
```

**Files:**
- Create: `alawein/.github/dependabot.yml` (the template source)
- Modify: `alawein/scripts/sync-github.sh` — add `dependabot.yml` to the propagated file list
- Modify: `alawein/github-baseline.yaml` — add `dependabot` as a required baseline file

---

## Change 4 — .gitignore template: private key patterns

**Current state:** The `.gitignore` template in `sync-github.sh` does not include `*.pem`, `*.key`, or `*.p12`. All 8 sampled repos are missing these patterns.

**Fix:** Add the three patterns to the `.gitignore` template block in `sync-github.sh`. On the next sync run these propagate to all `sync:auto` repos.

Patterns to add:
```
*.pem
*.key
*.p12
```

**Files:**
- Modify: `alawein/scripts/sync-github.sh`

---

## Change 5 — docs-validation propagation

**Current state:** `docs-validation.yml` only runs in the `alawein` control plane. Blocking-tier violations (README, CLAUDE.md, AGENTS.md) in sibling repos are never caught by CI.

**Fix:** Create a trimmed `docs-validation-managed.yml` template containing only the checks applicable to sibling repos (forbidden register, README structure). Exclude catalog-build and VOICE.md validation steps that are `alawein/`-specific. Add to the `sync-github.sh` template set.

The trimmed workflow runs:
- `validate.py --ci` (forbidden register check)
- `markdownlint-cli` on `README.md`, `CLAUDE.md`, `AGENTS.md`
- Triggers on: `push` to `main` and `pull_request` on `*.md` paths

**Files:**
- Create: `alawein/.github/workflows/docs-validation-managed.yml`
- Modify: `alawein/scripts/sync-github.sh` — add to propagated workflow list
- Modify: `alawein/github-baseline.yaml` — add `docs-validation-managed` to required workflows

---

## Validation

After applying all changes, run the existing validation suite from `alawein/`:

```bash
python scripts/build-style-rules.py --check
python scripts/validate.py --ci
bash ./scripts/validate-doc-contract.sh --full
./scripts/sync-github.sh --check --all
python scripts/github-baseline-audit.py
```

All must pass before committing.

---

## Constraints

- Do not modify any sibling repo directly — all changes propagate via `sync-github.sh`
- The `governance-checksums.json` baseline must be committed with the current canonical file state, not a future desired state
- `docs-validation-managed.yml` must not reference alawein-internal scripts (`build-catalog.py`, `validate-catalog.py`) — those only exist in the control plane
