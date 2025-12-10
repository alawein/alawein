#!/usr/bin/env tsx
/**
 * Cost tracking tool
 * Usage: npm run costs
 */
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const CONFIG = '.metaHub/costs/config.yaml';

interface Service {
  type: string;
  billing: string;
  budget_monthly?: number;
  cost_monthly?: number;
}

function loadConfig() {
  if (!existsSync(CONFIG)) return null;
  return load(readFileSync(CONFIG, 'utf-8')) as any;
}

function showCosts() {
  console.log('\n💰 COST TRACKING\n');
  console.log('═'.repeat(60));

  const config = loadConfig();
  if (!config) {
    console.log('❌ Cost config not found');
    return;
  }

  let totalBudget = 0;
  let totalFixed = 0;

  console.log('\n📊 SERVICE COSTS\n');
  console.log(`${'Service'.padEnd(15)} ${'Type'.padEnd(12)} ${'Billing'.padEnd(12)} Budget/Cost`);
  console.log('─'.repeat(60));

  for (const [name, service] of Object.entries(config.costs.services)) {
    const svc = service as Service;
    const amount = svc.budget_monthly || svc.cost_monthly || 0;
    const amountStr = amount > 0 ? `$${amount}/mo` : 'N/A';

    if (svc.budget_monthly) totalBudget += svc.budget_monthly;
    if (svc.cost_monthly) totalFixed += svc.cost_monthly;

    console.log(`${name.padEnd(15)} ${svc.type.padEnd(12)} ${svc.billing.padEnd(12)} ${amountStr}`);
  }

  console.log('─'.repeat(60));
  console.log(`\n   Total Budget: $${totalBudget}/mo`);
  console.log(`   Fixed Costs: $${totalFixed}/mo`);
  console.log(`   Max Estimated: $${totalBudget + totalFixed}/mo`);

  console.log('\n' + '═'.repeat(60));
}

function showHelp() {
  console.log(`
💰 Cost Tracking Tool

Usage:
  npm run costs              Show cost summary
  npm run costs:report       Generate cost report

Configuration: ${CONFIG}
`);
}

const [, , cmd] = process.argv;
switch (cmd) {
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showCosts();
}
