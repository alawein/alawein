import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test environment
    globals: true,
    environment: 'jsdom',
    
    // Test file patterns
    include: [
      '**/__tests__/**/*.(ts|tsx|js|jsx)',
      '**/*.(test|spec).(ts|tsx|js|jsx)',
      'tests/**/*.(ts|tsx|js|jsx)'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'tests/**/*.py',
      'tests/__pycache__/**',
      '**/*.d.ts',
      '**/*.stories.(ts|tsx|js|jsx)',
      '**/*.config.(js|ts)',
      '**/*.mock.(ts|tsx|js|jsx)'
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov', 'json', 'clover'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        'build/',
        '*.config.*',
        '**/*.d.ts',
        '**/*.stories.(ts|tsx|js|jsx)',
        '**/*.mock.(ts|tsx|js|jsx)',
        '**/index.(ts|tsx|js|jsx)',
        '**/vendor/**'
      ],
      // Coverage thresholds
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90
      }
    },
    
    // Setup files
    setupFiles: [
      './tests/setup/vitest.setup.ts'
    ],
    
    // Global setup/teardown
    globalSetup: './tests/setup/global.setup.js',
    
    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Output
    reporters: ['default', 'html', 'json'],
    outputFile: {
      html: './coverage/html-report/index.html',
      json: './coverage/test-results.json'
    },
    
    // Performance
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: undefined, // Use 50% of available CPUs
        minThreads: undefined
      }
    },
    
    // Behavior
    clearMocks: true,
    restoreMocks: true,
    mockReset: false,
    
    // Watch mode
    watch: false,
    
    // Cache
    cache: {
      dir: '.vitest-cache'
    },
    
    // Isolation
    isolate: true,
    
    // Retry failed tests
    retry: 0,
    
    // Bail on first failure
    bail: 0
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@llcs': path.resolve(__dirname, './src/llcs'),
      '@research': path.resolve(__dirname, './src/research'),
      '@personal': path.resolve(__dirname, './src/personal'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@tests': path.resolve(__dirname, './tests')
    }
  },
  
  // Define configuration
  define: {
    'import.meta.vitest': 'undefined'
  }
});
