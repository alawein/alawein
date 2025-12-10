#!/usr/bin/env tsx
/**
 * Config backup utility
 * Usage: npm run backup [configs|full|list]
 */
import { cpSync, mkdirSync, existsSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

const BACKUP_DIR = '.backups';
const CONFIGS_TO_BACKUP = [
  '.config',
  '.metaHub/policies',
  'package.json',
  'tsconfig.json',
  'turbo.json',
  '.pre-commit-config.yaml',
  '.github/workflows',
  '.env.example',
];

function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getDirSize(dirPath: string): number {
  let size = 0;
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      if (entry.isDirectory()) {
        size += getDirSize(fullPath);
      } else {
        size += statSync(fullPath).size;
      }
    }
  } catch {
    // Ignore errors
  }
  return size;
}

function backupConfigs() {
  const timestamp = getTimestamp();
  const dest = join(BACKUP_DIR, `configs-${timestamp}`);

  mkdirSync(dest, { recursive: true });

  console.log(`💾 Backing up configs to ${dest}\n`);

  let totalSize = 0;
  let successCount = 0;

  for (const path of CONFIGS_TO_BACKUP) {
    try {
      if (existsSync(path)) {
        const destPath = join(dest, path);
        const parentDir = dirname(destPath);
        mkdirSync(parentDir, { recursive: true });
        cpSync(path, destPath, { recursive: true });

        const stat = statSync(path);
        const size = stat.isDirectory() ? getDirSize(path) : stat.size;
        totalSize += size;
        successCount++;

        console.log(`  ✅ ${path} (${formatSize(size)})`);
      } else {
        console.log(`  ⚠️  ${path} (not found)`);
      }
    } catch (err) {
      console.log(`  ❌ ${path}: ${err instanceof Error ? err.message : err}`);
    }
  }

  // Write manifest
  const manifest = {
    timestamp,
    files: CONFIGS_TO_BACKUP,
    created_by: 'backup.ts',
    total_size: totalSize,
    success_count: successCount,
  };
  writeFileSync(join(dest, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`✅ Backup complete: ${dest}`);
  console.log(`   Files: ${successCount}/${CONFIGS_TO_BACKUP.length}`);
  console.log(`   Size: ${formatSize(totalSize)}`);
}

function listBackups() {
  if (!existsSync(BACKUP_DIR)) {
    console.log('📦 No backups found\n');
    console.log('Run: npm run backup configs');
    return;
  }

  const backups = readdirSync(BACKUP_DIR).filter((b) => statSync(join(BACKUP_DIR, b)).isDirectory());

  if (backups.length === 0) {
    console.log('📦 No backups found\n');
    return;
  }

  console.log('📦 Available Backups:\n');
  console.log(`${'Backup'.padEnd(30)} ${'Size'.padEnd(12)} Created`);
  console.log('─'.repeat(60));

  for (const backup of backups.sort().reverse()) {
    const backupPath = join(BACKUP_DIR, backup);
    const size = getDirSize(backupPath);
    const stat = statSync(backupPath);
    const created = stat.mtime.toISOString().slice(0, 19).replace('T', ' ');
    console.log(`${backup.padEnd(30)} ${formatSize(size).padEnd(12)} ${created}`);
  }

  console.log(`\nTotal: ${backups.length} backup(s)`);
}

function showHelp() {
  console.log(`
💾 Backup Utility

Usage:
  npm run backup configs    Create a new config backup
  npm run backup list       List all backups
  npm run backup            Show this help

Backed up files:
${CONFIGS_TO_BACKUP.map((f) => `  - ${f}`).join('\n')}

Backups are stored in: ${BACKUP_DIR}/
`);
}

// CLI
const [, , cmd] = process.argv;
switch (cmd) {
  case 'configs':
  case 'full':
    backupConfigs();
    break;
  case 'list':
    listBackups();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showHelp();
}
