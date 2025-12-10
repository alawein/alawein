#!/usr/bin/env tsx
/**
 * Risk assessment utility
 * Usage: npm run risk
 */
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const RISK_REGISTRY = '.metaHub/risk/registry.yaml';

const SCORES: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

interface Risk {
  id: string;
  name: string;
  likelihood: string;
  impact: string;
  mitigation: string;
  owner: string;
  category?: string;
}

interface RiskConfig {
  risk_registry: {
    categories: Record<string, Risk[]>;
    risk_matrix: {
      likelihood: string[];
      impact: string[];
      score_thresholds: {
        acceptable: number;
        elevated: number;
        critical: number;
      };
    };
    review_schedule: string;
    next_review: string;
  };
}

function calculateScore(likelihood: string, impact: string): number {
  return (SCORES[likelihood] || 1) * (SCORES[impact] || 1);
}

function getRiskLevel(score: number, thresholds: { acceptable: number; elevated: number; critical: number }): string {
  if (score >= thresholds.critical) return '🔴 Critical';
  if (score >= thresholds.elevated) return '🟠 Elevated';
  if (score >= thresholds.acceptable) return '🟡 Moderate';
  return '🟢 Acceptable';
}

function assessRisks() {
  if (!existsSync(RISK_REGISTRY)) {
    console.error('❌ Risk registry not found at', RISK_REGISTRY);
    return;
  }

  const config = load(readFileSync(RISK_REGISTRY, 'utf-8')) as RiskConfig;
  const allRisks: Risk[] = [];
  const thresholds = config.risk_registry.risk_matrix.score_thresholds;

  // Collect all risks with their categories
  for (const [category, risks] of Object.entries(config.risk_registry.categories)) {
    risks.forEach((r) => allRisks.push({ ...r, category }));
  }

  // Sort by risk score (highest first)
  allRisks.sort((a, b) => calculateScore(b.likelihood, b.impact) - calculateScore(a.likelihood, a.impact));

  console.log('\n⚠️ RISK ASSESSMENT REPORT\n');
  console.log('═'.repeat(80));
  console.log(`${'ID'.padEnd(12)} ${'Score'.padEnd(8)} ${'Level'.padEnd(15)} ${'Risk'.padEnd(30)} Category`);
  console.log('─'.repeat(80));

  let criticalCount = 0;
  let elevatedCount = 0;

  allRisks.forEach((r) => {
    const score = calculateScore(r.likelihood, r.impact);
    const level = getRiskLevel(score, thresholds);

    if (score >= thresholds.critical) criticalCount++;
    else if (score >= thresholds.elevated) elevatedCount++;

    console.log(
      `${r.id.padEnd(12)} ${score.toString().padStart(2).padEnd(8)} ${level.padEnd(15)} ${r.name.slice(0, 28).padEnd(30)} ${r.category}`,
    );
  });

  console.log('─'.repeat(80));

  // Summary
  console.log('\n📊 SUMMARY\n');
  console.log(`   Total Risks: ${allRisks.length}`);
  console.log(`   🔴 Critical: ${criticalCount}`);
  console.log(`   🟠 Elevated: ${elevatedCount}`);
  console.log(`   🟡 Moderate: ${allRisks.length - criticalCount - elevatedCount}`);

  console.log(`\n📅 Next Review: ${config.risk_registry.next_review}`);
  console.log(`   Schedule: ${config.risk_registry.review_schedule}`);

  // Top risks
  if (criticalCount > 0 || elevatedCount > 0) {
    console.log('\n⚠️ TOP RISKS REQUIRING ATTENTION:\n');
    allRisks
      .filter((r) => calculateScore(r.likelihood, r.impact) >= thresholds.elevated)
      .slice(0, 5)
      .forEach((r) => {
        console.log(`   ${r.id}: ${r.name}`);
        console.log(`      Mitigation: ${r.mitigation.slice(0, 60)}...`);
        console.log(`      Owner: ${r.owner}\n`);
      });
  }
}

function showHelp() {
  console.log(`
⚠️ Risk Assessment Tool

Usage:
  npm run risk           Run risk assessment
  npm run risk:assess    Run risk assessment

Configuration: ${RISK_REGISTRY}
`);
}

// CLI
const [, , cmd] = process.argv;
switch (cmd) {
  case 'assess':
  case undefined:
    assessRisks();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showHelp();
}
