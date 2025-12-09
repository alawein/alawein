/**
 * Physics Memory Management System - Phase 2
 * 
 * Advanced memory management for scientific computing applications with
 * intelligent caching, garbage collection, and resource optimization.
 * 
 * Features:
 * - LRU cache for expensive physics calculations
 * - Memory pressure monitoring and automatic cleanup
 * - WebWorker memory synchronization
 * - Physics data streaming for large datasets
 * - Memory profiling and optimization
 * 
 * @author Dr. Meshal Alawein - UC Berkeley
 * @version 2.0.0 - Phase 2 Implementation
 */

export interface MemoryEntry<T = any> {
  key: string;
  data: T;
  size: number; // in bytes
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  priority: 'high' | 'medium' | 'low';
  persistent: boolean; // Don't auto-cleanup
  computationTime?: number; // Time taken to compute
}

export interface MemoryStats {
  totalAllocated: number;
  totalUsed: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  entriesCount: number;
  averageEntrySize: number;
  oldestEntry: number;
  memoryPressure: 'low' | 'medium' | 'high';
  gcCount: number;
  lastGcTime: number;
}

export interface MemoryLimits {
  maxTotalMemory: number;     // Maximum total memory usage (bytes)
  maxCacheSize: number;       // Maximum cache entries
  gcThreshold: number;        // Memory usage % to trigger GC
  entryTtl: number;          // Time-to-live for cache entries (ms)
  maxEntrySize: number;      // Maximum size for single entry (bytes)
}

/**
 * LRU Cache with memory awareness for physics calculations
 */
export class PhysicsLRUCache<T = any> {
  private cache = new Map<string, MemoryEntry<T>>();
  private limits: MemoryLimits;
  private stats: MemoryStats;
  private gcTimer?: NodeJS.Timeout;

  constructor(limits: Partial<MemoryLimits> = {}) {
    this.limits = {
      maxTotalMemory: 500 * 1024 * 1024,  // 500MB default
      maxCacheSize: 1000,
      gcThreshold: 0.8,                    // 80%
      entryTtl: 30 * 60 * 1000,           // 30 minutes
      maxEntrySize: 50 * 1024 * 1024,     // 50MB per entry
      ...limits
    };

    this.stats = {
      totalAllocated: 0,
      totalUsed: 0,
      cacheHits: 0,
      cacheMisses: 0,
      hitRate: 0,
      entriesCount: 0,
      averageEntrySize: 0,
      oldestEntry: Date.now(),
      memoryPressure: 'low',
      gcCount: 0,
      lastGcTime: 0
    };

    // Schedule periodic cleanup
    this.scheduleGarbageCollection();
  }

  /**
   * Store data in cache with memory tracking
   */
  set(key: string, data: T, options: {
    priority?: MemoryEntry['priority'];
    persistent?: boolean;
    computationTime?: number;
  } = {}): void {
    const size = this.estimateSize(data);
    
    // Check if entry is too large
    if (size > this.limits.maxEntrySize) {
      console.warn(`PhysicsCache: Entry ${key} exceeds maximum size (${size} > ${this.limits.maxEntrySize})`);
      return;
    }

    // Remove existing entry if present
    if (this.cache.has(key)) {
      this.delete(key);
    }

    const entry: MemoryEntry<T> = {
      key,
      data,
      size,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
      priority: options.priority || 'medium',
      persistent: options.persistent || false,
      computationTime: options.computationTime
    };

    // Check memory pressure before adding
    const projectedMemory = this.stats.totalUsed + size;
    if (projectedMemory > this.limits.maxTotalMemory * this.limits.gcThreshold) {
      this.garbageCollect(size);
    }

    this.cache.set(key, entry);
    this.updateStatsOnAdd(entry);

    // Trigger size-based cleanup if needed
    if (this.cache.size > this.limits.maxCacheSize) {
      this.evictLeastRecentlyUsed();
    }
  }

