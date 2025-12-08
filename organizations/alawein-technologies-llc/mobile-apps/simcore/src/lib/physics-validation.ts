/**
 * PHYSICS VALIDATION UTILITIES
 * 
 * Standardized validation functions to ensure physics accuracy
 * across all simulation modules.
 */

export interface PhysicsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metrics: Record<string, number>;
}

export class PhysicsValidator {
  
  /**
   * Validate quantum mechanical wave function
   */
  static validateWaveFunction(
    psiReal: number[], 
    psiImag: number[], 
    dx: number
  ): PhysicsValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics: Record<string, number> = {};
    
    // Check array lengths
    if (psiReal.length !== psiImag.length) {
      errors.push('Real and imaginary parts have different lengths');
    }
    
    // Calculate probability density
    const probDensity = psiReal.map((real, i) => real * real + psiImag[i] * psiImag[i]);
    
    // Check for NaN or infinite values
    const hasInvalidValues = probDensity.some(p => !isFinite(p));
    if (hasInvalidValues) {
      errors.push('Wave function contains NaN or infinite values');
    }
    
    // Normalize and check conservation
    const totalProbability = probDensity.reduce((sum, p) => sum + p, 0) * dx;
    metrics.totalProbability = totalProbability;
    
    if (Math.abs(totalProbability - 1.0) > 1e-3) {
      warnings.push(`Probability not normalized: ${totalProbability.toFixed(6)}`);
    }
    
    // Check smoothness (gradient)
    const maxGradient = Math.max(...psiReal.slice(1).map((val, i) => 
      Math.abs(val - psiReal[i]) / dx
    ));
    metrics.maxGradient = maxGradient;
    
