import { Home } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Interface for page component props
 */
interface PageProps {
  /** Promise resolving to search parameters */
  searchParams: Promise<{ message?: string }>;
}

/**
 * Server component that reads the error message from searchParams
 * Must be inside Suspense because searchParams access is dynamic
 */
async function ErrorContent({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const { message } = await searchParams;
  const errorMessage = message || "An unknown error occurred";

  return <p className="text-center text-muted-foreground">{errorMessage}</p>;
}

/**
 * Server component page for displaying share link errors
 * Static shell is prerendered; dynamic searchParams content is in Suspense
 * @param props - The page props
 * @param props.searchParams - Promise resolving to search parameters containing error message
 * @returns The share error page with error message and home button
 */
export default function ShareErrorPage({
  searchParams,
}: PageProps): React.ReactElement {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md space-y-4 p-6">
        <h1 className="text-center text-2xl font-bold text-destructive">
          Share Link Error
        </h1>
        <Suspense
          fallback={
            <p className="text-center text-muted-foreground">Loading...</p>
          }
        >
          <ErrorContent searchParams={searchParams} />
        </Suspense>
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
