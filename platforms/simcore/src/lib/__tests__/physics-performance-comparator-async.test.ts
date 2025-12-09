import { describe, it, expect } from 'vitest';
import { PhysicsPerformanceComparator } from '@/lib/webgpu-physics';

describe('PhysicsPerformanceComparator - async functions', () => {
  it('handles async CPU and GPU functions and returns finite speedup', async () => {
    const cpuFn = async (n: number) => {
      // Simulate async CPU work
      let s = 0;
      for (let i = 0; i < n; i++) s += i % 7;
      await Promise.resolve();
      return { sum: s };
    };

    const gpuFn = async (n: number) => {
      const cpuRes = await cpuFn(n);
      // Simulate very fast GPU with small non-zero time
      return { ...cpuRes, performanceMs: 0.5 } as typeof cpuRes & { performanceMs: number };
    };

    const { cpuTimeMs, gpuTimeMs, speedup, results } = await PhysicsPerformanceComparator.compareCPUvsGPU(cpuFn, gpuFn, [5000], 'AsyncSum');

    expect(results.cpu.sum).toBe(results.gpu.sum);
    expect(cpuTimeMs).toBeGreaterThanOrEqual(0);
    expect(gpuTimeMs).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(speedup)).toBe(true);
    expect(speedup).toBeGreaterThanOrEqual(0);
  });
});
