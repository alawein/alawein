#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'path';
import { AUTOMATION_PATH, loadYamlFile, loadMarkdownFile, fileExists } from '../utils/file';
import { ValidationResult, Severity } from '../types';

// ============== PROMPTS ==============

function cmdPromptsList() {
  const promptsPath = resolve(AUTOMATION_PATH, 'prompts');

  const categories = {
    system: resolve(promptsPath, 'system'),
    project: resolve(promptsPath, 'project'),
    tasks: resolve(promptsPath, 'tasks')
  };

  console.log('='.repeat(60));
  console.log('AVAILABLE PROMPTS');
  console.log('='.repeat(60));

  let total = 0;
  for (const [category, path] of Object.entries(categories)) {
    try {
      const files = require('fs').readdirSync(path).filter((f: string) => f.endsWith('.md'));
      if (files.length === 0) continue;

      console.log(`\n${category.toUpperCase()} (${files.length} prompts)`);
      console.log('-'.repeat(40));

      for (const file of files.sort()) {
        const filePath = resolve(path, file);
        const sizeKb = require('fs').statSync(filePath).size / 1024;
        console.log(`  ${file.replace('.md', '').padEnd(40)} (${sizeKb.toFixed(1)} KB)`);
        total += 1;
      }
    } catch {
      // Directory doesn't exist, skip
    }
  }

  console.log(`${'='.repeat(60)}`);
  console.log(`Total: ${total} prompts`);
  return 0;
}

function cmdPromptsShow(name: string) {
  const promptsPath = resolve(AUTOMATION_PATH, 'prompts');

  // Search in all categories
  for (const category of ['system', 'project', 'tasks']) {
    const path = resolve(promptsPath, category, `${name}.md`);
    if (fileExists(path)) {
      const content = loadMarkdownFile(path);
      console.log(content);
      return 0;
    }
  }

  console.error(`Error: Prompt '${name}' not found`);
  return 1;
}

function cmdPromptsSearch(query: string) {
  const promptsPath = resolve(AUTOMATION_PATH, 'prompts');
  const searchQuery = query.toLowerCase();

  const results: Array<{ category: string; name: string; path: string }> = [];

  for (const category of ['system', 'project', 'tasks']) {
    const categoryPath = resolve(promptsPath, category);
    try {
      const files = require('fs').readdirSync(categoryPath).filter((f: string) => f.endsWith('.md'));
      for (const file of files) {
        const filePath = resolve(categoryPath, file);
        const content = loadMarkdownFile(filePath).toLowerCase();
        const fileName = file.replace('.md', '');
        if (content.includes(searchQuery) || fileName.toLowerCase().includes(searchQuery)) {
          results.push({ category, name: fileName, path: filePath });
        }
      }
    } catch {
      // Directory doesn't exist, skip
    }
  }

  if (results.length === 0) {
    console.log(`No prompts found matching '${query}'`);
    return 1;
  }

  console.log(`Found ${results.length} prompts matching '${query}':`);
  console.log('-'.repeat(40));
  for (const result of results) {
    console.log(`  [${result.category}] ${result.name}`);
  }

  return 0;
}

// ============== AGENTS ==============

function cmdAgentsList() {
  const agentsFile = resolve(AUTOMATION_PATH, 'agents', 'config', 'agents.yaml');

  if (!fileExists(agentsFile)) {
    console.error('Error: agents.yaml not found');
    return 1;
  }

  const config = loadYamlFile(agentsFile);
  const agents = config.agents || {};
  const categories = config.categories || {};

  console.log('='.repeat(60));
  console.log('AVAILABLE AGENTS');
  console.log('='.repeat(60));

  for (const [catName, catInfo] of Object.entries(categories)) {
    console.log(`\n${catName.toUpperCase()}: ${(catInfo as any).description || ''}`);
    console.log('-'.repeat(40));

    for (const agentName of (catInfo as any).agents || []) {
      const agent = agents[agentName] || {};
      const role = agent.role || 'Unknown';
      console.log(`  ${agentName.padEnd(25)} - ${role}`);
    }
  }

  console.log(`${'='.repeat(60)}`);
  console.log(`Total: ${Object.keys(agents).length} agents`);
  return 0;
}

