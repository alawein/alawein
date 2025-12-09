/**
 * Cross-platform notification store
 * A simple, framework-agnostic notification state manager
 */

import {
  Notification,
  NotificationOptions,
  NotificationState,
  NotificationStore,
  NotificationConfig,
  DEFAULT_CONFIG,
} from './types';

function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function createNotificationStore(
  config: NotificationConfig = {}
): NotificationStore {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const listeners = new Set<(state: NotificationState) => void>();

  let state: NotificationState = {
    notifications: [],
    unreadCount: 0,
  };

  // Load from storage if enabled
  if (mergedConfig.persistToStorage && typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(mergedConfig.storageKey!);
      if (stored) {
        const parsed = JSON.parse(stored);
        state = {
          notifications: parsed.notifications.map((n: Notification) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          })),
          unreadCount: parsed.unreadCount,
        };
      }
    } catch {
      // Ignore storage errors
    }
  }

  function notify() {
    listeners.forEach((listener) => listener(state));

    // Persist to storage if enabled
    if (mergedConfig.persistToStorage && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(mergedConfig.storageKey!, JSON.stringify(state));
      } catch {
        // Ignore storage errors
      }
    }
  }

  function add(
    title: string,
    message?: string,
    options: NotificationOptions = {}
  ): string {
    const id = generateId();
    const notification: Notification = {
      id,
      type: options.type || 'info',
      title,
      message,
      priority: options.priority || 'normal',
      duration: options.duration ?? mergedConfig.defaultDuration,
      dismissible: options.dismissible ?? mergedConfig.defaultDismissible,
      action: options.action,
      timestamp: new Date(),
      read: false,
      metadata: options.metadata,
    };

    state = {
      notifications: [notification, ...state.notifications].slice(
        0,
        mergedConfig.maxNotifications
      ),
      unreadCount: state.unreadCount + 1,
    };

    notify();
    return id;
  }

  function remove(id: string): void {
    const notification = state.notifications.find((n) => n.id === id);
    if (!notification) return;

    state = {
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: notification.read
        ? state.unreadCount
        : Math.max(0, state.unreadCount - 1),
    };

    notify();
  }

  function markAsRead(id: string): void {
    const notification = state.notifications.find((n) => n.id === id);
    if (!notification || notification.read) return;

    state = {
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    };

    notify();
  }

  function markAllAsRead(): void {
    state = {
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    };

    notify();
  }

  function clear(): void {
    state = {
      notifications: [],
      unreadCount: 0,
    };

    notify();
  }

  function subscribe(
    listener: (state: NotificationState) => void
  ): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return {
    get state() {
      return state;
    },
    add,
    remove,
    markAsRead,
    markAllAsRead,
    clear,
    subscribe,
  };
}

// Default global store instance
let globalStore: NotificationStore | null = null;

export function getNotificationStore(
  config?: NotificationConfig
): NotificationStore {
  if (!globalStore) {
    globalStore = createNotificationStore(config);
  }
  return globalStore;
}

