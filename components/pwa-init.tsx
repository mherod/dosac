"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa";

/**
 * PWA Initialization Component
 * Registers the service worker and sets up PWA functionality
 */
export function PWAInit(): React.ReactElement {
  useEffect(() => {
    const initializePWA = async () => {
      try {
        // Register service worker
        const registration = await registerServiceWorker();

        if (registration) {
          console.log("PWA: Service worker registered successfully");

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New content is available
                  console.log("PWA: New content available");

                  // You could show a toast notification here
                  if (
                    typeof window !== "undefined" &&
                    "serviceWorker" in navigator
                  ) {
                    // Dispatch a custom event that other components can listen to
                    window.dispatchEvent(
                      new CustomEvent("pwa-update-available"),
                    );
                  }
                }
              });
            }
          });
        }
      } catch (error) {
        console.error("PWA: Service worker registration failed:", error);
      }
    };

    initializePWA();

    // Handle service worker messages
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("PWA: Message from service worker:", event.data);

        // Handle different types of messages
        switch (event.data.type) {
          case "CACHE_UPDATED":
            console.log("PWA: Cache updated");
            break;
          case "OFFLINE_MODE":
            console.log("PWA: App is now offline");
            break;
          case "ONLINE_MODE":
            console.log("PWA: App is now online");
            break;
          default:
            console.log("PWA: Unknown message type:", event.data.type);
        }
      });
    }

    // Handle app installation
    const handleAppInstalled = () => {
      console.log("PWA: App installed successfully");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // This component doesn't render anything
  return <></>;
}
