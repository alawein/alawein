/**
 * PHYSICALLY CORRECT GRAPHENE TIGHT-BINDING IMPLEMENTATION
 * Based on Castro Neto et al. and standard literature
 */

export interface GrapheneParameters {
  t1: number;        // NN hopping (eV)
  t2: number;        // NNN hopping (eV) 
  strain: {
    exx: number;     // strain tensor components
    eyy: number;
    exy: number;
  };
  onsite: number;    // onsite energy (eV)
}

export interface BandStructureResult {
  kPath: number[];
  valence: number[];
  conduction: number[];
  kPoints: [number, number][];
  labels: string[];
  labelPositions: number[];
}

export interface DOSResult {
  energies: number[];
  dos: number[];
  linearDOS: number[];
}

export interface BrillouinZoneData {
  boundary: [number, number][];
  highSymmetryPoints: {
    gamma: [number, number];
    K: [number, number];
    Kprime: [number, number];
    M: [number, number];
  };
  path: [number, number][];
  ibz: [number, number][];
}

// Physical constants
export const GRAPHENE_CONSTANTS = {
  a_cc: 1.42,  // carbon-carbon bond length (Angstrom) - THE FUNDAMENTAL LENGTH SCALE
  a: 2.46,     // lattice constant a = √3 * a_cc (Angstrom)
  hbar: 0.6582119569,  // reduced Planck constant (eV⋅fs)
};

export const DEFAULT_GRAPHENE_PARAMETERS: GrapheneParameters = {
  t1: 2.7,     // NN hopping parameter (eV)
  t2: 0.27,    // NNN hopping = 0.1 * t1
  onsite: 0.0, // onsite energy (eV)
  strain: {
    exx: 0.0,
    eyy: 0.0, 
    exy: 0.0
  }
};

/**
 * CORRECT A→B nearest-neighbor vectors (Castro Neto et al.)
 * These are the actual bond vectors connecting A to B atoms
 */
function getCorrectNNVectors(strain: GrapheneParameters['strain']): [number, number][] {
  const { a_cc } = GRAPHENE_CONSTANTS;
  
  // CORRECT A→B bond vectors from Castro Neto et al. RMP 2009
  const base: [number, number][] = [
    [0, a_cc],                                    // δ₁ = a_cc(0, 1)
    [a_cc * Math.sqrt(3) / 2, -a_cc / 2],       // δ₂ = a_cc(√3/2, -1/2)
    [-a_cc * Math.sqrt(3) / 2, -a_cc / 2]       // δ₃ = a_cc(-√3/2, -1/2)
  ];
  
  // Apply strain transformation: δ' = (I + ε) · δ
  return base.map(([dx, dy]) => {
    const dx_strained = dx * (1 + strain.exx) + dy * strain.exy;
    const dy_strained = dx * strain.exy + dy * (1 + strain.eyy);
    return [dx_strained, dy_strained];
  });
}

/**
 * CORRECT NNN vectors for same-sublattice hopping
 */
function getCorrectNNNVectors(strain: GrapheneParameters['strain']): [number, number][] {
  const { a_cc } = GRAPHENE_CONSTANTS;
  
  // 6 NNN vectors connecting same sublattice atoms (A→A, B→B)
  const base: [number, number][] = [
    [a_cc * Math.sqrt(3), 0],                    // δ₂₁ = a_cc√3(1, 0)
    [-a_cc * Math.sqrt(3), 0],                   // δ₂₂ = a_cc√3(-1, 0)  
    [a_cc * Math.sqrt(3) / 2, 3 * a_cc / 2],    // δ₂₃ = a_cc(√3/2, 3/2)
    [a_cc * Math.sqrt(3) / 2, -3 * a_cc / 2],   // δ₂₄ = a_cc(√3/2, -3/2)
    [-a_cc * Math.sqrt(3) / 2, 3 * a_cc / 2],   // δ₂₅ = a_cc(-√3/2, 3/2)
    [-a_cc * Math.sqrt(3) / 2, -3 * a_cc / 2]   // δ₂₆ = a_cc(-√3/2, -3/2)
  ];
  
  // Apply strain transformation
  return base.map(([dx, dy]) => {
    const dx_strained = dx * (1 + strain.exx) + dy * strain.exy;
    const dy_strained = dx * strain.exy + dy * (1 + strain.eyy);
    return [dx_strained, dy_strained];
  });
}

