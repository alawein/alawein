/**
 * Feature Flag Cache - Caching layer for flags
 */

export class FeatureFlagCache {
  private cache: Map<string, { value: boolean; expiry: number }> = new Map();
  private ttl: number;

  constructor(ttlMs: number = 60000) {
    this.ttl = ttlMs;
  }

  get(key: string): boolean | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: boolean): void {
    this.cache.set(key, { value, expiry: Date.now() + this.ttl });
  }

  clear(): void {
    this.cache.clear();
  }
}
