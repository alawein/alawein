/**
 * Deployment Tests
 */

import { DeploymentManager } from '../deployment';

describe('DeploymentManager', () => {
  let manager: DeploymentManager;

  beforeAll(() => {
    manager = new DeploymentManager();
  });

  it('should load deployment registry', () => {
    const registry = manager.loadRegistry();
    expect(registry).toBeDefined();
    expect(registry?.organizations).toBeDefined();
  });

  it('should list projects', () => {
    const projects = manager.listProjects();
    expect(projects.length).toBeGreaterThan(0);
  });

  it('should find project by name', () => {
    const found = manager.findProject('MEZAN');
    expect(found).toBeDefined();
    expect(found?.project.name).toBe('MEZAN');
  });

  it('should return null for non-existent project', () => {
    const found = manager.findProject('NonExistentProject');
    expect(found).toBeNull();
  });

  it('should list templates', () => {
    const templates = manager.listTemplates();
    expect(templates.length).toBeGreaterThan(0);
    expect(templates).toContain('netlify');
  });

  it('should get template content', () => {
    const content = manager.getTemplate('netlify');
    expect(content).toBeDefined();
    expect(content?.length).toBeGreaterThan(0);
  });

  it('should return null for non-existent template', () => {
    const content = manager.getTemplate('nonexistent');
    expect(content).toBeNull();
  });

  it('should get stats', () => {
    const stats = manager.getStats();
    expect(stats.totalProjects).toBeGreaterThan(0);
    expect(stats.organizations).toBeGreaterThan(0);
  });
});
