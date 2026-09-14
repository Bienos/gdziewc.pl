import type { NearbyToilet } from "@/lib/toilets/nearby";
import {
  approximateWalkingMinutes,
  formatDistance,
} from "@/lib/toilets/preview";
import { openingStatusLabel } from "@/lib/toilets/opening-hours";
import { priceDisplayLabel } from "@/lib/toilets/price";
import { lowConfidenceCaution } from "@/lib/toilets/detail";

interface NearbyToiletListProps {
  toilets: NearbyToilet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function NearbyToiletList({
  toilets,
  selectedId,
  onSelect,
}: NearbyToiletListProps) {
  return (
    <section className="nearby-toilet-list" data-testid="nearby-toilet-list" aria-labelledby="nearby-toilet-list-title">
      <h2 id="nearby-toilet-list-title">KIBLE W POBLIŻU</h2>
      <ol>
        {toilets.map((toilet) => {
          const isSelected = toilet.id === selectedId;
          const confidenceCaution = lowConfidenceCaution(toilet.confidenceLevel);

          return (
            <li key={toilet.id}>
              <button
                type="button"
                className="nearby-toilet-list__item"
                data-testid="nearby-toilet-list-item"
                data-recommended={toilet.isRecommended}
                aria-pressed={isSelected}
                onClick={() => onSelect(toilet.id)}
              >
                <span className="nearby-toilet-list__title-row">
                  <strong>{toilet.name}</strong>
                  {toilet.isRecommended ? <em>TOP</em> : null}
                </span>
                <span className="nearby-toilet-list__journey">
                  {formatDistance(toilet.distanceMeters)} · ~{approximateWalkingMinutes(toilet.distanceMeters)} MIN PIESZO
                </span>
                {confidenceCaution ? <span className="confidence-caution">{confidenceCaution}</span> : null}
                <span className="nearby-toilet-list__badges" aria-label="Znane informacje">
                  <span className={`preview-badge preview-badge--opening-${toilet.openingStatus}`}>
                    {openingStatusLabel(toilet.openingStatus)}
                  </span>
                  <span className={`preview-badge preview-badge--${toilet.priceState}`}>
                    {priceDisplayLabel(toilet.priceState, toilet.priceAmountMinor, toilet.currency)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
