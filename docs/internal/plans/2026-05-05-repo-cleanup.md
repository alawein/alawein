---
type: canonical
source: writing-plans session 2026-05-05
sla: on-change
last_updated: 2026-05-05
audience: [ai-agents, contributors]
---

# Repo Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove stale directories, archive dead governance docs, fix .gitignore gaps, and update CI exemptions in one clean PR.

**Architecture:** Pure file system and git operations — no code changes. Each task is atomic and independently committable. Validation runs last before PR.

**Tech Stack:** git, bash, Python (validation scripts only)

**Spec:** `docs/internal/specs/2026-05-05-repo-cleanup-design.md`

---

## File Map

| Action | Path |
|--------|------|
| `git rm -r` | `docs/superpowers/` (25 tracked files) |
| `git rm -r` | `scripts/notion-pkos-migrate/package-lock.json` |
| `git rm` | `docs/audits/README.md` |
| `git rm` | `docs/audits/release-summary-2026-03-21.md` |
| `git mv` → archive | `docs/governance/dashboard-governance.md` |
| `git mv` → archive | `docs/governance/cursor-agent-handoff-profile-sync.md` |
| `git mv` → archive | `docs/governance/desktop-repo-inventory.md` |
| `git mv` → archive | `docs/governance/desktop-repo-inventory.json` |
| local delete only | `docs/dashboard/` (gitignored, not tracked) |
| modify | `.gitignore` |
| modify | `SSOT.md` |
| modify | `.github/workflows/docs-validation.yml` |
| modify | `.github/workflows/doctrine-reusable.yml` |
| create | `docs/governance/README.md` |
| create | `docs/internal/plans/2026-05-05-repo-cleanup.md` (this file) |

---

## Task 1: Archive stale governance docs

