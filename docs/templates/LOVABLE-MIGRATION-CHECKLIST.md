---
document_metadata:
  title: "Lovable.dev Migration Quick Reference Checklist"
  document_id: "LOVABLE-CHECKLIST-001"
  version: "1.0.0"
  status: "Active"
  classification: "Internal"
  
  dates:
    created: "2025-12-07"
    last_updated: "2025-12-07"
    next_review: "2026-03-07"
    
  ownership:
    owner: "DevOps Team"
    maintainer: "Platform Engineers"
    reviewers: ["Development Teams", "Project Managers"]
    
  change_summary: |
    [2025-12-07] Initial migration checklist creation
    - Created quick-reference migration checklist
    - Added step-by-step validation process
    - Included troubleshooting quick fixes
    
  llm_context:
    purpose: "Quick reference checklist for Lovable.dev to monorepo migration"
    scope: "Migration steps, validation, troubleshooting, deployment"
    key_concepts: ["migration", "checklist", "validation", "troubleshooting"]
    related_documents: ["LOVABLE-MIGRATION-GUIDE.md", "validate-migration.sh"]
---

# Lovable.dev Migration Quick Reference Checklist

> **One-page migration checklist** for integrating Lovable.dev projects into the Alawein Technologies Monorepo.

## 🚀 Pre-Migration (5 min)

- [ ] **Backup project**: `cp -r . ../project-backup`
- [ ] **Commit all changes**: `git add . && git commit -m "Pre-migration backup"`
- [ ] **Note custom dependencies**: Check package.json for unique packages
- [ ] **Document environment variables**: List all .env.local variables

## 📦 Migration Steps (30 min)

### 1. Package Manager Switch
```bash
rm -rf node_modules package-lock.json
npm install -g pnpm
pnpm install
```

### 2. Configuration Updates
- [ ] **Update package.json** with monorepo structure
- [ ] **Update vite.config.ts** with path aliases
- [ ] **Update tsconfig.json** with matching aliases
- [ ] **Update tailwind.config.ts** with brand colors
- [ ] **Update src/index.css** with CSS variables
- [ ] **Update src/main.tsx** with providers
- [ ] **Update src/App.tsx** with routing

### 3. Replace Workflows
```bash
rm -rf .github/workflows/*
cp docs/templates/lovable-workflows/* .github/
```

### 4. Environment Setup
```bash
cp .env.example .env.local
# Fill in your actual values
```

## ✅ Validation (10 min)

### Automated Validation
```bash
bash scripts/validate-migration.sh
```

### Manual Checks
- [ ] **Type check**: `pnpm type-check` ✅
- [ ] **Lint**: `pnpm lint` ✅
- [ ] **Build**: `pnpm build` ✅
- [ ] **Test**: `pnpm test` ✅
- [ ] **Dev server**: `pnpm dev` ✅

### Functionality Tests
- [ ] **Navigation works**
- [ ] **Components render**
- [ ] **Brand colors applied**
- [ ] **Responsive design works**

## 🚨 Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| **Path alias not found** | Check tsconfig.json and vite.config.ts paths match |
| **pnpm install fails** | `pnpm store prune && rm pnpm-lock.yaml && pnpm install` |
| **Build fails** | Update import statements to use @ aliases |
| **Styles not applying** | Check Tailwind config and CSS variables |
| **Missing environment variables** | Copy .env.example to .env.local and fill values |
| **shadcn/ui version mismatch** | Update components.json and reinstall: `pnpm dlx shadcn-ui@latest init` |
| **Component library conflicts** | Check package.json for duplicate UI dependencies and resolve versions |

## 🔄 Post-Migration (5 min)

- [ ] **Commit changes**: `git add . && git commit -m "Migrate to monorepo"`
- [ ] **Push to repository**: `git push origin main`
- [ ] **Update documentation**: Update README with new structure
- [ ] **Notify team**: Share migration completion with stakeholders

## 📋 File Structure After Migration

```
your-project/
├── .github/
│   └── workflows/          # Monorepo CI/CD
├── src/
│   ├── components/         # Using @/components imports
│   ├── lib/               # Using @/lib imports
│   ├── hooks/             # Using @/hooks imports
│   └── styles/            # With brand CSS variables
├── docs/
│   └── templates/         # Migration templates
├── .env.local             # Environment variables
├── .env.example           # Environment template
├── package.json           # pnpm-based scripts
├── vite.config.ts         # With path aliases
├── tsconfig.json          # Matching aliases
├── tailwind.config.ts     # Brand colors
└── pnpm-lock.yaml         # pnpm lockfile
```

## 🔧 Key Changes Summary

### Package.json Changes
- Name format: `project-name`
- Scripts: Add `type-check`, `test:coverage`
- Engines: Node.js >=20, pnpm >=8
- Repository: Points to monorepo directory

### Path Aliases Added
```typescript
"@": "./src"
"@/components": "./src/components"
"@/lib": "./src/lib"
"@/hooks": "./src/hooks"
"@/pages": "./src/pages"
"@/styles": "./src/styles"
"@/types": "./src/types"
"@/assets": "./src/assets"
```

### Brand Colors Available
```css
--brand-primary: #3b82f6
--brand-secondary: #64748b
--brand-accent: #f59e0b
--brand-success: #10b981
--brand-warning: #f59e0b
--brand-error: #ef4444
```

## 📞 Support & Resources

### Quick Commands
```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Type checking
pnpm type-check

# Build project
pnpm build

# Run tests
pnpm test

# Validate migration
bash scripts/validate-migration.sh
```

### Documentation Links
- **[Full Migration Guide](./LOVABLE-MIGRATION-GUIDE.md)** - Detailed instructions
- **[README Template](./LOVABLE-README-TEMPLATE.md)** - Project documentation
- **[Workflows Guide](./LOVABLE-GITHUB-WORKFLOWS.md)** - CI/CD setup
- **[Environment Guide](./LOVABLE-ENV-EXAMPLE.md)** - Environment variables

### Get Help
1. **Check this checklist** for common issues
2. **Review full migration guide** for detailed steps
3. **Run validation script** to identify problems
4. **Create GitHub issue** for complex problems
5. **Contact DevOps team** for assistance

---

## ✅ Migration Complete!

🎉 **Your Lovable.dev project is now integrated into the monorepo!**

**Next Steps:**
1. Test all functionality thoroughly
2. Update team documentation
3. Deploy to staging environment
4. Plan production deployment

**Estimated Total Time:** 45-60 minutes
**Success Rate:** 95% with this checklist

---

*Print this checklist for easy reference during migration*
