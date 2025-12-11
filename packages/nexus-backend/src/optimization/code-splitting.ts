/**
 * Nexus Code Splitting and Lazy Loading
 * Automatic code splitting and optimization
 */

import { build } from 'vite';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface SplittingOptions {
  manualChunks?: Record<string, string[]>;
  vendorChunks?: boolean;
  dynamicImports?: boolean;
  preloadStrategy?: 'preload' | 'prefetch' | 'none';
  chunkSizeWarningLimit?: number;
}

export interface ChunkAnalysis {
  name: string;
  size: number;
  modules: string[];
  imports: string[];
  dynamic: boolean;
}

export class CodeSplitter {
  private options: SplittingOptions;

  constructor(options: SplittingOptions = {}) {
    this.options = {
      manualChunks: {},
      vendorChunks: true,
      dynamicImports: true,
      preloadStrategy: 'preload',
      chunkSizeWarningLimit: 500,
      ...options,
    };
  }

  /**
   * Analyze bundle for splitting opportunities
   */
  async analyzeBundle(buildDir: string): Promise<ChunkAnalysis[]> {
    const manifest = await this.loadManifest(buildDir);
    const chunks: ChunkAnalysis[] = [];

    for (const [name, info] of Object.entries(manifest)) {
      if (name.endsWith('.js')) {
        chunks.push({
          name,
          size: info.size || 0,
          modules: info.modules || [],
          imports: info.imports || [],
          dynamic: name.includes('-lazy') || name.includes('-async'),
        });
      }
    }

    return chunks.sort((a, b) => b.size - a.size);
  }

  /**
   * Generate optimized Vite config for code splitting
   */
  generateSplittingConfig(): any {
    return {
      build: {
        rollupOptions: {
          output: {
            manualChunks: this.generateManualChunks(),
            chunkFileNames: (chunkInfo: any) => {
              if (chunkInfo.isDynamicEntry) {
                return `assets/[name]-lazy-[hash].js`;
              }
              return `assets/[name]-[hash].js`;
            },
            assetFileNames: (assetInfo: any) => {
              if (assetInfo.name?.endsWith('.css')) {
                return `assets/[name]-[hash].css`;
              }
              return `assets/[name]-[hash].[ext]`;
            },
          },
        },
        chunkSizeWarningLimit: this.options.chunkSizeWarningLimit,
      },
      optimizeDeps: {
        include: this.getOptimizeDeps(),
      },
    };
  }

  /**
   * Generate manual chunks configuration
   */
  private generateManualChunks(): Record<string, string[]> {
    const chunks: Record<string, string[]> = {};

    // Add vendor chunks
    if (this.options.vendorChunks) {
      chunks.vendor = [
        'react',
        'react-dom',
        'react-router-dom',
        '@nexus/backend',
        '@nexus/ui-react',
        '@nexus/shared',
      ];

      chunks.utils = [
        'lodash',
        'date-fns',
        'axios',
        'zustand',
        '@tanstack/react-query',
      ];

      chunks.ui = [
        '@headlessui/react',
        '@heroicons/react',
        'framer-motion',
        'react-hook-form',
      ];
    }

    // Merge with manual chunks from options
    return { ...chunks, ...this.options.manualChunks };
  }

  /**
   * Get dependencies to optimize
   */
  private getOptimizeDeps(): string[] {
    return [
      'react',
      'react-dom',
      'react-router-dom',
      '@nexus/backend',
      '@nexus/ui-react',
      '@nexus/shared',
    ];
  }

  /**
   * Generate lazy loading components
   */
  async generateLazyComponents(componentsDir: string): Promise<void> {
    const components = await this.scanComponents(componentsDir);

    for (const component of components) {
      await this.generateLazyComponent(component);
    }
  }

  /**
   * Generate lazy loading wrapper for a component
   */
  private async generateLazyComponent(componentPath: string): Promise<void> {
    const componentName = this.getComponentName(componentPath);
    const lazyPath = componentPath.replace('.tsx', '.lazy.tsx');

    const lazyTemplate = `
import { lazy } from 'react';
import { NexusSuspense } from '@nexus/ui-react';

export const ${componentName} = lazy(() =>
  import('./${componentName}').then(module => ({
    default: module.${componentName}
  }))
);

export const ${componentName}WithSuspense = (props: any) => (
  <NexusSuspense fallback={<div>Loading ${componentName}...</div>}>
    <${componentName} {...props} />
  </NexusSuspense>
);
`;

    await fs.writeFile(lazyPath, lazyTemplate);
  }

