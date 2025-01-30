"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export function BottomNav() {
  return (
    <div className="border-t border-[#1d70b8] bg-[#1d70b8] py-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
            <Link
              href="/"
              className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
              suppressHydrationWarning
            >
              Ministerial Database
            </Link>
            <div className="flex flex-wrap gap-4">
              {CATEGORIES.map((category) => (
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
          <div
            className="text-xs text-white/60 mt-2 sm:mt-0"
            suppressHydrationWarning
          >
            Last updated: {new Date().toLocaleDateString("en-GB")} | System ID:
            DQARS-2024
          </div>
        </div>
      </div>
    </div>
  );
}
