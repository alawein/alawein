/**
 * Deployment Module
 * Integrates with the Python deployment registry and templates
 */

import { resolve } from 'path';
import { readdirSync } from 'fs';
import { AUTOMATION_PATH, loadYamlFile, fileExists } from '../utils/file';

export interface Project {
  name: string;
  type: string;
  path: string;
  deployment_guide?: string;
  deployment_guides?: string[];
  stack?: string[];
  platforms?: string[];
  environments?: string[];
  description?: string;
}

export interface Organization {
  projects: Project[];
}

export interface DeploymentRegistry {
  version: string;
  updated: string;
  organizations: Record<string, Organization>;
}

export class DeploymentManager {
  private registryPath: string;
  private templatesPath: string;

  constructor() {
    this.registryPath = resolve(AUTOMATION_PATH, 'deployment', 'registry.yaml');
    this.templatesPath = resolve(AUTOMATION_PATH, 'deployment', 'templates');
  }

  /**
   * Load the deployment registry
   */
  loadRegistry(): DeploymentRegistry | null {
    if (!fileExists(this.registryPath)) {
      console.error('Deployment registry not found:', this.registryPath);
      return null;
    }
    return loadYamlFile(this.registryPath) as DeploymentRegistry;
  }

  /**
   * List all projects across organizations
   */
  listProjects(): { org: string; project: Project }[] {
    const registry = this.loadRegistry();
    if (!registry) return [];

    const projects: { org: string; project: Project }[] = [];
    for (const [orgName, org] of Object.entries(registry.organizations || {})) {
      for (const project of org.projects || []) {
        projects.push({ org: orgName, project });
      }
    }
    return projects;
  }

  /**
   * Find a project by name
   */
  findProject(name: string): { org: string; project: Project } | null {
    const projects = this.listProjects();
    const found = projects.find(p =>
      p.project.name.toLowerCase() === name.toLowerCase()
    );
    return found || null;
  }

  /**
   * List available templates
   */
  listTemplates(): string[] {
    if (!fileExists(this.templatesPath)) {
      return [];
    }
    try {
      return readdirSync(this.templatesPath)
        .filter(f => f.endsWith('.yaml') || f.endsWith('.toml') || f.endsWith('.json'))
        .map(f => f.replace(/\.(yaml|toml|json)$/, ''));
    } catch {
      return [];
    }
  }

  /**
   * Get template content
   */
  getTemplate(name: string): string | null {
    const extensions = ['.yaml', '.toml', '.json'];
    for (const ext of extensions) {
      const templatePath = resolve(this.templatesPath, name + ext);
      if (fileExists(templatePath)) {
        try {
          return require('fs').readFileSync(templatePath, 'utf-8');
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Get statistics about the registry
   */
  getStats(): {
    totalProjects: number;
    organizations: number;
    projectTypes: Record<string, number>;
    stacks: Record<string, number>;
  } {
    const projects = this.listProjects();
    const projectTypes: Record<string, number> = {};
    const stacks: Record<string, number> = {};

    for (const { project } of projects) {
      // Count project types
      const type = project.type || 'unknown';
      projectTypes[type] = (projectTypes[type] || 0) + 1;

      // Count stacks
      for (const stack of project.stack || []) {
        stacks[stack] = (stacks[stack] || 0) + 1;
      }
    }

    const registry = this.loadRegistry();
    return {
      totalProjects: projects.length,
      organizations: Object.keys(registry?.organizations || {}).length,
      projectTypes,
      stacks
    };
  }
}

// CLI command handlers
export function cmdDeployList(): number {
  const manager = new DeploymentManager();
  const projects = manager.listProjects();

  if (projects.length === 0) {
    console.log('No projects found in registry.');
    return 1;
  }

  console.log('='.repeat(60));
  console.log('DEPLOYMENT REGISTRY');
  console.log('='.repeat(60));

  // Group by organization
  const byOrg: Record<string, Project[]> = {};
  for (const { org, project } of projects) {
    if (!byOrg[org]) byOrg[org] = [];
    byOrg[org].push(project);
  }

  for (const [org, orgProjects] of Object.entries(byOrg)) {
    console.log(`\n${org.toUpperCase()} (${orgProjects.length} projects)`);
    console.log('-'.repeat(40));
    for (const project of orgProjects) {
      const stack = project.stack?.slice(0, 3).join(', ') || 'N/A';
      console.log(`  ${project.name.padEnd(25)} ${project.type.padEnd(15)} [${stack}]`);
    }
  }

  const stats = manager.getStats();
  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${stats.totalProjects} projects across ${stats.organizations} organizations`);

  return 0;
}

export function cmdDeployShow(name: string): number {
  const manager = new DeploymentManager();
  const found = manager.findProject(name);

  if (!found) {
    console.error(`Project not found: ${name}`);
    console.log('\nAvailable projects:');
    for (const { project } of manager.listProjects().slice(0, 10)) {
      console.log(`  - ${project.name}`);
    }
    return 1;
  }

  const { org, project } = found;

  console.log('='.repeat(60));
  console.log(`PROJECT: ${project.name}`);
  console.log('='.repeat(60));
  console.log(`\nOrganization: ${org}`);
  console.log(`Type: ${project.type}`);
  console.log(`Path: ${project.path}`);

  if (project.description) {
    console.log(`Description: ${project.description}`);
  }

  if (project.stack && project.stack.length > 0) {
    console.log(`\nStack:`);
    for (const s of project.stack) {
      console.log(`  - ${s}`);
    }
  }

  if (project.platforms && project.platforms.length > 0) {
    console.log(`\nPlatforms:`);
    for (const p of project.platforms) {
      console.log(`  - ${p}`);
    }
  }

  if (project.environments && project.environments.length > 0) {
    console.log(`\nEnvironments:`);
    for (const e of project.environments) {
      console.log(`  - ${e}`);
    }
  }

  if (project.deployment_guide) {
    console.log(`\nDeployment Guide: ${project.deployment_guide}`);
  }

  if (project.deployment_guides && project.deployment_guides.length > 0) {
    console.log(`\nDeployment Guides:`);
    for (const g of project.deployment_guides) {
      console.log(`  - ${g}`);
    }
  }

  return 0;
}

export function cmdDeployTemplates(): number {
  const manager = new DeploymentManager();
  const templates = manager.listTemplates();

  if (templates.length === 0) {
    console.log('No templates found.');
    return 1;
  }

  console.log('='.repeat(60));
  console.log('DEPLOYMENT TEMPLATES');
  console.log('='.repeat(60));

  for (const template of templates) {
    console.log(`  - ${template}`);
  }

  console.log(`\nTotal: ${templates.length} templates`);
  return 0;
}

export function cmdDeployStats(): number {
  const manager = new DeploymentManager();
  const stats = manager.getStats();

  console.log('='.repeat(60));
  console.log('DEPLOYMENT STATISTICS');
  console.log('='.repeat(60));

  console.log(`\nTotal Projects: ${stats.totalProjects}`);
  console.log(`Organizations: ${stats.organizations}`);

  console.log(`\nProject Types:`);
  for (const [type, count] of Object.entries(stats.projectTypes).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type.padEnd(20)} ${count}`);
  }

  console.log(`\nTechnology Stack:`);
  for (const [stack, count] of Object.entries(stats.stacks).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`  ${stack.padEnd(20)} ${count}`);
  }

  return 0;
}
