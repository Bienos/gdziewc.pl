"use client";

import { useEffect, useRef } from "react";
import type { NearbyToilet } from "@/lib/toilets/nearby";
import {
  accessDetailLabel,
  babyChangingDetailLabel,
  confidenceDetailLabel,
  unisexDetailLabel,
  wheelchairDetailLabel,
} from "@/lib/toilets/detail";
import {
  approximateWalkingMinutes,
  formatDistance,
} from "@/lib/toilets/preview";
import { googleMapsWalkingUrl } from "@/lib/navigation/walking";
import { openingStatusLabel } from "@/lib/toilets/opening-hours";
import { priceDisplayLabel } from "@/lib/toilets/price";
import { ToiletReportForm } from "@/components/map/toilet-report-form";
import { trackAnalyticsEvent } from "@/lib/analytics/events";

interface ToiletDetailSheetProps {
  toilet: NearbyToilet;
  onClose: () => void;
}

export function ToiletDetailSheet({ toilet, onClose }: ToiletDetailSheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    trackAnalyticsEvent({ name: "detail_opened" });
  }, []);

  const etaMinutes = approximateWalkingMinutes(toilet.distanceMeters);
  const navigationUrl = googleMapsWalkingUrl({ lat: toilet.lat, lng: toilet.lng });

  return (
    <aside
      className="toilet-detail-sheet"
      data-testid="toilet-detail-sheet"
      role="dialog"
      aria-modal="false"
      aria-labelledby="toilet-detail-title"
    >
      <div className="toilet-detail-sheet__handle" aria-hidden="true" />
      <button
        className="toilet-detail-sheet__close"
        ref={closeButtonRef}
        type="button"
        aria-label="Zamknij szczegóły toalety"
        onClick={onClose}
      >
        ×
      </button>
      <p className="toilet-detail-sheet__eyebrow">WYBRANY KIBEL</p>
      <h2 id="toilet-detail-title">{toilet.name}</h2>
      <p className="toilet-detail-sheet__journey">
        {formatDistance(toilet.distanceMeters)} · ~{etaMinutes} MIN PIESZO
      </p>
      <div className="toilet-detail-sheet__badges" aria-label="Status i cena">
        <span className={`preview-badge preview-badge--opening-${toilet.openingStatus}`}>
          {openingStatusLabel(toilet.openingStatus)}
        </span>
        <span className={`preview-badge preview-badge--${toilet.priceState}`}>
          {priceDisplayLabel(toilet.priceState, toilet.priceAmountMinor, toilet.currency)}
        </span>
      </div>
      <dl className="toilet-detail-sheet__facts">
        <div><dt>DOSTĘP</dt><dd>{accessDetailLabel(toilet.accessState)}</dd></div>
        <div><dt>WÓZEK</dt><dd>{wheelchairDetailLabel(toilet.wheelchairState)}</dd></div>
        <div><dt>PRZEWIJAK</dt><dd>{babyChangingDetailLabel(toilet.babyChangingState)}</dd></div>
        <div><dt>UNISEX</dt><dd>{unisexDetailLabel(toilet.unisexState)}</dd></div>
        <div><dt>GODZINY</dt><dd>{toilet.openingHoursRaw ?? "NIEZNANE"}</dd></div>
        <div><dt>DANE</dt><dd>{confidenceDetailLabel(toilet.confidenceLevel)}</dd></div>
      </dl>
      <p className="toilet-detail-sheet__note">
        Status godzin wynika wyłącznie z formatu, który potrafimy bezpiecznie ocenić.
      </p>
      {navigationUrl ? (
        <a
          className="toilet-detail-sheet__navigate"
          data-testid="walking-navigation-link"
          href={navigationUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackAnalyticsEvent({ name: "navigation_opened" })}
        >
          PROWADŹ MNIE
        </a>
      ) : (
        <p className="toilet-detail-sheet__navigation-unavailable">
          NAWIGACJA NIEDOSTĘPNA
        </p>
      )}
      <ToiletReportForm toiletId={toilet.id} />
    </aside>
  );
}
