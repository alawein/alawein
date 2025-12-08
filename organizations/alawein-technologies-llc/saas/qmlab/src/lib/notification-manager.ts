// Advanced notification manager for QMLab
// Handles push notifications, background sync, and user engagement

import { trackQuantumEvents } from './analytics';
import { NotificationAction } from './simple-stubs';

interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
  data?: any;
}

interface QuantumNotification extends NotificationConfig {
  type: 'training_complete' | 'simulation_ready' | 'circuit_shared' | 'achievement' | 'reminder';
  quantum_data?: {
    circuitId?: string;
    trainingId?: string;
    accuracy?: number;
    duration?: number;
  };
}

// Background sync queue for offline operations
interface QueuedOperation {
  id: string;
  type: 'training' | 'simulation' | 'sharing' | 'analytics';
  data: any;
  timestamp: number;
  retryCount: number;
  priority: 'low' | 'medium' | 'high';
}

export class NotificationManager {
  private registration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';
  private subscription: PushSubscription | null = null;
  private syncQueue: QueuedOperation[] = [];
  private isInitialized = false;

  // VAPID public key for push notifications (would be from server)
  private readonly vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY';

  async init(swRegistration?: ServiceWorkerRegistration): Promise<boolean> {
    try {
      // Check notification support
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
      }

      // Get service worker registration
      if (swRegistration) {
        this.registration = swRegistration;
      } else if ('serviceWorker' in navigator) {
        this.registration = await navigator.serviceWorker.ready;
      }

      // Get current permission status
      this.permission = Notification.permission;

      // Initialize push subscription if permission granted
      if (this.permission === 'granted') {
        await this.initializePushSubscription();
      }

      // Load sync queue from storage
      await this.loadSyncQueue();

      this.isInitialized = true;
      trackQuantumEvents.featureDiscovery('notification_manager_initialized');

      console.log('✅ Notification Manager initialized');
      return true;

    } catch (error) {
      console.error('❌ Notification Manager initialization failed:', error);
      return false;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    try {
      if (this.permission === 'granted') {
        return true;
      }

      const permission = await Notification.requestPermission();
      this.permission = permission;

      if (permission === 'granted') {
        await this.initializePushSubscription();
        trackQuantumEvents.featureDiscovery('notification_permission_granted');
        return true;
      } else {
        trackQuantumEvents.featureDiscovery('notification_permission_denied');
        return false;
      }

    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  // Initialize push subscription
  private async initializePushSubscription(): Promise<void> {
    if (!this.registration || !this.registration.pushManager) {
      return;
    }

    try {
      // Check for existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();

      if (!this.subscription) {
        // Create new subscription
        this.subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
        });

        // Send subscription to server
        await this.sendSubscriptionToServer(this.subscription);
      }

      trackQuantumEvents.featureDiscovery('push_subscription_initialized');

    } catch (error) {
      console.error('Failed to initialize push subscription:', error);
    }
  }

