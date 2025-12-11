/**
 * Nexus Incremental Static Regeneration (ISR)
 * Provides ISR capabilities for Nexus applications
 */

import React from 'react';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { renderSSR } from '../ssr/index';
import { SSROptions } from '../ssr/index';

export interface ISROptions extends SSROptions {
  revalidate?: number; // Revalidation time in seconds
  fallback?: true | 'blocking'; // Fallback page behavior
  notFound?: boolean; // Return 404 page
  redirect?: { destination: string; permanent: boolean };
}

export interface ISRResult {
  html: string;
  revalidate: number | false;
  lastModified: number;
  isStale?: boolean;
}

export interface ISRCacheEntry {
  html: string;
  lastModified: number;
  revalidate: number;
  isGenerating?: boolean;
}

/**
 * ISR Cache Manager
 */
export class ISRCache {
  private cache = new Map<string, ISRCacheEntry>();
  private cacheDir: string;
  private defaultRevalidate: number;

  constructor(cacheDir = '.nexus/cache/isr', defaultRevalidate = 60) {
    this.cacheDir = cacheDir;
    this.defaultRevalidate = defaultRevalidate;
    this.ensureCacheDir();
  }

  /**
   * Get cached page or return stale data while revalidating
   */
  async get(key: string): Promise<ISRCacheEntry | null> {
    // Check memory cache first
    const memEntry = this.cache.get(key);
    if (memEntry) {
      // Check if stale
      if (this.isStale(memEntry)) {
        // Return stale data but mark for revalidation
        return { ...memEntry, isStale: true };
      }
      return memEntry;
    }

    // Check disk cache
    const diskEntry = await this.getFromDisk(key);
    if (diskEntry) {
      // Load into memory
      this.cache.set(key, diskEntry);

      // Check if stale
      if (this.isStale(diskEntry)) {
        return { ...diskEntry, isStale: true };
      }

      return diskEntry;
    }

    return null;
  }

  /**
   * Set cache entry
   */
  async set(key: string, entry: ISRCacheEntry): Promise<void> {
    // Update memory cache
    this.cache.set(key, entry);

    // Write to disk
    await this.writeToDisk(key, entry);
  }

  /**
   * Check if entry is stale and needs revalidation
   */
  isStale(entry: ISRCacheEntry): boolean {
    if (entry.revalidate === false) return false;
    return Date.now() - entry.lastModified > entry.revalidate * 1000;
  }

  /**
   * Get entry from disk cache
   */
  private async getFromDisk(key: string): Promise<ISRCacheEntry | null> {
    try {
      const filePath = this.getCacheFilePath(key);
      if (!existsSync(filePath)) return null;

      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      return data as ISRCacheEntry;
    } catch (error) {
      console.error('Failed to read from disk cache:', error);
      return null;
    }
  }

  /**
   * Write entry to disk cache
   */
  private async writeToDisk(key: string, entry: ISRCacheEntry): Promise<void> {
    try {
      const filePath = this.getCacheFilePath(key);
      writeFileSync(filePath, JSON.stringify(entry), 'utf8');
    } catch (error) {
      console.error('Failed to write to disk cache:', error);
    }
  }

  /**
   * Get cache file path for key
   */
  private getCacheFilePath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_');
    return join(this.cacheDir, `${safeKey}.json`);
  }

  /**
   * Ensure cache directory exists
   */
  private ensureCacheDir(): void {
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; staleCount: number } {
    let staleCount = 0;
    for (const entry of this.cache.values()) {
      if (this.isStale(entry)) staleCount++;
    }
    return {
      size: this.cache.size,
      staleCount,
    };
  }
}

// Default ISR cache instance
export const isrCache = new ISRCache();

/**
 * Generate static page with ISR
 */
export async function generateISR(
  component: React.ReactElement,
  options: ISROptions
): Promise<ISRResult> {
  const { revalidate = 60 } = options;
  const cacheKey = `${options.url}-${JSON.stringify(options.meta)}`;

  // Check cache
  const cached = await isrCache.get(cacheKey);

  if (cached) {
    // If stale, trigger background revalidation
    if (cached.isStale && !cached.isGenerating) {
      // Mark as generating to prevent duplicate revalidations
      await isrCache.set(cacheKey, { ...cached, isGenerating: true });

      // Trigger background revalidation
      revalidateInBackground(cacheKey, component, options);
    }

    return {
      html: cached.html,
      revalidate: cached.revalidate,
      lastModified: cached.lastModified,
      isStale: cached.isStale,
    };
  }

  // Generate fresh page
  const result = await renderSSR(component, options);

  const entry: ISRCacheEntry = {
    html: result.html,
    lastModified: Date.now(),
    revalidate,
  };

  // Cache the result
  await isrCache.set(cacheKey, entry);

  return {
    html: result.html,
    revalidate,
    lastModified: entry.lastModified,
  };
}

