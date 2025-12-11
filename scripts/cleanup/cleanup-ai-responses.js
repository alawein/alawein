#!/usr/bin/env node

/**
 * Cleanup AI Response Cache
 *
 * This script removes cached AI/tool response files that clutter the workspace.
 * These are typically generated during AI-assisted development sessions.
 *
 * Usage: node scripts/cleanup/cleanup-ai-responses.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESPONSE_PATTERN = /^response_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

function findAndRemoveResponseFiles(dir, removed = []) {
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Check if directory matches response pattern
        if (RESPONSE_PATTERN.test(item)) {
          console.log(`Removing response directory: ${fullPath}`);
          fs.rmSync(fullPath, { recursive: true, force: true });
          removed.push(fullPath);
        } else {
          // Recurse into subdirectories (but skip node_modules and .git)
          if (item !== 'node_modules' && item !== '.git' && item !== '.next' && item !== 'dist') {
            findAndRemoveResponseFiles(fullPath, removed);
          }
        }
      } else if (stat.isFile()) {
        // Check if file matches response pattern
        if (RESPONSE_PATTERN.test(path.parse(item).name)) {
          console.log(`Removing response file: ${fullPath}`);
          fs.unlinkSync(fullPath);
          removed.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not process ${dir}: ${error.message}`);
  }

  return removed;
}

function main() {
  const rootDir = path.resolve(__dirname, '../..');
  console.log('🧹 Starting AI response cache cleanup...');
  console.log(`Scanning from: ${rootDir}`);

  const removed = findAndRemoveResponseFiles(rootDir);

  if (removed.length > 0) {
    console.log(`\n✅ Successfully removed ${removed.length} response files/directories:`);
    removed.forEach((item) => console.log(`  - ${path.relative(rootDir, item)}`));
  } else {
    console.log('\n✅ No response files found to clean up.');
  }

  console.log('\n📝 Note: Response files are now ignored by .gitignore to prevent future accumulation.');
  console.log('💡 Tip: Run this script periodically or add it to your pre-commit hooks.');
}

if (require.main === module) {
  main();
}

module.exports = { findAndRemoveResponseFiles };
