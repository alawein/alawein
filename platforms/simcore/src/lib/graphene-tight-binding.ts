import { complex, abs, exp, add, multiply, Complex } from 'mathjs';

export const GRAPHENE_CONSTANTS = {
  t: 2.7,      // NN hopping (eV)
  tPrime: 0.27, // NNN hopping (eV)
  a_cc: 1.42,  // C-C bond length (Å)
  a: Math.sqrt(3) * 1.42, // Lattice constant
} as const;

/**
 * CORRECT A→B nearest-neighbor vectors (Castro Neto et al.)
 * These are the actual bond vectors connecting A to B atoms
 */
const deltas: [number, number][] = [
  [0, GRAPHENE_CONSTANTS.a_cc],                                          // δ₁ = a_cc(0, 1)
  [GRAPHENE_CONSTANTS.a_cc * Math.sqrt(3) / 2, -GRAPHENE_CONSTANTS.a_cc / 2],  // δ₂ = a_cc(√3/2, -1/2)
  [-GRAPHENE_CONSTANTS.a_cc * Math.sqrt(3) / 2, -GRAPHENE_CONSTANTS.a_cc / 2], // δ₃ = a_cc(-√3/2, -1/2)
];

/**
 * NN structure factor f1(k) - connects A to B sublattices
 */
export function f1(kx: number, ky: number): Complex {
  let sum = complex(0, 0);
  for (const [dx, dy] of deltas) {
    const phase = kx * dx + ky * dy;
    sum = add(sum, exp(complex(0, phase))) as Complex;
  }
  return sum;
}

/**
 * NNN structure factor f2(k) - intra-sublattice hopping
 */
export function f2(kx: number, ky: number): number {
  const { a } = GRAPHENE_CONSTANTS;
  const arg1 = Math.sqrt(3) * kx * a;
  const arg2 = Math.sqrt(3) * kx * a / 2;
  const arg3 = 3 * ky * a / 2;
  return 2 * (Math.cos(arg1) + 2 * Math.cos(arg2) * Math.cos(arg3));
}

/**
 * Tight-binding dispersion relation
 */
export function dispersion(kx: number, ky: number): { energyPlus: number; energyMinus: number } {
  const { t, tPrime } = GRAPHENE_CONSTANTS;
  const f1Val = f1(kx, ky);
  const f2Val = f2(kx, ky);
  
  // |f1(k)| for band splitting
  const f1Mag = Number(abs(f1Val));
  
  // Energy with correct +3t' shift to center Dirac point at E=0
  const baseEnergy = -tPrime * f2Val + 3 * tPrime;
  
  return {
    energyPlus: baseEnergy + t * f1Mag,
    energyMinus: baseEnergy - t * f1Mag
  };
}

/**
 * Generate k-path: Γ → K → M → Γ
 */
