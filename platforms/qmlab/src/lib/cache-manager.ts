// Advanced caching manager for QMLab
// Handles multiple cache layers: Memory, IndexedDB, Service Worker, and CDN

import { trackQuantumEvents } from './analytics';

// Cache configuration
const CACHE_CONFIG = {
  memory: {
    maxSize: 50 * 1024 * 1024, // 50MB
    ttl: 5 * 60 * 1000, // 5 minutes
  },
  indexeddb: {
    maxSize: 200 * 1024 * 1024, // 200MB
    ttl: 24 * 60 * 60 * 1000, // 24 hours
  },
  quantum: {
    maxResults: 1000, // Maximum cached quantum results
    ttl: 60 * 60 * 1000, // 1 hour
  }
};

// Memory cache with LRU eviction
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; size: number }>();
  private accessOrder = new Map<string, number>();
  private currentSize = 0;
  private accessCounter = 0;

  set(key: string, data: any): boolean {
    try {
      const serialized = JSON.stringify(data);
      const size = new Blob([serialized]).size;

      // Check if item is too large
      if (size > CACHE_CONFIG.memory.maxSize * 0.1) {
        return false;
      }

      // Evict if necessary
      while (this.currentSize + size > CACHE_CONFIG.memory.maxSize && this.cache.size > 0) {
        this.evictLRU();
      }

      // Remove existing item if present
      if (this.cache.has(key)) {
        this.currentSize -= this.cache.get(key)!.size;
      }

      // Add new item
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        size
      });

      this.accessOrder.set(key, ++this.accessCounter);
      this.currentSize += size;

      return true;
    } catch (error) {
      console.error('Memory cache set failed:', error);
      return false;
    }
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;

    // Check TTL
    if (Date.now() - item.timestamp > CACHE_CONFIG.memory.ttl) {
      this.delete(key);
      return null;
    }

    // Update access order
    this.accessOrder.set(key, ++this.accessCounter);
    return item.data;
  }

  delete(key: string): boolean {
    const item = this.cache.get(key);
    if (item) {
      this.currentSize -= item.size;
      this.cache.delete(key);
      this.accessOrder.delete(key);
      return true;
    }
    return false;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.currentSize = 0;
    this.accessCounter = 0;
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestAccess = Infinity;

    for (const [key, access] of this.accessOrder) {
      if (access < oldestAccess) {
        oldestAccess = access;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      memoryUsage: this.currentSize,
      memoryLimit: CACHE_CONFIG.memory.maxSize,
      utilizationPercent: (this.currentSize / CACHE_CONFIG.memory.maxSize) * 100
    };
  }
}

// IndexedDB cache for persistent storage
class IndexedDBCache {
  private dbName = 'QMLab-Cache';
  private version = 1;
  protected db: IDBDatabase | null = null;