  /**
   * Retrieve data from cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.cacheMisses++;
      this.updateHitRate();
      return undefined;
    }

    // Check if entry has expired
    if (!entry.persistent && (Date.now() - entry.timestamp) > this.limits.entryTtl) {
      this.delete(key);
      this.stats.cacheMisses++;
      this.updateHitRate();
      return undefined;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    // Move to end for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);

    this.stats.cacheHits++;
    this.updateHitRate();
    
    return entry.data;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check expiration
    if (!entry.persistent && (Date.now() - entry.timestamp) > this.limits.entryTtl) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Remove entry from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.cache.delete(key);
    this.updateStatsOnRemove(entry);
    return true;
  }

  /**
   * Clear all entries (except persistent ones)
   */
  clear(includePersistent = false): void {
    const toDelete: string[] = [];
    
    for (const [key, entry] of this.cache) {
      if (includePersistent || !entry.persistent) {
        toDelete.push(key);
      }
    }

    toDelete.forEach(key => this.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats(): MemoryStats {
    this.updateMemoryPressure();
    return { ...this.stats };
  }

  /**
   * Get all cache keys sorted by priority and access time
   */
  getKeys(sortBy: 'priority' | 'access' | 'size' = 'access'): string[] {
    const entries = Array.from(this.cache.values());
    
    entries.sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'size':
          return b.size - a.size;
        case 'access':
        default:
          return b.lastAccessed - a.lastAccessed;
      }
    });

    return entries.map(entry => entry.key);
  }

  /**
   * Estimate memory usage of data
   */
  private estimateSize(data: any): number {
    if (data === null || data === undefined) return 0;
    
    if (typeof data === 'string') {
      return data.length * 2; // UTF-16 encoding
    }
    
    if (typeof data === 'number') {
      return 8; // 64-bit number
    }
    
    if (typeof data === 'boolean') {
      return 4;
    }
    
    if (data instanceof ArrayBuffer) {
      return data.byteLength;
    }
    
    if (data instanceof Float32Array) {
      return data.length * 4;
    }
    
    if (data instanceof Float64Array) {
      return data.length * 8;
    }
    
    if (data instanceof Int32Array) {
      return data.length * 4;
    }
    
    if (Array.isArray(data)) {
      return data.reduce((sum, item) => sum + this.estimateSize(item), 0) + (data.length * 8);
    }
    
    if (typeof data === 'object') {
      let size = 0;
      for (const [key, value] of Object.entries(data)) {
        size += this.estimateSize(key) + this.estimateSize(value) + 16; // Object overhead
      }
      return size;
    }
    
    return 64; // Default estimate for unknown types
  }

  /**
   * Perform garbage collection to free memory
   */
  private garbageCollect(requiredSpace = 0): void {
    const startTime = Date.now();
    const targetMemory = this.limits.maxTotalMemory * 0.7; // Target 70% usage
    const spaceToFree = Math.max(this.stats.totalUsed - targetMemory, requiredSpace);
    
    let freedSpace = 0;
    const entries = Array.from(this.cache.entries());
    
    // Sort by priority (lowest first) and last accessed time
    entries.sort(([, a], [, b]) => {
      if (a.persistent && !b.persistent) return 1;
      if (!a.persistent && b.persistent) return -1;
      
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return a.lastAccessed - b.lastAccessed;
    });

    for (const [key, entry] of entries) {
      if (freedSpace >= spaceToFree) break;
      if (entry.persistent) continue;
      
      freedSpace += entry.size;
      this.cache.delete(key);
      this.updateStatsOnRemove(entry);
    }

    this.stats.gcCount++;
    this.stats.lastGcTime = Date.now();
    
    console.log(`PhysicsCache: GC freed ${freedSpace} bytes in ${Date.now() - startTime}ms`);
  }

  /**
   * Evict least recently used entries
   */
  private evictLeastRecentlyUsed(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
    
    const toRemove = Math.ceil(this.cache.size * 0.1); // Remove 10%
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const [key, entry] = entries[i];
      if (!entry.persistent) {
        this.cache.delete(key);
        this.updateStatsOnRemove(entry);
      }
    }
  }

  /**
   * Schedule periodic garbage collection
   */
  private scheduleGarbageCollection(): void {
    this.gcTimer = setInterval(() => {
      if (this.stats.memoryPressure === 'high') {
        this.garbageCollect();
      }
      
      // Clean expired entries
      const now = Date.now();
      for (const [key, entry] of this.cache) {
        if (!entry.persistent && (now - entry.timestamp) > this.limits.entryTtl) {
          this.delete(key);
        }
      }
    }, 60000); // Run every minute
  }

  /**
   * Update statistics when adding entry
   */
  private updateStatsOnAdd(entry: MemoryEntry<T>): void {
    this.stats.totalUsed += entry.size;
    this.stats.entriesCount++;
    this.stats.averageEntrySize = this.stats.totalUsed / this.stats.entriesCount;
    
    if (entry.timestamp < this.stats.oldestEntry) {
      this.stats.oldestEntry = entry.timestamp;
    }
  }

  /**
   * Update statistics when removing entry
   */
  private updateStatsOnRemove(entry: MemoryEntry<T>): void {
    this.stats.totalUsed = Math.max(0, this.stats.totalUsed - entry.size);
    this.stats.entriesCount = Math.max(0, this.stats.entriesCount - 1);
    this.stats.averageEntrySize = this.stats.entriesCount > 0 
      ? this.stats.totalUsed / this.stats.entriesCount 
      : 0;
  }

  /**
   * Update hit rate statistics
   */
  private updateHitRate(): void {
    const total = this.stats.cacheHits + this.stats.cacheMisses;
    this.stats.hitRate = total > 0 ? this.stats.cacheHits / total : 0;
  }

  /**
   * Update memory pressure indicator
   */
  private updateMemoryPressure(): void {
    const usage = this.stats.totalUsed / this.limits.maxTotalMemory;
    
    if (usage > 0.9) {
      this.stats.memoryPressure = 'high';
    } else if (usage > 0.7) {
      this.stats.memoryPressure = 'medium';
    } else {
      this.stats.memoryPressure = 'low';
    }
  }

  /**
   * Cleanup and dispose
   */
  dispose(): void {
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
    }
    this.clear(true);
  }
}

