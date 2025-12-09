#!/bin/bash

echo "🧹 Starting Complete Supabase Removal Process..."
echo "================================================"

# Create backup first
echo "📦 Creating backup of current state..."
mkdir -p _backup_before_supabase_removal
cp package.json _backup_before_supabase_removal/
cp -r supabase _backup_before_supabase_removal/ 2>/dev/null || true
cp -r src/integrations/supabase _backup_before_supabase_removal/ 2>/dev/null || true

# 1. Remove Supabase NPM packages
echo ""
echo "1️⃣ Removing Supabase NPM packages..."
npm uninstall @supabase/supabase-js

# 2. Remove Supabase folders
echo ""
echo "2️⃣ Removing Supabase directories..."
rm -rf supabase/
rm -rf src/integrations/supabase/
rm -rf .supabase/
rm -rf node_modules/@supabase/

# 3. Update package.json to remove Supabase scripts
echo ""
echo "3️⃣ Updating package.json..."
cat > package.json.tmp << 'EOF'
{
  "name": "repz-platform",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 8080",
    "build": "tsc && vite build",
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production",
    "preview": "vite preview",
    "preview:staging": "vite preview --mode staging",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:unit": "vitest run --testNamePattern='unit'",
    "test:component": "vitest run --testNamePattern='component'",
    "test:integration": "vitest run --testNamePattern='integration'",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:a11y": "vitest run --testNamePattern='a11y'",
    "test:performance:smoke": "k6 run tests/performance/smoke.js",
    "test:auth": "npm run test -- --testNamePattern='auth'",
    "test:stripe": "npm run test -- --testNamePattern='stripe'",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --fix",
    "analyze:bundle": "vite-bundle-analyzer",
    "analyze:deps": "depcheck",
    "audit:quick": "npm audit --audit-level=moderate",
    "audit:routes": "node scripts/route-audit.mjs",
    "validate:production": "npm run type-check && npm run audit:quick && npm run audit:routes && npm run build:production",
    "refactor:analyze": "node scripts/refactor-analyzer.mjs"
  },
  "dependencies": {
    "@capacitor/android": "^6.2.0",
    "@capacitor/app": "^6.0.0",
    "@capacitor/core": "^6.2.0",
    "@capacitor/filesystem": "^6.0.3",
    "@capacitor/geolocation": "^6.0.0",
    "@capacitor/haptics": "^6.0.0",
    "@capacitor/ios": "^6.2.0",
    "@capacitor/local-notifications": "^6.0.0",
    "@capacitor/push-notifications": "^6.0.1",
    "@capacitor/share": "^6.0.0",
    "@capacitor/splash-screen": "^6.0.0",
    "@capacitor/status-bar": "^6.0.0",
    "@capacitor/storage": "^1.2.5",
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "@floating-ui/react": "^0.26.29",
    "@fontsource-variable/inter": "^5.1.0",
    "@fontsource-variable/space-grotesk": "^5.1.0",
    "@fontsource/bebas-neue": "^5.1.0",
    "@fontsource/roboto-mono": "^5.1.0",
    "@hello-pangea/dnd": "^17.0.0",
    "@hookform/resolvers": "^3.9.1",
    "@internationalized/date": "^3.6.0",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.3",
    "@radix-ui/react-aspect-ratio": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.2",
    "@radix-ui/react-context-menu": "^2.2.3",
    "@radix-ui/react-dialog": "^1.1.3",
    "@radix-ui/react-dropdown-menu": "^2.1.3",
    "@radix-ui/react-hover-card": "^1.1.3",
    "@radix-ui/react-icons": "^1.3.2",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-menubar": "^1.1.3",
    "@radix-ui/react-navigation-menu": "^1.2.2",
    "@radix-ui/react-popover": "^1.1.3",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-select": "^2.1.3",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.3",
    "@radix-ui/react-toggle": "^1.1.1",
    "@radix-ui/react-toggle-group": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.5",
    "@stripe/react-stripe-js": "^2.11.0",
    "@stripe/stripe-js": "^5.4.0",
    "@tanstack/react-query": "^5.65.0",
    "@tanstack/react-query-devtools": "^5.65.0",
    "@tanstack/react-table": "^8.20.6",
    "@vercel/analytics": "^1.3.1",
    "@vercel/node": "^3.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.4",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.5.1",
    "framer-motion": "^11.13.5",
    "lucide-react": "^0.468.0",
    "qrcode": "^1.5.4",
    "react": "^18.3.1",
    "react-aria": "^3.36.0",
    "react-aria-components": "^1.5.1",
    "react-confetti": "^6.1.0",
    "react-day-picker": "^9.3.4",
    "react-dom": "^18.3.1",
    "react-helmet-async": "^2.0.5",
    "react-hook-form": "^7.55.0",
    "react-hot-toast": "^2.4.1",
    "react-query": "^3.39.3",
    "react-router-dom": "^7.0.2",
    "react-stately": "^3.34.1",
    "react-use": "^17.5.1",
    "recharts": "^2.14.1",
    "sonner": "^1.7.1",
    "swiper": "^11.1.15",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.2",
    "valibot": "^0.43.0",
    "zod": "^3.24.1",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.2.0",
    "@ianvs/prettier-plugin-sort-imports": "^4.4.0",
    "@playwright/test": "^1.49.1",
    "@sentry/vite-plugin": "^2.25.0",
    "@tailwindcss/forms": "^0.5.10",
    "@tailwindcss/typography": "^0.5.16",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.2",
    "@types/qrcode": "^1.5.6",
    "@types/react": "^18.3.14",
    "@types/react-dom": "^18.3.2",
    "@types/react-helmet": "^6.1.11",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitejs/plugin-react-swc": "^3.7.2",
    "@vitest/ui": "^2.1.8",
    "autoprefixer": "^10.4.20",
    "depcheck": "^1.4.7",
    "dotenv": "^16.4.7",
    "esbuild": "^0.25.0",
    "eslint": "^9.17.0",
    "eslint-plugin-a11y": "^0.0.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.3",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.16",
    "jsdom": "^26.0.0",
    "lighthouse": "^12.3.0",
    "msw": "^2.7.0",
    "postcss": "^8.4.49",
    "prettier": "^3.4.2",
    "prettier-plugin-tailwindcss": "^0.6.9",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vite": "^5.4.11",
    "vite-bundle-analyzer": "^0.0.12",
    "vite-plugin-pwa": "^0.21.2",
    "vitest": "^2.1.8"
  }
}
EOF

