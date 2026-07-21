import Link from "next/link";
import type React from "react";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function CategoryNav({
  className,
  containerClassName,
}: {
  className?: string;
  containerClassName?: string;
}): React.ReactElement {
  return (
    <nav
      aria-label="Category navigation"
      className={cn(
        "relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-[100vw] border-t border-[#1d70b8] bg-[#1d70b8] py-1",
        containerClassName,
      )}
    >
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
        <div className="flex flex-col items-stretch justify-between gap-3 py-3 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/"
              className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
              suppressHydrationWarning
            >
              Ministerial Database
            </Link>
            <div className="flex min-w-0 flex-wrap gap-x-4 gap-y-2" role="list">
              {CATEGORIES.map((category: { id: string; title: string }) => (
                <Link
                  key={category.id}
                  href={
                    category.id === "policy-unit"
                      ? "/policies"
                      : `/categories/${category.id}`
                  }
                  className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
                  suppressHydrationWarning
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex min-w-0 items-center sm:self-end lg:shrink-0 lg:self-auto">
            <div
              className="text-right text-xs leading-relaxed text-white/60"
              aria-live="polite"
            >
              Last updated: 11/10/2025 | System ID: DQARS-2024
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
