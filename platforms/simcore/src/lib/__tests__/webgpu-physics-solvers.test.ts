import { describe, it, expect } from 'vitest';
import { WebGPUTDSESolver, WebGPULLGSolver, WebGPUTunnelingSolver, initializeWebGPUPhysics } from '@/lib/webgpu-physics';

// Under jsdom, navigator.gpu is absent, so solvers should not become ready

describe('WebGPU Physics Solvers - no WebGPU environment', () => {
  it('TDSE solver stays not ready after initialize()', async () => {
    const tdse = new WebGPUTDSESolver();
    expect(tdse.isReady()).toBe(false);
    await tdse.initialize();
    expect(tdse.isReady()).toBe(false);
  });

  it('LLG solver stays not ready after initialize()', async () => {
    const llg = new WebGPULLGSolver();
    expect(llg.isReady()).toBe(false);
    await llg.initialize();
    expect(llg.isReady()).toBe(false);
  });

  it('Tunneling solver stays not ready after initialize()', async () => {
    const tunneling = new WebGPUTunnelingSolver();
    expect(tunneling.isReady()).toBe(false);
    await tunneling.initialize();
    expect(tunneling.isReady()).toBe(false);
  });

  it('global initializer runs without throwing under no-WebGPU', async () => {
    // Should simply complete gracefully even if devices cannot be created
    await initializeWebGPUPhysics();
    expect(true).toBe(true);
  });
});
