---
type: canonical
source: alawein
sla: on-change
last_updated: 2026-04-30
audience: [agents, contributors]
---

# Prompt Kit Rollout Protocol

Governs how changes to canonical prompt kits (`prompt-kits/AGENT.md`,
`PORTFOLIO.md`, `docs/governance/workspace-master-prompt.md`) progress from
draft to general availability across the workspace.

---

## Rollout Stages

| Stage | Repos Active | Gate to Next Stage |
|-------|-------------|-------------------|
| `draft` | None — local testing only | `validate-prompt-kit.py` passes |
| `canary` | alawein repo only | PR merged; no regressions in CI for 48 h |
| `staged` | alawein + meshal-web + workspace-tools | Manual review; downstream CI green |
| `ga` | All `downstream-consumers` listed in registry | No P1/P2 issues after staged soak |
| `deprecated` | None | Migration guide written; sunset date set |

Rollout state is tracked in `prompt-kits/registry.yaml` → `rollout-status` field.

---

## Step-by-Step Rollout

### 1. Draft

1. Create a `feat/prompt-<kit>-v<version>` branch.
2. Edit the prompt kit file and bump `version` in frontmatter.
3. Add `CHANGELOG.md` entry.
4. Run `python scripts/validate-prompt-kit.py` — must exit 0.
5. Update `prompt-kits/registry.yaml` → `rollout-status: canary`.

### 2. Canary

1. Open PR with label `prompt-kit`.
2. `ai-review.yml` will post an automated diff analysis comment.
3. Merge after owner review.
4. Monitor CI for 48 h; no failures attributable to prompt change.

### 3. Staged

1. Update `rollout-status: staged` in `registry.yaml`.
2. Notify downstream repo owners (meshal-web, workspace-tools).
3. Open PRs in downstream repos to update their local `AGENTS.md` or prompts if needed.
4. Verify downstream CI green.

### 4. GA

1. Update `rollout-status: ga` in `registry.yaml`.
2. Update `downstream-consumers` if new repos have adopted.
3. Close the rollout tracking issue if one was opened.

### 5. Deprecation

1. Set `rollout-status: deprecated`, `deprecated-version: <current>`, `sunset-date: <YYYY-MM-DD>`.
2. Write migration guide in `prompt-kits/CHANGELOG.md`.
3. At sunset date, remove or archive the kit.

---

## Rollback

If a canary or staged prompt causes downstream CI regressions:

1. Revert the prompt kit commit via `git revert`.
2. Open a post-mortem issue with label `prompt-kit`.
3. Add a `LESSONS.md` entry if the root cause is non-obvious.
4. Reset `rollout-status: draft` in `registry.yaml` before re-attempting.

---

## Version Semantics

| Bump | Meaning | Example |
|------|---------|---------|
| patch (x.y.Z) | Wording, clarity, formatting only | Fix typo in Hard Constraints |
| minor (x.Y.0) | New constraint, rule, or section added | Add Mathematical Writing section |
| major (X.0.0) | Breaking behavioral change | Remove a Hard Constraint; restructure Identity |

Major bumps require a staged rollout with explicit sign-off from the workspace owner.
