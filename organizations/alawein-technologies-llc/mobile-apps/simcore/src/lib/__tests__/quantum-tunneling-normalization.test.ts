import { describe, test, expect } from 'vitest';
import PhysicsValidator from '../physics-validation';
import { QuantumTunneling } from '../enhanced-physics';

/**
 * Quantum Tunneling wavefunction normalization & stability
 * Uses PhysicsValidator.validateWaveFunction to check ∫|ψ|^2 dx ≈ 1 and finiteness.
 */

describe('Quantum Tunneling - Wavefunction normalization', () => {
  test('generated wavefunction is normalized (within tolerance) and finite', () => {
    const E = 0.3;   // eV
    const V0 = 0.8;  // eV
    const a = 2.0;   // nm
    const xRange = { min: -10, max: 10 };
    const nPoints = 2000;

    const { x, psi_real, psi_imag } = QuantumTunneling.generateWavefunction(E, V0, a, xRange, nPoints);
    const dx = (xRange.max - xRange.min) / nPoints;

    const result = PhysicsValidator.validateWaveFunction(psi_real, psi_imag, dx);

    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
    expect(result.warnings.length).toBe(0);
  });
});
