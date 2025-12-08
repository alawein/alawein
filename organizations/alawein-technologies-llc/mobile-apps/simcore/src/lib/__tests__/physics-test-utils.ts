/**
 * Physics Testing Utilities
 * Specialized testing functions for scientific simulations and calculations
 */

export interface PhysicsTestCase {
  description: string;
  input: any;
  expected: any;
  tolerance?: number;
}

export interface MatrixTestCase {
  description: string;
  matrix: number[][];
  expectedProperty: string;
  tolerance?: number;
}

export class PhysicsTestUtils {
  /**
   * Compare floating point numbers with tolerance
   */
  static approxEqual(actual: number, expected: number, tolerance: number = 1e-10): boolean {
    return Math.abs(actual - expected) < tolerance;
  }

  /**
   * Compare arrays of numbers with tolerance
   */
  static arrayApproxEqual(actual: number[], expected: number[], tolerance: number = 1e-10): boolean {
    if (actual.length !== expected.length) return false;
    return actual.every((val, i) => this.approxEqual(val, expected[i], tolerance));
  }

  /**
   * Compare complex numbers (as [real, imag] arrays)
   */
  static complexApproxEqual(
    actual: [number, number], 
    expected: [number, number], 
    tolerance: number = 1e-10
  ): boolean {
    return this.approxEqual(actual[0], expected[0], tolerance) && 
           this.approxEqual(actual[1], expected[1], tolerance);
  }

  /**
   * Test if matrix is Hermitian
   */
  static isHermitian(matrix: number[][], tolerance: number = 1e-10): boolean {
    const n = matrix.length;
    if (n === 0 || matrix[0].length !== n) return false;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (!this.approxEqual(matrix[i][j], matrix[j][i], tolerance)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Test if matrix is unitary
   */
  static isUnitary(matrix: number[][], tolerance: number = 1e-10): boolean {
    const n = matrix.length;
    if (n === 0 || matrix[0].length !== n) return false;

    // Calculate matrix * matrix†
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += matrix[i][k] * matrix[j][k]; // matrix[j][k] is conjugate transpose
        }
        const expected = i === j ? 1 : 0;
        if (!this.approxEqual(sum, expected, tolerance)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Test energy conservation
   */
  static isEnergyConserved(energyHistory: number[], tolerance: number = 1e-8): boolean {
    if (energyHistory.length < 2) return true;
    
    const initialEnergy = energyHistory[0];
    return energyHistory.every(energy => 
      this.approxEqual(energy, initialEnergy, tolerance)
    );
  }

  /**
   * Test probability conservation
   */
  static isProbabilityConserved(probabilities: number[], tolerance: number = 1e-10): boolean {
    const sum = probabilities.reduce((acc, p) => acc + p, 0);
    return this.approxEqual(sum, 1.0, tolerance);
  }

  /**
   * Generate test k-points for Brillouin zone testing
   */
  static generateTestKPoints(): number[][] {
    return [
      [0, 0],                                    // Γ point
      [Math.PI, 0],                              // X point
      [Math.PI, Math.PI],                        // M point
      [Math.PI/2, Math.PI/2],                    // Generic point
      [4*Math.PI/(3*2.46), 0],                   // K point (graphene)
      [-4*Math.PI/(3*2.46), 0]                   // K' point (graphene)
    ];
  }

  /**
   * Validate physical dispersion relation
   */
  static isPhysicalDispersion(
    kPoints: number[][], 
    energies: number[], 
    tolerance: number = 1e-6
  ): boolean {
    // Check that energies are real and finite
    return energies.every(energy => 
      Number.isFinite(energy) && !Number.isNaN(energy)
    );
  }

  /**
   * Test symmetry properties
   */
  static testSymmetry(
    calculateFunction: (kx: number, ky: number) => number,
    symmetryType: 'inversion' | 'mirror_x' | 'mirror_y',
    tolerance: number = 1e-10
  ): boolean {
    const testPoints = this.generateTestKPoints();
    
    return testPoints.every(([kx, ky]) => {
      const original = calculateFunction(kx, ky);
      let transformed: number;
      
      switch (symmetryType) {
        case 'inversion':
          transformed = calculateFunction(-kx, -ky);
          break;
        case 'mirror_x':
          transformed = calculateFunction(-kx, ky);
          break;
        case 'mirror_y':
          transformed = calculateFunction(kx, -ky);
          break;
      }
      
      return this.approxEqual(original, transformed, tolerance);
    });
  }
}

export default PhysicsTestUtils;