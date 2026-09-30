import Image from "next/image";
import type React from "react";
import { cn } from "@/lib/utils";
import dosacLogo from "@/public/DOSAC.png";

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
      role="contentinfo"
      className={cn(
        "mt-auto flex shrink-0 flex-col items-center justify-center border-t p-4 md:p-5 lg:p-6",
        "pb-[max(env(safe-area-inset-bottom),1rem)] pl-[max(env(safe-area-inset-left),1rem)] pr-[max(env(safe-area-inset-right),1rem)] md:pb-[max(env(safe-area-inset-bottom),1.25rem)] md:pl-[max(env(safe-area-inset-left),1.25rem)] md:pr-[max(env(safe-area-inset-right),1.25rem)] lg:pb-[max(env(safe-area-inset-bottom),1.5rem)] lg:pl-[max(env(safe-area-inset-left),1.5rem)] lg:pr-[max(env(safe-area-inset-right),1.5rem)]",
        className,
      )}
    >
      <p className="text-center text-sm text-muted-foreground md:text-base">
        <b>dosac.uk</b> is a fan project and is not affiliated with the BBC, The
        Thick of It or any of its creators.
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground md:mt-3 md:text-base">
        This site is not affiliated with or endorsed by the UK Government or any
        associated bodies.
      </p>
      <Image
        src={dosacLogo}
        alt="Department of Social Affairs and Citizenship logo"
        className="mx-auto w-32 py-4 md:w-40 md:py-5 lg:py-6"
        width={160}
        height={64}
        priority
      />
    </footer>
  );
}
