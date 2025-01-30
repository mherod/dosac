import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeriesSelectProps {
  season?: number;
  episode?: number;
  onFilterChange: (updates: { season?: number; episode?: number }) => void;
  className?: string;
}

export function SeriesSelect({
  season,
  episode,
  onFilterChange,
  className = "",
}: SeriesSelectProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Select
        value={season?.toString() ?? "all"}
        onValueChange={(value) => {
          const newSeason = value !== "all" ? parseInt(value, 10) : undefined;
          onFilterChange({
            season: newSeason,
            episode: newSeason ? episode : undefined,
          });
        }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Series" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Series</SelectItem>
          {[1, 2, 3, 4].map((s) => (
            <SelectItem key={s} value={s.toString()}>
              Series {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={episode?.toString() ?? "all"}
        onValueChange={(value) => {
          onFilterChange({
            season,
            episode: value !== "all" ? Number(value) : undefined,
          });
        }}
        disabled={!season}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Episodes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Episodes</SelectItem>
          {season &&
            [1, 2, 3].map((ep) => (
              <SelectItem key={ep} value={ep.toString()}>
                Episode {ep}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
