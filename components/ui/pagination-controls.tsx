"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import type React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps): React.ReactElement {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const buildPageUrl = (page: number): string => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      {currentPage === 1 ? (
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="outline" size="icon" asChild>
          <Link href={buildPageUrl(prevPage)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      )}
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage === totalPages ? (
        <Button variant="outline" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="outline" size="icon" asChild>
          <Link href={buildPageUrl(nextPage)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
