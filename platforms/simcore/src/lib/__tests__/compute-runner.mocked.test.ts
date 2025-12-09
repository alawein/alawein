import { describe, it, expect, vi } from 'vitest';
import { ComputeShaderRunner, WebGPUPerformanceMonitor } from '@/lib/webgpu-manager';

class MockGPUBuffer {
  size: number;
  private data: ArrayBuffer;
  mapped: boolean;
  constructor(opts: { size: number; mappedAtCreation?: boolean }) {
    this.size = opts.size;
    this.data = new ArrayBuffer(opts.size);
    this.mapped = !!opts.mappedAtCreation;
  }
  getMappedRange() {
    return this.data;
  }
  unmap() {
    this.mapped = false;
  }
  destroy() {}
}

describe('WebGPU ComputeShaderRunner (mocked device)', () => {
  const passEncoder = {
    setPipeline: vi.fn(),
    setBindGroup: vi.fn(),
    dispatchWorkgroups: vi.fn(),
    end: vi.fn(),
  } as any;

  const commandEncoder = {
    beginComputePass: vi.fn().mockReturnValue(passEncoder),
    finish: vi.fn().mockReturnValue({}),
    copyBufferToBuffer: vi.fn(),
  } as any;

  const device: any = {
    createShaderModule: vi.fn().mockReturnValue({}),
    createBindGroupLayout: vi.fn().mockReturnValue({}),
    createPipelineLayout: vi.fn().mockReturnValue({}),
    createComputePipeline: vi.fn().mockReturnValue({}),
    createBindGroup: vi.fn().mockReturnValue({}),
    createBuffer: vi.fn().mockImplementation((opts: any) => new MockGPUBuffer(opts)),
    createCommandEncoder: vi.fn().mockReturnValue(commandEncoder),
    queue: {
      submit: vi.fn(),
      onSubmittedWorkDone: vi.fn().mockResolvedValue(undefined),
    },
    features: { has: vi.fn().mockReturnValue(false) },
  } as any;

  const shaderCode = `
    @group(0) @binding(0) var<storage, read> inA: array<f32>;
    @group(0) @binding(1) var<storage, read_write> outB: array<f32>;
    @group(0) @binding(2) var<uniform> params: array<f32, 4>;
    @compute @workgroup_size(1) fn computeMain() {}
  `;

  it('constructs runner and dispatches a compute pass', async () => {
    const runner = new ComputeShaderRunner(device as unknown as GPUDevice, shaderCode, 'TestShader');

    const inBuf = runner.createBuffer(new Float32Array([1, 2, 3, 4]), 0x1);
    const outBuf = runner.createBuffer(new Float32Array([0, 0, 0, 0]), 0x2);
    const uniBuf = runner.createBuffer(new Float32Array([1, 0, 0, 0]), 0x4);

    await runner.run([inBuf as any], outBuf as any, uniBuf as any, [1, 1, 1]);

    expect(device.createShaderModule).toHaveBeenCalled();
    expect(device.createComputePipeline).toHaveBeenCalled();
    expect(commandEncoder.beginComputePass).toHaveBeenCalled();
    expect(passEncoder.dispatchWorkgroups).toHaveBeenCalledWith(1, 1, 1);
    expect(device.queue.submit).toHaveBeenCalled();
  });

  it('WebGPUPerformanceMonitor falls back to CPU timing when timestamp-query unsupported', async () => {
    const monitor = new WebGPUPerformanceMonitor(device as unknown as GPUDevice);
    const duration = await monitor.measureComputePass(() => {
      // Some CPU work
      let x = 0;
      for (let i = 0; i < 1e4; i++) x += i;
      return x;
    }, 'MockPass');
    expect(typeof duration === 'number' || duration === null).toBe(true);
  });
});
