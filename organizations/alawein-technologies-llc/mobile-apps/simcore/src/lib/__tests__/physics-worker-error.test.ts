import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorker } from '@/lib/webworker-physics-engine';

class ErrorMockWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, _transfer?: any) {
    // Simulate async worker failure
    setTimeout(() => {
      this.onmessage?.({
        data: {
          id: message.id,
          success: false,
          data: undefined,
          error: 'Simulated failure',
          executionTime: 3,
          memoryUsed: 1,
        },
      } as MessageEvent);
    }, 5);
  }
  terminate() {}
}

describe('PhysicsWorker error path', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = ErrorMockWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('resolves with success=false and updates error stats on failure', async () => {
    const worker = new PhysicsWorker('blob:mock', 'w-error');
    const task = {
      id: 't-fail',
      type: 'custom' as const,
      data: { payload: 'x' },
      priority: 'medium' as const,
      timeout: 50,
    };

    const result = await worker.executeTask(task);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/simulated failure/i);

    // Worker becomes available again
    expect(worker.isWorkerAvailable()).toBe(true);

    const stats = worker.getStats();
    expect(stats.tasksCompleted).toBe(1);
    expect(stats.errorCount).toBe(1);
    expect(stats.averageExecutionTime).toBeGreaterThan(0);
    expect(stats.memoryUsage).toBeGreaterThanOrEqual(1);
    expect(stats.currentTask).toBeUndefined();

    worker.terminate();
  });
});
