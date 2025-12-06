/**
 * Crews Module Tests
 */

import { CrewManager } from '../crews';

describe('CrewManager', () => {
  let manager: CrewManager;

  beforeEach(() => {
    manager = new CrewManager();
  });

  it('should list available crews', () => {
    const crews = manager.listCrews();
    expect(Array.isArray(crews)).toBe(true);
  });

  it('should get all crews with configurations', () => {
    const crews = manager.getAllCrews();
    expect(crews instanceof Map).toBe(true);
  });

  it('should get crew statistics', () => {
    const stats = manager.getStats();
    expect(stats).toHaveProperty('totalCrews');
    expect(stats).toHaveProperty('totalAgents');
    expect(stats).toHaveProperty('totalTasks');
    expect(stats).toHaveProperty('processTypes');
    expect(stats).toHaveProperty('categories');
  });

  it('should validate crew configuration', () => {
    const validConfig = {
      name: 'test_crew',
      description: 'Test crew',
      version: '1.0',
      agents: [
        {
          name: 'agent1',
          agentRef: 'test_agent',
          roleInCrew: 'Lead',
          responsibilities: ['Test'],
          delegationAuthority: true
        }
      ],
      tasks: [
        {
          name: 'task1',
          description: 'Test task',
          assignedTo: 'agent1',
          expectedOutput: 'Result'
        }
      ],
      process: {
        type: 'sequential' as const
      }
    };

    const result = manager.validateCrew(validConfig);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect invalid crew configuration', () => {
    const invalidConfig = {
      name: '',
      description: '',
      version: '1.0',
      agents: [],
      tasks: [],
      process: {
        type: 'sequential' as const
      }
    };

    const result = manager.validateCrew(invalidConfig);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should detect task assigned to unknown agent', () => {
    const config = {
      name: 'test_crew',
      description: 'Test',
      version: '1.0',
      agents: [
        {
          name: 'agent1',
          agentRef: 'test',
          roleInCrew: 'Lead',
          responsibilities: [],
          delegationAuthority: false
        }
      ],
      tasks: [
        {
          name: 'task1',
          description: 'Test',
          assignedTo: 'unknown_agent',
          expectedOutput: 'Result'
        }
      ],
      process: {
        type: 'sequential' as const
      }
    };

    const result = manager.validateCrew(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('unknown agent'))).toBe(true);
  });
});
