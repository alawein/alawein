import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorkerPool } from '@/lib/webworker-physics-engine';

class NoResponseWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(_message: any, _transfer?: any) {
    // Intentionally never replies to force timeout
  }
  terminate() {}
}

describe('PhysicsWorkerPool - rejects when task times out and retries=0', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = NoResponseWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('rejects the task and does not mark completion', async () => {
    const pool = new PhysicsWorkerPool({ workerScript: 'blob:mock', minWorkers: 1, maxWorkers: 1, autoScale: false });

    const task = { id: 'timeout-0', type: 'custom' as const, data: {}, priority: 'medium' as const, timeout: 15, retries: 0 };

    await expect(pool.submitTask(task as any)).rejects.toThrow(/timed out/i);

    const stats = pool.getStats();
    expect(stats.completedTasks).toBe(0);

    pool.terminate();
  });
});