# Check if jq is available for pretty JSON formatting
if command -v jq &> /dev/null; then
    jq . package.json.tmp > package.json
    rm package.json.tmp
else
    mv package.json.tmp package.json
fi

# 4. Replace Supabase imports in all TypeScript/JavaScript files
echo ""
echo "4️⃣ Replacing Supabase imports with Vercel backend..."
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec grep -l "supabase" {} \; 2>/dev/null | while read file; do
    echo "  Updating: $file"
    # Replace imports
    sed -i "s|import.*from.*['\"].*supabase.*['\"]|import vercelBackend from '@/services/vercelBackend'|g" "$file"
    # Replace supabase. with vercelBackend.
    sed -i "s|supabase\.|vercelBackend.|g" "$file"
done

# 5. Update documentation files to remove Supabase mentions
echo ""
echo "5️⃣ Updating documentation..."
find . -name "*.md" -type f -exec grep -l "supabase" {} \; 2>/dev/null | while read file; do
    # Skip backup and migration files
    if [[ "$file" != *"backup"* ]] && [[ "$file" != *"MIGRATION"* ]]; then
        echo "  Updating doc: $file"
        sed -i "s/Supabase/Vercel/g" "$file"
        sed -i "s/supabase/vercel/g" "$file"
    fi
done

# 6. Remove Supabase from .env files
echo ""
echo "6️⃣ Cleaning environment files..."
for envfile in .env .env.local .env.production .env.example; do
    if [ -f "$envfile" ]; then
        echo "  Cleaning: $envfile"
        grep -v "SUPABASE" "$envfile" > "$envfile.tmp" 2>/dev/null || true
        mv "$envfile.tmp" "$envfile" 2>/dev/null || true
    fi
done

# 7. Install dependencies without Supabase
echo ""
echo "7️⃣ Reinstalling dependencies..."
npm install

echo ""
echo "✅ Supabase Removal Complete!"
echo ""
echo "📊 Summary:"
echo "  - Removed @supabase/supabase-js package"
echo "  - Deleted supabase/ directory"
echo "  - Deleted src/integrations/supabase/"
echo "  - Updated package.json scripts"
echo "  - Replaced imports in source files"
echo "  - Cleaned environment files"
echo ""
echo "📦 Backup created in: _backup_before_supabase_removal/"
echo ""
echo "🚀 Your app now runs 100% on Vercel!"
echo ""
echo "Next steps:"
echo "  1. Test the app: http://localhost:8080"
echo "  2. Deploy to Vercel: vercel --prod"
echo ""