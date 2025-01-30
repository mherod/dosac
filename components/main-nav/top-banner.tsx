"use client";

import { Lock, HelpCircle } from "lucide-react";

export function TopBanner() {
  return (
    <div className="flex h-8 items-center justify-between border-b border-[#ffffff1f] bg-[#fd0] text-[#0b0c0c] text-xs">
      <div className="flex items-center gap-2 px-4 lg:px-8">
        <Lock className="h-4 w-4" />
        <span className="hidden sm:inline">
          OFFICIAL-SENSITIVE - FOR INTERNAL USE - RESTRICTED ACCESS
        </span>
        <span className="sm:hidden">RESTRICTED ACCESS</span>
      </div>
      <div className="hidden sm:flex items-center gap-4 px-8">
        <span className="flex items-center gap-1">
          <HelpCircle className="h-4 w-4" />
          Support
        </span>
        <span>|</span>
        <span>GSI: 020 7276 1234</span>
      </div>
    </div>
  );
}
