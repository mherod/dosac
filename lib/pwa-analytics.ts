/**
 * PWA Analytics utilities for tracking PWA-specific events
 */

/**
 * Track PWA installation
 */
export function trackPWAInstall(): void {
  if (typeof window === "undefined") return;

  // Custom analytics
  console.log("PWA: Installation tracked");
}

/**
 * Track PWA install prompt shown
 */
export function trackPWAInstallPromptShown(): void {
  if (typeof window === "undefined") return;

  console.log("PWA: Install prompt shown tracked");
}

/**
 * Track PWA install prompt dismissed
 */
export function trackPWAInstallPromptDismissed(): void {
  if (typeof window === "undefined") return;

  console.log("PWA: Install prompt dismissed tracked");
}

/**
 * Track PWA update available
 */
export function trackPWAUpdateAvailable(): void {
  if (typeof window === "undefined") return;

  console.log("PWA: Update available tracked");
}

/**
 * Track PWA update applied
 */
export function trackPWAUpdateApplied(): void {
  if (typeof window === "undefined") return;

  console.log("PWA: Update applied tracked");
}

/**
 * Track offline usage
 */
export function trackOfflineUsage(): void {
  if (typeof window === "undefined") return;

  console.log("PWA: Offline usage tracked");
}

/**
 * Track PWA display mode
 */
export function trackPWADisplayMode(): void {
  if (typeof window === "undefined") return;

  const displayMode = getPWADisplayMode();
  console.log("PWA: Display mode tracked:", displayMode);
}

/**
 * Get PWA display mode
 */
function getPWADisplayMode(): string {
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
 * Track service worker registration
 */
export function trackServiceWorkerRegistration(success: boolean): void {
  if (typeof window === "undefined") return;

  console.log("PWA: Service worker registration tracked:", success);
}

/**
 * Track cache hit/miss
 */
export function trackCacheHit(hit: boolean, resourceType: string): void {
  if (typeof window === "undefined") return;

  console.log("PWA: Cache performance tracked:", { hit, resourceType });
}
