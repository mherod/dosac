"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

interface GlobalErrorProps {
  /** The error that was thrown */
  error: Error & { digest?: string };
  /** Function to reset the error boundary */
  reset: () => void;
}

/**
 * Global error boundary component
 * Handles errors in the root layout with full HTML structure
 * @param props - Component props
 * @param props.error - The error that was thrown
 * @param props.reset - Function to reset the error boundary
 * @returns Full HTML page with error display
 */
export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps): React.ReactElement {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-white">
          <div className="container mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-6 md:px-6 md:py-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>

              <h1 className="mb-4 text-3xl font-bold text-slate-900">
                Application Error
              </h1>

              <p className="mb-6 text-lg text-slate-600">
                We're sorry, but a critical error occurred. Please try
                refreshing the page.
              </p>

              {process.env.NODE_ENV === "development" && (
                <details className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                  <summary className="cursor-pointer font-medium text-red-800">
                    Error details (development only)
                  </summary>
                  <pre className="mt-3 overflow-auto text-xs text-red-700">
                    {error.message}
                    {error.stack && (
                      <>
                        {"\n\n"}
                        {error.stack}
                      </>
                    )}
                  </pre>
                </details>
              )}

              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1d70b8] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#1d70b8]/90 focus:outline-none focus:ring-2 focus:ring-[#1d70b8] focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>

              <p className="mt-4 text-sm text-slate-500">
                Error ID: {error.digest || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