function cmdAgentsShow(name: string) {
  const agentsFile = resolve(AUTOMATION_PATH, 'agents', 'config', 'agents.yaml');
  const config = loadYamlFile(agentsFile);
  const agents = config.agents || {};

  if (!(name in agents)) {
    console.error(`Error: Agent '${name}' not found`);
    return 1;
  }

  const agent = agents[name];

  console.log(`Agent: ${name}`);
  console.log('='.repeat(40));
  console.log(`Role: ${agent.role || 'N/A'}`);
  console.log(`Goal: ${agent.goal || 'N/A'}`);
  console.log(`\nBackstory:\n${agent.backstory || 'N/A'}`);
  console.log(`\nTools: ${(agent.tools || []).join(', ')}`);
  console.log(`\nLLM Config:`);
  const llmConfig = agent.llmConfig || {};
  for (const [k, v] of Object.entries(llmConfig)) {
    console.log(`  ${k}: ${v}`);
  }

  return 0;
}

// ============== WORKFLOWS ==============

function cmdWorkflowsList() {
  const workflowsFile = resolve(AUTOMATION_PATH, 'workflows', 'config', 'workflows.yaml');

  if (!fileExists(workflowsFile)) {
    console.error('Error: workflows.yaml not found');
    return 1;
  }

  const config = loadYamlFile(workflowsFile);
  const workflows = config.workflows || {};
  const categories = config.categories || {};

  console.log('='.repeat(60));
  console.log('AVAILABLE WORKFLOWS');
  console.log('='.repeat(60));

  for (const [catName, catInfo] of Object.entries(categories)) {
    console.log(`\n${catName.toUpperCase()}: ${(catInfo as any).description || ''}`);
    console.log('-'.repeat(40));

    for (const wfName of (catInfo as any).workflows || []) {
      const wf = workflows[wfName] || {};
      const desc = (wf.description || wf.name || 'Unknown').substring(0, 50);
      const pattern = wf.pattern || 'unknown';
      console.log(`  ${wfName.padEnd(25)} [${pattern}]`);
      console.log(`    ${desc}`);
    }
  }

  console.log(`${'='.repeat(60)}`);
  console.log(`Total: ${Object.keys(workflows).length} workflows`);
  return 0;
}

function cmdWorkflowsShow(name: string) {
  const workflowsFile = resolve(AUTOMATION_PATH, 'workflows', 'config', 'workflows.yaml');
  const config = loadYamlFile(workflowsFile);
  const workflows = config.workflows || {};

  if (!(name in workflows)) {
    console.error(`Error: Workflow '${name}' not found`);
    return 1;
  }

  const wf = workflows[name];

  console.log(`Workflow: ${name}`);
  console.log('='.repeat(40));
  console.log(`Pattern: ${wf.pattern || 'N/A'}`);
  console.log(`Description: ${wf.description || 'N/A'}`);

  console.log(`\nStages:`);
  for (const [i, stage] of (wf.stages || []).entries()) {
    console.log(`  ${i + 1}. ${stage.name || 'unnamed'}`);
    console.log(`     Agent: ${stage.agent || 'N/A'}`);
    console.log(`     Action: ${(stage.action || 'N/A').substring(0, 60)}...`);
  }

  console.log(`\nSuccess Criteria:`);
  for (const criterion of wf.successCriteria || []) {
    console.log(`  - ${criterion}`);
  }

  return 0;
}

// ============== ORCHESTRATION ==============

function cmdRoute(task: string) {
  const orchFile = resolve(AUTOMATION_PATH, 'orchestration', 'config', 'orchestration.yaml');
  const config = loadYamlFile(orchFile);

  const taskLower = task.toLowerCase();
  // Support both camelCase and snake_case from YAML
  const toolRouting = config.toolRouting || config.tool_routing || {};
  const intentExtraction = toolRouting.intentExtraction || toolRouting.intent_extraction || {};
  const keywords = intentExtraction.keywords || {};
  const rules = toolRouting.rules || {};

  // Score each category
  const scores: Record<string, number> = {};
  for (const [category, kws] of Object.entries(keywords)) {
    const score = (kws as string[]).reduce((acc, kw) => acc + (taskLower.includes(kw) ? 1 : 0), 0);
    if (score > 0) {
      scores[category] = score;
    }
  }

  if (Object.keys(scores).length === 0) {
    console.log('Could not determine task type. Please provide more context.');
    return 1;
  }

  // Get best match
  const bestCategory = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
  const confidence = Math.min(scores[bestCategory] / Math.max(taskLower.split(' ').length, 1), 1.0);

  const tools = rules[bestCategory]?.tools || [];

  console.log('='.repeat(60));
  console.log('TASK ROUTING RESULT');
  console.log('='.repeat(60));
  console.log(`\nTask: ${task}`);
  console.log(`\nDetected Type: ${bestCategory}`);
  console.log(`Confidence: ${(confidence * 100).toFixed(0)}%`);
  console.log(`\nRecommended Tools:`);
  for (const [i, tool] of tools.entries()) {
    const marker = i === 0 ? '→' : ' ';
    console.log(`  ${marker} ${tool}`);
  }

  console.log(`\nAll Scores:`);
  for (const [cat, score] of Object.entries(scores).sort(([,a], [,b]) => b - a)) {
    console.log(`  ${cat}: ${score}`);
  }

  return 0;
}

