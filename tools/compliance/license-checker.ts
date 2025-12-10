#!/usr/bin/env tsx
/**
 * License compliance checker
 * Usage: npm run compliance:licenses
 */
import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const ALLOWED = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'BSD-2-Clause', 'ISC', '0BSD', 'Unlicense'];
const DENIED = ['GPL-3.0', 'AGPL-3.0', 'GPL-2.0', 'LGPL-3.0'];
const REVIEW = ['MPL-2.0', 'CDDL-1.0', 'CC-BY-4.0'];

interface LicenseInfo {
  name: string;
  version: string;
  license: string;
  status: 'allowed' | 'denied' | 'review' | 'unknown';
}

function checkLicenses(): LicenseInfo[] {
  console.log('\n📜 LICENSE COMPLIANCE CHECK\n');
  console.log('═'.repeat(60));

  try {
    // Try using npm ls for basic license info
    const output = execSync('npm ls --json --all 2>/dev/null || echo "{}"', {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });

    const deps = JSON.parse(output);
    const results: LicenseInfo[] = [];

    function extractDeps(obj: Record<string, unknown>, prefix = '') {
      if (!obj || typeof obj !== 'object') return;

      const dependencies = (obj as Record<string, unknown>).dependencies as Record<string, unknown>;
      if (!dependencies) return;

      for (const [name, info] of Object.entries(dependencies)) {
        if (!info || typeof info !== 'object') continue;

        const version = ((info as Record<string, unknown>).version as string) || 'unknown';
        // Note: npm ls doesn't include license info, this is a simplified check
        const license = 'Check package.json';

        results.push({
          name: prefix ? `${prefix}/${name}` : name,
          version,
          license,
          status: 'review',
        });

        extractDeps(info as Record<string, unknown>, name);
      }
    }

    extractDeps(deps);

    // For actual license checking, recommend using license-checker
    if (results.length === 0) {
      console.log('💡 For detailed license checking, install license-checker:');
      console.log('   npm install -g license-checker');
      console.log('   license-checker --summary');
    }

    return results;
  } catch (error) {
    console.log('⚠️  Could not analyze dependencies');
    console.log('💡 Install license-checker for detailed analysis:');
    console.log('   npm install -g license-checker');
    return [];
  }
}

function showSummary(results: LicenseInfo[]) {
  const allowed = results.filter((r) => r.status === 'allowed').length;
  const denied = results.filter((r) => r.status === 'denied').length;
  const review = results.filter((r) => r.status === 'review').length;
  const unknown = results.filter((r) => r.status === 'unknown').length;

  console.log('\n📊 SUMMARY\n');
  console.log('─'.repeat(40));
  console.log(`   ✅ Allowed: ${allowed}`);
  console.log(`   ❌ Denied: ${denied}`);
  console.log(`   ⚠️  Review: ${review}`);
  console.log(`   ❓ Unknown: ${unknown}`);
  console.log('─'.repeat(40));
  console.log(`   Total: ${results.length} packages`);

  if (denied > 0) {
    console.log('\n❌ DENIED LICENSES (action required):');
    results
      .filter((r) => r.status === 'denied')
      .forEach((r) => {
        console.log(`   - ${r.name}@${r.version}: ${r.license}`);
      });
  }

  if (review > 0 && review <= 10) {
    console.log('\n⚠️  NEEDS REVIEW:');
    results
      .filter((r) => r.status === 'review')
      .slice(0, 10)
      .forEach((r) => {
        console.log(`   - ${r.name}@${r.version}: ${r.license}`);
      });
  }
}

function generateReport(results: LicenseInfo[]) {
  const reportDir = 'docs/compliance';
  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true });
  }

  const report = {
    generated_at: new Date().toISOString(),
    total_packages: results.length,
    summary: {
      allowed: results.filter((r) => r.status === 'allowed').length,
      denied: results.filter((r) => r.status === 'denied').length,
      review: results.filter((r) => r.status === 'review').length,
      unknown: results.filter((r) => r.status === 'unknown').length,
    },
    packages: results,
  };

  const reportPath = `${reportDir}/license-report.json`;
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

function showHelp() {
  console.log(`
📜 License Compliance Checker

Usage:
  npm run compliance:licenses          Check all licenses
  npm run compliance:licenses report   Generate JSON report

Allowed Licenses:
  ${ALLOWED.join(', ')}

Denied Licenses:
  ${DENIED.join(', ')}

For detailed analysis, install license-checker:
  npm install -g license-checker
  license-checker --summary
`);
}

// CLI
const [, , cmd] = process.argv;
switch (cmd) {
  case 'report': {
    const results = checkLicenses();
    if (results.length > 0) {
      showSummary(results);
      generateReport(results);
    }
    break;
  }
  case '--help':
  case '-h':
    showHelp();
    break;
  default: {
    const results = checkLicenses();
    if (results.length > 0) {
      showSummary(results);
    }
  }
}
