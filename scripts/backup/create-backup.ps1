<#
.SYNOPSIS
    Creates a comprehensive backup of the repository with metadata manifest.

.DESCRIPTION
    This script creates a timestamped backup archive with:
    - Full repository content (excluding .git, node_modules, .backups)
    - BACKUP-MANIFEST.md with metadata, changes, and restoration instructions
    - Automatic cleanup of old backups (keeps last 10)

.PARAMETER Summary
    Brief description of what this backup contains

.PARAMETER UploadToCloud
    If specified, attempts to upload to configured cloud storage

.EXAMPLE
    .\create-backup.ps1 -Summary "50-phase-completion"
    .\create-backup.ps1 -Summary "before-major-refactor" -UploadToCloud
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Summary,

    [switch]$UploadToCloud
)

$ErrorActionPreference = "Stop"

# Configuration
$RepoRoot = (Get-Item $PSScriptRoot).Parent.Parent.FullName
$BackupDir = Join-Path $RepoRoot ".backups"
$MaxLocalBackups = 10
$Timestamp = Get-Date -Format "yyyy-MM-dd-HHmm"
$SafeSummary = $Summary -replace '[^a-zA-Z0-9-]', '-'
$BackupName = "backup-$Timestamp-$SafeSummary"
$BackupPath = Join-Path $BackupDir $BackupName

Write-Host "Creating backup: $BackupName" -ForegroundColor Cyan
Write-Host "Repository root: $RepoRoot" -ForegroundColor Gray

# Ensure backup directory exists and is in .gitignore
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
    Write-Host "Created backup directory: $BackupDir" -ForegroundColor Green
}

# Check .gitignore
$GitIgnorePath = Join-Path $RepoRoot ".gitignore"
if (Test-Path $GitIgnorePath) {
    $gitignoreContent = Get-Content $GitIgnorePath -Raw
    if ($gitignoreContent -notmatch "\.backups") {
        Add-Content $GitIgnorePath "`n# Backup files`n.backups/"
        Write-Host "Added .backups/ to .gitignore" -ForegroundColor Yellow
    }
}

# Get git information
Set-Location $RepoRoot
$CurrentCommit = git rev-parse HEAD 2>$null
$CurrentBranch = git branch --show-current 2>$null
$CommitCount = git rev-list --count HEAD 2>$null

# Get previous backup info for comparison
$PreviousBackup = Get-ChildItem $BackupDir -Directory -ErrorAction SilentlyContinue |
Sort-Object LastWriteTime -Descending |
Select-Object -First 1

$PreviousCommit = if ($PreviousBackup) {
    $manifestPath = Join-Path $PreviousBackup.FullName "BACKUP-MANIFEST.md"
    if (Test-Path $manifestPath) {
        $manifest = Get-Content $manifestPath -Raw
        if ($manifest -match "Current Commit.*`[([a-f0-9]+)\]") { $Matches[1] }
    }
}
else { "N/A (first backup)" }

# Get file change statistics
$GitDiffStats = if ($PreviousCommit -and $PreviousCommit -ne "N/A (first backup)") {
    git diff --stat $PreviousCommit HEAD 2>$null | Select-Object -Last 1
}
else { "N/A (first backup)" }

# Count files and lines
$FileCount = (git ls-files | Measure-Object).Count

# Create backup directory
New-Item -ItemType Directory -Path $BackupPath | Out-Null

# Create BACKUP-MANIFEST.md
$ManifestContent = @"
# Backup Manifest

## Backup Information

