/**
 * IndexedDB storage manager for offline data persistence
 */

import type { SyncableEntity, EntityType, OfflineStorageQuota } from "./types";

const DB_NAME = "simcore-offline";
const DB_VERSION = 1;

const STORES = {
  simulations: "simulations",
  results: "results",
  settings: "settings",
  syncQueue: "syncQueue",
} as const;

class OfflineStorage {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Simulations store
        if (!db.objectStoreNames.contains(STORES.simulations)) {
          const store = db.createObjectStore(STORES.simulations, { keyPath: "id" });
          store.createIndex("moduleId", "moduleId", { unique: false });
          store.createIndex("syncStatus", "syncStatus", { unique: false });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }

        // Results store
        if (!db.objectStoreNames.contains(STORES.results)) {
          const store = db.createObjectStore(STORES.results, { keyPath: "id" });
          store.createIndex("simulationId", "simulationId", { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains(STORES.settings)) {
          db.createObjectStore(STORES.settings, { keyPath: "key" });
        }

        // Sync queue store
        if (!db.objectStoreNames.contains(STORES.syncQueue)) {
          const store = db.createObjectStore(STORES.syncQueue, { keyPath: "id" });
          store.createIndex("priority", "priority", { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  private getStore(storeName: string, mode: IDBTransactionMode = "readonly"): IDBObjectStore {
    if (!this.db) throw new Error("Database not initialized");
    return this.db.transaction(storeName, mode).objectStore(storeName);
  }

  async save<T extends SyncableEntity>(storeName: string, entity: T): Promise<void> {
    await this.init();
    const store = this.getStore(storeName, "readwrite");

    return new Promise((resolve, reject) => {
      const request = store.put(entity);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | null> {
    await this.init();
    const store = this.getStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    await this.init();
    const store = this.getStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    await this.init();
    const store = this.getStore(storeName, "readwrite");

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getByIndex<T>(storeName: string, indexName: string, value: IDBValidKey): Promise<T[]> {
    await this.init();
    const store = this.getStore(storeName);
    const index = store.index(indexName);

    return new Promise((resolve, reject) => {
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getStorageQuota(): Promise<OfflineStorageQuota> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        percentUsed: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0,
      };
    }
    return { usage: 0, quota: 0, percentUsed: 0 };
  }

  async clear(storeName: string): Promise<void> {
    await this.init();
    const store = this.getStore(storeName, "readwrite");

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();
export { STORES };

