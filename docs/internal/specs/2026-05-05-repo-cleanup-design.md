---
type: canonical
source: brainstorming session 2026-05-05
sla: on-change
last_updated: 2026-05-05
audience: [ai-agents, contributors]
---

# Repo Cleanup Design — alawein/alawein

**Date:** 2026-05-05  
**Status:** Approved  
**Scope:** Structural cleanup of the `alawein/alawein` control plane repo

---

## Problem

The repo has accumulated stale directories, abandoned migration artifacts, raw scratch data committed to git, and structural drift between where specs/plans landed vs where the tooling writes them. No single PR addressed all of these; the cleanup is now overdue.

---

## Changes

### DELETE — High priority

| Path | Reason |
|------|--------|
| `docs/superpowers/` (entire dir) | Plans completed; `.phase0-data/` and `.spec-a-data/` are raw corpus inputs in VCS, violating CLAUDE.md policy; PR #102 already moved specs out |
| `scripts/notion-pkos-migrate/` | Contains only `package-lock.json` — no source files, abandoned migration scaffold |
| `docs/dashboard/` (local only) | PR #103 removed it; still present locally; JSON snapshots are gitignored but dir is clutter; add `docs/dashboard/` to `.gitignore` |
| `docs/audits/release-summary-2026-03-21.md` | Single stale release summary; the `docs/audits/` dir can be removed entirely after this file moves to archive |

### ARCHIVE — Medium priority

| Path | Action |
|------|--------|
| `docs/governance/dashboard-governance.md` | Dashboard deleted in PR #103; move to `docs/archive/` |
| `docs/governance/cursor-agent-handoff-profile-sync.md` | One-time PKOS migration handoff, complete; move to `docs/archive/` |
| `docs/governance/desktop-repo-inventory.json` + `.md` | Static snapshots from 2026-03-30, already stale; move to `docs/archive/` |

### UPDATE — Medium priority

| Target | Change |
|--------|--------|
| `.gitignore` | Add `HANDOFF.md` and `docs/dashboard/` entries |
| `.claude/skills/voice-check/SKILL.md` (and any reference to `docs/superpowers/specs/`) | Update default spec write path to `docs/internal/specs/` |

### ADD — Low priority

| Target | Change |
|--------|--------|
| `docs/governance/README.md` | Status index for governance docs (active / archive / deleted) |
| `SSOT.md` | Add `claude-agent-platform/` as canonical source for global `~/.claude/` platform state |

### RENAME — Low priority (defer if risky)

| From | To | Reason |
|------|----|--------|
| `styles/` | `vale/` | Disambiguate from `docs/style/`; both look like style resources but serve different purposes (Vale linting rules vs prose docs) |

---

## Delivery

Single PR covering all high + medium changes. Low-priority items can be separate PRs or deferred.

**Validation before PR:**
- Run `python scripts/validate.py --ci` — must pass
- Run `bash ./scripts/validate-doc-contract.sh --full` — must pass
- Run `python scripts/validate-doctrine.py .` — must pass

**Commit convention:** `chore(docs): repo cleanup — delete stale dirs, archive governance, update paths (#106)`

---

## Non-goals

- Do not touch `catalog/`, `schemas/`, `templates/`, `claude-agent-platform/` — all intentional and well-documented
- Do not rewrite governance docs that are still active
- Do not rename `styles/` in this PR (low risk but changes Vale config path; schedule separately)
