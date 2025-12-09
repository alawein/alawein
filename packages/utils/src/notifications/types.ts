/**
 * Cross-platform notification types
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'achievement';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  priority?: NotificationPriority;
  duration?: number;
  dismissible?: boolean;
  action?: NotificationAction;
  timestamp: Date;
  read: boolean;
  metadata?: Record<string, unknown>;
}

export interface NotificationOptions {
  type?: NotificationType;
  priority?: NotificationPriority;
  duration?: number;
  dismissible?: boolean;
  action?: NotificationAction;
  metadata?: Record<string, unknown>;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

export interface NotificationStore {
  state: NotificationState;
  add: (title: string, message?: string, options?: NotificationOptions) => string;
  remove: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clear: () => void;
  subscribe: (listener: (state: NotificationState) => void) => () => void;
}

export interface NotificationConfig {
  maxNotifications?: number;
  defaultDuration?: number;
  defaultDismissible?: boolean;
  persistToStorage?: boolean;
  storageKey?: string;
}

export const DEFAULT_CONFIG: NotificationConfig = {
  maxNotifications: 50,
  defaultDuration: 5000,
  defaultDismissible: true,
  persistToStorage: false,
  storageKey: 'alawein_notifications',
};

