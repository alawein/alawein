/**
 * Cross-platform useNotifications hook
 * React hook for managing notifications across all platforms
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Notification,
  NotificationOptions,
  NotificationState,
  NotificationConfig,
} from './types';
import { createNotificationStore, getNotificationStore } from './store';

export interface UseNotificationsOptions extends NotificationConfig {
  /** Use a local store instead of the global one */
  useLocalStore?: boolean;
}

export interface UseNotificationsReturn {
  /** Current notifications */
  notifications: Notification[];
  /** Number of unread notifications */
  unreadCount: number;
  /** Add a notification */
  notify: (title: string, message?: string, options?: NotificationOptions) => string;
  /** Add a success notification */
  success: (title: string, message?: string, options?: Omit<NotificationOptions, 'type'>) => string;
  /** Add an error notification */
  error: (title: string, message?: string, options?: Omit<NotificationOptions, 'type'>) => string;
  /** Add a warning notification */
  warning: (title: string, message?: string, options?: Omit<NotificationOptions, 'type'>) => string;
  /** Add an info notification */
  info: (title: string, message?: string, options?: Omit<NotificationOptions, 'type'>) => string;
  /** Remove a notification by ID */
  remove: (id: string) => void;
  /** Mark a notification as read */
  markAsRead: (id: string) => void;
  /** Mark all notifications as read */
  markAllAsRead: () => void;
  /** Clear all notifications */
  clear: () => void;
}

export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const { useLocalStore = false, ...config } = options;

  // Create or get the store
  const store = useMemo(() => {
    if (useLocalStore) {
      return createNotificationStore(config);
    }
    return getNotificationStore(config);
  }, [useLocalStore]);

  // Local state synced with store
  const [state, setState] = useState<NotificationState>(store.state);

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, [store]);

  // Memoized notification methods
  const notify = useCallback(
    (title: string, message?: string, opts?: NotificationOptions) => {
      return store.add(title, message, opts);
    },
    [store]
  );

  const success = useCallback(
    (title: string, message?: string, opts?: Omit<NotificationOptions, 'type'>) => {
      return store.add(title, message, { ...opts, type: 'success' });
    },
    [store]
  );

  const error = useCallback(
    (title: string, message?: string, opts?: Omit<NotificationOptions, 'type'>) => {
      return store.add(title, message, { ...opts, type: 'error' });
    },
    [store]
  );

  const warning = useCallback(
    (title: string, message?: string, opts?: Omit<NotificationOptions, 'type'>) => {
      return store.add(title, message, { ...opts, type: 'warning' });
    },
    [store]
  );

  const info = useCallback(
    (title: string, message?: string, opts?: Omit<NotificationOptions, 'type'>) => {
      return store.add(title, message, { ...opts, type: 'info' });
    },
    [store]
  );

  const remove = useCallback(
    (id: string) => {
      store.remove(id);
    },
    [store]
  );

  const markAsRead = useCallback(
    (id: string) => {
      store.markAsRead(id);
    },
    [store]
  );

  const markAllAsRead = useCallback(() => {
    store.markAllAsRead();
  }, [store]);

  const clear = useCallback(() => {
    store.clear();
  }, [store]);

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    notify,
    success,
    error,
    warning,
    info,
    remove,
    markAsRead,
    markAllAsRead,
    clear,
  };
}

