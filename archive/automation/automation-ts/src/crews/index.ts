/**
 * Crews Module
 * Manages multi-agent crew definitions and execution
 */

import { resolve } from 'path';
import { readdirSync } from 'fs';
import { AUTOMATION_PATH, loadYamlFile, fileExists } from '../utils/file';

export interface CrewAgent {
  name: string;
  agentRef: string;
  roleInCrew: string;
  responsibilities: string[];
  delegationAuthority: boolean;
}

export interface CrewTask {
  name: string;
  description: string;
  assignedTo: string;
  dependsOn?: string[];
  expectedOutput: string;
  condition?: string;
}

export interface CrewProcess {
  type: 'sequential' | 'hierarchical' | 'parallel';
  manager?: string;
  communication?: {
    verbose?: boolean;
    shareContext?: boolean;
    maxContextTokens?: number;
    codeSharing?: boolean;
  };
}

export interface QualityGate {
  afterTask: string;
  condition: string;
  onFail: string;
  message?: string;
}

export interface CrewOutput {
  format: string;
  sections?: string[];
  deliverables?: Array<{
    name: string;
    type: string;
    format: string;
  }>;
}

export interface CrewExecution {
  maxIterations: number;
  timeoutMinutes: number;
  checkpointEnabled: boolean;
  onError?: {
    strategy: string;
    maxRetries?: number;
    escalateAfter?: number;
  };
}

export interface CrewConfig {
  name: string;
  description: string;
  version: string;
  agents: CrewAgent[];
  tasks: CrewTask[];
  process: CrewProcess;
  qualityGates?: QualityGate[];
  output?: CrewOutput;
  execution?: CrewExecution;
  metadata?: {
    created?: string;
    category?: string;
    tags?: string[];
  };
}

export class CrewManager {
  private crewsPath: string;

  constructor() {
    this.crewsPath = resolve(AUTOMATION_PATH, 'orchestration', 'crews');
  }

  /**
   * List all available crews
   */
  listCrews(): string[] {
    if (!fileExists(this.crewsPath)) {
      return [];
    }
    try {
      return readdirSync(this.crewsPath)
        .filter(f => f.endsWith('.yaml'))
        .map(f => f.replace('.yaml', ''));
    } catch {
      return [];
    }
  }

  /**
   * Load a crew configuration
   */
  loadCrew(name: string): CrewConfig | null {
    const crewFile = resolve(this.crewsPath, `${name}.yaml`);
    if (!fileExists(crewFile)) {
      // Try with _crew suffix
      const altFile = resolve(this.crewsPath, `${name}_crew.yaml`);
      if (!fileExists(altFile)) {
        return null;
      }
      return this.normalizeConfig(loadYamlFile(altFile));
    }
    return this.normalizeConfig(loadYamlFile(crewFile));
  }

  /**
   * Normalize YAML config (handle snake_case to camelCase)
   */
  private normalizeConfig(raw: any): CrewConfig {
    return {
      name: raw.name,
      description: raw.description,
      version: raw.version,
      agents: (raw.agents || []).map((a: any) => ({
        name: a.name,
        agentRef: a.agent_ref || a.agentRef,
        roleInCrew: a.role_in_crew || a.roleInCrew,
        responsibilities: a.responsibilities || [],
        delegationAuthority: a.delegation_authority ?? a.delegationAuthority ?? false
      })),
      tasks: (raw.tasks || []).map((t: any) => ({
        name: t.name,
        description: t.description,
        assignedTo: t.assigned_to || t.assignedTo,
        dependsOn: t.depends_on || t.dependsOn,
        expectedOutput: t.expected_output || t.expectedOutput,
        condition: t.condition
      })),
      process: {
        type: raw.process?.type || 'sequential',
        manager: raw.process?.manager,
        communication: raw.process?.communication
      },
      qualityGates: (raw.quality_gates || raw.qualityGates || []).map((g: any) => ({
        afterTask: g.after_task || g.afterTask,
        condition: g.condition,
        onFail: g.on_fail || g.onFail,
        message: g.message
      })),
      output: raw.output,
      execution: raw.execution,
      metadata: raw.metadata
    };
  }

  /**
   * Get all crews with their configurations
   */
  getAllCrews(): Map<string, CrewConfig> {
    const crews = new Map<string, CrewConfig>();
    for (const name of this.listCrews()) {
      const config = this.loadCrew(name);
      if (config) {
        crews.set(name, config);
      }
    }
    return crews;
  }

  /**
   * Get crew statistics
   */
  getStats(): {
    totalCrews: number;
    totalAgents: number;
    totalTasks: number;
    processTypes: Record<string, number>;
    categories: Record<string, number>;
  } {
    const crews = this.getAllCrews();
    const processTypes: Record<string, number> = {};
    const categories: Record<string, number> = {};
    let totalAgents = 0;
    let totalTasks = 0;

    for (const [, config] of crews) {
      totalAgents += config.agents?.length || 0;
      totalTasks += config.tasks?.length || 0;

      const processType = config.process?.type || 'unknown';
      processTypes[processType] = (processTypes[processType] || 0) + 1;

      const category = config.metadata?.category || 'uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    }

    return {
      totalCrews: crews.size,
      totalAgents,
      totalTasks,
      processTypes,
      categories
    };
  }

  /**
   * Validate a crew configuration
   */
  validateCrew(config: CrewConfig): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config.name) {
      errors.push('Crew must have a name');
    }

