import { afterEach, describe, expect, it } from "vitest";
import { POST } from "../../app/api/toilets/nearby/route";
import {
  nearbyRequestSchema,
  nearbyResponseSchema,
} from "../../lib/toilets/nearby";

describe("nearby API contracts", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it("applies bounded defaults and rejects unknown fields", () => {
    expect(nearbyRequestSchema.parse({
      location: { lat: 52.2297, lng: 21.0122 },
    })).toEqual({
      location: { lat: 52.2297, lng: 21.0122 },
      radiusMeters: 2_000,
      limit: 50,
    });

    expect(() => nearbyRequestSchema.parse({
      location: { lat: 52.2297, lng: 21.0122, precision: "exact" },
    })).toThrow();
    expect(() => nearbyRequestSchema.parse({
      location: { lat: 91, lng: 21.0122 },
      radiusMeters: 20_000,
    })).toThrow();
  });

  it("does not permit not-public records in responses", () => {
    expect(() => nearbyResponseSchema.parse({
      results: [{
        id: "4c42ec75-e2f9-49b2-b31e-6e55162ab079",
        name: "Niepubliczna",
        address: null,
        lat: 52.2,
        lng: 21,
        distanceMeters: 20,
        accessState: "not_public",
        priceState: "unknown",
        priceAmountMinor: null,
        currency: null,
        open24h: null,
        openingHoursRaw: null,
        openingStatus: "unknown",
        wheelchairState: "unknown",
        babyChangingState: "unknown",
        unisexState: "unknown",
        confidenceLevel: "low",
        recommendationRank: 1,
        recommendationScore: 20,
        isRecommended: true,
      }],
    })).toThrow();
  });

  it("returns a safe 400 response for malformed input", async () => {
    const response = await POST(new Request("http://localhost/api/toilets/nearby", {
      method: "POST",
      body: JSON.stringify({ location: { lat: "secret", lng: 21 }, extra: true }),
      headers: { "content-type": "application/json" },
    }));
    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      error: { code: "INVALID_REQUEST", message: "Nieprawidłowe dane wyszukiwania." },
    });
  });

  it("fails safely when the database is not configured", async () => {
    delete process.env.DATABASE_URL;
    const response = await POST(new Request("http://localhost/api/toilets/nearby", {
      method: "POST",
      body: JSON.stringify({ location: { lat: 52.2297, lng: 21.0122 } }),
      headers: { "content-type": "application/json" },
    }));
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.text()).not.toContain("DATABASE_URL");
  });
});
