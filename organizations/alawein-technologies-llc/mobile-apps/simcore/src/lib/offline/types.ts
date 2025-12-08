/**
 * Offline mode types for SimCore physics simulation platform
 */

export type ConnectionStatus = "online" | "offline" | "slow";

export type SyncStatus = "synced" | "pending" | "syncing" | "error";

export interface OfflineState {
  isOnline: boolean;
  connectionStatus: ConnectionStatus;
  lastOnlineAt: string | null;
  pendingSyncCount: number;
}

export interface SyncableEntity {
  id: string;
  type: EntityType;
  data: unknown;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  syncError?: string;
  localVersion: number;
  serverVersion?: number;
}

export type EntityType =
  | "simulation"
  | "simulation_result"
  | "user_settings"
  | "saved_state"
  | "export_data";

export interface SimulationState {
  id: string;
  moduleId: string;
  moduleName: string;
  parameters: Record<string, unknown>;
  results?: SimulationResult;
  savedAt: string;
  thumbnail?: string;
}

export interface SimulationResult {
  id: string;
  simulationId: string;
  data: unknown;
  computedAt: string;
  duration: number; // ms
}

export interface OfflineStorageQuota {
  usage: number;
  quota: number;
  percentUsed: number;
}

export interface SyncQueueItem {
  id: string;
  entity: SyncableEntity;
  action: "create" | "update" | "delete";
  attempts: number;
  lastAttempt?: string;
  priority: number;
}

export interface OfflineConfig {
  enableOfflineMode: boolean;
  maxStorageBytes: number;
  syncIntervalMs: number;
  maxRetries: number;
  prioritizeRecent: boolean;
}

export interface ConflictResolution {
  entityId: string;
  localVersion: SyncableEntity;
  serverVersion: SyncableEntity;
  resolution: "keep_local" | "keep_server" | "merge";
  resolvedAt: string;
}

