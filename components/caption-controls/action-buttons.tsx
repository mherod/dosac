"use client";

import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props for the ActionButtons component
 */
interface ActionButtonsProps {
  /** Callback function when the download button is clicked */
  onDownload: () => void;
  /** Callback function when the share button is clicked */
  onShare: () => void;
  /** Optional CSS class name for additional styling */
  className?: string;
}

/**
 * Component that renders download and share action buttons
 * @param props - The component props
 * @param props.onDownload - Function to call when download button is clicked
 * @param props.onShare - Function to call when share button is clicked
 * @param props.className - Optional CSS class name for styling
 * @returns A group of action buttons for downloading and sharing
 */
export function ActionButtons({
  onDownload,
  onShare,
  className = "",
}: ActionButtonsProps): React.ReactElement {
  return (
    <div
      className={cn("flex gap-2", className)}
      role="group"
      aria-label="Caption actions"
    >
      <Button
        className="flex-1 shadow-sm transition-all hover:shadow-md"
        onClick={onDownload}
        aria-label="Download caption image"
      >
        <Download className="mr-2 h-4 w-4" aria-hidden="true" />
        Download
      </Button>
      <Button
        className="shadow-sm transition-all hover:shadow-md"
        onClick={onShare}
        variant="outline"
        aria-label="Share caption"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Share</span>
      </Button>
    </div>
  );
}
