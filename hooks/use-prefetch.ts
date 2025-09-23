"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook to prefetch routes on hover or when visible in viewport
 */
export function usePrefetch() {
  const router = useRouter();
  const prefetchedUrls = useRef(new Set<string>());

  useEffect(() => {
    // Prefetch on hover with debounce
    let hoverTimeout: NodeJS.Timeout;

    const handleHover = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("/") || prefetchedUrls.current.has(href)) {
        return;
      }

      // Debounce prefetch to avoid excessive requests
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        router.prefetch(href);
        prefetchedUrls.current.add(href);
      }, 100);
    };

    // Prefetch visible links in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            const href = link.getAttribute("href");

            if (
              href &&
              href.startsWith("/") &&
              !prefetchedUrls.current.has(href)
            ) {
              router.prefetch(href);
              prefetchedUrls.current.add(href);
              observer.unobserve(link);
            }
          }
        });
      },
      {
        rootMargin: "50px", // Start prefetching 50px before entering viewport
      },
    );

    // Add event listeners
    document.addEventListener("mouseover", handleHover);

    // Observe all internal links
    const links = document.querySelectorAll("a[href^='/']");
    links.forEach((link) => observer.observe(link));

    return () => {
      document.removeEventListener("mouseover", handleHover);
      clearTimeout(hoverTimeout);
      observer.disconnect();
    };
  }, [router]);
}

/**
 * Hook to prefetch specific routes based on user patterns
 */
export function usePrefetchPatterns() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch common navigation patterns
    const commonRoutes = ["/series/1", "/series/2", "/profiles", "/categories"];

    // Delay prefetching to prioritize initial page load
    const timeout = setTimeout(() => {
      commonRoutes.forEach((route) => {
        router.prefetch(route);
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);
}
