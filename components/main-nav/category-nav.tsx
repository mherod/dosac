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
        "relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-[100vw] border-t border-white/10 bg-[#1d70b8]",
        containerClassName,
      )}
    >
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
        <div className="flex flex-col gap-1 py-2 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
          <div className="grid min-w-0 grid-cols-2 items-center gap-x-4 sm:flex sm:flex-wrap sm:gap-x-6">
            <Link
              href="/"
              className="flex min-h-11 items-center text-sm font-bold text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              suppressHydrationWarning
            >
              Ministerial Database
            </Link>
            <div className="contents">
              {CATEGORIES.map((category: { id: string; title: string }) => (
                <Link
                  key={category.id}
                  href={
                    category.id === "policy-unit"
                      ? "/policies"
                      : `/categories/${category.id}`
                  }
                  className="flex min-h-11 items-center text-sm font-bold text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  suppressHydrationWarning
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="min-w-0 pb-1 xl:shrink-0 xl:pb-0">
            <div
              className="text-xs leading-relaxed text-white/75"
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
