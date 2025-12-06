import { describe, test, expect } from 'vitest';
import { QuantumTunneling } from '../enhanced-physics';

/**
 * Quantum Tunneling Numerics & Units Tests
 * - Dimensional checks: transmission is dimensionless in [0,1]
 * - Limits: above-barrier T=1, vanishing-width T→1, wider barrier → smaller T
 */

describe('Quantum Tunneling - Transmission Coefficient', () => {
  test('is dimensionless and bounded for E < V0', () => {
    const E = 0.2;   // eV
    const V0 = 0.8;  // eV
    const a = 1.0;   // nm
    const T = QuantumTunneling.transmissionCoefficient(E, V0, a);
    expect(Number.isFinite(T)).toBe(true);
    expect(T).toBeGreaterThan(0);
    expect(T).toBeLessThan(1);
  });

  test('above the barrier (E >= V0) yields T = 1', () => {
    expect(QuantumTunneling.transmissionCoefficient(1.0, 0.8, 2.0)).toBe(1);
    expect(QuantumTunneling.transmissionCoefficient(0.5, 0.5, 2.0)).toBe(1);
  });

  test('transmission decreases monotonically with barrier width for E < V0', () => {
    const E = 0.1;  // eV
    const V0 = 0.5; // eV
    const aSmall = 0.1; // nm
    const aLarge = 2.0; // nm

    const Tsmall = QuantumTunneling.transmissionCoefficient(E, V0, aSmall);
    const Tlarge = QuantumTunneling.transmissionCoefficient(E, V0, aLarge);

    expect(Tsmall).toBeGreaterThan(Tlarge);
  });

  test('vanishing width a -> 0 gives T -> 1 (numerically near 1)', () => {
    const E = 0.3;  // eV
    const V0 = 0.8; // eV
    const aTiny = 1e-6; // nm
    const T = QuantumTunneling.transmissionCoefficient(E, V0, aTiny);
    expect(T).toBeGreaterThan(0.999); // close to 1
  });

  test('numerical stability for moderately large barriers', () => {
    const E = 0.05;  // eV
    const V0 = 1.0;  // eV
    const a = 10.0;  // nm
    const T = QuantumTunneling.transmissionCoefficient(E, V0, a);
    expect(Number.isFinite(T)).toBe(true);
    expect(T).toBeGreaterThanOrEqual(0);
    expect(T).toBeLessThanOrEqual(1);
  });
});