function cmdPatternsList() {
  const patternsPath = resolve(AUTOMATION_PATH, 'orchestration', 'patterns');

  if (!fileExists(patternsPath)) {
    console.error('Error: patterns directory not found');
    return 1;
  }

  console.log('='.repeat(60));
  console.log('ORCHESTRATION PATTERNS (Anthropic)');
  console.log('='.repeat(60));

  try {
    const files = require('fs').readdirSync(patternsPath).filter((f: string) => f.endsWith('.yaml'));
    for (const file of files.sort()) {
      const filePath = resolve(patternsPath, file);
      const config = loadYamlFile(filePath);
      const name = config.name || file.replace('.yaml', '');
      const desc = (config.description || '').split('\n')[0].substring(0, 60);

      console.log(`\n${name}`);
      console.log('-'.repeat(40));
      console.log(`  ${desc}`);

      const useWhen = config.useWhen?.slice(0, 3) || [];
      if (useWhen.length > 0) {
        console.log(`\n  Use when:`);
        for (const item of useWhen) {
          console.log(`    • ${item}`);
        }
      }
    }
  } catch (error) {
    console.error('Error reading patterns:', error);
    return 1;
  }

  return 0;
}

// ============== MAIN ==============

const program = new Command();

program
  .name('automation')
  .description('Automation CLI - Manage prompts, agents, workflows, and orchestration')
  .version('1.0.0');

// Prompts commands
const promptsCmd = program
  .command('prompts')
  .description('Manage prompts');

promptsCmd
  .command('list')
  .description('List all prompts')
  .action(() => {
    process.exit(cmdPromptsList());
  });

promptsCmd
  .command('show <name>')
  .description('Show a prompt')
  .action((name) => {
    process.exit(cmdPromptsShow(name));
  });

promptsCmd
  .command('search <query>')
  .description('Search prompts')
  .action((query) => {
    process.exit(cmdPromptsSearch(query));
  });

// Agents commands
const agentsCmd = program
  .command('agents')
  .description('Manage agents');

agentsCmd
  .command('list')
  .description('List all agents')
  .action(() => {
    process.exit(cmdAgentsList());
  });

agentsCmd
  .command('show <name>')
  .description('Show agent details')
  .action((name) => {
    process.exit(cmdAgentsShow(name));
  });

// Workflows commands
const workflowsCmd = program
  .command('workflows')
  .description('Manage workflows');

workflowsCmd
  .command('list')
  .description('List all workflows')
  .action(() => {
    process.exit(cmdWorkflowsList());
  });

workflowsCmd
  .command('show <name>')
  .description('Show workflow details')
  .action((name) => {
    process.exit(cmdWorkflowsShow(name));
  });

// Route command
program
  .command('route <task>')
  .description('Route a task')
  .action((task) => {
    process.exit(cmdRoute(task));
  });

// Patterns command
program
  .command('patterns')
  .description('List orchestration patterns')
  .action(() => {
    process.exit(cmdPatternsList());
  });

// Validate command
program
  .command('validate')
  .description('Validate all automation assets')
  .action(() => {
    const { AssetValidator, printValidationResults } = require('../validation');
    const validator = new AssetValidator();
    const results = validator.validateAll();
    printValidationResults(results);
    const hasErrors = results.some((r: any) => !r.valid);
    process.exit(hasErrors ? 1 : 0);
  });

