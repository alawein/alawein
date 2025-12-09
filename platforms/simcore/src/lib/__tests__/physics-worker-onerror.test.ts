import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorker } from '@/lib/webworker-physics-engine';

class ErrorEventWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, _transfer?: any) {
    // Fire an error event, then never respond, causing a timeout
    setTimeout(() => {
      this.onerror?.(new ErrorEvent('error', { message: 'boom' }));
    }, 2);
  }
  terminate() {}
}

describe('PhysicsWorker onerror handling', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = ErrorEventWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('increments errorCount when onerror fires and recovers after timeout', async () => {
    const worker = new PhysicsWorker('blob:onerror', 'w-onerror');
    const task = {
      id: 'err-1',
      type: 'custom' as const,
      data: { v: 1 },
      priority: 'medium' as const,
      timeout: 15,
    };

    await expect(worker.executeTask(task)).rejects.toThrow(/timed out/i);

    const stats = worker.getStats();
    expect(stats.errorCount).toBeGreaterThanOrEqual(1); // onerror (+ possibly timeout)
    expect(worker.isWorkerAvailable()).toBe(true);

    worker.terminate();
  });
});
