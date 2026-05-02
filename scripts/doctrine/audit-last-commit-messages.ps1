# Lists each top-level git repo under the workspace root whose latest commit subject matches a pattern.
# Use after bulk "chore: sync" runs to find repos that still need scoped follow-up commits.
param(
    [string]$WorkspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path,
    [string]$Pattern = "chore: sync workspace changes"
)

Get-ChildItem -Path $WorkspaceRoot -Directory | ForEach-Object {
    $gitDir = Join-Path $_.FullName ".git"
    if (-not (Test-Path $gitDir)) { return }
    Push-Location $_.FullName
    try {
        $subj = git log -1 --format=%s 2>$null
        if ($subj -eq $Pattern) {
            [PSCustomObject]@{ Repo = $_.Name; LastSubject = $subj }
        }
    } finally {
        Pop-Location
    }
} | Format-Table -AutoSize
