"use client";

import React from "react";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster(): React.ReactElement {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  );
}
