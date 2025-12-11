/**
 * Nexus Intelligent Caching System
 * Multi-layer caching with intelligent invalidation
 */

import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  maxSize?: number; // Maximum cache size in MB
  strategy?: 'lru' | 'lfu' | 'fifo';
  compression?: boolean;
  persistToDisk?: boolean;
  diskPath?: string;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl?: number;
  hits: number;
  size: number;
  tags?: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  entries: number;
  evictions: number;
}

/**
 * Multi-layer cache manager
 */
export class IntelligentCache {
  private memoryCache = new Map<string, CacheEntry>();
  private diskCache = new Map<string, CacheEntry>();
  private options: Required<CacheOptions>;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    size: 0,
    entries: 0,
    evictions: 0,
  };

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: 3600, // 1 hour
      maxSize: 100, // 100 MB
      strategy: 'lru',
      compression: true,
      persistToDisk: false,
      diskPath: '.nexus/cache',
      ...options,
    };
  }

  /**
   * Get value from cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    // Try memory cache first
    let entry = this.memoryCache.get(key);

    if (entry) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
        entry = null;
      } else {
        entry.hits++;
        this.stats.hits++;
        this.updateHitRate();
        return entry.value;
      }
    }

    // Try disk cache
    if (this.options.persistToDisk) {
      entry = await this.getFromDisk(key);

      if (entry) {
        if (this.isExpired(entry)) {
          await this.deleteFromDisk(key);
          entry = null;
        } else {
          // Promote to memory cache
          this.memoryCache.set(key, entry);
          entry.hits++;
          this.stats.hits++;
          this.updateHitRate();
          return entry.value;
        }
      }
    }

    this.stats.misses++;
    this.updateHitRate();
    return null;
  }

  /**
   * Set value in cache
   */
  async set<T = any>(
    key: string,
    value: T,
    options: Partial<CacheOptions> = {}
  ): Promise<void> {
    const ttl = options.ttl || this.options.ttl;
    const serialized = JSON.stringify(value);
    const size = Buffer.byteLength(serialized, 'utf8');

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      size,
    };

    // Check memory cache size
    if (this.getCurrentMemorySize() + size > this.options.maxSize * 1024 * 1024) {
      this.evictFromMemory();
    }

    // Store in memory
    this.memoryCache.set(key, entry);

    // Store on disk if enabled
    if (this.options.persistToDisk) {
      await this.saveToDisk(entry);
    }

    this.updateStats();
  }

  /**
   * Delete from cache
   */
  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);

    if (this.options.persistToDisk) {
      await this.deleteFromDisk(key);
    }

    this.updateStats();
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();

    if (this.options.persistToDisk) {
      await this.clearDisk();
    }

    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      size: 0,
      entries: 0,
      evictions: 0,
    };
  }

  /**
   * Invalidate by tags
   */
  async invalidateByTag(tag: string): Promise<void> {
    for (const [key, entry] of this.memoryCache) {
      if (entry.tags?.includes(tag)) {
        this.memoryCache.delete(key);
      }
    }

    if (this.options.persistToDisk) {
      for (const [key, entry] of this.diskCache) {
        if (entry.tags?.includes(tag)) {
          await this.deleteFromDisk(key);
        }
      }
    }

    this.updateStats();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Warm cache with data
   */
  async warmCache(data: Array<{ key: string; value: any; tags?: string[] }>): Promise<void> {
    for (const item of data) {
      await this.set(item.key, item.value, { tags: item.tags });
    }
  }

  /**
   * Create cache key from parameters
   */
  createKey(...parts: any[]): string {
    const key = parts
      .map(p => (typeof p === 'object' ? JSON.stringify(p) : String(p)))
      .join(':');
    return createHash('md5').update(key).digest('hex');
  }

  // Private methods
  private isExpired(entry: CacheEntry): boolean {
    if (!entry.ttl) return false;
    return Date.now() - entry.timestamp > entry.ttl * 1000;
  }

  private getCurrentMemorySize(): number {
    let size = 0;
    for (const entry of this.memoryCache.values()) {
      size += entry.size;
    }
    return size;
  }

  private evictFromMemory(): void {
    const entries = Array.from(this.memoryCache.entries());

    switch (this.options.strategy) {
      case 'lru':
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        break;
      case 'lfu':
        entries.sort((a, b) => a[1].hits - b[1].hits);
        break;
      case 'fifo':
        // Already in insertion order
        break;
    }

    // Evict oldest entries until we have space
    const toEvict = Math.ceil(entries.length * 0.2); // Evict 20%
    for (let i = 0; i < toEvict; i++) {
      this.memoryCache.delete(entries[i][0]);
      this.stats.evictions++;
    }
  }

  private async saveToDisk(entry: CacheEntry): Promise<void> {
    const filePath = join(this.options.diskPath, `${entry.key}.cache`);
    const data = JSON.stringify(entry);

    await fs.mkdir(this.options.diskPath, { recursive: true });
    await fs.writeFile(filePath, data);

    this.diskCache.set(entry.key, entry);
  }

  private async getFromDisk(key: string): Promise<CacheEntry | null> {
    const filePath = join(this.options.diskPath, `${key}.cache`);

    try {
      const data = await fs.readFile(filePath, 'utf8');
      const entry = JSON.parse(data) as CacheEntry;
      this.diskCache.set(key, entry);
      return entry;
    } catch (error) {
      return null;
    }
  }

  private async deleteFromDisk(key: string): Promise<void> {
    const filePath = join(this.options.diskPath, `${key}.cache`);

    try {
      await fs.unlink(filePath);
      this.diskCache.delete(key);
    } catch (error) {
      // File doesn't exist
    }
  }

  private async clearDisk(): Promise<void> {
    try {
      await fs.rmdir(this.options.diskPath, { recursive: true });
      this.diskCache.clear();
    } catch (error) {
      // Directory doesn't exist
    }
  }

  private updateStats(): void {
    this.stats.entries = this.memoryCache.size;
    this.stats.size = this.getCurrentMemorySize();
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }
}

