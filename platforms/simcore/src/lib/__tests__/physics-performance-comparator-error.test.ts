import { describe, it, expect } from 'vitest';
import { PhysicsPerformanceComparator } from '@/lib/webgpu-physics';

describe('PhysicsPerformanceComparator - GPU error handling', () => {
  it('rejects when the GPU function throws', async () => {
    const cpuFn = (n: number) => {
      let s = 0;
      for (let i = 0; i < n; i++) s += i;
      return { sum: s };
    };

    const gpuFn = async (_n: number) => {
      throw new Error('GPU failed');
    };

    await expect(
      PhysicsPerformanceComparator.compareCPUvsGPU(cpuFn, gpuFn as any, [1000], 'SumErr')
    ).rejects.toThrow(/GPU failed/i);
  });
});
