import { cn } from "@/lib/utils";
import Image from "next/image";
import dosacLogo from "@/public/DOSAC.png";
import React from "react";

interface FooterProps {
  className?: string;
}

/**
 * Footer component that displays the site disclaimer and DOSAC logo
 * @param props
 * @param x
 * @returns A footer element containing the site disclaimer and DOSAC logo
 */
export function Footer({ className }: FooterProps): React.ReactElement {
  return (
    <footer
      className={cn(
        "mt-auto border-t flex flex-col items-center justify-center p-4",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground text-center">
        <b>dosac.uk</b> is a fan project and is not affiliated with the BBC, The
        Thick of It or any of its creators.
      </p>
      <p className="text-sm text-muted-foreground text-center">
        This site is not affiliated with or endorsed by the UK Government or any
        associated bodies.
      </p>
      <Image
        src={dosacLogo}
        alt="Department of Social Affairs and Citizenship logo"
        className="mx-auto py-4 w-32 md:w-40"
        width={160}
        height={64}
        priority
      />
    </footer>
  );
}