/**
 * Calculate CORRECT structure factor f₁(k) = Σμ e^(ik·δ₁μ)
 */
function calculateCorrectF1(kx: number, ky: number, strain: GrapheneParameters['strain']): {
  real: number;
  imag: number;
  magnitude: number;
} {
  const delta1 = getCorrectNNVectors(strain);
  
  let real = 0;
  let imag = 0;
  
  for (const [dx, dy] of delta1) {
    const phase = kx * dx + ky * dy;
    real += Math.cos(phase);
    imag += Math.sin(phase);
  }
  
  const magnitude = Math.sqrt(real * real + imag * imag);
  return { real, imag, magnitude };
}

/**
 * Calculate CORRECT structure factor f₂(k) for NNN terms
 */
function calculateCorrectF2(kx: number, ky: number, strain: GrapheneParameters['strain']): number {
  const delta2 = getCorrectNNNVectors(strain);
  
  let f2 = 0;
  
  for (const [dx, dy] of delta2) {
    const phase = kx * dx + ky * dy;
    f2 += Math.cos(phase);
  }
  
  return f2;
}

/**
 * CORRECT tight-binding dispersion: E±(k) = -t' f₂(k) ± t |f₁(k)|
 * Optional shift to center Dirac point at E=0
 */
export function calculateCorrectEigenvalues(
  kx: number, 
  ky: number, 
  params: GrapheneParameters,
  centerDiracPoint: boolean = true
): { 
  energyPlus: number; 
  energyMinus: number; 
  f1Magnitude: number;
  f2Value: number;
} {
  const f1 = calculateCorrectF1(kx, ky, params.strain);
  const f2 = calculateCorrectF2(kx, ky, params.strain);
  
  // CORRECT tight-binding energies
  let energyPlus = -params.t2 * f2 + params.t1 * f1.magnitude + params.onsite;
  let energyMinus = -params.t2 * f2 - params.t1 * f1.magnitude + params.onsite;
  
  // Optional: center Dirac point at E=0 by shifting by +3t'
  if (centerDiracPoint) {
    const shift = 3 * params.t2;
    energyPlus += shift;
    energyMinus += shift;
  }
  
  return { 
    energyPlus, 
    energyMinus,
    f1Magnitude: f1.magnitude,
    f2Value: f2
  };
}

/**
 * Calculate NN-only eigenvalues: E±(k) = ± t |f₁(k)|
 */
export function calculateNNOnlyEigenvalues(
  kx: number, 
  ky: number, 
  params: GrapheneParameters
): { 
  energyPlus: number; 
  energyMinus: number; 
} {
  const f1 = calculateCorrectF1(kx, ky, params.strain);
  
  // NN-only energies (no t' term)
  const energyPlus = params.t1 * f1.magnitude + params.onsite;
  const energyMinus = -params.t1 * f1.magnitude + params.onsite;
  
  return { 
    energyPlus, 
    energyMinus
  };
}

/**
 * Generate CORRECT k-path with proper high-symmetry points
 */
export function generateCorrectKPath(nPoints: number = 300): BandStructureResult {
  const path: [number, number][] = [];
  const kPath: number[] = [];
  const labels = ['Γ', 'K', 'M', 'Γ'];
  
  const { a_cc } = GRAPHENE_CONSTANTS;
  
  // CORRECT high-symmetry points ensuring f₁(K) = 0
  const gamma: [number, number] = [0, 0];
  const K: [number, number] = [4 * Math.PI / (3 * Math.sqrt(3) * a_cc), 0];  // TRUE Dirac point
  const M: [number, number] = [Math.PI / (Math.sqrt(3) * a_cc), Math.PI / (3 * a_cc)];  // Edge midpoint
  
  const points = [gamma, K, M, gamma];
  const segmentPoints = Math.floor(nPoints / 3);
  
  let distance = 0;
  const labelPositions: number[] = [0];  // Start at Γ
  
  // Generate path and accumulate distances
  for (let seg = 0; seg < 3; seg++) {
    const start = points[seg];
    const end = points[seg + 1];
    
    for (let i = 0; i < segmentPoints; i++) {
      const t = i / (segmentPoints - 1);
      const kx = start[0] + t * (end[0] - start[0]);
      const ky = start[1] + t * (end[1] - start[1]);
      
      path.push([kx, ky]);
      
      // Calculate distance from previous point
      if (path.length > 1) {
        const prev = path[path.length - 2];
        const dx = kx - prev[0];
        const dy = ky - prev[1];
        distance += Math.sqrt(dx * dx + dy * dy);
      }
      
      kPath.push(distance);
    }
    
    // Add label position at the end of each segment (except the last)
    if (seg < 2) {
      labelPositions.push(distance);
    }
  }
  
  // Add final Γ label position
  labelPositions.push(distance);
  
  return {
    kPath,
    valence: [],
    conduction: [],
    kPoints: path,
    labels,
    labelPositions
  };
}

