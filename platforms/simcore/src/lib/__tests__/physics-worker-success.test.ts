import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorker } from '@/lib/webworker-physics-engine';

class SuccessMockWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, _transfer?: any) {
    // Simulate async worker completion
    setTimeout(() => {
      this.onmessage?.({
        data: {
          id: message.id,
          success: true,
          data: { echoed: message.data, type: message.type },
          error: undefined,
          executionTime: 7,
          memoryUsed: 2,
        },
      } as MessageEvent);
    }, 5);
  }
  terminate() {}
}

describe('PhysicsWorker success path', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = SuccessMockWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('resolves with result and updates stats on success', async () => {
    const worker = new PhysicsWorker('blob:mock', 'w-success');
    const task = {
      id: 't-ok',
      type: 'custom' as const,
      data: { payload: 123 },
      priority: 'high' as const,
      timeout: 50,
    };

    // Initially available
    expect(worker.isWorkerAvailable()).toBe(true);

    const result = await worker.executeTask(task);

    expect(result.success).toBe(true);
    expect(result.id).toBe(task.id);
    expect(result.data.echoed.payload).toBe(123);
    expect(result.executionTime).toBe(7);
    expect(result.memoryUsed).toBe(2);

    // Availability restored
    expect(worker.isWorkerAvailable()).toBe(true);

    const stats = worker.getStats();
    expect(stats.tasksCompleted).toBe(1);
    expect(stats.averageExecutionTime).toBeGreaterThan(0);
    expect(stats.memoryUsage).toBeGreaterThanOrEqual(2);
    expect(stats.currentTask).toBeUndefined();

    worker.terminate();
  });
});