// Execute command
program
  .command('execute <workflowName>')
  .description('Execute a workflow')
  .option('-i, --input <json>', 'Input data as JSON string')
  .option('-d, --dry-run', 'Show execution plan without running')
  .action((workflowName, options) => {
    // Load workflow config
    const workflowsFile = resolve(AUTOMATION_PATH, 'workflows', 'config', 'workflows.yaml');
    const config = loadYamlFile(workflowsFile);
    const workflow = config.workflows?.[workflowName];

    if (!workflow) {
      console.error(`Workflow not found: ${workflowName}`);
      console.log('\nAvailable workflows:');
      for (const name of Object.keys(config.workflows || {})) {
        console.log(`  - ${name}`);
      }
      process.exit(1);
    }

    // Parse input
    let input = {};
    if (options.input) {
      try {
        input = JSON.parse(options.input);
      } catch {
        console.error('Invalid JSON input');
        process.exit(1);
      }
    }

    if (options.dryRun) {
      console.log('='.repeat(60));
      console.log('EXECUTION PLAN (DRY RUN)');
      console.log('='.repeat(60));
      console.log(`\nWorkflow: ${workflowName}`);
      console.log(`Description: ${workflow.description || 'N/A'}`);
      console.log(`Pattern: ${workflow.pattern || 'sequential'}`);
      console.log(`\nStages:`);
      for (const [stageName, stage] of Object.entries(workflow.stages || {})) {
        const s = stage as any;
        console.log(`  ${stageName}: ${s.agent || 'default'} -> ${s.action || 'execute'}`);
      }
      console.log(`\nInput: ${JSON.stringify(input, null, 2)}`);
      process.exit(0);
    }

    const { WorkflowExecutor } = require('../executor');
    const executor = new WorkflowExecutor();

    executor.execute({ name: workflowName, ...workflow }, input)
      .then((result: any) => {
        console.log('='.repeat(60));
        console.log('EXECUTION RESULT');
        console.log('='.repeat(60));
        console.log(`\nWorkflow: ${workflowName}`);
        console.log(`Status: ${result.status}`);
        if (result.outputs && Object.keys(result.outputs).length > 0) {
          console.log(`\nOutputs:`);
          console.log(JSON.stringify(result.outputs, null, 2));
        }
        process.exit(result.status === 'completed' ? 0 : 1);
      })
      .catch((err: Error) => {
        console.error('Execution failed:', err.message);
        process.exit(1);
      });
  });

// Info command
program
  .command('info')
  .description('Show automation system info')
  .action(() => {
    console.log('='.repeat(60));
    console.log('AUTOMATION SYSTEM INFO');
    console.log('='.repeat(60));
    console.log(`\nVersion: 1.0.0`);
    console.log(`Automation Path: ${AUTOMATION_PATH}`);
    console.log(`\nAssets:`);

    // Count assets
    const agentsFile = resolve(AUTOMATION_PATH, 'agents', 'config', 'agents.yaml');
    const workflowsFile = resolve(AUTOMATION_PATH, 'workflows', 'config', 'workflows.yaml');
    const agents = loadYamlFile(agentsFile);
    const workflows = loadYamlFile(workflowsFile);

    const agentCount = Object.values(agents.agents || {}).flat().length;
    const workflowCount = Object.keys(workflows.workflows || {}).length;

    // Count prompts
    let promptCount = 0;
    for (const cat of ['system', 'project', 'tasks']) {
      const dir = resolve(AUTOMATION_PATH, 'prompts', cat);
      if (fileExists(dir)) {
        try {
          const files = require('fs').readdirSync(dir).filter((f: string) => f.endsWith('.md'));
          promptCount += files.length;
        } catch { /* ignore */ }
      }
    }

    console.log(`  - Prompts: ${promptCount}`);
    console.log(`  - Agents: ${agentCount}`);
    console.log(`  - Workflows: ${workflowCount}`);
    console.log(`  - Patterns: 5 (Anthropic)`);
    process.exit(0);
  });

// Crews command group
const crewsCmd = program
  .command('crews')
  .description('Manage multi-agent crews');

crewsCmd
  .command('list')
  .description('List all crews')
  .action(() => {
    const { cmdCrewsList } = require('../crews');
    process.exit(cmdCrewsList());
  });

crewsCmd
  .command('show <name>')
  .description('Show crew details')
  .action((name) => {
    const { cmdCrewsShow } = require('../crews');
    process.exit(cmdCrewsShow(name));
  });

crewsCmd
  .command('stats')
  .description('Show crews statistics')
  .action(() => {
    const { cmdCrewsStats } = require('../crews');
    process.exit(cmdCrewsStats());
  });

// Deploy command group
const deployCmd = program
  .command('deploy')
  .description('Deployment registry and templates');

deployCmd
  .command('list')
  .description('List all projects in registry')
  .action(() => {
    const { cmdDeployList } = require('../deployment');
    process.exit(cmdDeployList());
  });

deployCmd
  .command('show <name>')
  .description('Show project deployment details')
  .action((name) => {
    const { cmdDeployShow } = require('../deployment');
    process.exit(cmdDeployShow(name));
  });

deployCmd
  .command('templates')
  .description('List available deployment templates')
  .action(() => {
    const { cmdDeployTemplates } = require('../deployment');
    process.exit(cmdDeployTemplates());
  });

deployCmd
  .command('stats')
  .description('Show deployment statistics')
  .action(() => {
    const { cmdDeployStats } = require('../deployment');
    process.exit(cmdDeployStats());
  });

program.parse();
