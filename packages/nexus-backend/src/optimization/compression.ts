/**
 * Nexus Compression and Minification
 * Optimizes assets for production
 */

import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { gzipSync, brotliCompressSync } from 'zlib';

export interface CompressionOptions {
  gzip?: boolean;
  brotli?: boolean;
  level?: number;
  threshold?: number; // Minimum size to compress (bytes)
  exclude?: string[];
}

export interface MinificationOptions {
  html?: boolean;
  css?: boolean;
  js?: boolean;
  svg?: boolean;
  json?: boolean;
  removeComments?: boolean;
  removeWhitespace?: boolean;
  mangleIdentifiers?: boolean;
}

export interface AssetOptimization {
  originalSize: number;
  compressedSize: number;
  minifiedSize: number;
  finalSize: number;
  savings: number;
  compressionRatio: number;
}

/**
 * Asset optimizer
 */
export class AssetOptimizer {
  private compressionOptions: Required<CompressionOptions>;
  private minificationOptions: Required<MinificationOptions>;

  constructor(
    compression: CompressionOptions = {},
    minification: MinificationOptions = {}
  ) {
    this.compressionOptions = {
      gzip: true,
      brotli: true,
      level: 6,
      threshold: 1024,
      exclude: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.woff', '.woff2'],
      ...compression,
    };

    this.minificationOptions = {
      html: true,
      css: true,
      js: true,
      svg: true,
      json: false,
      removeComments: true,
      removeWhitespace: true,
      mangleIdentifiers: true,
      ...minification,
    };
  }

  /**
   * Optimize all assets in a directory
   */
  async optimizeDirectory(dir: string): Promise<AssetOptimization[]> {
    const optimizations: AssetOptimization[] = [];
    const files = await this.scanDirectory(dir);

    for (const file of files) {
      const optimization = await this.optimizeFile(file);
      if (optimization) {
        optimizations.push(optimization);
      }
    }

    // Generate optimization report
    await this.generateOptimizationReport(optimizations, dir);

    return optimizations;
  }

