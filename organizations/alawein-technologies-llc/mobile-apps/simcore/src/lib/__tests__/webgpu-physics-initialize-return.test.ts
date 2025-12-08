import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeWebGPUPhysics } from '@/lib/webgpu-physics';

describe('initializeWebGPUPhysics - returns false flags under no-WebGPU', () => {
  let originalNavigatorGpu: any;

  beforeAll(() => {
    // Ensure WebGPU is unavailable
    // @ts-ignore
    originalNavigatorGpu = (navigator as any).gpu;
    // @ts-ignore
    delete (navigator as any).gpu;
  });

  afterAll(() => {
    // @ts-ignore
    (navigator as any).gpu = originalNavigatorGpu;
  });

  it('resolves with all flags false and overall=false', async () => {
    const res = await initializeWebGPUPhysics();
    expect(res.tdse).toBe(false);
    expect(res.llg).toBe(false);
    expect(res.tunneling).toBe(false);
    expect(res.overall).toBe(false);
  });
});
