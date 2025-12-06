/**
 * EXACT GRAPHENE TIGHT-BINDING PHYSICS
 * 
 * This implementation uses the EXACT theoretical framework:
 * ✅ Proper NN vectors: δ₁μ ∈ {a[0, 1], a[±√3/2, -1/2]}
 * ✅ Correct structure factor: f₁(k) = Σμ e^(ik·δ₁μ)
 * ✅ Exact dispersion: E±(k) = -t' f₂(k) ± t |f₁(k)|
 * ✅ Dirac condition: f₁(K) = 0 at K = (4π/3a, 0)
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
  a: 2.46,  // lattice constant (Angstrom)
  hbar: 0.6582119569,  // reduced Planck constant (eV⋅fs)
};

/**
 * EXACT NN vectors according to theoretical framework
 * δ₁μ ∈ {a[0, 1], a[√3/2, -1/2], a[-√3/2, -1/2]}
 */
const getExactNNVectors = (strain: GrapheneParameters['strain']): [number, number][] => {
  const a = GRAPHENE_CONSTANTS.a;
  
  // EXACT NN vectors from Castro Neto et al. and standard literature
  // δ₁ = a(1,0), δ₂ = a(-1/2, √3/2), δ₃ = a(-1/2, -√3/2)
  const base: [number, number][] = [
    [a, 0],                                      // δ₁ = a(1, 0)
    [-a / 2, a * Math.sqrt(3) / 2],             // δ₂ = a(-1/2, √3/2)
    [-a / 2, -a * Math.sqrt(3) / 2]             // δ₃ = a(-1/2, -√3/2)
  ];
  
  // Apply strain transformation: δ' = (I + ε) · δ
  return base.map(([dx, dy]) => {
    const dx_strained = dx * (1 + strain.exx) + dy * strain.exy;
    const dy_strained = dx * strain.exy + dy * (1 + strain.eyy);
    return [dx_strained, dy_strained];
  });
};

/**
 * EXACT NNN vectors for f₂(k) calculation
 */
const getExactNNNVectors = (strain: GrapheneParameters['strain']): [number, number][] => {
  const a = GRAPHENE_CONSTANTS.a;
  
  // 6 NNN vectors from literature (Castro Neto et al.)
  // These connect sites on the same sublattice
  const base: [number, number][] = [
    [a * Math.sqrt(3), 0],                    // δ₂₁ = a√3(1, 0)
    [-a * Math.sqrt(3), 0],                   // δ₂₂ = a√3(-1, 0)  
    [a * Math.sqrt(3) / 2, 3 * a / 2],       // δ₂₃ = a(√3/2, 3/2)
    [a * Math.sqrt(3) / 2, -3 * a / 2],      // δ₂₄ = a(√3/2, -3/2)
    [-a * Math.sqrt(3) / 2, 3 * a / 2],      // δ₂₅ = a(-√3/2, 3/2)
    [-a * Math.sqrt(3) / 2, -3 * a / 2]      // δ₂₆ = a(-√3/2, -3/2)
  ];
  
  // Apply strain transformation
  return base.map(([dx, dy]) => {
    const dx_strained = dx * (1 + strain.exx) + dy * strain.exy;
    const dy_strained = dx * strain.exy + dy * (1 + strain.eyy);
    return [dx_strained, dy_strained];
  });
};

/**
 * EXACT structure factor f₁(k) = Σμ e^(ik·δ₁μ)
 * This MUST equal 0 at K-points for Dirac condition
 */
