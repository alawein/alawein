// WebGPU-accelerated physics implementations
import { webgpuManager, ComputeShaderRunner, WebGPUPerformanceMonitor } from './webgpu-manager';
import { 
  tdseComputeShader, 
  llgComputeShader, 
  phononComputeShader,
  tunnelingComputeShader,
  crystalOptimizationShader,
  bandStructureShader
} from './webgpu-shaders';
import { performanceMonitor } from './performance-utils';

// Enhanced TDSE solver with WebGPU acceleration
export class WebGPUTDSESolver {
  private device: GPUDevice | null = null;
  private computeRunner: ComputeShaderRunner | null = null;
  private perfMonitor: WebGPUPerformanceMonitor | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return this.device !== null;

    const success = await webgpuManager.initialize();
    if (!success) {
      console.warn('WebGPU not available for TDSE solver');
      return false;
    }

    this.device = webgpuManager.getDevice();
    if (!this.device) return false;

    try {
      this.computeRunner = new ComputeShaderRunner(
        this.device, 
        tdseComputeShader, 
        'TDSECompute'
      );
      this.perfMonitor = new WebGPUPerformanceMonitor(this.device);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize TDSE compute shader:', error);
      return false;
    }
  }

  async solveTDSEGPU(
    psiReal: Float32Array,
    psiImag: Float32Array,
    potential: Float32Array,
    dt: number,
    hbar: number = 1,
    mass: number = 1,
    dx: number = 0.1
  ): Promise<{ real: Float32Array; imag: Float32Array; performanceMs: number }> {
    if (!this.device || !this.computeRunner) {
      throw new Error('WebGPU TDSE solver not initialized');
    }

    const endTimer = performanceMonitor.startTimer('tdseSolverGPU');
    const startTime = performance.now();

    try {
      // Create buffers
      const psiRealBuffer = this.computeRunner.createBuffer(
        psiReal, 
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
      );

      const psiImagBuffer = this.computeRunner.createBuffer(
        psiImag,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
      );

      const potentialBuffer = this.computeRunner.createBuffer(
        potential,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      );

      // Create uniform buffer for parameters
      const params = new Float32Array([dt, hbar, mass, psiReal.length, dx, 0, 0, 0]);
      const uniformBuffer = this.computeRunner.createBuffer(
        params,
        GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      );

      // Dispatch compute shader
      const workgroupCount = Math.ceil(psiReal.length / 64);
      await this.computeRunner.run(
        [psiRealBuffer, psiImagBuffer, potentialBuffer],
        psiRealBuffer, // Output is in-place
        uniformBuffer,
        [workgroupCount, 1, 1]
      );

      // Read results back
      const resultReal = await this.computeRunner.readBuffer(
        psiRealBuffer, 
        psiReal.byteLength
      );
      const resultImag = await this.computeRunner.readBuffer(
        psiImagBuffer, 
        psiImag.byteLength
      );

      // Cleanup GPU buffers
      psiRealBuffer.destroy();
      psiImagBuffer.destroy();
      potentialBuffer.destroy();
      uniformBuffer.destroy();

      const performanceMs = performance.now() - startTime;
      endTimer();

      return {
        real: resultReal,
        imag: resultImag,
        performanceMs
      };

    } catch (error) {
      endTimer();
      throw new Error(`WebGPU TDSE computation failed: ${error}`);
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.device !== null;
  }
}

// Enhanced LLG solver with WebGPU acceleration
export class WebGPULLGSolver {
  private device: GPUDevice | null = null;
  private computeRunner: ComputeShaderRunner | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return this.device !== null;

    const success = await webgpuManager.initialize();
    if (!success) return false;

    this.device = webgpuManager.getDevice();
    if (!this.device) return false;

    try {
      this.computeRunner = new ComputeShaderRunner(
        this.device,
        llgComputeShader,
        'LLGCompute'
      );
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize LLG compute shader:', error);
      return false;
    }
  }

  async solveLLGGPU(
    magnetization: Float32Array, // Flat array: [mx1, my1, mz1, mx2, my2, mz2, ...]
    appliedField: [number, number, number],
    alpha: number,
    gamma: number,
    anisotropy: number,
    dt: number
  ): Promise<{ magnetization: Float32Array; effectiveField: Float32Array; performanceMs: number }> {
    if (!this.device || !this.computeRunner) {
      throw new Error('WebGPU LLG solver not initialized');
    }

    const endTimer = performanceMonitor.startTimer('llgSolverGPU');
    const startTime = performance.now();

    try {
      const nSpins = magnetization.length / 3;

      // Create buffers
      const magnetizationBuffer = this.computeRunner.createBuffer(
        magnetization,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
      );

      const effectiveFieldBuffer = this.device.createBuffer({
        size: magnetization.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
      });

      // Parameters
      const params = new Float32Array([
        dt, alpha, gamma, nSpins,
        appliedField[0], appliedField[1], appliedField[2],
        anisotropy
      ]);
      const uniformBuffer = this.computeRunner.createBuffer(
        params,
        GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      );

      // Dispatch compute shader
      const workgroupCount = Math.ceil(nSpins / 64);
      await this.computeRunner.run(
        [magnetizationBuffer],
        effectiveFieldBuffer,
        uniformBuffer,
        [workgroupCount, 1, 1]
      );

      // Read results
      const resultMagnetization = await this.computeRunner.readBuffer(
        magnetizationBuffer,
        magnetization.byteLength
      );
      const resultEffectiveField = await this.computeRunner.readBuffer(
        effectiveFieldBuffer,
        magnetization.byteLength
      );

      // Cleanup
      magnetizationBuffer.destroy();
      effectiveFieldBuffer.destroy();
      uniformBuffer.destroy();

      const performanceMs = performance.now() - startTime;
      endTimer();

      return {
        magnetization: resultMagnetization,
        effectiveField: resultEffectiveField,
        performanceMs
      };

    } catch (error) {
      endTimer();
      throw new Error(`WebGPU LLG computation failed: ${error}`);
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.device !== null;
  }
}

