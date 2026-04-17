---
type: canonical
source: none
sync: none
sla: none
title: Profile sync from guides
description: README About and profile copy sync with knowledge-base; export and sync flow.
last_updated: 2026-04-15
category: governance
audience: [ai-agents, contributors]
status: active
---

# Profile sync from guides

**Purpose:** Document how the profile README and canonical profile copy stay in sync with `knowledge-base`, which is the single source of truth for positioning, resume, and profile copy.

**For Cursor agents:** For revision and enhancements (phases, runbook, checklist), read and follow [cursor-agent-handoff-profile-sync.md](cursor-agent-handoff-profile-sync.md).

## Source of truth (`knowledge-base`)

- **Profile record:** `db/profile/meshal-alawein.md` (YAML frontmatter).
- **Copy (tagline, bios, headline):** `career/profile-copy.yaml`.
- **Export schema:** `db/schema/export/profile-export.schema.yaml`.
- **Export:** `scripts/export-profile.py` produces `out/profile-export.yaml` and can write `profile-from-guides.yaml` into this repo.

## Flow

1. **In `knowledge-base`:** Edit `db/profile/meshal-alawein.md` and/or `career/profile-copy.yaml`, then run:
   ```bash
   cd /path/to/knowledge-base
   python scripts/export-profile.py --write-alawein
   ```
   This writes `profile-from-guides.yaml` into `alawein/alawein` (default: `../GitHub/github.com/alawein/alawein/`). Set `ALAWEIN_REPO_PATH` to point at this repo if needed.

2. **In alawein:** When `profile-from-guides.yaml` is present, run:
   ```bash
   python scripts/sync-readme.py
   ```
   This regenerates the full `README.md` from `profile-from-guides.yaml` and `projects.json`.

## Files

| File | Role |
|------|------|
| `profile-from-guides.yaml` | Canonical profile export from `knowledge-base`; the filename is retained for compatibility with the existing README generator and workflow names. |
| `README.md` | Fully generated profile README; overwritten by `sync-readme.py`. |
| `scripts/sync-readme.py` | Reads `profile-from-guides.yaml` and `projects.json`, then rewrites the full README. |

## Quality gates

- `python scripts/sync-readme.py --check` verifies the generated README is in sync with both `projects.json` and `profile-from-guides.yaml`.
- **PyYAML:** `sync-readme.py` requires `pyyaml` because the generated README depends on `profile-from-guides.yaml`.
- The generated README is intentionally minimal. Detailed project descriptions remain in `projects.json`, not in the profile README itself.
- The `Sync README` GitHub Actions workflow is advisory only. Protected branch rules on `main` block bot-authored direct pushes, so the workflow uploads a drift patch artifact and expects the regenerated `README.md` to be committed through the normal review path.

## Knowledge-base location and naming

- **Canonical repo:** `knowledge-base`.
- **Current layout:** keep the profile record under `db/profile/`, public copy under `career/`, and export logic under `scripts/export-profile.py`.
- **Location:** keep `knowledge-base` as a sibling repo of `alawein` inside the shared workspace. If you move it elsewhere, set `ALAWEIN_REPO_PATH` so the export still writes to `alawein/alawein/profile-from-guides.yaml`.

## See also

- **Cursor agent handoff:** [cursor-agent-handoff-profile-sync.md](cursor-agent-handoff-profile-sync.md) — summary, revision/enhancements plan, and syncing runbook.
- `knowledge-base`: [`career/README.md`](https://github.com/alawein/knowledge-base/blob/main/career/README.md), [`career/NOTION_PROFILE_SYNC.md`](https://github.com/alawein/knowledge-base/blob/main/career/NOTION_PROFILE_SYNC.md), `db/schema/export/profile-export.schema.yaml`.
