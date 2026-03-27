---type: canonical
source: none
sync: none
sla: none

description: "Search Gmail for interview emails and sync to Notion Engagements"
allowed-tools: ["mcp__claude_ai_Gmail__gmail_search_messages", "mcp__claude_ai_Gmail__gmail_read_message", "Read", "Write", "Bash"]
---

# Track Job Applications

Search Gmail for interview-related emails and create/update entries in the Notion Engagements database.

## Steps

1. Search Gmail for recent interview-related emails using these queries (last 14 days):
   - `newer_than:14d subject:(interview OR "phone screen" OR "technical screen")`
   - `newer_than:14d subject:(offer OR "next steps" OR "moving forward")`
   - `newer_than:14d subject:("coding challenge" OR "take-home" OR assessment)`
   - `newer_than:14d subject:(unfortunately OR "not moving forward" OR rejection)`

2. For each relevant email found, extract:
   - **Company**: from sender domain or email body
   - **Type**: Phone Screen, Technical, Onsite, Offer, Rejection
   - **Date**: email date
   - **Contact**: sender name
   - **Notes**: brief summary of the email content
   - **Link**: any scheduling links or URLs

3. Deduplicate by company name + date (same company, same day = same engagement).

4. Infer status from keywords:
   - "interview", "schedule", "screen" → In Progress
   - "offer", "congratulations" → Offer
   - "unfortunately", "not moving forward", "rejection" → Declined

5. Write the extracted records to a temp JSON file at `/tmp/job-tracker-input.json` with this schema:
   ```json
   [{"name": "Company - Type", "company": "Acme", "type": "Technical", "date": "2026-03-25", "contact": "Jane", "notes": "...", "link": "...", "status": "In Progress"}]
   ```

6. Show the user a summary table of what was found and ask for confirmation.

7. After confirmation, sync to Notion:
   ```bash
   node scripts/job-tracker.mjs --from-file /tmp/job-tracker-input.json
   ```

## Notes
- Requires `NOTION_TOKEN` and `NOTION_ENGAGEMENTS_DB_ID` environment variables.
- Engagements DB ID: `75587f31-15ce-4438-bc75-5b0fee657f27`
- The script deduplicates against existing Notion entries by company name.
