import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PhysicsWorker } from '@/lib/webworker-physics-engine';

let capturedTransfers: any[] | undefined;

class TransferCaptureWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, transfer?: any[]) {
    capturedTransfers = transfer;
    setTimeout(() => {
      this.onmessage?.({
        data: {
          id: message.id,
          success: true,
          data: { echoed: true },
          error: undefined,
          executionTime: 4,
          memoryUsed: 2,
        },
      } as MessageEvent);
    }, 5);
  }
  terminate() {}
}

describe('PhysicsWorker transferable objects', () => {
  const originalWorker = globalThis.Worker as any;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = TransferCaptureWorker as any;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
    capturedTransfers = undefined;
  });

  it('passes Transferable buffers to postMessage', async () => {
    const worker = new PhysicsWorker('blob:transfer', 'w-transfer');

    const arr = new Float32Array(16);
    const task = {
      id: 't-transfer',
      type: 'custom' as const,
      data: { size: arr.length },
      priority: 'medium' as const,
      timeout: 100,
      transferable: [arr.buffer],
    };

    const res = await worker.executeTask(task as any);
    expect(res.success).toBe(true);
    expect(Array.isArray(capturedTransfers)).toBe(true);
    expect(capturedTransfers && capturedTransfers[0]).toBe(arr.buffer);

    worker.terminate();
  });
});
