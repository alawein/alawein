import { describe, test, expect } from 'vitest';
import { PhysicsUnits } from '../physics-validation';

/** PhysicsUnits conversions and roundtrips */

describe('PhysicsUnits - unit conversions', () => {
  test('eV <-> J roundtrip', () => {
    const eV = 3.5;
    const J = PhysicsUnits.eVToJoule(eV);
    const eV2 = PhysicsUnits.jouleToEV(J);
    expect(eV2).toBeCloseTo(eV, 12);
  });

  test('angstrom <-> meter roundtrip', () => {
    const A = 5.2;
    const m = PhysicsUnits.angstromToMeter(A);
    const A2 = PhysicsUnits.meterToAngstrom(m);
    expect(A2).toBeCloseTo(A, 12);
  });

  test('Hartree and Rydberg to eV', () => {
    expect(PhysicsUnits.hartreeToEV(1)).toBeCloseTo(27.211386245988, 9);
    expect(PhysicsUnits.rydbergToEV(1)).toBeCloseTo(PhysicsUnits.constants.Ry, 12);
  });
});
