# API Keys & Environment Setup Guide

**Context:** Secure credential management for MCPs across desktop IDEs
**Created:** 2025-12-09 **Scope:** Development environment setup

---

## Quick Reference: Required API Keys

### 1. GitHub Personal Access Token (Essential)

**What it does:** Enables reading/writing to repositories, managing PRs,
checking commits

**How to get it:**

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Click "Generate new token (classic)"
3. Name: `Claude Desktop MCP` or similar
4. Expiration: 90 days (recommended)
5. Select scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `read:org` - Read org/team data
   - ✅ `user:email` - Read email address
   - ❌ Admin scopes (not needed)

**Set in PowerShell:**

```powershell
$env:GITHUB_PAT = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
[System.Environment]::SetEnvironmentVariable("GITHUB_PAT", "$env:GITHUB_PAT", "User")
```

**Test:**

```bash
curl -H "Authorization: token $env:GITHUB_PAT" https://api.github.com/user
```

---

### 2. Brave Search API (Optional but Recommended)

**What it does:** Privacy-focused web search integration

**How to get it:**

1. Visit https://api.search.brave.com
2. Sign up (free tier available)
3. Copy API key

**Set in PowerShell:**

```powershell
$env:BRAVE_SEARCH_API_KEY = "your_brave_key_here"
[System.Environment]::SetEnvironmentVariable("BRAVE_SEARCH_API_KEY", "$env:BRAVE_SEARCH_API_KEY", "User")
```

---

### 3. Tavily Search API (Optional)

**What it does:** AI-powered web search for research and fact-checking

**How to get it:**

1. Visit https://tavily.com/
2. Sign up for free
3. Get API key from dashboard

**Set in PowerShell:**

```powershell
$env:TAVILY_API_KEY = "tvly-xxxxxxxxxxxxxxxxxxxx"
[System.Environment]::SetEnvironmentVariable("TAVILY_API_KEY", "$env:TAVILY_API_KEY", "User")
```

---

### 4. FireCrawl API (Optional)

**What it does:** Web scraping and HTML-to-markdown conversion

**How to get it:**

1. Visit https://www.firecrawl.dev
2. Sign up
3. Get API key

**Set in PowerShell:**

```powershell
$env:FIRECRAWL_API_KEY = "fc-xxxxxxxxxxxxxxxxxxxx"
[System.Environment]::SetEnvironmentVariable("FIRECRAWL_API_KEY", "$env:FIRECRAWL_API_KEY", "User")
```

---

## Complete Setup Script

Save as `setup-mcps.ps1` and run in PowerShell (Administrator):

