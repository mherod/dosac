"use client";

import { useEffect, useRef } from "react";

interface LiveRegionProps {
  message: string;
  priority?: "polite" | "assertive";
  clearAfter?: number;
}

/**
 * Live region component for screen reader announcements
 * Provides dynamic content updates to assistive technologies
 */
export function LiveRegion({
  message,
  priority = "polite",
  clearAfter = 5000,
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message || !regionRef.current) return;

    // Announce the message
    regionRef.current.textContent = message;

    // Clear after timeout if specified
    if (clearAfter > 0) {
      const timeout = setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = "";
        }
      }, clearAfter);

      return () => clearTimeout(timeout);
    }
  }, [message, clearAfter]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    />
  );
}

/**
 * Hook for managing live region announcements
 */
export function useLiveRegion() {
  const announce = (
    message: string,
    priority: "polite" | "assertive" = "polite",
  ) => {
    // Create a live region element if it doesn't exist
    let liveRegion = document.getElementById("live-region");

    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "live-region";
      liveRegion.setAttribute("role", "status");
      liveRegion.setAttribute("aria-live", priority);
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.className = "sr-only";
      document.body.appendChild(liveRegion);
    }

    // Update priority if needed
    liveRegion.setAttribute("aria-live", priority);

    // Announce the message
    liveRegion.textContent = message;

    // Clear after delay
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = "";
      }
    }, 5000);
  };

  return { announce };
}
