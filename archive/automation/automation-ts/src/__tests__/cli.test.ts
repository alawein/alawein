/**
 * CLI Tests
 */

import { resolve } from 'path';
import { existsSync } from 'fs';
import { AUTOMATION_PATH, loadYamlFile, fileExists } from '../utils/file';

describe('Automation Path', () => {
  it('should point to valid automation directory', () => {
    expect(existsSync(AUTOMATION_PATH)).toBe(true);
  });

  it('should contain agents config', () => {
    const agentsPath = resolve(AUTOMATION_PATH, 'agents', 'config', 'agents.yaml');
    expect(existsSync(agentsPath)).toBe(true);
  });

  it('should contain workflows config', () => {
    const workflowsPath = resolve(AUTOMATION_PATH, 'workflows', 'config', 'workflows.yaml');
    expect(existsSync(workflowsPath)).toBe(true);
  });

  it('should contain orchestration config', () => {
    const orchPath = resolve(AUTOMATION_PATH, 'orchestration', 'config', 'orchestration.yaml');
    expect(existsSync(orchPath)).toBe(true);
  });
});

describe('YAML Loading', () => {
  it('should load agents.yaml', () => {
    const agentsPath = resolve(AUTOMATION_PATH, 'agents', 'config', 'agents.yaml');
    const agents = loadYamlFile(agentsPath);
    expect(agents).toBeDefined();
    expect(agents.agents).toBeDefined();
  });

  it('should load workflows.yaml', () => {
    const workflowsPath = resolve(AUTOMATION_PATH, 'workflows', 'config', 'workflows.yaml');
    const workflows = loadYamlFile(workflowsPath);
    expect(workflows).toBeDefined();
    expect(workflows.workflows).toBeDefined();
  });

  it('should return empty object for non-existent file', () => {
    const result = loadYamlFile('/non/existent/path.yaml');
    expect(result).toEqual({});
  });
});

describe('File Utils', () => {
  it('fileExists returns true for existing files', () => {
    const agentsPath = resolve(AUTOMATION_PATH, 'agents', 'config', 'agents.yaml');
    expect(fileExists(agentsPath)).toBe(true);
  });

  it('fileExists returns false for non-existing files', () => {
    expect(fileExists('/non/existent/file.txt')).toBe(false);
  });
});
