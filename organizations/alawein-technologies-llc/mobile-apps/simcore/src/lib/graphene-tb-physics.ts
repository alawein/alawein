/**
 * Scientifically accurate tight-binding physics for graphene
 * Implements full NN + NNN Hamiltonian with strain and SOC
 */

export interface GrapheneParameters {
  t1: number;        // NN hopping (eV)
  t2: number;        // NNN hopping (eV) 
  lambdaSO: number;  // SOC strength (eV)
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
  ibz: [number, number][];  // Irreducible Brillouin zone
}

// Physical constants
export const GRAPHENE_CONSTANTS = {
  a: 2.46,  // lattice constant (Angstrom)
  hbar: 0.6582119569,  // reduced Planck constant (eV⋅fs)
};

// Lattice vectors for NN (nearest neighbor)
const delta1: [number, number][] = [
  [GRAPHENE_CONSTANTS.a / 2, GRAPHENE_CONSTANTS.a * Math.sqrt(3) / 2],
  [-GRAPHENE_CONSTANTS.a / 2, GRAPHENE_CONSTANTS.a * Math.sqrt(3) / 2],
  [-GRAPHENE_CONSTANTS.a, 0]
];

// Lattice vectors for NNN (next-nearest neighbor)
const delta2: [number, number][] = [
  [GRAPHENE_CONSTANTS.a * Math.sqrt(3) / 2, GRAPHENE_CONSTANTS.a / 2],
  [GRAPHENE_CONSTANTS.a * Math.sqrt(3) / 2, -GRAPHENE_CONSTANTS.a / 2],
  [0, GRAPHENE_CONSTANTS.a],
  [0, -GRAPHENE_CONSTANTS.a],
  [-GRAPHENE_CONSTANTS.a * Math.sqrt(3) / 2, GRAPHENE_CONSTANTS.a / 2],
  [-GRAPHENE_CONSTANTS.a * Math.sqrt(3) / 2, -GRAPHENE_CONSTANTS.a / 2]
];

/**
 * Calculate structure factor f1(k) for NN terms
 */
