/**
 * Validation Tests
 */

import { AssetValidator } from '../validation';

describe('AssetValidator', () => {
  let validator: AssetValidator;

  beforeAll(() => {
    validator = new AssetValidator();
  });

  it('should validate agents without errors', () => {
    const result = validator.validateAgents();
    expect(result.valid).toBe(true);
  });

  it('should validate workflows without errors', () => {
    const result = validator.validateWorkflows();
    expect(result.valid).toBe(true);
  });

  it('should validate prompts without errors', () => {
    const result = validator.validatePrompts();
    expect(result.valid).toBe(true);
  });

  it('should validate orchestration without errors', () => {
    const result = validator.validateOrchestration();
    expect(result.valid).toBe(true);
  });

  it('should validate all assets', () => {
    const results = validator.validateAll();
    expect(results).toHaveLength(4);
    expect(results.every(r => r.valid)).toBe(true);
  });
});
