/**
 * Enhanced Physics Library for SimCore Explorer
 * Scientifically accurate implementations with proper units and constants
 */

// Physical Constants (SI units)
export const PHYSICS_CONSTANTS = {
  // Fundamental constants
  h: 6.62607015e-34,      // Planck constant (J⋅s)
  hbar: 1.054571817e-34,  // Reduced Planck constant (J⋅s)
  c: 299792458,           // Speed of light (m/s)
  e: 1.602176634e-19,    // Elementary charge (C)
  me: 9.1093837015e-31,  // Electron mass (kg)
  kb: 1.380649e-23,      // Boltzmann constant (J/K)
  
  // Graphene-specific constants
  a_graphene: 2.46e-10,   // Lattice constant (m)
  t_graphene: 2.8,        // Nearest neighbor hopping (eV)
  vf_graphene: 1e6,       // Fermi velocity (m/s)
  
  // Unit conversions
  eV_to_J: 1.602176634e-19,
  J_to_eV: 1 / 1.602176634e-19,
  Angstrom_to_m: 1e-10,
} as const;

/**
 * Graphene Band Structure Calculations
 * Based on nearest-neighbor tight-binding model
 */
export class GrapheneBandStructure {
  private t1: number;  // Nearest neighbor hopping (eV)
  private t2: number;  // Next-nearest neighbor hopping (eV)
  private a: number;   // Lattice constant (Å)
  private soc: number; // Spin-orbit coupling (eV)
  
  constructor(
    t1 = 2.8,
    t2 = 0.0,
    a = 2.46,
    soc = 0.0
  ) {
    this.t1 = t1;
    this.t2 = t2;
    this.a = a;
    this.soc = soc;
  }
  
  /**
   * Calculate structure factor for hexagonal lattice
   */
  private structureFactor(kx: number, ky: number): { real: number; imag: number } {
    const ka = this.a * PHYSICS_CONSTANTS.Angstrom_to_m;
    
    // Three nearest neighbor vectors in reciprocal space
    const arg1 = kx * ka / 2;
    const arg2 = -kx * ka / 2 + ky * ka * Math.sqrt(3) / 2;
    const arg3 = -kx * ka / 2 - ky * ka * Math.sqrt(3) / 2;
    
    const real = Math.cos(arg1) + Math.cos(arg2) + Math.cos(arg3);
    const imag = Math.sin(arg1) + Math.sin(arg2) + Math.sin(arg3);
    
    return { real, imag };
  }
  
  /**
   * Calculate band energies at given k-point
   */
  calculateBands(kx: number, ky: number): { 
    energyPlus: number; 
    energyMinus: number; 
    velocity: number;
    gap: number;
  } {
    const { real, imag } = this.structureFactor(kx, ky);
    const f_magnitude = Math.sqrt(real * real + imag * imag);
    
    // Nearest neighbor contribution
    const gamma0 = this.t1 * f_magnitude;
    
    // Next-nearest neighbor contribution (if included)
    let gamma2 = 0;
    if (this.t2 !== 0) {
      const ka = this.a * PHYSICS_CONSTANTS.Angstrom_to_m;
      gamma2 = this.t2 * (
        2 * Math.cos(Math.sqrt(3) * ky * ka) +
        4 * Math.cos(3 * kx * ka / 2) * Math.cos(Math.sqrt(3) * ky * ka / 2)
      );
    }
    
    // Band energies
    const energyPlus = gamma2 + gamma0;
    const energyMinus = gamma2 - gamma0;
    
    // Fermi velocity (magnitude of energy gradient)
    const velocity = (3 * this.t1 * this.a * PHYSICS_CONSTANTS.Angstrom_to_m) / 
                    (2 * PHYSICS_CONSTANTS.hbar) * PHYSICS_CONSTANTS.eV_to_J;
    
    // Band gap (should be zero for pristine graphene)
    const gap = Math.abs(energyPlus - energyMinus);
    
    return { energyPlus, energyMinus, velocity, gap };
  }
  
