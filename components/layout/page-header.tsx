import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** The content to render inside the header */
  children: ReactNode;
  /** Whether to use a gradient background */
  gradient?: boolean;
  /** Optional additional className */
  className?: string;
}

/**
 * A consistent page header component with optional gradient background
 * @param props - Component props
 * @param props.children - The content to render inside the header
 * @param props.gradient - Whether to use a gradient background
 * @param props.className - Optional additional className
 */
export function PageHeader({
  children,
  gradient = true,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative",
        gradient && "bg-gradient-to-b from-background/80 to-background",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className={cn("space-y-4", className)}>{children}</div>
      </div>
    </div>
  );
}
