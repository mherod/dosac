import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

interface PageLayoutProps {
  /** The main content to render inside the container */
  children: ReactNode;
  /** Array of breadcrumb items */
  breadcrumbs: {
    /** Label to display */
    label: string;
    /** Optional href for the item */
    href?: string;
    /** Whether this is the current page (active) */
    current?: boolean;
  }[];
  /** Optional header content to render below breadcrumbs */
  headerContent?: ReactNode;
  /** Optional additional className for the container */
  className?: string;
}

/**
 * A standardized page layout component for content areas
 * @param root0
 * @returns
 */
export function PageLayout({
  children,
  breadcrumbs,
  headerContent,
  className,
}: PageLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <BreadcrumbNav items={breadcrumbs} />
        {headerContent}
      </div>
      <div className="py-2 md:py-4">{children}</div>
    </div>
  );
}