  /**
   * Optimize a single file
   */
  async optimizeFile(filePath: string): Promise<AssetOptimization | null> {
    const ext = extname(filePath).toLowerCase();

    // Skip excluded extensions
    if (this.compressionOptions.exclude.includes(ext)) {
      return null;
    }

    try {
      // Read original file
      const originalContent = await fs.readFile(filePath);
      const originalSize = originalContent.length;

      let optimizedContent = originalContent;
      let minifiedSize = originalSize;

      // Minify if enabled
      if (this.shouldMinify(ext)) {
        const minified = await this.minifyContent(optimizedContent, ext);
        optimizedContent = minified;
        minifiedSize = minified.length;
      }

      // Compress if large enough
      let compressedSize = minifiedSize;
      if (optimizedContent.length >= this.compressionOptions.threshold) {
        if (this.compressionOptions.gzip) {
          const gzipped = gzipSync(optimizedContent, {
            level: this.compressionOptions.level,
          });
          await fs.writeFile(filePath + '.gz', gzipped);
          compressedSize = Math.min(compressedSize, gzipped.length);
        }

        if (this.compressionOptions.brotli) {
          const brotli = brotliCompressSync(optimizedContent, {
            params: {
              [require('zlib').constants.BROTLI_PARAM_QUALITY]: this.compressionOptions.level,
            },
          });
          await fs.writeFile(filePath + '.br', brotli);
          compressedSize = Math.min(compressedSize, brotli.length);
        }
      }

      // Write optimized content back
      if (optimizedContent !== originalContent) {
        await fs.writeFile(filePath, optimizedContent);
      }

      return {
        originalSize,
        compressedSize,
        minifiedSize,
        finalSize: optimizedContent.length,
        savings: originalSize - optimizedContent.length,
        compressionRatio: originalSize > 0 ? optimizedContent.length / originalSize : 1,
      };

    } catch (error) {
      console.error(`Failed to optimize ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Generate optimized HTML with resource hints
   */
  async optimizeHTML(htmlPath: string): Promise<void> {
    const html = await fs.readFile(htmlPath, 'utf8');

    // Add preconnect for external resources
    const optimized = html.replace(
      /<head>/,
      `<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="//api.example.com">`
    );

    // Add preload for critical resources
    const withPreloads = optimized.replace(
      /<script src="([^"]+\.js)"><\/script>/g,
      '<link rel="preload" href="$1" as="script"><script src="$1"></script>'
    );

    // Minify if enabled
    const final = this.minificationOptions.html
      ? await this.minifyHTML(withPreloads)
      : withPreloads;

    await fs.writeFile(htmlPath, final);
  }

  /**
   * Generate critical CSS
   */
  async generateCriticalCSS(htmlPath: string, cssPath: string): Promise<void> {
    // This would integrate with a critical CSS generator
    // For now, create a placeholder
    const criticalCSS = `
/* Critical CSS - Above the fold styles */
body { margin: 0; font-family: system-ui; }
.hero { display: flex; align-items: center; min-height: 50vh; }
`;

    const css = await fs.readFile(cssPath, 'utf8');
    const nonCritical = css.replace(criticalCSS, '');

    // Write critical CSS inline in HTML
    const html = await fs.readFile(htmlPath, 'utf8');
    const withCritical = html.replace(
      '</head>',
      `<style>${criticalCSS}</style>
    <link rel="preload" href="${cssPath}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="${cssPath}"></noscript>
</head>`
    );

    await fs.writeFile(htmlPath, withCritical);
    await fs.writeFile(cssPath.replace('.css', '.non-critical.css'), nonCritical);
  }

  /**
   * Optimize images
   */
  async optimizeImages(dir: string): Promise<void> {
    const imageFiles = await this.scanDirectory(dir, ['.png', '.jpg', '.jpeg', '.gif', '.webp']);

    for (const file of imageFiles) {
      await this.optimizeImage(file);
    }
  }

  /**
   * Generate service worker for caching
   */
  async generateServiceWorker(buildDir: string): Promise<void> {
    const assets = await this.scanDirectory(buildDir);
    const assetHashes = new Map<string, string>();

    // Generate hashes for all assets
    for (const asset of assets) {
      const content = await fs.readFile(asset);
      const hash = createHash('sha256').update(content).digest('hex').substring(0, 16);
      assetHashes.set(asset.replace(buildDir, ''), hash);
    }

    const serviceWorker = `
// Nexus Service Worker
const CACHE_NAME = 'nexus-v1';
const STATIC_ASSETS = ${JSON.stringify(Array.from(assetHashes.keys()))};

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
`;

    await fs.writeFile(join(buildDir, 'sw.js'), serviceWorker);
  }

  // Private methods
  private async scanDirectory(dir: string, extensions?: string[]): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...await this.scanDirectory(fullPath, extensions));
      } else {
        const ext = extname(entry.name);
        if (!extensions || extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  private shouldMinify(ext: string): boolean {
    switch (ext) {
      case '.html':
        return this.minificationOptions.html;
      case '.css':
        return this.minificationOptions.css;
      case '.js':
      case '.mjs':
      case '.jsx':
      case '.ts':
      case '.tsx':
        return this.minificationOptions.js;
      case '.svg':
        return this.minificationOptions.svg;
      case '.json':
        return this.minificationOptions.json;
      default:
        return false;
    }
  }

  private async minifyContent(content: Buffer, ext: string): Promise<Buffer> {
    const str = content.toString('utf8');

    switch (ext) {
      case '.html':
        return Buffer.from(await this.minifyHTML(str));
      case '.css':
        return Buffer.from(this.minifyCSS(str));
      case '.js':
      case '.mjs':
      case '.jsx':
      case '.ts':
      case '.tsx':
        return Buffer.from(this.minifyJS(str));
      case '.svg':
        return Buffer.from(this.minifySVG(str));
      case '.json':
        return Buffer.from(this.minifyJSON(str));
      default:
        return content;
    }
  }

  private async minifyHTML(html: string): Promise<string> {
    // Simple HTML minification
    let minified = html;

    if (this.minificationOptions.removeComments) {
      minified = minified.replace(/<!--[\s\S]*?-->/g, '');
    }

    if (this.minificationOptions.removeWhitespace) {
      minified = minified
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
    }

    return minified;
  }

  private minifyCSS(css: string): string {
    // Simple CSS minification
    let minified = css;

    if (this.minificationOptions.removeComments) {
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    if (this.minificationOptions.removeWhitespace) {
      minified = minified
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, '}')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .trim();
    }

    return minified;
  }

  private minifyJS(js: string): string {
    // Simple JS minification
    let minified = js;

    if (this.minificationOptions.removeComments) {
      minified = minified.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    }

    if (this.minificationOptions.removeWhitespace) {
      minified = minified
        .replace(/\s+/g, ' ')
        .replace(/;\s*/g, ';')
        .replace(/{\s*/g, '{')
        .replace(/\s*}/g, '}')
        .replace(/\s*,\s*/g, ',')
        .trim();
    }

    if (this.minificationOptions.mangleIdentifiers) {
      // This would use a proper minifier like Terser
      // For now, just return the minified code
    }

    return minified;
  }

  private minifySVG(svg: string): string {
    // Simple SVG minification
    return svg
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private minifyJSON(json: string): string {
    try {
      return JSON.stringify(JSON.parse(json));
    } catch (error) {
      return json;
    }
  }

  private async optimizeImage(filePath: string): Promise<void> {
    // This would integrate with image optimization tools
    // For now, just log the action
    console.log(`Optimizing image: ${filePath}`);
  }

  private async generateOptimizationReport(
    optimizations: AssetOptimization[],
    dir: string
  ): Promise<void> {
    const totalOriginal = optimizations.reduce((sum, opt) => sum + opt.originalSize, 0);
    const totalFinal = optimizations.reduce((sum, opt) => sum + opt.finalSize, 0);
    const totalSavings = totalOriginal - totalFinal;

    const report = {
      timestamp: new Date().toISOString(),
      directory: dir,
      filesOptimized: optimizations.length,
      totalOriginalSize: totalOriginal,
      totalFinalSize: totalFinal,
      totalSavings,
      savingsPercentage: totalOriginal > 0 ? (totalSavings / totalOriginal) * 100 : 0,
      optimizations,
    };

    await fs.writeFile(
      join(dir, 'optimization-report.json'),
      JSON.stringify(report, null, 2)
    );
  }
}

/**
 * Compression middleware
 */
export function createCompressionMiddleware(options: CompressionOptions = {}) {
  const opts = {
    gzip: true,
    brotli: true,
    level: 6,
    threshold: 1024,
    ...options,
  };

  return (req: any, res: any, next: any) => {
    const acceptEncoding = req.headers['accept-encoding'] || '';

    res.compress = (data: Buffer | string) => {
      if (typeof data === 'string') {
        data = Buffer.from(data);
      }

      // Skip small responses
      if (data.length < opts.threshold) {
        return data;
      }

      // Try Brotli first
      if (opts.brotli && acceptEncoding.includes('br')) {
        const compressed = brotliCompressSync(data, {
          params: {
            [require('zlib').constants.BROTLI_PARAM_QUALITY]: opts.level,
          },
        });
        res.setHeader('Content-Encoding', 'br');
        return compressed;
      }

      // Fall back to Gzip
      if (opts.gzip && acceptEncoding.includes('gzip')) {
        const compressed = gzipSync(data, { level: opts.level });
        res.setHeader('Content-Encoding', 'gzip');
        return compressed;
      }

      return data;
    };

    next();
  };
}

// Default optimizer instance
export const defaultOptimizer = new AssetOptimizer();
