export const WARSAW_MAP_CENTER = { lat: 52.2297, lng: 21.0122 } as const;
export const WARSAW_MAP_BOUNDS = {
  west: 20.80,
  south: 52.08,
  east: 21.30,
  north: 52.37,
} as const;

export const DEFAULT_MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

const FORBIDDEN_PUBLIC_OSM_TILE_HOSTS = new Set([
  "tile.openstreetmap.org",
  "a.tile.openstreetmap.org",
  "b.tile.openstreetmap.org",
  "c.tile.openstreetmap.org",
]);

export function resolveMapStyleUrl(candidate?: string): string {
  const value = candidate?.trim() || DEFAULT_MAP_STYLE_URL;
  const url = new URL(value);

  if (url.protocol !== "https:") {
    throw new Error("Map style URL must use HTTPS");
  }

  if (FORBIDDEN_PUBLIC_OSM_TILE_HOSTS.has(url.hostname)) {
    throw new Error("Public OpenStreetMap tile servers are not an approved production provider");
  }

  return url.toString();
}
