#Requires -Version 5.1
<#
  Local PKOS Notion rebuild migrator wrapper.

  Usage (from repo root alawein/alawein):
    pwsh -File scripts/run-notion-migration-local.ps1 --dry-run
    pwsh -File scripts/run-notion-migration-local.ps1 --apply --parent-page-id <id>
#>
$ErrorActionPreference = 'Stop'
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

$packageRoot = Join-Path $PSScriptRoot 'notion-pkos-migrate'

if (-not (Test-Path (Join-Path $packageRoot 'node_modules'))) {
  npm install --prefix $packageRoot
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

node (Join-Path $packageRoot 'src/cli.mjs') @args
exit $LASTEXITCODE
