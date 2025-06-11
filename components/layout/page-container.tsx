import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  /** The content to render inside the container */
  children: ReactNode;
  /** Optional additional className */
  className?: string;
}

/**
 * A consistent page container component that wraps all page content
 * @param props - Component props
 * @param props.children - The content to render inside the container
 * @param props.className - Optional additional className
 * @returns A main element containing the page content with consistent padding and width
 */
export function PageContainer({
  children,
  className,
}: PageContainerProps): React.ReactElement {
  return (
    <main
      className={cn(
        "container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8",
        className,
      )}
    >
      {children}
    </main>
  );
}
