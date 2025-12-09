#!/bin/bash

echo "🔍 Supabase Usage Inspection Report"
echo "===================================="
echo ""

echo "📁 1. Supabase Directories Found:"
echo "---------------------------------"
find . -type d -name "*supabase*" 2>/dev/null | grep -v node_modules | head -20

echo ""
echo "📦 2. NPM Packages with Supabase:"
echo "---------------------------------"
grep -i "supabase" package.json 2>/dev/null || echo "None found"

echo ""
echo "📄 3. Source Files Importing Supabase:"
echo "--------------------------------------"
echo "Total files: $(find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "supabase" {} \; 2>/dev/null | wc -l)"
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "supabase" {} \; 2>/dev/null | head -10

echo ""
echo "📝 4. Documentation Files Mentioning Supabase:"
echo "----------------------------------------------"
echo "Total docs: $(find . -name "*.md" -exec grep -l -i "supabase" {} \; 2>/dev/null | wc -l)"
find . -name "*.md" -exec grep -l -i "supabase" {} \; 2>/dev/null | head -10

echo ""
echo "🔧 5. Configuration Files with Supabase:"
echo "----------------------------------------"
for file in .env .env.local .env.example; do
    if [ -f "$file" ]; then
        count=$(grep -c "SUPABASE" "$file" 2>/dev/null || echo "0")
        echo "$file: $count references"
    fi
done

echo ""
echo "📊 Summary:"
echo "----------"
echo "• Supabase folders: $(find . -type d -name "*supabase*" 2>/dev/null | grep -v node_modules | wc -l)"
echo "• Source files using Supabase: $(find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "supabase" {} \; 2>/dev/null | wc -l)"
echo "• Documentation mentioning Supabase: $(find . -name "*.md" -exec grep -l -i "supabase" {} \; 2>/dev/null | wc -l)"

echo ""
echo "💡 To remove all Supabase references, run:"
echo "   ./remove-all-supabase.sh"
echo ""
echo "⚠️  This will:"
echo "  • Delete supabase/ folder"
echo "  • Delete src/integrations/supabase/"
echo "  • Remove @supabase/supabase-js package"
echo "  • Update all imports to use vercelBackend"
echo "  • Clean environment files"
echo ""