"use client";

import { useState, useEffect } from "react";
import { WifiOff, Download } from "lucide-react";

/**
 * PWA Status Component
 * Shows connection status and PWA installation status
 */
export function PWAStatus(): React.ReactElement {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Check if app is installed/standalone
    const checkInstallStatus = () => {
      const standalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      const inApp = (window.navigator as any).standalone === true;
      setIsStandalone(standalone || inApp);
      setIsInstalled(standalone || inApp);
    };

    // Initial checks
    updateOnlineStatus();
    checkInstallStatus();

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => {
      checkInstallStatus();
    };
    mediaQuery.addEventListener("change", handleDisplayModeChange);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      mediaQuery.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  // Don't show anything if everything is normal
  if (isOnline && !isInstalled) {
    return <></>;
  }

  return (
    <div className="fixed right-4 top-4 z-40">
      <div className="flex flex-col space-y-2">
        {/* Online/Offline Status */}
        {!isOnline && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-100 px-3 py-2 text-red-700">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">Offline</span>
          </div>
        )}

        {/* PWA Installation Status */}
        {isInstalled && (
          <div className="flex items-center space-x-2 rounded-lg border border-green-200 bg-green-100 px-3 py-2 text-green-700">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isStandalone ? "App Installed" : "PWA Active"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
