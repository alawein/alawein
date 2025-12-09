/**
 * Test Setup Configuration
 * Global test setup and mocks for scientific simulations
 */

import { beforeAll, afterAll, vi } from 'vitest';

// Mock WebGL context for headless testing
beforeAll(() => {
  // Mock HTMLCanvasElement.getContext
  HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextType) => {
    if (contextType === '2d') {
      return {
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(() => ({ data: new Array(4) })),
        putImageData: vi.fn(),
        createImageData: vi.fn(() => ({ data: new Array(4) })),
        setTransform: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        fillText: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        measureText: vi.fn(() => ({ width: 0 })),
        transform: vi.fn(),
        rect: vi.fn(),
        clip: vi.fn(),
      };
    }

    if (contextType === 'webgl' || contextType === 'webgl2') {
      return {
        canvas: document.createElement('canvas'),
        drawingBufferWidth: 1024,
        drawingBufferHeight: 768,
        getShaderPrecisionFormat: vi.fn(() => ({ precision: 23, rangeMin: 127, rangeMax: 127 })),
        getExtension: vi.fn(),
        getParameter: vi.fn(),
        createShader: vi.fn(),
        shaderSource: vi.fn(),
        compileShader: vi.fn(),
        createProgram: vi.fn(),
        attachShader: vi.fn(),
        linkProgram: vi.fn(),
        useProgram: vi.fn(),
        createBuffer: vi.fn(),
        bindBuffer: vi.fn(),
        bufferData: vi.fn(),
        enableVertexAttribArray: vi.fn(),
        vertexAttribPointer: vi.fn(),
        uniform1f: vi.fn(),
        uniform2f: vi.fn(),
        uniform3f: vi.fn(),
        uniform4f: vi.fn(),
        uniformMatrix4fv: vi.fn(),
        drawArrays: vi.fn(),
        drawElements: vi.fn(),
        viewport: vi.fn(),
        clear: vi.fn(),
        clearColor: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn(),
        depthFunc: vi.fn(),
        blendFunc: vi.fn(),
        getUniformLocation: vi.fn(),
        getAttribLocation: vi.fn(),
        VERTEX_SHADER: 35633,
        FRAGMENT_SHADER: 35632,
        ARRAY_BUFFER: 34962,
        ELEMENT_ARRAY_BUFFER: 34963,
        STATIC_DRAW: 35044,
        TRIANGLES: 4,
        COLOR_BUFFER_BIT: 16384,
        DEPTH_BUFFER_BIT: 256,
        DEPTH_TEST: 2929,
        BLEND: 3042,
        SRC_ALPHA: 770,
        ONE_MINUS_SRC_ALPHA: 771
      };
    }

    return null;
  });

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock requestAnimationFrame
  global.requestAnimationFrame = vi.fn((cb) => {
    setTimeout(cb, 16);
    return 1;
  });
  global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id as any));

  // Mock performance.now for physics timing
  global.performance = {
    ...global.performance,
    now: vi.fn(() => Date.now())
  };

  // Mock WebWorker
  global.Worker = vi.fn().mockImplementation(() => ({
    postMessage: vi.fn(),
    terminate: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

  // Always mock URL.createObjectURL used by webworker engine
   
  (URL as any).createObjectURL = vi.fn(() => 'blob:mock');

  // Minimal GPUShaderStage mock for tests that reference it
  // @ts-ignore
  if (typeof (globalThis as any).GPUShaderStage === 'undefined') {
     
    (globalThis as any).GPUShaderStage = { COMPUTE: 1 } as const;
  }

  // matchMedia mock for responsive hooks
  // Always provide matchMedia stub for jsdom
   
  (window as any).matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  // Provide writable-like hardwareConcurrency via accessor with no-op setter
  try {
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true,
      get() { return 2; },
      set: () => { /* absorb */ }
    });
  } catch {
    /* no-op */
  }

  // Suppress console warnings during tests
  const originalConsoleWarn = console.warn;
  console.warn = vi.fn().mockImplementation((message) => {
    if (
      message.includes('Plotly') ||
      message.includes('WebGL') ||
      message.includes('Three.js')
    ) {
      return;
    }
    originalConsoleWarn(message);
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

// Global test utilities
global.testUtils = {
  // Utility to wait for async operations
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Utility to create mock physics data
  createMockBandStructure: () => ({
    kPath: Array.from({ length: 100 }, (_, i) => [i * 0.01, 0]),
    energyPlus: Array.from({ length: 100 }, (_, i) => Math.sin(i * 0.1)),
    energyMinus: Array.from({ length: 100 }, (_, i) => -Math.sin(i * 0.1)),
    distances: Array.from({ length: 100 }, (_, i) => i * 0.01)
  }),

  // Utility to create mock DOS data
  createMockDOS: () => ({
    energies: Array.from({ length: 200 }, (_, i) => -5 + i * 0.05),
    dos: Array.from({ length: 200 }, (_, i) => Math.exp(-((-5 + i * 0.05) ** 2) / 2))
  })
};

// Type declarations for test utilities
declare global {
  var testUtils: {
    waitFor: (ms: number) => Promise<void>;
    createMockBandStructure: () => any;
    createMockDOS: () => any;
  };
}
