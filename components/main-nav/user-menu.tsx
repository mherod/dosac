import Image from "next/image";
import React from "react";

export function UserMenu(): React.ReactElement {
  return (
    <div className="flex items-center gap-4 border-l border-[#ffffff33] pl-4">
      <div className="flex items-center gap-2 text-xs text-[#6f777b]">
        <div className="flex items-center gap-1.5">
          <Image
            src="/characters/terri.webp"
            alt="Terri Coverley"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="font-medium text-white">Terri C</span>
        </div>
      </div>
    </div>
  );
}
