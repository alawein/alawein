#!/bin/bash
# Security check script

echo "🔒 Running security checks..."

# Check for vulnerabilities
echo "\n📦 Checking for vulnerabilities..."
npm audit --audit-level=moderate

# Check for outdated packages
echo "\n📅 Checking for outdated packages..."
npm outdated

# Check for secrets
echo "\n🔑 Checking for secrets..."
if command -v detect-secrets &> /dev/null; then
    detect-secrets scan --baseline .secrets.baseline
else
    echo "⚠️  detect-secrets not installed. Run: pip install detect-secrets"
fi

# Verify TypeScript strict mode
echo "\n📝 Checking TypeScript configuration..."
if grep -q '"strict": true' packages/typescript-config/base.json; then
    echo "✅ Strict mode enabled"
else
    echo "⚠️  Strict mode not enabled"
fi

# Check for security headers package
echo "\n🛡️  Checking security headers..."
if [ -f "packages/security-headers/index.ts" ]; then
    echo "✅ Security headers package exists"
else
    echo "⚠️  Security headers package missing"
fi

echo "\n✅ Security check complete!"
