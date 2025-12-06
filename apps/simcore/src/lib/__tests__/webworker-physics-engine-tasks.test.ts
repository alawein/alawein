import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';

// We will dynamically import the engine after setting up mocks to avoid singleton side effects
let engine: any;

class TaskMockWorker {
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onerror: ((ev: ErrorEvent) => any) | null = null;
  constructor(public _scriptUrl: string) {}
  postMessage(message: any, _transfer?: any) {
    const { id, type } = message;
    setTimeout(() => {
      let payload: any = {};
      if (type === 'graphene-band-structure') {
        payload = { energyPlus: [2, 3], energyMinus: [-2, -3] };
      } else if (type === 'monte-carlo') {
        payload = { finalConfiguration: [1, -1], magnetization: [0.1, 0.2], energy: [-1, -0.5] };
      } else if (type === 'matrix-diagonalization') {
        // Fallback behavior if triggered
        payload = { eigenvalues: [1], eigenvectors: [[1]] };
      }
      this.onmessage?.({
        data: {
          id,
          success: true,
          data: payload,
          executionTime: 4,
          memoryUsed: 1,
        }
      } as unknown as MessageEvent);
    }, 2);
  }
  terminate() {}
}

const originalWorker = globalThis.Worker as any;
const originalCreateObjectURL = URL.createObjectURL;
const originalHardwareConcurrency = (navigator as any).hardwareConcurrency;

describe('WebWorkerPhysicsEngine task methods', () => {
  beforeAll(async () => {
    // @ts-ignore
    globalThis.Worker = TaskMockWorker as any;
    // @ts-ignore
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock');
    (navigator as any).hardwareConcurrency = 2;

    // Ensure a fresh module instance constructed with mocks
    vi.resetModules();
    const mod = await import('@/lib/webworker-physics-engine');
    engine = (mod as any).getWebWorkerPhysicsEngine();
  });

  afterAll(() => {
    // Cleanup engine and restore globals
    try { engine?.shutdown?.(); } catch {}
    // @ts-ignore
    globalThis.Worker = originalWorker;
    URL.createObjectURL = originalCreateObjectURL;
    (navigator as any).hardwareConcurrency = originalHardwareConcurrency;
  });

  beforeEach(() => {
    // Sanity check: stats available
    const stats = engine.getStats();
    expect(stats.totalWorkers).toBeGreaterThan(0);
  });

  it('calculates graphene band structure via worker and returns energies', async () => {
    const kPoints = [[0, 0], [1, 1]];
    const params = { t1: 2.7 };
    const res = await engine.calculateGrapheneBandStructure(kPoints, params, { timeout: 200 });

    expect(Array.isArray(res.energyPlus)).toBe(true);
    expect(Array.isArray(res.energyMinus)).toBe(true);
    expect(res.energyPlus).toEqual([2, 3]);
    expect(res.energyMinus).toEqual([-2, -3]);
    expect(res.computationTime).toBeGreaterThanOrEqual(0);
  });

  it('runs Monte Carlo simulation via worker and returns observables', async () => {
    const res = await engine.runMonteCarloSimulation(4, 2.5, 20, { timeout: 200 });

    expect(Array.isArray(res.finalConfiguration)).toBe(true);
    expect(res.finalConfiguration.length).toBeGreaterThan(0);
    expect(res.magnetization).toEqual([0.1, 0.2]);
    expect(res.energy).toEqual([-1, -0.5]);
    expect(res.computationTime).toBeGreaterThanOrEqual(0);
  });
});
