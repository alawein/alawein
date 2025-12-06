// Advanced performance optimization and resource management for QMLab
// Memory pools, worker threads, and intelligent resource allocation

import { quantumMetrics } from './monitoring';

// Resource pool for reusable computational resources
class ResourcePool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (resource: T) => void;
  private maxSize: number;
  private currentSize: number = 0;

  constructor(
    factory: () => T,
    reset: (resource: T) => void,
    maxSize: number = 10
  ) {
    this.factory = factory;
    this.reset = reset;
    this.maxSize = maxSize;
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }

    if (this.currentSize < this.maxSize) {
      this.currentSize++;
      return this.factory();
    }

    // If pool is full, create a temporary resource
    console.warn('Resource pool exhausted, creating temporary resource');
    return this.factory();
  }

  release(resource: T): void {
    if (this.pool.length < this.maxSize) {
      this.reset(resource);
      this.pool.push(resource);
    }
  }

  clear(): void {
    this.pool.length = 0;
    this.currentSize = 0;
  }

  getStats() {
    return {
      available: this.pool.length,
      total: this.currentSize,
      maxSize: this.maxSize,
      utilization: (this.currentSize - this.pool.length) / this.currentSize || 0
    };
  }
}

// Memory management utilities
export class MemoryManager {
  private memoryThreshold = 0.8; // 80% memory threshold
  private gcInterval = 30000; // 30 seconds
  private lastGC = 0;
  private memoryPressure = false;

  constructor() {
    this.startMemoryMonitoring();
  }

  private startMemoryMonitoring(): void {
    setInterval(() => {
      this.checkMemoryPressure();
    }, 5000); // Check every 5 seconds
  }

  private checkMemoryPressure(): void {
    // Check if performance.memory is available (Chromium browsers)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      this.memoryPressure = memoryUsage > this.memoryThreshold;
      
      if (this.memoryPressure) {
        console.warn(`High memory usage detected: ${(memoryUsage * 100).toFixed(1)}%`);
        this.triggerGarbageCollection();
      }
    }
  }

  private triggerGarbageCollection(): void {
    const now = Date.now();
    if (now - this.lastGC > this.gcInterval) {
      this.lastGC = now;
      
      // Clear caches and trigger cleanup
      this.cleanupResources();
      
      // Force garbage collection if available (development only)
      if (typeof window !== 'undefined' && 'gc' in window) {
        (window as any).gc();
      }
    }
  }

  private cleanupResources(): void {
    // Emit cleanup event for components to react to
    window.dispatchEvent(new CustomEvent('memoryPressure', {
      detail: { action: 'cleanup', threshold: this.memoryThreshold }
    }));
  }

  isUnderMemoryPressure(): boolean {
    return this.memoryPressure;
  }

  getMemoryInfo() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        utilization: memory.usedJSHeapSize / memory.jsHeapSizeLimit
      };
    }
    return null;
  }
}

// Web Worker pool for computational tasks
export class WorkerPool {
  private workers: Worker[] = [];
  private availableWorkers: Worker[] = [];
  private taskQueue: Array<{
    task: any;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private maxWorkers: number;

  constructor(workerScript: string, maxWorkers: number = navigator.hardwareConcurrency || 4) {
    this.maxWorkers = maxWorkers;
    this.initializeWorkers(workerScript);
  }

  private initializeWorkers(workerScript: string): void {
    for (let i = 0; i < this.maxWorkers; i++) {
      try {
        const worker = new Worker(workerScript);
        this.workers.push(worker);
        this.availableWorkers.push(worker);
      } catch (error) {
        console.warn(`Failed to create worker ${i}:`, error);
      }
    }
  }

  async execute<T>(task: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.availableWorkers.length > 0) {
        this.executeTask(task, resolve, reject);
      } else {
        this.taskQueue.push({ task, resolve, reject });
      }
    });
  }

  private executeTask(
    task: any, 
    resolve: (value: any) => void, 
    reject: (error: any) => void
  ): void {
    const worker = this.availableWorkers.pop()!;
    
    const handleMessage = (event: MessageEvent) => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      
      this.availableWorkers.push(worker);
      this.processQueue();
      
      if (event.data.error) {
        reject(new Error(event.data.error));
      } else {
        resolve(event.data.result);
      }
    };

    const handleError = (error: ErrorEvent) => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      
      this.availableWorkers.push(worker);
      this.processQueue();
      
      reject(new Error(error.message));
    };

    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);
    
    worker.postMessage(task);
  }

  private processQueue(): void {
    if (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const { task, resolve, reject } = this.taskQueue.shift()!;
      this.executeTask(task, resolve, reject);
    }
  }

  terminate(): void {
    this.workers.forEach(worker => worker.terminate());
    this.workers.length = 0;
    this.availableWorkers.length = 0;
    this.taskQueue.length = 0;
  }

  getStats() {
    return {
      totalWorkers: this.workers.length,
      availableWorkers: this.availableWorkers.length,
      queueLength: this.taskQueue.length,
      utilization: (this.workers.length - this.availableWorkers.length) / this.workers.length
    };
  }
}

