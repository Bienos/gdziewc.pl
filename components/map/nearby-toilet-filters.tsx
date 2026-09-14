import {
  FILTER_KEYS,
  type ToiletFilterKey,
  type ToiletFilters,
} from "@/lib/toilets/filters";

const FILTER_LABELS: Record<ToiletFilterKey, string> = {
  openNow: "OTWARTE TERAZ",
  free: "ZA DARMO",
  wheelchair: "DLA WÓZKA",
  babyChanging: "PRZEWIJAK",
  open24h: "24H",
};

interface NearbyToiletFiltersProps {
  filters: ToiletFilters;
  matchCount: number;
  onToggle: (key: ToiletFilterKey) => void;
  onClear: () => void;
}

export function NearbyToiletFilters({ filters, matchCount, onToggle, onClear }: NearbyToiletFiltersProps) {
  const hasActiveFilter = FILTER_KEYS.some((key) => filters[key]);

  return (
    <section className="nearby-toilet-filters" aria-label="Filtry toalet">
      <div className="nearby-toilet-filters__heading">
        <strong>{matchCount} {matchCount === 1 ? "WYNIK" : "WYNIKÓW"}</strong>
        {hasActiveFilter ? <button type="button" onClick={onClear}>WYCZYŚĆ</button> : null}
      </div>
      <div className="nearby-toilet-filters__controls">
        {FILTER_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filters[key]}
            onClick={() => onToggle(key)}
          >
            {FILTER_LABELS[key]}
          </button>
        ))}
      </div>
    </section>
  );
}
