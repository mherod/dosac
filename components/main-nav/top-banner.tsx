"use client";

import { Lock, HelpCircle } from "lucide-react";
import React from "react";

export function TopBanner(): React.ReactElement {
  return (
    <div className="flex h-8 items-center justify-between border-b border-[#ffffff1f] bg-[#fd0] text-[#0b0c0c] text-xs bg-[#1d70b8] w-[100vw] relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] whitespace-nowrap overflow-hidden">
      <div className="flex items-center gap-2 px-4 lg:px-8 mx-auto w-full">
        <Lock className="h-4 w-4 flex-shrink-0" />
        <span className="hidden sm:inline truncate">
          OFFICIAL-SENSITIVE - FOR INTERNAL USE - RESTRICTED ACCESS
        </span>
        <span className="sm:hidden truncate">RESTRICTED ACCESS</span>
      </div>
      <div className="hidden sm:flex items-center gap-4 px-8">
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