  /**
   * Generate high-symmetry k-path: Γ → M → K → Γ
   */
  generateHighSymmetryPath(nPoints = 150): {
    kx: number[];
    ky: number[];
    labels: string[];
    positions: number[];
  } {
    const kx: number[] = [];
    const ky: number[] = [];
    const labels: string[] = [];
    const positions: number[] = [];
    
    const b = 4 * Math.PI / (3 * this.a * PHYSICS_CONSTANTS.Angstrom_to_m);
    
    // Γ (0,0) → M (π/a, 0)
    const nSegment = Math.floor(nPoints / 3);
    
    // Γ to M
    for (let i = 0; i <= nSegment; i++) {
      const t = i / nSegment;
      kx.push(t * b / 2);
      ky.push(0);
      positions.push(i);
      
      if (i === 0) labels.push('Γ');
      else if (i === nSegment) labels.push('M');
      else labels.push('');
    }
    
    // M to K
    for (let i = 1; i <= nSegment; i++) {
      const t = i / nSegment;
      const kx_start = b / 2;
      const ky_start = 0;
      const kx_end = b * 2 / 3;
      const ky_end = b * 2 / (3 * Math.sqrt(3));
      
      kx.push(kx_start + t * (kx_end - kx_start));
      ky.push(ky_start + t * (ky_end - ky_start));
      positions.push(nSegment + i);
      
      if (i === nSegment) labels.push('K');
      else labels.push('');
    }
    
    // K to Γ
    for (let i = 1; i <= nSegment; i++) {
      const t = i / nSegment;
      const kx_start = b * 2 / 3;
      const ky_start = b * 2 / (3 * Math.sqrt(3));
      
      kx.push(kx_start * (1 - t));
      ky.push(ky_start * (1 - t));
      positions.push(2 * nSegment + i);
      
      if (i === nSegment) labels.push('Γ');
      else labels.push('');
    }
    
    return { kx, ky, labels, positions };
  }
  
  /**
   * Generate 2D k-mesh for Brillouin zone
   */
  generate2DMesh(nk = 100): {
    kx: number[];
    ky: number[];
    energyPlus: number[][];
    energyMinus: number[][];
  } {
    const b = 4 * Math.PI / (3 * this.a * PHYSICS_CONSTANTS.Angstrom_to_m);
    const dk = 2 * b / nk;
    
    const kx: number[] = [];
    const ky: number[] = [];
    const energyPlus: number[][] = [];
    const energyMinus: number[][] = [];
    
    for (let i = 0; i < nk; i++) {
      kx.push((i - nk / 2) * dk);
      ky.push((i - nk / 2) * dk);
    }
    
    for (let i = 0; i < nk; i++) {
      energyPlus[i] = [];
      energyMinus[i] = [];
      for (let j = 0; j < nk; j++) {
        const { energyPlus: ep, energyMinus: em } = this.calculateBands(kx[i], ky[j]);
        energyPlus[i][j] = ep;
        energyMinus[i][j] = em;
      }
    }
    
    return { kx, ky, energyPlus, energyMinus };
  }
  
  /**
   * Calculate Fermi velocity at specific k-point
   */
  calculateFermiVelocity(kx: number, ky: number): number {
    // For graphene, Fermi velocity is approximately constant
    return (3 * this.t1 * this.a * PHYSICS_CONSTANTS.Angstrom_to_m * PHYSICS_CONSTANTS.eV_to_J) / 
           (2 * PHYSICS_CONSTANTS.hbar);
  }
  
  /**
   * Get Dirac point positions
   */
  getDiracPoints(): Array<{ kx: number; ky: number; name: string }> {
    const b = 4 * Math.PI / (3 * this.a * PHYSICS_CONSTANTS.Angstrom_to_m);
    
    return [
      { kx: b * 2/3, ky: 0, name: 'K' },
      { kx: -b * 2/3, ky: 0, name: "K'" },
      { kx: b * 1/3, ky: b / Math.sqrt(3), name: 'K' },
      { kx: -b * 1/3, ky: -b / Math.sqrt(3), name: "K'" },
      { kx: -b * 1/3, ky: b / Math.sqrt(3), name: 'K' },
      { kx: b * 1/3, ky: -b / Math.sqrt(3), name: "K'" },
    ];
  }
}

