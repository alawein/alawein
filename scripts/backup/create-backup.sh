#!/bin/bash
#
# Creates a comprehensive backup of the repository with metadata manifest.
#
# Usage:
#   ./create-backup.sh "summary-description"
#   ./create-backup.sh "before-major-refactor" --upload
#
# Arguments:
#   $1 - Summary description (required)
#   $2 - --upload flag to upload to cloud (optional)

set -e

# Configuration
SUMMARY="${1:?Error: Summary description required. Usage: ./create-backup.sh 'summary'}"
UPLOAD_TO_CLOUD="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="$REPO_ROOT/.backups"
MAX_LOCAL_BACKUPS=10
TIMESTAMP=$(date +"%Y-%m-%d-%H%M")
SAFE_SUMMARY=$(echo "$SUMMARY" | sed 's/[^a-zA-Z0-9-]/-/g')
BACKUP_NAME="backup-$TIMESTAMP-$SAFE_SUMMARY"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo -e "\033[36mCreating backup: $BACKUP_NAME\033[0m"
echo -e "\033[90mRepository root: $REPO_ROOT\033[0m"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Get git information
cd "$REPO_ROOT"
CURRENT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
FILE_COUNT=$(git ls-files | wc -l)

# Get previous backup info
PREVIOUS_BACKUP=$(ls -1t "$BACKUP_DIR"/*.zip 2>/dev/null | head -1)
PREVIOUS_COMMIT="N/A (first backup)"
if [ -n "$PREVIOUS_BACKUP" ]; then
    # Try to extract manifest from previous backup
    PREV_MANIFEST=$(unzip -p "$PREVIOUS_BACKUP" "BACKUP-MANIFEST.md" 2>/dev/null || echo "")
    if [ -n "$PREV_MANIFEST" ]; then
        PREVIOUS_COMMIT=$(echo "$PREV_MANIFEST" | grep -oP 'Current Commit.*\[([a-f0-9]+)\]' | grep -oP '[a-f0-9]{8}' | head -1)
        [ -z "$PREVIOUS_COMMIT" ] && PREVIOUS_COMMIT="N/A"
    fi
fi

# Get diff stats
GIT_DIFF_STATS="N/A"
if [ "$PREVIOUS_COMMIT" != "N/A (first backup)" ] && [ "$PREVIOUS_COMMIT" != "N/A" ]; then
    GIT_DIFF_STATS=$(git diff --stat "$PREVIOUS_COMMIT" HEAD 2>/dev/null | tail -1 || echo "N/A")
fi

# Create backup directory
mkdir -p "$BACKUP_PATH"

# Create BACKUP-MANIFEST.md
cat > "$BACKUP_PATH/BACKUP-MANIFEST.md" << EOF
# Backup Manifest

## Backup Information

| Property | Value |
|----------|-------|
| **Backup Name** | $BACKUP_NAME |
| **Backup Date** | $(date -u +"%Y-%m-%dT%H:%M:%SZ") |
| **Summary** | $SUMMARY |
| **Branch** | $CURRENT_BRANCH |
| **Current Commit** | [${CURRENT_COMMIT:0:8}](https://github.com/alawein/alawein/commit/$CURRENT_COMMIT) |
| **Previous Commit** | $PREVIOUS_COMMIT |
| **Total Files** | $FILE_COUNT |
| **Created By** | create-backup.sh |

## Previous State Summary

- **Commit Range**: $PREVIOUS_COMMIT → ${CURRENT_COMMIT:0:8}
- **Files Changed**: $GIT_DIFF_STATS

## Restoration Instructions

### Extract Backup
\`\`\`bash
unzip "$BACKUP_NAME.zip" -d "./restore-$BACKUP_NAME"
\`\`\`

### Restore (if needed)
\`\`\`bash
git checkout $CURRENT_COMMIT
\`\`\`

## Key Metrics

- **Commit Count**: $COMMIT_COUNT commits total
- **File Count**: $FILE_COUNT tracked files
EOF

echo -e "\033[32mCreated manifest: BACKUP-MANIFEST.md\033[0m"

# Create archive
echo -e "\033[36mCreating archive...\033[0m"
ARCHIVE_PATH="$BACKUP_PATH.zip"
git archive --format=zip -o "$ARCHIVE_PATH" HEAD
zip -j "$ARCHIVE_PATH" "$BACKUP_PATH/BACKUP-MANIFEST.md" >/dev/null

# Calculate archive size
ARCHIVE_SIZE=$(du -h "$ARCHIVE_PATH" | cut -f1)
echo -e "\033[32mCreated archive: $BACKUP_NAME.zip ($ARCHIVE_SIZE)\033[0m"

# Cleanup temporary directory
rm -rf "$BACKUP_PATH"

# Cleanup old backups
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/*.zip 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt "$MAX_LOCAL_BACKUPS" ]; then
    echo -e "\033[33mCleaning up old backups...\033[0m"
    ls -1t "$BACKUP_DIR"/*.zip | tail -n +$((MAX_LOCAL_BACKUPS + 1)) | xargs rm -f
fi

# Summary
echo -e "\n\033[32m=== Backup Complete ===\033[0m"
echo "Location: $ARCHIVE_PATH"
echo "Size: $ARCHIVE_SIZE"
echo "Commit: ${CURRENT_COMMIT:0:8}"

if [ "$UPLOAD_TO_CLOUD" = "--upload" ]; then
    echo -e "\n\033[33mCloud upload requested but not configured.\033[0m"
    echo "Configure aws/az/gcloud CLI for cloud backups."
fi