/**
 * Calculate NN-only band structure
 */
export function calculateNNOnlyBandStructure(params: GrapheneParameters): BandStructureResult {
  const pathData = generateCorrectKPath();
  const valence: number[] = [];
  const conduction: number[] = [];
  
  for (const [kx, ky] of pathData.kPoints) {
    const { energyPlus, energyMinus } = calculateNNOnlyEigenvalues(kx, ky, params);
    // Normalize energies to t (E/t)
    conduction.push(Math.max(-3, Math.min(3, energyPlus / params.t1)));
    valence.push(Math.max(-3, Math.min(3, energyMinus / params.t1)));
  }
  
  return {
    ...pathData,
    valence,
    conduction
  };
}

/**
 * Calculate full NN+NNN band structure
 */
export function calculateCorrectBandStructure(params: GrapheneParameters): BandStructureResult {
  const pathData = generateCorrectKPath();
  const valence: number[] = [];
  const conduction: number[] = [];
  
  for (const [kx, ky] of pathData.kPoints) {
    const { energyPlus, energyMinus } = calculateCorrectEigenvalues(kx, ky, params, false);
    
    // Normalize energies to t (E/t) and enforce ±3 range
    conduction.push(Math.max(-3, Math.min(3, energyPlus / params.t1)));
    valence.push(Math.max(-3, Math.min(3, energyMinus / params.t1)));
  }
  
  return {
    ...pathData,
    valence,
    conduction
  };
}

/**
 * VALIDATE DIRAC POINT: f₁(K) must equal 0
 */
export function validateCorrectDiracPoint(params: GrapheneParameters): {
  kPoint: [number, number];
  f1Real: number;
  f1Imag: number;
  f1Magnitude: number;
  isValid: boolean;
  gapAtK: number;
} {
  const { a_cc } = GRAPHENE_CONSTANTS;
  const K: [number, number] = [4 * Math.PI / (3 * Math.sqrt(3) * a_cc), 0];
  
  const f1 = calculateCorrectF1(K[0], K[1], params.strain);
  const tolerance = 1e-10;
  const isValid = f1.magnitude < tolerance;
  
  const { energyPlus, energyMinus } = calculateCorrectEigenvalues(K[0], K[1], params, false);
  const gapAtK = Math.abs(energyPlus - energyMinus);
  
  return {
    kPoint: K,
    f1Real: f1.real,
    f1Imag: f1.imag,
    f1Magnitude: f1.magnitude,
    isValid,
    gapAtK
  };
}

/**
 * Calculate DOS with proper Gaussian broadening
 */
