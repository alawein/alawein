/**
 * Sync manager for coordinating offline/online data synchronization
 */

import { offlineStorage, STORES } from "./storage";
import type { SyncableEntity, SyncQueueItem, SyncStatus } from "./types";

type SyncEventType = "sync_start" | "sync_complete" | "sync_error" | "conflict";
type SyncListener = (event: { type: SyncEventType; data?: unknown }) => void;

class SyncManager {
  private listeners: Set<SyncListener> = new Set();
  private isSyncing = false;
  private syncInterval: ReturnType<typeof setInterval> | null = null;

  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(type: SyncEventType, data?: unknown): void {
    this.listeners.forEach((listener) => listener({ type, data }));
  }

  async addToQueue(entity: SyncableEntity, action: "create" | "update" | "delete"): Promise<void> {
    const queueItem: SyncQueueItem = {
      id: `${entity.type}-${entity.id}-${Date.now()}`,
      entity,
      action,
      attempts: 0,
      priority: action === "delete" ? 1 : action === "create" ? 2 : 3,
    };

    await offlineStorage.save(STORES.syncQueue, queueItem as unknown as SyncableEntity);
  }

  async getQueuedItems(): Promise<SyncQueueItem[]> {
    return offlineStorage.getAll<SyncQueueItem>(STORES.syncQueue);
  }

  async getPendingCount(): Promise<number> {
    const items = await this.getQueuedItems();
    return items.length;
  }

  async sync(): Promise<{ success: number; failed: number }> {
    if (this.isSyncing || !navigator.onLine) {
      return { success: 0, failed: 0 };
    }

    this.isSyncing = true;
    this.emit("sync_start");

    let success = 0;
    let failed = 0;

    try {
      const queueItems = await this.getQueuedItems();
      const sortedItems = queueItems.sort((a, b) => a.priority - b.priority);

      for (const item of sortedItems) {
        try {
          await this.syncItem(item);
          await offlineStorage.delete(STORES.syncQueue, item.id);
          success++;
        } catch (error) {
          failed++;
          item.attempts++;
          item.lastAttempt = new Date().toISOString();

          if (item.attempts < 3) {
            await offlineStorage.save(STORES.syncQueue, item as unknown as SyncableEntity);
          } else {
            // Max retries reached, mark entity as error
            const entity = item.entity;
            entity.syncStatus = "error";
            entity.syncError = error instanceof Error ? error.message : "Sync failed";
            await this.updateEntitySyncStatus(entity);
            await offlineStorage.delete(STORES.syncQueue, item.id);
          }
        }
      }

      this.emit("sync_complete", { success, failed });
    } catch (error) {
      this.emit("sync_error", error);
    } finally {
      this.isSyncing = false;
    }

    return { success, failed };
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    // Simulate API call - in production, replace with actual API calls
    const endpoint = this.getEndpoint(item.entity.type, item.action);

    const response = await fetch(endpoint, {
      method: this.getMethod(item.action),
      headers: { "Content-Type": "application/json" },
      body: item.action !== "delete" ? JSON.stringify(item.entity) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }

    // Update local entity with server version
    if (item.action !== "delete") {
      const serverData = await response.json();
      item.entity.serverVersion = serverData.version;
      item.entity.syncStatus = "synced";
      await this.updateEntitySyncStatus(item.entity);
    }
  }

  private getEndpoint(type: string, action: string): string {
    const base = "/api/sync";
    return `${base}/${type}${action === "delete" ? `/${action}` : ""}`;
  }

  private getMethod(action: "create" | "update" | "delete"): string {
    return action === "create" ? "POST" : action === "update" ? "PUT" : "DELETE";
  }

  private async updateEntitySyncStatus(entity: SyncableEntity): Promise<void> {
    const store = this.getStoreForType(entity.type);
    if (store) {
      await offlineStorage.save(store, entity);
    }
  }

  private getStoreForType(type: string): string | null {
    const mapping: Record<string, string> = {
      simulation: STORES.simulations,
      simulation_result: STORES.results,
      user_settings: STORES.settings,
    };
    return mapping[type] || null;
  }

  startAutoSync(intervalMs = 30000): void {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      if (navigator.onLine) {
        this.sync();
      }
    }, intervalMs);

    // Sync immediately when coming online
    window.addEventListener("online", () => this.sync());
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

export const syncManager = new SyncManager();

