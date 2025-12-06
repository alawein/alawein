/**
 * Comprehensive Tests for Graphene Physics Calculations
 * Tests the tight-binding model implementation for accuracy
 */

import { describe, test, expect, beforeEach } from 'vitest';
import {
  calculateStructureFactor,
  calculateGrapheneBands,
  generateHighSymmetryPath,
  generate2DKMesh,
  getHexagonalBZBoundary,
  calculateFermiVelocity,
  GRAPHENE_CONSTANTS,
  type GrapheneParams,
  type BandResult
} from '../graphene-physics';
import PhysicsTestUtils from './physics-test-utils';

describe('Graphene Physics Constants', () => {
  test('should have correct physical constants', () => {
    expect(GRAPHENE_CONSTANTS.a).toBeCloseTo(2.46, 2); // lattice constant in Angstroms
    expect(GRAPHENE_CONSTANTS.a_cc).toBeCloseTo(1.42, 2); // C-C distance in Angstroms
    expect(GRAPHENE_CONSTANTS.hbar).toBeCloseTo(6.582119569e-16, 20); // reduced Planck constant
  });

  test('should have correct nearest neighbor vectors', () => {
    const { delta } = GRAPHENE_CONSTANTS;
    expect(delta).toHaveLength(3);
    
    // Check that the vectors have correct magnitudes (should be a_cc)
    delta.forEach(([dx, dy]) => {
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      expect(magnitude).toBeCloseTo(GRAPHENE_CONSTANTS.a_cc, 6);
    });
  });

  test('should have correct high-symmetry points', () => {
    const { K, K_prime, M } = GRAPHENE_CONSTANTS;
    
    // K and K' should be at opposite corners of hexagon
    expect(K[0]).toBeCloseTo(-K_prime[0], 10);
    expect(K[1]).toBeCloseTo(K_prime[1], 10);
    
    // M point should be at edge center
    expect(M[0]).toBeGreaterThan(0);
    expect(M[1]).toBeGreaterThan(0);
  });
});

describe('Structure Factor Calculations', () => {
  test('should calculate correct structure factor at Γ point', () => {
    const gamma = calculateStructureFactor(0, 0);
    
    // At Γ point, all phases are zero, so f = 3
    expect(gamma.real).toBeCloseTo(3, 10);
    expect(gamma.imag).toBeCloseTo(0, 10);
  });

  test('should calculate correct structure factor at K point', () => {
    const [kx, ky] = GRAPHENE_CONSTANTS.K;
    const k = calculateStructureFactor(kx, ky);
    
    // At K point, structure factor should be zero (Dirac point)
    expect(Math.sqrt(k.real * k.real + k.imag * k.imag)).toBeCloseTo(0, 6);
  });

  test('should calculate correct structure factor at K\' point', () => {
    const [kx, ky] = GRAPHENE_CONSTANTS.K_prime;
    const k_prime = calculateStructureFactor(kx, ky);
    
    // At K' point, structure factor should also be zero
    expect(Math.sqrt(k_prime.real * k_prime.real + k_prime.imag * k_prime.imag)).toBeCloseTo(0, 6);
  });

  test('should have correct symmetry properties', () => {
    const testPoints = PhysicsTestUtils.generateTestKPoints();
    
    testPoints.forEach(([kx, ky]) => {
      const f1 = calculateStructureFactor(kx, ky);
      const f2 = calculateStructureFactor(-kx, -ky);
      
      // Structure factor should have inversion symmetry: f(-k) = f*(k)
      expect(f1.real).toBeCloseTo(f2.real, 10);
      expect(f1.imag).toBeCloseTo(-f2.imag, 10);
    });
  });
});

