import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorkerPool } from '@/lib/webworker-physics-engine';

class FastWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, _transfer?: any) {
    setTimeout(() => {
      this.onmessage?.({
        data: {
          id: message.id,
          success: true,
          data: { ok: true },
          error: undefined,
          executionTime: 1,
          memoryUsed: 1,
        },
      } as MessageEvent);
    }, 1);
  }
  terminate() {}
}

describe('PhysicsWorkerPool - getWorkerStats returns per-worker stats', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = FastWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('returns stats for each worker with expected ids', async () => {
    const pool = new PhysicsWorkerPool({ workerScript: 'blob:mock', minWorkers: 2, maxWorkers: 2, autoScale: false });

    // Submit a couple tasks to populate stats
    await Promise.all([
      pool.submitTask({ id: 'a', type: 'custom' as const, data: {}, priority: 'medium' as const } as any),
      pool.submitTask({ id: 'b', type: 'custom' as const, data: {}, priority: 'medium' as const } as any),
    ]);

    const stats = pool.getWorkerStats();
    expect(stats.length).toBe(2);
    expect(stats[0].id).toBe('worker-0');
    expect(stats[1].id).toBe('worker-1');

    pool.terminate();
  });
});
