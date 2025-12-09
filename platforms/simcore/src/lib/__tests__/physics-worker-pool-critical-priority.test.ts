import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorkerPool } from '@/lib/webworker-physics-engine';

const processedOrder: string[] = [];

class CriticalOrderingWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, _transfer?: any) {
    processedOrder.push(message.id);
    setTimeout(() => {
      this.onmessage?.({
        data: {
          id: message.id,
          success: true,
          data: { echoed: message.data },
          error: undefined,
          executionTime: 2,
          memoryUsed: 1,
        },
      } as MessageEvent);
    }, 5);
  }
  terminate() {}
}

describe('PhysicsWorkerPool - critical priority outranks others', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    processedOrder.length = 0;
    // @ts-ignore
    globalThis.Worker = CriticalOrderingWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('processes critical tasks before high/medium/low', async () => {
    const pool = new PhysicsWorkerPool({ workerScript: 'blob:mock', minWorkers: 1, maxWorkers: 1, autoScale: false });

    const tasks = [
      { id: 'low', type: 'custom' as const, data: { v: 1 }, priority: 'low' as const },
      { id: 'high', type: 'custom' as const, data: { v: 2 }, priority: 'high' as const },
      { id: 'critical', type: 'custom' as const, data: { v: 99 }, priority: 'critical' as const },
      { id: 'medium', type: 'custom' as const, data: { v: 3 }, priority: 'medium' as const },
    ];

    const results = await Promise.all(tasks.map(t => pool.submitTask(t as any)));
    results.forEach(r => expect(r.success).toBe(true));

    expect(processedOrder[0]).toBe('critical');

    const stats = pool.getStats();
    expect(stats.completedTasks).toBe(4);
    expect(stats.errorRate).toBe(0);

    pool.terminate();
  });
});
