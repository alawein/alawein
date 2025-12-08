import { describe, it, expect, vi } from 'vitest';
import { ComputeShaderRunner } from '@/lib/webgpu-manager';

// Minimal GPU API shims used by ComputeShaderRunner.readBuffer
// Define WebGPU enums/constants used in the implementation
(globalThis as any).GPUMapMode = { READ: 1, WRITE: 2 };
(globalThis as any).GPUBufferUsage = {
  COPY_DST: 1 << 0,
  MAP_READ: 1 << 1,
  COPY_SRC: 1 << 2,
  QUERY_RESOLVE: 1 << 3,
  STORAGE: 1 << 4,
  UNIFORM: 1 << 5,
};
(globalThis as any).GPUShaderStage = { COMPUTE: 1 };

class MockGPUBuffer {
  size: number;
  data: ArrayBuffer;
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
  async mapAsync(_mode: number) {
    // In this mock, data is immediately available after queue.submit copies
    this.mapped = true;
    return Promise.resolve();
  }
  destroy() {}
}

class MockCommandEncoder {
  public copyOps: Array<{ src: MockGPUBuffer; dst: MockGPUBuffer; size: number; srcOffset: number; dstOffset: number }>; 
  constructor() {
    this.copyOps = [];
  }
  beginComputePass() {
    return { setPipeline: vi.fn(), setBindGroup: vi.fn(), dispatchWorkgroups: vi.fn(), end: vi.fn() } as any;
  }
  copyBufferToBuffer(src: MockGPUBuffer, srcOffset: number, dst: MockGPUBuffer, dstOffset: number, size: number) {
    this.copyOps.push({ src, dst, size, srcOffset, dstOffset });
  }
  finish() {
    return { copyOps: this.copyOps } as any;
  }
}

describe('ComputeShaderRunner.readBuffer (mocked device)', () => {
  const commandEncoders: MockCommandEncoder[] = [];

  const device: any = {
    createShaderModule: vi.fn().mockReturnValue({}),
    createBindGroupLayout: vi.fn().mockReturnValue({}),
    createPipelineLayout: vi.fn().mockReturnValue({}),
    createComputePipeline: vi.fn().mockReturnValue({}),
    createBindGroup: vi.fn().mockReturnValue({}),
    createBuffer: vi.fn().mockImplementation((opts: any) => new MockGPUBuffer(opts)),
    createCommandEncoder: vi.fn().mockImplementation(() => {
      const enc = new MockCommandEncoder();
      commandEncoders.push(enc);
      return enc;
    }),
    queue: {
      submit: vi.fn().mockImplementation((cmds: any[]) => {
        // Execute copy operations immediately to simulate GPU work completion
        for (const cmd of cmds) {
          if (cmd && Array.isArray(cmd.copyOps)) {
            for (const op of cmd.copyOps) {
              const srcView = new Uint8Array(op.src.data, op.srcOffset, op.size);
              const dstView = new Uint8Array(op.dst.data, op.dstOffset, op.size);
              dstView.set(srcView);
            }
          }
        }
      }),
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

  it('reads back buffer contents identical to source', async () => {
    const runner = new ComputeShaderRunner(device as unknown as GPUDevice, shaderCode, 'ReadBackTest');

    const srcData = new Float32Array([1.5, -2.0, 3.25, 4.75]);
    const srcBuffer = runner.createBuffer(srcData, (globalThis as any).GPUBufferUsage.STORAGE);

    const result = await runner.readBuffer(srcBuffer as any, srcData.byteLength);
    expect(Array.from(result)).toEqual(Array.from(srcData));
  });

  it('supports reading arbitrary sizes (multiple of 4 bytes)', async () => {
    const runner = new ComputeShaderRunner(device as unknown as GPUDevice, shaderCode, 'ReadBackPartial');

    // 6 floats (24 bytes)
    const srcData = new Float32Array([0, 1, 2, 3, 4, 5]);
    const srcBuffer = runner.createBuffer(srcData, (globalThis as any).GPUBufferUsage.STORAGE);

    const result = await runner.readBuffer(srcBuffer as any, 24);
    expect(result.length).toBe(6);
    expect(Array.from(result)).toEqual(Array.from(srcData));
  });
});
