# Development Utilities for Multi-LLC Monorepo
# Usage: . .\scripts\dev-utils.ps1

# Project paths
$script:ORGANIZATIONS_PATH = "organizations"
$script:PACKAGES_PATH = "packages"
$script:RESEARCH_PATH = "research"

function Get-Projects {
    <#
    .SYNOPSIS
    Lists all projects in the monorepo
    #>
    param(
        [ValidateSet("all", "saas", "mobile", "packages", "research", "ecommerce")]
        [string]$Category = "all"
    )

    Write-Host "=== MONOREPO PROJECTS ===" -ForegroundColor Cyan
    
    # Tracked packages
    if ($Category -in @("all", "packages")) {
        Write-Host "`n📦 Packages (tracked):" -ForegroundColor Yellow
        Get-ChildItem -Path $PACKAGES_PATH -Directory | ForEach-Object {
            Write-Host "  - packages/$($_.Name)"
        }
    }

    # Research projects
    if ($Category -in @("all", "research")) {
        Write-Host "`n🔬 Research (tracked):" -ForegroundColor Yellow
        Get-ChildItem -Path $RESEARCH_PATH -Directory | ForEach-Object {
            Write-Host "  - research/$($_.Name)"
        }
    }

    # Organization projects (local working copies)
    if (Test-Path $ORGANIZATIONS_PATH) {
        $llcs = Get-ChildItem -Path $ORGANIZATIONS_PATH -Directory
        foreach ($llc in $llcs) {
            Write-Host "`n🏢 $($llc.Name) (local):" -ForegroundColor Yellow
            Get-ChildItem -Path $llc.FullName -Directory | ForEach-Object {
                $category = $_.Name
                Get-ChildItem -Path $_.FullName -Directory | ForEach-Object {
                    if ($Category -eq "all" -or $Category -eq $category) {
                        Write-Host "  - $category/$($_.Name)"
                    }
                }
            }
        }
    }
}

function Start-Project {
    <#
    .SYNOPSIS
    Starts a development server for a project
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$Name
    )

    # Search in organizations first
    $found = Get-ChildItem -Path "$ORGANIZATIONS_PATH\*\*\$Name" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        Push-Location $found.FullName
        if (Test-Path "package.json") {
            npm run dev
        } elseif (Test-Path "pyproject.toml") {
            Write-Host "Python project - activate venv and run manually"
        }
        Pop-Location
        return
    }

    # Search in packages
    $found = Get-ChildItem -Path "$PACKAGES_PATH\$Name" -Directory -ErrorAction SilentlyContinue
    if ($found) {
        Push-Location $found.FullName
        npm run dev
        Pop-Location
        return
    }

    Write-Host "Project '$Name' not found" -ForegroundColor Red
}

function Test-Project {
    <#
    .SYNOPSIS
    Runs tests for a project
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$Name
    )

    $found = Get-ChildItem -Path "$ORGANIZATIONS_PATH\*\*\$Name" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $found) {
        $found = Get-ChildItem -Path "$RESEARCH_PATH\$Name" -Directory -ErrorAction SilentlyContinue
    }

    if ($found) {
        Push-Location $found.FullName
        if (Test-Path "package.json") {
            npm test
        } elseif (Test-Path "pyproject.toml") {
            pytest
        }
        Pop-Location
    } else {
        Write-Host "Project '$Name' not found" -ForegroundColor Red
    }
}

function Get-RepoHealth {
    <#
    .SYNOPSIS
    Shows repository health metrics
    #>
    Write-Host "=== REPOSITORY HEALTH ===" -ForegroundColor Cyan
    
    $gitSize = (Get-ChildItem -Path ".git" -Recurse -Force | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "`nGit directory size: $([math]::Round($gitSize, 2)) MB"
    
    $branches = (git branch -a | Measure-Object).Count
    Write-Host "Total branches: $branches"
    
    $uncommitted = (git status --short | Measure-Object).Count
    Write-Host "Uncommitted changes: $uncommitted"
    
    $prs = gh pr list --limit 100 2>$null | Measure-Object
    if ($prs) {
        Write-Host "Open PRs: $($prs.Count)"
    }
}

# Export functions
Export-ModuleMember -Function Get-Projects, Start-Project, Test-Project, Get-RepoHealth -ErrorAction SilentlyContinue

Write-Host "✓ Dev utilities loaded. Available commands:" -ForegroundColor Green
Write-Host "  Get-Projects [-Category all|saas|mobile|packages|research|ecommerce]"
Write-Host "  Start-Project -Name <project-name>"
Write-Host "  Test-Project -Name <project-name>"
Write-Host "  Get-RepoHealth"