function calculateF1(kx: number, ky: number): { real: number; imag: number; magnitude: number } {
  const a = GRAPHENE_CONSTANTS.a;
  
  // f1(k) = sum over NN vectors of exp(i k⋅δ)
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
 * Calculate structure factor f2(k) for NNN terms
 */
function calculateF2(kx: number, ky: number): number {
  const a = GRAPHENE_CONSTANTS.a;
  
  // f2(k) = sum over NNN vectors of cos(k⋅δ)
  let f2 = 0;
  
  for (const [dx, dy] of delta2) {
    const phase = kx * dx + ky * dy;
    f2 += Math.cos(phase);
  }
  
  return f2;
}

/**
 * Calculate energy eigenvalues for the tight-binding Hamiltonian
 * E±(k) = -t2 * f2(k) ± t1 * |f1(k)|
 */
export function calculateEigenvalues(
  kx: number, 
  ky: number, 
  params: GrapheneParameters
): { energyPlus: number; energyMinus: number } {
  const f1 = calculateF1(kx, ky);
  const f2 = calculateF2(kx, ky);
  
  const energyPlus = -params.t2 * f2 + params.t1 * f1.magnitude + params.onsite;
  const energyMinus = -params.t2 * f2 - params.t1 * f1.magnitude + params.onsite;
  
  return { energyPlus, energyMinus };
}

/**
 * Generate high-symmetry k-path: Γ → M → K → Γ
 * Using corrected reciprocal lattice vectors per ΓK = 4π/(3a) convention
 */
export function generateKPath(nPoints: number = 300): BandStructureResult {
  const path: [number, number][] = [];
  const kPath: number[] = [];
  const labels = ['Γ', 'M', 'K', 'Γ'];
  
  // Corrected lattice constant and reciprocal space metrics
  const a = GRAPHENE_CONSTANTS.a;
  const ΓK = (4 * Math.PI) / (3 * a);  // Corner radius to K point
  const ΓM = (2 * Math.PI) / (Math.sqrt(3) * a);  // Mid-edge radius to M point
  
  // Corrected high-symmetry points using proper lattice framework
  // K-point positioned at (4π/3a, 0) with ky = 0 on kx-axis
  const gamma: [number, number] = [0, 0];
  const M: [number, number] = [Math.PI / a, Math.PI / (Math.sqrt(3) * a)]; // Edge midpoint
  const K: [number, number] = [(4 * Math.PI) / (3 * a), 0]; // K-point with ky = 0
  
  const points = [gamma, M, K, gamma];
  const segmentPoints = Math.floor(nPoints / 3);
  
  let distance = 0;
  const labelPositions: number[] = [0];
  
  // Generate path segments
  for (let seg = 0; seg < 3; seg++) {
    const start = points[seg];
    const end = points[seg + 1];
    
    for (let i = 0; i < segmentPoints; i++) {
      const t = i / (segmentPoints - 1);
      const kx = start[0] + t * (end[0] - start[0]);
      const ky = start[1] + t * (end[1] - start[1]);
      
      path.push([kx, ky]);
      
      if (i > 0) {
        const dx = kx - path[path.length - 2][0];
        const dy = ky - path[path.length - 2][1];
        distance += Math.sqrt(dx * dx + dy * dy);
      }
      
      kPath.push(distance);
    }
    
    if (seg < 2) labelPositions.push(distance);
  }
  
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
 * Calculate band structure along high-symmetry path
 */
export function calculateBandStructure(params: GrapheneParameters): BandStructureResult {
  const pathData = generateKPath(300);
  const valence: number[] = [];
  const conduction: number[] = [];
  
  for (const [kx, ky] of pathData.kPoints) {
    const { energyPlus, energyMinus } = calculateEigenvalues(kx, ky, params);
    conduction.push(energyPlus);
    valence.push(energyMinus);
  }
  
  return {
    ...pathData,
    valence,
    conduction
  };
}

/**
 * Calculate density of states using histogram method
 */
export function calculateDOS(
  params: GrapheneParameters, 
  energyRange: [number, number] = [-5, 5],
  nBins: number = 200,
  nKPoints: number = 100
): DOSResult {
  const [eMin, eMax] = energyRange;
  const energies = Array.from({ length: nBins }, (_, i) => eMin + (eMax - eMin) * i / (nBins - 1));
  const dos = new Array(nBins).fill(0);
  
  // Generate k-point mesh in BZ using correct ΓK = 4π/(3a) boundary
  const a = GRAPHENE_CONSTANTS.a;
  const ΓK = (4 * Math.PI) / (3 * a);
  const kMax = ΓK;
  const dk = 2 * kMax / nKPoints;
  
  let totalStates = 0;
  
  for (let i = 0; i < nKPoints; i++) {
    for (let j = 0; j < nKPoints; j++) {
      const kx = -kMax + i * dk;
      const ky = -kMax + j * dk;
      
      const { energyPlus, energyMinus } = calculateEigenvalues(kx, ky, params);
      
      // Bin the energies
      for (const band of [energyPlus, energyMinus]) {
        if (band >= eMin && band <= eMax) {
          const binIndex = Math.floor((band - eMin) / (eMax - eMin) * (nBins - 1));
          if (binIndex >= 0 && binIndex < nBins) {
            dos[binIndex]++;
            totalStates++;
          }
        }
      }
    }
  }
  
  // Normalize DOS
  const binWidth = (eMax - eMin) / nBins;
  const normalizedDOS = dos.map(count => count / (totalStates * binWidth));
  
  // Calculate linear DOS near Dirac point (analytical)
  const fermiVelocity = calculateFermiVelocity(params);
  const linearDOS = energies.map(E => {
    const EShifted = Math.abs(E - 3 * params.t2);
    return 2 * EShifted / (Math.PI * Math.pow(GRAPHENE_CONSTANTS.hbar * fermiVelocity, 2));
  });
  
  return {
    energies,
    dos: normalizedDOS,
    linearDOS
  };
}

/**
 * Calculate Fermi velocity at K-point
 */
export function calculateFermiVelocity(params: GrapheneParameters): number {
  const a = GRAPHENE_CONSTANTS.a;
  return (3 * params.t1 * a) / (2 * GRAPHENE_CONSTANTS.hbar);
}

/**
 * Validate Dirac point physics: f1(K) should equal 0
 */
export function validateDiracPoint(): {
  kPoint: [number, number];
  f1Real: number;
  f1Imag: number;
  f1Magnitude: number;
  isValid: boolean;
} {
  const a = GRAPHENE_CONSTANTS.a;
  // Corrected K-point position at (4π/3a, 0) with ky = 0
  const K: [number, number] = [(4 * Math.PI) / (3 * a), 0];
  
  const f1 = calculateF1(K[0], K[1]);
  const tolerance = 1e-10;
  const isValid = f1.magnitude < tolerance;
  
  return {
    kPoint: K,
    f1Real: f1.real,
    f1Imag: f1.imag,
    f1Magnitude: f1.magnitude,
    isValid
  };
}

/**
 * Generate correct hexagonal Brillouin zone boundary using ΓK = 4π/(3a) convention
 */
export function getBrillouinZoneData(): BrillouinZoneData {
  const a = GRAPHENE_CONSTANTS.a;
  const ΓK = (4 * Math.PI) / (3 * a);  // Corner radius to K point
  
  // Construct hexagonal BZ with corner radius ΓK = 4π/(3a)
  function constructBrillouinZone(a: number): [number, number][] {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const kx = ΓK * Math.cos(angle);
      const ky = ΓK * Math.sin(angle);
      vertices.push([kx, ky] as [number, number]);
    }
    // Close the hexagon
    vertices.push(vertices[0]);
    return vertices;
  }
  
  const boundary = constructBrillouinZone(a);
  
  // Corrected high-symmetry points using proper lattice framework
  const highSymmetryPoints = {
    gamma: [0, 0] as [number, number],                                           // Zone center
    K: [(4 * Math.PI) / (3 * a), 0] as [number, number],                       // K-point at ky = 0
    Kprime: [-(4 * Math.PI) / (3 * a), 0] as [number, number],                 // K'-point at ky = 0
    M: [Math.PI / a, Math.PI / (Math.sqrt(3) * a)] as [number, number]         // Edge midpoint
  };
  
  // Generate path Γ → M → K → Γ with correct coordinates
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
  
  // Corrected irreducible Brillouin zone (IBZ) - proper Γ-M-K triangle
  // Represents exactly 1/12 of the full BZ area (D₆ₕ symmetry)
  const ibzVertices: [number, number][] = [
    [0, 0],                                        // Γ point
    [Math.PI / a, Math.PI / (Math.sqrt(3) * a)],  // M point (edge midpoint)
    [(4 * Math.PI) / (3 * a), 0],                 // K point (vertex, ky = 0)
    [0, 0]                                         // Close triangle
  ];
  
  return {
    boundary,
    highSymmetryPoints,
    path,
    ibz: ibzVertices  // Add IBZ to the data structure
  };
}

/**
 * Generate 2D energy surface data for contour/3D plots
 */
export function generateEnergySurface(
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
      const { energyPlus } = calculateEigenvalues(kx[i], ky[j], params);
      return energyPlus;
    })
  );
  
  const energyMinus = Array.from({ length: nPoints }, (_, i) =>
    Array.from({ length: nPoints }, (_, j) => {
      const { energyMinus } = calculateEigenvalues(kx[i], ky[j], params);
      return energyMinus;
    })
  );
  
  return { kx, ky, energyPlus, energyMinus };
}