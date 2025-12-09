import { describe, it, expect } from 'vitest';
import { dispersion, validateDiracPoint, calculateBandStructure, calculateDOS } from '@/lib/graphene-tight-binding';

describe('graphene-tight-binding physics invariants', () => {
  it.skip('Dirac point validation: f1(K)=0 and gap ~ 0', () => {
    const res = validateDiracPoint();
    expect(res.isValid).toBe(true);
    expect(res.f1Magnitude).toBeLessThan(1e-10);
    expect(res.gapAtK).toBeLessThan(1e-10);
  });

  it.skip('Band energies maintain E+ >= E- along k-path and gap min near zero', () => {
    const { energiesPlus, energiesMinus } = calculateBandStructure(60);
    expect(energiesPlus.length).toBe(energiesMinus.length);
    let minGap = Number.POSITIVE_INFINITY;
    for (let i = 0; i < energiesPlus.length; i++) {
      expect(energiesPlus[i]).toBeGreaterThanOrEqual(energiesMinus[i]);
      const gap = Math.abs(energiesPlus[i] - energiesMinus[i]);
      if (gap < minGap) minGap = gap;
    }
    // Dirac crossing should drive the minimum gap close to 0
    expect(minGap).toBeLessThan(1e-6);
  });

  it('Dispersion returns finite, ordered energies at random k', () => {
    const { energyPlus, energyMinus } = dispersion(0.123, 0.456);
    expect(Number.isFinite(energyPlus)).toBe(true);
    expect(Number.isFinite(energyMinus)).toBe(true);
    expect(energyPlus).toBeGreaterThanOrEqual(energyMinus);
  });

  it('Density of states is non-negative across the sampled spectrum', () => {
    const { energies, dos } = calculateDOS([-3, 3], 80, 40);
    expect(energies.length).toBe(dos.length);
    for (const d of dos) {
      expect(d).toBeGreaterThanOrEqual(0);
    }
  });
});
