#!/usr/bin/env tsx
/**
 * Dependency analyzer
 * Usage: npm run deps:analyze
 */
import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

function getPackageInfo() {
  if (!existsSync('package.json')) return null;
  return JSON.parse(readFileSync('package.json', 'utf-8'));
}

function countDeps(pkg: Record<string, unknown>) {
  const deps = Object.keys(pkg.dependencies || {}).length;
  const devDeps = Object.keys(pkg.devDependencies || {}).length;
  return { deps, devDeps, total: deps + devDeps };
}

function showAnalysis() {
  console.log('\n📦 DEPENDENCY ANALYSIS\n');
  console.log('═'.repeat(50));

  const pkg = getPackageInfo();
  if (!pkg) {
    console.log('❌ No package.json found');
    return;
  }

  const counts = countDeps(pkg);
  console.log(`\n   Dependencies: ${counts.deps}`);
  console.log(`   Dev Dependencies: ${counts.devDeps}`);
  console.log(`   Total: ${counts.total}`);

  console.log('\n' + '═'.repeat(50));
}

function showOutdated() {
  console.log('\n📦 OUTDATED DEPENDENCIES\n');
  console.log('═'.repeat(60));

  try {
    const output = execSync('npm outdated --json 2>nul', { encoding: 'utf-8' });
    const outdated = JSON.parse(output || '{}');
    const packages = Object.entries(outdated);

    if (packages.length === 0) {
      console.log('\n   ✅ All dependencies are up to date!');
    } else {
      console.log(`\n   ⚠️ ${packages.length} outdated packages:\n`);
      packages.slice(0, 10).forEach(([name, info]: [string, any]) => {
        console.log(`   ${name}: ${info.current} → ${info.latest}`);
      });
      if (packages.length > 10) {
        console.log(`   ... and ${packages.length - 10} more`);
      }
    }
  } catch {
    console.log('   Run: npm outdated');
  }

  console.log('\n' + '═'.repeat(60));
}

function showHelp() {
  console.log(`
📦 Dependency Analyzer

Usage:
  npm run deps:analyze           Show dependency analysis
  npm run deps:outdated          Show outdated packages

Configuration: .metaHub/dependencies/config.yaml
`);
}

const [, , cmd] = process.argv;
switch (cmd) {
  case 'outdated':
    showOutdated();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showAnalysis();
}
