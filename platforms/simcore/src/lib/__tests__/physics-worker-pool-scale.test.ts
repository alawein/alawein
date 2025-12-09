import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorkerPool } from '@/lib/webworker-physics-engine';

class DummyWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(_message: any, _transfer?: any) {}
  terminate() {}
}

describe('PhysicsWorkerPool scaling', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = DummyWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('scales up and down within bounds and respects min/max', async () => {
    const pool = new PhysicsWorkerPool({ workerScript: 'blob:mock', minWorkers: 2, maxWorkers: 4, autoScale: false });

    let stats = pool.getStats();
    expect(stats.totalWorkers).toBe(2);
    expect(stats.availableWorkers).toBe(2);

    pool.scaleWorkers(4);
    stats = pool.getStats();
    expect(stats.totalWorkers).toBe(4);
    expect(stats.availableWorkers).toBe(4);

    // Request below min -> should clamp to 2
    pool.scaleWorkers(1);
    stats = pool.getStats();
    expect(stats.totalWorkers).toBe(2);
    expect(stats.availableWorkers).toBe(2);

    pool.terminate();
  });
});
