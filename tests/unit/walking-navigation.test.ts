import { describe, expect, it } from "vitest";
import { googleMapsWalkingUrl } from "../../lib/navigation/walking";

describe("Google Maps walking navigation", () => {
  it("builds a destination-only walking URL", () => {
    const url = googleMapsWalkingUrl({ lat: 52.2297, lng: 21.0122 });
    expect(url).not.toBeNull();
    const parsed = new URL(url!);
    expect(parsed.origin).toBe("https://www.google.com");
    expect(parsed.pathname).toBe("/maps/dir/");
    expect(parsed.searchParams.get("api")).toBe("1");
    expect(parsed.searchParams.get("destination")).toBe("52.2297,21.0122");
    expect(parsed.searchParams.get("travelmode")).toBe("walking");
    expect(parsed.searchParams.has("origin")).toBe(false);
  });

  it.each([
    { lat: 91, lng: 21 },
    { lat: -91, lng: 21 },
    { lat: 52, lng: 181 },
    { lat: 52, lng: Number.NaN },
  ])("rejects invalid canonical destination coordinates", (destination) => {
    expect(googleMapsWalkingUrl(destination)).toBeNull();
  });
});
