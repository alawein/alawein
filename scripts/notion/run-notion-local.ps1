#Requires -Version 5.1
<#
  Local Notion sync + canonical verification.

  Prerequisites: inject NOTION_TOKEN and NOTION_DB_ID with 1Password op run.

  Usage (from repo root alawein/):
    op run -- pwsh -NoProfile -File scripts/notion/run-notion-local.ps1
#>
$ErrorActionPreference = 'Stop'
# scripts/notion/ -> repo root (alawein/) where projects.json lives
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $root

# Match the canonical Notion database schema.
$env:NOTION_DOMAIN_PROPERTY = 'Domain'
$env:NOTION_CATEGORY_PROPERTY = 'Category'
$env:NOTION_TAGS_PROPERTY = 'Tags'
$env:NOTION_NAME_PROPERTY = 'Name'
$env:NOTION_REPO_PROPERTY = 'Repo'
$env:NOTION_STATUS_PROPERTY = 'Category'
$env:NOTION_EXPECTED_LEGACY_COUNT = '1'

python scripts/catalog/validate-projects-json.py
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if (-not $env:NOTION_TOKEN -or -not $env:NOTION_DB_ID) {
  Write-Error 'projects.json OK. Inject NOTION_TOKEN and NOTION_DB_ID with op run, then re-run for Notion sync + verify.'
  exit 1
}

node scripts/notion/sync-to-notion.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node scripts/notion/verify-notion-canonical-state.mjs
exit $LASTEXITCODE
