import { describe, it, expect } from 'vitest';
import { PhysicsValidator } from '@/lib/physics-base';

describe('PhysicsValidator', () => {
  const validator = new PhysicsValidator();

  it('checks energy conservation for constant energies', () => {
    const energies = Array.from({ length: 10 }, () => 1.234);
    expect(validator.checkEnergyConservation(energies)).toBe(true);
  });

  it('detects non-conserved energy', () => {
    const energies = [1, 1.01, 1.03, 0.97, 1.02];
    expect(validator.checkEnergyConservation(energies)).toBe(false);
  });

  it('validates unitarity of rotation matrix', () => {
    const theta = Math.PI / 4;
    const U = [
      [Math.cos(theta), -Math.sin(theta)],
      [Math.sin(theta),  Math.cos(theta)],
    ];
    expect(validator.checkUnitarity(U)).toBe(true);
  });
});
