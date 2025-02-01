"use client";

import { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/**
 * Props for the BreadcrumbNav component
 */
interface BreadcrumbNavProps {
  /** Array of breadcrumb items */
  items: {
    /** Label to display */
    label: string;
    /** Optional href for the item */
    href?: string;
    /** Whether this is the current page (active) */
    current?: boolean;
  }[];
  /** Optional additional className */
  className?: string;
}

/**
 * A standardized breadcrumb navigation component using shadcn/ui components
 * Renders a list of links separated by chevrons
 * @param props - The component props
 * @param props.items - Array of breadcrumb items
 * @param props.className - Optional additional className to apply to the breadcrumb
 * @returns A styled breadcrumb navigation component
 */
export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  return (
    <Breadcrumb className={cn("mb-6", className)}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.label}>
            <BreadcrumbItem>
              {item.href && !item.current ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
