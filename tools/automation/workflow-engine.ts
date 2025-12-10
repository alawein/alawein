#!/usr/bin/env tsx
/**
 * Workflow automation engine
 * Usage: npm run workflows
 */
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

const CONFIG = '.metaHub/automation/config.yaml';

interface Workflow {
  trigger: string;
  conditions?: Record<string, string>[];
  actions: string[];
  schedule?: string;
  pattern?: string;
}

interface AutomationConfig {
  automation: {
    workflows: Record<string, Workflow>;
    smart_routing: {
      enabled: boolean;
      rules: Array<{ pattern: string; assignee: string; priority: string }>;
    };
    notifications: {
      channels: string[];
      events: string[];
    };
  };
}

function loadConfig(): AutomationConfig | null {
  if (!existsSync(CONFIG)) {
    console.error('❌ Automation config not found at', CONFIG);
    return null;
  }
  return load(readFileSync(CONFIG, 'utf-8')) as AutomationConfig;
}

function listWorkflows() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n🤖 AUTOMATION WORKFLOWS\n');
  console.log('═'.repeat(60));

  for (const [name, wf] of Object.entries(config.automation.workflows)) {
    const triggerIcon =
      wf.trigger === 'push'
        ? '📤'
        : wf.trigger === 'pull_request'
          ? '🔀'
          : wf.trigger === 'schedule'
            ? '⏰'
            : wf.trigger === 'tag_created'
              ? '🏷️'
              : '📋';

    console.log(`\n${triggerIcon} ${name}`);
    console.log(`   Trigger: ${wf.trigger}`);
    if (wf.schedule) console.log(`   Schedule: ${wf.schedule}`);
    if (wf.pattern) console.log(`   Pattern: ${wf.pattern}`);
    console.log(`   Actions: ${wf.actions.join(' → ')}`);
  }

  console.log('\n' + '═'.repeat(60));
}

function showStatus() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n📊 AUTOMATION STATUS\n');
  console.log('═'.repeat(50));

  const auto = config.automation;
  console.log(`\n   Workflows: ${Object.keys(auto.workflows).length}`);
  console.log(`   Smart Routing: ${auto.smart_routing.enabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   Routing Rules: ${auto.smart_routing.rules.length}`);
  console.log(`   Notification Channels: ${auto.notifications.channels.join(', ')}`);
  console.log(`   Monitored Events: ${auto.notifications.events.length}`);

  console.log('\n' + '═'.repeat(50));
}

function showRouting() {
  const config = loadConfig();
  if (!config) return;

  console.log('\n🔀 SMART ROUTING RULES\n');
  console.log('═'.repeat(50));

  if (!config.automation.smart_routing.enabled) {
    console.log('   ⚠️ Smart routing is disabled');
    return;
  }

  config.automation.smart_routing.rules.forEach((rule, i) => {
    const priorityIcon = rule.priority === 'critical' ? '🔴' : rule.priority === 'high' ? '🟠' : '🟡';
    console.log(`\n   ${i + 1}. Pattern: ${rule.pattern}`);
    console.log(`      Assignee: ${rule.assignee}`);
    console.log(`      Priority: ${priorityIcon} ${rule.priority}`);
  });
}

function showHelp() {
  console.log(`
🤖 Workflow Automation Engine

Usage:
  npm run workflows              List all workflows
  npm run workflows:list         List all workflows
  npm run workflows:status       Show automation status
  npm run workflows:routing      Show routing rules

Configuration: ${CONFIG}
`);
}

const [, , cmd] = process.argv;
switch (cmd) {
  case 'list':
    listWorkflows();
    break;
  case 'status':
    showStatus();
    break;
  case 'routing':
    showRouting();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    listWorkflows();
    showStatus();
}