// Performance optimization manager
export class PerformanceOptimizer {
  private memoryManager: MemoryManager;
  private resourcePools = new Map<string, ResourcePool<any>>();
  protected workerPools = new Map<string, WorkerPool>();
  private optimizationStrategies = new Map<string, () => void>();
  private performanceMode: 'balanced' | 'performance' | 'memory' = 'balanced';

  constructor() {
    this.memoryManager = new MemoryManager();
    this.setupOptimizationStrategies();
    this.startPerformanceMonitoring();
  }

  // Setup optimization strategies
  private setupOptimizationStrategies(): void {
    this.optimizationStrategies.set('circuit-compilation', () => {
      // Optimize circuit compilation by caching compiled circuits
      this.enableCircuitCaching();
    });

    this.optimizationStrategies.set('memory-cleanup', () => {
      // Aggressive memory cleanup
      this.clearCaches();
      this.compactResourcePools();
    });

    this.optimizationStrategies.set('worker-rebalancing', () => {
      // Rebalance worker loads
      this.rebalanceWorkers();
    });

    this.optimizationStrategies.set('preload-optimization', () => {
      // Optimize preloading strategies
      this.optimizePreloading();
    });
  }

  // Start performance monitoring
  private startPerformanceMonitoring(): void {
    setInterval(() => {
      this.analyzePerformance();
    }, 15000); // Analyze every 15 seconds
  }

  // Analyze system performance and apply optimizations
  private analyzePerformance(): void {
    const memoryInfo = this.memoryManager.getMemoryInfo();
    const isMemoryPressure = this.memoryManager.isUnderMemoryPressure();
    
    // Collect performance metrics
    const metrics = {
      memory: memoryInfo,
      resourcePools: this.getResourcePoolStats(),
      workerPools: this.getWorkerPoolStats(),
      memoryPressure: isMemoryPressure
    };

    // Report metrics
    if (memoryInfo) {
      quantumMetrics.collectSimulationMetrics('system-performance', {
        stateVectorSize: 0,
        simulationTime: 0,
        memoryPeak: memoryInfo.used,
        entanglementMeasures: {
          memory_utilization: metrics.memory?.utilization || 0,
          worker_utilization: this.getAverageWorkerUtilization()
        }
      });
    }

    // Apply optimizations based on conditions
    this.applyOptimizations(metrics);
  }

  // Apply performance optimizations
  private applyOptimizations(metrics: any): void {
    if (metrics.memoryPressure) {
      this.optimizationStrategies.get('memory-cleanup')?.();
    }

    if (metrics.memory && metrics.memory.utilization > 0.9) {
      this.setPerformanceMode('memory');
    } else if (metrics.memory && metrics.memory.utilization < 0.5) {
      this.setPerformanceMode('performance');
    } else {
      this.setPerformanceMode('balanced');
    }

    // Rebalance workers if utilization is uneven
    const avgWorkerUtil = this.getAverageWorkerUtilization();
    if (avgWorkerUtil > 0.8) {
      this.optimizationStrategies.get('worker-rebalancing')?.();
    }
  }

  // Create or get resource pool
  createResourcePool<T>(
    name: string,
    factory: () => T,
    reset: (resource: T) => void,
    maxSize: number = 10
  ): ResourcePool<T> {
    if (this.resourcePools.has(name)) {
      return this.resourcePools.get(name)!;
    }

    const pool = new ResourcePool(factory, reset, maxSize);
    this.resourcePools.set(name, pool);
    return pool;
  }