// Quantum tunneling solver with WebGPU
export class WebGPUTunnelingSolver {
  private device: GPUDevice | null = null;
  private computeRunner: ComputeShaderRunner | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return this.device !== null;

    const success = await webgpuManager.initialize();
    if (!success) return false;

    this.device = webgpuManager.getDevice();
    if (!this.device) return false;

    try {
      this.computeRunner = new ComputeShaderRunner(
        this.device,
        tunnelingComputeShader,
        'TunnelingCompute'
      );
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize tunneling compute shader:', error);
      return false;
    }
  }

  async calculateTunneling(
    xValues: Float32Array,
    energy: number,
    barrierHeight: number,
    barrierWidth: number,
    hbar: number = 1,
    mass: number = 1
  ): Promise<{ transmission: Float32Array; reflection: Float32Array; performanceMs: number }> {
    if (!this.device || !this.computeRunner) {
      throw new Error('WebGPU tunneling solver not initialized');
    }

    const endTimer = performanceMonitor.startTimer('tunnelingSolverGPU');
    const startTime = performance.now();

    try {
      // Create buffers
      const xBuffer = this.computeRunner.createBuffer(
        xValues,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      );

      const transmissionBuffer = this.device.createBuffer({
        size: xValues.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
      });

      const reflectionBuffer = this.device.createBuffer({
        size: xValues.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
      });

      // Parameters
      const dx = xValues.length > 1 ? xValues[1] - xValues[0] : 0.1;
      const params = new Float32Array([
        energy, barrierHeight, barrierWidth, xValues.length,
        dx, hbar, mass, 0
      ]);
      const uniformBuffer = this.computeRunner.createBuffer(
        params,
        GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      );

      // Dispatch compute shader
      const workgroupCount = Math.ceil(xValues.length / 64);
      await this.computeRunner.run(
        [xBuffer],
        transmissionBuffer,
        uniformBuffer,
        [workgroupCount, 1, 1]
      );

      // Read results
      const transmission = await this.computeRunner.readBuffer(
        transmissionBuffer,
        xValues.byteLength
      );
      const reflection = await this.computeRunner.readBuffer(
        reflectionBuffer,
        xValues.byteLength
      );

      // Cleanup
      xBuffer.destroy();
      transmissionBuffer.destroy();
      reflectionBuffer.destroy();
      uniformBuffer.destroy();

      const performanceMs = performance.now() - startTime;
      endTimer();

      return { transmission, reflection, performanceMs };

    } catch (error) {
      endTimer();
      throw new Error(`WebGPU tunneling computation failed: ${error}`);
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.device !== null;
  }
}

// Performance comparison utility
export class PhysicsPerformanceComparator {
  static async compareCPUvsGPU<T extends any[], R>(
    cpuFunction: (...args: T) => R | Promise<R>,
    gpuFunction: (...args: T) => Promise<R & { performanceMs: number }>,
    args: T,
    label: string = 'Computation'
  ): Promise<{
    cpuTimeMs: number;
    gpuTimeMs: number;
    speedup: number;
    results: { cpu: R; gpu: R };
  }> {
    // CPU timing
    const cpuStart = performance.now();
    const cpuResult = await cpuFunction(...args);
    const cpuTimeMs = performance.now() - cpuStart;

    // GPU timing (includes data transfer)
    const gpuResult = await gpuFunction(...args);
    const gpuTimeMs = gpuResult.performanceMs;

    const speedup = cpuTimeMs / gpuTimeMs;

    console.log(`${label} Performance Comparison:`, {
      CPU: `${cpuTimeMs.toFixed(2)}ms`,
      GPU: `${gpuTimeMs.toFixed(2)}ms`,
      Speedup: `${speedup.toFixed(2)}x`
    });

    return {
      cpuTimeMs,
      gpuTimeMs,
      speedup,
      results: {
        cpu: cpuResult,
        gpu: gpuResult as R
      }
    };
  }
}

// Global solver instances
export const webgpuTDSESolver = new WebGPUTDSESolver();
export const webgpuLLGSolver = new WebGPULLGSolver();
export const webgpuTunnelingSolver = new WebGPUTunnelingSolver();

// Auto-initialize all solvers
export const initializeWebGPUPhysics = async (): Promise<{
  tdse: boolean;
  llg: boolean;
  tunneling: boolean;
  overall: boolean;
}> => {
  const results = {
    tdse: await webgpuTDSESolver.initialize(),
    llg: await webgpuLLGSolver.initialize(),
    tunneling: await webgpuTunnelingSolver.initialize(),
    overall: false
  };

  results.overall = results.tdse || results.llg || results.tunneling;

  if (results.overall) {
    const adapterInfo = webgpuManager.getAdapterInfo();
    console.log('WebGPU Physics Acceleration Initialized:', {
      adapter: adapterInfo,
      enabledSolvers: {
        'TDSE Solver': results.tdse,
        'LLG Dynamics': results.llg,
        'Quantum Tunneling': results.tunneling
      }
    });
  }

  return results;
};