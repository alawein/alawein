import { describe, it, expect } from 'vitest';
import { PhysicsPerformanceComparator } from '@/lib/webgpu-physics';

describe('PhysicsPerformanceComparator - CPU throws propagates', () => {
  it('rejects when CPU function throws', async () => {
    const cpuFn = (_n: number) => { throw new Error('CPU fail'); };
    const gpuFn = async (_n: number) => ({ sum: 0, performanceMs: 1 });

    await expect(
      PhysicsPerformanceComparator.compareCPUvsGPU(cpuFn as any, gpuFn as any, [10], 'SumCPUThrow')
    ).rejects.toThrow(/CPU fail/i);
  });
});
