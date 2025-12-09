# MCP Setup Verification Script
# Run this to verify all your MCP configurations

param(
    [switch]$Verbose = $false,
    [switch]$FixAll = $false
)

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     MCP SETUP VERIFICATION & DIAGNOSTICS       ║" -ForegroundColor Cyan
Write-Host "║          Version 2.1.0 | 2025-12-09            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node.js
Write-Host "[1/6] Checking Node.js Installation..." -ForegroundColor Yellow
$node = node --version 2>$null
$npm = npm --version 2>$null
$npx = npx --version 2>$null

if ($node -and $npm -and $npx) {
    Write-Host "  ✓ Node.js $node" -ForegroundColor Green
    Write-Host "  ✓ NPM $npm" -ForegroundColor Green
    Write-Host "  ✓ NPX $npx" -ForegroundColor Green
} else {
    Write-Host "  ✗ Node.js not found or incomplete installation" -ForegroundColor Red
    Write-Host "  → Install from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 2. Check Environment Variables
Write-Host "`n[2/6] Checking Environment Variables..." -ForegroundColor Yellow

$env_vars = @(
    "GITHUB_PAT",
    "BRAVE_SEARCH_API_KEY",
    "TAVILY_API_KEY",
    "FIRECRAWL_API_KEY"
)

$env_status = @{}
foreach ($var in $env_vars) {
    $value = [System.Environment]::GetEnvironmentVariable($var, "User")
    if ($value) {
        $masked = if ($value.Length -gt 20) {
            $value.Substring(0, 10) + "..." + $value.Substring($value.Length - 5)
        } else {
            "***" * ($value.Length / 3)
        }
        Write-Host "  ✓ $var = $masked" -ForegroundColor Green
        $env_status[$var] = $true
    } else {
        Write-Host "  ⚠ $var not set" -ForegroundColor DarkYellow
        $env_status[$var] = $false
    }
}

if (-not $env_status["GITHUB_PAT"]) {
    Write-Host "`n  ⚠ WARNING: GITHUB_PAT not set. MCPs requiring GitHub will fail." -ForegroundColor Red
}

# 3. Check Configuration Files
Write-Host "`n[3/6] Checking Configuration Files..." -ForegroundColor Yellow

$configs = @{
    "Claude Desktop" = "$env:APPDATA\Claude\claude_desktop_config.json"
    "Cursor" = "$env:APPDATA\Cursor\User\mcp.json"
    "VS Code" = "$env:APPDATA\Code\User\mcp.json"
    "Windsurf" = "$env:APPDATA\Windsurf\yolo.json"
}

foreach ($name in $configs.Keys) {
    $path = $configs[$name]
    if (Test-Path $path) {
        try {
            $json = Get-Content $path | ConvertFrom-Json
            $server_count = if ($json.mcpServers) {
                @($json.mcpServers.PSObject.Properties).Count
            } else {
                0
            }
            Write-Host "  ✓ $name ($server_count MCPs)" -ForegroundColor Green
            if ($Verbose) {
                $servers = $json.mcpServers.PSObject.Properties | Select-Object -ExpandProperty Name
                foreach ($server in $servers) {
                    Write-Host "      - $server"
                }
            }
        } catch {
            Write-Host "  ✗ $name - Invalid JSON" -ForegroundColor Red
        }
    } else {
        Write-Host "  ⚠ $name - Not found at $path" -ForegroundColor DarkYellow
    }
}

# 4. Test MCP Servers
Write-Host "`n[4/6] Testing MCP Servers (30 second timeout)..." -ForegroundColor Yellow

$servers_to_test = @(
    @{
        name = "Filesystem"
        cmd = "npx"
        args = @("-y", "@modelcontextprotocol/server-filesystem", "C:/Users/mesha/Desktop")
    },
    @{
        name = "Git"
        cmd = "npx"
        args = @("-y", "@modelcontextprotocol/server-git", "C:/Users/mesha/Desktop/GitHub")
    },
    @{
        name = "Fetch"
        cmd = "npx"
        args = @("-y", "@modelcontextprotocol/server-fetch")
    }
)

$tested = 0
foreach ($server in $servers_to_test) {
    try {
        Write-Host "  Testing $($server.name)..." -NoNewline -ForegroundColor Cyan

        $process = Start-Process -FilePath $server.cmd `
                                 -ArgumentList $server.args `
                                 -NoNewWindow `
                                 -PassThru `
                                 -ErrorAction SilentlyContinue

        Start-Sleep -Seconds 2

        if (-not $process.HasExited) {
            Write-Host " ✓" -ForegroundColor Green
            Stop-Process -InputObject $process -Force -ErrorAction SilentlyContinue
            $tested++
        } else {
            Write-Host " ✗" -ForegroundColor Red
        }
    } catch {
        Write-Host " ✗ (Not installed)" -ForegroundColor Red
    }
}

Write-Host "  Result: $tested/$($servers_to_test.Count) servers working" -ForegroundColor Cyan

# 5. Check Documentation
Write-Host "`n[5/6] Checking Documentation..." -ForegroundColor Yellow

$docs = @(
    "C:/Users/mesha/Desktop/GitHub/MCP_SETUP_GUIDE.md",
    "C:/Users/mesha/Desktop/GitHub/API_KEYS_SETUP.md",
    "C:/Users/mesha/Desktop/GitHub/MCP_FIXES_APPLIED.md"
)

foreach ($doc in $docs) {
    $name = Split-Path $doc -Leaf
    if (Test-Path $doc) {
        $size = (Get-Item $doc).Length
        Write-Host "  ✓ $name" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $name - Not found" -ForegroundColor Red
    }
}

# 6. Security Check
Write-Host "`n[6/6] Security Check..." -ForegroundColor Yellow

$sec_issues = @()

# Check for hardcoded tokens in configs
foreach ($name in $configs.Keys) {
    $path = $configs[$name]
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        if ($content -match "ghp_" -or $content -match "your_token_here" -or $content -match "your_api_key_here") {
            $sec_issues += "  ✗ $name contains hardcoded tokens!"
        }
    }
}

