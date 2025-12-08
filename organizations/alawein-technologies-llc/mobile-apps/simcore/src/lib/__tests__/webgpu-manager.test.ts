import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebGPUManager, webgpuManager } from '@/lib/webgpu-manager';

describe('WebGPU Manager - feature detection and fallback', () => {
  let originalNavigatorGpu: any;

  beforeAll(() => {
    // Ensure WebGPU is not available in tests
    // @ts-ignore
    originalNavigatorGpu = (navigator as any).gpu;
    // @ts-ignore
    delete (navigator as any).gpu;
  });

  afterAll(() => {
    // @ts-ignore
    (navigator as any).gpu = originalNavigatorGpu;
    webgpuManager.destroy();
  });

  it('detects lack of WebGPU support under jsdom', async () => {
    expect(WebGPUManager.isWebGPUSupported()).toBe(false);
    const ok = await webgpuManager.initialize();
    expect(ok).toBe(false);
    expect(webgpuManager.getDevice()).toBeNull();
  });
});