  // Send push subscription to server
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });

      trackQuantumEvents.featureDiscovery('push_subscription_registered');

    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  // Show local notification
  async showNotification(config: QuantumNotification): Promise<boolean> {
    if (this.permission !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    try {
      const notificationOptions: NotificationOptions & { actions?: NotificationAction[] } = {
        body: config.body,
        icon: config.icon || '/favicon.svg',
        badge: config.badge || '/favicon.ico',
        tag: config.tag || config.type,
        requireInteraction: config.requireInteraction || false,
        data: {
          ...config.data,
          quantum_data: config.quantum_data,
          type: config.type,
          timestamp: Date.now()
        }
      };

      // Add quantum-specific actions
      if (config.type === 'training_complete') {
        notificationOptions.actions = [
          {
            action: 'view_results',
            title: 'View Results',
            icon: '/icons/view.svg'
          },
          {
            action: 'share_results',
            title: 'Share',
            icon: '/icons/share.svg'
          }
        ];
      } else if (config.type === 'simulation_ready') {
        notificationOptions.actions = [
          {
            action: 'view_simulation',
            title: 'View Simulation',
            icon: '/icons/play.svg'
          },
          {
            action: 'run_again',
            title: 'Run Again',
            icon: '/icons/refresh.svg'
          }
        ];
      }

      // Show notification via service worker if available
      if (this.registration) {
        await this.registration.showNotification(config.title, notificationOptions);
      } else {
        new Notification(config.title, notificationOptions);
      }

      trackQuantumEvents.featureDiscovery('notification_shown');

      return true;

    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }

  // Queue operation for background sync
  async queueOperation(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retryCount'>): Promise<string> {
    const queuedOp: QueuedOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retryCount: 0
    };

    this.syncQueue.push(queuedOp);
    await this.saveSyncQueue();

    // Register background sync
    if (this.registration && 'sync' in this.registration) {
      try {
        const syncManager = (this.registration as any).sync;
        if (syncManager && typeof syncManager.register === 'function') {
          await syncManager.register(`quantum-${operation.type}`);
          trackQuantumEvents.featureDiscovery('background_sync_registered');
        }
      } catch (error) {
        console.error('Failed to register background sync:', error);
      }
    }

    return queuedOp.id;
  }

  // Process sync queue (called by service worker)
  async processSyncQueue(tag: string): Promise<void> {
    const operationType = tag.replace('quantum-', '');
    const operations = this.syncQueue.filter(op => op.type === operationType);

    for (const operation of operations) {
      try {
        await this.processOperation(operation);
        
        // Remove successful operation from queue
        this.syncQueue = this.syncQueue.filter(op => op.id !== operation.id);
        
        trackQuantumEvents.featureDiscovery('background_sync_completed');

      } catch (error) {
        console.error(`Failed to process ${operation.type} operation:`, error);
        
        // Increment retry count
        operation.retryCount++;
        
        // Remove operation if too many retries
        if (operation.retryCount > 3) {
          this.syncQueue = this.syncQueue.filter(op => op.id !== operation.id);
          
          trackQuantumEvents.errorBoundary(
            `Background sync failed after retries: ${operation.type}`,
            (error as Error).stack || 'No stack trace',
            'background-sync'
          );
        }
      }
    }

    await this.saveSyncQueue();
  }

  // Process individual operation
  private async processOperation(operation: QueuedOperation): Promise<void> {
    switch (operation.type) {
      case 'training':
        await this.processTrainingOperation(operation);
        break;
      case 'simulation':
        await this.processSimulationOperation(operation);
        break;
      case 'sharing':
        await this.processSharingOperation(operation);
        break;
      case 'analytics':
        await this.processAnalyticsOperation(operation);
        break;
      default:
        throw new Error(`Unknown operation type: ${operation.type}`);
    }
  }

  // Process training operation
  private async processTrainingOperation(operation: QueuedOperation): Promise<void> {
    const { circuitConfig, trainingParams } = operation.data;

    const response = await fetch('/api/quantum/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        circuit: circuitConfig,
        params: trainingParams,
        background: true
      })
    });

    if (!response.ok) {
      throw new Error(`Training request failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Show completion notification
    await this.showNotification({
      type: 'training_complete',
      title: 'Quantum Training Complete!',
      body: `Training finished with ${result.accuracy}% accuracy`,
      requireInteraction: true,
      quantum_data: {
        trainingId: result.id,
        accuracy: result.accuracy,
        duration: result.duration
      }
    });
  }

  // Process simulation operation
  private async processSimulationOperation(operation: QueuedOperation): Promise<void> {
    const { circuitConfig, simulationParams } = operation.data;

    const response = await fetch('/api/quantum/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        circuit: circuitConfig,
        params: simulationParams,
        background: true
      })
    });

    if (!response.ok) {
      throw new Error(`Simulation request failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Show completion notification
    await this.showNotification({
      type: 'simulation_ready',
      title: 'Quantum Simulation Ready',
      body: 'Your simulation has completed successfully',
      quantum_data: {
        circuitId: result.circuitId
      }
    });
  }

  // Process sharing operation
  private async processSharingOperation(operation: QueuedOperation): Promise<void> {
    const { shareData } = operation.data;

    const response = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shareData)
    });

    if (!response.ok) {
      throw new Error(`Sharing request failed: ${response.statusText}`);
    }

    // Show success notification
    await this.showNotification({
      type: 'circuit_shared',
      title: 'Circuit Shared!',
      body: 'Your quantum circuit has been shared successfully'
    });
  }

  // Process analytics operation
  private async processAnalyticsOperation(operation: QueuedOperation): Promise<void> {
    const { events } = operation.data;

    const response = await fetch('/api/analytics/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events })
    });

    if (!response.ok) {
      throw new Error(`Analytics request failed: ${response.statusText}`);
    }
  }

  // Utility methods
  private urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray as Uint8Array<ArrayBuffer>;
  }

  private async saveSyncQueue(): Promise<void> {
    try {
      localStorage.setItem('qmlab-sync-queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  private async loadSyncQueue(): Promise<void> {
    try {
      const saved = localStorage.getItem('qmlab-sync-queue');
      if (saved) {
        this.syncQueue = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      this.syncQueue = [];
    }
  }

  // Public getters
  get hasPermission(): boolean {
    return this.permission === 'granted';
  }

  get isReady(): boolean {
    return this.isInitialized && this.permission === 'granted';
  }

  get queueSize(): number {
    return this.syncQueue.length;
  }
}

// Global notification manager instance
export const notificationManager = new NotificationManager();