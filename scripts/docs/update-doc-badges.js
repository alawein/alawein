#!/usr/bin/env node

/**
 * Update Documentation Badges
 *
 * Updates documentation coverage badges in README.md
 * Run: node scripts/docs/update-doc-badges.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

/**
 * Count files matching pattern recursively
 */
function countFiles(dir, pattern, exclude = []) {
  let count = 0;

  if (!fs.existsSync(dir)) {
    return 0;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    // Skip excluded directories
    if (exclude.some((ex) => fullPath.includes(ex))) {
      continue;
    }

    if (item.isDirectory()) {
      count += countFiles(fullPath, pattern, exclude);
    } else if (pattern.test(item.name)) {
      count++;
    }
  }

  return count;
}

/**
 * Get documentation statistics
 */
function getDocStats() {
  const docsDir = path.join(rootDir, 'docs');
  const srcDir = path.join(rootDir, 'src');
  const packagesDir = path.join(rootDir, 'packages');

  const exclude = ['node_modules', '.git', 'dist', 'build', 'coverage'];

  const stats = {
    docs: countFiles(docsDir, /\.md$/i, exclude),
    components: countFiles(path.join(packagesDir, 'ui', 'src', 'components'), /\.tsx$/i, exclude),
    platforms: 7, // Known platforms
    tests: countFiles(path.join(rootDir, 'tests'), /\.test\.(ts|tsx|js)$/i, exclude),
  };

  // Calculate documentation coverage (rough estimate)
  const expectedDocs = stats.components + stats.platforms * 2;
  stats.coverage = Math.min(100, Math.round((stats.docs / expectedDocs) * 100));

  return stats;
}

/**
 * Generate badge URL
 */
function generateBadge(label, value, color) {
  const encodedLabel = encodeURIComponent(label);
  const encodedValue = encodeURIComponent(value);
  return `https://img.shields.io/badge/${encodedLabel}-${encodedValue}-${color}`;
}

/**
 * Update badges in README.md
 */
function updateReadme(stats) {
  const readmePath = path.join(rootDir, 'README.md');

  if (!fs.existsSync(readmePath)) {
    console.log('README.md not found');
    return false;
  }

  let content = fs.readFileSync(readmePath, 'utf8');

  // Define badge patterns and replacements
  const badges = [
    {
      pattern: /!\[Docs\]\([^)]+\)/g,
      replacement: `![Docs](${generateBadge('docs', stats.docs, 'blue')})`,
    },
    {
      pattern: /!\[Components\]\([^)]+\)/g,
      replacement: `![Components](${generateBadge('components', stats.components, 'green')})`,
    },
    {
      pattern: /!\[Tests\]\([^)]+\)/g,
      replacement: `![Tests](${generateBadge('tests', stats.tests, 'brightgreen')})`,
    },
    {
      pattern: /!\[Coverage\]\([^)]+\)/g,
      replacement: `![Coverage](${generateBadge('coverage', `${stats.coverage}%`, stats.coverage > 80 ? 'brightgreen' : stats.coverage > 60 ? 'yellow' : 'red')})`,
    },
  ];

  let updated = false;

  for (const badge of badges) {
    if (badge.pattern.test(content)) {
      content = content.replace(badge.pattern, badge.replacement);
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(readmePath, content);
    console.log('✅ README.md badges updated');
  } else {
    console.log('ℹ️ No badge patterns found in README.md');
  }

  return updated;
}

/**
 * Main function
 */
function main() {
  console.log('📊 Calculating documentation statistics...\n');

  const stats = getDocStats();

  console.log('Documentation Statistics:');
  console.log(`  📄 Documentation files: ${stats.docs}`);
  console.log(`  🧩 Components: ${stats.components}`);
  console.log(`  🖥️  Platforms: ${stats.platforms}`);
  console.log(`  🧪 Test files: ${stats.tests}`);
  console.log(`  📈 Coverage estimate: ${stats.coverage}%`);
  console.log('');

  updateReadme(stats);

  // Output for CI
  console.log('\n📋 Badge URLs:');
  console.log(`  Docs: ${generateBadge('docs', stats.docs, 'blue')}`);
  console.log(`  Components: ${generateBadge('components', stats.components, 'green')}`);
  console.log(`  Tests: ${generateBadge('tests', stats.tests, 'brightgreen')}`);
}

main();