These four files are dead: the dashboard they governed was deleted (PR #103), the PKOS handoff is complete, and the desktop inventory is a 2026-03-30 snapshot.

**Files:**
- Modify (move): `docs/governance/dashboard-governance.md` → `docs/archive/dashboard-governance.md`
- Modify (move): `docs/governance/cursor-agent-handoff-profile-sync.md` → `docs/archive/cursor-agent-handoff-profile-sync.md`
- Modify (move): `docs/governance/desktop-repo-inventory.md` → `docs/archive/desktop-repo-inventory.md`
- Modify (move): `docs/governance/desktop-repo-inventory.json` → `docs/archive/desktop-repo-inventory.json`

- [ ] **Step 1: Move the four files to archive**

```bash
git -C . mv docs/governance/dashboard-governance.md docs/archive/dashboard-governance.md
git -C . mv docs/governance/cursor-agent-handoff-profile-sync.md docs/archive/cursor-agent-handoff-profile-sync.md
git -C . mv docs/governance/desktop-repo-inventory.md docs/archive/desktop-repo-inventory.md
git -C . mv docs/governance/desktop-repo-inventory.json docs/archive/desktop-repo-inventory.json
```

- [ ] **Step 2: Verify staging**

```bash
git -C . status --short
```

Expected: four `R` (renamed) lines, no unexpected changes.

- [ ] **Step 3: Commit**

```bash
git -C . commit -m "chore(docs): archive stale governance docs — dashboard, handoff, desktop-inventory"
```

---

## Task 2: Archive and delete docs/audits/

The `docs/audits/` directory has two files: a README and a single release summary from 2026-03-21. Archive the summary; the README has no value outside this dir.

**Files:**
- Modify (move): `docs/audits/release-summary-2026-03-21.md` → `docs/archive/release-summary-2026-03-21.md`
- Delete: `docs/audits/README.md`

- [ ] **Step 1: Move the release summary, remove the README**

```bash
git -C . mv docs/audits/release-summary-2026-03-21.md docs/archive/release-summary-2026-03-21.md
git -C . rm docs/audits/README.md
```

- [ ] **Step 2: Verify the dir is gone from tracking**

```bash
git -C . ls-files docs/audits/
```

Expected: no output (empty — the directory is now untracked).

- [ ] **Step 3: Commit**

```bash
git -C . commit -m "chore(docs): archive release summary, delete docs/audits/ dir"
```

---

## Task 3: Delete docs/superpowers/ from git

25 tracked files: 14 raw corpus inputs in hidden dot-dirs (`.phase0-data/`, `.spec-a-data/`) and 11 completed implementation plans. All done; the spec directory was already migrated to `docs/internal/specs/` in PR #102.

**Files:**
- Delete: `docs/superpowers/` (all 25 tracked files)

- [ ] **Step 1: Remove all tracked files under docs/superpowers/**

```bash
git -C . rm -r docs/superpowers/
```

- [ ] **Step 2: Verify nothing remains tracked**

```bash
git -C . ls-files docs/superpowers/
```

Expected: no output.

- [ ] **Step 3: Also remove the directory from disk if anything is left untracked**

```bash
rm -rf docs/superpowers/
```

- [ ] **Step 4: Commit**

```bash
git -C . commit -m "chore(docs): delete docs/superpowers/ — plans complete, raw corpus data removed from VCS"
```

---

## Task 4: Delete scripts/notion-pkos-migrate/

Contains only a `package-lock.json` with no source files. Abandoned migration scaffold.

**Files:**
- Delete: `scripts/notion-pkos-migrate/package-lock.json`

- [ ] **Step 1: Remove the tracked file**

```bash
git -C . rm scripts/notion-pkos-migrate/package-lock.json
```

- [ ] **Step 2: Remove the empty directory from disk**

```bash
rm -rf scripts/notion-pkos-migrate/
```

- [ ] **Step 3: Verify**

```bash
git -C . ls-files scripts/notion-pkos-migrate/
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git -C . commit -m "chore(scripts): delete abandoned notion-pkos-migrate scaffold"
```

---

## Task 5: Local cleanup + update .gitignore

`docs/dashboard/` exists locally but its contents are gitignored (snapshot JSONs). The directory itself is not tracked. `HANDOFF.md` at the repo root is an untracked session artifact — gitignore it so it stops showing as `??`.

**Files:**
- Modify: `.gitignore`
- Local delete: `docs/dashboard/` (not tracked, gitignored contents)

- [ ] **Step 1: Delete the local docs/dashboard/ directory**

```bash
rm -rf docs/dashboard/
```

- [ ] **Step 2: Add HANDOFF.md and docs/dashboard/ to .gitignore**

Open `.gitignore`. Find the `# Temporary Files` section. Add the following lines immediately after the existing entries in that section:

```
# Session artifacts
HANDOFF.md
docs/dashboard/
```

- [ ] **Step 3: Verify .gitignore catches both**

```bash
git -C . check-ignore -v HANDOFF.md docs/dashboard/
```

Expected: both paths matched by `.gitignore`.

- [ ] **Step 4: Commit**

```bash
git -C . add .gitignore
git -C . commit -m "chore(git): gitignore HANDOFF.md and docs/dashboard/"
```

---

## Task 6: Update CI workflow exemptions

Two workflows hard-code `docs/superpowers/` in grep exemption patterns. Now that directory is gone; the dead pattern is harmless but misleading — remove it to keep the CI patterns accurate.

**Files:**
- Modify: `.github/workflows/docs-validation.yml` (lines ~118, ~152)
- Modify: `.github/workflows/doctrine-reusable.yml` (line ~75)

- [ ] **Step 1: Open docs-validation.yml and remove docs/superpowers/ from both grep patterns**

Find the two lines that contain:

```
| grep -vE '^(docs/archive/|docs/internal/|docs/superpowers/|docs/governance/design-branding-summary\.md|docs/governance/branding-workflow-and-standards\.md)'
```

Change each to:

```
| grep -vE '^(docs/archive/|docs/internal/|docs/governance/design-branding-summary\.md|docs/governance/branding-workflow-and-standards\.md)'
```

- [ ] **Step 2: Open doctrine-reusable.yml and remove the docs/superpowers/ exemption**

Find the line:

```
mapfile -t files < <(git -C repo ls-files '*.md' | grep -Ev '^docs/archive/|^docs/superpowers/' || true)
```

Change it to:

```
mapfile -t files < <(git -C repo ls-files '*.md' | grep -Ev '^docs/archive/' || true)
```

- [ ] **Step 3: Verify the YAML is still valid (no syntax errors introduced)**

```bash
python -c "import yaml; yaml.safe_load(open('.github/workflows/docs-validation.yml'))" && echo OK
python -c "import yaml; yaml.safe_load(open('.github/workflows/doctrine-reusable.yml'))" && echo OK
```

Expected: `OK` for both.

- [ ] **Step 4: Commit**

```bash
git -C . add .github/workflows/docs-validation.yml .github/workflows/doctrine-reusable.yml
git -C . commit -m "chore(ci): remove stale docs/superpowers/ exemptions from workflow greps"
```

---

## Task 7: Update SSOT.md — document claude-agent-platform/

`SSOT.md` lists all canonical sources but does not mention `claude-agent-platform/`, which is the version-controlled source for the global `~/.claude/` platform.

**Files:**
- Modify: `SSOT.md`

- [ ] **Step 1: Read the current SSOT.md to find the Current State section**

Open `SSOT.md` and locate the `## Current State` bullet list.

- [ ] **Step 2: Add one bullet for claude-agent-platform/**

Add this line to the `## Current State` list (after the last bullet, before any closing section):

```markdown
- Global `~/.claude/` platform source (agent config, skills, workflows):
  [`claude-agent-platform/`](claude-agent-platform/) — sync with
  `bash claude-agent-platform/sync-to-home.sh` (push) or
  `bash claude-agent-platform/sync-from-home.sh` (pull)
```

- [ ] **Step 3: Commit**

```bash
git -C . add SSOT.md
git -C . commit -m "docs(ssot): document claude-agent-platform/ as global platform source"
```

---

## Task 8: Create docs/governance/README.md

The governance directory has 30+ files with no index. Add a status table so contributors and agents can orient quickly.

**Files:**
- Create: `docs/governance/README.md`

- [ ] **Step 1: Create docs/governance/README.md with the following content**

```markdown
---
type: canonical
source: none
sla: on-change
audience: [ai-agents, contributors]
---

# Governance Docs Index

Status key: **Active** — maintained and enforced | **Reference** — stable, rarely changes | **Frozen** — historical, do not edit

| File | Status | Description |
|------|--------|-------------|
| `branch-and-deployment-convention.md` | Active | Branch naming and deployment rules |
| `branding-workflow-and-standards.md` | Active | Brand production workflow |
| `changelog-entry.md` | Reference | Changelog format rules |
| `claude-code-configuration-guide.md` | Active | Claude Code setup guide |
| `claude-code-migration-prompts.md` | Reference | Migration prompt templates |
| `claude-code-worked-examples.md` | Reference | Claude Code usage examples |
| `clean-slate-workflow.md` | Reference | Session reset procedure |
| `credential-hygiene.md` | Active | Secret and token management |
| `design-branding-summary.md` | Reference | Brand design summary |
| `docs-doctrine.md` | Active | Documentation standards and enforcement |
| `documentation-contract.md` | Active | Cross-repo documentation contract |
| `documentation-philosophy.md` | Reference | Principles behind docs-doctrine |
| `feature-lifecycle.md` | Active | Feature development lifecycle |
| `git-operations.md` | Reference | Git operation runbook |
| `github-baseline.md` | Active | GitHub repo baseline contract |
| `github-metadata-rollout-policy.md` | Active | GitHub metadata sync policy |
| `github-metadata-sync-runbook.md` | Active | Metadata sync runbook |
| `maintenance-skills-agents.md` | Reference | Skills and agents maintenance guide |
| `merge-policy.md` | Active | Merge rules and approval requirements |
| `operating-model.md` | Active | Workspace operating model |
| `operator-command-cheatsheet.md` | Reference | Common operator commands |
| `package-namespace-matrix.md` | Reference | `@alawein/*` package naming |
| `parallel-batch-execution.md` | Active | Multi-repo batch execution contract |
| `profile-sync-from-guides.md` | Reference | Profile sync runbook |
| `prompt-rollout.md` | Reference | Prompt kit rollout process |
| `release-playbook.md` | Active | Release process |
| `repo-standardization.md` | Active | Per-repo standardization checklist |
| `repo-sweep-prompt.md` | Reference | Repo sweep operator prompt |
| `repository-layout-standard.md` | Active | Directory layout standard |
| `review-playbook.md` | Active | Code review process |
| `skills-agents-unification.md` | Reference | Skills/agents unification notes |
| `skills-install-policy.md` | Active | Skill installation and naming policy |
| `slash-commands-catalog.md` | Reference | Available slash commands |
| `tooling-quality-gates.md` | Active | CI quality gate definitions |
| `workflow.md` | Active | Primary development workflow |
| `workspace-layout-audit.md` | Reference | Workspace layout audit (2026-03) |
| `workspace-master-prompt.md` | Active | Workspace master operator prompt |
| `workspace-resource-map.md` | Reference | Resource map across workspace |
| `workspace-standardization.md` | Active | Workspace-wide standardization rules |
```

- [ ] **Step 2: Commit**

```bash
git -C . add docs/governance/README.md
git -C . commit -m "docs(governance): add README status index"
```

---

## Task 9: Validate and open PR

Run the full validation suite, confirm clean, then open the PR.

- [ ] **Step 1: Run the validation suite**

From the repo root:

```bash
python scripts/doctrine/validate.py --ci
```

Expected: exits 0, no FAIL lines.

```bash
bash ./scripts/doctrine/validate-doc-contract.sh --full
```

Expected: exits 0, reports PASS.

```bash
python scripts/doctrine/validate-doctrine.py .
```

Expected: exits 0, no FAIL lines.

- [ ] **Step 2: Check git status is clean**

```bash
git -C . status --short
```

Expected: only the untracked `docs/internal/plans/2026-05-05-repo-cleanup.md` and `docs/internal/specs/2026-05-05-repo-cleanup-design.md` if not yet committed, plus any local-only artifacts. No unexpected staged or modified files.

- [ ] **Step 3: Commit the plan and spec files if not yet committed**

```bash
git -C . add docs/internal/plans/2026-05-05-repo-cleanup.md docs/internal/specs/2026-05-05-repo-cleanup-design.md
git -C . commit -m "docs(internal): add repo cleanup spec and plan"
```

- [ ] **Step 4: Push and open PR**

```bash
git -C . push origin main
```

Or, if working on a branch:

```bash
git -C . push -u origin chore/repo-cleanup-2026-05-05
gh pr create \
  --title "chore(docs): repo cleanup — delete stale dirs, archive governance, update CI exemptions" \
  --body "$(cat <<'EOF'
## Summary

- Delete `docs/superpowers/` (25 files — completed plans + raw corpus data)
- Delete `scripts/notion-pkos-migrate/` (abandoned scaffold, only had package-lock.json)
- Archive 4 stale governance docs to `docs/archive/`
- Archive `docs/audits/release-summary-2026-03-21.md`, delete `docs/audits/` dir
- Update `.gitignore`: add `HANDOFF.md` and `docs/dashboard/`
- Remove stale `docs/superpowers/` exemptions from 2 CI workflows
- Document `claude-agent-platform/` in `SSOT.md`
- Add `docs/governance/README.md` status index

Spec: `docs/internal/specs/2026-05-05-repo-cleanup-design.md`

## Test plan

- [ ] `python scripts/doctrine/validate.py --ci` passes
- [ ] `bash ./scripts/doctrine/validate-doc-contract.sh --full` passes
- [ ] `python scripts/doctrine/validate-doctrine.py .` passes
- [ ] CI green on all workflow checks
EOF
)" \
  --base main
```

---

## Validation Reference

All three commands must pass before the PR is opened:

```bash
python scripts/doctrine/validate.py --ci
bash ./scripts/doctrine/validate-doc-contract.sh --full
python scripts/doctrine/validate-doctrine.py .
```

If any validator fails with a path referencing a deleted file, check whether the validator hard-codes the path. If so, open a follow-up issue rather than reverting the deletion.
