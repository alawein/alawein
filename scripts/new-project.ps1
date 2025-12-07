<#
.SYNOPSIS
    Creates a new project from templates.

.DESCRIPTION
    Scaffolds a new project using predefined templates for SaaS, Python packages, or mobile apps.

.PARAMETER Name
    The name of the new project (lowercase, no spaces).

.PARAMETER Template
    Template type: 'saas-react', 'python-package', 'mobile-react-native'.

.PARAMETER LLC
    Target LLC: 'alawein', 'liveiticonic', 'repz'.

.PARAMETER Category
    Project category: 'saas', 'packages', 'mobile-apps', 'tools', 'research'.

.PARAMETER Description
    Brief description of the project.

.EXAMPLE
    .\scripts\new-project.ps1 -Name "analytics" -Template "saas-react" -LLC "alawein" -Category "saas"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Name,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("saas-react", "python-package")]
    [string]$Template,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("alawein", "liveiticonic", "repz")]
    [string]$LLC,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("saas", "packages", "mobile-apps", "tools", "research", "ecommerce", "apps")]
    [string]$Category,
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "A new project"
)

$ErrorActionPreference = "Stop"

# Map LLC names to directory names
$llcDirs = @{
    "alawein" = "alawein-technologies-llc"
    "liveiticonic" = "live-it-iconic-llc"
    "repz" = "repz-llc"
}

$llcDir = $llcDirs[$LLC]
$targetPath = "organizations/$llcDir/$Category/$Name"
$templatePath = "templates/$Template"

# Validate template exists
if (-not (Test-Path $templatePath)) {
    Write-Error "Template '$Template' not found at $templatePath"
    exit 1
}

# Check target doesn't exist
if (Test-Path $targetPath) {
    Write-Error "Project already exists at $targetPath"
    exit 1
}

Write-Host "🚀 Creating new project..." -ForegroundColor Cyan
Write-Host "   Name: $Name" -ForegroundColor White
Write-Host "   Template: $Template" -ForegroundColor White
Write-Host "   Location: $targetPath" -ForegroundColor White

# Copy template
Write-Host "`n📁 Copying template files..." -ForegroundColor Yellow
Copy-Item -Path $templatePath -Destination $targetPath -Recurse

# Replace placeholders in all files
Write-Host "🔄 Replacing placeholders..." -ForegroundColor Yellow
$files = Get-ChildItem -Path $targetPath -Recurse -File
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content) {
        $content = $content -replace '\{\{PROJECT_NAME\}\}', $Name
        $content = $content -replace '\{\{PROJECT_DESCRIPTION\}\}', $Description
        $content = $content -replace '\{\{KEYWORDS\}\}', "$Name, $Category, $LLC"
        Set-Content -Path $file.FullName -Value $content -NoNewline
    }
}

# Rename src directory for Python packages
if ($Template -eq "python-package") {
    $srcDir = Join-Path $targetPath "src"
    $pkgDir = Join-Path $targetPath "src/$Name"
    if (Test-Path $srcDir) {
        # Move files from src/ to src/$Name/
        New-Item -ItemType Directory -Path $pkgDir -Force | Out-Null
        Get-ChildItem $srcDir -File | Move-Item -Destination $pkgDir
    }
}

Write-Host "`n✅ Project created successfully!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan

if ($Template -eq "saas-react") {
    Write-Host "   cd $targetPath" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
} elseif ($Template -eq "python-package") {
    Write-Host "   cd $targetPath" -ForegroundColor White
    Write-Host "   python -m venv .venv" -ForegroundColor White
    Write-Host "   .venv\Scripts\Activate" -ForegroundColor White
    Write-Host "   pip install -e .[dev]" -ForegroundColor White
}

