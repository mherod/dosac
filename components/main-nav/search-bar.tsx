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
export function SearchBar({ value, onChange, className }: SearchBarProps) {
  return (
    <TextInput
      type="search"
      placeholder="Search ministerial quotes..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full border-[#ffffff33] bg-transparent text-white placeholder:text-[#ffffff66] focus-visible:ring-[#1d70b8]",
        className,
      )}
    />
  );
}
