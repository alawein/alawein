#!/usr/bin/env node
/**
 * Verify Lovable.dev Deployment Readiness
 *
 * Checks each platform for:
 * - Required configuration files
 * - Build capability
 * - Lovable.dev compatibility
 *
 * Usage: node scripts/verify-lovable-readiness.mjs
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const PLATFORMS_DIR = 'platforms';

const REQUIRED_FILES = [
  'package.json',
  'vite.config.ts',
  'index.html',
  'tsconfig.json',
  'postcss.config.js',
];

// Files where either .ts or .js extension is acceptable
const FLEXIBLE_FILES = [
  { base: 'tailwind.config', extensions: ['.ts', '.js'] },
];

const LOVABLE_COMPATIBLE_STRUCTURE = [
  'src/components',
  'src/pages',
  'src/lib/utils.ts',
];

const platforms = readdirSync(PLATFORMS_DIR).filter(f => {
  const path = join(PLATFORMS_DIR, f);
  return existsSync(join(path, 'package.json'));
});

console.log('\n🔍 Lovable.dev Deployment Readiness Check\n');
console.log('═'.repeat(60));

let allPassing = true;

for (const platform of platforms) {
  const platformPath = join(PLATFORMS_DIR, platform);
  console.log(`\n📦 ${platform.toUpperCase()}`);
  console.log('─'.repeat(40));

  let platformPassing = true;

  // Check required files
  for (const file of REQUIRED_FILES) {
    const filePath = join(platformPath, file);
    const exists = existsSync(filePath);
    const status = exists ? '✅' : '❌';
    if (!exists) platformPassing = false;
    console.log(`  ${status} ${file}`);
  }

  // Check flexible files (either .ts or .js)
  for (const { base, extensions } of FLEXIBLE_FILES) {
    const foundExt = extensions.find(ext => existsSync(join(platformPath, base + ext)));
    const exists = foundExt !== undefined;
    const status = exists ? '✅' : '❌';
    if (!exists) platformPassing = false;
    console.log(`  ${status} ${base}${foundExt || extensions[0]}${foundExt && foundExt !== extensions[0] ? ' (JS variant)' : ''}`);
  }

  // Check Lovable-compatible structure
  console.log('\n  Lovable.dev Structure:');
  for (const dir of LOVABLE_COMPATIBLE_STRUCTURE) {
    const dirPath = join(platformPath, dir);
    const exists = existsSync(dirPath);
    const status = exists ? '✅' : '⚠️';
    console.log(`  ${status} ${dir}`);
  }

  // Check for components.json (shadcn/ui)
  const componentsJson = join(platformPath, 'components.json');
  const hasComponentsJson = existsSync(componentsJson);
  console.log(`  ${hasComponentsJson ? '✅' : '⚠️'} components.json (shadcn/ui)`);

  // Check vercel.json
  const vercelJson = join(platformPath, 'vercel.json');
  const hasVercelJson = existsSync(vercelJson);
  console.log(`  ${hasVercelJson ? '✅' : '⚠️'} vercel.json`);

  // Check for Capacitor (mobile app)
  const capacitorConfig = join(platformPath, 'capacitor.config.ts');
  const hasCapacitor = existsSync(capacitorConfig);
  if (hasCapacitor) {
    console.log(`  📱 Capacitor configured (mobile app)`);
  }

  // Check for Supabase
  const supabaseDir = join(platformPath, 'supabase');
  const hasSupabase = existsSync(supabaseDir);
  if (hasSupabase) {
    console.log(`  🗄️ Supabase configured`);

    // Check for Edge Functions
    const functionsDir = join(supabaseDir, 'functions');
    if (existsSync(functionsDir)) {
      const functions = readdirSync(functionsDir).filter(f =>
        existsSync(join(functionsDir, f, 'index.ts'))
      );
      console.log(`  ⚡ Edge Functions: ${functions.join(', ') || 'none'}`);
    }
  }

  // Read package.json for scripts
  try {
    const pkg = JSON.parse(readFileSync(join(platformPath, 'package.json'), 'utf-8'));
    const hasDevScript = pkg.scripts?.dev;
    const hasBuildScript = pkg.scripts?.build;
    console.log(`\n  Scripts:`);
    console.log(`  ${hasDevScript ? '✅' : '❌'} npm run dev`);
    console.log(`  ${hasBuildScript ? '✅' : '❌'} npm run build`);
  } catch (e) {
    console.log(`  ❌ Could not read package.json`);
    platformPassing = false;
  }

  // Platform status
  const status = platformPassing ? '✅ READY' : '⚠️ NEEDS ATTENTION';
  console.log(`\n  Status: ${status}`);

  if (!platformPassing) allPassing = false;
}

console.log('\n' + '═'.repeat(60));
console.log(allPassing
  ? '✅ All platforms ready for Lovable.dev deployment!'
  : '⚠️ Some platforms need attention before deployment.'
);
console.log('\nNext Steps:');
console.log('1. Test each platform locally: cd platforms/{name} && npm run dev');
console.log('2. Build each platform: npm run build');
console.log('3. Deploy to Lovable.dev first, then migrate to Vercel');
console.log();

