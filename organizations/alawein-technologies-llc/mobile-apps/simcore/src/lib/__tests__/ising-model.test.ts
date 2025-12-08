import { describe, test, expect } from 'vitest';
import { IsingModel2D } from '../enhanced-physics';

/**
 * 2D Ising Model Tests
 * - Magnetization bounds [-1,1]
 * - Higher order at low T than high T (statistical trend)
 */

describe('IsingModel2D - Magnetization and temperature dependence', () => {
  test('magnetization stays within [-1, 1]', () => {
    const model = new IsingModel2D(32, 2.27, 1.0);
    for (let s = 0; s < 50; s++) model.metropolisStep();
    const M = model.calculateMagnetization();
    expect(M).toBeGreaterThanOrEqual(-1);
    expect(M).toBeLessThanOrEqual(1);
  });

  test('low temperature shows higher |M| than high temperature (trend)', () => {
    const lowT = new IsingModel2D(32, 1.5, 1.0);
    for (let s = 0; s < 200; s++) lowT.metropolisStep();
    const Mlow = Math.abs(lowT.calculateMagnetization());

    const highT = new IsingModel2D(32, 5.0, 1.0);
    for (let s = 0; s < 200; s++) highT.metropolisStep();
    const Mhigh = Math.abs(highT.calculateMagnetization());

    expect(Mlow).toBeGreaterThan(Mhigh);
  });
});
