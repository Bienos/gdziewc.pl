import type { NearbyToilet } from "./nearby";

export const FILTER_KEYS = ["openNow", "free", "wheelchair", "babyChanging", "open24h"] as const;

export type ToiletFilterKey = typeof FILTER_KEYS[number];
export type ToiletFilters = Record<ToiletFilterKey, boolean>;

export const DEFAULT_TOILET_FILTERS: ToiletFilters = {
  openNow: false,
  free: false,
  wheelchair: false,
  babyChanging: false,
  open24h: false,
};

export function matchesToiletFilters(toilet: NearbyToilet, filters: ToiletFilters): boolean {
  return (!filters.openNow || toilet.openingStatus === "open")
    && (!filters.free || toilet.priceState === "free")
    && (!filters.wheelchair || toilet.wheelchairState === "accessible")
    && (!filters.babyChanging || toilet.babyChangingState === "available")
    && (!filters.open24h || toilet.open24h === true);
}

export function filterToilets(toilets: readonly NearbyToilet[], filters: ToiletFilters): NearbyToilet[] {
  return toilets.filter((toilet) => matchesToiletFilters(toilet, filters));
}

export function hasActiveToiletFilters(filters: ToiletFilters): boolean {
  return FILTER_KEYS.some((key) => filters[key]);
}
