#!/usr/bin/env tsx
/**
 * Self-healing system monitor
 * Usage: npm run heal
 */
import { existsSync, appendFileSync, mkdirSync, readdirSync } from 'fs';
import { dirname } from 'path';

const LOG_PATH = '.logs/self-healing.jsonl';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
}

function ensureLogDir() {
  const dir = dirname(LOG_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function logEvent(event: Record<string, unknown>) {
  ensureLogDir();
  appendFileSync(LOG_PATH, JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + '\n');
}

function checkHealth(): HealthCheck[] {
  const checks: HealthCheck[] = [];

  // Check critical config files
  const criticalFiles = [
    { path: 'package.json', name: 'Package Config' },
    { path: 'tsconfig.json', name: 'TypeScript Config' },
    { path: '.metaHub/governance/config.yaml', name: 'Governance Config' },
  ];

  criticalFiles.forEach(({ path, name }) => {
    checks.push({
      name,
      status: existsSync(path) ? 'healthy' : 'unhealthy',
      message: existsSync(path) ? undefined : `Missing: ${path}`,
    });
  });

  // Check node_modules
  checks.push({
    name: 'Dependencies',
    status: existsSync('node_modules') ? 'healthy' : 'degraded',
    message: existsSync('node_modules') ? undefined : 'Run: npm install',
  });

  // Check for lock file
  const hasLock = existsSync('package-lock.json') || existsSync('yarn.lock');
  checks.push({
    name: 'Lock File',
    status: hasLock ? 'healthy' : 'degraded',
    message: hasLock ? undefined : 'Missing lock file',
  });

  // Check .metaHub directory
  if (existsSync('.metaHub')) {
    const metaHubDirs = readdirSync('.metaHub', { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    checks.push({
      name: 'MetaHub Configs',
      status: metaHubDirs.length >= 5 ? 'healthy' : 'degraded',
      message: `${metaHubDirs.length} config directories`,
    });
  }

  return checks;
}

function showStatus() {
  console.log('\n🔧 SELF-HEALING STATUS\n');
  console.log('═'.repeat(60));

  const checks = checkHealth();
  let healthy = 0,
    degraded = 0,
    unhealthy = 0;

  checks.forEach((check) => {
    const icon = check.status === 'healthy' ? '✅' : check.status === 'degraded' ? '🟡' : '❌';
    console.log(`${icon} ${check.name}`);
    if (check.message) console.log(`   └─ ${check.message}`);

    if (check.status === 'healthy') healthy++;
    else if (check.status === 'degraded') degraded++;
    else unhealthy++;
  });

  console.log('\n' + '─'.repeat(60));
  console.log(`\n📊 Summary: ${healthy} healthy, ${degraded} degraded, ${unhealthy} unhealthy`);

  const overallStatus = unhealthy > 0 ? 'UNHEALTHY' : degraded > 0 ? 'DEGRADED' : 'HEALTHY';
  const overallIcon = unhealthy > 0 ? '❌' : degraded > 0 ? '🟡' : '✅';
  console.log(`\n${overallIcon} Overall Status: ${overallStatus}`);

  logEvent({ type: 'health_check', healthy, degraded, unhealthy, status: overallStatus });
}

function runDiagnostics() {
  console.log('\n🔍 RUNNING DIAGNOSTICS\n');
  console.log('═'.repeat(60));

  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check package.json
  if (!existsSync('package.json')) {
    issues.push('Missing package.json');
  }

  // Check for lock file
  if (!existsSync('package-lock.json') && !existsSync('yarn.lock')) {
    issues.push('Missing lock file');
    recommendations.push('Run: npm install');
  }

  // Check TypeScript config
  if (!existsSync('tsconfig.json')) {
    issues.push('Missing tsconfig.json');
  }

  // Check node_modules
  if (!existsSync('node_modules')) {
    issues.push('Dependencies not installed');
    recommendations.push('Run: npm install');
  }

  // Check .env
  if (!existsSync('.env') && !existsSync('.env.local')) {
    recommendations.push('Consider creating .env file from .env.example');
  }

  if (issues.length === 0) {
    console.log('✅ No critical issues detected\n');
  } else {
    console.log('❌ Issues found:\n');
    issues.forEach((issue, i) => console.log(`   ${i + 1}. ${issue}`));
  }

  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:\n');
    recommendations.forEach((rec, i) => console.log(`   ${i + 1}. ${rec}`));
  }

  logEvent({ type: 'diagnostics', issues, recommendations });
}

function showHelp() {
  console.log(`
🔧 Self-Healing Monitor

Usage:
  npm run heal              Show health status
  npm run heal:status       Show health status
  npm run heal:diagnose     Run diagnostics

Logs: ${LOG_PATH}
`);
}

const [, , cmd] = process.argv;
switch (cmd) {
  case 'status':
    showStatus();
    break;
  case 'diagnose':
    runDiagnostics();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showStatus();
}
