import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface ActionButtonsProps {
  onDownload: () => void;
  onShare: () => void;
  className?: string;
}

export function ActionButtons({
  onDownload,
  onShare,
  className = "",
}: ActionButtonsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        className="flex-1 shadow-sm transition-all hover:shadow-md"
        onClick={onDownload}
      >
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button
        className="shadow-sm transition-all hover:shadow-md"
        onClick={onShare}
        variant="outline"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