    if (maxGradient > 1e6) {
      warnings.push('Wave function may have numerical instabilities');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metrics
    };
  }
  
  /**
   * Validate Hamiltonian matrix properties
   */
  static validateHamiltonian(H: number[][]): PhysicsValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics: Record<string, number> = {};
    
    const n = H.length;
    
    // Check if square matrix
    if (!H.every(row => row.length === n)) {
      errors.push('Hamiltonian is not a square matrix');
      return { isValid: false, errors, warnings, metrics };
    }
    
    // Check Hermiticity
    let maxHermitianError = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const error = Math.abs(H[i][j] - H[j][i]);
        maxHermitianError = Math.max(maxHermitianError, error);
      }
    }
    
    metrics.hermitianError = maxHermitianError;
    
    if (maxHermitianError > 1e-10) {
      if (maxHermitianError > 1e-6) {
        errors.push('Hamiltonian is not Hermitian');
      } else {
        warnings.push('Small Hermiticity violation detected');
      }
    }
    
    // Check for NaN values
    const hasNaN = H.some(row => row.some(val => !isFinite(val)));
    if (hasNaN) {
      errors.push('Hamiltonian contains NaN or infinite values');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metrics
    };
  }
  
  /**
   * Validate energy conservation in dynamics
   */
  static validateEnergyConservation(
    energyHistory: number[],
    tolerance: number = 1e-6
  ): PhysicsValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics: Record<string, number> = {};
    
    if (energyHistory.length < 2) {
      warnings.push('Insufficient data for energy conservation check');
      return { isValid: true, errors, warnings, metrics };
    }
    
    const initialEnergy = energyHistory[0];
    const energyDrifts = energyHistory.map(E => Math.abs(E - initialEnergy));
    const maxDrift = Math.max(...energyDrifts);
    const avgDrift = energyDrifts.reduce((sum, drift) => sum + drift, 0) / energyDrifts.length;
    
    metrics.maxEnergyDrift = maxDrift;
    metrics.avgEnergyDrift = avgDrift;
    metrics.relativeEnergyDrift = maxDrift / Math.abs(initialEnergy);
    
    if (maxDrift > tolerance * Math.abs(initialEnergy)) {
      if (maxDrift > 0.01 * Math.abs(initialEnergy)) {
        errors.push(`Large energy drift: ${(metrics.relativeEnergyDrift * 100).toFixed(3)}%`);
      } else {
        warnings.push(`Small energy drift detected: ${(metrics.relativeEnergyDrift * 100).toFixed(6)}%`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metrics
    };
  }
  
  /**
   * Validate band structure properties
   */
  static validateBandStructure(
    kPoints: number[][],
    energies: number[][],
    symmetryPoints: Record<string, number[]>
  ): PhysicsValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics: Record<string, number> = {};
    
    // Check data consistency
    if (kPoints.length !== energies.length) {
      errors.push('k-points and energies arrays have different lengths');
    }
    
    // Check for gaps at high-symmetry points
    Object.entries(symmetryPoints).forEach(([label, kPoint]) => {
      const distances = kPoints.map(k => 
        Math.sqrt(k.reduce((sum, ki, i) => sum + (ki - kPoint[i])**2, 0))
      );
      const closestIndex = distances.indexOf(Math.min(...distances));
      
      if (distances[closestIndex] > 0.01) {
        warnings.push(`High-symmetry point ${label} not well-sampled`);
      }
    });
    
    // Check for band crossings
    const bandGaps = energies[0].map((_, bandIndex) => {
      const bandEnergies = energies.map(kEnergies => kEnergies[bandIndex]);
      return Math.min(...bandEnergies.slice(1)) - Math.max(...bandEnergies.slice(0, -1));
    });
    
    metrics.minBandGap = Math.min(...bandGaps);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metrics
    };
  }
  
  /**
   * Validate thermal equilibrium in statistical mechanics
   */
  static validateThermalEquilibrium(
    energies: number[],
    populations: number[],
    temperature: number,
    kB: number = 8.617e-5 // eV/K
  ): PhysicsValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics: Record<string, number> = {};
    
    if (energies.length !== populations.length) {
      errors.push('Energies and populations arrays have different lengths');
    }
    
    // Calculate theoretical Boltzmann distribution
    const beta = 1 / (kB * temperature);
    const boltzmannFactors = energies.map(E => Math.exp(-beta * E));
    const Z = boltzmannFactors.reduce((sum, factor) => sum + factor, 0);
    const theoreticalPops = boltzmannFactors.map(factor => factor / Z);
    
    // Compare with actual populations
    const popErrors = populations.map((pop, i) => 
      Math.abs(pop - theoreticalPops[i])
    );
    const maxPopError = Math.max(...popErrors);
    const avgPopError = popErrors.reduce((sum, err) => sum + err, 0) / popErrors.length;
    
    metrics.maxPopulationError = maxPopError;
    metrics.avgPopulationError = avgPopError;
    
    if (maxPopError > 0.05) {
      warnings.push('Significant deviation from Boltzmann distribution');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metrics
    };
  }
}

/**
 * PHYSICS UNIT CONVERTER
 */
export class PhysicsUnits {
  static readonly constants = {
    c: 299792458,           // m/s
    h: 6.62607015e-34,      // J⋅s  
    hbar: 1.054571817e-34,  // J⋅s
    kB: 1.380649e-23,       // J/K
    e: 1.602176634e-19,     // C
    me: 9.1093837015e-31,   // kg
    a0: 5.29177210903e-11,  // m
    Ry: 13.605693122994     // eV
  };
  
  static eVToJoule(eV: number): number {
    return eV * this.constants.e;
  }
  
  static jouleToEV(J: number): number {
    return J / this.constants.e;
  }
  
  static hartreeToEV(hartree: number): number {
    return hartree * 27.211386245988;
  }
  
  static rydbergToEV(rydberg: number): number {
    return rydberg * this.constants.Ry;
  }
  
  static angstromToMeter(angstrom: number): number {
    return angstrom * 1e-10;
  }
  
  static meterToAngstrom(meter: number): number {
    return meter * 1e10;
  }
}

export default PhysicsValidator;