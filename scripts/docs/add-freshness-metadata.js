#!/usr/bin/env node

/**
 * Add Freshness Metadata to Documentation
 *
 * Adds YAML frontmatter with last_verified dates to markdown files
 * Run: node scripts/docs/add-freshness-metadata.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const docsDir = path.join(rootDir, 'docs');

const today = new Date().toISOString().split('T')[0];

/**
 * Get all markdown files recursively
 */
function getMarkdownFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    // Skip node_modules and hidden directories
    if (item.name.startsWith('.') || item.name === 'node_modules') {
      continue;
    }

    if (item.isDirectory()) {
      getMarkdownFiles(fullPath, files);
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Check if file has frontmatter
 */
function hasFrontmatter(content) {
  return content.startsWith('---');
}

/**
 * Check if frontmatter has last_verified
 */
function hasLastVerified(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return false;
  return frontmatterMatch[1].includes('last_verified:');
}

/**
 * Extract title from content
 */
function extractTitle(content, filePath) {
  // Try to get from first heading
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1];
  }

  // Fall back to filename
  const fileName = path.basename(filePath, '.md');
  return fileName.replace(/[-_]/g, ' ');
}

/**
 * Add frontmatter to file
 */
function addFrontmatter(filePath, content) {
  const title = extractTitle(content, filePath);

  const frontmatter = `---
title: "${title}"
last_verified: ${today}
owner: "@alawein"
status: active
---

`;

  return frontmatter + content;
}

/**
 * Update existing frontmatter with last_verified
 */
function updateFrontmatter(content) {
  // Find frontmatter
  const frontmatterMatch = content.match(/^(---\n)([\s\S]*?)(\n---)/);
  if (!frontmatterMatch) return content;

  let frontmatter = frontmatterMatch[2];

  // Add last_verified if not present
  if (!frontmatter.includes('last_verified:')) {
    frontmatter = frontmatter.trim() + `\nlast_verified: ${today}`;
  } else {
    // Update existing last_verified
    frontmatter = frontmatter.replace(/last_verified:\s*.*/, `last_verified: ${today}`);
  }

  return `---\n${frontmatter}\n---` + content.slice(frontmatterMatch[0].length);
}

/**
 * Process a single file
 */
function processFile(filePath, options = {}) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip empty files
  if (!content.trim()) {
    return { status: 'skipped', reason: 'empty' };
  }

  let newContent;
  let action;

  if (!hasFrontmatter(content)) {
    // Add new frontmatter
    newContent = addFrontmatter(filePath, content);
    action = 'added';
  } else if (!hasLastVerified(content)) {
    // Update existing frontmatter
    newContent = updateFrontmatter(content);
    action = 'updated';
  } else if (options.force) {
    // Force update
    newContent = updateFrontmatter(content);
    action = 'refreshed';
  } else {
    return { status: 'skipped', reason: 'already has metadata' };
  }

  if (!options.dryRun) {
    fs.writeFileSync(filePath, newContent);
  }

  return { status: 'processed', action };
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    verbose: args.includes('--verbose'),
  };

  console.log('📅 Adding freshness metadata to documentation...\n');

  if (options.dryRun) {
    console.log('🔍 Dry run mode - no files will be modified\n');
  }

  const files = getMarkdownFiles(docsDir);
  const stats = {
    processed: 0,
    skipped: 0,
    added: 0,
    updated: 0,
    refreshed: 0,
  };

  for (const file of files) {
    const relativePath = path.relative(rootDir, file);
    const result = processFile(file, options);

    if (result.status === 'processed') {
      stats.processed++;
      stats[result.action]++;

      if (options.verbose) {
        console.log(`✅ ${result.action}: ${relativePath}`);
      }
    } else {
      stats.skipped++;

      if (options.verbose) {
        console.log(`⏭️  skipped (${result.reason}): ${relativePath}`);
      }
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  Total files: ${files.length}`);
  console.log(`  Processed: ${stats.processed}`);
  console.log(`    - Added frontmatter: ${stats.added}`);
  console.log(`    - Updated frontmatter: ${stats.updated}`);
  console.log(`    - Refreshed date: ${stats.refreshed}`);
  console.log(`  Skipped: ${stats.skipped}`);

  if (options.dryRun) {
    console.log('\n💡 Run without --dry-run to apply changes');
  }
}

main();
