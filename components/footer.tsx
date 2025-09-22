import { cn } from "@/lib/utils";
import dosacLogo from "@/public/DOSAC.png";
import Image from "next/image";
import type React from "react";

interface FooterProps {
  className?: string;
}

/**
 * Footer component that displays the site disclaimer and DOSAC logo
 * @param props - The footer props
 * @param props.className - Optional CSS class name for styling
 * @returns A footer element containing the site disclaimer and DOSAC logo
 */
export function Footer({ className }: FooterProps): React.ReactElement {
  return (
    <footer
      className={cn(
        "mt-auto flex flex-col items-center justify-center border-t p-4",
        className,
      )}
    >
      <p className="text-center text-sm text-muted-foreground">
        <b>dosac.uk</b> is a fan project and is not affiliated with the BBC, The
        Thick of It or any of its creators.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        This site is not affiliated with or endorsed by the UK Government or any
        associated bodies.
      </p>
      <Image
        src={dosacLogo}
        alt="Department of Social Affairs and Citizenship logo"
        className="mx-auto w-32 py-4 md:w-40"
        width={160}
        height={64}
        priority
      />
    </footer>
  );
}
