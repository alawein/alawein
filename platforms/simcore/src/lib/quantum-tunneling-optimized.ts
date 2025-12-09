/**
 * QUANTUM TUNNELING PHYSICS ENGINE - OPTIMIZED
 * 
 * High-performance implementation with WebWorker support
 * and memory-efficient calculations.
 */

import { PhysicsValidator } from './physics-validation';

export interface TunnelingParameters {
  barrierHeight: number;
  barrierWidth: number;
  barrierPosition: number;
  particleEnergy: number;
  particleMass: number;
  wavePacketWidth: number;
  initialPosition: number;
  initialMomentum: number;
  time: number;
  barrierShape: 'rectangular' | 'gaussian' | 'triangular' | 'double_well' | 'coulomb';
  method: 'split_operator' | 'crank_nicolson' | 'euler';
  absorbing: boolean;
}

export interface TunnelingResult {
  x: Float64Array;
  potential: Float64Array;
  waveReal: Float64Array;
  waveImag: Float64Array;
  probability: Float64Array;
  transmission: number;
  reflection: number;
  barrierOccupancy: number;
  wkbTransmission: number;
  classicalForbidden: boolean;
  groupVelocity: number;
  deBroglieWavelength: number;
  conservationMetrics: {
    probabilityConservation: number;
    averageEnergy: number;
    positionExpectation: number;
    momentumExpectation: number;
  };
  resonanceStrength: number;
  actionIntegral: number;
  phaseShift: number;
  validationResult: any;
}

/**
 * Optimized quantum tunneling calculation engine
 */
export class OptimizedTunnelingEngine {
  private gridPoints: number;
  private workBuffer: ArrayBuffer;
  private x: Float64Array;
  private V: Float64Array;
  private psiReal: Float64Array;
  private psiImag: Float64Array;
  private tempReal: Float64Array;
  private tempImag: Float64Array;
  
  constructor(gridPoints: number = 512) {
    this.gridPoints = gridPoints;
    
    // Pre-allocate all arrays to avoid garbage collection
    const totalElements = gridPoints * 6; // x, V, psiReal, psiImag, tempReal, tempImag
    this.workBuffer = new ArrayBuffer(totalElements * 8); // 8 bytes per Float64
    
    let offset = 0;
    this.x = new Float64Array(this.workBuffer, offset, gridPoints);
    offset += gridPoints * 8;
    
    this.V = new Float64Array(this.workBuffer, offset, gridPoints);
    offset += gridPoints * 8;
    
    this.psiReal = new Float64Array(this.workBuffer, offset, gridPoints);
    offset += gridPoints * 8;
    
    this.psiImag = new Float64Array(this.workBuffer, offset, gridPoints);
    offset += gridPoints * 8;
    
    this.tempReal = new Float64Array(this.workBuffer, offset, gridPoints);
    offset += gridPoints * 8;
    
    this.tempImag = new Float64Array(this.workBuffer, offset, gridPoints);
  }
  
  /**
   * Calculate tunneling with optimized algorithms
   */
  calculate(params: TunnelingParameters): TunnelingResult {
    const L = 20; // Total length
    const dx = L / this.gridPoints;
    const dt = Math.min(0.001, dx * dx * params.particleMass / 2);
    
    // Setup spatial grid - vectorized
    for (let i = 0; i < this.gridPoints; i++) {
      this.x[i] = -L/2 + i * dx;
    }
    
    // Setup potential - optimized shape functions
    this.setupPotential(params, dx, L);
    
    // Initialize wave function - optimized
    this.initializeWaveFunction(params, dx);
    
    // Time evolution - method dispatch
    const numSteps = Math.floor(params.time / dt);
    this.timeEvolution(params, dt, numSteps);
    
    // Calculate observables and validate
    const result = this.calculateObservables(params, dx, dt);
    
    // Physics validation
    result.validationResult = PhysicsValidator.validateWaveFunction(
      Array.from(this.psiReal),
      Array.from(this.psiImag),
      dx
    );
    
    return result;
  }
  
