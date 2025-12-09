/**
 * Hook for managing offline state and synchronization
 */

import { useState, useEffect, useCallback } from "react";
import { offlineStorage, STORES } from "../lib/offline/storage";
import { syncManager } from "../lib/offline/sync-manager";
import type { OfflineState, ConnectionStatus, SimulationState, OfflineStorageQuota } from "../lib/offline/types";

export function useOffline() {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    connectionStatus: navigator.onLine ? "online" : "offline",
    lastOnlineAt: null,
    pendingSyncCount: 0,
  });

  const [storageQuota, setStorageQuota] = useState<OfflineStorageQuota>({
    usage: 0,
    quota: 0,
    percentUsed: 0,
  });

  // Monitor connection status
  useEffect(() => {
    const updateConnectionStatus = async () => {
      const isOnline = navigator.onLine;

      // Check connection quality
      let connectionStatus: ConnectionStatus = isOnline ? "online" : "offline";
      if (isOnline && "connection" in navigator) {
        const conn = (navigator as Navigator & { connection?: { effectiveType: string } }).connection;
        if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") {
          connectionStatus = "slow";
        }
      }

      const pendingSyncCount = await syncManager.getPendingCount();

      setState((prev) => ({
        ...prev,
        isOnline,
        connectionStatus,
        lastOnlineAt: isOnline ? new Date().toISOString() : prev.lastOnlineAt,
        pendingSyncCount,
      }));
    };

    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);

    // Initial check
    updateConnectionStatus();

    // Subscribe to sync events
    const unsubscribe = syncManager.subscribe(async (event) => {
      if (event.type === "sync_complete") {
        const pendingSyncCount = await syncManager.getPendingCount();
        setState((prev) => ({ ...prev, pendingSyncCount }));
      }
    });

    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
      unsubscribe();
    };
  }, []);

  // Monitor storage quota
  useEffect(() => {
    const checkQuota = async () => {
      const quota = await offlineStorage.getStorageQuota();
      setStorageQuota(quota);
    };

    checkQuota();
    const interval = setInterval(checkQuota, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Start auto-sync
  useEffect(() => {
    syncManager.startAutoSync(30000);
    return () => syncManager.stopAutoSync();
  }, []);

  const syncNow = useCallback(async () => {
    return syncManager.sync();
  }, []);

  const saveSimulation = useCallback(async (simulation: SimulationState) => {
    const entity = {
      id: simulation.id,
      type: "simulation" as const,
      data: simulation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: state.isOnline ? "pending" as const : "pending" as const,
      localVersion: 1,
    };

    await offlineStorage.save(STORES.simulations, entity);
    await syncManager.addToQueue(entity, "create");

    if (state.isOnline) {
      syncManager.sync();
    }
  }, [state.isOnline]);

  const getSavedSimulations = useCallback(async (): Promise<SimulationState[]> => {
    const entities = await offlineStorage.getAll(STORES.simulations);
    return entities.map((e: { data: SimulationState }) => e.data);
  }, []);

  const deleteSimulation = useCallback(async (id: string) => {
    const entity = await offlineStorage.get(STORES.simulations, id);
    if (entity) {
      await offlineStorage.delete(STORES.simulations, id);
      await syncManager.addToQueue(entity as { id: string; type: "simulation"; data: unknown; createdAt: string; updatedAt: string; syncStatus: "synced" | "pending" | "syncing" | "error"; localVersion: number }, "delete");
    }
  }, []);

  return {
    ...state,
    storageQuota,
    syncNow,
    saveSimulation,
    getSavedSimulations,
    deleteSimulation,
  };
}

