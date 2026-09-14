import { describe, expect, it } from "vitest";
import {
  DEFAULT_TOILET_FILTERS,
  filterToilets,
  matchesToiletFilters,
} from "../../lib/toilets/filters";
import type { NearbyToilet } from "../../lib/toilets/nearby";

const supported: NearbyToilet = {
  id: "4c42ec75-e2f9-49b2-b31e-6e55162ab079",
  name: "Toaleta miejska",
  address: null,
  lat: 52.23,
  lng: 21.01,
  distanceMeters: 100,
  accessState: "public",
  priceState: "free",
  priceAmountMinor: null,
  currency: null,
  open24h: true,
  openingHoursRaw: "24/7",
  openingStatus: "open",
  wheelchairState: "accessible",
  babyChangingState: "available",
  unisexState: "unknown",
  confidenceLevel: "high",
  recommendationRank: 1,
  recommendationScore: 20,
  isRecommended: true,
};

describe("nearby toilet filters", () => {
  it("matches only explicit positive source-supported values", () => {
    const allFilters = {
      openNow: true,
      free: true,
      wheelchair: true,
      babyChanging: true,
      open24h: true,
    };
    expect(matchesToiletFilters(supported, allFilters)).toBe(true);
    expect(matchesToiletFilters({ ...supported, openingStatus: "unknown" }, allFilters)).toBe(false);
    expect(matchesToiletFilters({ ...supported, wheelchairState: "limited" }, allFilters)).toBe(false);
    expect(matchesToiletFilters({ ...supported, babyChangingState: "unknown" }, allFilters)).toBe(false);
    expect(matchesToiletFilters({ ...supported, open24h: null }, allFilters)).toBe(false);
  });

  it("preserves the API result order and does not mutate its input", () => {
    const unknown = { ...supported, id: "2ccedcee-72da-4a77-a0bc-cd6dcb98d760", priceState: "unknown" as const };
    const toilets = [unknown, supported];
    expect(filterToilets(toilets, { ...DEFAULT_TOILET_FILTERS, free: true })).toEqual([supported]);
    expect(toilets).toEqual([unknown, supported]);
  });
});
