#!/usr/bin/env tsx
/**
 * Smart test selector
 * Usage: npm run smart-test
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

function getChangedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only HEAD~1 2>nul', { encoding: 'utf-8' });
    return output
      .trim()
      .split('\n')
      .filter((f) => f);
  } catch {
    return [];
  }
}

function findAffectedTests(changedFiles: string[]): string[] {
  const testPatterns = ['.test.ts', '.test.tsx', '.spec.ts', '.spec.tsx'];
  const affectedTests: string[] = [];

  changedFiles.forEach((file) => {
    if (testPatterns.some((p) => file.endsWith(p))) {
      affectedTests.push(file);
      return;
    }

    const baseName = file.replace(/\.(ts|tsx|js|jsx)$/, '');
    testPatterns.forEach((pattern) => {
      const testFile = `${baseName}${pattern}`;
      if (existsSync(testFile)) {
        affectedTests.push(testFile);
      }
    });
  });

  return [...new Set(affectedTests)];
}

function showAffected() {
  console.log('\n🧪 SMART TEST SELECTION\n');
  console.log('═'.repeat(60));

  const changed = getChangedFiles();
  console.log(`\n📝 Changed Files: ${changed.length}`);
  changed.slice(0, 10).forEach((f) => console.log(`   - ${f}`));
  if (changed.length > 10) console.log(`   ... and ${changed.length - 10} more`);

  const affected = findAffectedTests(changed);
  console.log(`\n🎯 Affected Tests: ${affected.length}`);
  affected.forEach((f) => console.log(`   - ${f}`));

  if (affected.length === 0) {
    console.log('\n💡 No specific tests affected. Consider running full suite.');
  } else {
    console.log(`\n🚀 Run affected tests:`);
    console.log(`   npx vitest ${affected.join(' ')}`);
  }
}

function showCoverage() {
  console.log('\n📊 TEST COVERAGE STATUS\n');
  console.log('═'.repeat(50));

  if (existsSync('coverage/coverage-summary.json')) {
    const summary = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf-8'));
    const total = summary.total;

    const formatPct = (pct: number) => {
      const icon = pct >= 80 ? '✅' : pct >= 60 ? '🟡' : '❌';
      return `${icon} ${pct.toFixed(1)}%`;
    };

    console.log(`   Lines:      ${formatPct(total.lines.pct)}`);
    console.log(`   Statements: ${formatPct(total.statements.pct)}`);
    console.log(`   Functions:  ${formatPct(total.functions.pct)}`);
    console.log(`   Branches:   ${formatPct(total.branches.pct)}`);
  } else {
    console.log('   No coverage data found.');
    console.log('   Run: npm run test:coverage');
  }
}

function showHelp() {
  console.log(`
🧪 Smart Testing Tool

Usage:
  npm run smart-test              Show affected tests
  npm run smart-test affected     Show affected tests
  npm run smart-test coverage     Show coverage status

Configuration: .metaHub/smart-testing/config.yaml
`);
}

const [, , cmd] = process.argv;
switch (cmd) {
  case 'affected':
    showAffected();
    break;
  case 'coverage':
    showCoverage();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showAffected();
}