    if (!config.agents || config.agents.length === 0) {
      errors.push('Crew must have at least one agent');
    }

    if (!config.tasks || config.tasks.length === 0) {
      errors.push('Crew must have at least one task');
    }

    // Validate task assignments
    const agentNames = new Set(config.agents?.map(a => a.name) || []);
    for (const task of config.tasks || []) {
      if (task.assignedTo && !agentNames.has(task.assignedTo)) {
        errors.push(`Task '${task.name}' assigned to unknown agent '${task.assignedTo}'`);
      }
    }

    // Validate task dependencies
    const taskNames = new Set(config.tasks?.map(t => t.name) || []);
    for (const task of config.tasks || []) {
      for (const dep of task.dependsOn || []) {
        if (!taskNames.has(dep)) {
          errors.push(`Task '${task.name}' depends on unknown task '${dep}'`);
        }
      }
    }

    // Validate process manager
    if (config.process?.type === 'hierarchical' && config.process.manager) {
      if (!agentNames.has(config.process.manager)) {
        warnings.push(`Process manager '${config.process.manager}' not found in agents`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// CLI command handlers
export function cmdCrewsList(): number {
  const manager = new CrewManager();
  const crews = manager.getAllCrews();

  if (crews.size === 0) {
    console.log('No crews found.');
    return 1;
  }

  console.log('='.repeat(60));
  console.log('AVAILABLE CREWS');
  console.log('='.repeat(60));

  for (const [name, config] of crews) {
    const agentCount = config.agents?.length || 0;
    const taskCount = config.tasks?.length || 0;
    const processType = config.process?.type || 'unknown';

    console.log(`\n${config.name || name}`);
    console.log('-'.repeat(40));
    console.log(`  Description: ${config.description || 'N/A'}`);
    console.log(`  Process: ${processType}`);
    console.log(`  Agents: ${agentCount}`);
    console.log(`  Tasks: ${taskCount}`);

    if (config.metadata?.tags) {
      console.log(`  Tags: ${config.metadata.tags.join(', ')}`);
    }
  }

  const stats = manager.getStats();
  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${stats.totalCrews} crews, ${stats.totalAgents} agents, ${stats.totalTasks} tasks`);

  return 0;
}

export function cmdCrewsShow(name: string): number {
  const manager = new CrewManager();
  const config = manager.loadCrew(name);

  if (!config) {
    console.error(`Crew not found: ${name}`);
    console.log('\nAvailable crews:');
    for (const crewName of manager.listCrews()) {
      console.log(`  - ${crewName}`);
    }
    return 1;
  }

  console.log('='.repeat(60));
  console.log(`CREW: ${config.name}`);
  console.log('='.repeat(60));

  console.log(`\nDescription: ${config.description || 'N/A'}`);
  console.log(`Version: ${config.version || 'N/A'}`);
  console.log(`Process Type: ${config.process?.type || 'N/A'}`);

  if (config.process?.manager) {
    console.log(`Manager: ${config.process.manager}`);
  }

  console.log('\nAgents:');
  for (const agent of config.agents || []) {
    console.log(`  ${agent.name} (${agent.roleInCrew})`);
    console.log(`    Agent Ref: ${agent.agentRef}`);
    console.log(`    Delegation: ${agent.delegationAuthority ? 'Yes' : 'No'}`);
    if (agent.responsibilities?.length > 0) {
      console.log(`    Responsibilities:`);
      for (const resp of agent.responsibilities.slice(0, 3)) {
        console.log(`      - ${resp}`);
      }
    }
  }

  console.log('\nTasks:');
  for (const task of config.tasks || []) {
    console.log(`  ${task.name}`);
    console.log(`    Assigned to: ${task.assignedTo}`);
    console.log(`    Output: ${task.expectedOutput}`);
    if (task.dependsOn?.length) {
      console.log(`    Depends on: ${task.dependsOn.join(', ')}`);
    }
  }

  if (config.qualityGates?.length) {
    console.log('\nQuality Gates:');
    for (const gate of config.qualityGates) {
      console.log(`  After ${gate.afterTask}: ${gate.condition} → ${gate.onFail}`);
    }
  }

  // Validate
  const validation = manager.validateCrew(config);
  if (!validation.valid) {
    console.log('\nValidation Errors:');
    for (const error of validation.errors) {
      console.log(`  ✗ ${error}`);
    }
  }
  if (validation.warnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of validation.warnings) {
      console.log(`  ! ${warning}`);
    }
  }

  return 0;
}

export function cmdCrewsStats(): number {
  const manager = new CrewManager();
  const stats = manager.getStats();

  console.log('='.repeat(60));
  console.log('CREWS STATISTICS');
  console.log('='.repeat(60));

  console.log(`\nTotal Crews: ${stats.totalCrews}`);
  console.log(`Total Agents: ${stats.totalAgents}`);
  console.log(`Total Tasks: ${stats.totalTasks}`);

  console.log('\nProcess Types:');
  for (const [type, count] of Object.entries(stats.processTypes)) {
    console.log(`  ${type.padEnd(20)} ${count}`);
  }

  console.log('\nCategories:');
  for (const [category, count] of Object.entries(stats.categories)) {
    console.log(`  ${category.padEnd(20)} ${count}`);
  }

  return 0;
}
