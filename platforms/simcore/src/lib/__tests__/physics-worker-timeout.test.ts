import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorker } from '@/lib/webworker-physics-engine';

class NoopWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(_message: any, _transfer?: any) {
    // Intentionally do nothing to trigger timeout
  }
  terminate() {}
}

describe('PhysicsWorker timeout handling', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = NoopWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
  });

  it('rejects a task when timeout elapses without a response', async () => {
    const worker = new PhysicsWorker('blob:noop', 'w-timeout');
    const task = {
      id: 't1',
      type: 'custom' as const,
      data: { payload: 42 },
      priority: 'medium' as const,
      timeout: 20,
    };

    await expect(worker.executeTask(task)).rejects.toThrow(/timed out/i);
  });
});
