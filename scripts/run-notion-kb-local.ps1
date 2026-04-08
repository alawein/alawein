#Requires -Version 5.1
<#
  Local KB Projects Notion sync + stale-page archiver.

  Sibling to run-notion-local.ps1 (which handles the canonical Projects DB).
  This script syncs the KB Projects Notion database from the
  knowledge-base/db/projects/ markdown records and archives stale pages.

  Prerequisites: NOTION_TOKEN in .env.local (see .env.example)

  Usage (from alawein/ repo root, or any directory — script resolves paths):
    pwsh -File scripts/run-notion-kb-local.ps1            # diff only (safe)
    pwsh -File scripts/run-notion-kb-local.ps1 -Apply     # push + archive
    pwsh -File scripts/run-notion-kb-local.ps1 -DiffOnly  # skip archiver
#>
param(
  [switch]$Apply,
  [switch]$DiffOnly
)

$ErrorActionPreference = 'Stop'
# scripts/ -> repo root (alawein/)
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

foreach ($name in @('.env.local', '.env')) {
  $envFile = Join-Path $root $name
  if (-not (Test-Path $envFile)) { continue }
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
      $n = $matches[1].Trim()
      $v = $matches[2].Trim().Trim('"')
      if ($v.Length -gt 0) { Set-Item -Path "Env:$n" -Value $v }
    }
  }
  break
}

if (-not $env:NOTION_TOKEN) {
  Write-Error 'NOTION_TOKEN not set. Add it to .env.local (see .env.example).'
  exit 1
}

Write-Host "`n=== Step 1: KB Projects sync (diff) ===`n" -ForegroundColor Cyan
node scripts/notion-kb-sync.mjs --diff
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if ($DiffOnly) {
  Write-Host "`nDiffOnly specified — skipping push and archive." -ForegroundColor Yellow
  exit 0
}

if ($Apply) {
  Write-Host "`n=== Step 2: KB Projects sync (push) ===`n" -ForegroundColor Cyan
  node scripts/notion-kb-sync.mjs --push
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  Write-Host "`n=== Step 3: Stale Notion page archive (diff) ===`n" -ForegroundColor Cyan
  node scripts/notion-kb-archive-stale.mjs --diff
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  Write-Host "`n=== Step 4: Stale Notion page archive (apply) ===`n" -ForegroundColor Cyan
  node scripts/notion-kb-archive-stale.mjs --apply
  exit $LASTEXITCODE
} else {
  Write-Host "`n=== Step 2: Stale Notion page archive (diff only) ===`n" -ForegroundColor Cyan
  node scripts/notion-kb-archive-stale.mjs --diff
  Write-Host "`nDiff complete. Re-run with -Apply to push sync and archive stale pages." -ForegroundColor Yellow
  exit $LASTEXITCODE
}
