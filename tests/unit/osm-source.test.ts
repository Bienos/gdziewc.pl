import { describe, expect, it } from "vitest";
import { osmElementSchema, osmToiletSourceAdapter } from "../../lib/toilets/sources/osm";

const context = {
  datasetUpdatedAt: "2026-09-13T20:30:19Z",
  fetchedAt: "2026-09-13T20:31:00Z",
};

describe("OpenStreetMap toilet source contract", () => {
  it("preserves missing values as unknown", () => {
    const record = osmToiletSourceAdapter.normalize({
      type: "node",
      id: 123,
      lat: 52.2297,
      lon: 21.0122,
      tags: { amenity: "toilets" },
    }, context);

    expect(record).toMatchObject({
      sourceRecordId: "osm/node/123",
      accessState: "unknown",
      priceState: "unknown",
      openingHoursRaw: null,
      open24h: null,
      wheelchairState: "unknown",
      babyChangingState: "unknown",
      unisexState: "unknown",
      name: null,
      address: null,
    });
  });

  it("normalizes explicit public usability tags", () => {
    const record = osmToiletSourceAdapter.normalize({
      type: "way",
      id: 456,
      center: { lat: 52.24, lon: 21.01 },
      timestamp: "2026-09-01T10:00:00Z",
      tags: {
        amenity: "toilets",
        access: "yes",
        fee: "no",
        opening_hours: "24/7",
        wheelchair: "yes",
        changing_table: "limited",
        unisex: "no",
        name: "Toaleta miejska",
        "addr:street": "Marszałkowska",
        "addr:housenumber": "1",
      },
    }, context);

    expect(record).toMatchObject({
      sourceRecordId: "osm/way/456",
      location: { precision: "geometry_centre" },
      accessState: "public",
      priceState: "free",
      open24h: true,
      wheelchairState: "accessible",
      babyChangingState: "limited",
      unisexState: "no",
      address: "Marszałkowska 1",
    });
  });

  it.each([
    ["customers", "restricted"],
    ["destination", "restricted"],
    ["private", "not_public"],
    ["no", "not_public"],
  ])("maps access=%s to %s", (access, expected) => {
    const record = osmToiletSourceAdapter.normalize({
      type: "node",
      id: 789,
      lat: 52.22,
      lon: 21.0,
      tags: { amenity: "toilets", access },
    }, context);
    expect(record.accessState).toBe(expected);
  });

  it("rejects invalid coordinates and non-toilet elements", () => {
    expect(() => osmElementSchema.parse({
      type: "node",
      id: 1,
      lat: 120,
      lon: 21,
      tags: { amenity: "cafe" },
    })).toThrow();
  });
});
