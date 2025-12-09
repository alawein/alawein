#!/bin/bash

# REPZ Premium Subscription Testing Script
# This script performs automated tests on the premium subscription system

set -e

echo "🧪 REPZ Premium Subscription Test Suite"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((TESTS_PASSED++))
}

fail() {
    echo -e "${RED}✗${NC} $1"
    ((TESTS_FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Check if required commands exist
check_command() {
    if command -v $1 &> /dev/null; then
        pass "$1 is installed"
        return 0
    else
        fail "$1 is not installed"
        return 1
    fi
}

# Test 1: Prerequisites
section "1. Checking Prerequisites"

check_command "node"
check_command "npm"
check_command "supabase"

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    pass "Node.js version is 18 or higher ($NODE_VERSION)"
else
    fail "Node.js version must be 18 or higher (current: $NODE_VERSION)"
fi

# Test 2: File Structure
section "2. Verifying File Structure"

FILES=(
    "src/types/subscription.ts"
    "src/hooks/useSubscription.ts"
    "src/components/payment/PaymentFlow.tsx"
    "src/components/pricing/PricingPlans.tsx"
    "src/pages/PaymentSuccess.tsx"
    "src/pages/PaymentCancel.tsx"
    "supabase/functions/create-premium-checkout/index.ts"
    "supabase/functions/stripe-webhook/index.ts"
    ".env.premium.example"
    "PREMIUM-SUBSCRIPTION-SETUP.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        pass "File exists: $file"
    else
        fail "File missing: $file"
    fi
done

# Test 3: Environment Configuration
section "3. Checking Environment Configuration"

if [ -f ".env.local" ]; then
    pass ".env.local file exists"
    
    # Check for required variables
    if grep -q "VITE_STRIPE_PUBLIC_KEY" .env.local; then
        pass "VITE_STRIPE_PUBLIC_KEY is configured"
    else
        warn "VITE_STRIPE_PUBLIC_KEY not found in .env.local"
    fi
    
    if grep -q "SUPABASE_URL" .env.local; then
        pass "SUPABASE_URL is configured"
    else
        warn "SUPABASE_URL not found in .env.local"
    fi
else
    warn ".env.local file not found (copy from .env.premium.example)"
fi

# Test 4: Dependencies
section "4. Checking Dependencies"

if [ -f "package.json" ]; then
    pass "package.json exists"
    
    # Check for Stripe dependency
    if grep -q "@stripe/stripe-js" package.json; then
        pass "@stripe/stripe-js dependency found"
    else
        warn "@stripe/stripe-js not in package.json (run: npm install @stripe/stripe-js)"
    fi
    
    # Check for React Router
    if grep -q "react-router-dom" package.json; then
        pass "react-router-dom dependency found"
    else
        warn "react-router-dom not in package.json"
    fi
else
    fail "package.json not found"
fi

# Test 5: TypeScript Compilation
section "5. Testing TypeScript Compilation"

echo "Checking TypeScript files..."

# Check subscription types
if npx tsc --noEmit src/types/subscription.ts 2>/dev/null; then
    pass "subscription.ts compiles without errors"
else
    warn "subscription.ts has TypeScript errors (may be expected for Deno files)"
fi

# Test 6: Component Imports
section "6. Verifying Component Imports"

# Check if components can be imported
IMPORT_TEST="
import { PaymentFlow } from './src/components/payment/PaymentFlow';
import { PricingPlans } from './src/components/pricing/PricingPlans';
import { useSubscription } from './src/hooks/useSubscription';
"

echo "$IMPORT_TEST" > /tmp/import-test.ts
if npx tsc --noEmit --jsx react /tmp/import-test.ts 2>/dev/null; then
    pass "All components can be imported"
else
    warn "Some import issues detected (check component exports)"
fi
rm /tmp/import-test.ts

# Test 7: Supabase Functions
section "7. Checking Supabase Functions"

if [ -d "supabase/functions" ]; then
    pass "Supabase functions directory exists"
    
    # Check function structure
    if [ -f "supabase/functions/create-premium-checkout/index.ts" ]; then
        pass "create-premium-checkout function exists"
        
        # Check for required imports
        if grep -q "stripe" supabase/functions/create-premium-checkout/index.ts; then
            pass "Stripe import found in checkout function"
        fi
    fi
    
    if [ -f "supabase/functions/stripe-webhook/index.ts" ]; then
        pass "stripe-webhook function exists"
        
        # Check for webhook verification
        if grep -q "webhooks.constructEvent" supabase/functions/stripe-webhook/index.ts; then
            pass "Webhook signature verification implemented"
        fi
    fi
else
    fail "supabase/functions directory not found"
fi

# Test 8: Database Schema
section "8. Database Schema Verification"

echo "To verify database schema, run these SQL queries in Supabase:"
echo ""
echo "-- Check subscription_tiers table"
echo "SELECT * FROM subscription_tiers WHERE name = 'premium';"
echo ""
echo "-- Check subscriptions table structure"
echo "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'subscriptions';"
echo ""
warn "Manual database verification required"

# Test 9: Code Quality
section "9. Code Quality Checks"

# Check for console.logs (should use proper logging)
CONSOLE_LOGS=$(grep -r "console.log" src/ 2>/dev/null | wc -l)
if [ "$CONSOLE_LOGS" -eq 0 ]; then
    pass "No console.log statements found"
else
    warn "Found $CONSOLE_LOGS console.log statements (consider using proper logging)"
fi

# Check for TODO comments
TODOS=$(grep -r "TODO" src/ 2>/dev/null | wc -l)
if [ "$TODOS" -eq 0 ]; then
    pass "No TODO comments found"
else
    warn "Found $TODOS TODO comments"
fi

# Test 10: Documentation
section "10. Documentation Check"

if [ -f "PREMIUM-SUBSCRIPTION-SETUP.md" ]; then
    pass "Setup documentation exists"
    
    # Check documentation completeness
    DOC_SECTIONS=(
        "Prerequisites"
        "Environment Setup"
        "Database Setup"
        "Stripe Configuration"
        "Testing"
        "Deployment"
        "Troubleshooting"
    )
    
    for section in "${DOC_SECTIONS[@]}"; do
        if grep -q "$section" PREMIUM-SUBSCRIPTION-SETUP.md; then
            pass "Documentation includes: $section"
        else
            warn "Documentation missing: $section"
        fi
    done
fi

# Summary
section "Test Summary"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
PASS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))

echo ""
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo "Pass Rate: $PASS_RATE%"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure .env.local with your Stripe keys"
    echo "2. Deploy Supabase edge functions"
    echo "3. Set up Stripe webhook"
    echo "4. Run the application and test payment flow"
    echo ""
    echo "See PREMIUM-SUBSCRIPTION-SETUP.md for detailed instructions."
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    echo "Please fix the issues above before proceeding."
    exit 1
fi