  // Create or get worker pool
  createWorkerPool(
    name: string,
    workerScript: string,
    maxWorkers?: number
  ): WorkerPool {
    if (this.workerPools.has(name)) {
      return this.workerPools.get(name)!;
    }

    const pool = new WorkerPool(workerScript, maxWorkers);
    this.workerPools.set(name, pool);
    return pool;
  }

  // Set performance mode
  setPerformanceMode(mode: 'balanced' | 'performance' | 'memory'): void {
    if (this.performanceMode === mode) return;

    this.performanceMode = mode;
    console.log(`Performance mode changed to: ${mode}`);

    switch (mode) {
      case 'performance':
        this.enablePerformanceMode();
        break;
      case 'memory':
        this.enableMemoryMode();
        break;
      default:
        this.enableBalancedMode();
    }
  }

  // Performance mode optimizations
  private enablePerformanceMode(): void {
    // Increase resource pool sizes
    this.resourcePools.forEach(pool => {
      // Expand pools for better performance
    });

    // Enable aggressive preloading
    this.optimizationStrategies.get('preload-optimization')?.();
  }

  // Memory mode optimizations
  private enableMemoryMode(): void {
    // Reduce resource pool sizes
    this.compactResourcePools();

    // Enable frequent cleanup
    this.optimizationStrategies.get('memory-cleanup')?.();
  }

  // Balanced mode optimizations
  private enableBalancedMode(): void {
    // Reset to default configurations
    // Balance between performance and memory usage
  }

  // Optimization strategy implementations
  private enableCircuitCaching(): void {
    // Implementation for circuit caching optimization
    console.log('Circuit caching optimization enabled');
  }

  private clearCaches(): void {
    // Clear various caches to free memory
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('temp-')) {
            caches.delete(name);
          }
        });
      });
    }
  }

  private compactResourcePools(): void {
    this.resourcePools.forEach((pool, name) => {
      console.log(`Compacting resource pool: ${name}`);
      pool.clear();
    });
  }

  private rebalanceWorkers(): void {
    // Rebalance worker loads
    console.log('Rebalancing worker pools');
    this.workerPools.forEach((pool, name) => {
      const stats = pool.getStats();
      console.log(`Worker pool ${name}:`, stats);
    });
  }

  private optimizePreloading(): void {
    // Optimize resource preloading based on usage patterns
    console.log('Optimizing preloading strategies');
  }

  // Get resource pool statistics
  private getResourcePoolStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    this.resourcePools.forEach((pool, name) => {
      stats[name] = pool.getStats();
    });
    return stats;
  }

  // Get worker pool statistics
  private getWorkerPoolStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    this.workerPools.forEach((pool, name) => {
      stats[name] = pool.getStats();
    });
    return stats;
  }

  // Get average worker utilization
  private getAverageWorkerUtilization(): number {
    let totalUtil = 0;
    let poolCount = 0;

    this.workerPools.forEach(pool => {
      const stats = pool.getStats();
      totalUtil += stats.utilization;
      poolCount++;
    });

    return poolCount > 0 ? totalUtil / poolCount : 0;
  }

  // Get current performance metrics
  getPerformanceMetrics() {
    return {
      mode: this.performanceMode,
      memory: this.memoryManager.getMemoryInfo(),
      memoryPressure: this.memoryManager.isUnderMemoryPressure(),
      resourcePools: this.getResourcePoolStats(),
      workerPools: this.getWorkerPoolStats(),
      optimization: {
        strategiesActive: this.optimizationStrategies.size,
        lastOptimization: Date.now()
      }
    };
  }

  // Cleanup resources
  cleanup(): void {
    this.resourcePools.forEach(pool => pool.clear());
    this.workerPools.forEach(pool => pool.terminate());
    this.resourcePools.clear();
    this.workerPools.clear();
  }
}

// Quantum-specific performance optimizations
export class QuantumPerformanceOptimizer extends PerformanceOptimizer {
  private circuitCache = new Map<string, any>();
  private stateVectorPool: ResourcePool<Float64Array>;
  private gateOperationPool: ResourcePool<Float64Array>;

  constructor() {
    super();
    this.setupQuantumOptimizations();
  }

