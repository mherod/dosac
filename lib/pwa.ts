/**
 * PWA utilities for service worker registration and management
 */

/**
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.log("Service Worker not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered successfully:", registration);

    // Handle updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New content is available, notify user
            if (confirm("New version available! Reload to update?")) {
              window.location.reload();
            }
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister()),
    );
    console.log("Service Worker unregistered");
    return true;
  } catch (error) {
    console.error("Service Worker unregistration failed:", error);
    return false;
  }
}

/**
 * Check if the app is running as a PWA
 */
export function isPWA(): boolean {
  if (typeof window === "undefined") return false;

  const standalone = window.matchMedia("(display-mode: standalone)").matches;
  const inApp = (window.navigator as any).standalone === true;

  return standalone || inApp;
}

/**
 * Check if the app is installed
 */
export function isAppInstalled(): boolean {
  return isPWA();
}

/**
 * Get PWA display mode
 */
export function getPWADisplayMode(): string {
  if (typeof window === "undefined") return "browser";

  if (window.matchMedia("(display-mode: standalone)").matches) {
    return "standalone";
  }

  if (window.matchMedia("(display-mode: minimal-ui)").matches) {
    return "minimal-ui";
  }

  if (window.matchMedia("(display-mode: fullscreen)").matches) {
    return "fullscreen";
  }

  return "browser";
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Send a notification
 */
export function sendNotification(
  title: string,
  options?: NotificationOptions,
): void {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: "/pwa-icon-192x192.png",
      badge: "/favicon-32x32.png",
      ...options,
    });
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    console.log("Push subscription successful:", subscription);
    return subscription;
  } catch (error) {
    console.error("Push subscription failed:", error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log("Push unsubscription successful");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Push unsubscription failed:", error);
    return false;
  }
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;

  return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * Get service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error("Failed to get service worker registration:", error);
    return null;
  }
}