  /**
   * Generate route-based code splitting
   */
  async generateRouteSplitting(routesPath: string): Promise<void> {
    const routes = await this.scanRoutes(routesPath);

    const routeTemplate = `
// Auto-generated route splitting
import { lazy } from 'react';

${routes.map(route => {
  const name = this.getComponentName(route);
  return `const ${name}Route = lazy(() => import('${route}'));`;
}).join('\n')}

export const routes = [
  ${routes.map(route => {
    const name = this.getComponentName(route);
    const path = this.getRoutePath(route);
    return `  {
    path: '${path}',
    component: ${name}Route,
    lazy: true,
  };`;
  }).join('\n')}
];
`;

    await fs.writeFile(join(routesPath, 'routes.lazy.ts'), routeTemplate);
  }

  /**
   * Generate preloading strategy
   */
  async generatePreloadStrategy(buildDir: string): Promise<void> {
    const chunks = await this.analyzeBundle(buildDir);
    const criticalChunks = chunks.filter(c => !c.dynamic && c.size > 10000);
    const lazyChunks = chunks.filter(c => c.dynamic);

    const preloadTemplate = `
// Auto-generated preloading strategy
import { preloadRoute, prefetchRoute } from '@nexus/backend';

// Critical chunks - preload immediately
${criticalChunks.map(chunk =>
  `preloadRoute('/${chunk.name.replace('.js', '')}');`
).join('\n')}

// Lazy chunks - prefetch after initial load
setTimeout(() => {
  ${lazyChunks.slice(0, 5).map(chunk =>
    `prefetchRoute('/${chunk.name.replace('.js', '')}');`
  ).join('\n')}
}, 2000);

// Intersection Observer for prefetching on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const route = entry.target.getAttribute('data-route');
      if (route) prefetchRoute(route);
    }
  });
}, { threshold: 0.1 });

// Observe all route links
document.querySelectorAll('[data-route]').forEach(el => {
  observer.observe(el);
});
`;

    await fs.writeFile(join(buildDir, 'preload.js'), preloadTemplate);
  }

  /**
   * Generate component-level splitting hints
   */
  async generateSplittingHints(componentsDir: string): Promise<void> {
    const hintsTemplate = `
// Component splitting hints
import { ComponentType } from 'react';

// HOC for lazy loading with error boundary
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <NexusSuspense fallback={fallback || <div>Loading...</div>}>
      <LazyComponent {...props} />
    </NexusSuspense>
  );
}

// Preload component helper
export function preloadComponent(importFunc: () => Promise<any>) {
  const componentLoader = importFunc();
  componentLoader.catch(() => {});
  return componentLoader;
}

// Prefetch on hover helper
export function prefetchOnHover(importFunc: () => Promise<any>) {
  let preloadTimeout: NodeJS.Timeout;

  return {
    onMouseEnter: () => {
      preloadTimeout = setTimeout(() => {
        preloadComponent(importFunc);
      }, 100);
    },
    onMouseLeave: () => {
      clearTimeout(preloadTimeout);
    },
  };
}
`;

    await fs.writeFile(join(componentsDir, 'splitting-helpers.ts'), hintsTemplate);
  }

  /**
   * Optimize bundle size based on analysis
   */
  async optimizeBundle(buildDir: string): Promise<void> {
    const chunks = await this.analyzeBundle(buildDir);
    const largeChunks = chunks.filter(c => c.size > 100000);

    if (largeChunks.length > 0) {
      console.log('\n📊 Large chunks detected:');
      largeChunks.forEach(chunk => {
        console.log(`  ${chunk.name}: ${(chunk.size / 1024).toFixed(2)} KB`);
      });

      // Generate optimization suggestions
      await this.generateOptimizationSuggestions(largeChunks);
    }
  }

