import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private readonly platformId = inject(PLATFORM_ID);
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  // State
  isInstallable = signal(false);
  isInstalled = signal(false);
  isOnline = signal(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.init();
    }
  }

  private init(): void {
    // Check if already installed
    this.checkInstallStatus();

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      this.isInstallable.set(true);
      console.log('[PWA] Install prompt available');
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      this.isInstallable.set(false);
      this.deferredPrompt = null;
      console.log('[PWA] App installed successfully');
    });

    // Listen for online/offline status
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      console.log('[PWA] Back online');
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      console.log('[PWA] Gone offline');
    });

    // Initial online status
    this.isOnline.set(navigator.onLine);

    // Register service worker
    this.registerServiceWorker();
  }

  private checkInstallStatus(): void {
    // Check if running in standalone mode (installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    
    this.isInstalled.set(isStandalone);
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('[PWA] Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New version available');
                // Could trigger a UI prompt to refresh
              }
            });
          }
        });
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Prompt the user to install the app
   */
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log('[PWA] Install prompt outcome:', outcome);
      
      this.deferredPrompt = null;
      this.isInstallable.set(false);
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Error prompting install:', error);
      return false;
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('[PWA] Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    console.log('[PWA] Notification permission:', permission);
    return permission;
  }

  /**
   * Check if notifications are enabled
   */
  get notificationsEnabled(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  /**
   * Show a local notification
   */
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.notificationsEnabled) {
      console.log('[PWA] Notifications not enabled');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-72x72.png',
      ...options,
    });
  }
}