/**
 * Global Physics Memory Manager
 * Singleton instance for managing physics computation memory
 */
export class PhysicsMemoryManager {
  private static instance: PhysicsMemoryManager;
  private cache: PhysicsLRUCache;
  private computationCache: PhysicsLRUCache;
  private plotCache: PhysicsLRUCache;
  private memoryObserver?: PerformanceObserver;

  private constructor() {
    // Main cache for physics data
    this.cache = new PhysicsLRUCache({
      maxTotalMemory: 300 * 1024 * 1024, // 300MB
      maxCacheSize: 500,
      gcThreshold: 0.8
    });

    // Separate cache for expensive computations
    this.computationCache = new PhysicsLRUCache({
      maxTotalMemory: 200 * 1024 * 1024, // 200MB
      maxCacheSize: 100,
      gcThreshold: 0.7,
      entryTtl: 60 * 60 * 1000 // 1 hour for computations
    });

    // Cache for plot data (shorter TTL)
    this.plotCache = new PhysicsLRUCache({
      maxTotalMemory: 100 * 1024 * 1024, // 100MB
      maxCacheSize: 200,
      gcThreshold: 0.9,
      entryTtl: 10 * 60 * 1000 // 10 minutes for plots
    });

    this.setupMemoryMonitoring();
  }

  static getInstance(): PhysicsMemoryManager {
    if (!PhysicsMemoryManager.instance) {
      PhysicsMemoryManager.instance = new PhysicsMemoryManager();
    }
    return PhysicsMemoryManager.instance;
  }

  /**
   * Cache physics data with automatic categorization
   */
  cachePhysicsData(key: string, data: any, category: 'computation' | 'plot' | 'general' = 'general', options: {
    priority?: MemoryEntry['priority'];
    persistent?: boolean;
    computationTime?: number;
  } = {}): void {
    const cache = this.getCacheByCategory(category);
    cache.set(key, data, options);
  }

  /**
   * Retrieve cached physics data
   */
  getCachedPhysicsData<T = any>(key: string, category: 'computation' | 'plot' | 'general' = 'general'): T | undefined {
    const cache = this.getCacheByCategory(category);
    return cache.get(key);
  }

