#!/usr/bin/env tsx
/**
 * Access control audit tool
 * Usage: npm run access <command>
 */
import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'fs';
import { load } from 'js-yaml';
import { dirname } from 'path';

const RBAC_PATH = '.metaHub/access-control/rbac.yaml';
const AUDIT_LOG = '.logs/access-audit.jsonl';

interface RBACConfig {
  version: string;
  access_control: {
    roles: Record<
      string,
      {
        description: string;
        permissions: string[];
        members?: string[];
        expires_after_days?: number;
      }
    >;
    assignments: Record<
      string,
      {
        repos?: string[];
        required_roles: string[];
        review_required_from: string[];
      }
    >;
    security: {
      mfa_required_for: string[];
      session_timeout_minutes: number;
      ip_allowlist_enabled: boolean;
      audit_logging: boolean;
    };
  };
}

interface AuditEntry {
  timestamp: string;
  action: string;
  user: string;
  resource: string;
  result: 'allowed' | 'denied';
}

function ensureLogDir() {
  const dir = dirname(AUDIT_LOG);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function logAudit(entry: AuditEntry) {
  ensureLogDir();
  appendFileSync(AUDIT_LOG, JSON.stringify(entry) + '\n');
}

function loadConfig(): RBACConfig | null {
  if (!existsSync(RBAC_PATH)) {
    console.error('❌ RBAC config not found at', RBAC_PATH);
    return null;
  }
  return load(readFileSync(RBAC_PATH, 'utf-8')) as RBACConfig;
}

function showRoles() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n🔐 ACCESS CONTROL ROLES\n');
  console.log('═'.repeat(60));

  for (const [role, details] of Object.entries(config.access_control.roles)) {
    const permCount = details.permissions.length;
    const permPreview =
      details.permissions[0] === '*'
        ? 'ALL'
        : details.permissions.slice(0, 3).join(', ') + (permCount > 3 ? '...' : '');

    console.log(`\n📋 ${role.toUpperCase()}`);
    console.log(`   ${details.description}`);
    console.log(`   Permissions (${permCount}): ${permPreview}`);
    if (details.members) {
      console.log(`   Members: ${details.members.join(', ')}`);
    }
    if (details.expires_after_days) {
      console.log(`   ⏰ Expires after: ${details.expires_after_days} days`);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('\n🔒 Security Settings:');
  const sec = config.access_control.security;
  console.log(`   MFA Required For: ${sec.mfa_required_for.join(', ')}`);
  console.log(`   Session Timeout: ${sec.session_timeout_minutes} minutes`);
  console.log(`   Audit Logging: ${sec.audit_logging ? 'Enabled' : 'Disabled'}`);
}

function checkPermission(role: string, permission: string) {
  const config = loadConfig();
  if (!config) return false;

  const roleConfig = config.access_control.roles[role];

  if (!roleConfig) {
    console.log(`❌ Role '${role}' not found`);
    console.log(`   Available roles: ${Object.keys(config.access_control.roles).join(', ')}`);
    return false;
  }

  const perms = roleConfig.permissions;
  const hasWildcard = perms.includes('*');
  const hasExactMatch = perms.includes(permission);
  const hasPartialMatch = perms.some((p) => {
    if (p.endsWith(':*')) {
      const prefix = p.slice(0, -2);
      return permission.startsWith(prefix + ':');
    }
    return false;
  });

  const allowed = hasWildcard || hasExactMatch || hasPartialMatch;

  console.log(`\n🔍 Permission Check`);
  console.log(`   Role: ${role}`);
  console.log(`   Permission: ${permission}`);
  console.log(`   Result: ${allowed ? '✅ ALLOWED' : '❌ DENIED'}`);

  // Log the check
  logAudit({
    timestamp: new Date().toISOString(),
    action: 'permission_check',
    user: 'cli',
    resource: `${role}:${permission}`,
    result: allowed ? 'allowed' : 'denied',
  });

  return allowed;
}

function showAssignments() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n📁 REPOSITORY ASSIGNMENTS\n');
  console.log('═'.repeat(60));

  for (const [assignment, details] of Object.entries(config.access_control.assignments)) {
    console.log(`\n${assignment.toUpperCase()}`);
    if (details.repos) {
      console.log(`   Repos: ${details.repos.join(', ')}`);
    }
    console.log(`   Required Roles: ${details.required_roles.join(', ')}`);
    console.log(
      `   Review From: ${details.review_required_from.length > 0 ? details.review_required_from.join(', ') : 'None required'}`,
    );
  }
}

function showHelp() {
  console.log(`
🔐 Access Control Audit Tool

Usage:
  npm run access roles              Show all roles and permissions
  npm run access check <role> <perm> Check if role has permission
  npm run access assignments        Show repository assignments

Examples:
  npm run access check developer repo:write
  npm run access check admin settings:write

Configuration: ${RBAC_PATH}
Audit Log: ${AUDIT_LOG}
`);
}

// CLI
const [, , cmd, ...args] = process.argv;
switch (cmd) {
  case 'roles':
    showRoles();
    break;
  case 'check':
    if (args.length < 2) {
      console.log('Usage: npm run access check <role> <permission>');
    } else {
      checkPermission(args[0], args[1]);
    }
    break;
  case 'assignments':
    showAssignments();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    showHelp();
}
