"use client";

import { useMemo, useState } from "react";
import { GeographicWarsawMap } from "@/components/map/geographic-warsaw-map";
import { NearestToiletPreview } from "@/components/map/nearest-toilet-preview";
import { NearbyToiletList } from "@/components/map/nearby-toilet-list";
import { NearbyToiletFilters } from "@/components/map/nearby-toilet-filters";
import { ToiletDetailSheet } from "@/components/map/toilet-detail-sheet";
import {
  messageForLocationStatus,
  statusFromGeolocationError,
  type LocationStatus,
} from "@/lib/location/status";
import {
  nearbyResponseSchema,
  type NearbyToilet,
} from "@/lib/toilets/nearby";
import {
  DEFAULT_TOILET_FILTERS,
  filterToilets,
  hasActiveToiletFilters,
  matchesToiletFilters,
  type ToiletFilterKey,
} from "@/lib/toilets/filters";
import { isWithinWarsawSupportedArea } from "@/lib/location/warsaw-service-area";
import { trackAnalyticsEvent } from "@/lib/analytics/events";
import { trackSafeError } from "@/lib/observability/errors";
import { WARSAW_MAP_CENTER } from "@/lib/map/config";

interface BrowserPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";
type ResultView = "map" | "list";
const INITIAL_RADIUS_METERS = 2_000;
const EXPANDED_RADII_METERS = [5_000, 10_000] as const;

function radiusLabel(radiusMeters: number): string {
  return `${radiusMeters / 1_000} KM`;
}

