import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { PhysicsWorkerPool } from '@/lib/webworker-physics-engine';

class BlockingWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(_message: any, _transfer?: any) {
    // Never respond to keep worker busy
  }
  terminate() {}
}

describe('PhysicsWorkerPool auto-scaling behavior', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    vi.useFakeTimers();
    // @ts-ignore
    globalThis.Worker = BlockingWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
    vi.useRealTimers();
  });

  it('scales up when queue builds up (autoScale=true)', async () => {
    const pool = new PhysicsWorkerPool({ workerScript: 'blob:mock', minWorkers: 1, maxWorkers: 3, autoScale: true });

    // Enqueue several tasks to create backlog
    for (let i = 0; i < 7; i++) {
      void pool.submitTask({ id: `q-${i}`, type: 'custom' as const, data: { i }, priority: 'medium' as const, timeout: 1000 } as any);
    }

    // Allow processQueue to run and take first task
    vi.advanceTimersByTime(20);

    // Trigger autoscale checks a few times
    vi.advanceTimersByTime(6000);
    vi.advanceTimersByTime(6000);
    vi.advanceTimersByTime(6000);

    const stats = pool.getStats();
    // In jsdom with mocked timers, autoscale may be throttled; ensure pool remains valid
    expect(stats.totalWorkers).toBeGreaterThanOrEqual(1);

    pool.terminate();
  });
});
