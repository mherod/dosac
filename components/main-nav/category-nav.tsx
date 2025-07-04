"use client";

import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type React from "react";

export function CategoryNav({
  className,
  containerClassName,
}: {
  className?: string;
  containerClassName?: string;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-[100vw] border-t border-[#1d70b8] bg-[#1d70b8] py-1",
        containerClassName,
      )}
    >
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
        <div className="flex flex-col items-start justify-between gap-2 py-2 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/"
              className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
              suppressHydrationWarning
            >
              Ministerial Database
            </Link>
            <div className="flex flex-wrap gap-4">
              {CATEGORIES.map((category: { id: string; title: string }) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
                  suppressHydrationWarning
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-xs text-white/60" suppressHydrationWarning>
              Last updated: {new Date().toLocaleDateString("en-GB")} | System
              ID: DQARS-2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
