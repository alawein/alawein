#!/usr/bin/env tsx
/**
 * Documentation generator
 * Usage: npm run docs:generate
 */
import { existsSync, readdirSync, statSync } from 'fs';

function getDocStats() {
  const docsDir = 'docs';
  if (!existsSync(docsDir)) return { total: 0, recent: 0, stale: 0 };

  const now = Date.now();
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  let total = 0,
    recent = 0,
    stale = 0;

  function scanDir(dir: string) {
    const items = readdirSync(dir, { withFileTypes: true });
    items.forEach((item) => {
      const path = `${dir}/${item.name}`;
      if (item.isDirectory()) {
        scanDir(path);
      } else if (item.name.endsWith('.md')) {
        total++;
        const mtime = statSync(path).mtime.getTime();
        if (now - mtime < ninetyDays) recent++;
        else stale++;
      }
    });
  }

  scanDir(docsDir);
  return { total, recent, stale };
}

function showStatus() {
  console.log('\n📚 DOCUMENTATION STATUS\n');
  console.log('═'.repeat(50));

  const stats = getDocStats();

  console.log(`\n   Total Documents: ${stats.total}`);
  console.log(`   ✅ Recent (<90d): ${stats.recent}`);
  console.log(`   ⚠️ Stale (>90d): ${stats.stale}`);

  if (stats.stale > 0) {
    console.log(`\n   💡 ${stats.stale} documents may need review`);
  }

  console.log('\n' + '═'.repeat(50));
}

function showHelp() {
  console.log(`
📚 Documentation Generator

Usage:
  npm run docs:generate          Show documentation status
  npm run docs:status            Show documentation status

Configuration: .metaHub/documentation/config.yaml
`);
}

const [, , cmd] = process.argv;
switch (cmd) {
  case 'status':
  default:
    showStatus();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
}
