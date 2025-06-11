"use client";

import { UserMenu } from "./user-menu";
import Image from "next/image";
import crown from "@/public/crown.png";
import Link from "next/link";
import React from "react";

export function CivilServiceHeader(): React.ReactElement {
  return (
    <Link href="/">
      <div
        className="flex h-14 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto select-none"
        draggable="false"
      >
        <div className="flex items-center gap-2 select-none" draggable="false">
          <div
            className="w-0.5 h-10 bg-white select-none"
            draggable="false"
          ></div>
          <Crown />
          <span
            className="select-none whitespace-normal w-[225px] break-words"
            draggable="false"
          >
            Department for Social Affairs & Citizenship
          </span>
        </div>
        <div className="flex items-center gap-2 select-none" draggable="false">
          <div className="flex flex-col select-none" draggable="false">
            <span
              className="text-xs font-bold text-white leading-[1.5] break-words tab-[4] box-border bg-no-repeat select-none"
              draggable="false"
            >
              Civil Service Digital
            </span>
          </div>
          <div
            className="rounded-sm border border-white/20 bg-[#1d70b8] px-1.5 py-1 flex items-center select-none"
            draggable="false"
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-wider text-white my-auto select-none"
              draggable="false"
            >
              Beta
            </span>
          </div>
          <UserMenu />
        </div>
      </div>
    </Link>
  );
}

function Crown(): React.ReactElement {
  return (
    <Image
      src={crown}
      alt="Civil Service Digital"
      height={38}
      width={38}
      priority
      className="invert mix-blend-hard-light select-none"
      draggable="false"
    />
  );
}
