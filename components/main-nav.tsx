import Link from "next/link";
import { Building2, AlertCircle } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { UKFlag } from "@/components/icons/uk-flag";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MainNav() {
  return (
    <header className="bg-[#0b0c0c] text-white">
      <div className="mx-auto">
        <div className="flex h-8 items-center justify-between border-b border-[#ffffff1f] bg-[#fd0] text-[#0b0c0c] text-xs">
          <div className="flex items-center gap-2 px-8">
            <AlertCircle className="h-4 w-4" />
            <span>
              INTERNAL USE ONLY - RESTRICTED ACCESS - CIVIL SERVICE NETWORK
            </span>
          </div>
        </div>
        <div className="flex h-12 items-center justify-between px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <UKFlag className="h-6 w-12" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">Civil Service Digital</span>
              <span className="text-xs text-[#6f777b]">
                Whitehall Internal Network
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#ffffff1f] bg-[#0b0c0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded bg-white p-1">
                <Building2 className="h-6 w-6 text-[#0b0c0c]" />
              </div>
              <div className="flex flex-col">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-2xl font-bold tracking-tight cursor-help">
                        DoSaC
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm font-medium">
                        Department of Social Affairs and Citizenship
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm font-medium text-[#6f777b]">
                  Meme Asset Management System
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-md border border-white/20 bg-[#1d70b8] px-2 py-1">
                <span className="text-xs font-bold uppercase tracking-wide text-white">
                  Beta
                </span>
              </div>
              <div className="text-xs text-[#6f777b]">
                <span>Welcome back, </span>
                <span className="font-medium text-white">Malcolm T.</span>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1d70b8] bg-[#1d70b8] py-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
            >
              Dashboard
            </Link>
            <Link
              href="/meme"
              className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
            >
              Asset Creation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
