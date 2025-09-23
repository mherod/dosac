"use client";

interface ErrorInfo {
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  userAgent?: string;
  timestamp: number;
  severity: "low" | "medium" | "high" | "critical";
  context?: Record<string, any>;
}

/**
 * Custom error tracking service
 * Can be integrated with Sentry, LogRocket, or custom backend
 */
class ErrorTracker {
  private queue: ErrorInfo[] = [];
  private flushTimeout: NodeJS.Timeout | null = null;
  private maxQueueSize = 10;
  private flushDelay = 5000; // 5 seconds

  constructor() {
    if (typeof window !== "undefined") {
      this.setupGlobalHandlers();
      this.setupPerformanceMonitoring();
    }
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers() {
    // Handle unhandled errors
    window.addEventListener("error", (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        severity: "high",
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        severity: "high",
      });
    });
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring() {
    // Monitor long tasks
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              // Tasks longer than 50ms
              this.trackPerformance({
                type: "long-task",
                duration: entry.duration,
                timestamp: entry.startTime,
              });
            }
          }
        });
        observer.observe({ entryTypes: ["longtask"] });
      } catch (_e) {
        // Long task observer not supported
      }
    }

    // Monitor resource loading errors
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.responseStatus >= 400) {
              this.trackError({
                message: `Resource failed to load: ${resourceEntry.name}`,
                severity: "medium",
                context: {
                  status: resourceEntry.responseStatus,
                  duration: resourceEntry.duration,
                },
              });
            }
          }
        });
        observer.observe({ entryTypes: ["resource"] });
      } catch (_e) {
        // Resource timing not supported
      }
    }
  }

  /**
   * Track an error
   */
  trackError(error: Partial<ErrorInfo>) {
    const errorInfo: ErrorInfo = {
      message: error.message || "Unknown error",
      stack: error.stack,
      url: error.url || window.location.href,
      line: error.line,
      column: error.column,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      severity: error.severity || "medium",
      context: error.context,
    };

    this.queue.push(errorInfo);

    // Immediate send for critical errors
    if (errorInfo.severity === "critical") {
      this.flush();
    } else if (this.queue.length >= this.maxQueueSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: Record<string, any>) {
    // Send to analytics or monitoring service
    if (process.env.NODE_ENV === "development") {
      console.log("Performance metric:", metric);
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === "production") {
      this.sendToMonitoring("performance", metric);
    }
  }

  /**
   * Schedule a flush of the error queue
   */
  private scheduleFlush() {
    if (this.flushTimeout) return;

    this.flushTimeout = setTimeout(() => {
      this.flush();
    }, this.flushDelay);
  }

  /**
   * Flush error queue to monitoring service
   */
  private flush() {
    if (this.queue.length === 0) return;

    const errors = [...this.queue];
    this.queue = [];

    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    // Send errors to monitoring service
    this.sendToMonitoring("errors", errors);
  }

  /**
   * Send data to monitoring service
   */
  private sendToMonitoring(type: string, data: any) {
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      const payload = JSON.stringify({
        type,
        data,
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: this.getSessionId(),
      });

      navigator.sendBeacon("/api/monitoring", payload);
    } else {
      // Fallback to fetch
      fetch("/api/monitoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
        keepalive: true,
      }).catch(() => {
        // Silently fail
      });
    }
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    const key = "error-tracking-session";
    let sessionId = sessionStorage.getItem(key);

    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(key, sessionId);
    }

    return sessionId;
  }

  /**
   * Manual error reporting
   */
  report(message: string, context?: Record<string, any>) {
    this.trackError({
      message,
      context,
      severity: "low",
    });
  }
}

// Export singleton instance
export const errorTracker =
  typeof window !== "undefined" ? new ErrorTracker() : null;

/**
 * React error boundary integration
 */
export function reportErrorToBoundary(
  error: Error,
  errorInfo: React.ErrorInfo,
) {
  if (errorTracker) {
    errorTracker.trackError({
      message: error.message,
      stack: error.stack,
      severity: "high",
      context: {
        componentStack: errorInfo.componentStack,
      },
    });
  }
}
