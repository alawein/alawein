import { describe, test, expect } from 'vitest';
import PhysicsValidator from '../physics-validation';

/**
 * Validate thermal equilibrium using Boltzmann weights
 */

describe('PhysicsValidator - Thermal equilibrium (Boltzmann)', () => {
  test('populations follow Boltzmann distribution', () => {
    const energies = [0, 0.1, 0.2, 0.5]; // eV
    const T = 300; // K
    const kB = 8.617e-5; // eV/K
    const beta = 1 / (kB * T);
    const factors = energies.map(E => Math.exp(-beta * E));
    const Z = factors.reduce((s, f) => s + f, 0);
    const pops = factors.map(f => f / Z);

    const result = PhysicsValidator.validateThermalEquilibrium(energies, pops, T, kB);
    expect(result.isValid).toBe(true);
    expect(result.warnings.length).toBe(0);
    expect(result.metrics.maxPopulationError).toBeLessThan(1e-12);
  });
});