| Property | Value |
|----------|-------|
| **Backup Name** | $BackupName |
| **Backup Date** | $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ") |
| **Summary** | $Summary |
| **Branch** | $CurrentBranch |
| **Current Commit** | [$($CurrentCommit.Substring(0,8))](https://github.com/alawein/alawein/commit/$CurrentCommit) |
| **Previous Commit** | $PreviousCommit |
| **Total Files** | $FileCount |
| **Created By** | create-backup.ps1 |

## Previous State Summary

The repository state before changes captured in this backup.

- **Commit Range**: $PreviousCommit → $($CurrentCommit.Substring(0,8))
- **Files Changed**: $GitDiffStats

## Current State Summary

This backup captures the repository at commit ``$($CurrentCommit.Substring(0,8))`` on branch ``$CurrentBranch``.

### Platform Status

| Platform | Location | Status |
|----------|----------|--------|
| SimCore | platforms/simcore | Active |
| QMLab | platforms/qmlab | Active |
| LLMWorks | platforms/llmworks | Active |
| Attributa | platforms/attributa | Active |
| LiveItIconic | platforms/liveiticonic | Active |
| REPZ | platforms/repz | Active |
| Portfolio | platforms/portfolio | Active |

## Changes Made

To see detailed changes since last backup:
``````bash
git diff $PreviousCommit $CurrentCommit --stat
``````

## Restoration Instructions

### Step 1: Extract Backup

``````powershell
# Extract the backup archive
Expand-Archive -Path "$BackupName.zip" -DestinationPath "./restore-$BackupName"
``````

### Step 2: Review Changes

``````bash
# Compare with current state
diff -rq "./restore-$BackupName" "./" --exclude=.git --exclude=node_modules
``````

### Step 3: Restore (if needed)

``````bash
# Option A: Full restore (destructive)
git checkout $CurrentCommit

# Option B: Selective restore
cp -r "./restore-$BackupName/path/to/file" "./path/to/file"
``````

## Key Metrics

- **Commit Count**: $CommitCount commits total
- **File Count**: $FileCount tracked files
- **Backup Size**: Calculated after compression

## Backup Contents

This backup includes all tracked files except:
- ``.git/`` directory
- ``node_modules/`` directories
- ``.backups/`` directory
- Build artifacts (``dist/``, ``build/``)
"@

$ManifestPath = Join-Path $BackupPath "BACKUP-MANIFEST.md"
Set-Content -Path $ManifestPath -Value $ManifestContent
Write-Host "Created manifest: BACKUP-MANIFEST.md" -ForegroundColor Green

# Create archive (excluding large/generated directories)
Write-Host "Creating archive..." -ForegroundColor Cyan
$ArchivePath = "$BackupPath.zip"

# Use git archive for clean export
git archive --format=zip -o $ArchivePath HEAD
Write-Host "Created archive: $BackupName.zip" -ForegroundColor Green

# Add manifest to archive
Compress-Archive -Path $ManifestPath -Update -DestinationPath $ArchivePath

# Calculate archive size
$ArchiveSize = (Get-Item $ArchivePath).Length / 1MB
Write-Host "Archive size: $([math]::Round($ArchiveSize, 2)) MB" -ForegroundColor Cyan

# Cleanup temporary directory (keep only zip)
Remove-Item -Recurse -Force $BackupPath

# Cleanup old backups (keep last N)
$AllBackups = Get-ChildItem $BackupDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending
if ($AllBackups.Count -gt $MaxLocalBackups) {
    $ToDelete = $AllBackups | Select-Object -Skip $MaxLocalBackups
    foreach ($old in $ToDelete) {
        Write-Host "Removing old backup: $($old.Name)" -ForegroundColor Yellow
        Remove-Item $old.FullName -Force
    }
}

# Summary
Write-Host "`n=== Backup Complete ===" -ForegroundColor Green
Write-Host "Location: $ArchivePath" -ForegroundColor White
Write-Host "Size: $([math]::Round($ArchiveSize, 2)) MB" -ForegroundColor White
Write-Host "Commit: $($CurrentCommit.Substring(0,8))" -ForegroundColor White

if ($UploadToCloud) {
    Write-Host "`nCloud upload requested but not configured." -ForegroundColor Yellow
    Write-Host "Configure AWS CLI, Azure CLI, or gcloud for cloud backups." -ForegroundColor Yellow
}

