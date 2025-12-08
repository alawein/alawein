#!/usr/bin/env tsx
/**
 * Migration Script: Local Utils → @alawein/utils
 * 
 * Automatically migrates all projects from local utility functions
 * to the shared @alawein/utils package.
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs'
import { glob } from 'glob'
import { resolve } from 'path'

// Projects to migrate
const projects = [
  'organizations/repz-llc/apps/repz',
  'organizations/alawein-technologies-llc/mobile-apps/simcore',
  'organizations/alawein-technologies-llc/saas/qmlab',
  'organizations/alawein-technologies-llc/saas/llmworks',
  'organizations/alawein-technologies-llc/saas/attributa',
  'organizations/live-it-iconic-llc/ecommerce/liveiticonic',
  'organizations/alawein-technologies-llc/incubator/foundry',
]

// Import patterns to replace
const importReplacements = [
  // Relative imports to lib/utils
  { pattern: /from ['"]\.\.\/lib\/utils['"]/g, replacement: `from '@alawein/utils'` },
  { pattern: /from ['"]\.\.\/\.\.\/lib\/utils['"]/g, replacement: `from '@alawein/utils'` },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/lib\/utils['"]/g, replacement: `from '@alawein/utils'` },
  { pattern: /from ['"]\.\/lib\/utils['"]/g, replacement: `from '@alawein/utils'` },
  
  // Performance optimization imports
  { pattern: /from ['"]\.\.\/lib\/performance-optimization['"]/g, replacement: `from '@alawein/utils/performance'` },
  { pattern: /from ['"]\.\.\/\.\.\/lib\/performance-optimization['"]/g, replacement: `from '@alawein/utils/performance'` },
  
  // Currency imports
  { pattern: /from ['"]\.\.\/lib\/currency['"]/g, replacement: `from '@alawein/utils/format'` },
  { pattern: /from ['"]\.\.\/\.\.\/lib\/currency['"]/g, replacement: `from '@alawein/utils/format'` },
  
  // Direct cn imports
  { pattern: /from ['"]\.\/utils\/cn['"]/g, replacement: `from '@alawein/utils/cn'` },
  { pattern: /from ['"]\.\.\/utils\/cn['"]/g, replacement: `from '@alawein/utils/cn'` },
  { pattern: /from ['"]\.\.\/\.\.\/utils\/cn['"]/g, replacement: `from '@alawein/utils/cn'` },
]

interface MigrationStats {
  filesScanned: number
  filesUpdated: number
  importsReplaced: number
  filesDeleted: number
  errors: string[]
}

async function migrateProject(projectPath: string): Promise<MigrationStats> {
  console.log(`\n📦 Migrating ${projectPath}...`)
  
  const stats: MigrationStats = {
    filesScanned: 0,
    filesUpdated: 0,
    importsReplaced: 0,
    filesDeleted: 0,
    errors: []
  }
  
  try {
    // Find all TypeScript/TSX files
    const files = await glob(`${projectPath}/**/*.{ts,tsx}`, {
      ignore: ['**/node_modules/**', '**/dist/**', '**/_graveyard/**', '**/build/**']
    })
    
    stats.filesScanned = files.length
    
    // Update imports in each file
    for (const file of files) {
      try {
        let content = readFileSync(file, 'utf-8')
        let modified = false
        let replacements = 0
        
        // Apply all import replacements
        for (const { pattern, replacement } of importReplacements) {
          const matches = content.match(pattern)
          if (matches) {
            content = content.replace(pattern, replacement)
            modified = true
            replacements += matches.length
          }
        }
        
        if (modified) {
          writeFileSync(file, content, 'utf-8')
          stats.filesUpdated++
          stats.importsReplaced += replacements
          console.log(`  ✓ ${file.replace(projectPath + '/', '')} (${replacements} imports)`)
        }
      } catch (error) {
        stats.errors.push(`Error updating ${file}: ${error}`)
      }
    }
    
    // Delete old utility files
    const filesToDelete = [
      `${projectPath}/src/lib/utils.ts`,
      `${projectPath}/src/lib/performance-optimization.ts`,
      `${projectPath}/src/lib/currency.ts`,
      `${projectPath}/utils/cn.ts`,
    ]
    
    for (const file of filesToDelete) {
      if (existsSync(file)) {
        try {
          unlinkSync(file)
          stats.filesDeleted++
          console.log(`  🗑️  Deleted ${file.replace(projectPath + '/', '')}`)
        } catch (error) {
          stats.errors.push(`Error deleting ${file}: ${error}`)
        }
      }
    }
    
    console.log(`  ✅ Updated ${stats.filesUpdated} files, replaced ${stats.importsReplaced} imports, deleted ${stats.filesDeleted} files`)
    
  } catch (error) {
    stats.errors.push(`Error migrating ${projectPath}: ${error}`)
  }
  
  return stats
}

async function main() {
  console.log('🚀 Starting migration to @alawein/utils...')
  console.log('=' .repeat(60))
  
  const totalStats: MigrationStats = {
    filesScanned: 0,
    filesUpdated: 0,
    importsReplaced: 0,
    filesDeleted: 0,
    errors: []
  }
  
  // Migrate each project
  for (const project of projects) {
    const stats = await migrateProject(project)
    totalStats.filesScanned += stats.filesScanned
    totalStats.filesUpdated += stats.filesUpdated
    totalStats.importsReplaced += stats.importsReplaced
    totalStats.filesDeleted += stats.filesDeleted
    totalStats.errors.push(...stats.errors)
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Migration Summary')
  console.log('='.repeat(60))
  console.log(`Files scanned:      ${totalStats.filesScanned}`)
  console.log(`Files updated:      ${totalStats.filesUpdated}`)
  console.log(`Imports replaced:   ${totalStats.importsReplaced}`)
  console.log(`Files deleted:      ${totalStats.filesDeleted}`)
  console.log(`Errors:             ${totalStats.errors.length}`)
  
  if (totalStats.errors.length > 0) {
    console.log('\n⚠️  Errors encountered:')
    totalStats.errors.forEach(error => console.log(`  - ${error}`))
  }
  
  console.log('\n✅ Migration complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Run: npm run type-check')
  console.log('2. Run: npm run lint')
  console.log('3. Run: npx turbo build')
  console.log('4. Verify all projects build successfully')
  console.log('\n💡 If issues arise, you can revert with: git checkout -- .')
}

// Run migration
main().catch(error => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})
