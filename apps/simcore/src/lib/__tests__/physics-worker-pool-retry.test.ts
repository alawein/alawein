import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorkerPool } from '@/lib/webworker-physics-engine';

class RetryMockWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  private callCount = 0;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, _transfer?: any) {
    this.callCount++;
    if (this.callCount === 1) {
      // First call: never respond (cause timeout at PhysicsWorker level)
      // Do nothing
    } else {
      // Second call: succeed quickly
      setTimeout(() => {
        this.onmessage?.({
          data: {
            id: message.id,
            success: true,
            data: { ok: true },
            error: undefined,
            executionTime: 3,
            memoryUsed: 1,
          },
        } as MessageEvent);
      }, 5);
    }
  }
  terminate() {}
}

describe('PhysicsWorkerPool - retry on failure (timeout)', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = RetryMockWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('requeues a timed-out task when retries > 0 and eventually succeeds', async () => {
    const pool = new PhysicsWorkerPool({ workerScript: 'blob:mock', minWorkers: 1, maxWorkers: 1, autoScale: false });

    const task = {
      id: 'retry-1',
      type: 'custom' as const,
      data: { payload: 42 },
      priority: 'medium' as const,
      timeout: 20,
      retries: 1,
    };

    const result = await pool.submitTask(task as any);

    expect(result.success).toBe(true);
    const stats = pool.getStats();
    // One completion registered
    expect(stats.completedTasks).toBe(1);
    // At least one error recorded from the first (timed-out) attempt
    expect(stats.errorRate).toBeGreaterThan(0);

    pool.terminate();
  });
});
