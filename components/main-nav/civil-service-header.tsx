"use client";

import { UKFlag } from "@/components/icons/uk-flag";

export function CivilServiceHeader() {
  return (
    <div className="flex h-12 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto select-none">
      <div className="flex items-center gap-2">
        <UKFlag className="h-4 w-8" />
        <div className="flex flex-col">
          <span className="text-md font-bold">Civil Service Digital</span>
        </div>
      </div>
      <div className="rounded-sm border border-white/20 bg-[#1d70b8] px-1.5 py-1 flex items-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white my-auto">
          Beta
        </span>
      </div>
    </div>
  );
}
