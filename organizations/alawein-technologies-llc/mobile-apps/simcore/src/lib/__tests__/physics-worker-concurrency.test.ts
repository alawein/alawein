import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorker } from '@/lib/webworker-physics-engine';

class SlowRespondingWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, _transfer?: any) {
    // Respond after a delay to keep the worker busy
    setTimeout(() => {
      this.onmessage?.({
        data: {
          id: message.id,
          success: true,
          data: { ok: true },
          error: undefined,
          executionTime: 25,
          memoryUsed: 1,
        },
      } as MessageEvent);
    }, 30);
  }
  terminate() {}
}

describe('PhysicsWorker concurrency - not available while busy', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = SlowRespondingWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('throws when a second task is submitted while first is running', async () => {
    const worker = new PhysicsWorker('blob:mock', 'w-busy');

    const t1 = { id: 'one', type: 'custom' as const, data: {}, priority: 'medium' as const, timeout: 200 };
    const p1 = worker.executeTask(t1);

    const t2 = { id: 'two', type: 'custom' as const, data: {}, priority: 'medium' as const, timeout: 200 };
    await expect(worker.executeTask(t2)).rejects.toThrow(/not available/i);

    const r1 = await p1;
    expect(r1.success).toBe(true);
    expect(worker.isWorkerAvailable()).toBe(true);

    worker.terminate();
  });
});
