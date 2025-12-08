// Performance optimization utilities for scientific simulations

// Memoization utility for expensive calculations
export class MemoizedCalculator<T extends any[], R> {
  private cache = new Map<string, { result: R; timestamp: number }>();
  private maxAge: number;
  private maxSize: number;

  constructor(maxAge: number = 5000, maxSize: number = 100) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
  }

  calculate(fn: (...args: T) => R, ...args: T): R {
    const key = JSON.stringify(args);
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached result if still valid
    if (cached && (now - cached.timestamp) < this.maxAge) {
      return cached.result;
    }

    // Calculate new result
    const result = fn(...args);
    
    // Clean cache if too large
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    // Store new result
    this.cache.set(key, { result, timestamp: now });
    return result;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Throttled animation frame utility
export class AnimationController {
  private animationId: number | null = null;
  private isRunning = false;
  private targetFPS: number;
  private lastFrameTime = 0;
  private frameInterval: number;

  constructor(targetFPS: number = 60) {
    this.targetFPS = targetFPS;
    this.frameInterval = 1000 / targetFPS;
  }

  start(callback: (deltaTime: number) => void): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();

    const animate = (currentTime: number) => {
      if (!this.isRunning) return;

      const deltaTime = currentTime - this.lastFrameTime;
      
      if (deltaTime >= this.frameInterval) {
        callback(deltaTime / 1000); // Convert to seconds
        this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
      }

      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  setFPS(fps: number): void {
    this.targetFPS = fps;
    this.frameInterval = 1000 / fps;
  }

  get running(): boolean {
    return this.isRunning;
  }
}

// WebGL utilities for high-performance visualization
export const webglUtils = {
  createShader: (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  },

  createProgram: (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  },

  // Basic vertex shader for 2D plots
  basicVertexShader: `
    attribute vec2 a_position;
    attribute vec4 a_color;
    uniform vec2 u_resolution;
    varying vec4 v_color;
    
    void main() {
      vec2 zeroToOne = a_position / u_resolution;
      vec2 zeroToTwo = zeroToOne * 2.0;
      vec2 clipSpace = zeroToTwo - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      v_color = a_color;
    }
  `,

  // Basic fragment shader
  basicFragmentShader: `
    precision mediump float;
    varying vec4 v_color;
    
    void main() {
      gl_FragColor = v_color;
    }
  `
};

// ArrayBuffer pooling for memory efficiency
export class ArrayBufferPool {
  private pools = new Map<number, Float32Array[]>();
  private maxPoolSize: number;

  constructor(maxPoolSize: number = 10) {
    this.maxPoolSize = maxPoolSize;
  }

  get(size: number): Float32Array {
    const pool = this.pools.get(size);
    if (pool && pool.length > 0) {
      return pool.pop()!;
    }
    return new Float32Array(size);
  }

  release(buffer: Float32Array): void {
    const size = buffer.length;
    let pool = this.pools.get(size);
    
    if (!pool) {
      pool = [];
      this.pools.set(size, pool);
    }

    if (pool.length < this.maxPoolSize) {
      // Clear the buffer before returning to pool
      buffer.fill(0);
      pool.push(buffer);
    }
  }

  clear(): void {
    this.pools.clear();
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();
  private maxSamples: number;

  constructor(maxSamples: number = 100) {
    this.maxSamples = maxSamples;
  }

  startTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.addSample(name, duration);
    };
  }

  addSample(name: string, value: number): void {
    let samples = this.metrics.get(name);
    if (!samples) {
      samples = [];
      this.metrics.set(name, samples);
    }

    samples.push(value);
    if (samples.length > this.maxSamples) {
      samples.shift();
    }
  }

  getAverage(name: string): number {
    const samples = this.metrics.get(name);
    if (!samples || samples.length === 0) return 0;
    return samples.reduce((sum, val) => sum + val, 0) / samples.length;
  }

  getMax(name: string): number {
    const samples = this.metrics.get(name);
    if (!samples || samples.length === 0) return 0;
    return Math.max(...samples);
  }

  getMetrics(): Record<string, { avg: number; max: number; samples: number }> {
    const result: Record<string, { avg: number; max: number; samples: number }> = {};
    
    for (const [name, samples] of this.metrics) {
      result[name] = {
        avg: this.getAverage(name),
        max: this.getMax(name),
        samples: samples.length
      };
    }

    return result;
  }

  clear(): void {
    this.metrics.clear();
  }
}

// Batch processing utility for large datasets
export const batchProcess = async <T, R>(
  items: T[],
  processor: (item: T) => R | Promise<R>,
  batchSize: number = 100,
  onProgress?: (completed: number, total: number) => void
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(processor);
    const batchResults = await Promise.all(batchPromises);
    
    results.push(...batchResults);
    
    if (onProgress) {
      onProgress(Math.min(i + batchSize, items.length), items.length);
    }

    // Yield control to prevent blocking
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return results;
};

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Global array buffer pool
export const arrayBufferPool = new ArrayBufferPool();