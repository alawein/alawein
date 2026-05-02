param(
    [string]$Repository = "alawein/alawein",
    [string]$SecretName = "DASHBOARD_GITHUB_TOKEN",
    [string]$EnvironmentVariable = "DASHBOARD_GITHUB_TOKEN",
    [string]$Token,
    [switch]$SetRepoSecret = $true,
    [switch]$SetUserEnvironment
)

$ErrorActionPreference = "Stop"

function Read-Token {
    $secure = Read-Host -AsSecureString "Paste GitHub token"
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        return [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

$token = $Token
if ([string]::IsNullOrWhiteSpace($token)) {
    $token = Read-Token
}
if ([string]::IsNullOrWhiteSpace($token)) {
    throw "Token is required."
}

if ($SetRepoSecret) {
    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $gh) {
        throw "GitHub CLI ('gh') is required to set repository secrets."
    }

    $null = gh auth status
    if ($LASTEXITCODE -ne 0) {
        throw "GitHub CLI is not authenticated. Run: gh auth login"
    }

    if ($SecretName -like "GITHUB_*") {
        throw "Secret names starting with GITHUB_ are reserved by GitHub Actions. Use a different name, e.g. DASHBOARD_GITHUB_TOKEN."
    }

    $token | gh secret set $SecretName --repo $Repository
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to set $SecretName in $Repository."
    }
}

Set-Item -Path "Env:$EnvironmentVariable" -Value $token
$env:GITHUB_DASHBOARD_TOKEN = $token

if ($SetUserEnvironment) {
    [Environment]::SetEnvironmentVariable($EnvironmentVariable, $token, "User")
}

Write-Host "Token configured."
Write-Host "Repository secret: $($SetRepoSecret.IsPresent) ($SecretName)"
Write-Host "Session env var: true ($EnvironmentVariable)"
Write-Host "Compatibility env var (session only): true (GITHUB_DASHBOARD_TOKEN)"
Write-Host "User env var: $($SetUserEnvironment.IsPresent) ($EnvironmentVariable)"