/**
 * Background revalidation
 */
async function revalidateInBackground(
  cacheKey: string,
  component: React.ReactElement,
  options: ISROptions
): Promise<void> {
  try {
    console.log(`Revalidating stale page: ${options.url}`);

    // Generate fresh page
    const result = await renderSSR(component, options);

    // Update cache
    const entry: ISRCacheEntry = {
      html: result.html,
      lastModified: Date.now(),
      revalidate: options.revalidate || 60,
    };

    await isrCache.set(cacheKey, entry);

    // Notify about successful revalidation
    notifyRevalidation(options.url, true);
  } catch (error) {
    console.error(`Failed to revalidate page: ${options.url}`, error);

    // Remove generating flag
    const cached = await isrCache.get(cacheKey);
    if (cached) {
      await isrCache.set(cacheKey, { ...cached, isGenerating: false });
    }

    // Notify about failed revalidation
    notifyRevalidation(options.url, false);
  }
}

/**
 * Notify about revalidation (webhook, event, etc.)
 */
function notifyRevalidation(url: string, success: boolean): void {
  // This could send a webhook, emit an event, or log
  console.log(`Revalidation ${success ? 'succeeded' : 'failed'} for: ${url}`);
}

/**
 * ISR Middleware for Express/Nexus server
 */
export function createISRMiddleware() {
  return async (req: any, res: any, next: any) => {
    try {
      // Check if this route supports ISR
      if (shouldISR(req.path)) {
        const component = await getComponentForRoute(req.path);

        if (component && 'getStaticProps' in component.type) {
          const staticProps = (component.type as any).getStaticProps;
          const props = await staticProps({ params: req.params });

          const result = await generateISR(component, {
            url: req.url,
            config: req.nexusConfig,
            initialState: props,
            revalidate: props.revalidate,
            meta: props.meta,
          });

          // Set ISR headers
          res.set('Cache-Control', 'public, max-age=0, must-revalidate');
          res.set('X-Nexus-ISR', 'true');
          res.set('X-Nexus-Revalidate', result.revalidate.toString());

          if (result.isStale) {
            res.set('X-Nexus-Stale', 'true');
          }

          return res.send(result.html);
        }
      }

      next();
    } catch (error) {
      console.error('ISR Error:', error);
      next();
    }
  };
}

/**
 * Check if route should use ISR
 */
function shouldISR(path: string): boolean {
  // Skip static assets and API routes
  if (path.startsWith('/static/') || path.startsWith('/api/')) {
    return false;
  }

  // This would check configuration or component metadata
  return true;
}

/**
 * Get component for route (same as SSR)
 */
async function getComponentForRoute(path: string): Promise<React.ReactElement | null> {
  // This would map routes to components
  return null;
}

/**
 * Pre-generate static pages at build time
 */
export async function generateStaticPages(
  routes: Array<{
    path: string;
    component: React.ReactElement;
    options: ISROptions;
  }>
): Promise<void> {
  console.log(`Generating ${routes.length} static pages...`);

  for (const route of routes) {
    try {
      const result = await generateISR(route.component, route.options);

      // Write to static files directory
      const staticPath = route.path === '/' ? '/index.html' : `${route.path}.html`;
      const filePath = join('dist/static', staticPath);

      // Ensure directory exists
      mkdirSync(dirname(filePath), { recursive: true });

      // Write file
      writeFileSync(filePath, result.html);

      console.log(`✓ Generated: ${route.path}`);
    } catch (error) {
      console.error(`✗ Failed to generate: ${route.path}`, error);
    }
  }
}

/**
 * ISR Revalidation API endpoint
 */
export function createRevalidationAPI() {
  return async (req: any, res: any) => {
    try {
      const { path, token } = req.body;

      // Validate token
      if (token !== process.env.NEXUS_REVALIDATE_TOKEN) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Find component for path
      const component = await getComponentForRoute(path);
      if (!component) {
        return res.status(404).json({ error: 'Page not found' });
      }

      // Force revalidation
      const cacheKey = `${path}`;
      const cached = await isrCache.get(cacheKey);

      if (cached) {
        // Remove from cache to force regeneration
        isrCache.clear();

        // Regenerate
        const result = await generateISR(component, {
          url: path,
          config: req.nexusConfig,
        });

        res.json({ revalidated: true, at: Date.now() });
      } else {
        res.json({ revalidated: false, reason: 'Not cached' });
      }
    } catch (error) {
      console.error('Revalidation error:', error);
      res.status(500).json({ error: 'Revalidation failed' });
    }
  };
}
