#!/usr/bin/env tsx
/**
 * Legal policy checker
 * Usage: npm run legal:check
 */
import { existsSync, readFileSync } from 'fs';

const REQUIRED_POLICIES = [
  { path: 'docs/legal/PRIVACY-POLICY-TEMPLATE.md', name: 'Privacy Policy' },
  { path: 'docs/legal/TERMS-OF-SERVICE-TEMPLATE.md', name: 'Terms of Service' },
  { path: 'docs/legal/IP-GUIDELINES.md', name: 'IP Guidelines' },
  { path: '.metaHub/legal/config.yaml', name: 'Legal Config' },
];

const RECOMMENDED_POLICIES = [
  { path: 'docs/legal/COOKIE-POLICY.md', name: 'Cookie Policy' },
  { path: 'docs/legal/ACCEPTABLE-USE.md', name: 'Acceptable Use Policy' },
  { path: 'docs/legal/DMCA-POLICY.md', name: 'DMCA Policy' },
];

interface PolicyCheck {
  name: string;
  path: string;
  exists: boolean;
  hasPlaceholders: boolean;
  lastUpdated?: string;
}

function checkPolicy(path: string, name: string): PolicyCheck {
  const exists = existsSync(path);
  let hasPlaceholders = false;
  let lastUpdated: string | undefined;

  if (exists) {
    const content = readFileSync(path, 'utf-8');
    hasPlaceholders =
      content.includes('[DATE]') || content.includes('[COMPANY_NAME]') || content.includes('[PRODUCT_NAME]');

    const dateMatch = content.match(/Last Updated[:\s]*(\d{4}-\d{2}-\d{2}|\w+ \d{4})/i);
    if (dateMatch) {
      lastUpdated = dateMatch[1];
    }
  }

  return { name, path, exists, hasPlaceholders, lastUpdated };
}

function printResults(checks: PolicyCheck[], title: string, required: boolean) {
  console.log(`\n${title}\n`);
  console.log('─'.repeat(60));

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    const icon = check.exists ? '✅' : required ? '❌' : '⚠️';
    console.log(`${icon} ${check.name}`);
    console.log(`   Path: ${check.path}`);

    if (check.exists) {
      passed++;
      if (check.hasPlaceholders) {
        console.log(`   ⚠️  Contains placeholders - needs customization`);
      }
      if (check.lastUpdated) {
        console.log(`   📅 Last Updated: ${check.lastUpdated}`);
      }
    } else {
      failed++;
      console.log(`   Status: Missing`);
    }
  }

  return { passed, failed };
}

function main() {
  console.log('\n⚖️ LEGAL POLICY CHECK\n');
  console.log('═'.repeat(60));

  const requiredChecks = REQUIRED_POLICIES.map((p) => checkPolicy(p.path, p.name));
  const recommendedChecks = RECOMMENDED_POLICIES.map((p) => checkPolicy(p.path, p.name));

  const required = printResults(requiredChecks, '📋 REQUIRED POLICIES', true);
  const recommended = printResults(recommendedChecks, '📋 RECOMMENDED POLICIES', false);

  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 SUMMARY\n');
  console.log(`   Required: ${required.passed}/${REQUIRED_POLICIES.length} present`);
  console.log(`   Recommended: ${recommended.passed}/${RECOMMENDED_POLICIES.length} present`);

  if (required.failed > 0) {
    console.log('\n❌ Missing required policies! Please create them before launch.');
    process.exit(1);
  } else {
    console.log('\n✅ All required policies present!');
  }

  const withPlaceholders = [...requiredChecks, ...recommendedChecks].filter((c) => c.hasPlaceholders);
  if (withPlaceholders.length > 0) {
    console.log('\n⚠️  Policies with placeholders (need customization):');
    withPlaceholders.forEach((p) => console.log(`   - ${p.name}`));
  }
}

main();