```powershell
# MCP Setup Script for Windows
# Run as Administrator

param(
    [switch]$Minimal = $false,
    [switch]$Full = $false
)

Write-Host "=== MCP Setup for Desktop IDEs ===" -ForegroundColor Cyan

# Check Node.js
Write-Host "`nChecking Node.js installation..." -ForegroundColor Yellow
$node = node --version
$npm = npm --version
if ($node -and $npm) {
    Write-Host "✓ Node.js $node and NPM $npm found" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Environment Variables
Write-Host "`nSetting up environment variables..." -ForegroundColor Yellow
Write-Host "Enter your GitHub PAT (ghp_...): " -ForegroundColor Cyan
$github_pat = Read-Host
if ($github_pat) {
    [System.Environment]::SetEnvironmentVariable("GITHUB_PAT", $github_pat, "User")
    Write-Host "✓ GITHUB_PAT saved" -ForegroundColor Green
}

if (-not $Minimal) {
    Write-Host "Enter Brave Search API Key (optional): " -ForegroundColor Cyan
    $brave = Read-Host
    if ($brave) {
        [System.Environment]::SetEnvironmentVariable("BRAVE_SEARCH_API_KEY", $brave, "User")
        Write-Host "✓ BRAVE_SEARCH_API_KEY saved" -ForegroundColor Green
    }

    Write-Host "Enter Tavily API Key (optional): " -ForegroundColor Cyan
    $tavily = Read-Host
    if ($tavily) {
        [System.Environment]::SetEnvironmentVariable("TAVILY_API_KEY", $tavily, "User")
        Write-Host "✓ TAVILY_API_KEY saved" -ForegroundColor Green
    }

    Write-Host "Enter FireCrawl API Key (optional): " -ForegroundColor Cyan
    $firecrawl = Read-Host
    if ($firecrawl) {
        [System.Environment]::SetEnvironmentVariable("FIRECRAWL_API_KEY", $firecrawl, "User")
        Write-Host "✓ FIRECRAWL_API_KEY saved" -ForegroundColor Green
    }
}

# Install MCP Servers
Write-Host "`nInstalling MCP servers..." -ForegroundColor Yellow

$servers = @(
    "@modelcontextprotocol/server-filesystem",
    "@modelcontextprotocol/server-git",
    "@github/github-mcp-server",
    "@modelcontextprotocol/server-fetch",
    "@modelcontextprotocol/server-memory",
    "@modelcontextprotocol/server-sequential-thinking",
    "@modelcontextprotocol/server-time"
)

foreach ($server in $servers) {
    Write-Host "Installing $server..." -ForegroundColor Cyan
    npm install -g $server
    if ($?) {
        Write-Host "✓ $server installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install $server" -ForegroundColor Red
    }
}

# Verify Installation
Write-Host "`nVerifying installations..." -ForegroundColor Yellow
$server_test = npx @modelcontextprotocol/server-filesystem C:/Users/mesha/Desktop
if ($?) {
    Write-Host "✓ Filesystem server works" -ForegroundColor Green
    # Kill the test server
    taskkill /F /IM node.exe 2>$null
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your IDE/terminal"
Write-Host "2. Update claude_desktop_config.json with the MCP_SETUP_GUIDE.md"
Write-Host "3. Verify servers appear in IDE settings"
```

**Run it:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup-mcps.ps1
```

---

## Security Checklist

- [ ] GitHub PAT created with minimal scopes
- [ ] All tokens stored in environment variables (not config files)
- [ ] Tokens expire in 90 days or less
- [ ] `.gitignore` includes `claude_desktop_config.json`
- [ ] No tokens in commit history: `git log --grep="token\|key\|password"`
- [ ] Environment variables set in user scope (not system-wide)
- [ ] Token rotation scheduled quarterly
- [ ] Access logs monitored

---

## Credential Rotation

**Every 90 days, rotate credentials:**

```powershell
# 1. Generate new GitHub PAT
# Settings > Developer Settings > Personal Access Tokens > Generate new

# 2. Update environment variable
$env:GITHUB_PAT = "ghp_new_token_here"
[System.Environment]::SetEnvironmentVariable("GITHUB_PAT", "$env:GITHUB_PAT", "User")

# 3. Delete old token from GitHub
# Settings > Developer Settings > Personal Access Tokens > Delete

# 4. Restart IDE
```

---

## Troubleshooting API Keys

### "Invalid GitHub Token"

```powershell
# Verify token is set and valid
curl -H "Authorization: token $env:GITHUB_PAT" https://api.github.com/user

# Expected output: Your GitHub user info
```

### "API Key Not Found"

```powershell
# Check if variable exists
Get-ChildItem env:GITHUB_PAT

# Verify it's in User scope
[System.Environment]::GetEnvironmentVariable("GITHUB_PAT", "User")

# If not set, run setup script again
```

### "Server Auth Failed"

1. Check token is valid
2. Restart IDE (env changes require restart)
3. Verify token has correct scopes
4. Check token hasn't expired

---

## Best Practices

✅ **DO:**

- Rotate tokens every 90 days
- Use minimal scopes
- Store in environment variables
- Monitor access logs
- Use separate tokens per IDE
- Keep tokens in OS secure storage when possible

❌ **DON'T:**

- Hardcode tokens in config files
- Share tokens via email/Slack
- Use old tokens
- Commit tokens to git
- Use overly broad scopes
- Reuse tokens across systems

---

## Additional Resources

- **GitHub Docs:**
  https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
- **OWASP Secrets Management:**
  https://owasp.org/www-community/Sensitive_Data_Exposure
- **12factor.net - Config:** https://12factor.net/config

---

**Version:** 1.0.0 **Last Updated:** 2025-12-09