  /**
   * Optimized potential setup with shape-specific implementations
   */
  private setupPotential(params: TunnelingParameters, dx: number, L: number): void {
    const { barrierHeight, barrierWidth, barrierPosition, barrierShape, absorbing } = params;
    const halfWidth = barrierWidth / 2;
    
    // Vectorized potential calculation
    for (let i = 0; i < this.gridPoints; i++) {
      const relPos = this.x[i] - barrierPosition;
      
      // Shape-specific optimized calculations
      switch (barrierShape) {
        case 'rectangular':
          this.V[i] = Math.abs(relPos) < halfWidth ? barrierHeight : 0;
          break;
          
        case 'gaussian':
          this.V[i] = barrierHeight * Math.exp(-0.5 * (relPos / (barrierWidth/3))**2);
          break;
          
        case 'triangular':
          this.V[i] = Math.abs(relPos) < halfWidth ? 
            barrierHeight * (1 - 2*Math.abs(relPos)/barrierWidth) : 0;
          break;
          
        case 'double_well': {
          const sep = barrierWidth/3;
          const sigma = barrierWidth/6;
          this.V[i] = barrierHeight * (
            Math.exp(-0.5 * ((relPos - sep) / sigma)**2) +
            Math.exp(-0.5 * ((relPos + sep) / sigma)**2)
          );
          break;
        }
          
        case 'coulomb': {
          const r = Math.max(Math.abs(relPos), 0.1);
          this.V[i] = barrierHeight / r * Math.exp(-r/barrierWidth);
          break;
        }
          
        default:
          this.V[i] = Math.abs(relPos) < halfWidth ? barrierHeight : 0;
      }
      
      // Absorbing boundaries
      if (absorbing) {
        const absLength = L * 0.1;
        if (this.x[i] < -L/2 + absLength) {
          this.V[i] += barrierHeight * 0.1 * ((this.x[i] + L/2)/absLength)**2;
        } else if (this.x[i] > L/2 - absLength) {
          this.V[i] += barrierHeight * 0.1 * ((this.x[i] - L/2 + absLength)/absLength)**2;
        }
      }
    }
  }
  
  /**
   * Optimized wave function initialization
   */
  private initializeWaveFunction(params: TunnelingParameters, dx: number): void {
    const { wavePacketWidth: sigma, initialPosition: x0, initialMomentum: k } = params;
    
    // Vectorized initialization
    let norm = 0;
    for (let i = 0; i < this.gridPoints; i++) {
      const dx_val = this.x[i] - x0;
      const envelope = Math.exp(-0.5 * (dx_val / sigma)**2);
      const phase = k * this.x[i];
      
      this.psiReal[i] = envelope * Math.cos(phase);
      this.psiImag[i] = envelope * Math.sin(phase);
      
      norm += this.psiReal[i]**2 + this.psiImag[i]**2;
    }
    
    // Normalize
    norm = Math.sqrt(norm * dx);
    const invNorm = 1.0 / norm;
    for (let i = 0; i < this.gridPoints; i++) {
      this.psiReal[i] *= invNorm;
      this.psiImag[i] *= invNorm;
    }
  }
  
  /**
   * Optimized time evolution with method dispatch
   */
  private timeEvolution(params: TunnelingParameters, dt: number, numSteps: number): void {
    switch (params.method) {
      case 'split_operator':
        this.splitOperatorEvolution(params, dt, numSteps);
        break;
      case 'crank_nicolson':
        this.crankNicolsonEvolution(params, dt, numSteps);
        break;
      case 'euler':
        this.eulerEvolution(params, dt, numSteps);
        break;
    }
  }
  
  /**
   * Optimized split-operator method
   */
  private splitOperatorEvolution(params: TunnelingParameters, dt: number, numSteps: number): void {
    const hbar = 1;
    const dx = 20 / this.gridPoints;
    const kineticFactor = -hbar * dt / (2 * params.particleMass * dx * dx);
    
    for (let step = 0; step < numSteps; step++) {
      // Potential evolution: exp(-iVdt/ℏ) - vectorized
      for (let i = 0; i < this.gridPoints; i++) {
        const phase = -this.V[i] * dt / hbar;
        const cosPhase = Math.cos(phase);
        const sinPhase = Math.sin(phase);
        
        const realTemp = this.psiReal[i] * cosPhase - this.psiImag[i] * sinPhase;
        const imagTemp = this.psiReal[i] * sinPhase + this.psiImag[i] * cosPhase;
        
        this.psiReal[i] = realTemp;
        this.psiImag[i] = imagTemp;
      }
      
      // Kinetic evolution: exp(-iT dt/ℏ) using finite differences
      // Use temp arrays to avoid overwriting during calculation
      this.tempReal.fill(0);
      this.tempImag.fill(0);
      
      for (let i = 1; i < this.gridPoints - 1; i++) {
        const laplacianReal = this.psiReal[i+1] - 2*this.psiReal[i] + this.psiReal[i-1];
        const laplacianImag = this.psiImag[i+1] - 2*this.psiImag[i] + this.psiImag[i-1];
        
        this.tempReal[i] = this.psiReal[i] + kineticFactor * laplacianImag;
        this.tempImag[i] = this.psiImag[i] - kineticFactor * laplacianReal;
      }
      
      // Copy back - vectorized
      for (let i = 1; i < this.gridPoints - 1; i++) {
        this.psiReal[i] = this.tempReal[i];
        this.psiImag[i] = this.tempImag[i];
      }
    }
  }
  
