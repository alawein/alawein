import { describe, it, expect } from 'vitest';
import { WebGPUTDSESolver, WebGPULLGSolver, WebGPUTunnelingSolver } from '@/lib/webgpu-physics';

// These tests verify that calling GPU solvers without initialization throws

describe('WebGPU Physics Solvers - behavior without initialization', () => {
  it('TDSE solver throws when used before initialize()', async () => {
    const tdse = new WebGPUTDSESolver();
    const psiR = new Float32Array([1, 0]);
    const psiI = new Float32Array([0, 0]);
    const V = new Float32Array([0, 0]);
    await expect(tdse.solveTDSEGPU(psiR, psiI, V, 0.01)).rejects.toThrow(/not initialized/i);
  });

  it('LLG solver throws when used before initialize()', async () => {
    const llg = new WebGPULLGSolver();
    const M = new Float32Array([1, 0, 0]);
    await expect(llg.solveLLGGPU(M, [0, 0, 1], 0.1, 1.76e11, 0.0, 1e-3)).rejects.toThrow(/not initialized/i);
  });

  it('Tunneling solver throws when used before initialize()', async () => {
    const tunneling = new WebGPUTunnelingSolver();
    const x = new Float32Array([0, 0.1, 0.2]);
    await expect(tunneling.calculateTunneling(x, 0.3, 0.8, 1.0)).rejects.toThrow(/not initialized/i);
  });
});
