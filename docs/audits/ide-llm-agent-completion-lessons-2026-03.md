---
title: IDE / LLM agent completion — issues, lessons, and PR-adjacent patterns
description: Narrative capture of workflow gaps when agents stop before ship, branch confusion, README/projects work, and ties to v2.1.0 PR themes
last_updated: 2026-03-23
category: audit
audience: [contributors, ai-agents, operators]
status: active
related:
  - ../../LESSONS.md
  - ../governance/git-operations.md
  - release-summary-2026-03-21.md
---

# IDE / LLM agent completion — issues and lessons (March 2026)

This doc records **process failures and fixes** observed in Cursor/IDE-assisted work on `alawein/alawein`, including threads that never reached merge, misleading branch state, and stranded local changes. It complements bullet entries in [`LESSONS.md`](../../LESSONS.md) and themes from **[v2.1.0 / release summary](release-summary-2026-03-21.md)** (stale-branch recovery, PR discipline, CI gates).

---

## 1. The “finished” gap (most common)

**Issue:** Assistants and fast IDE sessions often treat **“edits look correct”** as done. They skip:

1. `git status` (uncommitted work)
2. `git add` / `commit`
3. `push` (and, where policy applies, **PR + merge**)

**Effect:** Real changes sit only on disk. GitHub and teammates never see them. The human assumes work was “merged” because the conversation ended.

**Lesson:** Treat **ship** as part of the task. Explicit close-out:

```text
Commit → push → (PR if required) → merge → git status clean
```

**User prompt pattern:** *“Commit, push, open PR, merge when green, confirm working tree clean.”*

---

## 2. Stranded working tree (concrete example)

**Issue:** Multiple workflow files were updated (e.g. pinning `actions/checkout@v4` to full commit SHAs) but **never committed**. From Git’s point of view, that work did not exist on `main`.

**Lesson:** Any session that touches YAML, scripts, or docs should end with **`git status`**. If there are modifications, either commit them with intent or `git restore` them—don’t leave ambiguous dirt.

---

## 3. Branch confusion vs. Git reality

**Issue:** Several local branches (`chore/*`, `feat/*`, `codex/*`) felt like “active work that never merged.” Emotionally: *stacking / PRs never closed.*

**Reality check:**

- If **`git log main..<branch>`** is empty, that branch tip is already **reachable from `main`**—there is nothing extra to merge from that pointer.
- If **`git diff main <branch>`** shows **huge deletions**, the branch is often **behind** `main` (older snapshot). Merging it *into* `main` would **revert** current work—see LESSONS: *compare branch vs main before squash-merge*.

**Lesson:** Before assuming “unmerged work,” run:

```bash
git fetch origin --prune
git log main..your-branch --oneline
git diff --stat main your-branch
```

Remote branches marked **gone** often mean the PR merged and the remote branch was deleted—local names are just stale.

---

## 4. README / projects / resume alignment

**Issues encountered:**

- Showcase order and links should match **resume and live product URLs**, not default GitHub repo links.
- **`scripts/sync-readme.py`** overwrites `SYNC:*` README regions from **`projects.json`**; card URLs must prefer **`url`** in JSON when present.

**Lesson:** Edit **`projects.json`** (featured list + `url`), run `python scripts/sync-readme.py`, then commit both. Add narrative **outside** sync markers if needed.

---

## 5. Ties to earlier PR / release commentary (v2.1.0 era)

From **[release-summary-2026-03-21.md](release-summary-2026-03-21.md)** and related governance work:

| Theme | Link to agent/IDE work |
| --- | --- |
| Stale-branch merge attempts | Same as §3—verify diff direction before merge. |
| feat/fix branches + PRs to protected `main` | Agents should default to branch + PR, not silent direct push, unless operator explicitly overrides. |
| Two CI gates (doc contract + markdownlint) | “Done” includes what CI enforces, not only local eyeball. |
| sync-readme + doc contract | Regenerate README from manifest; run `--check` before claiming README is current. |

---

## 6. Checklist — agent or human before ending a session

- [ ] `git status` — no unexpected modified files (or commit/revert deliberately).
- [ ] If README projects table changed: `projects.json` + `sync-readme.py` + `--check`.
- [ ] If governance/docs changed: `scripts/validate-doc-contract.sh` (and markdownlint if editing managed markdown).
- [ ] Changes **committed** with a message that matches scope.
- [ ] **Pushed** to the right remote branch; **PR merged** if policy requires it.
- [ ] `git status` clean on the branch you care about.

---

## 7. Where else this lives

- **Bullets:** [`LESSONS.md`](../../LESSONS.md) (Patterns / Anti-Patterns / Pitfalls).
- **Git mechanics:** [`docs/governance/git-operations.md`](../governance/git-operations.md).
- **Merge decisions:** [`docs/governance/merge-policy.md`](../governance/merge-policy.md).

---

**End.**
