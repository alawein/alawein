// WebGPU acceleration manager for physics simulations
export class WebGPUManager {
  private device: GPUDevice | null = null;
  private adapter: GPUAdapter | null = null;
  private isSupported = false;
  private isInitialized = false;

  // Feature detection
  static isWebGPUSupported(): boolean {
    return 'gpu' in navigator;
  }

  // Initialize WebGPU
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return this.isSupported;
    
    try {
      if (!WebGPUManager.isWebGPUSupported()) {
        console.warn('WebGPU not supported, falling back to WebGL');
        return false;
      }

      this.adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
      });

      if (!this.adapter) {
        console.warn('WebGPU adapter not available');
        return false;
      }

      this.device = await this.adapter.requestDevice({
        requiredFeatures: [],
        requiredLimits: {}
      });

      this.device.lost.then((info) => {
        console.warn('WebGPU device lost:', info);
        this.isSupported = false;
      });

      this.isSupported = true;
      this.isInitialized = true;
      
      console.log('WebGPU initialized successfully');
      return true;

    } catch (error) {
      console.warn('WebGPU initialization failed:', error);
      this.isSupported = false;
      this.isInitialized = true;
      return false;
    }
  }

  // Get device (null if not supported/initialized)
  getDevice(): GPUDevice | null {
    return this.device;
  }

  // Get adapter info
  getAdapterInfo(): any {
    return this.adapter ? {
      vendor: this.adapter.info?.vendor || 'Unknown',
      architecture: this.adapter.info?.architecture || 'Unknown',
      limits: this.adapter.limits
    } : null;
  }

  // Check if feature is supported
  hasFeature(feature: GPUFeatureName): boolean {
    return this.device?.features.has(feature) || false;
  }

  // Cleanup
  destroy(): void {
    this.device?.destroy();
    this.device = null;
    this.adapter = null;
    this.isSupported = false;
    this.isInitialized = false;
  }
}

// Global WebGPU manager instance
export const webgpuManager = new WebGPUManager();

// Compute shader utilities
export class ComputeShaderRunner {
  private device: GPUDevice;
  private bindGroupLayout: GPUBindGroupLayout;
  private computePipeline: GPUComputePipeline;

  constructor(device: GPUDevice, shaderCode: string, label: string = 'ComputeShader') {
    this.device = device;
    
    // Create shader module
    const shaderModule = device.createShaderModule({
      label: `${label}Module`,
      code: shaderCode
    });

    // Create bind group layout (will be customized per shader)
    this.bindGroupLayout = device.createBindGroupLayout({
      label: `${label}BindGroupLayout`,
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: 'storage' }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: 'storage' }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: 'uniform' }
        }
      ]
    });

    // Create compute pipeline
    const computePipelineLayout = device.createPipelineLayout({
      label: `${label}PipelineLayout`,
      bindGroupLayouts: [this.bindGroupLayout]
    });

    this.computePipeline = device.createComputePipeline({
      label,
      layout: computePipelineLayout,
      compute: {
        module: shaderModule,
        entryPoint: 'computeMain'
      }
    });
  }

  // Create buffer from data
  createBuffer(data: Float32Array, usage: GPUBufferUsageFlags): GPUBuffer {
    const buffer = this.device.createBuffer({
      size: data.byteLength,
      usage,
      mappedAtCreation: true
    });

    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    
    return buffer;
  }

  // Run compute shader
  async run(
    inputBuffers: GPUBuffer[],
    outputBuffer: GPUBuffer,
    uniformBuffer: GPUBuffer,
    workgroupCount: [number, number, number] = [1, 1, 1]
  ): Promise<void> {
    const bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: inputBuffers[0] } },
        { binding: 1, resource: { buffer: outputBuffer } },
        { binding: 2, resource: { buffer: uniformBuffer } }
      ]
    });

    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    
    passEncoder.setPipeline(this.computePipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(...workgroupCount);
    passEncoder.end();

    this.device.queue.submit([commandEncoder.finish()]);
    await this.device.queue.onSubmittedWorkDone();
  }

  // Read buffer data back to CPU
  async readBuffer(buffer: GPUBuffer, size: number): Promise<Float32Array> {
    const readBuffer = this.device.createBuffer({
      size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    const commandEncoder = this.device.createCommandEncoder();
    commandEncoder.copyBufferToBuffer(buffer, 0, readBuffer, 0, size);
    this.device.queue.submit([commandEncoder.finish()]);

    await readBuffer.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(readBuffer.getMappedRange());
    const result = new Float32Array(data);
    readBuffer.unmap();
    readBuffer.destroy();

    return result;
  }
}

// Performance monitoring for WebGPU operations
export class WebGPUPerformanceMonitor {
  private device: GPUDevice;
  private timestampWrites: boolean;

  constructor(device: GPUDevice) {
    this.device = device;
    this.timestampWrites = device.features.has('timestamp-query');
  }

  // Create timestamp query for performance measurement
  createTimestampQuery(): GPUQuerySet | null {
    if (!this.timestampWrites) return null;

    return this.device.createQuerySet({
      type: 'timestamp',
      count: 2
    });
  }

  // Measure compute pass performance
  async measureComputePass(
    computePass: () => void,
    label: string = 'ComputePass'
  ): Promise<number | null> {
    if (!this.timestampWrites) {
      // Fallback to CPU timing
      const start = performance.now();
      computePass();
      return performance.now() - start;
    }

    const querySet = this.createTimestampQuery();
    if (!querySet) return null;

    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass({
      timestampWrites: {
        querySet,
        beginningOfPassWriteIndex: 0,
        endOfPassWriteIndex: 1
      }
    });

    computePass();
    
    passEncoder.end();
    
    // Resolve queries to buffer
    const queryBuffer = this.device.createBuffer({
      size: 16, // 2 timestamps * 8 bytes each
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC
    });

    commandEncoder.resolveQuerySet(querySet, 0, 2, queryBuffer, 0);

    // Copy to readable buffer
    const readBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    commandEncoder.copyBufferToBuffer(queryBuffer, 0, readBuffer, 0, 16);
    this.device.queue.submit([commandEncoder.finish()]);

    // Read timestamps
    await readBuffer.mapAsync(GPUMapMode.READ);
    const timestamps = new BigUint64Array(readBuffer.getMappedRange());
    const duration = Number(timestamps[1] - timestamps[0]) / 1_000_000; // Convert to milliseconds
    
    readBuffer.unmap();
    queryBuffer.destroy();
    readBuffer.destroy();
    querySet.destroy();

    return duration;
  }
}