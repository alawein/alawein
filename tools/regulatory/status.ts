#!/usr/bin/env tsx
/**
 * Regulatory compliance status checker
 * Usage: npm run regulatory
 */
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const REG_CONFIG = '.metaHub/regulatory/config.yaml';

interface Framework {
  applicable_to: string[];
  requirements?: string[];
  status: string;
  last_audit?: string;
  next_audit?: string;
  note?: string;
}

interface RegulatoryConfig {
  regulatory: {
    frameworks: Record<string, Framework>;
    policies: {
      review_schedule: string;
    };
    contacts: Record<string, string>;
  };
}

function loadConfig(): RegulatoryConfig | null {
  if (!existsSync(REG_CONFIG)) {
    console.error('❌ Regulatory config not found at', REG_CONFIG);
    return null;
  }
  return load(readFileSync(REG_CONFIG, 'utf-8')) as RegulatoryConfig;
}

function showStatus() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n📜 REGULATORY COMPLIANCE STATUS\n');
  console.log('═'.repeat(70));

  for (const [name, framework] of Object.entries(config.regulatory.frameworks)) {
    const icon = framework.status === 'compliant' ? '✅' : framework.status === 'not_applicable' ? '⚪' : '❌';

    console.log(`\n${icon} ${name.toUpperCase()}`);
    console.log(`   Status: ${framework.status.replace('_', ' ')}`);

    if (framework.applicable_to.length > 0) {
      console.log(`   Applies to: ${framework.applicable_to.join(', ')}`);
    } else {
      console.log(`   Applies to: N/A`);
    }

    if (framework.last_audit) {
      console.log(`   Last Audit: ${framework.last_audit}`);
    }

    if (framework.next_audit) {
      console.log(`   Next Audit: ${framework.next_audit}`);
    }

    if (framework.requirements && framework.requirements.length > 0) {
      console.log(`   Requirements: ${framework.requirements.length} tracked`);
    }

    if (framework.note) {
      console.log(`   Note: ${framework.note}`);
    }
  }

  console.log('\n' + '═'.repeat(70));

  // Summary
  const frameworks = Object.values(config.regulatory.frameworks);
  const compliant = frameworks.filter((f) => f.status === 'compliant').length;
  const notApplicable = frameworks.filter((f) => f.status === 'not_applicable').length;
  const nonCompliant = frameworks.length - compliant - notApplicable;

  console.log('\n📊 SUMMARY\n');
  console.log(`   ✅ Compliant: ${compliant}`);
  console.log(`   ⚪ Not Applicable: ${notApplicable}`);
  if (nonCompliant > 0) {
    console.log(`   ❌ Non-Compliant: ${nonCompliant}`);
  }

  console.log(`\n📅 Review Schedule: ${config.regulatory.policies.review_schedule}`);
}

function showRequirements(framework: string) {
  const config = loadConfig();
  if (!config) return;

  const f = config.regulatory.frameworks[framework.toLowerCase()];

  if (!f) {
    console.log(`❌ Framework '${framework}' not found`);
    console.log(`   Available: ${Object.keys(config.regulatory.frameworks).join(', ')}`);
    return;
  }

  console.log(`\n📋 ${framework.toUpperCase()} REQUIREMENTS\n`);
  console.log('─'.repeat(50));

  if (f.requirements && f.requirements.length > 0) {
    f.requirements.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.replace(/_/g, ' ')}`);
    });
  } else {
    console.log('  No specific requirements tracked');
  }

  if (f.note) {
    console.log(`\n  Note: ${f.note}`);
  }
}

function showHelp() {
  console.log(`
📜 Regulatory Compliance Tool

Usage:
  npm run regulatory                      Show compliance status
  npm run regulatory:status               Show compliance status
  npm run regulatory:requirements <name>  Show framework requirements

Examples:
  npm run regulatory:requirements gdpr
  npm run regulatory:requirements ccpa

Configuration: ${REG_CONFIG}
`);
}

// CLI
const [, , cmd, ...args] = process.argv;
switch (cmd) {
  case 'status':
  case undefined:
    showStatus();
    break;
  case 'requirements':
    showRequirements(args[0] || 'gdpr');
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showHelp();
}
