#!/usr/bin/env node

/**
 * Nexus Framework Core Validation Script
 * Validates only the core framework files for AWS references
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import chalk from 'chalk';

// Configuration - Only scan core Nexus Framework files
const CORE_DIRS = [
  '.nexus/cli',
  '.nexus/templates',
  '.nexus/shared',
  '.nexus/configs',
  'docs/NEXUS-*.md',
  'NEXUS-*.md'
];

const EXCLUDE_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage'
];

// Critical patterns that MUST be fixed
const CRITICAL_PATTERNS = [
  /@aws-amplify/gi,
  /aws-cdk/gi,
  /amplify\./gi,
  /Amplify\./gi,
  /aws_region/gi,
  /AWS_REGION/gi,
  /aws-actions/gi
];

// Patterns that should be checked
const WARNING_PATTERNS = [
  /aws_\w+/gi,
  /AWS_\w+/gi,
  /amazonaws\.com/gi,
  /amazoncognito\.com/gi
];

let totalFiles = 0;
let criticalIssues = 0;
let warningIssues = 0;
const issues = [];

function scanFile(filePath, isCritical = true) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const relativePath = filePath.replace(process.cwd(), '');

    const patterns = isCritical ? CRITICAL_PATTERNS : WARNING_PATTERNS;

    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        if (isCritical) {
          criticalIssues++;
        } else {
          warningIssues++;
        }

        issues.push({
          file: relativePath,
          pattern: pattern.source,
          matches: matches.length,
          type: isCritical ? 'CRITICAL' : 'WARNING'
        });
        break;
      }
    }
  } catch (error) {
    // Skip files that can't be read
  }
}

function scanDirectory(dir, isCritical = true) {
  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && !EXCLUDE_DIRS.includes(item)) {
        scanDirectory(fullPath, isCritical);
      } else if (stat.isFile()) {
        const ext = extname(item);
        if (['.ts', '.tsx', '.js', '.jsx', '.json', '.yml', '.yaml', '.md'].includes(ext)) {
          totalFiles++;
          scanFile(fullPath, isCritical);
        }
      }
    }
  } catch (error) {
    // Skip directories that can't be read
  }
}

// Main execution
console.log(chalk.cyan('\n🔍 Nexus Framework Core Validation'));
console.log(chalk.gray('Scanning core framework files for AWS references...\n'));

// Scan core directories
for (const dir of CORE_DIRS) {
  if (dir.includes('*')) {
    // Handle glob patterns
    const baseDir = dir.split('/')[0];
    try {
      if (statSync(baseDir).isDirectory()) {
        scanDirectory(baseDir, true);
      }
    } catch (error) {
      // Directory doesn't exist, skip
    }
  } else {
    try {
      if (statSync(dir).isDirectory()) {
        scanDirectory(dir, true);
      }
    } catch (error) {
      // Directory doesn't exist, skip
    }
  }
}

// Results
console.log(chalk.bold(`\n📊 Results:`));
console.log(`Core files scanned: ${chalk.yellow(totalFiles)}`);
console.log(`Critical issues: ${chalk.red(criticalIssues)}`);
console.log(`Warnings: ${chalk.yellow(warningIssues)}`);

if (criticalIssues > 0) {
  console.log(chalk.bold('\n🚨 Critical Issues (Must Fix):'));

  issues
    .filter(i => i.type === 'CRITICAL')
    .forEach(issue => {
      console.log(chalk.red(`\n📁 ${issue.file}`));
      console.log(chalk.gray(`   Pattern: ${issue.pattern}`));
    });
}

if (warningIssues > 0) {
  console.log(chalk.bold('\n⚠️  Warnings (Should Fix):'));

  issues
    .filter(i => i.type === 'WARNING')
    .forEach(issue => {
      console.log(chalk.yellow(`\n📁 ${issue.file}`));
      console.log(chalk.gray(`   Pattern: ${issue.pattern}`));
    });
}

if (criticalIssues === 0 && warningIssues === 0) {
  console.log(chalk.bold.green('\n✅ Success! Nexus Framework core is clean.'));
} else {
  console.log(chalk.bold('\n🔧 Next Steps:'));
  if (criticalIssues > 0) {
    console.log('1. Fix all critical issues above');
  }
  if (warningIssues > 0) {
    console.log('2. Review and update warnings');
  }
  console.log('3. Run validation again to verify');
}

console.log(chalk.gray('\n---\nValidation complete.'));
