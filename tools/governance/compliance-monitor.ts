#!/usr/bin/env tsx
/**
 * Compliance monitoring for all repositories
 * Usage: npm run gov:scan
 */
import { readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const SCAN_DIRS = ['platforms', 'packages', 'organizations', 'research'];
const REQUIRED_FILES = ['README.md'];
const RECOMMENDED_FILES = ['LICENSE', 'package.json', 'tsconfig.json'];

interface ComplianceResult {
  path: string;
  required: { file: string; exists: boolean }[];
  recommended: { file: string; exists: boolean }[];
  score: number;
}

function scanDirectory(dirPath: string): ComplianceResult[] {
  const results: ComplianceResult[] = [];

  if (!existsSync(dirPath)) return results;

  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    const fullPath = join(dirPath, entry.name);

    // Check if this looks like a project (has package.json or README)
    const hasPackageJson = existsSync(join(fullPath, 'package.json'));
    const hasReadme = existsSync(join(fullPath, 'README.md'));

    if (!hasPackageJson && !hasReadme) {
      // Recurse into subdirectories
      results.push(...scanDirectory(fullPath));
      continue;
    }

    const required = REQUIRED_FILES.map((file) => ({
      file,
      exists: existsSync(join(fullPath, file)),
    }));

    const recommended = RECOMMENDED_FILES.map((file) => ({
      file,
      exists: existsSync(join(fullPath, file)),
    }));

    const requiredScore = required.filter((r) => r.exists).length / required.length;
    const recommendedScore = recommended.filter((r) => r.exists).length / recommended.length;
    const score = Math.round((requiredScore * 0.7 + recommendedScore * 0.3) * 100);

    results.push({
      path: fullPath,
      required,
      recommended,
      score,
    });
  }

  return results;
}

function printResults(results: ComplianceResult[]) {
  console.log('\n📋 COMPLIANCE SCAN RESULTS\n');
  console.log('═'.repeat(70));

  let totalScore = 0;
  let compliantCount = 0;

  for (const result of results) {
    const icon = result.score >= 100 ? '✅' : result.score >= 70 ? '🟡' : '🔴';
    console.log(`\n${icon} ${result.path} (${result.score}%)`);

    const missingRequired = result.required.filter((r) => !r.exists);
    const missingRecommended = result.recommended.filter((r) => !r.exists);

    if (missingRequired.length > 0) {
      console.log(`   ❌ Missing required: ${missingRequired.map((r) => r.file).join(', ')}`);
    }
    if (missingRecommended.length > 0) {
      console.log(`   ⚠️  Missing recommended: ${missingRecommended.map((r) => r.file).join(', ')}`);
    }

    totalScore += result.score;
    if (result.score >= 100) compliantCount++;
  }

  console.log('\n' + '═'.repeat(70));
  console.log('\n📊 SUMMARY\n');
  console.log(`   Total projects scanned: ${results.length}`);
  console.log(`   Fully compliant: ${compliantCount}/${results.length}`);
  console.log(`   Average compliance score: ${results.length > 0 ? Math.round(totalScore / results.length) : 0}%`);

  if (compliantCount === results.length) {
    console.log('\n✅ All projects are compliant!');
  } else {
    console.log('\n⚠️  Some projects need attention');
  }
}

function main() {
  console.log('🔍 Scanning repositories for compliance...\n');

  const allResults: ComplianceResult[] = [];

  for (const dir of SCAN_DIRS) {
    if (existsSync(dir)) {
      console.log(`   Scanning ${dir}/...`);
      allResults.push(...scanDirectory(dir));
    }
  }

  printResults(allResults);
}

main();
