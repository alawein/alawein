import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNotificationStore } from './store';

describe('createNotificationStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a store with empty initial state', () => {
    const store = createNotificationStore();
    expect(store.state.notifications).toEqual([]);
    expect(store.state.unreadCount).toBe(0);
  });

  describe('add', () => {
    it('adds a notification with default values', () => {
      const store = createNotificationStore();
      const id = store.add('Test Title', 'Test message');

      expect(id).toMatch(/^notif-/);
      expect(store.state.notifications).toHaveLength(1);
      expect(store.state.notifications[0].title).toBe('Test Title');
      expect(store.state.notifications[0].message).toBe('Test message');
      expect(store.state.notifications[0].type).toBe('info');
      expect(store.state.notifications[0].read).toBe(false);
      expect(store.state.unreadCount).toBe(1);
    });

    it('adds a notification with custom options', () => {
      const store = createNotificationStore();
      store.add('Success!', 'Operation completed', {
        type: 'success',
        priority: 'high',
        duration: 10000,
      });

      expect(store.state.notifications[0].type).toBe('success');
      expect(store.state.notifications[0].priority).toBe('high');
      expect(store.state.notifications[0].duration).toBe(10000);
    });

    it('respects maxNotifications config', () => {
      const store = createNotificationStore({ maxNotifications: 3 });
      store.add('Notification 1');
      store.add('Notification 2');
      store.add('Notification 3');
      store.add('Notification 4');

      expect(store.state.notifications).toHaveLength(3);
      expect(store.state.notifications[0].title).toBe('Notification 4');
    });
  });

  describe('remove', () => {
    it('removes a notification by id', () => {
      const store = createNotificationStore();
      const id = store.add('Test');
      expect(store.state.notifications).toHaveLength(1);

      store.remove(id);
      expect(store.state.notifications).toHaveLength(0);
    });

    it('decrements unread count when removing unread notification', () => {
      const store = createNotificationStore();
      const id = store.add('Test');
      expect(store.state.unreadCount).toBe(1);

      store.remove(id);
      expect(store.state.unreadCount).toBe(0);
    });

    it('does not decrement unread count when removing read notification', () => {
      const store = createNotificationStore();
      const id = store.add('Test');
      store.markAsRead(id);
      expect(store.state.unreadCount).toBe(0);

      store.remove(id);
      expect(store.state.unreadCount).toBe(0);
    });
  });

  describe('markAsRead', () => {
    it('marks a notification as read', () => {
      const store = createNotificationStore();
      const id = store.add('Test');
      expect(store.state.notifications[0].read).toBe(false);

      store.markAsRead(id);
      expect(store.state.notifications[0].read).toBe(true);
      expect(store.state.unreadCount).toBe(0);
    });

    it('does nothing for already read notifications', () => {
      const store = createNotificationStore();
      const id = store.add('Test');
      store.markAsRead(id);
      store.markAsRead(id);
      expect(store.state.unreadCount).toBe(0);
    });
  });

  describe('markAllAsRead', () => {
    it('marks all notifications as read', () => {
      const store = createNotificationStore();
      store.add('Test 1');
      store.add('Test 2');
      store.add('Test 3');
      expect(store.state.unreadCount).toBe(3);

      store.markAllAsRead();
      expect(store.state.unreadCount).toBe(0);
      expect(store.state.notifications.every((n) => n.read)).toBe(true);
    });
  });

  describe('clear', () => {
    it('removes all notifications', () => {
      const store = createNotificationStore();
      store.add('Test 1');
      store.add('Test 2');
      expect(store.state.notifications).toHaveLength(2);

      store.clear();
      expect(store.state.notifications).toHaveLength(0);
      expect(store.state.unreadCount).toBe(0);
    });
  });

  describe('subscribe', () => {
    it('notifies listeners on state changes', () => {
      const store = createNotificationStore();
      const listener = vi.fn();
      store.subscribe(listener);

      store.add('Test');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(store.state);
    });

    it('returns unsubscribe function', () => {
      const store = createNotificationStore();
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      store.add('Test 1');
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      store.add('Test 2');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});

