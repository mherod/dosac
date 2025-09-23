import { AlertTriangle, WifiOff } from "lucide-react";
import Link from "next/link";

/**
 * Offline fallback page
 * Shown when user is offline and tries to access uncached content
 */
export default function OfflinePage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <WifiOff className="h-24 w-24 text-yellow-600" />
        </div>

        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          You're Offline
        </h1>

        <p className="mb-8 text-xl text-gray-600">
          It seems you've lost your internet connection. Some content may not be
          available.
        </p>

        <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-start">
            <AlertTriangle className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-yellow-600" />
            <div className="text-left">
              <h2 className="mb-2 text-lg font-semibold text-yellow-900">
                Limited Functionality
              </h2>
              <p className="text-yellow-800">
                While offline, you can still browse previously viewed pages that
                have been cached. New content and search functionality will be
                available once you're back online.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            What you can do:
          </h3>
          <ul className="inline-block space-y-2 text-left text-gray-700">
            <li>• Browse previously viewed pages</li>
            <li>• View cached images and content</li>
            <li>• Access your browser history</li>
          </ul>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Try Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

// Force static generation
export const dynamic = "force-static";
