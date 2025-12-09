import { describe, test, expect } from 'vitest';
import { solveLLGRK4, calculateEnergy, vec3 } from '../llg-numerics';

/**
 * LLG Numerics & Conservation Tests
 * - |m| preserved by RK4 integrator
 * - With damping, energy should decrease toward alignment (small dt, uniform field)
 */

describe('LLG Solver (RK4) - Normalization & Energy behavior', () => {
  test('|m| remains ~1 after integration step', () => {
    const m0: [number, number, number] = vec3.normalize([0.3, 0.4, 0.8660254]);
    const H: [number, number, number] = [0, 0, 1];
    const alpha = 0.1;
    const gamma = 2.21e5; // rad/s/T
    const dt = 1e-12;     // s

    const m1 = solveLLGRK4(m0, H, alpha, gamma, dt);
    const mag = vec3.magnitude(m1);
    expect(mag).toBeGreaterThan(0.999999);
    expect(mag).toBeLessThan(1.000001);
  });

  test('energy decreases over steps with damping (Zeeman + uniaxial anisotropy)', () => {
    let m: [number, number, number] = vec3.normalize([1, 0, 0]);
    const H: [number, number, number] = [0, 0, 1];
    const alpha = 0.2;
    const gamma = 2.21e5;
    const dt = 1e-12;
    const anisotropyStrength = 0.01;
    const easyAxis: [number, number, number] = [0, 0, 1];

    const energy = (v: [number, number, number]) =>
      calculateEnergy(v, H, anisotropyStrength, easyAxis);

    const E0 = energy(m);
    for (let i = 0; i < 500; i++) {
      m = solveLLGRK4(m, H, alpha, gamma, dt);
    }
    const E1 = energy(m);
    expect(E1).toBeLessThanOrEqual(E0 + 1e-9);
  });
});
