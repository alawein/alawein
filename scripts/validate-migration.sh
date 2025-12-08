#!/bin/bash

# Lovable.dev to Monorepo Migration Validation Script
# Validates that all required migration changes have been applied

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Validation results
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}🔍 Lovable.dev Migration Validation${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Function to print validation result
validate() {
    local test_name="$1"
    local test_command="$2"
    local expected="$3"

    echo -n "Testing $test_name... "

    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        if [ -n "$expected" ]; then
            echo -e "   ${YELLOW}Expected: $expected${NC}"
        fi
        ((FAILED++))
        return 1
    fi
}

# Function to print warning
warning() {
    local message="$1"
    echo -e "${YELLOW}⚠️  WARNING: $message${NC}"
    ((WARNINGS++))
}

# 1. Check package.json structure
echo -e "${BLUE}📦 Checking package.json${NC}"
validate "Package name format" 'grep -q "\"name\":" package.json && ! grep -q "\"my-lovable-project\"" package.json' "Project name should be updated"
validate "Repository field" 'grep -q "\"repository\":" package.json' "Repository field should point to monorepo"
validate "Type module" 'grep -q "\"type\": \"module\"" package.json' "Should have type: module"
validate "Engines field" 'grep -q "\"engines\":" package.json' "Should specify Node.js and pnpm versions"
validate "Pnpm scripts" 'grep -q "type-check" package.json' "Should include type-check script"
validate "React SWC plugin" 'grep -q "@vitejs/plugin-react-swc" package.json' "Should use React SWC plugin"

# 2. Check vite.config.ts
echo ""
echo -e "${BLUE}⚡ Checking vite.config.ts${NC}"
validate "Vite config exists" 'test -f vite.config.ts' "vite.config.ts should exist"
validate "Path aliases" 'grep -q "\"@\"" vite.config.ts' "Should have @ alias"
validate "SWC plugin" 'grep -q "@vitejs/plugin-react-swc" vite.config.ts' "Should use React SWC plugin"
validate "Build optimization" 'grep -q "manualChunks" vite.config.ts' "Should have build optimization"

# 3. Check tsconfig.json
echo ""
echo -e "${BLUE}📘 Checking tsconfig.json${NC}"
validate "TSConfig exists" 'test -f tsconfig.json' "tsconfig.json should exist"
validate "Path aliases in TSConfig" 'grep -q "\"@/*\"" tsconfig.json' "Should have @/* paths"
validate "Component aliases" 'grep -q "\"@/components/*\"" tsconfig.json' "Should have component aliases"
validate "Base URL" 'grep -q "\"baseUrl\": \"\.\"" tsconfig.json' "Should have baseUrl set"

# 4. Check tailwind.config.ts
echo ""
echo -e "${BLUE}🎨 Checking tailwind.config.ts${NC}"
validate "Tailwind config exists" 'test -f tailwind.config.ts' "tailwind.config.ts should exist"
validate "Brand colors" 'grep -q "brand:" tailwind.config.ts' "Should have brand colors"
validate "Extended theme" 'grep -q "extend:" tailwind.config.ts' "Should extend theme"
validate "Custom fonts" 'grep -q "fontFamily:" tailwind.config.ts' "Should have custom fonts"

# 5. Check CSS files
echo ""
echo -e "${BLUE}🎭 Checking CSS files${NC}"
validate "Index CSS exists" 'test -f src/index.css' "src/index.css should exist"
validate "CSS variables" 'grep -q "var(--brand-" src/index.css' "Should have CSS variables"
validate "Tailwind imports" 'grep -q "@tailwind" src/index.css' "Should import Tailwind"

# 6. Check source files
echo ""
echo -e "${BLUE}⚛️  Checking React files${NC}"
validate "Main.tsx exists" 'test -f src/main.tsx' "src/main.tsx should exist"
validate "React Router" 'grep -q "BrowserRouter" src/main.tsx' "Should use React Router"
validate "Query Client" 'grep -q "QueryClientProvider" src/main.tsx' "Should have React Query"
validate "App.tsx exists" 'test -f src/App.tsx' "src/App.tsx should exist"
validate "Routes in App" 'grep -q "Routes" src/App.tsx' "Should have routing setup"

# 7. Check package manager
echo ""
echo -e "${BLUE}📦 Checking Package Manager${NC}"
if [ -f "pnpm-lock.yaml" ]; then
    echo -n "Using pnpm... "
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
elif [ -f "package-lock.json" ]; then
    echo -n "Using npm (should be pnpm)... "
    echo -e "${RED}❌ FAIL${NC}"
    echo -e "   ${YELLOW}Expected: pnpm-lock.yaml${NC}"
    ((FAILED++))
else
    warning "No lockfile found - run 'pnpm install'"
fi

# 8. Check GitHub workflows
echo ""
echo -e "${BLUE}🔄 Checking GitHub Workflows${NC}"
validate "GitHub workflows directory" 'test -d .github/workflows' ".github/workflows should exist"
validate "CI workflow" 'test -f .github/workflows/ci.yml' "ci.yml should exist"
validate "Security workflow" 'test -f .github/workflows/security.yml' "security.yml should exist"
validate "Deploy workflow" 'test -f .github/workflows/deploy.yml' "deploy.yml should exist"

# 9. Check environment setup
echo ""
echo -e "${BLUE}🔧 Checking Environment Setup${NC}"
validate "Environment example" 'test -f .env.example' ".env.example should exist"
if [ ! -f ".env.local" ]; then
    warning ".env.local not found - create from .env.example"
fi

# 10. Check for common Lovable artifacts to remove
echo ""
echo -e "${BLUE}🧹 Checking for Cleanup${NC}"
if [ -f "package-lock.json" ]; then
    warning "package-lock.json should be deleted (using pnpm)"
fi

if [ -d "node_modules" ]; then
    warning "node_modules should be deleted and reinstalled with pnpm"
fi

# Check for old Lovable workflows
if [ -f ".github/workflows/ci.yml" ] && grep -q "lovable" .github/workflows/ci.yml; then
    warning "Old Lovable workflows detected - should use monorepo templates"
fi

# Summary
echo ""
echo -e "${BLUE}📊 Validation Summary${NC}"
echo -e "${BLUE}===================${NC}"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Migration validation PASSED!${NC}"
    echo -e "${GREEN}✅ Your project is ready for the monorepo${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Run 'pnpm install' to install dependencies"
    echo "2. Run 'pnpm type-check' to verify TypeScript"
    echo "3. Run 'pnpm build' to test the build"
    echo "4. Commit your changes"
    exit 0
else
    echo -e "${RED}❌ Migration validation FAILED${NC}"
    echo -e "${RED}Please fix the $FAILED failed checks above${NC}"
    echo ""
    echo -e "${BLUE}Common fixes:${NC}"
    echo "1. Update configuration files using the migration guide"
    echo "2. Delete package-lock.json and run 'pnpm install'"
    echo "3. Replace .github/workflows/ with monorepo templates"
    echo "4. Update import paths to use @ aliases"
    exit 1
fi
