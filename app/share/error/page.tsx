"use client";

import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function ShareErrorPage() {
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
