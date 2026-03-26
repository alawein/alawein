---
description: "Bidirectional sync between PKOS knowledge base and Notion"
allowed-tools: ["Read", "Write", "Bash", "Glob", "Grep"]
---

# Notion Knowledge Base Sync

Sync records between the local PKOS knowledge base (`_pkos/db/`) and the Notion Knowledge Base database.

## Steps

1. Ensure `NOTION_TOKEN` is set in the environment (loaded from `.env.local` or set via `gh secret`).

2. Run the sync script in diff mode to see what's changed:

```bash
node scripts/notion-kb-sync.mjs --diff
```

3. Review the report. It shows:
   - **Matched** — records that exist in both systems
   - **Local only** — PKOS records not yet in Notion
   - **Notion only** — Notion records not on the local filesystem

4. Based on the report, choose an action:
   - `--push` — Create Notion pages for all local-only records
   - `--pull` — Create local .md files for all Notion-only records
   - `--diff` — Report only (default, safe)

5. After sync, show the updated sync state:
```bash
cat _pkos/db/.sync-state.json | head -20
```

## Notes
- The `NOTION_TOKEN` environment variable must be set before running.
- Sync state is tracked in `_pkos/db/.sync-state.json`.
- Local records are matched to Notion by name (case-insensitive).
- Pulled records go to `_pkos/db/from-notion/` to avoid overwriting existing files.
