#!/usr/bin/env node

/**
 * Documentation Freshness Check
 * Warns about docs not updated in 6+ months
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SIX_MONTHS = 180 * 24 * 60 * 60 * 1000;

function getLastModified(file) {
  try {
    const gitDate = execSync(`git log -1 --format=%cd --date=iso "${file}"`, {
      encoding: 'utf8',
    }).trim();
    return new Date(gitDate);
  } catch {
    return new Date(fs.statSync(file).mtime);
  }
}

function checkFreshness(docsDir) {
  const now = new Date();
  const stale = [];

  // Find all markdown files
  const files = [];
  function traverse(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  traverse(docsDir);

  for (const file of files) {
    const lastMod = getLastModified(file);
    const age = now - lastMod;

    if (age > SIX_MONTHS) {
      stale.push({
        file,
        age: Math.floor(age / (24 * 60 * 60 * 1000)),
        lastMod: lastMod.toISOString().split('T')[0],
      });
    }
  }

  if (stale.length > 0) {
    console.log(`\n⚠️  Found ${stale.length} stale documents (>6 months old):\n`);
    stale.forEach(({ file, age, lastMod }) => {
      console.log(`  ${file}`);
      console.log(`    Last updated: ${lastMod} (${age} days ago)\n`);
    });
    return 1;
  } else {
    console.log('✅ All documentation is fresh!');
    return 0;
  }
}

const docsDir = process.argv[2] || 'docs';
process.exit(checkFreshness(docsDir));
