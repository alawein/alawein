#!/usr/bin/env tsx
/**
 * AI Ethics review tool
 * Usage: npm run ethics
 */
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const ETHICS_CONFIG = '.metaHub/ethics/ai-ethics.yaml';

interface Principle {
  name: string;
  description: string;
  implementation: string[];
}

interface Product {
  risk_level: string;
  human_oversight: boolean;
  use_cases: string[];
  prohibited_uses: string[];
}

interface EthicsConfig {
  ai_ethics: {
    principles: Principle[];
    products: Record<string, Product>;
    governance: {
      review_frequency: string;
      ethics_board: boolean;
      external_audit: string;
    };
  };
}

function loadConfig(): EthicsConfig | null {
  if (!existsSync(ETHICS_CONFIG)) {
    console.error('❌ Ethics config not found at', ETHICS_CONFIG);
    return null;
  }
  return load(readFileSync(ETHICS_CONFIG, 'utf-8')) as EthicsConfig;
}

function showPrinciples() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n🧭 AI ETHICS PRINCIPLES\n');
  console.log('═'.repeat(60));

  config.ai_ethics.principles.forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.name.toUpperCase()}`);
    console.log(`   ${p.description}`);
    console.log('\n   Implementation:');
    p.implementation.forEach((impl) => {
      console.log(`   • ${impl}`);
    });
  });

  console.log('\n' + '═'.repeat(60));
}

function showProducts() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n🤖 AI PRODUCTS & RISK LEVELS\n');
  console.log('═'.repeat(60));

  for (const [name, product] of Object.entries(config.ai_ethics.products)) {
    const riskIcon = product.risk_level === 'high' ? '🔴' : product.risk_level === 'medium' ? '🟡' : '🟢';

    console.log(`\n${riskIcon} ${name}`);
    console.log(`   Risk Level: ${product.risk_level}`);
    console.log(`   Human Oversight: ${product.human_oversight ? 'Required' : 'Optional'}`);

    console.log('\n   Approved Use Cases:');
    product.use_cases.forEach((uc) => {
      console.log(`   ✅ ${uc.replace(/_/g, ' ')}`);
    });

    console.log('\n   Prohibited Uses:');
    product.prohibited_uses.forEach((pu) => {
      console.log(`   ❌ ${pu.replace(/_/g, ' ')}`);
    });
  }

  console.log('\n' + '═'.repeat(60));
}

function showGovernance() {
  const config = loadConfig();
  if (!config) return;

  const gov = config.ai_ethics.governance;

  console.log('\n📋 AI GOVERNANCE\n');
  console.log('═'.repeat(50));
  console.log(`   Review Frequency: ${gov.review_frequency}`);
  console.log(`   Ethics Board: ${gov.ethics_board ? 'Yes' : 'No'}`);
  console.log(`   External Audit: ${gov.external_audit}`);
  console.log('═'.repeat(50));
}

function showHelp() {
  console.log(`
🧭 AI Ethics Review Tool

Usage:
  npm run ethics              Show ethics principles
  npm run ethics principles   Show ethics principles
  npm run ethics products     Show AI products and risk levels
  npm run ethics governance   Show governance information

Configuration: ${ETHICS_CONFIG}
Checklist: docs/ethics/AI-REVIEW-CHECKLIST.md
`);
}

// CLI
const [, , cmd] = process.argv;
switch (cmd) {
  case 'principles':
  case undefined:
    showPrinciples();
    break;
  case 'products':
    showProducts();
    break;
  case 'governance':
    showGovernance();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showHelp();
}