/**
 * Strain effects on graphene
 */
export class GrapheneStrain {
  /**
   * Calculate strain-modified hopping parameters
   */
  static modifyHopping(
    t0: number,
    strain: { xx: number; yy: number; xy: number },
    beta = 3.37  // Grueneisen parameter
  ): number {
    const strainTrace = strain.xx + strain.yy;
    return t0 * (1 - beta * strainTrace);
  }
  
  /**
   * Calculate pseudo-magnetic field from strain
   */
  static pseudoMagneticField(
    strain: { xx: number; yy: number; xy: number },
    a = 2.46e-10  // Lattice constant in meters
  ): number {
    const beta = 3.37;
    const strainGradient = Math.sqrt(
      Math.pow(strain.xx - strain.yy, 2) + 4 * strain.xy * strain.xy
    );
    
    return (beta * PHYSICS_CONSTANTS.hbar * Math.sqrt(3)) / 
           (2 * PHYSICS_CONSTANTS.e * a * a) * strainGradient;
  }
}

/**
 * Quantum Tunneling Calculations
 */
export class QuantumTunneling {
  /**
   * Calculate transmission coefficient for rectangular barrier
   */
  static transmissionCoefficient(
    E: number,      // Particle energy (eV)
    V0: number,     // Barrier height (eV)
    a: number,      // Barrier width (nm)
    m = PHYSICS_CONSTANTS.me  // Particle mass (kg)
  ): number {
    const E_J = E * PHYSICS_CONSTANTS.eV_to_J;
    const V0_J = V0 * PHYSICS_CONSTANTS.eV_to_J;
    const a_m = a * 1e-9;
    
    if (E >= V0) {
      // Above barrier - classical transmission
      return 1.0;
    }
    
    const k = Math.sqrt(2 * m * (V0_J - E_J)) / PHYSICS_CONSTANTS.hbar;
    const ka = k * a_m;
    
    // Transmission coefficient
    const T = 1 / (1 + (V0_J * V0_J * Math.sinh(ka) * Math.sinh(ka)) / 
                      (4 * E_J * (V0_J - E_J)));
    
    return T;
  }
  
  /**
   * Generate wavefunction for tunneling problem
   */
  static generateWavefunction(
    E: number,
    V0: number,
    a: number,
    xRange: { min: number; max: number },
    nPoints = 1000
  ): { x: number[]; psi_real: number[]; psi_imag: number[]; V: number[] } {
    const x: number[] = [];
    const psi_real: number[] = [];
    const psi_imag: number[] = [];
    const V: number[] = [];
    
    const dx = (xRange.max - xRange.min) / nPoints;
    
    for (let i = 0; i < nPoints; i++) {
      const xi = xRange.min + i * dx;
      x.push(xi);
      
      // Potential
      if (xi >= -a/2 && xi <= a/2) {
        V.push(V0);
      } else {
        V.push(0);
      }
      
      // Simplified wavefunction (plane wave approximation)
      const k = Math.sqrt(2 * PHYSICS_CONSTANTS.me * E * PHYSICS_CONSTANTS.eV_to_J) / PHYSICS_CONSTANTS.hbar;
      
      if (xi < -a/2) {
        // Region I: incident + reflected wave
        psi_real.push(Math.cos(k * xi * 1e-9) + 0.3 * Math.cos(-k * xi * 1e-9));
        psi_imag.push(Math.sin(k * xi * 1e-9) - 0.3 * Math.sin(-k * xi * 1e-9));
      } else if (xi > a/2) {
        // Region III: transmitted wave
        const T = this.transmissionCoefficient(E, V0, a);
        psi_real.push(Math.sqrt(T) * Math.cos(k * xi * 1e-9));
        psi_imag.push(Math.sqrt(T) * Math.sin(k * xi * 1e-9));
      } else {
        // Region II: exponentially decaying wave
        const kappa = Math.sqrt(2 * PHYSICS_CONSTANTS.me * (V0 - E) * PHYSICS_CONSTANTS.eV_to_J) / PHYSICS_CONSTANTS.hbar;
        const decay = Math.exp(-kappa * Math.abs(xi) * 1e-9);
        psi_real.push(0.7 * decay * Math.cos(k * xi * 1e-9));
        psi_imag.push(0.7 * decay * Math.sin(k * xi * 1e-9));
      }
    }
    
    // Normalize wavefunction to ensure ∫|ψ|^2 dx = 1
    let normSq = 0;
    for (let i = 0; i < nPoints; i++) {
      normSq += (psi_real[i] * psi_real[i] + psi_imag[i] * psi_imag[i]);
    }
    normSq *= dx;
    const invNorm = normSq > 0 ? 1 / Math.sqrt(normSq) : 1;
    for (let i = 0; i < nPoints; i++) {
      psi_real[i] *= invNorm;
      psi_imag[i] *= invNorm;
    }
    
    return { x, psi_real, psi_imag, V };
  }
}

