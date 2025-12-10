#!/usr/bin/env tsx
/**
 * Knowledge base CLI
 * Usage: npm run kb
 */
import { existsSync, readdirSync } from 'fs';

const KB_DIR = 'docs/knowledge';

function listKnowledge() {
  console.log('\n🧠 KNOWLEDGE BASE\n');
  console.log('═'.repeat(50));

  if (!existsSync(KB_DIR)) {
    console.log('\n   No knowledge base found.');
    console.log(`   Create: ${KB_DIR}/`);
    return;
  }

  const items = readdirSync(KB_DIR, { withFileTypes: true });
  const files = items.filter((i) => i.isFile() && i.name.endsWith('.md'));

  if (files.length === 0) {
    console.log('\n   Knowledge base is empty.');
  } else {
    console.log(`\n   📚 ${files.length} entries:\n`);
    files.forEach((f) => {
      console.log(`   - ${f.name.replace('.md', '')}`);
    });
  }

  console.log('\n' + '═'.repeat(50));
}

function showHelp() {
  console.log(`
🧠 Knowledge Base CLI

Usage:
  npm run kb              List knowledge entries
  npm run kb:search       Search knowledge base

Storage: ${KB_DIR}/
`);
}

const [, , cmd] = process.argv;
switch (cmd) {
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    listKnowledge();
}
