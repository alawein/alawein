import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorker } from '@/lib/webworker-physics-engine';

class StatsMockWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, _transfer?: any) {
    const exec = message.data.exec as number;
    const mem = message.data.mem as number;
    setTimeout(() => {
      this.onmessage?.({
        data: {
          id: message.id,
          success: true,
          data: { ok: true },
          error: undefined,
          executionTime: exec,
          memoryUsed: mem,
        },
      } as MessageEvent);
    }, 2);
  }
  terminate() {}
}

describe('PhysicsWorker stats accumulation', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = StatsMockWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('updates total and average execution time and memory usage over multiple tasks', async () => {
    const worker = new PhysicsWorker('blob:mock', 'w-stats');

    const t1 = { id: 'a', type: 'custom' as const, data: { exec: 4, mem: 3 }, priority: 'medium' as const, timeout: 50 };
    const t2 = { id: 'b', type: 'custom' as const, data: { exec: 6, mem: 5 }, priority: 'medium' as const, timeout: 50 };

    const r1 = await worker.executeTask(t1);
    expect(r1.success).toBe(true);
    const s1 = worker.getStats();
    expect(s1.tasksCompleted).toBe(1);
    expect(s1.totalExecutionTime).toBe(4);
    expect(s1.averageExecutionTime).toBe(4);
    expect(s1.memoryUsage).toBe(3);

    const r2 = await worker.executeTask(t2);
    expect(r2.success).toBe(true);
    const s2 = worker.getStats();
    expect(s2.tasksCompleted).toBe(2);
    expect(s2.totalExecutionTime).toBe(10);
    expect(s2.averageExecutionTime).toBeCloseTo(5, 6);
    expect(s2.memoryUsage).toBe(5);

    worker.terminate();
  });
});
