#!/bin/bash
# Update dependencies safely

echo "🔄 Updating dependencies..."

# Update patch versions (safe)
echo "\n📦 Updating patch versions..."
npm update prettier tsx typescript-eslint yaml

# Check for outdated packages
echo "\n📅 Checking for outdated packages..."
npm outdated

# Run security audit
echo "\n🔒 Running security audit..."
npm audit

# Run tests
echo "\n🧪 Running tests..."
npx turbo test

# Type check
echo "\n📝 Type checking..."
npx turbo type-check

# Build
echo "\n🏗️  Building..."
npx turbo build

echo "\n✅ Update complete! Review changes before committing."
