import { NextRequest, NextResponse } from "next/server";

// Use Edge Runtime for better performance
export const runtime = "edge";

interface MonitoringData {
  type: "errors" | "performance" | "analytics";
  data: any;
  timestamp: number;
  url: string;
  sessionId: string;
}

/**
 * API endpoint for error tracking and monitoring
 * Receives errors and performance metrics from the client
 */
export async function POST(request: NextRequest) {
  try {
    const data: MonitoringData = await request.json();

    // Validate the data
    if (!data.type || !data.data) {
      return NextResponse.json(
        { error: "Invalid monitoring data" },
        { status: 400 },
      );
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[${data.type.toUpperCase()}]`, data);
    }

    // In production, forward to external monitoring service
    if (process.env.NODE_ENV === "production") {
      // Forward to Sentry, LogRocket, or custom service
      if (process.env.SENTRY_DSN) {
        await forwardToSentry(data);
      }

      // Log critical errors
      if (data.type === "errors") {
        await logCriticalErrors(data);
      }
    }

    // Store metrics for analysis
    await storeMetrics(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Monitoring endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Forward errors to Sentry
 */
async function forwardToSentry(data: MonitoringData) {
  if (data.type !== "errors") return;

  // Format for Sentry
  const sentryPayload = {
    dsn: process.env.SENTRY_DSN,
    errors: data.data,
    tags: {
      url: data.url,
      sessionId: data.sessionId,
    },
    timestamp: data.timestamp,
  };

  // Send to Sentry (simplified - use Sentry SDK in production)
  try {
    await fetch("https://sentry.io/api/store/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sentry-Auth": `Sentry sentry_key=${process.env.SENTRY_KEY}`,
      },
      body: JSON.stringify(sentryPayload),
    });
  } catch (error) {
    console.error("Failed to forward to Sentry:", error);
  }
}

/**
 * Log critical errors for immediate attention
 */
async function logCriticalErrors(data: MonitoringData) {
  const errors = Array.isArray(data.data) ? data.data : [data.data];

  for (const error of errors) {
    if (error.severity === "critical" || error.severity === "high") {
      console.error("CRITICAL ERROR:", {
        message: error.message,
        stack: error.stack,
        url: data.url,
        timestamp: new Date(data.timestamp).toISOString(),
      });

      // Could also send alerts via email, Slack, etc.
    }
  }
}

/**
 * Store metrics for analysis
 */
async function storeMetrics(data: MonitoringData) {
  // In production, store in database or analytics service
  // For now, just log aggregated metrics

  if (data.type === "performance") {
    const metrics = data.data;
    console.log("Performance Metrics:", {
      url: data.url,
      timestamp: data.timestamp,
      ...metrics,
    });
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: Date.now(),
  });
}
