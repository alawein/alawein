import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { getWebWorkerPhysicsEngine } from '@/lib/webworker-physics-engine';

// Minimal mock for Worker that echoes successful results for known task types
class MockWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, _transfer?: any) {
    const { id, type, data } = message;
    setTimeout(() => {
      let payload: any = {};
      if (type === 'matrix-diagonalization') {
        const { matrix, rows, cols } = data;
        // Interpret Float64Array diagonal matrix to compute largest diag element
        const arr = Array.from(new Float64Array(matrix));
        let maxDiag = -Infinity;
        for (let i = 0; i < rows; i++) {
          const val = arr[i * cols + i];
          if (typeof val === 'number' && isFinite(val)) maxDiag = Math.max(maxDiag, val);
        }
        payload = { eigenvalues: [maxDiag], eigenvectors: [Array(rows).fill(0).map((_, i) => (i === 0 ? 1 : 0))] };
      } else if (type === 'graphene-band-structure') {
        payload = { energyPlus: [1], energyMinus: [0] };
      } else if (type === 'monte-carlo') {
        payload = { finalConfiguration: [1, -1], magnetization: [0], energy: [0] };
      }
      this.onmessage?.({
        data: {
          id,
          success: true,
          data: payload,
          executionTime: 1,
          memoryUsed: 0,
        }
      } as unknown as MessageEvent);
    }, 0);
  }
  terminate() {}
}

describe('WebWorker Physics Engine', () => {
  const originalWorker = globalThis.Worker as any;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalHardwareConcurrency = (navigator as any).hardwareConcurrency;

  beforeAll(() => {
    // @ts-ignore
    globalThis.Worker = MockWorker as any;
    // Avoid Blob URL creation complexities
    // @ts-ignore
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock');
    // Stabilize worker count
    (navigator as any).hardwareConcurrency = 2;
  });

  afterAll(() => {
    // @ts-ignore
    globalThis.Worker = originalWorker;
    URL.createObjectURL = originalCreateObjectURL;
    (navigator as any).hardwareConcurrency = originalHardwareConcurrency;
    getWebWorkerPhysicsEngine().shutdown();
  });

  it('diagonalizes a small diagonal matrix via worker pool and returns timing', async () => {
    const matrix = [
      [2, 0],
      [0, 3],
    ];
    const result = await getWebWorkerPhysicsEngine().diagonalizeMatrix(matrix, { timeout: 1000 });
    expect(Array.isArray(result.eigenvalues)).toBe(true);
    expect(result.eigenvalues[0]).toBe(3);
    expect(result.computationTime).toBeGreaterThanOrEqual(0);
  });
});
