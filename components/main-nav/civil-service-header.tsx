"use client";

import { UserMenu } from "./user-menu";
import Image from "next/image";
import crown from "@/public/crown.png";

export function CivilServiceHeader() {
  return (
    <div className="flex h-14 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto select-none">
      <div className="flex items-center gap-2">
        <div className="w-0.5 h-10 bg-white"></div>
        <Crown />
        Department for Social Affairs & <br />
        Citizenship
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white leading-[1.5] break-words tab-[4] box-border bg-no-repeat">
            Civil Service Digital
          </span>
        </div>
        <div className="rounded-sm border border-white/20 bg-[#1d70b8] px-1.5 py-1 flex items-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white my-auto">
            Beta
          </span>
        </div>
        <UserMenu />
      </div>
    </div>
  );
}

function Crown() {
  return (
    <Image
      src={crown}
      alt="Civil Service Digital"
      height={38}
      width={38}
      priority
      className="invert mix-blend-hard-light"
    />
  );
}
