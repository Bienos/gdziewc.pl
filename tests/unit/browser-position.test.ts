import { describe, expect, it } from "vitest";
import {
  distanceBetweenPositionsMeters,
  shouldAcceptWatchedPosition,
  shouldRefreshNearbyForPosition,
} from "../../lib/location/browser-position";

describe("browser position updates", () => {
  const first = { latitude: 52.2297, longitude: 21.0122, accuracy: 80 };

  it("uses a materially more accurate reading without claiming it is exact", () => {
    expect(shouldAcceptWatchedPosition(first, { ...first, accuracy: 18 })).toBe(true);
  });

  it("ignores ordinary GPS jitter inside the reported uncertainty", () => {
    expect(shouldAcceptWatchedPosition(first, { latitude: 52.2299, longitude: 21.0122, accuracy: 82 })).toBe(false);
  });

  it("refreshes nearby results only after a material real-world movement", () => {
    const nearby = { latitude: 52.2297, longitude: 21.0122, accuracy: 20 };
    const moved = { latitude: 52.2308, longitude: 21.0122, accuracy: 20 };
    expect(distanceBetweenPositionsMeters(nearby, moved)).toBeGreaterThan(60);
    expect(shouldRefreshNearbyForPosition(nearby, moved)).toBe(true);
    expect(shouldRefreshNearbyForPosition(nearby, { latitude: 52.2299, longitude: 21.0122, accuracy: 20 })).toBe(false);
  });
});
