// Shared physics utilities for quantum mechanics and materials science
import { handlePhysicsError } from './error-handling';

// Complex number class with comprehensive operations
export class Complex {
  constructor(public real: number, public imag: number) {}
  
  multiply(other: Complex | number): Complex {
    if (typeof other === 'number') {
      return new Complex(this.real * other, this.imag * other);
    }
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }
  
  add(other: Complex | number): Complex {
    if (typeof other === 'number') {
      return new Complex(this.real + other, this.imag);
    }
    return new Complex(this.real + other.real, this.imag + other.imag);
  }
  
  subtract(other: Complex | number): Complex {
    if (typeof other === 'number') {
      return new Complex(this.real - other, this.imag);
    }
    return new Complex(this.real - other.real, this.imag - other.imag);
  }
  
  scale(factor: number): Complex {
    return new Complex(this.real * factor, this.imag * factor);
  }
  
  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }
  
  phase(): number {
    return Math.atan2(this.imag, this.real);
  }
  
  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }
  
  normalize(): Complex {
    const mag = this.magnitude();
    return mag > 0 ? new Complex(this.real / mag, this.imag / mag) : new Complex(0, 0);
  }
  
  exp(): Complex {
    const expReal = Math.exp(this.real);
    return new Complex(expReal * Math.cos(this.imag), expReal * Math.sin(this.imag));
  }
  
  static fromPolar(magnitude: number, phase: number): Complex {
    return new Complex(magnitude * Math.cos(phase), magnitude * Math.sin(phase));
  }
  
  static zero(): Complex {
    return new Complex(0, 0);
  }
  
  static one(): Complex {
    return new Complex(1, 0);
  }
  
  static i(): Complex {
    return new Complex(0, 1);
  }
}

// Vector3 utility functions for 3D physics
export const vec3 = {
  cross: (a: [number, number, number], b: [number, number, number]): [number, number, number] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ],
  
  dot: (a: [number, number, number], b: [number, number, number]): number => 
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  
  magnitude: (a: [number, number, number]): number => 
    Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]),
  
  normalize: (a: [number, number, number]): [number, number, number] => {
    const mag = vec3.magnitude(a);
    return mag > 0 ? [a[0] / mag, a[1] / mag, a[2] / mag] : [0, 0, 0];
  },
  
  scale: (a: [number, number, number], s: number): [number, number, number] => 
    [a[0] * s, a[1] * s, a[2] * s],
  
  add: (a: [number, number, number], b: [number, number, number]): [number, number, number] => 
    [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  
  subtract: (a: [number, number, number], b: [number, number, number]): [number, number, number] => 
    [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  
  distance: (a: [number, number, number], b: [number, number, number]): number => 
    vec3.magnitude(vec3.subtract(a, b)),
  
  zero: (): [number, number, number] => [0, 0, 0],
  
  unitX: (): [number, number, number] => [1, 0, 0],
  unitY: (): [number, number, number] => [0, 1, 0],
  unitZ: (): [number, number, number] => [0, 0, 1]
};

// Mathematical utility functions
export const mathUtils = {
  factorial: (n: number): number => {
    if (n < 0) return 0;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  },
  
  clamp: (value: number, min: number, max: number): number => 
    Math.min(Math.max(value, min), max),
  
  lerp: (a: number, b: number, t: number): number => 
    a + (b - a) * t,
  
  degToRad: (degrees: number): number => 
    degrees * Math.PI / 180,
  
  radToDeg: (radians: number): number => 
    radians * 180 / Math.PI,
  
  gaussianRandom: (mean: number = 0, stdDev: number = 1): number => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
};

// Quantum mechanics utilities
export const quantum = {
  // Pauli matrices
  PauliX: [[Complex.zero(), Complex.one()], [Complex.one(), Complex.zero()]],
  PauliY: [[Complex.zero(), new Complex(0, -1)], [new Complex(0, 1), Complex.zero()]],
  PauliZ: [[Complex.one(), Complex.zero()], [Complex.zero(), new Complex(-1, 0)]],
  
  // Identity matrix
  Identity: [[Complex.one(), Complex.zero()], [Complex.zero(), Complex.one()]],
  
  // Bloch vector to density matrix
  blochToState: (theta: number, phi: number): [Complex, Complex] => [
    new Complex(Math.cos(theta / 2), 0),
    new Complex(Math.sin(theta / 2) * Math.cos(phi), Math.sin(theta / 2) * Math.sin(phi))
  ],
  
  // State to Bloch vector
  stateToBloch: (state: [Complex, Complex]): [number, number, number] => {
    const [alpha, beta] = state;
    const norm = alpha.magnitude() ** 2 + beta.magnitude() ** 2;
    if (norm === 0) return [0, 0, 1];
    
    const normalizedAlpha = alpha.scale(1 / Math.sqrt(norm));
    const normalizedBeta = beta.scale(1 / Math.sqrt(norm));
    
    const x = 2 * (normalizedAlpha.conjugate().multiply(normalizedBeta)).real;
    const y = 2 * (normalizedAlpha.conjugate().multiply(normalizedBeta)).imag;
    const z = normalizedAlpha.magnitude() ** 2 - normalizedBeta.magnitude() ** 2;
    
    return [x, y, z];
  },
  
  // Expectation value calculation
  expectationValue: (state: [Complex, Complex], operator: Complex[][]): Complex => {
    const [alpha, beta] = state;
    const result = operator[0][0].multiply(alpha.conjugate()).multiply(alpha)
      .add(operator[0][1].multiply(alpha.conjugate()).multiply(beta))
      .add(operator[1][0].multiply(beta.conjugate()).multiply(alpha))
      .add(operator[1][1].multiply(beta.conjugate()).multiply(beta));
    return result;
  }
};

// Physics constants (in appropriate units)
export const constants = {
  HBAR: 1.0545718e-34, // J⋅s
  ELECTRON_MASS: 9.10938356e-31, // kg
  ELEMENTARY_CHARGE: 1.602176634e-19, // C
  BOHR_MAGNETON: 9.274010078e-24, // J/T
  GYROMAGNETIC_RATIO: 1.760859644e11, // rad⋅s⁻¹⋅T⁻¹
  
  // Normalized units for simulations
  HBAR_NORM: 1.0,
  MASS_NORM: 1.0,
  CHARGE_NORM: 1.0
};

// Error handling utilities
export const errorUtils = {
  withErrorBoundary: <T>(fn: () => T, fallback: T): T => {
    try {
      return fn();
    } catch (error) {
      handlePhysicsError(error, 'physics calculation');
      return fallback;
    }
  },
  
  validateArray: (arr: number[], expectedLength?: number): boolean => {
    if (!Array.isArray(arr)) return false;
    if (arr.some(x => !isFinite(x))) return false;
    if (expectedLength && arr.length !== expectedLength) return false;
    return true;
  },
  
  validateComplex: (c: Complex): boolean => {
    return isFinite(c.real) && isFinite(c.imag);
  }
};