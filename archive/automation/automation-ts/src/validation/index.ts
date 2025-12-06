/**
 * Asset Validation System
 * Validates prompts, agents, workflows, and orchestration configs
 */

import { resolve } from 'path';
import { ValidationResult, ValidationIssue, Severity, AgentsConfig, WorkflowsConfig } from '../types';
import { loadYamlFile, loadMarkdownFile, fileExists, AUTOMATION_PATH } from '../utils/file';

class ValidationResultImpl implements ValidationResult {
  valid: boolean = true;
  target: string;
  issues: ValidationIssue[] = [];

  constructor(target: string) {
    this.target = target;
  }

  addError(message: string, path?: string, suggestion?: string): void {
    this.valid = false;
    this.issues.push({ severity: Severity.ERROR, message, path, suggestion });
  }

  addWarning(message: string, path?: string, suggestion?: string): void {
    this.issues.push({ severity: Severity.WARNING, message, path, suggestion });
  }

  addInfo(message: string, path?: string): void {
    this.issues.push({ severity: Severity.INFO, message, path });
  }

  get errorCount(): number {
    return this.issues.filter(i => i.severity === Severity.ERROR).length;
  }

  get warningCount(): number {
    return this.issues.filter(i => i.severity === Severity.WARNING).length;
  }
}

export class AssetValidator {
  private automationPath: string;

  constructor(automationPath?: string) {
    this.automationPath = automationPath || AUTOMATION_PATH;
  }

  validateAll(): ValidationResult[] {
    const results: ValidationResult[] = [];

    results.push(this.validateAgents());
    results.push(this.validateWorkflows());
    results.push(this.validatePrompts());
    results.push(this.validateOrchestration());

    return results;
  }

  validateAgents(): ValidationResult {
    const result = new ValidationResultImpl('agents');
    const agentsFile = resolve(this.automationPath, 'agents', 'config', 'agents.yaml');

    if (!fileExists(agentsFile)) {
      result.addError('agents.yaml not found', agentsFile, 'Create agents/config/agents.yaml');
      return result;
    }

    const config = loadYamlFile(agentsFile) as AgentsConfig;

    if (!config.agents || Object.keys(config.agents).length === 0) {
      result.addError('No agents defined', 'agents', 'Add at least one agent definition');
      return result;
    }

    // Validate each agent
    for (const [name, agent] of Object.entries(config.agents)) {
      if (!agent.role) {
        result.addWarning(`Agent '${name}' missing role`, `agents.${name}.role`);
      }
      if (!agent.goal) {
        result.addWarning(`Agent '${name}' missing goal`, `agents.${name}.goal`);
      }
      if (!agent.tools || agent.tools.length === 0) {
        result.addInfo(`Agent '${name}' has no tools defined`, `agents.${name}.tools`);
      }
    }

    // Validate categories reference existing agents
    if (config.categories) {
      for (const [catName, category] of Object.entries(config.categories)) {
        for (const agentName of category.agents || []) {
          if (!(agentName in config.agents)) {
            result.addError(
              `Category '${catName}' references non-existent agent '${agentName}'`,
              `categories.${catName}.agents`,
              `Add agent '${agentName}' or remove from category`
            );
          }
        }
      }
    }

    result.addInfo(`Validated ${Object.keys(config.agents).length} agents`);
    return result;
  }

  validateWorkflows(): ValidationResult {
    const result = new ValidationResultImpl('workflows');
    const workflowsFile = resolve(this.automationPath, 'workflows', 'config', 'workflows.yaml');

    if (!fileExists(workflowsFile)) {
      result.addError('workflows.yaml not found', workflowsFile, 'Create workflows/config/workflows.yaml');
      return result;
    }

    const config = loadYamlFile(workflowsFile) as WorkflowsConfig;

    if (!config.workflows || Object.keys(config.workflows).length === 0) {
      result.addError('No workflows defined', 'workflows', 'Add at least one workflow definition');
      return result;
    }

    // Load agents for cross-reference
    const agentsFile = resolve(this.automationPath, 'agents', 'config', 'agents.yaml');
    const agentsConfig = loadYamlFile(agentsFile) as AgentsConfig;
    const validAgents = new Set(Object.keys(agentsConfig.agents || {}));

    // Validate each workflow
    for (const [name, workflow] of Object.entries(config.workflows)) {
      if (!workflow.stages || workflow.stages.length === 0) {
        result.addError(`Workflow '${name}' has no stages`, `workflows.${name}.stages`);
        continue;
      }

      const validPatterns = ['prompt_chaining', 'routing', 'parallelization', 'orchestrator_workers', 'evaluator_optimizer'];
      if (workflow.pattern && !validPatterns.includes(workflow.pattern)) {
        result.addWarning(
          `Workflow '${name}' has unknown pattern '${workflow.pattern}'`,
          `workflows.${name}.pattern`,
          `Use one of: ${validPatterns.join(', ')}`
        );
      }

      // Validate stages
      const stageNames = new Set<string>();
      for (const [i, stage] of workflow.stages.entries()) {
        const stagePath = `workflows.${name}.stages[${i}]`;

        if (stage.name) {
          if (stageNames.has(stage.name)) {
            result.addError(`Duplicate stage name '${stage.name}'`, stagePath);
          }
          stageNames.add(stage.name);
        }

        if (stage.agent && !validAgents.has(stage.agent)) {
          result.addWarning(
            `Stage references unknown agent '${stage.agent}'`,
            `${stagePath}.agent`,
            `Define agent '${stage.agent}' in agents.yaml`
          );
        }

        if (stage.dependsOn) {
          for (const dep of stage.dependsOn) {
            if (!stageNames.has(dep)) {
              result.addError(
                `Stage depends on unknown stage '${dep}'`,
                `${stagePath}.dependsOn`,
                `Ensure '${dep}' is defined before this stage`
              );
            }
          }
        }
      }
    }

    result.addInfo(`Validated ${Object.keys(config.workflows).length} workflows`);
    return result;
  }

