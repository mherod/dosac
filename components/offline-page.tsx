"use client";

import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Offline Page Component
 * Shown when the user is offline and no cached content is available
 */
export function OfflinePage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f2f1] px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <WifiOff className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">
            You're Offline
          </h1>
          <p className="leading-relaxed text-slate-600">
            It looks like you're not connected to the internet. Some content may
            not be available while offline.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </button>

          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            What you can do offline:
          </h3>
          <ul className="space-y-2 text-left text-sm text-slate-600">
            <li className="flex items-start">
              <span className="mr-3 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
              View previously loaded memes and quotes
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
              Browse cached character profiles
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
              Access episode information
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
              Use the app's basic features
            </li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          <p>
            DOSAC.UK works offline thanks to Progressive Web App technology.
            Connect to the internet to access the latest content.
          </p>
        </div>
      </div>
    </div>
  );
}
