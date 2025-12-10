#!/usr/bin/env tsx
/**
 * Bundle size analyzer for all web apps
 * Usage: npm run perf:bundle
 */
import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const WEB_APPS = [
  'platforms/repz',
  'platforms/liveiticonic',
  'platforms/attributa',
  'platforms/llmworks',
  'platforms/portfolio',
];

interface BundleStats {
  app: string;
  totalSize: number;
  fileCount: number;
  largestFile: { name: string; size: number };
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function analyzeBundleDir(distPath: string): BundleStats | null {
  if (!existsSync(distPath)) return null;

  let totalSize = 0;
  let fileCount = 0;
  let largestFile = { name: '', size: 0 };

  function walkDir(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile()) {
        const stat = statSync(fullPath);
        totalSize += stat.size;
        fileCount++;
        if (stat.size > largestFile.size) {
          largestFile = { name: entry.name, size: stat.size };
        }
      }
    }
  }

  walkDir(distPath);
  return { app: '', totalSize, fileCount, largestFile };
}

function analyzeBundles() {
  console.log('📦 Bundle Size Analysis\n');
  console.log('─'.repeat(60));

  let totalAllApps = 0;

  for (const app of WEB_APPS) {
    const distPaths = [join(app, 'dist'), join(app, '.next'), join(app, 'build')];

    let found = false;
    for (const distPath of distPaths) {
      const stats = analyzeBundleDir(distPath);
      if (stats) {
        found = true;
        totalAllApps += stats.totalSize;
        console.log(`\n📁 ${app}`);
        console.log(`   Total: ${formatSize(stats.totalSize)}`);
        console.log(`   Files: ${stats.fileCount}`);
        if (stats.largestFile.name) {
          console.log(`   Largest: ${stats.largestFile.name} (${formatSize(stats.largestFile.size)})`);
        }
        break;
      }
    }

    if (!found) {
      console.log(`\n📁 ${app}`);
      console.log(`   ⚠️  No build output found`);
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`\n📊 Total across all apps: ${formatSize(totalAllApps)}`);

  // Bundle size recommendations
  console.log('\n💡 Recommendations:');
  if (totalAllApps > 10 * 1024 * 1024) {
    console.log('   ⚠️  Total bundle size exceeds 10MB - consider code splitting');
  }
  if (totalAllApps > 5 * 1024 * 1024) {
    console.log('   ⚠️  Consider lazy loading for non-critical components');
  }
  console.log('   ✓ Run with --analyze flag on individual apps for detailed breakdown');
}

// CLI
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Bundle Analyzer - Analyze bundle sizes across all web apps

Usage:
  npm run perf:bundle          Analyze all apps
  npm run perf:bundle --help   Show this help

Options:
  --help, -h    Show help
`);
  process.exit(0);
}

analyzeBundles();
