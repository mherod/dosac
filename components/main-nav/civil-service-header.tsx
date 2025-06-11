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
        className="mx-auto flex h-14 max-w-7xl select-none items-center justify-between px-4 lg:px-8"
        draggable="false"
      >
        <div className="flex select-none items-center gap-2" draggable="false">
          <div
            className="h-10 w-0.5 select-none bg-white"
            draggable="false"
          ></div>
          <Crown />
          <span
            className="w-[225px] select-none whitespace-normal break-words"
            draggable="false"
          >
            Department for Social Affairs & Citizenship
          </span>
        </div>
        <div className="flex select-none items-center gap-2" draggable="false">
          <div className="flex select-none flex-col" draggable="false">
            <span
              className="tab-[4] box-border select-none break-words bg-no-repeat text-xs font-bold leading-[1.5] text-white"
              draggable="false"
            >
              Civil Service Digital
            </span>
          </div>
          <div
            className="flex select-none items-center rounded-sm border border-white/20 bg-[#1d70b8] px-1.5 py-1"
            draggable="false"
          >
            <span
              className="my-auto select-none text-[10px] font-semibold uppercase tracking-wider text-white"
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
      className="select-none mix-blend-hard-light invert"
      draggable="false"
    />
  );
}
