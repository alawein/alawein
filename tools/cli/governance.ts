#!/usr/bin/env tsx
/**
 * Governance CLI
 * Usage: npm run gov <command>
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';

const CONFIG_PATH = '.metaHub/governance/config.yaml';

interface GovernanceConfig {
  version: string;
  governance: {
    classification: {
      tiers: Record<
        string,
        {
          repos: string[];
          approvals_required: number;
          ci_required: boolean;
          security_scan?: boolean;
        }
      >;
    };
    policies: Record<string, unknown>;
  };
}

function loadConfig(): GovernanceConfig | null {
  if (!existsSync(CONFIG_PATH)) {
    console.error('❌ Governance config not found at', CONFIG_PATH);
    return null;
  }
  return load(readFileSync(CONFIG_PATH, 'utf-8')) as GovernanceConfig;
}

function showStatus() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n🏛️ GOVERNANCE STATUS\n');
  console.log('═'.repeat(60));

  const tiers = config.governance.classification.tiers;
  console.log('\n📊 Classification Tiers:\n');

  for (const [tier, settings] of Object.entries(tiers)) {
    const icon = tier === 'critical' ? '🔴' : tier === 'standard' ? '🟡' : '🟢';
    console.log(`  ${icon} ${tier.toUpperCase()}`);
    console.log(`     Approvals: ${settings.approvals_required}`);
    console.log(`     CI Required: ${settings.ci_required ? 'Yes' : 'No'}`);
    if (settings.security_scan) {
      console.log(`     Security Scan: Yes`);
    }
    console.log(`     Repos: ${settings.repos.join(', ')}`);
    console.log();
  }

  console.log('═'.repeat(60));
  console.log('\n💡 Commands:');
  console.log('   npm run gov status    - Show this status');
  console.log('   npm run gov check .   - Check compliance for path');
  console.log('   npm run gov:scan      - Scan all repositories');
}

function checkCompliance(repoPath: string) {
  console.log(`\n🔍 Checking compliance for: ${repoPath}\n`);
  console.log('─'.repeat(40));

  const checks = [
    { name: 'README.md exists', path: 'README.md' },
    { name: 'LICENSE exists', path: 'LICENSE' },
    { name: 'SECURITY.md exists', path: 'SECURITY.md' },
    { name: 'package.json exists', path: 'package.json' },
    { name: '.gitignore exists', path: '.gitignore' },
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    const exists = existsSync(join(repoPath, check.path));
    if (exists) {
      console.log(`  ✅ ${check.name}`);
      passed++;
    } else {
      console.log(`  ❌ ${check.name}`);
      failed++;
    }
  }

  console.log('─'.repeat(40));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('✅ Repository is compliant!');
  } else {
    console.log('⚠️  Repository has compliance issues');
  }
}

function listTiers() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n📋 Repository Tiers:\n');
  const tiers = config.governance.classification.tiers;

  for (const [tier, settings] of Object.entries(tiers)) {
    console.log(`${tier}:`);
    for (const repo of settings.repos) {
      console.log(`  - ${repo}`);
    }
  }
}

function showHelp() {
  console.log(`
🏛️ Governance CLI

Usage:
  npm run gov status       Show governance status
  npm run gov check <path> Check compliance for a path
  npm run gov tiers        List repository tiers
  npm run gov:scan         Scan all repositories

Configuration: ${CONFIG_PATH}
`);
}

// CLI
const [, , cmd, ...args] = process.argv;
switch (cmd) {
  case 'status':
    showStatus();
    break;
  case 'check':
    checkCompliance(args[0] || '.');
    break;
  case 'tiers':
    listTiers();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showHelp();
}