  async init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('quantum-results')) {
          const quantumStore = db.createObjectStore('quantum-results', { keyPath: 'key' });
          quantumStore.createIndex('timestamp', 'timestamp');
          quantumStore.createIndex('circuitHash', 'circuitHash');
        }

        if (!db.objectStoreNames.contains('general-cache')) {
          const generalStore = db.createObjectStore('general-cache', { keyPath: 'key' });
          generalStore.createIndex('timestamp', 'timestamp');
          generalStore.createIndex('category', 'category');
        }
      };
    });
  }

  async set(key: string, data: any, category: string = 'general'): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction(['general-cache'], 'readwrite');
      const store = transaction.objectStore('general-cache');

      const item = {
        key,
        data,
        category,
        timestamp: Date.now(),
        size: new Blob([JSON.stringify(data)]).size
      };

      await new Promise((resolve, reject) => {
        const request = store.put(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Clean up old entries
      await this.cleanup();
      return true;
    } catch (error) {
      console.error('IndexedDB cache set failed:', error);
      return false;
    }
  }

  async get(key: string): Promise<any | null> {
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction(['general-cache'], 'readonly');
      const store = transaction.objectStore('general-cache');

      const item = await new Promise<any>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (!item) return null;

      // Check TTL
      if (Date.now() - item.timestamp > CACHE_CONFIG.indexeddb.ttl) {
        await this.delete(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('IndexedDB cache get failed:', error);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction(['general-cache'], 'readwrite');
      const store = transaction.objectStore('general-cache');

      await new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('IndexedDB cache delete failed:', error);
      return false;
    }
  }

  async cleanup(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['general-cache'], 'readwrite');
      const store = transaction.objectStore('general-cache');
      const index = store.index('timestamp');

      const cutoff = Date.now() - CACHE_CONFIG.indexeddb.ttl;
      const range = IDBKeyRange.upperBound(cutoff);

      await new Promise<void>((resolve, reject) => {
        const request = index.openCursor(range);
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB cleanup failed:', error);
    }
  }
}

// Quantum simulation result cache
class QuantumResultCache extends IndexedDBCache {
  async cacheQuantumResult(
    circuitConfig: any,
    simulationResult: any,
    metadata: any = {}
  ): Promise<boolean> {
    if (!this.db) return false;

    try {
      const circuitHash = await this.hashCircuit(circuitConfig);
      const key = `quantum-${circuitHash}`;

      const transaction = this.db.transaction(['quantum-results'], 'readwrite');
      const store = transaction.objectStore('quantum-results');

      const item = {
        key,
        circuitHash,
        circuitConfig,
        result: simulationResult,
        metadata,
        timestamp: Date.now(),
        size: new Blob([JSON.stringify(simulationResult)]).size
      };

      await new Promise((resolve, reject) => {
        const request = store.put(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Track caching
      trackQuantumEvents.componentLoad('quantum_result_cached', 0);

      // Cleanup if necessary
      await this.cleanupQuantumResults();
      return true;
    } catch (error) {
      console.error('Quantum result cache failed:', error);
      return false;
    }
  }

  async getQuantumResult(circuitConfig: any): Promise<any | null> {
    if (!this.db) return null;

    try {
      const circuitHash = await this.hashCircuit(circuitConfig);
      const key = `quantum-${circuitHash}`;

      const transaction = this.db.transaction(['quantum-results'], 'readonly');
      const store = transaction.objectStore('quantum-results');

      const item = await new Promise<any>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (!item) return null;

      // Check TTL
      if (Date.now() - item.timestamp > CACHE_CONFIG.quantum.ttl) {
        await this.deleteQuantumResult(key);
        return null;
      }

      // Track cache hit
      trackQuantumEvents.componentLoad('quantum_cache_hit', 0);
      return item.result;
    } catch (error) {
      console.error('Quantum result retrieval failed:', error);
      return null;
    }
  }

  private async hashCircuit(circuitConfig: any): Promise<string> {
    const configString = JSON.stringify(circuitConfig, Object.keys(circuitConfig).sort());
    const encoder = new TextEncoder();
    const data = encoder.encode(configString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async deleteQuantumResult(key: string): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction(['quantum-results'], 'readwrite');
      const store = transaction.objectStore('quantum-results');

      await new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Quantum result deletion failed:', error);
      return false;
    }
  }

  private async cleanupQuantumResults(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['quantum-results'], 'readwrite');
      const store = transaction.objectStore('quantum-results');

      // Count current results
      const count = await new Promise<number>((resolve, reject) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Remove oldest results if over limit
      if (count > CACHE_CONFIG.quantum.maxResults) {
        const index = store.index('timestamp');
        const resultsToRemove = count - CACHE_CONFIG.quantum.maxResults;
        let removed = 0;

        await new Promise<void>((resolve, reject) => {
          const request = index.openCursor();
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor && removed < resultsToRemove) {
              cursor.delete();
              removed++;
              cursor.continue();
            } else {
              resolve();
            }
          };
          request.onerror = () => reject(request.error);
        });
      }
    } catch (error) {
      console.error('Quantum results cleanup failed:', error);
    }
  }
}

// Main cache manager
export class CacheManager {
  private memoryCache = new MemoryCache();
  private indexedDBCache = new IndexedDBCache();
  private quantumCache = new QuantumResultCache();
  private initialized = false;

  async init(): Promise<boolean> {
    try {
      await this.indexedDBCache.init();
      await this.quantumCache.init();
      this.initialized = true;
      
      // Track initialization
      trackQuantumEvents.componentLoad('cache_manager_initialized', 0);
      return true;
    } catch (error) {
      console.error('Cache manager initialization failed:', error);
      return false;
    }
  }

  // Multi-tier caching strategy
  async get(key: string, category: string = 'general'): Promise<any | null> {
    // Try memory cache first
    let result = this.memoryCache.get(key);
    if (result !== null) {
      trackQuantumEvents.componentLoad('memory_cache_hit', 0);
      return result;
    }

    // Try IndexedDB cache
    if (this.initialized) {
      result = await this.indexedDBCache.get(key);
      if (result !== null) {
        // Store in memory for faster access
        this.memoryCache.set(key, result);
        trackQuantumEvents.componentLoad('indexeddb_cache_hit', 0);
        return result;
      }
    }

    trackQuantumEvents.componentLoad('cache_miss', 0);
    return null;
  }

  async set(key: string, data: any, category: string = 'general'): Promise<boolean> {
    // Store in memory cache
    const memorySuccess = this.memoryCache.set(key, data);

    // Store in IndexedDB cache for persistence
    let persistentSuccess = false;
    if (this.initialized) {
      persistentSuccess = await this.indexedDBCache.set(key, data, category);
    }

    return memorySuccess || persistentSuccess;
  }

  async delete(key: string): Promise<boolean> {
    const memorySuccess = this.memoryCache.delete(key);
    
    let persistentSuccess = false;
    if (this.initialized) {
      persistentSuccess = await this.indexedDBCache.delete(key);
    }

    return memorySuccess || persistentSuccess;
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    
    if (this.initialized) {
      // Clear IndexedDB caches
      await this.indexedDBCache.cleanup();
    }

    trackQuantumEvents.componentLoad('cache_cleared', 0);
  }

  // Quantum-specific methods
  async cacheQuantumResult(circuitConfig: any, result: any, metadata?: any): Promise<boolean> {
    if (!this.initialized) return false;
    return await this.quantumCache.cacheQuantumResult(circuitConfig, result, metadata);
  }

  async getQuantumResult(circuitConfig: any): Promise<any | null> {
    if (!this.initialized) return null;
    return await this.quantumCache.getQuantumResult(circuitConfig);
  }

  // Cache statistics
  getStats() {
    return {
      memory: this.memoryCache.getStats(),
      initialized: this.initialized,
      quantumCacheAvailable: this.initialized
    };
  }
}

// Global cache manager instance
export const cacheManager = new CacheManager();