export function LocationExperience() {
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [position, setPosition] = useState<BrowserPosition | null>(null);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [toilets, setToilets] = useState<NearbyToilet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resultView, setResultView] = useState<ResultView>("map");
  const [filters, setFilters] = useState(DEFAULT_TOILET_FILTERS);
  const [searchRadiusMeters, setSearchRadiusMeters] = useState(INITIAL_RADIUS_METERS);
  const [manualMapActive, setManualMapActive] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapSearchCenter, setMapSearchCenter] = useState<BrowserPosition | null>(null);
  const [previewDismissed, setPreviewDismissed] = useState(false);
  const [locationFocusRequest, setLocationFocusRequest] = useState(0);
  const message = messageForLocationStatus(status);
  const filteredToilets = filterToilets(toilets, filters);
  const recommendedToilet = filteredToilets.find((toilet) => toilet.isRecommended) ?? filteredToilets[0] ?? null;
  const selectedToilet = filteredToilets.find((toilet) => toilet.id === selectedId) ?? null;
  const hasActiveMap = status === "success" || manualMapActive;
  const userMapLocation = useMemo(
    () => status === "success" && position ? { lat: position.latitude, lng: position.longitude } : null,
    [position, status],
  );

  async function loadNearby(nextPosition: BrowserPosition, radiusMeters = INITIAL_RADIUS_METERS) {
    setSearchStatus("loading");
    setToilets([]);
    setPreviewDismissed(false);
    setSelectedId(null);
    setResultView("map");
    setFilters(DEFAULT_TOILET_FILTERS);
    setFiltersOpen(false);
    setMapSearchCenter(null);
    setSearchRadiusMeters(radiusMeters);
    try {
      const response = await fetch("/api/toilets/nearby", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          location: {
            lat: nextPosition.latitude,
            lng: nextPosition.longitude,
          },
          ...(radiusMeters === INITIAL_RADIUS_METERS ? {} : { radiusMeters }),
        }),
      });
      if (!response.ok) throw new Error("Nearby request failed");
      const payload = nearbyResponseSchema.parse(await response.json());
      setToilets(payload.results);
      setPreviewDismissed(false);
      setSearchStatus(payload.results.length > 0 ? "success" : "empty");
      trackAnalyticsEvent({ name: "nearby_loaded", result: payload.results.length > 0 ? "success" : "empty" });
    } catch {
      setSearchStatus("error");
      trackAnalyticsEvent({ name: "nearby_loaded", result: "error" });
      trackSafeError({ code: "nearby_failed", surface: "location" });
    }
  }

  function requestLocation() {
    if (status === "loading") return;
    setStatus("loading");
    setSearchStatus("idle");
    setToilets([]);
    setSelectedId(null);
    setResultView("map");
    setFilters(DEFAULT_TOILET_FILTERS);
    setFiltersOpen(false);
    setMapSearchCenter(null);
    setSearchRadiusMeters(INITIAL_RADIUS_METERS);
    setManualMapActive(false);
    trackAnalyticsEvent({ name: "location_requested" });

    if (!("geolocation" in navigator)) {
      setPosition(null);
      setStatus("unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextPosition = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        };
        setPosition(nextPosition);
        if (!isWithinWarsawSupportedArea(nextPosition)) {
          setStatus("outside_warsaw");
          return;
        }
        setStatus("success");
        void loadNearby(nextPosition);
      },
      (error) => {
        setPosition(null);
        setStatus(statusFromGeolocationError(error.code));
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 30_000 },
    );
  }

  function openManualWarsawMap() {
    const browsePosition = {
      latitude: WARSAW_MAP_CENTER.lat,
      longitude: WARSAW_MAP_CENTER.lng,
      accuracy: 0,
    };
    setPosition(null);
    setManualMapActive(true);
    setFiltersOpen(false);
    setMapSearchCenter(null);
    void loadNearby(browsePosition, 10_000);
  }

  function toggleFilter(key: ToiletFilterKey) {
    trackAnalyticsEvent({ name: "filter_toggled", filter: key });
    setFilters((current) => {
      const next = { ...current, [key]: !current[key] };
      const selected = toilets.find((toilet) => toilet.id === selectedId);
      if (selected && !matchesToiletFilters(selected, next)) setSelectedId(null);
      return next;
    });
  }

  function clearFilters() {
    setFilters(DEFAULT_TOILET_FILTERS);
  }

  const nextExpandedRadius = EXPANDED_RADII_METERS.find((radius) => radius > searchRadiusMeters) ?? null;
  const mapToilets = filteredToilets;

  return (
    <>
      <GeographicWarsawMap
        active={hasActiveMap}
        visible={resultView === "map"}
        userLocation={userMapLocation}
        focusLocation={locationFocusRequest}
        toilets={mapToilets}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onMapMove={(center) => setMapSearchCenter({ latitude: center.lat, longitude: center.lng, accuracy: 0 })}
      />

      {selectedToilet ? (
        <ToiletDetailSheet toilet={selectedToilet} onClose={() => setSelectedId(null)} />
      ) : null}

      {hasActiveMap ? (
        <div className={`map-results-status map-results-status--${searchStatus}`} role="status" aria-live="polite">
          {searchStatus === "loading" ? "SZUKAM KIBLI…" : null}
          {searchStatus === "success" && manualMapActive ? <button type="button" onClick={requestLocation}>MOJA LOKALIZACJA</button> : null}
          {searchStatus === "empty" ? (
            <>
              <span>NIE MA NIC W PROMIENIU {radiusLabel(searchRadiusMeters)}.</span>
              {(position || manualMapActive) && nextExpandedRadius ? (
                <button type="button" onClick={() => void loadNearby(position ?? { latitude: WARSAW_MAP_CENTER.lat, longitude: WARSAW_MAP_CENTER.lng, accuracy: 0 }, nextExpandedRadius)}>
                  SZUKAJ W PROMIENIU {radiusLabel(nextExpandedRadius)}
                </button>
              ) : null}
              <button type="button" onClick={requestLocation}>ODŚWIEŻ LOKALIZACJĘ</button>
            </>
          ) : null}
          {searchStatus === "error" ? (
            <>
              <span>NIE UDAŁO SIĘ POBRAĆ KIBLI.</span>
              {(position || manualMapActive) ? (
                <button type="button" onClick={() => void loadNearby(position ?? { latitude: WARSAW_MAP_CENTER.lat, longitude: WARSAW_MAP_CENTER.lng, accuracy: 0 }, searchRadiusMeters)}>SPRÓBUJ JESZCZE RAZ</button>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}

      {hasActiveMap && searchStatus === "success" ? (
        <>
          <div className="map-toolbar" role="group" aria-label="Sterowanie wynikami">
            <span>{manualMapActive ? "TRYB RĘCZNY · " : ""}{filteredToilets.length} WYNIKÓW</span>
            {userMapLocation ? (
              <button
                className="map-toolbar__location"
                type="button"
                aria-label="Pokaż moją lokalizację na mapie"
                onClick={() => {
                  setResultView("map");
                  setLocationFocusRequest((current) => current + 1);
                }}
              >
                TU JESTEM
              </button>
            ) : null}
            <button type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>FILTRY</button>
            <button
              type="button"
              aria-pressed={resultView === "list"}
              onClick={() => {
                const nextView = resultView === "map" ? "list" : "map";
                setResultView(nextView);
                trackAnalyticsEvent({ name: "view_changed", view: nextView });
              }}
            >
              {resultView === "map" ? "LISTA" : "MAPA"}
            </button>
          </div>
          {mapSearchCenter && resultView === "map" ? <button className="search-area-action" type="button" onClick={() => { void loadNearby(mapSearchCenter, searchRadiusMeters); setMapSearchCenter(null); }}>ZNAJDŹ KIBEL W TEJ OKOLICY</button> : null}
          {filtersOpen ? <NearbyToiletFilters
            filters={filters}
            matchCount={filteredToilets.length}
            onToggle={toggleFilter}
            onClear={clearFilters}
          /> : null}
          {filteredToilets.length === 0 && hasActiveToiletFilters(filters) ? (
            <div className="filter-no-results" role="status">
              <strong>BRAK PASUJĄCYCH KIBLI.</strong>
              <button type="button" onClick={clearFilters}>POKAŻ WSZYSTKIE</button>
            </div>
          ) : null}
          {resultView === "list" && filteredToilets.length > 0 ? (
            <NearbyToiletList toilets={filteredToilets} selectedId={selectedId} onSelect={setSelectedId} />
          ) : null}
        </>
      ) : null}

      {hasActiveMap && searchStatus === "success" && recommendedToilet && !previewDismissed ? (
        <NearestToiletPreview
          toilet={recommendedToilet}
          onRefreshLocation={requestLocation}
          onOpenDetails={() => setSelectedId(recommendedToilet.id)}
          onDismiss={() => setPreviewDismissed(true)}
        />
      ) : null}

      {status !== "success" && !manualMapActive ? (
        <section className={`start-card start-card--${status}`} id="start" aria-labelledby="start-title">
          <div role="status" aria-live="polite" aria-atomic="true">
            <p className="start-card__kicker">{message.kicker}</p>
            <h1 id="start-title">
              {status === "idle" ? <>CHCE CI SIĘ<br /><span>SRAĆ?</span></> : message.headline}
            </h1>
            <p className="start-card__copy">{message.body}</p>
          </div>
          {status === "idle" ? (
            <ol className="start-card__steps" aria-label="Jak to działa">
              <li><b>1</b><span>DAJ LOKALIZACJĘ</span></li>
              <li><b>2</b><span>WYBIERZ NAJLEPSZY KIBEL</span></li>
              <li><b>3</b><span>KLIKNIJ „PROWADŹ MNIE”</span></li>
            </ol>
          ) : null}
          <button
            className="primary-action"
            type="button"
            aria-describedby="location-hint"
            aria-busy={status === "loading"}
            disabled={status === "loading"}
            onClick={requestLocation}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s7-5.2 7-12A7 7 0 1 0 5 9c0 6.8 7 12 7 12Z" />
              <circle cx="12" cy="9" r="2.4" />
            </svg>
            {message.action}
          </button>
          <button className="manual-map-action" type="button" onClick={openManualWarsawMap}>OTWÓRZ MAPĘ WARSZAWY</button>
          <p className="start-card__hint" id="location-hint">
            Lokalizację uruchomisz dopiero po kliknięciu.
          </p>
        </section>
      ) : null}
    </>
  );
}
