#!/usr/bin/env tsx
/**
 * Deployment rollback utility
 * Usage: npm run rollback <command>
 */
import { execSync } from 'child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname } from 'path';

const ROLLBACK_LOG = '.logs/rollback-history.jsonl';

interface RollbackEntry {
  timestamp: string;
  id: string;
  from_commit: string;
  to_commit: string;
  reason: string;
  actor: string;
  status: 'initiated' | 'completed' | 'failed';
}

function generateId(): string {
  return `rb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function ensureLogDir() {
  const dir = dirname(ROLLBACK_LOG);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function getCurrentCommit(): string {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim().slice(0, 8);
  } catch {
    return 'unknown';
  }
}

function getPreviousCommit(steps: number = 1): string {
  try {
    return execSync(`git rev-parse HEAD~${steps}`, { encoding: 'utf-8' }).trim().slice(0, 8);
  } catch {
    return 'unknown';
  }
}

function getCommitMessage(commit: string): string {
  try {
    return execSync(`git log -1 --format=%s ${commit}`, { encoding: 'utf-8' }).trim();
  } catch {
    return 'Unknown commit';
  }
}

function logRollback(entry: RollbackEntry) {
  ensureLogDir();
  appendFileSync(ROLLBACK_LOG, JSON.stringify(entry) + '\n');
}

function rollback(reason: string = 'manual', steps: number = 1, dryRun: boolean = true) {
  const from = getCurrentCommit();
  const to = getPreviousCommit(steps);
  const id = generateId();

  console.log('\n🔄 ROLLBACK INITIATED\n');
  console.log('═'.repeat(50));
  console.log(`   ID: ${id}`);
  console.log(`   From: ${from} (${getCommitMessage(from).slice(0, 40)})`);
  console.log(`   To:   ${to} (${getCommitMessage(to).slice(0, 40)})`);
  console.log(`   Reason: ${reason}`);
  console.log(`   Steps: ${steps}`);
  console.log('═'.repeat(50));

  // Log the rollback
  const entry: RollbackEntry = {
    timestamp: new Date().toISOString(),
    id,
    from_commit: from,
    to_commit: to,
    reason,
    actor: process.env.USER || 'system',
    status: 'initiated',
  };
  logRollback(entry);

  if (dryRun) {
    console.log('\n⚠️  DRY RUN - No actual rollback performed');
    console.log('\nTo perform actual rollback:');
    console.log(`   git revert HEAD~${steps - 1}..HEAD --no-edit`);
    console.log('   OR');
    console.log(`   git reset --hard HEAD~${steps}`);
  } else {
    console.log('\n🚀 Executing rollback...');
    try {
      execSync(`git revert HEAD~${steps - 1}..HEAD --no-edit`, { stdio: 'inherit' });
      entry.status = 'completed';
      logRollback(entry);
      console.log('\n✅ Rollback completed successfully');
    } catch (error) {
      entry.status = 'failed';
      logRollback(entry);
      console.log('\n❌ Rollback failed');
      throw error;
    }
  }

  return id;
}

function showHistory(count: number = 10) {
  console.log('\n📜 ROLLBACK HISTORY\n');
  console.log('═'.repeat(70));

  if (!existsSync(ROLLBACK_LOG)) {
    console.log('   No rollback history found');
    return;
  }

  const content = readFileSync(ROLLBACK_LOG, 'utf-8').trim();
  if (!content) {
    console.log('   No rollback history found');
    return;
  }

  const lines = content.split('\n');
  const recent = lines.slice(-count);

  console.log(`${'Timestamp'.padEnd(20)} ${'ID'.padEnd(15)} ${'From→To'.padEnd(20)} ${'Status'.padEnd(10)}`);
  console.log('─'.repeat(70));

  recent.forEach((line) => {
    try {
      const e = JSON.parse(line) as RollbackEntry;
      const ts = e.timestamp.slice(0, 19).replace('T', ' ');
      const commits = `${e.from_commit}→${e.to_commit}`;
      const statusIcon = e.status === 'completed' ? '✅' : e.status === 'failed' ? '❌' : '⏳';
      console.log(`${ts.padEnd(20)} ${e.id.padEnd(15)} ${commits.padEnd(20)} ${statusIcon}`);
    } catch {
      // Skip malformed lines
    }
  });

  console.log('─'.repeat(70));
  console.log(`Total rollbacks: ${lines.length}`);
}

function showHelp() {
  console.log(`
🔄 Deployment Rollback Utility

Usage:
  npm run rollback now [reason]     Initiate rollback (dry run)
  npm run rollback now! [reason]    Execute actual rollback
  npm run rollback history [count]  Show rollback history

Options:
  --steps=N    Number of commits to rollback (default: 1)

Examples:
  npm run rollback now "High error rate"
  npm run rollback now! "Critical bug in production"
  npm run rollback history 20

Log Location: ${ROLLBACK_LOG}
`);
}

// CLI
const [, , cmd, ...args] = process.argv;
const reason = args.filter((a) => !a.startsWith('--')).join(' ') || 'manual';
const stepsArg = args.find((a) => a.startsWith('--steps='));
const steps = stepsArg ? parseInt(stepsArg.split('=')[1]) : 1;

switch (cmd) {
  case 'now':
    rollback(reason, steps, true);
    break;
  case 'now!':
  case 'execute':
    rollback(reason, steps, false);
    break;
  case 'history':
    showHistory(parseInt(args[0]) || 10);
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showHelp();
}