  validatePrompts(): ValidationResult {
    const result = new ValidationResultImpl('prompts');
    const promptsPath = resolve(this.automationPath, 'prompts');

    if (!fileExists(promptsPath)) {
      result.addError('prompts directory not found', promptsPath);
      return result;
    }

    const categories = ['system', 'project', 'tasks'];
    let totalPrompts = 0;

    for (const category of categories) {
      const categoryPath = resolve(promptsPath, category);
      if (!fileExists(categoryPath)) {
        result.addWarning(`Prompts category '${category}' not found`, categoryPath);
        continue;
      }

      try {
        const files = require('fs').readdirSync(categoryPath).filter((f: string) => f.endsWith('.md'));

        for (const file of files) {
          const filePath = resolve(categoryPath, file);
          const content = loadMarkdownFile(filePath);

          if (content.length === 0) {
            result.addWarning(`Empty prompt file`, filePath);
          } else if (content.length < 100) {
            result.addInfo(`Short prompt (${content.length} chars)`, filePath);
          }

          // Check for required sections
          if (!content.includes('#')) {
            result.addWarning(`Prompt missing headers`, filePath, 'Add markdown headers for structure');
          }

          totalPrompts++;
        }
      } catch (error) {
        result.addError(`Error reading prompts category '${category}'`, categoryPath);
      }
    }

    result.addInfo(`Validated ${totalPrompts} prompts`);
    return result;
  }

  validateOrchestration(): ValidationResult {
    const result = new ValidationResultImpl('orchestration');
    const orchFile = resolve(this.automationPath, 'orchestration', 'config', 'orchestration.yaml');

    if (!fileExists(orchFile)) {
      result.addError('orchestration.yaml not found', orchFile);
      return result;
    }

    const config = loadYamlFile(orchFile);

    const toolRouting = config.toolRouting || config.tool_routing;
    if (!toolRouting) {
      result.addWarning('No tool routing configuration', 'toolRouting');
    } else {
      const intentExtraction = toolRouting.intentExtraction || toolRouting.intent_extraction;
      if (!intentExtraction?.keywords) {
        result.addWarning('No intent extraction keywords defined', 'toolRouting.intentExtraction.keywords');
      }
      if (!toolRouting.rules) {
        result.addWarning('No routing rules defined', 'toolRouting.rules');
      }
    }

    // Validate patterns
    const patternsPath = resolve(this.automationPath, 'orchestration', 'patterns');
    if (fileExists(patternsPath)) {
      try {
        const files = require('fs').readdirSync(patternsPath).filter((f: string) => f.endsWith('.yaml'));
        result.addInfo(`Found ${files.length} orchestration patterns`);
      } catch {
        result.addWarning('Could not read patterns directory', patternsPath);
      }
    }

    return result;
  }
}

export function printValidationResults(results: ValidationResult[]): void {
  console.log('='.repeat(60));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(60));

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const result of results) {
    const status = result.valid ? '✓' : '✗';
    console.log(`\n${status} ${result.target.toUpperCase()}`);
    console.log('-'.repeat(40));

    for (const issue of result.issues) {
      const icon = issue.severity === Severity.ERROR ? '✗' :
                   issue.severity === Severity.WARNING ? '!' : 'i';
      console.log(`  ${icon} [${issue.severity}] ${issue.message}`);
      if (issue.path) {
        console.log(`    Path: ${issue.path}`);
      }
      if (issue.suggestion) {
        console.log(`    Suggestion: ${issue.suggestion}`);
      }
    }

    totalErrors += result.errorCount;
    totalWarnings += result.warningCount;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Summary: ${totalErrors} errors, ${totalWarnings} warnings`);
  console.log('='.repeat(60));
}
