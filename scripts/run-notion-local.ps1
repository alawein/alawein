#Requires -Version 5.1
<#
  Local Notion sync + canonical verify with the same property mapping as
  .github/workflows/notion-sync.yml

  Prerequisites: set NOTION_TOKEN and NOTION_DB_ID in .env.local (see ..\.env.example)

  Usage (from repo root alawein/alawein):
    pwsh -File scripts/run-notion-local.ps1
#>
$ErrorActionPreference = 'Stop'
# scripts/ -> repo root (alawein/) where projects.json lives
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

# Align with notion-sync.yml
$env:NOTION_DOMAIN_PROPERTY = 'Domain'
$env:NOTION_CATEGORY_PROPERTY = 'Status'
$env:NOTION_TAGS_PROPERTY = 'Stack'
$env:NOTION_NAME_PROPERTY = 'Project Name'
$env:NOTION_DESCRIPTION_PROPERTY = 'One-Liner'
$env:NOTION_REPO_PROPERTY = 'Repo'
$env:NOTION_STATUS_PROPERTY = 'Status'
$env:NOTION_EXPECTED_LEGACY_COUNT = '2'

node scripts/validate-projects-json.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if (-not $env:NOTION_TOKEN -or -not $env:NOTION_DB_ID) {
  Write-Error 'projects.json OK. Set NOTION_TOKEN and NOTION_DB_ID in .env.local (see .env.example), then re-run for Notion sync + verify.'
  exit 1
}

node scripts/sync-to-notion.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node scripts/verify-notion-canonical-state.mjs
exit $LASTEXITCODE