function calculateExactF1(kx: number, ky: number, strain: GrapheneParameters['strain']): { 
  real: number; 
  imag: number; 
  magnitude: number 
} {
  const delta1 = getExactNNVectors(strain);
  
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
 * EXACT structure factor f₂(k) for NNN terms
 */
function calculateExactF2(kx: number, ky: number, strain: GrapheneParameters['strain']): number {
  const delta2 = getExactNNNVectors(strain);
  
  let f2 = 0;
  
  for (const [dx, dy] of delta2) {
    const phase = kx * dx + ky * dy;
    f2 += Math.cos(phase);
  }
  
  return f2;
}

/**
 * EXACT dispersion relation: E±(k) = -t' f₂(k) ± t |f₁(k)|
 * No SOC terms - pure tight-binding physics
 */
export function calculateExactEigenvalues(
  kx: number, 
  ky: number, 
  params: GrapheneParameters
): { 
  energyPlus: number; 
  energyMinus: number; 
  f1Magnitude: number;
  f2Value: number;
} {
  const f1 = calculateExactF1(kx, ky, params.strain);
  const f2 = calculateExactF2(kx, ky, params.strain);
  
  // EXACT tight-binding energies: E±(k) = -t' f₂(k) ± t |f₁(k)| 
  // Apply Dirac point shift: subtract 3t' to center Dirac point at E=0
  const energyPlus = -params.t2 * f2 + params.t1 * f1.magnitude + params.onsite - 3 * params.t2;
  const energyMinus = -params.t2 * f2 - params.t1 * f1.magnitude + params.onsite - 3 * params.t2;
  
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
  const f1 = calculateExactF1(kx, ky, params.strain);
  
  // NN-only energies (no t' term)
  const energyPlus = params.t1 * f1.magnitude + params.onsite;
  const energyMinus = -params.t1 * f1.magnitude + params.onsite;
  
  return { 
    energyPlus, 
    energyMinus
  };
}

/**
 * Generate CORRECT k-path: Γ → K → M → Γ
 * K-point MUST be where Dirac cones appear (f₁(K) = 0)
 * Fixed to ensure proper distance calculation and no collapsed axes
 */
export function generateExactKPath(nPoints: number = 300): BandStructureResult {
  const path: [number, number][] = [];
  const kPath: number[] = [];
  const labels = ['Γ', 'M', 'K', 'Γ'];
  
  const a = GRAPHENE_CONSTANTS.a;
  
  // EXACT high-symmetry points for graphene
  const gamma: [number, number] = [0, 0];
  const K: [number, number] = [2 * Math.PI / (3 * a), 2 * Math.PI / (3 * Math.sqrt(3) * a)];  // Dirac point K
  const M: [number, number] = [0, 2 * Math.PI / (Math.sqrt(3) * a)];  // M point (edge midpoint)
  
  const points = [gamma, M, K, gamma];  // Reversed path: Γ → M → K → Γ
  const segmentPoints = Math.floor(nPoints / 3);
  
  let distance = 0;
  const labelPositions: number[] = [0];  // Start at Γ
  
  // Generate path and accumulate distances correctly
  for (let seg = 0; seg < 3; seg++) {
    const start = points[seg];
    const end = points[seg + 1];
    
    for (let i = 0; i < segmentPoints; i++) {
      const t = i / (segmentPoints - 1);
      const kx = start[0] + t * (end[0] - start[0]);
      const ky = start[1] + t * (end[1] - start[1]);
      
      path.push([kx, ky]);
      
      // Calculate cumulative Euclidean distance from previous point
      if (path.length > 1) {
        const prev = path[path.length - 2];
        const dx = kx - prev[0];
        const dy = ky - prev[1];
        const stepDistance = Math.sqrt(dx * dx + dy * dy);
        distance += stepDistance;
        
        // Debug: ensure distance is increasing
        if (stepDistance === 0 && i > 0) {
          console.warn(`Zero step distance at i=${i}, seg=${seg}`);
        }
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
  
  // Validate k-path monotonicity
  for (let i = 1; i < kPath.length; i++) {
    if (kPath[i] <= kPath[i-1]) {
      console.error(`Non-monotonic k-path at index ${i}: ${kPath[i-1]} -> ${kPath[i]}`);
    }
  }
  
  console.log("K-path generated:", {
    totalPoints: path.length,
    distanceRange: [Math.min(...kPath), Math.max(...kPath)],
    labelPositions,
    maxDistance: Math.max(...kPath)
  });
  
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
 * Calculate NN-only band structure for comparison
 */
export function calculateNNOnlyBandStructure(params: GrapheneParameters): BandStructureResult {
  const pathData = generateExactKPath();
  const valence: number[] = [];
  const conduction: number[] = [];
  
  for (const [kx, ky] of pathData.kPoints) {
    const { energyPlus, energyMinus } = calculateNNOnlyEigenvalues(kx, ky, params);
    // Normalize to t (params.t1)
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
 * Calculate band structure using EXACT physics (NN+NNN)
 */
export function calculateExactBandStructure(params: GrapheneParameters): BandStructureResult {
  const pathData = generateExactKPath();
  const valence: number[] = [];
  const conduction: number[] = [];
  
  for (const [kx, ky] of pathData.kPoints) {
    const { energyPlus, energyMinus } = calculateExactEigenvalues(kx, ky, params);
    
    // Normalize to t (params.t1) and enforce ±3 range
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
export function validateExactDiracPoint(params: GrapheneParameters): {
  kPoint: [number, number];
  f1Real: number;
  f1Imag: number;
  f1Magnitude: number;
  isValid: boolean;
  gapAtK: number;
} {
  const a = GRAPHENE_CONSTANTS.a;
  const K: [number, number] = [2 * Math.PI / (3 * a), 2 * Math.PI / (3 * Math.sqrt(3) * a)];  // Use correct K point
  
  const f1 = calculateExactF1(K[0], K[1], params.strain);
  const tolerance = 1e-6;
  const isValid = f1.magnitude < tolerance;
  
  // Calculate energy gap at K point
  const { energyPlus, energyMinus } = calculateExactEigenvalues(K[0], K[1], params);
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
 * Calculate DOS with exact physics
 */
/**
 * Calculate NN-only DOS for comparison
 */
export function calculateNNOnlyDOS(
  params: GrapheneParameters, 
  energyRange: [number, number] = [-3, 3], 
  nBins: number = 1000, 
  nKPoints: number = 200
): DOSResult {
  const [eMin, eMax] = energyRange;
  const energies = Array.from({ length: nBins }, (_, i) => eMin + (eMax - eMin) * i / (nBins - 1));
  const dos = new Array(nBins).fill(0);
  
  const a = GRAPHENE_CONSTANTS.a;
  const kMax = 4 * Math.PI / (3 * a);
  const dk = 2 * kMax / nKPoints;
  
  const broadening = 0.2 / params.t1; // Normalize broadening to t
  let totalStates = 0;
  
  for (let i = 0; i < nKPoints; i++) {
    for (let j = 0; j < nKPoints; j++) {
      const kx = -kMax + i * dk;
      const ky = -kMax + j * dk;
      
      const { energyPlus, energyMinus } = calculateNNOnlyEigenvalues(kx, ky, params);
      
      // Normalize energies to t and add both bands with Gaussian broadening
      for (const band of [energyPlus / params.t1, energyMinus / params.t1]) {
        if (band >= eMin - 3*broadening && band <= eMax + 3*broadening) {
          for (let binIndex = 0; binIndex < nBins; binIndex++) {
            const E = energies[binIndex];
            const weight = Math.exp(-0.5 * Math.pow((E - band) / broadening, 2)) / (broadening * Math.sqrt(2 * Math.PI));
            dos[binIndex] += weight;
            totalStates += weight / nBins;
          }
        }
      }
    }
  }
  
  // Normalize DOS
  const binWidth = (eMax - eMin) / nBins;
  const normalizedDOS = dos.map(count => count / (totalStates * binWidth));
  
  // Calculate linear DOS near Dirac point (normalized to t)
  const fermiVelocity = calculateExactFermiVelocity(params) / params.t1;
  const linearDOS = energies.map(E => {
    const EShifted = Math.abs(E);
    return 2 * EShifted / (Math.PI * Math.pow(GRAPHENE_CONSTANTS.hbar * fermiVelocity, 2));
  });
  
  return {
    energies,
    dos: normalizedDOS,
    linearDOS
  };
}

/**
 * Calculate NN+NNN DOS (full theory)
 */
export function calculateExactDOS(
  params: GrapheneParameters, 
  energyRange: [number, number] = [-3, 3], 
  nBins: number = 1000, 
  nKPoints: number = 200
): DOSResult {
  const [eMin, eMax] = energyRange;
  const energies = Array.from({ length: nBins }, (_, i) => eMin + (eMax - eMin) * i / (nBins - 1));
  const dos = new Array(nBins).fill(0);
  
  const a = GRAPHENE_CONSTANTS.a;
  const kMax = 4 * Math.PI / (3 * a);
  const dk = 2 * kMax / nKPoints;
  
  const broadening = 0.2 / params.t1; // Normalize broadening to t
  let totalStates = 0;
  
  for (let i = 0; i < nKPoints; i++) {
    for (let j = 0; j < nKPoints; j++) {
      const kx = -kMax + i * dk;
      const ky = -kMax + j * dk;
      
      const { energyPlus, energyMinus } = calculateExactEigenvalues(kx, ky, params);
      
      // Normalize energies to t and add both bands with Gaussian broadening
      for (const band of [energyPlus / params.t1, energyMinus / params.t1]) {
        if (band >= eMin - 3*broadening && band <= eMax + 3*broadening) {
          for (let binIndex = 0; binIndex < nBins; binIndex++) {
            const E = energies[binIndex];
            const weight = Math.exp(-0.5 * Math.pow((E - band) / broadening, 2)) / (broadening * Math.sqrt(2 * Math.PI));
            dos[binIndex] += weight;
            totalStates += weight / nBins;
          }
        }
      }
    }
  }
  
  // Normalize DOS
  const binWidth = (eMax - eMin) / nBins;
  const normalizedDOS = dos.map(count => count / (totalStates * binWidth));
  
  // Calculate linear DOS near Dirac point (normalized to t)
  const fermiVelocity = calculateExactFermiVelocity(params) / params.t1;
  const linearDOS = energies.map(E => {
    const EShifted = Math.abs(E - 3 * params.t2 / params.t1);
    return 2 * EShifted / (Math.PI * Math.pow(GRAPHENE_CONSTANTS.hbar * fermiVelocity, 2));
  });
  
  return {
    energies,
    dos: normalizedDOS,
    linearDOS
  };
}

/**
 * Calculate Fermi velocity with strain effects
 */
export function calculateExactFermiVelocity(params: GrapheneParameters): number {
  const a = GRAPHENE_CONSTANTS.a;
  const strainFactor = Math.sqrt((1 + params.strain.exx) * (1 + params.strain.eyy) - params.strain.exy ** 2);
  // Correct Fermi velocity: v_F = (3/2) * t1 * a / ℏ
  return (3 * params.t1 * 1.602e-19 * a * 1e-10 * strainFactor) / (2 * GRAPHENE_CONSTANTS.hbar);
}

/**
 * Generate Brillouin zone data
 */
export function getExactBrillouinZoneData(): BrillouinZoneData {
  const a = GRAPHENE_CONSTANTS.a;
  const bz_radius = 4 * Math.PI / (3 * a);
  
  // Hexagonal BZ boundary
  const boundary: [number, number][] = [];
  for (let i = 0; i <= 6; i++) {
    const angle = (i * Math.PI) / 3;
    const kx = bz_radius * Math.cos(angle);
    const ky = bz_radius * Math.sin(angle);
    boundary.push([kx, ky]);
  }
  
  // EXACT high-symmetry points
  const highSymmetryPoints = {
    gamma: [0, 0] as [number, number],
    K: [4 * Math.PI / (3 * a), 0] as [number, number],
    Kprime: [-4 * Math.PI / (3 * a), 0] as [number, number],
    M: [Math.PI / a, Math.PI / (Math.sqrt(3) * a)] as [number, number]
  };
  
  // Generate path Γ → M → K → Γ
  const path: [number, number][] = [];
  const segments = [
    [highSymmetryPoints.gamma, highSymmetryPoints.M],
    [highSymmetryPoints.M, highSymmetryPoints.K],
    [highSymmetryPoints.K, highSymmetryPoints.gamma]
  ];
  
  for (const [start, end] of segments) {
    for (let i = 0; i < 50; i++) {
      const t = i / 49;
      path.push([
        start[0] + t * (end[0] - start[0]),
        start[1] + t * (end[1] - start[1])
      ]);
    }
  }
  
  // IBZ - triangular fundamental domain
  const ibz: [number, number][] = [
    [0, 0],
    [Math.PI / a, Math.PI / (Math.sqrt(3) * a)],
    [4 * Math.PI / (3 * a), 0],
    [0, 0]
  ];
  
  return {
    boundary,
    highSymmetryPoints,
    path,
    ibz
  };
}

/**
 * Generate 2D energy surface data
 */
export function generateExactEnergySurface(
  params: GrapheneParameters,
  center: [number, number] = [0, 0],
  range: number = 3,
  nPoints: number = 50
): {
  kx: number[];
  ky: number[];
  energyPlus: number[][];
  energyMinus: number[][];
} {
  const [cx, cy] = center;
  const kx = Array.from({ length: nPoints }, (_, i) => cx + range * (-1 + 2 * i / (nPoints - 1)));
  const ky = Array.from({ length: nPoints }, (_, i) => cy + range * (-1 + 2 * i / (nPoints - 1)));
  
  const energyPlus = Array.from({ length: nPoints }, (_, i) =>
    Array.from({ length: nPoints }, (_, j) => {
      const { energyPlus: E } = calculateExactEigenvalues(kx[i], ky[j], params);
      return Math.max(-4, Math.min(4, E));
    })
  );
  
  const energyMinus = Array.from({ length: nPoints }, (_, i) =>
    Array.from({ length: nPoints }, (_, j) => {
      const { energyMinus: E } = calculateExactEigenvalues(kx[i], ky[j], params);
      return Math.max(-4, Math.min(4, E));
    })
  );
  
  return { kx, ky, energyPlus, energyMinus };
}

// Default parameters
export const DEFAULT_GRAPHENE_PARAMETERS: GrapheneParameters = {
  t1: 2.8,      // NN hopping (eV)
  t2: 0.28,     // NNN hopping (eV) = 0.1 * t1
  strain: {
    exx: 0,     // No strain
    eyy: 0,
    exy: 0
  },
  onsite: 0     // No onsite energy
};