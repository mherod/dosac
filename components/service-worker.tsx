"use client";

import { useEffect } from "react";

/**
 * Component to register and manage the service worker
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      // Register service worker
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker registered:", registration);

          // Check for updates periodically
          setInterval(
            () => {
              registration.update();
            },
            60 * 60 * 1000,
          ); // Check every hour

          // Handle updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New content is available
                  if (confirm("New content available! Reload to update?")) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      };

      void registerSW();

      // Handle offline/online events
      window.addEventListener("online", () => {
        console.log("Back online");
      });

      window.addEventListener("offline", () => {
        console.log("Gone offline");
      });
    }
  }, []);

  return null;
}
