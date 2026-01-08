"use client";

import type { KeyboardEvent } from "react";
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
  /** Callback when search is submitted (Enter key or form submit) */
  onSubmit?: (value: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component for displaying a search input with custom styling
 * @param props - The component props
 * @param props.value - Current search input value
 * @param props.onChange - Callback when search input changes
 * @param props.onSubmit - Callback when search is submitted
 * @param props.className - Additional CSS classes
 * @returns A styled search input component
 */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  className,
}: SearchBarProps): React.ReactElement {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      const input = e.target as HTMLInputElement;
      const currentValue = input.value.trim();
      if (currentValue && onSubmit) {
        onSubmit(currentValue);
      }
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="search-input" className="sr-only">
        Search ministerial quotes
      </label>
      <TextInput
        id="search-input"
        type="search"
        placeholder="Search ministerial quotes..."
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        onKeyDown={handleKeyDown}
        aria-label="Search ministerial quotes"
        className={cn(
          "px-3 py-1.5 text-sm",
          "rounded border border-white/20 bg-transparent",
          "text-white placeholder:text-white/60",
          "focus:border-white/40 focus:ring-[#1d70b8]",
          className,
        )}
      />
    </div>
  );
}
