#!/usr/bin/env tsx
/**
 * Vendor status checker
 * Usage: npm run vendors <command>
 */
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const VENDOR_REGISTRY = '.metaHub/vendors/registry.yaml';

interface Vendor {
  name: string;
  category: string;
  sla: string;
  products_using: string[];
  backup_vendor?: string | null;
  status_page?: string;
  data_processing?: boolean;
  gdpr_compliant?: boolean;
  pci_compliant?: boolean;
}

interface VendorConfig {
  version: string;
  vendors: {
    critical: Vendor[];
    standard: Vendor[];
    development?: Vendor[];
  };
}

function loadConfig(): VendorConfig | null {
  if (!existsSync(VENDOR_REGISTRY)) {
    console.error('❌ Vendor registry not found at', VENDOR_REGISTRY);
    return null;
  }
  return load(readFileSync(VENDOR_REGISTRY, 'utf-8')) as VendorConfig;
}

function showVendors() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n🤝 VENDOR REGISTRY\n');
  console.log('═'.repeat(70));

  const printVendors = (vendors: Vendor[], tier: string, icon: string) => {
    console.log(`\n${icon} ${tier.toUpperCase()} VENDORS:\n`);
    console.log(`${'Name'.padEnd(15)} ${'Category'.padEnd(15)} ${'SLA'.padEnd(8)} ${'Backup'.padEnd(12)} Products`);
    console.log('─'.repeat(70));

    vendors.forEach((v) => {
      const backup = v.backup_vendor || '—';
      const products = v.products_using.slice(0, 3).join(', ') + (v.products_using.length > 3 ? '...' : '');
      console.log(`${v.name.padEnd(15)} ${v.category.padEnd(15)} ${v.sla.padEnd(8)} ${backup.padEnd(12)} ${products}`);
    });
  };

  printVendors(config.vendors.critical, 'Critical', '🔴');
  printVendors(config.vendors.standard, 'Standard', '🟡');
  if (config.vendors.development) {
    printVendors(config.vendors.development, 'Development', '🟢');
  }

  console.log('\n' + '═'.repeat(70));

  // Summary
  const total =
    config.vendors.critical.length + config.vendors.standard.length + (config.vendors.development?.length || 0);
  console.log(`\n📊 Total Vendors: ${total}`);
  console.log(`   Critical: ${config.vendors.critical.length}`);
  console.log(`   Standard: ${config.vendors.standard.length}`);
}

function showStatusPages() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n📊 VENDOR STATUS PAGES\n');
  console.log('═'.repeat(70));

  const allVendors = [...config.vendors.critical, ...config.vendors.standard, ...(config.vendors.development || [])];

  allVendors
    .filter((v) => v.status_page)
    .forEach((v) => {
      console.log(`${v.name.padEnd(15)} → ${v.status_page}`);
    });

  console.log('\n💡 Tip: Bookmark these pages for quick status checks during incidents.');
}

function showCompliance() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n🔒 VENDOR COMPLIANCE STATUS\n');
  console.log('═'.repeat(50));

  const allVendors = [...config.vendors.critical, ...config.vendors.standard];

  console.log('\nData Processing (GDPR):');
  allVendors
    .filter((v) => v.data_processing)
    .forEach((v) => {
      const status = v.gdpr_compliant ? '✅' : '⚠️';
      console.log(`   ${status} ${v.name}: ${v.gdpr_compliant ? 'Compliant' : 'Review Required'}`);
    });

  console.log('\nPayment Processing (PCI):');
  allVendors
    .filter((v) => v.pci_compliant !== undefined)
    .forEach((v) => {
      const status = v.pci_compliant ? '✅' : '⚠️';
      console.log(`   ${status} ${v.name}: ${v.pci_compliant ? 'Compliant' : 'Review Required'}`);
    });
}

function showHelp() {
  console.log(`
🤝 Vendor Management Tool

Usage:
  npm run vendors list       List all vendors
  npm run vendors status     Show status page URLs
  npm run vendors compliance Show compliance status

Configuration: ${VENDOR_REGISTRY}
`);
}

// CLI
const [, , cmd] = process.argv;
switch (cmd) {
  case 'list':
    showVendors();
    break;
  case 'status':
    showStatusPages();
    break;
  case 'compliance':
    showCompliance();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showHelp();
}
