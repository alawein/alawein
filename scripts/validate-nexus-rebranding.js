#!/usr/bin/env node

/**
 * Nexus Framework Validation Script
 * Scans for any remaining AWS/Amplify references after rebranding
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import chalk from 'chalk';

// Configuration
const ROOT_DIR = process.cwd();
const EXCLUDE_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  'target'
];

const EXCLUDE_FILES = [
  '.gitignore',
  'package-lock.json',
  'yarn.lock',
  '.DS_Store'
];

// Patterns to search for
const AWS_PATTERNS = [
  /aws-amplify/gi,
  /@aws-amplify/gi,
  /aws-cdk/gi,
  /@aws-cdk/gi,
  /amplify\./gi,
  /Amplify\./gi,
  /aws_\w+/gi,
  /AWS_\w+/gi,
  /amazonaws\.com/gi,
  /amazoncognito\.com/gi,
  /dynamodb/gi,
  /lambda\./gi,
  /s3\./gi,
  /cognito/gi,
  /cloudfront/gi,
  /api gateway/gi,
  /cloudwatch/gi,
  /iam\./gi
];

const EXCLUDED_PATTERNS = [
  /#.*aws/gi,  // Comments mentioning AWS
  /\/\/.*aws/gi,  // JS comments
  /\/\*[\s\S]*?\*\//g,  // Block comments
  /"aws":/gi,  // JSON keys (not values)
];

let totalFiles = 0;
let filesWithIssues = 0;
const issues = [];

function shouldExcludeDir(path) {
  const parts = path.split(/[/\\]/);
  return parts.some(part => EXCLUDE_DIRS.includes(part));
}

function shouldExcludeFile(filename) {
  return EXCLUDE_FILES.includes(filename) ||
         filename.endsWith('.log') ||
         filename.endsWith('.tmp');
}

function scanFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const relativePath = filePath.replace(ROOT_DIR, '');

    // Skip excluded patterns
    for (const pattern of EXCLUDED_PATTERNS) {
      if (pattern.test(content)) {
        return;
      }
    }

    // Check for AWS patterns
    for (const pattern of AWS_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        filesWithIssues++;
        issues.push({
          file: relativePath,
          pattern: pattern.source,
          matches: matches.length,
          lines: findLineNumbers(content, pattern)
        });
        break; // Only report once per file
      }
    }
  } catch (error) {
    // Skip binary files or files that can't be read as text
  }
}

function findLineNumbers(content, pattern) {
  const lines = content.split('\n');
  const lineNumbers = [];

  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      lineNumbers.push(index + 1);
    }
  });

  return lineNumbers;
}

function scanDirectory(dir) {
  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && !shouldExcludeDir(fullPath)) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && !shouldExcludeFile(item)) {
        const ext = extname(item);
        // Only scan text files
        if (['.ts', '.tsx', '.js', '.jsx', '.json', '.yml', '.yaml', '.md', '.txt', '.html', '.css'].includes(ext)) {
          totalFiles++;
          scanFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error scanning directory ${dir}: ${error.message}`));
  }
}

// Main execution
console.log(chalk.cyan('\n🔍 Nexus Framework Validation Script'));
console.log(chalk.gray('Scanning for remaining AWS/Amplify references...\n'));

scanDirectory(ROOT_DIR);

// Results
console.log(chalk.bold(`\n📊 Results:`));
console.log(`Total files scanned: ${chalk.yellow(totalFiles)}`);
console.log(`Files with issues: ${chalk.red(filesWithIssues)}`);

if (issues.length > 0) {
  console.log(chalk.bold('\n⚠️  Issues found:'));

  issues.forEach(issue => {
    console.log(chalk.red(`\n📁 ${issue.file}`));
    console.log(chalk.gray(`   Pattern: ${issue.pattern}`));
    console.log(chalk.gray(`   Lines: ${issue.lines.join(', ')}`));
  });

  console.log(chalk.bold('\n🔧 Recommendations:'));
  console.log('1. Review each file listed above');
  console.log('2. Replace AWS references with Nexus equivalents');
  console.log('3. Update import statements to use @nexus/* packages');
  console.log('4. Run this script again to verify fixes');

  process.exit(1);
} else {
  console.log(chalk.bold.green('\n✅ Success! No AWS references found.'));
  console.log(chalk.green('The Nexus Framework rebranding is complete.'));
}

console.log(chalk.gray('\n---\nValidation complete.'));