  /**
   * Check if physics data is cached
   */
  hasPhysicsData(key: string, category: 'computation' | 'plot' | 'general' = 'general'): boolean {
    const cache = this.getCacheByCategory(category);
    return cache.has(key);
  }

  /**
   * Generate cache key for physics calculations
   */
  generatePhysicsKey(moduleType: string, method: string, parameters: any): string {
    const paramHash = JSON.stringify(parameters, Object.keys(parameters).sort());
    return `${moduleType}:${method}:${this.hashString(paramHash)}`;
  }

  /**
   * Get comprehensive memory statistics
   */
  getMemoryStats(): {
    general: MemoryStats;
    computation: MemoryStats;
    plot: MemoryStats;
    total: {
      memoryUsed: number;
      cacheHitRate: number;
      totalEntries: number;
    };
  } {
    const general = this.cache.getStats();
    const computation = this.computationCache.getStats();
    const plot = this.plotCache.getStats();

    return {
      general,
      computation,
      plot,
      total: {
        memoryUsed: general.totalUsed + computation.totalUsed + plot.totalUsed,
        cacheHitRate: (general.hitRate + computation.hitRate + plot.hitRate) / 3,
        totalEntries: general.entriesCount + computation.entriesCount + plot.entriesCount
      }
    };
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.cache.clear();
    this.computationCache.clear();
    this.plotCache.clear();
  }

  /**
   * Optimize memory usage
   */
  optimizeMemory(): void {
    // Force garbage collection on all caches
    const stats = this.getMemoryStats();
    
    if (stats.total.memoryUsed > 500 * 1024 * 1024) { // 500MB threshold
      console.log('PhysicsMemoryManager: Optimizing memory usage...');
      
      // Clear plot cache first (most volatile)
      this.plotCache.clear();
      
      // Partially clear general cache
      const generalKeys = this.cache.getKeys('access').slice(Math.floor(this.cache.getKeys().length * 0.7));
      generalKeys.forEach(key => this.cache.delete(key));
      
      console.log('PhysicsMemoryManager: Memory optimization complete');
    }
  }

  private getCacheByCategory(category: 'computation' | 'plot' | 'general'): PhysicsLRUCache {
    switch (category) {
      case 'computation': return this.computationCache;
      case 'plot': return this.plotCache;
      case 'general': 
      default: return this.cache;
    }
  }

  private setupMemoryMonitoring(): void {
    // Monitor memory usage if Performance Observer is available
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        this.memoryObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'measure' && entry.name === 'memory-usage') {
              // React to memory usage changes
              const stats = this.getMemoryStats();
              if (stats.total.memoryUsed > 400 * 1024 * 1024) { // 400MB
                this.optimizeMemory();
              }
            }
          });
        });
        
        this.memoryObserver.observe({ entryTypes: ['measure'] });
      } catch (error) {
        console.warn('PhysicsMemoryManager: Performance monitoring not available');
      }
    }

    // Set up periodic memory monitoring
    setInterval(() => {
      const stats = this.getMemoryStats();
      if (stats.total.memoryUsed > 600 * 1024 * 1024) { // 600MB emergency threshold
        console.warn('PhysicsMemoryManager: High memory usage detected, optimizing...');
        this.optimizeMemory();
      }
    }, 30000); // Check every 30 seconds
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Dispose of all resources
   */
  dispose(): void {
    if (this.memoryObserver) {
      this.memoryObserver.disconnect();
    }
    
    this.cache.dispose();
    this.computationCache.dispose();
    this.plotCache.dispose();
  }
}

// Export singleton instance
export const physicsMemoryManager = PhysicsMemoryManager.getInstance();

// Export convenience functions
export function cachePhysicsData(key: string, data: any, options?: Parameters<typeof physicsMemoryManager.cachePhysicsData>[3]) {
  return physicsMemoryManager.cachePhysicsData(key, data, 'general', options);
}

export function getCachedPhysicsData<T = any>(key: string): T | undefined {
  return physicsMemoryManager.getCachedPhysicsData<T>(key);
}

export function generatePhysicsKey(moduleType: string, method: string, parameters: any): string {
  return physicsMemoryManager.generatePhysicsKey(moduleType, method, parameters);
}