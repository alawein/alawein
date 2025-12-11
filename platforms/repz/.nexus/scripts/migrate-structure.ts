#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

interface MigrationMap {
  [oldPath: string]: string;
}

const migrationMap: MigrationMap = {
  // UI Components - Group by type
  'src/components/ui': 'src/components/ui',
  'src/components/auth': 'src/components/features/auth',
  'src/components/coach': 'src/components/features/coach',
  'src/components/client': 'src/components/features/client',
  'src/components/nutrition': 'src/components/features/nutrition',
  'src/components/training': 'src/components/features/training',
  'src/components/analytics': 'src/components/features/analytics',
  'src/components/billing': 'src/components/features/billing',
  'src/components/common': 'src/components/shared',
  'src/components/layout': 'src/components/layouts',
  'src/components/forms': 'src/components/shared/forms',

  // Services - Organize by domain
  'src/services/auth': 'src/services/auth',
  'src/services/coach': 'src/services/coach',
  'src/services/client': 'src/services/client',
  'src/services/nutrition': 'src/services/nutrition',
  'src/services/training': 'src/services/training',
  'src/services/billing': 'src/services/billing',
  'src/services/analytics': 'src/services/analytics',
  'src/services/notifications': 'src/services/notifications',

  // Hooks - Keep as is but ensure consistent naming
  'src/hooks': 'src/hooks',

  // Types - Organize by domain
  'src/types/auth': 'src/types/auth',
  'src/types/coach': 'src/types/coach',
  'src/types/client': 'src/types/client',
  'src/types/nutrition': 'src/types/nutrition',
  'src/types/training': 'src/types/training',
  'src/types/billing': 'src/types/billing',
  'src/types/api': 'src/types/api',

  // Constants - Move to config
  'src/constants/tiers.ts': 'src/config/tiers.ts',
  'src/constants/routes.ts': 'src/config/routes.ts',
  'src/constants/trainingTemplates.ts': 'src/config/trainingTemplates.ts',
  'src/constants/mealTemplates.ts': 'src/config/mealTemplates.ts',
  'src/constants/index.ts': 'src/config/index.ts',

  // Contexts - Keep as is
  'src/contexts': 'src/contexts',

  // Utils - Rename to lib for consistency
  'src/utils': 'src/lib/utils',
  'src/helpers': 'src/lib/helpers',
};

