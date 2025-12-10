#!/usr/bin/env tsx
/**
 * Compliance audit trail logger
 * Usage: npm run audit <command>
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname } from 'path';

const AUDIT_LOG = '.logs/compliance-audit.jsonl';

interface AuditEvent {
  timestamp: string;
  event_id: string;
  event_type: string;
  actor: string;
  resource: string;
  action: string;
  result: 'success' | 'failure' | 'warning';
  metadata?: Record<string, unknown>;
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function ensureLogDir() {
  const dir = dirname(AUDIT_LOG);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function logEvent(event: Omit<AuditEvent, 'timestamp' | 'event_id'>) {
  ensureLogDir();
  const entry: AuditEvent = {
    timestamp: new Date().toISOString(),
    event_id: generateEventId(),
    ...event,
  };
  appendFileSync(AUDIT_LOG, JSON.stringify(entry) + '\n');
  console.log(`📝 Logged: [${entry.event_id}] ${event.event_type} - ${event.action}`);
  return entry.event_id;
}

function showRecent(count: number = 10) {
  if (!existsSync(AUDIT_LOG)) {
    console.log('📋 No audit logs found');
    console.log('   Logs will be created when events are recorded.');
    return;
  }

  const content = readFileSync(AUDIT_LOG, 'utf-8').trim();
  if (!content) {
    console.log('📋 Audit log is empty');
    return;
  }

  const lines = content.split('\n');
  const recent = lines.slice(-count);

  console.log('\n📋 RECENT AUDIT EVENTS\n');
  console.log('═'.repeat(80));
  console.log(`${'Timestamp'.padEnd(20)} ${'Type'.padEnd(15)} ${'Action'.padEnd(20)} ${'Result'.padEnd(10)}`);
  console.log('─'.repeat(80));

  recent.forEach((line) => {
    try {
      const e = JSON.parse(line) as AuditEvent;
      const ts = e.timestamp.slice(0, 19).replace('T', ' ');
      const resultIcon = e.result === 'success' ? '✅' : e.result === 'failure' ? '❌' : '⚠️';
      console.log(`${ts.padEnd(20)} ${e.event_type.padEnd(15)} ${e.action.slice(0, 20).padEnd(20)} ${resultIcon}`);
    } catch {
      // Skip malformed lines
    }
  });

  console.log('─'.repeat(80));
  console.log(`Total events in log: ${lines.length}`);
}

function showStats() {
  if (!existsSync(AUDIT_LOG)) {
    console.log('📋 No audit logs found');
    return;
  }

  const content = readFileSync(AUDIT_LOG, 'utf-8').trim();
  if (!content) {
    console.log('📋 Audit log is empty');
    return;
  }

  const lines = content.split('\n');
  const events = lines
    .map((line) => {
      try {
        return JSON.parse(line) as AuditEvent;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as AuditEvent[];

  const byType: Record<string, number> = {};
  const byResult: Record<string, number> = {};

  events.forEach((e) => {
    byType[e.event_type] = (byType[e.event_type] || 0) + 1;
    byResult[e.result] = (byResult[e.result] || 0) + 1;
  });

  console.log('\n📊 AUDIT LOG STATISTICS\n');
  console.log('═'.repeat(50));
  console.log(`Total Events: ${events.length}`);

  console.log('\nBy Type:');
  Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

  console.log('\nBy Result:');
  Object.entries(byResult).forEach(([result, count]) => {
    const icon = result === 'success' ? '✅' : result === 'failure' ? '❌' : '⚠️';
    console.log(`   ${icon} ${result}: ${count}`);
  });
}

function showHelp() {
  console.log(`
📋 Compliance Audit Logger

Usage:
  npm run audit:show [count]              Show recent events (default: 10)
  npm run audit:log <type> <resource> <action>  Log an event
  npm run audit stats                     Show statistics

Examples:
  npm run audit:show 20
  npm run audit:log access user:123 login
  npm run audit stats

Log Location: ${AUDIT_LOG}
`);
}

// CLI
const [, , cmd, ...args] = process.argv;
switch (cmd) {
  case 'log':
    if (args.length < 1) {
      console.log('Usage: npm run audit:log <type> [resource] [action]');
    } else {
      logEvent({
        event_type: args[0],
        actor: 'system',
        resource: args[1] || '',
        action: args[2] || args[0],
        result: 'success',
      });
    }
    break;
  case 'show':
    showRecent(parseInt(args[0]) || 10);
    break;
  case 'stats':
    showStats();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showHelp();
}