  /**
   * Generate bundle optimization report
   */
  async generateOptimizationReport(buildDir: string): Promise<void> {
    const chunks = await this.analyzeBundle(buildDir);
    const totalSize = chunks.reduce((sum, c) => sum + c.size, 0);
    const dynamicSize = chunks.filter(c => c.dynamic).reduce((sum, c) => sum + c.size, 0);

    const report = {
      timestamp: new Date().toISOString(),
      totalChunks: chunks.length,
      totalSize,
      dynamicChunks: chunks.filter(c => c.dynamic).length,
      dynamicSize,
      averageChunkSize: totalSize / chunks.length,
      largestChunk: chunks[0],
      recommendations: this.generateRecommendations(chunks),
    };

    await fs.writeFile(
      join(buildDir, 'bundle-analysis.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate HTML report
    await this.generateHTMLReport(report, buildDir);
  }

  // Private helper methods
  private async loadManifest(buildDir: string): Promise<any> {
    try {
      const manifestPath = join(buildDir, '.vite', 'manifest.json');
      const content = await fs.readFile(manifestPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return {};
    }
  }

  private async scanComponents(dir: string): Promise<string[]> {
    const components: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        components.push(...await this.scanComponents(fullPath));
      } else if (entry.name.endsWith('.tsx') && !entry.name.includes('.lazy.')) {
        components.push(fullPath);
      }
    }

    return components;
  }

  private async scanRoutes(dir: string): Promise<string[]> {
    // Implementation similar to scanComponents but for routes
    return [];
  }

  private getComponentName(path: string): string {
    const name = path.split('/').pop()?.replace('.tsx', '') || '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private getRoutePath(path: string): string {
    return path.replace('.tsx', '').replace(/\/index$/, '');
  }

  private async generateOptimizationSuggestions(chunks: ChunkAnalysis[]): Promise<void> {
    const suggestions = chunks.map(chunk => {
      const suggestions: string[] = [];

      if (chunk.size > 200000) {
        suggestions.push('Consider splitting this chunk into smaller parts');
      }

      if (chunk.modules.some(m => m.includes('node_modules'))) {
        suggestions.push('Move vendor dependencies to separate chunk');
      }

      if (chunk.modules.length > 50) {
        suggestions.push('Too many modules in one chunk');
      }

      return {
        chunk: chunk.name,
        size: chunk.size,
        suggestions,
      };
    });

    await fs.writeFile(
      join(process.cwd(), 'bundle-suggestions.json'),
      JSON.stringify(suggestions, null, 2)
    );
  }

  private generateRecommendations(chunks: ChunkAnalysis[]): string[] {
    const recommendations: string[] = [];

    if (chunks.some(c => c.size > 500000)) {
      recommendations.push('Enable aggressive code splitting for large chunks');
    }

    if (chunks.filter(c => c.dynamic).length < chunks.length / 2) {
      recommendations.push('Consider using dynamic imports for more components');
    }

    const totalSize = chunks.reduce((sum, c) => sum + c.size, 0);
    if (totalSize > 1000000) {
      recommendations.push('Bundle size is large, consider tree shaking');
    }

    return recommendations;
  }

  private async generateHTMLReport(report: any, buildDir: string): Promise<void> {
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>Bundle Analysis Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .metric { display: inline-block; margin: 10px; padding: 20px; border: 1px solid #ddd; }
    .chart { margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    th { background-color: #f5f5f5; }
  </style>
</head>
<body>
  <h1>Bundle Analysis Report</h1>
  <p>Generated: ${report.timestamp}</p>

  <div class="metrics">
    <div class="metric">
      <h3>Total Size</h3>
      <p>${(report.totalSize / 1024 / 1024).toFixed(2)} MB</p>
    </div>
    <div class="metric">
      <h3>Total Chunks</h3>
      <p>${report.totalChunks}</p>
    </div>
    <div class="metric">
      <h3>Dynamic Chunks</h3>
      <p>${report.dynamicChunks}</p>
    </div>
    <div class="metric">
      <h3>Average Chunk Size</h3>
      <p>${(report.averageChunkSize / 1024).toFixed(2)} KB</p>
    </div>
  </div>

  <h2>Recommendations</h2>
  <ul>
    ${report.recommendations.map(r => `<li>${r}</li>`).join('')}
  </ul>
</body>
</html>
`;

    await fs.writeFile(join(buildDir, 'bundle-report.html'), htmlTemplate);
  }
}