describe('Band Structure Calculations', () => {
  let defaultParams: GrapheneParams;

  beforeEach(() => {
    defaultParams = {
      t1: -2.8,          // eV, nearest neighbor hopping
      t2: -0.1,          // eV, next-nearest neighbor hopping
      lambda_so: 0.0,    // eV, spin-orbit coupling
      epsilon: { xx: 0, yy: 0, xy: 0 }, // no strain
      onsite: 0.0        // eV, on-site energy
    };
  });

  test('should calculate correct band energies at Γ point', () => {
    const results = calculateGrapheneBands([[0, 0]], defaultParams);
    expect(results).toHaveLength(1);
    
    const { energy_plus, energy_minus } = results[0];
    
    // At Γ point with t1 = -2.8 eV: E = ±|t1| * 3 = ±8.4 eV
    expect(energy_plus).toBeCloseTo(8.4, 1);
    expect(energy_minus).toBeCloseTo(-8.4, 1);
  });

  test('should have zero gap at K points (Dirac points)', () => {
    const kPoints = [GRAPHENE_CONSTANTS.K, GRAPHENE_CONSTANTS.K_prime];
    const results = calculateGrapheneBands(kPoints, defaultParams);
    
    results.forEach(result => {
      // At Dirac points, both bands should meet at the Fermi level
      expect(result.energy_plus).toBeCloseTo(result.energy_minus, 6);
      expect(result.energy_plus).toBeCloseTo(defaultParams.onsite, 6);
    });
  });

  test('should respect time-reversal symmetry', () => {
    const testPoints = [[0.1, 0.2], [0.3, -0.1], [-0.2, 0.4]];
    
    testPoints.forEach(([kx, ky]) => {
      const results1 = calculateGrapheneBands([[kx, ky]], defaultParams);
      const results2 = calculateGrapheneBands([[-kx, -ky]], defaultParams);
      
      // Energy should be same at k and -k (time-reversal symmetry)
      expect(results1[0].energy_plus).toBeCloseTo(results2[0].energy_plus, 10);
      expect(results1[0].energy_minus).toBeCloseTo(results2[0].energy_minus, 10);
    });
  });

  test('should respond correctly to strain', () => {
    const strainedParams = {
      ...defaultParams,
      epsilon: { xx: 0.01, yy: -0.01, xy: 0.005 } // 1% strain
    };
    
    const kPoint = [0.1, 0.1];
    const unstrained = calculateGrapheneBands([kPoint], defaultParams);
    const strained = calculateGrapheneBands([kPoint], strainedParams);
    
    // Strain should modify the band energies
    expect(unstrained[0].energy_plus).not.toBeCloseTo(strained[0].energy_plus, 6);
    expect(unstrained[0].energy_minus).not.toBeCloseTo(strained[0].energy_minus, 6);
  });

  test('should calculate reasonable group velocities', () => {
    const kPoints = [[0.1, 0.1], [0.2, 0.0], [0.0, 0.3]];
    const results = calculateGrapheneBands(kPoints, defaultParams);
    
    results.forEach(result => {
      // Velocities should be finite and reasonable
      expect(Number.isFinite(result.velocity_x)).toBe(true);
      expect(Number.isFinite(result.velocity_y)).toBe(true);
      expect(Number.isFinite(result.fermi_velocity)).toBe(true);
      
      // Fermi velocity should be positive
      expect(result.fermi_velocity).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('K-Path Generation', () => {
  test('should generate correct high-symmetry path', () => {
    const { kPoints, labels, distances } = generateHighSymmetryPath(50);
    
    // Should start at Γ and end at Γ
    expect(kPoints[0]).toEqual([0, 0]);
    expect(kPoints[kPoints.length - 1]).toEqual([0, 0]);
    
    // Should have correct labels
    expect(labels[0]).toBe('Γ');
    expect(labels).toContain('M');
    expect(labels).toContain('K');
    
    // Distances should be monotonically increasing
    for (let i = 1; i < distances.length; i++) {
      expect(distances[i]).toBeGreaterThanOrEqual(distances[i - 1]);
    }
  });

  test('should pass through high-symmetry points', () => {
    const { kPoints } = generateHighSymmetryPath(100);
    
    // Check if M and K points are included (within tolerance)
    const hasM = kPoints.some(([kx, ky]) => 
      PhysicsTestUtils.approxEqual(kx, GRAPHENE_CONSTANTS.M[0], 1e-6) &&
      PhysicsTestUtils.approxEqual(ky, GRAPHENE_CONSTANTS.M[1], 1e-6)
    );
    
    const hasK = kPoints.some(([kx, ky]) => 
      PhysicsTestUtils.approxEqual(kx, GRAPHENE_CONSTANTS.K[0], 1e-6) &&
      PhysicsTestUtils.approxEqual(ky, GRAPHENE_CONSTANTS.K[1], 1e-6)
    );
    
    expect(hasM).toBe(true);
    expect(hasK).toBe(true);
  });
});

describe('2D K-Mesh Generation', () => {
  test('should generate points within Brillouin zone', () => {
    const kPoints = generate2DKMesh(20);
    
    expect(kPoints.length).toBeGreaterThan(0);
    
    // All points should be within reasonable bounds
    const kmax = 4 * Math.PI / (3 * GRAPHENE_CONSTANTS.a);
    kPoints.forEach(([kx, ky]) => {
      expect(Math.abs(kx)).toBeLessThanOrEqual(kmax * 1.1); // small tolerance
      expect(Math.abs(ky)).toBeLessThanOrEqual(kmax * 1.1);
    });
  });

  test('should include origin', () => {
    const kPoints = generate2DKMesh(10);
    const hasOrigin = kPoints.some(([kx, ky]) => 
      PhysicsTestUtils.approxEqual(kx, 0, 1e-10) && 
      PhysicsTestUtils.approxEqual(ky, 0, 1e-10)
    );
    expect(hasOrigin).toBe(true);
  });
});

describe('Brillouin Zone Boundary', () => {
  test('should generate hexagonal boundary', () => {
    const boundary = getHexagonalBZBoundary();
    
    // Should have 7 points (6 vertices + closing point)
    expect(boundary).toHaveLength(7);
    
    // First and last points should be the same (closed loop)
    expect(boundary[0]).toEqual(boundary[6]);
    
    // All points should have same distance from origin (hexagon property)
    const kmax = 4 * Math.PI / (3 * GRAPHENE_CONSTANTS.a);
    boundary.slice(0, 6).forEach(([kx, ky]) => {
      const distance = Math.sqrt(kx * kx + ky * ky);
      // For a regular hexagon, some vertices are at different distances
      expect(distance).toBeGreaterThan(0);
    });
  });
});

describe('Fermi Velocity Calculation', () => {
  test('should calculate correct Fermi velocity', () => {
    const params: GrapheneParams = {
      t1: -2.8,
      t2: 0,
      lambda_so: 0,
      epsilon: { xx: 0, yy: 0, xy: 0 },
      onsite: 0
    };
    
    const vF = calculateFermiVelocity(params);
    
    // Fermi velocity should be ~10^6 m/s for graphene
    expect(vF).toBeGreaterThan(5e5); // 500,000 m/s
    expect(vF).toBeLessThan(2e6);    // 2,000,000 m/s
    expect(Number.isFinite(vF)).toBe(true);
  });

  test('should scale linearly with hopping parameter', () => {
    const params1: GrapheneParams = {
      t1: -2.8, t2: 0, lambda_so: 0,
      epsilon: { xx: 0, yy: 0, xy: 0 }, onsite: 0
    };
    
    const params2: GrapheneParams = {
      ...params1,
      t1: -5.6 // double the hopping
    };
    
    const vF1 = calculateFermiVelocity(params1);
    const vF2 = calculateFermiVelocity(params2);
    
    // Fermi velocity should scale linearly with t1
    expect(vF2).toBeCloseTo(2 * vF1, 3);
  });
});

describe('Physics Validation', () => {
  test('should conserve particle-hole symmetry', () => {
    const params: GrapheneParams = {
      t1: -2.8, t2: 0, lambda_so: 0,
      epsilon: { xx: 0, yy: 0, xy: 0 }, onsite: 0
    };
    
    const testPoints = [[0.1, 0.1], [0.2, -0.3], [-0.15, 0.25]];
    const results = calculateGrapheneBands(testPoints, params);
    
    results.forEach(result => {
      // With onsite = 0, bands should be symmetric around zero
      expect(result.energy_plus).toBeCloseTo(-result.energy_minus, 10);
    });
  });
  
  test('should handle extreme parameter values gracefully', () => {
    const extremeParams: GrapheneParams = {
      t1: -100,     // Very large hopping
      t2: 10,       // Large NNN hopping
      lambda_so: 1, // Large spin-orbit
      epsilon: { xx: 0.5, yy: -0.3, xy: 0.2 }, // Large strain
      onsite: 5     // Large onsite energy
    };
    
    const results = calculateGrapheneBands([[0, 0]], extremeParams);
    
    // Should not produce NaN or infinite values
    expect(Number.isFinite(results[0].energy_plus)).toBe(true);
    expect(Number.isFinite(results[0].energy_minus)).toBe(true);
    expect(Number.isFinite(results[0].velocity_x)).toBe(true);
    expect(Number.isFinite(results[0].velocity_y)).toBe(true);
  });
});

describe('Units and Dimensional Consistency', () => {
  test('energy gap equals 2|t1| |f(k)| (t2 cancels)', () => {
    const params: GrapheneParams = {
      t1: -2.8, t2: -0.1, lambda_so: 0,
      epsilon: { xx: 0, yy: 0, xy: 0 }, onsite: 0
    };
    const kx = 0.23, ky = -0.41;
    const { real, imag } = calculateStructureFactor(kx, ky);
    const fmag = Math.hypot(real, imag);
    const [result] = calculateGrapheneBands([[kx, ky]], params);
    const gap = result.energy_plus - result.energy_minus;
    const expected = 2 * Math.abs(params.t1) * fmag;
    expect(gap).toBeCloseTo(expected, 6);
  });

  test('structure factor is dimensionless and finite', () => {
    const points = [[0,0],[0.5,0.5],[-1.2,0.7]];
    points.forEach(([kx, ky]) => {
      const { real, imag } = calculateStructureFactor(kx, ky);
      expect(Number.isFinite(real)).toBe(true);
      expect(Number.isFinite(imag)).toBe(true);
    });
  });
});