import { TextInput } from "@/components/ui/text-input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

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
