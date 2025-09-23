"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Component to monitor and report Core Web Vitals
 * Tracks LCP, FID, CLS, FCP, and TTFB metrics
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(metric);
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === "production") {
      // Example: Send to Google Analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", metric.name, {
          value: Math.round(
            metric.name === "CLS" ? metric.value * 1000 : metric.value,
          ),
          event_label: metric.id,
          non_interaction: true,
        });
      }

      // Example: Send to custom analytics endpoint
      const body = JSON.stringify({
        metric: metric.name,
        value: metric.value,
        id: metric.id,
        navigationType: metric.navigationType,
        url: window.location.href,
        timestamp: Date.now(),
      });

      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics", body);
      }
    }

    // Alert on poor performance in development
    if (process.env.NODE_ENV === "development") {
      // Define thresholds based on Google's recommendations
      const thresholds = {
        FCP: 1800, // First Contentful Paint
        LCP: 2500, // Largest Contentful Paint
        CLS: 0.1, // Cumulative Layout Shift
        FID: 100, // First Input Delay
        TTFB: 800, // Time to First Byte
      };

      const threshold = thresholds[metric.name as keyof typeof thresholds];
      if (threshold && metric.value > threshold) {
        console.warn(
          `⚠️ Poor ${metric.name} performance: ${metric.value.toFixed(2)}ms (threshold: ${threshold}ms)`,
        );
      }
    }
  });

  return null;
}

/**
 * Hook to prefetch routes based on viewport visibility
 */
export function usePrefetchVisibleLinks() {
  if (typeof window === "undefined") return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const href = link.getAttribute("href");
          if (href && href.startsWith("/")) {
            // Prefetch the route
            void import("next/router").then(({ default: router }) => {
              router.prefetch(href);
              return null;
            });
          }
        }
      });
    },
    {
      rootMargin: "50px",
    },
  );

  // Observe all internal links
  document.querySelectorAll("a[href^='/']").forEach((link) => {
    observer.observe(link);
  });

  return () => observer.disconnect();
}
