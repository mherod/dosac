import { Film } from "lucide-react";

/**
 * Props for the SeriesHeader component
 */
interface SeriesHeaderProps {
  /** Title to display in the header */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional count of items to display */
  itemCount?: number;
}

/**
 * Component for displaying a header for series and episode pages
 * Shows a title, optional description, and item count with consistent styling
 * @param props - The component props
 * @param props.title - Title to display in the header
 * @param props.description - Optional description text
 * @param props.itemCount - Optional count of items to display
 * @returns A styled header component with title and optional content
 */
export const SeriesHeader = ({
  title,
  description,
  itemCount,
}: SeriesHeaderProps): React.ReactElement => (
  <div className="bg-[#1d70b8] text-white py-6 w-[100vw] relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw]">
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-white/10 p-2.5">
          <Film className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-base text-white/90 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
          {itemCount !== undefined && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
                {itemCount.toLocaleString()}{" "}
                {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
