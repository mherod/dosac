"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

/**
 * Component that displays the error content with message from URL parameters
 * @returns The error content with message and home button
 */
function ErrorContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("message") || "An unknown error occurred";

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-destructive">
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
