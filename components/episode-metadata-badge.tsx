import type { LucideIcon } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the EpisodeMetadataBadge component
 */
interface EpisodeMetadataBadgeProps {
  /** Icon to display before the text */
  icon: LucideIcon;
  /** Text content to display */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * A reusable badge component for displaying episode metadata (air date, runtime, etc.)
 * Uses consistent styling with blue border and background
 *
 * @param props - The component props
 * @param props.icon - Icon component from lucide-react
 * @param props.children - Text content to display
 * @param props.className - Additional CSS classes
 * @returns A styled metadata badge with icon and text
 *
 * @example
 * ```tsx
 * <EpisodeMetadataBadge icon={CalendarIcon}>
 *   15 January 2005
 * </EpisodeMetadataBadge>
 * ```
 */
export function EpisodeMetadataBadge({
  icon: Icon,
  children,
  className,
}: EpisodeMetadataBadgeProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-blue-600",
        className,
      )}
    >
      <Icon className="h-4 w-4 opacity-70" />
      <span>{children}</span>
    </div>
  );
}
