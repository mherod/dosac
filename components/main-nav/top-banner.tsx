"use client";

import { HelpCircle, Lock } from "lucide-react";
import type React from "react";

export function TopBanner(): React.ReactElement {
  return (
    <div className="relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] flex h-8 w-[100vw] items-center justify-between overflow-hidden whitespace-nowrap border-b border-[#ffffff1f] bg-[#1d70b8] bg-[#fd0] text-xs text-[#0b0c0c]">
      <div className="mx-auto flex w-full items-center gap-2 px-4 lg:px-8">
        <Lock className="h-4 w-4 flex-shrink-0" />
        <span className="hidden truncate sm:inline">
          OFFICIAL-SENSITIVE - FOR INTERNAL USE - RESTRICTED ACCESS
        </span>
        <span className="truncate sm:hidden">RESTRICTED ACCESS</span>
      </div>
      <div className="hidden items-center gap-4 px-8 sm:flex">
        <span className="flex items-center gap-1">
          <HelpCircle className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Support</span>
        </span>
        <span>|</span>
        <span className="truncate">GSI: 020 7276 1234</span>
      </div>
    </div>
  );
}