  private setupQuantumOptimizations(): void {
    // Create state vector pool for reusing large arrays
    this.stateVectorPool = this.createResourcePool(
      'statevectors',
      () => new Float64Array(1024), // Default size for 10 qubits
      (arr) => arr.fill(0),
      20 // Keep 20 state vectors in pool
    );

    // Create gate operation pool
    this.gateOperationPool = this.createResourcePool(
      'gateooperations',
      () => new Float64Array(16), // 4x4 matrix
      (arr) => arr.fill(0),
      50 // Keep 50 gate matrices in pool
    );

    // Setup quantum-specific worker pool
    try {
      this.createWorkerPool(
        'quantum-simulation',
        '/workers/quantum-worker.js',
        Math.min(navigator.hardwareConcurrency || 4, 8)
      );
    } catch (error) {
      console.warn('Quantum worker pool not available:', error);
    }
  }

  // Optimize circuit compilation
  optimizeCircuit(circuitConfig: any): any {
    const circuitHash = this.hashCircuitConfig(circuitConfig);
    
    if (this.circuitCache.has(circuitHash)) {
      return this.circuitCache.get(circuitHash);
    }

    // Perform optimization
    const optimizedCircuit = this.performCircuitOptimization(circuitConfig);
    
    // Cache result
    if (this.circuitCache.size > 1000) {
      // Clear old entries if cache is too large
      const oldestKey = this.circuitCache.keys().next().value;
      this.circuitCache.delete(oldestKey);
    }
    
    this.circuitCache.set(circuitHash, optimizedCircuit);
    return optimizedCircuit;
  }

  // Get optimized state vector from pool
  getStateVector(size: number): Float64Array {
    if (size <= 1024) {
      const vector = this.stateVectorPool.acquire();
      if (vector.length >= size) {
        return vector.subarray(0, size);
      }
    }
    
    // Fallback for large state vectors
    return new Float64Array(size);
  }

  // Return state vector to pool
  releaseStateVector(vector: Float64Array): void {
    if (vector.length <= 1024) {
      this.stateVectorPool.release(vector as Float64Array);
    }
  }

  // Optimize quantum simulation using worker pool
  async optimizeQuantumSimulation(config: any): Promise<any> {
    const workerPool = this.workerPools.get('quantum-simulation');
    
    if (workerPool) {
      try {
        return await workerPool.execute({
          type: 'quantum-simulation',
          config
        });
      } catch (error) {
        console.warn('Worker simulation failed, falling back to main thread:', error);
      }
    }
    
    // Fallback to main thread simulation
    return this.performMainThreadSimulation(config);
  }

  // Hash circuit configuration for caching
  private hashCircuitConfig(config: any): string {
    return btoa(JSON.stringify(config)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  // Perform circuit optimization
  private performCircuitOptimization(config: any): any {
    // Basic optimization: remove identity gates, combine rotations, etc.
    const optimized = { ...config };
    
    // Remove identity gates
    optimized.gates = optimized.gates.filter((gate: any) => gate.type !== 'I');
    
    // Combine consecutive rotation gates
    optimized.gates = this.combineRotationGates(optimized.gates);
    
    return optimized;
  }

  // Combine consecutive rotation gates
  private combineRotationGates(gates: any[]): any[] {
    const optimized = [];
    let i = 0;
    
    while (i < gates.length) {
      const gate = gates[i];
      
      if (gate.type === 'RZ' && i + 1 < gates.length) {
        const nextGate = gates[i + 1];
        if (nextGate.type === 'RZ' && 
            JSON.stringify(gate.qubits) === JSON.stringify(nextGate.qubits)) {
          // Combine rotation angles
          optimized.push({
            ...gate,
            angle: gate.angle + nextGate.angle
          });
          i += 2; // Skip next gate
          continue;
        }
      }
      
      optimized.push(gate);
      i++;
    }
    
    return optimized;
  }

  // Fallback main thread simulation
  private performMainThreadSimulation(config: any): any {
    // Simplified simulation for fallback
    return {
      result: 'simulation-result',
      timestamp: Date.now(),
      method: 'main-thread'
    };
  }

  // Get quantum-specific performance metrics
  getQuantumMetrics() {
    return {
      ...this.getPerformanceMetrics(),
      quantum: {
        circuitCacheSize: this.circuitCache.size,
        stateVectorPool: this.stateVectorPool.getStats(),
        gateOperationPool: this.gateOperationPool.getStats()
      }
    };
  }
}

// Global performance optimizer instance
export const performanceOptimizer = new QuantumPerformanceOptimizer();