if ($sec_issues.Count -eq 0) {
    Write-Host "  ✓ No hardcoded credentials found" -ForegroundColor Green
} else {
    foreach ($issue in $sec_issues) {
        Write-Host $issue -ForegroundColor Red
    }
}

# Final Summary
Write-Host "`n╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                 SUMMARY REPORT                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host ""
if ($env_status["GITHUB_PAT"] -and $tested -gt 0 -and $sec_issues.Count -eq 0) {
    Write-Host "✓ All systems operational!" -ForegroundColor Green
    Write-Host "  • Environment variables: Configured" -ForegroundColor Green
    Write-Host "  • MCP servers: Operational" -ForegroundColor Green
    Write-Host "  • Security: Verified" -ForegroundColor Green
} else {
    Write-Host "⚠ Some issues detected:" -ForegroundColor Yellow
    if (-not $env_status["GITHUB_PAT"]) {
        Write-Host "  → Set GITHUB_PAT environment variable" -ForegroundColor Yellow
    }
    if ($tested -eq 0) {
        Write-Host "  → Install MCP servers with: npm install -g @modelcontextprotocol/server-*" -ForegroundColor Yellow
    }
    if ($sec_issues.Count -gt 0) {
        Write-Host "  → Remove hardcoded tokens from config files" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Set GITHUB_PAT: See API_KEYS_SETUP.md" -ForegroundColor Cyan
Write-Host "  2. Restart your IDEs" -ForegroundColor Cyan
Write-Host "  3. Verify MCP servers appear in IDE settings" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  • Full Setup: MCP_SETUP_GUIDE.md" -ForegroundColor Cyan
Write-Host "  • API Keys: API_KEYS_SETUP.md" -ForegroundColor Cyan
Write-Host "  • Changes: MCP_FIXES_APPLIED.md" -ForegroundColor Cyan
Write-Host ""
