"use client";

import { Fragment } from "react";
import Link from "next/link";
import { uniqBy } from "lodash-es";
import type { BreadcrumbItem as NavItem } from "@/lib/navigation";

/**
 * Props for the BreadcrumbNav component
 */
interface BreadcrumbNavProps {
  /** Array of breadcrumb items */
  items: NavItem[];
  /** Optional additional className */
  className?: string;
  /** Whether to show the home icon as first item (defaults to true) */
  showHome?: boolean;
}

/**
 * A standardized breadcrumb navigation component using shadcn/ui components
 * Renders a list of links separated by chevrons, with optional home link and icons
 */
export function BreadcrumbNav({
  items,
  className,
  showHome = true,
}: BreadcrumbNavProps) {
  const homeItem: NavItem = {
    label: "Home",
    href: "/",
  };

  const allItems = uniqBy(
    showHome ? [homeItem, ...items] : items,
    (item) => item.href,
  );

  return (
    <nav className="mb-6" aria-label="Breadcrumb navigation">
      <ol className="flex flex-wrap items-center text-[#1d70b8] text-base">
        {allItems.map((item, index) => (
          <Fragment key={`${item.label}-${item.href || "current"}-${index}`}>
            {index > 0 && (
              <li className="mx-2 text-[#505a5f]" aria-hidden="true">
                &gt;
              </li>
            )}
            <li>
              {item.href && !item.current ? (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#505a5f]">{item.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