export function generateKPath(nPoints: number = 100): {
  kPoints: [number, number][];
  distances: number[];
  labels: string[];
  labelPositions: number[];
} {
  const { a } = GRAPHENE_CONSTANTS;
  
  // High-symmetry points
  const Γ: [number, number] = [0, 0];
  const K: [number, number] = [4 * Math.PI / (3 * Math.sqrt(3) * a), 0];
  const M: [number, number] = [Math.PI / (Math.sqrt(3) * a), Math.PI / (3 * a)];
  
  // Helper function for linear interpolation
  function linspace(start: [number, number], end: [number, number], n: number, includeEnd = false): [number, number][] {
    const steps = includeEnd ? n - 1 : n;
    const dx = (end[0] - start[0]) / steps;
    const dy = (end[1] - start[1]) / steps;
    const result: [number, number][] = [];
    
    const actualN = includeEnd ? n : n;
    for (let i = 0; i < actualN; i++) {
      result.push([start[0] + i * dx, start[1] + i * dy]);
    }
    return result;
  }
  
  // Build path segments
  const segments = [
    ...linspace(Γ, K, nPoints, false),
    ...linspace(K, M, nPoints, false),
    ...linspace(M, Γ, nPoints, true)
  ];
  
  // Calculate cumulative distances
  const distances = [0];
  for (let i = 1; i < segments.length; i++) {
    const dx = segments[i][0] - segments[i - 1][0];
    const dy = segments[i][1] - segments[i - 1][1];
    distances.push(distances[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  
  return {
    kPoints: segments,
    distances,
    labels: ['Γ', 'K', 'M', 'Γ'],
    labelPositions: [distances[0], distances[nPoints], distances[2 * nPoints], distances[distances.length - 1]]
  };
}

/**
 * Calculate band structure along k-path
 */
export function calculateBandStructure(nPoints: number = 100): {
  distances: number[];
  energiesPlus: number[];
  energiesMinus: number[];
  labels: string[];
  labelPositions: number[];
} {
  const pathData = generateKPath(nPoints);
  const { t } = GRAPHENE_CONSTANTS;
  
  const energiesPlus: number[] = [];
  const energiesMinus: number[] = [];
  
  for (const [kx, ky] of pathData.kPoints) {
    const { energyPlus, energyMinus } = dispersion(kx, ky);
    // Normalize by t for plotting
    energiesPlus.push(energyPlus / t);
    energiesMinus.push(energyMinus / t);
  }
  
  return {
    distances: pathData.distances,
    energiesPlus,
    energiesMinus,
    labels: pathData.labels,
    labelPositions: pathData.labelPositions
  };
}

/**
 * Calculate DOS using histogram method with Gaussian broadening
 */
export function calculateDOS(energyRange: [number, number] = [-3, 3], nBins: number = 150, nKPoints: number = 150): {
  energies: number[];
  dos: number[];
} {
  const { a, t } = GRAPHENE_CONSTANTS;
  
  // Reciprocal lattice vectors
  const b1: [number, number] = [2 * Math.PI / (Math.sqrt(3) * a), 2 * Math.PI / (3 * a)];
  const b2: [number, number] = [2 * Math.PI / (Math.sqrt(3) * a), -2 * Math.PI / (3 * a)];
  
  // Collect all energies from BZ sampling
  const allEnergies: number[] = [];
  const cutoff = 4 * Math.PI / (3 * Math.sqrt(3) * a); // BZ boundary
  
  for (let i = 0; i < nKPoints; i++) {
    for (let j = 0; j < nKPoints; j++) {
      const u = (i / (nKPoints - 1)) - 0.5;
      const v = (j / (nKPoints - 1)) - 0.5;
      
      const kx = u * b1[0] + v * b2[0];
      const ky = u * b1[1] + v * b2[1];
      
      // Check if k-point is within first BZ
      const kNorm = Math.sqrt(kx * kx + ky * ky);
      if (kNorm < cutoff) {
        const { energyPlus, energyMinus } = dispersion(kx, ky);
        // Normalize by t
        allEnergies.push(energyPlus / t);
        allEnergies.push(energyMinus / t);
      }
    }
  }
  
  // Create histogram
  const [eMin, eMax] = energyRange;
  const binWidth = (eMax - eMin) / nBins;
  const hist = new Array(nBins).fill(0);
  
  for (const energy of allEnergies) {
    const idx = Math.floor((energy - eMin) / binWidth);
    if (idx >= 0 && idx < nBins) {
      hist[idx] += 1;
    }
  }
  
  // Apply Gaussian smoothing
  const sigma = 2.0; // Broadening parameter
  const smoothed = hist.map((_, i) => {
    let sum = 0;
    for (let j = 0; j < hist.length; j++) {
      const dx = i - j;
      sum += hist[j] * Math.exp(-0.5 * (dx / sigma) ** 2);
    }
    return sum;
  });
  
  // Energy centers
  const energies = Array.from({ length: nBins }, (_, i) => eMin + (i + 0.5) * binWidth);
  
  return { energies, dos: smoothed };
}

/**
 * Validate Dirac point properties
 */
export function validateDiracPoint(): {
  isValid: boolean;
  f1Magnitude: number;
  gapAtK: number;
  kPoint: [number, number];
} {
  const { a } = GRAPHENE_CONSTANTS;
  const K: [number, number] = [4 * Math.PI / (3 * Math.sqrt(3) * a), 0];
  
  // Check f1(K) = 0 (within numerical tolerance)
  const f1AtK = f1(K[0], K[1]);
  const f1Mag = Number(abs(f1AtK));
  const tolerance = 1e-10;
  const isValid = f1Mag < tolerance;
  
  // Calculate gap at K point
  const { energyPlus, energyMinus } = dispersion(K[0], K[1]);
  const gapAtK = Math.abs(energyPlus - energyMinus);
  
  return {
    isValid,
    f1Magnitude: f1Mag,
    gapAtK,
    kPoint: K
  };
}