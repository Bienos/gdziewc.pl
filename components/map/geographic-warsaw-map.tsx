"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";
import type { NearbyToilet } from "@/lib/toilets/nearby";
import {
  resolveMapStyleUrl,
  WARSAW_MAP_BOUNDS,
  WARSAW_MAP_CENTER,
} from "@/lib/map/config";

interface Coordinate {
  lat: number;
  lng: number;
}

interface GeographicWarsawMapProps {
  active: boolean;
  visible: boolean;
  userLocation: Coordinate | null;
  toilets: NearbyToilet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMapMove: (center: Coordinate) => void;
}

function markerButton(toilet: NearbyToilet, index: number, selectedId: string | null, onSelect: (id: string) => void) {
  const wrapper = document.createElement("div");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "toilet-marker toilet-marker--geographic";
  button.dataset.testid = "toilet-marker";
  button.dataset.selected = String(selectedId === toilet.id);
  button.dataset.recommended = String(toilet.isRecommended);
  button.setAttribute("aria-pressed", String(selectedId === toilet.id));
  button.setAttribute("aria-label", `${index + 1}. ${toilet.name}, ${toilet.distanceMeters} metrów${toilet.isRecommended ? ", polecany" : ""}`);

  const label = document.createElement("span");
  label.textContent = "WC";
  button.append(label);

  if (toilet.isRecommended) {
    const recommendation = document.createElement("small");
    recommendation.className = "toilet-marker__recommendation";
    recommendation.setAttribute("aria-hidden", "true");
    recommendation.textContent = "TOP";
    button.append(recommendation);
  }

  button.addEventListener("click", () => onSelect(toilet.id));
  wrapper.append(button);
  return wrapper;
}

function userLocationElement() {
  const element = document.createElement("div");
  element.className = "user-location user-location--geographic";
  element.dataset.testid = "user-location";
  element.setAttribute("role", "img");
  element.setAttribute("aria-label", "Twoja przybliżona lokalizacja");

  const halo = document.createElement("span");
  halo.className = "user-location__halo";
  const dot = document.createElement("span");
  dot.className = "user-location__dot";
  element.append(halo, dot);
  return element;
}

export function GeographicWarsawMap({
  active,
  visible,
  userLocation,
  toilets,
  selectedId,
  onSelect,
  onMapMove,
}: GeographicWarsawMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const userMarkerRef = useRef<MapLibreMarker | null>(null);
  const userMovedRef = useRef(false);
  const hasFittedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const userLatitude = userLocation?.lat;
  const userLongitude = userLocation?.lng;

  useEffect(() => {
    if (!active || !containerRef.current || mapRef.current) return;
    let cancelled = false;

    void import("maplibre-gl").then(({ Map, NavigationControl, setWorkerUrl }) => {
      if (cancelled || !containerRef.current) return;
      setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

      const center = userLatitude === undefined || userLongitude === undefined
        ? WARSAW_MAP_CENTER
        : { lat: userLatitude, lng: userLongitude };
      const map = new Map({
        container: containerRef.current,
        style: resolveMapStyleUrl(process.env.NEXT_PUBLIC_MAP_STYLE_URL),
        center: [center.lng, center.lat],
        zoom: userLatitude === undefined ? 12 : 15,
        maxBounds: [
          [WARSAW_MAP_BOUNDS.west, WARSAW_MAP_BOUNDS.south],
          [WARSAW_MAP_BOUNDS.east, WARSAW_MAP_BOUNDS.north],
        ],
        attributionControl: {},
        cooperativeGestures: false,
      });
      mapRef.current = map;
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.on("dragstart", () => { userMovedRef.current = true; });
      map.on("zoomstart", () => { userMovedRef.current = true; });
      map.on("moveend", () => {
        if (!userMovedRef.current) return;
        userMovedRef.current = false;
        const nextCenter = map.getCenter();
        onMapMove({ lat: nextCenter.lat, lng: nextCenter.lng });
      });

      const canvas = map.getCanvas();
      canvas.setAttribute("aria-label", "Interaktywna mapa Warszawy. Użyj strzałek, aby przesuwać mapę, oraz przycisków powiększenia.");
      map.once("load", () => {
        if (cancelled) return;
        containerRef.current?.querySelector(".maplibregl-ctrl-zoom-in")?.setAttribute("aria-label", "Powiększ mapę");
        containerRef.current?.querySelector(".maplibregl-ctrl-zoom-out")?.setAttribute("aria-label", "Pomniejsz mapę");
        setLoaded(true);
      });
      map.once("error", () => {
        if (!map.loaded()) setFailed(true);
      });
    }).catch(() => setFailed(true));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      setLoaded(false);
    };
  }, [active, userLatitude, userLongitude]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !visible) {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    userMarkerRef.current?.remove();
    userMarkerRef.current = null;

    void import("maplibre-gl").then(({ LngLatBounds, Marker }) => {
      if (mapRef.current !== map) return;
      const bounds = new LngLatBounds();

      if (userLocation) {
        userMarkerRef.current = new Marker({ element: userLocationElement(), anchor: "center" })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map);
        bounds.extend([userLocation.lng, userLocation.lat]);
      }

      markersRef.current = toilets.map((toilet, index) => {
        bounds.extend([toilet.lng, toilet.lat]);
        return new Marker({ element: markerButton(toilet, index, selectedId, onSelect), anchor: "bottom" })
          .setLngLat([toilet.lng, toilet.lat])
          .addTo(map);
      });

      if (!bounds.isEmpty() && !hasFittedRef.current) {
        map.fitBounds(bounds, { padding: { top: 180, right: 70, bottom: 250, left: 70 }, maxZoom: 16, duration: 0 });
        hasFittedRef.current = true;
      }
      map.resize();
    });
  }, [loaded, onSelect, selectedId, toilets, userLocation, visible]);

  useEffect(() => {
    if (visible) mapRef.current?.resize();
  }, [visible]);

  if (!active) return null;

  return (
    <div
      className={`geographic-map${visible ? "" : " geographic-map--hidden"}`}
      data-testid="geographic-map"
      role="region"
      aria-label="Mapa toalet w Warszawie"
    >
      <div className="geographic-map__canvas" ref={containerRef} />
      {!loaded && !failed ? <p className="geographic-map__status" role="status">ŁADUJĘ MAPĘ ULIC…</p> : null}
      {failed ? <p className="geographic-map__status geographic-map__status--error" role="status">MAPA ULIC JEST CHWILOWO NIEDOSTĘPNA. UŻYJ LISTY.</p> : null}
    </div>
  );
}