export function calculateCorrectDOS(
  params: GrapheneParameters, 
  broadening: number = 0.1,
  energyRange: [number, number] = [-3, 3],  // E/t range
  nPoints: number = 800
): DOSResult {
  const [eMin, eMax] = energyRange;
  const energies = Array.from({ length: nPoints }, (_, i) => 
    eMin + (i / (nPoints - 1)) * (eMax - eMin)
  );
  
  // Calculate on a fine k-mesh (Castro Neto style)
  const nKx = 200;
  const nKy = 200;
  const { a_cc } = GRAPHENE_CONSTANTS;
  
  // BZ boundaries - use proper reciprocal lattice
  const kMax = 4 * Math.PI / (3 * Math.sqrt(3) * a_cc);
  
  const allEnergies: number[] = [];
  
  for (let ix = 0; ix < nKx; ix++) {
    for (let iy = 0; iy < nKy; iy++) {
      const kx = (ix / (nKx - 1) - 0.5) * 2 * kMax;
      const ky = (iy / (nKy - 1) - 0.5) * 2 * kMax;
      
      const { energyPlus, energyMinus } = calculateCorrectEigenvalues(kx, ky, params, false);
      
      // Normalize energies to t (E/t)
      const ePlusNorm = energyPlus / params.t1;
      const eMinusNorm = energyMinus / params.t1;
      
      if (ePlusNorm >= eMin && ePlusNorm <= eMax) allEnergies.push(ePlusNorm);
      if (eMinusNorm >= eMin && eMinusNorm <= eMax) allEnergies.push(eMinusNorm);
    }
  }
  
  // Create histogram
  const dos = new Array(nPoints).fill(0);
  const binWidth = (eMax - eMin) / (nPoints - 1);
  
  for (const energy of allEnergies) {
    const bin = Math.floor((energy - eMin) / binWidth);
    if (bin >= 0 && bin < nPoints) {
      dos[bin] += 1;
    }
  }
  
  // Apply Gaussian broadening
  const sigma = broadening / binWidth;
  const gaussianDOS = new Array(nPoints).fill(0);
  
  for (let i = 0; i < nPoints; i++) {
    for (let j = 0; j < nPoints; j++) {
      const distance = Math.abs(i - j);
      const weight = Math.exp(-0.5 * (distance / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
      gaussianDOS[i] += dos[j] * weight;
    }
  }
  
  // Linear DOS for comparison (Dirac cone) - normalized to E/t
  const linearDOS = energies.map(E => 
    Math.abs(E) / (Math.PI * (GRAPHENE_CONSTANTS.hbar * 2.7 * 1.42 / (2 * params.t1)) ** 2) // |E/t| / (π ℏ²vF²)
  );
  
  return {
    energies,
    dos: gaussianDOS,
    linearDOS
  };
}

/**
 * Generate Brillouin Zone data
 */
export function generateCorrectBrillouinZone(): BrillouinZoneData {
  const { a_cc } = GRAPHENE_CONSTANTS;
  
  // Reciprocal lattice vectors
  const b1: [number, number] = [2 * Math.PI / (Math.sqrt(3) * a_cc), 2 * Math.PI / (3 * a_cc)];
  const b2: [number, number] = [2 * Math.PI / (Math.sqrt(3) * a_cc), -2 * Math.PI / (3 * a_cc)];
  
  // BZ boundary (hexagon)
  const boundary: [number, number][] = [];
  for (let i = 0; i <= 6; i++) {
    const angle = i * Math.PI / 3;
    const r = 4 * Math.PI / (3 * Math.sqrt(3) * a_cc);
    boundary.push([r * Math.cos(angle), r * Math.sin(angle)]);
  }
  
  // High-symmetry points
  const gamma: [number, number] = [0, 0];
  const K: [number, number] = [4 * Math.PI / (3 * Math.sqrt(3) * a_cc), 0];
  const Kprime: [number, number] = [-4 * Math.PI / (3 * Math.sqrt(3) * a_cc), 0];
  const M: [number, number] = [Math.PI / (Math.sqrt(3) * a_cc), Math.PI / (3 * a_cc)];
  
  // Path Γ→K→M→Γ
  const path: [number, number][] = [];
  const segments = [
    [gamma, K],
    [K, M], 
    [M, gamma]
  ];
  
  for (const [start, end] of segments) {
    for (let i = 0; i < 100; i++) {
      const t = i / 99;
      path.push([
        start[0] + t * (end[0] - start[0]),
        start[1] + t * (end[1] - start[1])
      ]);
    }
  }
  
  // Irreducible BZ (1/12 of full BZ)
  const ibz: [number, number][] = [
    gamma,
    K,
    M,
    gamma
  ];
  
  return {
    boundary,
    highSymmetryPoints: { gamma, K, Kprime, M },
    path,
    ibz
  };
}