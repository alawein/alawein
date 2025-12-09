// PWA and service worker utilities

export class PWAManager {
  private static instance: PWAManager;
  private swRegistration: ServiceWorkerRegistration | null = null;

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return false;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', this.swRegistration);
      
      // Listen for updates
      this.swRegistration.addEventListener('updatefound', () => {
        const newWorker = this.swRegistration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              this.notifyUpdate();
            }
          });
        }
      });

      return true;
    } catch (error) {
      console.error('SW registration failed:', error);
      return false;
    }
  }

  private notifyUpdate() {
    // Simple notification - could be enhanced with a toast
    if (confirm('New version available! Reload to update?')) {
      window.location.reload();
    }
  }

  async checkOnlineStatus(): Promise<boolean> {
    if (!navigator.onLine) return false;
    
    try {
      await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' });
      return true;
    } catch {
      return false;
    }
  }

  getInstallPrompt(): any {
    return (window as any).deferredPrompt;
  }

  async installApp(): Promise<boolean> {
    const deferredPrompt = this.getInstallPrompt();
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      return result.outcome === 'accepted';
    } catch {
      return false;
    }
  }
}

export const pwaManager = PWAManager.getInstance();

// React hooks for PWA functionality
import { useState, useEffect } from 'react';

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    
    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      return result.outcome === 'accepted';
    } catch {
      return false;
    }
  };

  return { isInstallable, isInstalled, installPWA };
}

export function useServiceWorker() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get existing registration
    navigator.serviceWorker.getRegistration().then(setRegistration);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateServiceWorker = async () => {
    if (registration) {
      await registration.update();
      window.location.reload();
    }
  };

  return { isOnline, updateAvailable, updateServiceWorker };
}