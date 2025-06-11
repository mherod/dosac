import { TextInput } from "@/components/ui/text-input";
import { cn } from "@/lib/utils";

/**
 * Props for the SearchBar component
 */
interface SearchBarProps {
  /** Current search input value */
  value: string;
  /** Callback when search input changes */
  onChange: (value: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component for displaying a search input with custom styling
 * @param props - The component props
 * @param props.value - Current search input value
 * @param props.onChange - Callback when search input changes
 * @param props.className - Additional CSS classes
 * @returns A styled search input component
 */
export function SearchBar({
  value,
  onChange,
  className,
}: SearchBarProps): React.ReactElement {
  return (
    <TextInput
      type="search"
      placeholder="Search ministerial quotes..."
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      className={cn(
        "px-3 py-1.5 text-sm",
        "rounded border border-white/20 bg-transparent",
        "text-white placeholder:text-white/60",
        "focus:border-white/40 focus:ring-[#1d70b8]",
        className,
      )}
    />
  );
}
