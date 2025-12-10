#!/usr/bin/env tsx
/**
 * Integration manager
 * Usage: npm run integrations
 */
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const CONFIG = '.metaHub/integrations/config.yaml';

interface Service {
  enabled: boolean;
  features: string[];
}

function loadConfig() {
  if (!existsSync(CONFIG)) return null;
  return load(readFileSync(CONFIG, 'utf-8')) as any;
}

function showStatus() {
  console.log('\n🔗 INTEGRATION STATUS\n');
  console.log('═'.repeat(60));

  const config = loadConfig();
  if (!config) {
    console.log('❌ Integration config not found');
    return;
  }

  let enabled = 0;
  let disabled = 0;

  console.log(`\n${'Service'.padEnd(15)} ${'Status'.padEnd(10)} Features`);
  console.log('─'.repeat(60));

  for (const [name, service] of Object.entries(config.integrations.services)) {
    const svc = service as Service;
    const status = svc.enabled ? '✅' : '❌';
    const features = svc.features.slice(0, 3).join(', ');

    if (svc.enabled) enabled++;
    else disabled++;

    console.log(`${name.padEnd(15)} ${status.padEnd(10)} ${features}`);
  }

  console.log('─'.repeat(60));
  console.log(`\n   Enabled: ${enabled}`);
  console.log(`   Disabled: ${disabled}`);

  console.log('\n' + '═'.repeat(60));
}

function showHelp() {
  console.log(`
🔗 Integration Manager

Usage:
  npm run integrations              Show integration status
  npm run integrations:status       Show integration status

Configuration: ${CONFIG}
`);
}

const [, , cmd] = process.argv;
switch (cmd) {
  case 'status':
    showStatus();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showStatus();
}
