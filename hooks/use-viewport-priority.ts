"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Hook to determine if an element should have priority loading based on viewport visibility
 * Uses Intersection Observer for efficient viewport detection
 */
export function useViewportPriority(threshold = 0.1) {
  const [isNearViewport, setIsNearViewport] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Use IntersectionObserver with a larger rootMargin to preload images before they're visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsNearViewport(entry.isIntersecting);
        }
      },
      {
        threshold,
        // Preload images 50% before they enter viewport
        rootMargin: "50% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { elementRef, isNearViewport };
}
