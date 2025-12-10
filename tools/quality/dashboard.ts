#!/usr/bin/env tsx
/**
 * Quality metrics dashboard
 * Usage: npm run quality
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

interface QualityMetrics {
  coverage: number;
  lintErrors: number;
  typeErrors: number;
  testsPassing: boolean;
}

function getCoverage(): number {
  try {
    if (existsSync('coverage/coverage-summary.json')) {
      const summary = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf-8'));
      return summary.total?.lines?.pct || 0;
    }
  } catch {
    // Coverage file not available
  }
  return 0;
}

function getLintErrors(): number {
  try {
    execSync('npm run lint 2>&1', { encoding: 'utf-8', stdio: 'pipe' });
    return 0;
  } catch (e: unknown) {
    const error = e as { stdout?: string };
    const output = error.stdout || '';
    const matches = output.match(/(\d+) problems?/);
    return matches ? parseInt(matches[1]) : 1;
  }
}

function getTypeErrors(): number {
  try {
    execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8', stdio: 'pipe' });
    return 0;
  } catch (e: unknown) {
    const error = e as { stdout?: string; stderr?: string };
    const output = (error.stdout || '') + (error.stderr || '');
    return (output.match(/error TS/g) || []).length;
  }
}

function showDashboard() {
  console.log('\n🎯 QUALITY DASHBOARD\n');
  console.log('═'.repeat(50));

  // Coverage
  const coverage = getCoverage();
  const coverageIcon = coverage >= 80 ? '✅' : coverage >= 60 ? '🟡' : '❌';
  const coverageBar = '█'.repeat(Math.floor(coverage / 10)) + '░'.repeat(10 - Math.floor(coverage / 10));
  console.log(`\n📊 Test Coverage`);
  console.log(`   ${coverageIcon} ${coverage.toFixed(1)}% [${coverageBar}]`);
  console.log(`   Target: 80% minimum, 90% ideal`);

  // Lint
  console.log(`\n🔍 Code Quality`);
  console.log(`   Run 'npm run lint' to check for issues`);

  // Type Check
  console.log(`\n📝 Type Safety`);
  console.log(`   Run 'npm run type-check' to verify types`);

  console.log('\n' + '═'.repeat(50));

  // Quality Gates Summary
  console.log('\n📋 QUALITY GATES\n');
  console.log('   Pre-Commit:  lint, type-check, format, secrets');
  console.log('   Pre-Merge:   tests, security, coverage');
  console.log('   Pre-Release: e2e, performance, a11y, QA signoff');

  console.log('\n💡 Run individual checks:');
  console.log('   npm run lint          - Check code style');
  console.log('   npm run type-check    - Check types');
  console.log('   npm run test          - Run tests');
  console.log('   npm run test:coverage - Run with coverage');
}

function showChecklist() {
  console.log('\n📋 RELEASE CHECKLIST\n');
  console.log('═'.repeat(50));

  const checks = [
    {
      category: 'Code Quality',
      items: ['[ ] All lint errors resolved', '[ ] No type errors', '[ ] Code reviewed and approved'],
    },
    {
      category: 'Testing',
      items: [
        '[ ] Unit tests passing',
        '[ ] Integration tests passing',
        '[ ] E2E tests passing',
        '[ ] Coverage >= 80%',
      ],
    },
    {
      category: 'Security',
      items: ['[ ] Security scan clean', '[ ] No critical vulnerabilities', '[ ] Secrets rotated if needed'],
    },
    {
      category: 'Documentation',
      items: ['[ ] CHANGELOG updated', '[ ] README updated if needed', '[ ] API docs updated'],
    },
    {
      category: 'Deployment',
      items: ['[ ] Version bumped', '[ ] Staging tested', '[ ] Rollback plan ready', '[ ] Monitoring configured'],
    },
  ];

  checks.forEach(({ category, items }) => {
    console.log(`\n${category}:`);
    items.forEach((item) => console.log(`  ${item}`));
  });

  console.log('\n' + '═'.repeat(50));
}

function showHelp() {
  console.log(`
🎯 Quality Dashboard

Usage:
  npm run quality              Show quality dashboard
  npm run quality:checklist    Show release checklist
  npm run quality:gate         Run all quality checks

Configuration: .metaHub/quality/config.yaml
`);
}

// CLI
const [, , cmd] = process.argv;
switch (cmd) {
  case 'checklist':
    showChecklist();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showDashboard();
}
