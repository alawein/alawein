import { describe, it, expect } from 'vitest';
import { IsingSimulator } from '@/components/ising/IsingSimulator';

describe('IsingSimulator basic physics invariants', () => {
  it('magnetization extremes for all_up/all_down', () => {
    const sim = new IsingSimulator(8, 2.0, 0.0, 'metropolis');
    sim.setConfiguration('all_up');
    expect(sim.calculateMagnetization()).toBe(1);
    sim.setConfiguration('all_down');
    expect(sim.calculateMagnetization()).toBe(-1);
  });

  it('checkerboard energy per spin equals 2 at zero field', () => {
    const sim = new IsingSimulator(8, 2.0, 0.0, 'metropolis');
    sim.setConfiguration('checkerboard');
    const E = sim.calculateEnergy();
    expect(E).toBeCloseTo(2, 10);
  });

  it('high temperature drives magnetization toward zero', () => {
    const sim = new IsingSimulator(16, 5.0, 0.0, 'metropolis');
    sim.setConfiguration('random');
    for (let i = 0; i < 50; i++) sim.step();
    const m = Math.abs(sim.calculateMagnetization());
    expect(m).toBeLessThan(0.6);
  });

  it('magnetization histogram approximates normalized density', () => {
    const sim = new IsingSimulator(12, 3.0, 0.0, 'metropolis');
    const measurements: number[] = [];
    for (let i = 0; i < 120; i++) {
      sim.step();
      measurements.push(sim.calculateMagnetization());
    }
    const { bins, counts } = sim.calculateMagnetizationHistogram(measurements, 24);
    expect(bins.length).toBe(counts.length);
    if (bins.length > 1) {
      const binWidth = bins[1] - bins[0];
      const integral = counts.reduce((s, c) => s + c * binWidth, 0);
      expect(integral).toBeCloseTo(1, 1);
    }
  });
});
