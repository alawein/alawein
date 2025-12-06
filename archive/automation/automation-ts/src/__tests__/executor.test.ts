/**
 * Executor Tests
 */

import { WorkflowExecutor, createExecutor } from '../executor';

describe('WorkflowExecutor', () => {
  it('should create executor with default handler', () => {
    const executor = new WorkflowExecutor();
    expect(executor).toBeDefined();
  });

  it('should create executor via factory function', () => {
    const executor = createExecutor();
    expect(executor).toBeDefined();
  });

  it('should handle workflow with custom agent handler', async () => {
    const mockHandler = {
      invoke: jest.fn().mockResolvedValue({ success: true, data: 'test' })
    };

    const executor = new WorkflowExecutor({ agentHandler: mockHandler });
    expect(executor).toBeDefined();
    expect(mockHandler.invoke).not.toHaveBeenCalled(); // Not called until execute
  });
});