  /**
   * Simplified Crank-Nicolson (for demonstration)
   */
  private crankNicolsonEvolution(params: TunnelingParameters, dt: number, numSteps: number): void {
    // Simplified implementation - full CN would require matrix solver
    this.eulerEvolution(params, dt/2, numSteps * 2); // Use smaller time steps for stability
  }
  
  /**
   * Simple Euler method
   */
  private eulerEvolution(params: TunnelingParameters, dt: number, numSteps: number): void {
    const hbar = 1;
    const dx = 20 / this.gridPoints;
    
    for (let step = 0; step < numSteps; step++) {
      for (let i = 1; i < this.gridPoints - 1; i++) {
        const kinetic = -(this.psiReal[i+1] - 2*this.psiReal[i] + this.psiReal[i-1]) / (dx * dx);
        const potential = this.V[i];
        
        const newReal = this.psiReal[i] - dt * ((kinetic / (2 * params.particleMass) + potential) * this.psiImag[i]) / hbar;
        const newImag = this.psiImag[i] + dt * ((kinetic / (2 * params.particleMass) + potential) * this.psiReal[i]) / hbar;
        
        this.tempReal[i] = newReal;
        this.tempImag[i] = newImag;
      }
      
      // Copy back
      for (let i = 1; i < this.gridPoints - 1; i++) {
        this.psiReal[i] = this.tempReal[i];
        this.psiImag[i] = this.tempImag[i];
      }
    }
  }
  
  /**
   * Calculate all observables efficiently
   */
  private calculateObservables(params: TunnelingParameters, dx: number, dt: number): TunnelingResult {
    // Calculate probability density
    const probability = new Float64Array(this.gridPoints);
    let totalProbability = 0;
    let positionExpectation = 0;
    const averageEnergy = 0;
    
    for (let i = 0; i < this.gridPoints; i++) {
      probability[i] = this.psiReal[i]**2 + this.psiImag[i]**2;
      totalProbability += probability[i] * dx;
      positionExpectation += this.x[i] * probability[i] * dx;
    }
    
    // Transmission and reflection analysis
    const barrierStart = Math.floor((params.barrierPosition - params.barrierWidth/2 + 10) / dx);
    const barrierEnd = Math.floor((params.barrierPosition + params.barrierWidth/2 + 10) / dx);
    
    let transmitted = 0, reflected = 0, barrierProb = 0;
    for (let i = 0; i < this.gridPoints; i++) {
      if (i > barrierEnd) transmitted += probability[i];
      else if (i < barrierStart) reflected += probability[i];
      else barrierProb += probability[i];
    }
    
    // WKB transmission
    let actionIntegral = 0;
    for (let i = 0; i < this.gridPoints; i++) {
      if (this.V[i] > params.particleEnergy) {
        const kappa = Math.sqrt(2 * params.particleMass * (this.V[i] - params.particleEnergy));
        actionIntegral += kappa * dx;
      }
    }
    
    const wkbTransmission = params.particleEnergy < params.barrierHeight ? 
      Math.exp(-2 * actionIntegral) : 1.0;
    
    return {
      x: new Float64Array(this.x),
      potential: new Float64Array(this.V),
      waveReal: new Float64Array(this.psiReal),
      waveImag: new Float64Array(this.psiImag),
      probability,
      transmission: transmitted / totalProbability,
      reflection: reflected / totalProbability,
      barrierOccupancy: barrierProb / totalProbability,
      wkbTransmission,
      classicalForbidden: params.particleEnergy < params.barrierHeight,
      groupVelocity: params.initialMomentum / params.particleMass,
      deBroglieWavelength: 2 * Math.PI / params.initialMomentum,
      conservationMetrics: {
        probabilityConservation: totalProbability,
        averageEnergy,
        positionExpectation,
        momentumExpectation: 0 // Would need derivative calculation
      },
      resonanceStrength: Math.abs(Math.sin(Math.sqrt(2 * params.particleMass * params.particleEnergy) * params.barrierWidth)),
      actionIntegral,
      phaseShift: 0, // Would need phase analysis
      validationResult: null // Will be set by caller
    };
  }
}

// Singleton instance for reuse
const tunnelingEngine = new OptimizedTunnelingEngine(512);

/**
 * Main calculation function with optimizations
 */
export function calculateOptimizedTunneling(
  params: TunnelingParameters,
  gridPoints: number = 512
): TunnelingResult {
  // Reuse singleton for better performance
  if (gridPoints === 512) {
    return tunnelingEngine.calculate(params);
  }
  
  // Create new instance only if different grid size needed
  const engine = new OptimizedTunnelingEngine(gridPoints);
  return engine.calculate(params);
}

export default OptimizedTunnelingEngine;