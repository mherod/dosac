import { Building2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DosacLogo() {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="rounded bg-white p-1">
        <Building2 className="h-6 w-6 text-[#0b0c0c]" />
      </div>
      <div className="flex flex-col">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-2xl font-bold tracking-tight cursor-help">
                DoSAC
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm font-medium">
                Department of Social Affairs and Citizenship (formerly
                Department of Social Affairs)
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
