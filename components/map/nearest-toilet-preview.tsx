import type { NearbyToilet } from "@/lib/toilets/nearby";
import {
  approximateWalkingMinutes,
  formatDistance,
} from "@/lib/toilets/preview";
import { openingStatusLabel } from "@/lib/toilets/opening-hours";
import { priceDisplayLabel } from "@/lib/toilets/price";
import { lowConfidenceCaution } from "@/lib/toilets/detail";

interface NearestToiletPreviewProps {
  toilet: NearbyToilet;
  onRefreshLocation: () => void;
  onOpenDetails: () => void;
  onDismiss: () => void;
}

export function NearestToiletPreview({
  toilet,
  onRefreshLocation,
  onOpenDetails,
  onDismiss,
}: NearestToiletPreviewProps) {
  const etaMinutes = approximateWalkingMinutes(toilet.distanceMeters);
  const confidenceCaution = lowConfidenceCaution(toilet.confidenceLevel);

  return (
    <section className="nearest-preview" data-testid="nearest-preview" aria-labelledby="nearest-preview-title">
      <button className="nearest-preview__close" type="button" aria-label="Zamknij podgląd najbliższej toalety" onClick={onDismiss}>×</button>
      <p className="nearest-preview__eyebrow">NAJBLIŻSZY SENSOWNY KIBEL</p>
      <h2 id="nearest-preview-title">{toilet.name}</h2>
      <p className="nearest-preview__journey">
        <strong>{formatDistance(toilet.distanceMeters)}</strong>
        <span>·</span>
        <span>~{etaMinutes} MIN PIESZO</span>
      </p>
      <div className="nearest-preview__badges" aria-label="Znane informacje">
        <span className={`preview-badge preview-badge--opening-${toilet.openingStatus}`}>
          {openingStatusLabel(toilet.openingStatus)}
        </span>
        <span className={`preview-badge preview-badge--${toilet.priceState}`}>
          {priceDisplayLabel(toilet.priceState, toilet.priceAmountMinor, toilet.currency)}
        </span>
      </div>
      <p className="nearest-preview__note">
        Czas jest orientacyjny. Status godzin wynika tylko z danych źródłowych.
      </p>
      {confidenceCaution ? <p className="confidence-caution">{confidenceCaution}</p> : null}
      <button className="nearest-preview__open" type="button" onClick={onOpenDetails}>
        ZOBACZ I PROWADŹ MNIE
      </button>
      <button className="nearest-preview__refresh" type="button" onClick={onRefreshLocation}>
        ODŚWIEŻ LOKALIZACJĘ
      </button>
    </section>
  );
}
