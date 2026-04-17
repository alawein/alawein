---
type: canonical
source: none
sync: none
sla: none

description: "Show Notion database status and sync health"
allowed-tools: ["Bash", "Read"]
---

# Notion Status Check

Show the current state of all Notion databases and sync health.

## Steps

1. Run the database audit script to list all databases and their schemas:

```bash
node scripts/notion-db-audit.mjs
```

2. Check the last Notion sync CI run:

```bash
gh run list -R alawein/alawein -w notion-sync.yml -L 3
```

3. Check sync state if it exists:

```bash
cat ../knowledge-base/db/.sync-state.json 2>/dev/null || echo "No sync state file found"
```

4. Summarize:
   - How many databases exist and their schemas
   - Whether the last CI sync passed or failed
   - When the last local KB sync ran
   - Any databases that appear empty or misconfigured

## Notes
- Requires `NOTION_TOKEN` environment variable to be set.
- The audit script was saved during workspace setup (2026-03-25).