/**
 * Statistical Physics - Ising Model
 */
export class IsingModel2D {
  private lattice: number[][];
  private size: number;
  private temperature: number;
  private J: number; // Coupling constant
  
  constructor(size = 50, temperature = 2.27, J = 1.0) {
    this.size = size;
    this.temperature = temperature;
    this.J = J;
    this.lattice = this.initializeLattice();
  }
  
  private initializeLattice(): number[][] {
    const lattice: number[][] = [];
    for (let i = 0; i < this.size; i++) {
      lattice[i] = [];
      for (let j = 0; j < this.size; j++) {
        lattice[i][j] = Math.random() > 0.5 ? 1 : -1;
      }
    }
    return lattice;
  }
  
  /**
   * Calculate local energy change for spin flip
   */
  private deltaE(i: number, j: number): number {
    const s = this.lattice[i][j];
    const neighbors = [
      this.lattice[(i - 1 + this.size) % this.size][j],
      this.lattice[(i + 1) % this.size][j],
      this.lattice[i][(j - 1 + this.size) % this.size],
      this.lattice[i][(j + 1) % this.size]
    ];
    
    return 2 * this.J * s * neighbors.reduce((sum, neighbor) => sum + neighbor, 0);
  }
  
  /**
   * Perform one Monte Carlo step (Metropolis algorithm)
   */
  metropolisStep(): void {
    for (let step = 0; step < this.size * this.size; step++) {
      const i = Math.floor(Math.random() * this.size);
      const j = Math.floor(Math.random() * this.size);
      
      const dE = this.deltaE(i, j);
      
      if (dE <= 0 || Math.random() < Math.exp(-dE / this.temperature)) {
        this.lattice[i][j] *= -1;
      }
    }
  }
  
  /**
   * Calculate magnetization
   */
  calculateMagnetization(): number {
    let total = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        total += this.lattice[i][j];
      }
    }
    return total / (this.size * this.size);
  }
  
  /**
   * Calculate energy
   */
  calculateEnergy(): number {
    let energy = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const neighbors = [
          this.lattice[(i + 1) % this.size][j],
          this.lattice[i][(j + 1) % this.size]
        ];
        energy -= this.J * this.lattice[i][j] * neighbors.reduce((sum, n) => sum + n, 0);
      }
    }
    return energy / (this.size * this.size);
  }
  
  getLattice(): number[][] {
    return this.lattice;
  }
  
  setTemperature(T: number): void {
    this.temperature = T;
  }
}

/**
 * Export all enhanced physics classes and constants
 */
export {
  PHYSICS_CONSTANTS as PhysicsConstants
};