/**
 * HTTP Response Cache
 */
export class ResponseCache extends IntelligentCache {
  constructor() {
    super({
      ttl: 300, // 5 minutes
      maxSize: 50, // 50 MB
      persistToDisk: true,
    });
  }

  /**
   * Cache HTTP response
   */
  async cacheResponse(
    url: string,
    response: Response,
    options: { vary?: string[] } = {}
  ): Promise<void> {
    const key = this.createKey('response', url, options.vary || []);
    const data = {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text(),
      cachedAt: Date.now(),
    };

    await this.set(key, data);
  }

  /**
   * Get cached response
   */
  async getCachedResponse(
    url: string,
    options: { vary?: string[] } = {}
  ): Promise<Response | null> {
    const key = this.createKey('response', url, options.vary || []);
    const data = await this.get(key);

    if (!data) return null;

    return new Response(data.body, {
      status: data.status,
      headers: {
        ...data.headers,
        'X-Cache': 'HIT',
        'X-Cache-Age': Math.floor((Date.now() - data.cachedAt) / 1000).toString(),
      },
    });
  }
}

/**
 * API Response Cache
 */
export class APICache extends IntelligentCache {
  constructor() {
    super({
      ttl: 60, // 1 minute
      maxSize: 20, // 20 MB
      strategy: 'lfu',
    });
  }

  /**
   * Cache API response
   */
  async cacheAPIResponse(
    endpoint: string,
    method: string,
    params: any,
    response: any
  ): Promise<void> {
    const key = this.createKey('api', endpoint, method, params);
    await this.set(key, response, {
      tags: [`endpoint:${endpoint}`, `method:${method}`],
    });
  }

  /**
   * Get cached API response
   */
  async getCachedAPIResponse(
    endpoint: string,
    method: string,
    params: any
  ): Promise<any | null> {
    const key = this.createKey('api', endpoint, method, params);
    return await this.get(key);
  }

  /**
   * Invalidate endpoint cache
   */
  async invalidateEndpoint(endpoint: string): Promise<void> {
    await this.invalidateByTag(`endpoint:${endpoint}`);
  }
}

/**
 * Static Asset Cache
 */
export class AssetCache extends IntelligentCache {
  constructor() {
    super({
      ttl: 86400, // 24 hours
      maxSize: 200, // 200 MB
      persistToDisk: true,
    });
  }

  /**
   * Cache static asset
   */
  async cacheAsset(
    path: string,
    content: Buffer | string,
    contentType: string
  ): Promise<void> {
    const key = this.createKey('asset', path, contentType);
    await this.set(key, { content, contentType, etag: this.generateETag(content) });
  }

  /**
   * Get cached asset
   */
  async getCachedAsset(path: string): Promise<{
    content: Buffer | string;
    contentType: string;
    etag: string;
  } | null> {
    const key = this.createKey('asset', path);
    return await this.get(key);
  }

  private generateETag(content: Buffer | string): string {
    const hash = createHash('md5').update(content).digest('hex');
    return `"${hash}"`;
  }
}

/**
 * Cache middleware factory
 */
export function createCacheMiddleware(cache: IntelligentCache) {
  return async (req: any, res: any, next: any) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Try to get from cache
    const cached = await cache.getCachedResponse(req.url, {
      vary: req.headers['accept-encoding'] ? ['accept-encoding'] : [],
    });

    if (cached) {
      return res.send(cached);
    }

    // Capture response
    const originalSend = res.send;
    const originalEnd = res.end;
    let responseData: any;

    res.send = function(data) {
      responseData = data;

      // Cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const response = new Response(data, {
          status: res.statusCode,
          headers: res.getHeaders(),
        });
        cache.cacheResponse(req.url, response);
      }

      return originalSend.call(this, data);
    };

    next();
  };
}

/**
 * Distributed Cache (Redis/Memcached)
 */
export class DistributedCache {
  private client: any; // Redis or Memcached client

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Get value from distributed cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Distributed cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in distributed cache
   */
  async set<T = any>(key: string, value: T, ttl = 3600): Promise<void> {
    try {
      await this.client.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Distributed cache set error:', error);
    }
  }

  /**
   * Delete from distributed cache
   */
  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Distributed cache delete error:', error);
    }
  }

  /**
   * Clear distributed cache
   */
  async clear(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (error) {
      console.error('Distributed cache clear error:', error);
    }
  }
}

// Default cache instances
export const defaultCache = new IntelligentCache();
export const responseCache = new ResponseCache();
export const apiCache = new APICache();
export const assetCache = new AssetCache();