async function migrateStructure() {
  console.log('🚀 Starting REPZ folder structure migration...\n');

  // Create backup
  const backupDir = `backup-${Date.now()}`;
  console.log(`📦 Creating backup in ${backupDir}...`);
  execSync(`cp -r . ../${backupDir}`, { stdio: 'inherit' });

  // Create new directory structure
  console.log('\n📁 Creating new directory structure...');
  const newDirs = [
    'src/components/ui',
    'src/components/features',
    'src/components/features/auth',
    'src/components/features/coach',
    'src/components/features/client',
    'src/components/features/nutrition',
    'src/components/features/training',
    'src/components/features/analytics',
    'src/components/features/billing',
    'src/components/shared',
    'src/components/shared/forms',
    'src/components/layouts',
    'src/services/auth',
    'src/services/coach',
    'src/services/client',
    'src/services/nutrition',
    'src/services/training',
    'src/services/billing',
    'src/services/analytics',
    'src/services/notifications',
    'src/types/auth',
    'src/types/coach',
    'src/types/client',
    'src/types/nutrition',
    'src/types/training',
    'src/types/billing',
    'src/types/api',
    'src/config',
    'src/lib/utils',
    'src/lib/helpers',
  ];

  for (const dir of newDirs) {
    await fs.ensureDir(dir);
  }

  // Move files according to migration map
  console.log('\n🔄 Moving files...');
  for (const [oldPath, newPath] of Object.entries(migrationMap)) {
    if (await fs.pathExists(oldPath)) {
      console.log(`  Moving ${oldPath} → ${newPath}`);
      await fs.move(oldPath, newPath);
    }
  }

  // Update import paths
  console.log('\n📝 Updating import paths...');
  await updateImportPaths();

  // Update tsconfig.json paths
  console.log('\n⚙️ Updating TypeScript configuration...');
  await updateTsConfig();

  // Update package.json scripts
  console.log('\n📦 Updating package.json scripts...');
  await updatePackageJson();

  console.log('\n✅ Migration completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('  1. Run `npm install` to ensure dependencies');
  console.log('  2. Run `npm run type-check` to verify no broken imports');
  console.log('  3. Run `npm run test` to ensure all tests pass');
  console.log('  4. Commit changes with git');
}

async function updateImportPaths() {
  const files = await getAllTsFiles('src');

  for (const file of files) {
    let content = await fs.readFile(file, 'utf-8');

    // Update component imports
    content = content.replace(
      /from ['"]\.\.\/components\/auth\/([^'"]+)['"]/g,
      'from "../components/features/auth/$1"'
    );
    content = content.replace(
      /from ['"]\.\.\/components\/coach\/([^'"]+)['"]/g,
      'from "../components/features/coach/$1"'
    );
    content = content.replace(
      /from ['"]\.\.\/components\/client\/([^'"]+)['"]/g,
      'from "../components/features/client/$1"'
    );
    content = content.replace(
      /from ['"]\.\.\/components\/nutrition\/([^'"]+)['"]/g,
      'from "../components/features/nutrition/$1"'
    );
    content = content.replace(
      /from ['"]\.\.\/components\/training\/([^'"]+)['"]/g,
      'from "../components/features/training/$1"'
    );
    content = content.replace(
      /from ['"]\.\.\/components\/billing\/([^'"]+)['"]/g,
      'from "../components/features/billing/$1"'
    );
    content = content.replace(
      /from ['"]\.\.\/components\/common\/([^'"]+)['"]/g,
      'from "../components/shared/$1"'
    );
    content = content.replace(
      /from ['"]\.\.\/components\/layout\/([^'"]+)['"]/g,
      'from "../components/layouts/$1"'
    );

    // Update utils imports
    content = content.replace(
      /from ['"]\.\.\/utils\/([^'"]+)['"]/g,
      'from "../lib/utils/$1"'
    );

    // Update constants imports
    content = content.replace(
      /from ['"]\.\.\/constants\/([^'"]+)['"]/g,
      'from "../config/$1"'
    );

    await fs.writeFile(file, content);
  }
}

async function updateTsConfig() {
  const tsConfigPath = 'tsconfig.json';
  const tsConfig = await fs.readJson(tsConfigPath);

  tsConfig.compilerOptions.paths = {
    '@/*': ['./src/*'],
    '@/components/*': ['./src/components/*'],
    '@/features/*': ['./src/components/features/*'],
    '@/shared/*': ['./src/components/shared/*'],
    '@/layouts/*': ['./src/components/layouts/*'],
    '@/services/*': ['./src/services/*'],
    '@/hooks/*': ['./src/hooks/*'],
    '@/types/*': ['./src/types/*'],
    '@/config/*': ['./src/config/*'],
    '@/lib/*': ['./src/lib/*'],
  };

  await fs.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
}

async function updatePackageJson() {
  const packageJsonPath = 'package.json';
  const packageJson = await fs.readJson(packageJsonPath);

  // Add new scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'migrate:structure': 'node .nexus/scripts/migrate-structure.js',
    'dev:supabase': 'supabase start && npm run dev',
    'db:reset': 'supabase db reset',
    'db:push': 'supabase db push',
    'functions:serve': 'supabase functions serve',
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function getAllTsFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const items = await fs.readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      files.push(...await getAllTsFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Run migration
if (require.main === module) {
  migrateStructure().catch(console.error);
}

export { migrateStructure };
