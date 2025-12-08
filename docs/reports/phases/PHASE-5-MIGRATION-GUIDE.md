# Phase 5: Utils Package Migration Guide

**Purpose**: Migrate all projects from local utility functions to shared `@alawein/utils` package

---

## Migration Steps

### Step 1: Install the Package

The package is already available in the monorepo workspace. No installation needed.

### Step 2: Update Imports

Replace local utility imports with shared package imports:

#### Before:
```typescript
// Local imports
import { cn } from '../lib/utils'
import { cn } from '../../lib/utils'
import { cn } from './utils/cn'
```

#### After:
```typescript
// Shared package import
import { cn } from '@alawein/utils'
```

---

## Projects to Update

### 1. REPZ (organizations/repz-llc/apps/repz)
**File**: `src/lib/utils.ts`
- Contains: `cn()` function
- **Action**: Delete file, update all imports

**Affected files** (estimated 50+ files):
- All component files importing from `../lib/utils`
- All feature files importing from `../../lib/utils`

### 2. SimCore (organizations/alawein-technologies-llc/mobile-apps/simcore)
**Files**: 
- `src/lib/utils.ts` - Contains `cn()`
- `src/lib/performance-optimization.ts` - Contains `debounce()`, `throttle()`

**Action**: Delete files, update all imports

### 3. QMLab (organizations/alawein-technologies-llc/saas/qmlab)
**Files**:
- `src/lib/utils.ts` - Contains `cn()`
- `src/lib/i18n.ts` - Contains `formatDate()`

**Action**: Keep i18n.ts (has other functions), remove `formatDate()`, update imports

### 4. LLMWorks (organizations/alawein-technologies-llc/saas/llmworks)
**File**: `src/lib/utils.ts`
- Contains: `cn()` function
- **Action**: Delete file, update all imports

### 5. Attributa (organizations/alawein-technologies-llc/saas/attributa)
**File**: `src/lib/utils.ts`
- Contains: `cn()` function
- **Action**: Delete file, update all imports

### 6. LiveIt Iconic (organizations/live-it-iconic-llc/ecommerce/liveiticonic)
**Files**:
- `src/lib/utils.ts` - Contains `cn()`
- `src/lib/currency.ts` - Contains `formatCurrency()`

**Action**: Delete files, update all imports

### 7. Foundry (organizations/alawein-technologies-llc/incubator/foundry)
**File**: `utils/cn.ts`
- Contains: `cn()` function
- **Action**: Delete file, update all imports

---

## Automated Migration Script

```typescript
// scripts/migrate-to-utils-package.ts

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs'
import { glob } from 'glob'

const projects = [
  'organizations/repz-llc/apps/repz',
  'organizations/alawein-technologies-llc/mobile-apps/simcore',
  'organizations/alawein-technologies-llc/saas/qmlab',
  'organizations/alawein-technologies-llc/saas/llmworks',
  'organizations/alawein-technologies-llc/saas/attributa',
  'organizations/live-it-iconic-llc/ecommerce/liveiticonic',
  'organizations/alawein-technologies-llc/incubator/foundry',
]

const importPatterns = [
  /from ['"]\.\.\/lib\/utils['"]/g,
  /from ['"]\.\.\/\.\.\/lib\/utils['"]/g,
  /from ['"]\.\/utils\/cn['"]/g,
  /from ['"]\.\/lib\/utils['"]/g,
  /from ['"]\.\.\/lib\/performance-optimization['"]/g,
  /from ['"]\.\.\/lib\/currency['"]/g,
]

async function migrateProject(projectPath: string) {
  console.log(`\n📦 Migrating ${projectPath}...`)
  
  // Find all TypeScript/TSX files
  const files = await glob(`${projectPath}/**/*.{ts,tsx}`, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/_graveyard/**']
  })
  
  let updatedCount = 0
  
  for (const file of files) {
    let content = readFileSync(file, 'utf-8')
    let modified = false
    
    // Replace import patterns
    for (const pattern of importPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, `from '@alawein/utils'`)
        modified = true
      }
    }
    
    if (modified) {
      writeFileSync(file, content, 'utf-8')
      updatedCount++
    }
  }
  
  console.log(`✅ Updated ${updatedCount} files`)
  
  // Delete old utility files
  const filesToDelete = [
    `${projectPath}/src/lib/utils.ts`,
    `${projectPath}/src/lib/performance-optimization.ts`,
    `${projectPath}/src/lib/currency.ts`,
    `${projectPath}/utils/cn.ts`,
  ]
  
  for (const file of filesToDelete) {
    if (existsSync(file)) {
      unlinkSync(file)
      console.log(`🗑️  Deleted ${file}`)
    }
  }
}

async function main() {
  console.log('🚀 Starting migration to @alawein/utils...\n')
  
  for (const project of projects) {
    await migrateProject(project)
  }
  
  console.log('\n✅ Migration complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Run: npm run type-check')
  console.log('2. Run: npm run lint')
  console.log('3. Run: npm run test')
  console.log('4. Verify all projects build successfully')
}

main().catch(console.error)
```

---

## Manual Migration Steps

If you prefer manual migration:

### For each project:

1. **Find all imports**:
   ```bash
   grep -r "from.*lib/utils" src/
   grep -r "from.*utils/cn" src/
   ```

2. **Replace imports**:
   - Change `from '../lib/utils'` → `from '@alawein/utils'`
   - Change `from '../../lib/utils'` → `from '@alawein/utils'`
   - Change `from './utils/cn'` → `from '@alawein/utils'`

3. **Delete old files**:
   ```bash
   rm src/lib/utils.ts
   rm src/lib/performance-optimization.ts
   rm src/lib/currency.ts
   rm utils/cn.ts
   ```

4. **Verify**:
   ```bash
   npm run type-check
   npm run build
   ```

---

## Expected Results

### Before Migration:
- **8 duplicate utility files** across projects
- **~400 lines** of duplicated code
- **Inconsistent implementations**
- **High maintenance overhead**

### After Migration:
- **1 shared package** (`@alawein/utils`)
- **0 duplicate utility files**
- **~400 lines saved**
- **Single source of truth**
- **Easy to maintain and update**

---

## Verification Checklist

After migration, verify:

- [ ] All projects build successfully
- [ ] No TypeScript errors
- [ ] No import errors
- [ ] All tests pass
- [ ] No duplicate utility files remain
- [ ] All imports use `@alawein/utils`

---

## Rollback Plan

If issues arise:

1. Revert the changes:
   ```bash
   git checkout -- .
   ```

2. Or restore individual files from git history

3. Report issues for investigation

---

## Benefits

1. **Code Reduction**: ~400 lines of duplicate code eliminated
2. **Consistency**: Same implementation everywhere
3. **Maintainability**: Update once, apply everywhere
4. **Type Safety**: Shared types across all projects
5. **Documentation**: Comprehensive JSDoc comments
6. **Testing**: Test once, trust everywhere

---

**Status**: Ready for execution  
**Estimated Time**: 15-20 minutes  
**Risk**: Low (can be easily reverted)
