"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { Suspense } from "react";

/**
 * Component that displays the error content with message from URL parameters
 * @returns The error content with message and home button
 */
function ErrorContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("message") || "An unknown error occurred";

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md space-y-4 p-6">
        <h1 className="text-center text-2xl font-bold text-destructive">
          Share Link Error
        </h1>
        <p className="text-center text-muted-foreground">{errorMessage}</p>
        <div className="flex justify-center">
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

/**
 * Page component for displaying share link errors
 * Wraps error content in a Suspense boundary
 * @returns The share error page with error message and home button
 */
export default function ShareErrorPage(): React.ReactElement {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
