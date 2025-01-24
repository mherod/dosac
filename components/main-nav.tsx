import Link from "next/link";
import { Building2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Building2 className="h-6 w-6" />
          <span className="font-bold">DoSaCGenerator</span>
        </Link>
        <ModeToggle />
      </div>
    </header>
  );
}
