"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";

/**
 * PWA Update Notification Component
 * Shows when a new version of the app is available
 */
export function PWAUpdateNotification(): React.ReactElement | null {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setShowUpdate(true);
    };

    // Listen for PWA update events
    window.addEventListener("pwa-update-available", handleUpdateAvailable);

    return () => {
      window.removeEventListener("pwa-update-available", handleUpdateAvailable);
    };
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed left-4 right-4 top-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-lg">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
              <RefreshCw className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                Update Available
              </h3>
              <p className="text-xs text-blue-700">
                A new version of DOSAC.UK is ready
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-blue-400 transition-colors hover:text-blue-600"
            aria-label="Dismiss update notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            size="sm"
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-1 h-3 w-3" />
                Update Now
              </>
            )}
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Later
          </Button>
        </div>

        <p className="mt-2 text-xs text-blue-600">
          Get the latest features and improvements
        </p>
      </div>
    </div>
  );
}
