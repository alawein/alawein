import { describe, it, expect } from 'vitest';
import { PhysicsPerformanceComparator } from '@/lib/webgpu-physics';

describe('PhysicsPerformanceComparator.compareCPUvsGPU', () => {
  it('returns comparable results and timing metrics', async () => {
    const cpuFn = (n: number) => {
      let s = 0;
      for (let i = 0; i < n; i++) s += i;
      return { sum: s };
    };

    const gpuFn = async (n: number) => {
      const res = cpuFn(n);
      // Simulate a fast GPU run with provided performanceMs
      return { ...res, performanceMs: 1 };
    };

    const n = 10000;
    const { cpuTimeMs, gpuTimeMs, speedup, results } = await PhysicsPerformanceComparator.compareCPUvsGPU(cpuFn, gpuFn, [n], 'Sum');

    expect(results.cpu.sum).toBe(results.gpu.sum);
    expect(cpuTimeMs).toBeGreaterThanOrEqual(0);
    expect(gpuTimeMs).toBeGreaterThanOrEqual(0);
    expect(speedup).toBeGreaterThanOrEqual(0);
  });
});
