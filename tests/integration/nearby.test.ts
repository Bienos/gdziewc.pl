import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  findNearbyToilets,
  NEARBY_TOILETS_SQL,
} from "../../lib/toilets/nearby";

const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;
const testNames = [
  "Nearby test closest",
  "Nearby test farther",
  "Nearby test private",
  "Nearby test removed",
];

describeWithDatabase("nearby toilet PostGIS query", () => {
  const client = new Client({ connectionString: databaseUrl });

  beforeAll(async () => {
    await client.connect();
    await client.query("DELETE FROM toilets WHERE name = ANY($1::text[])", [testNames]);
    await client.query(`
      INSERT INTO toilets (name, geom, access_state, canonical_status, price_state)
      VALUES
        ($1, ST_SetSRID(ST_MakePoint(10.0001, 10), 4326)::geography, 'public', 'active', 'free'),
        ($2, ST_SetSRID(ST_MakePoint(10.0010, 10), 4326)::geography, 'unknown', 'active', 'unknown'),
        ($3, ST_SetSRID(ST_MakePoint(10.00005, 10), 4326)::geography, 'not_public', 'active', 'paid'),
        ($4, ST_SetSRID(ST_MakePoint(10.00002, 10), 4326)::geography, 'public', 'removed', 'free')
    `, testNames);
    await client.query(
      "UPDATE toilets SET opening_hours_raw = '24/7' WHERE name = $1",
      [testNames[0]],
    );
  });

  afterAll(async () => {
    await client.query("DELETE FROM toilets WHERE name = ANY($1::text[])", [testNames]);
    await client.end();
  });

  it("returns active usable candidates nearest-first within the radius", async () => {
    const results = await findNearbyToilets(client, {
      location: { lat: 10, lng: 10 },
      radiusMeters: 500,
      limit: 10,
    });
    const testResults = results.filter((result) => testNames.includes(result.name));
    expect(testResults.map((result) => result.name)).toEqual([
      "Nearby test closest",
      "Nearby test farther",
    ]);
    expect(testResults[0]).toMatchObject({
      accessState: "public",
      priceState: "free",
      openingStatus: "open",
      recommendationRank: 1,
      isRecommended: true,
    });
    expect(testResults[0]!.distanceMeters).toBeLessThan(testResults[1]!.distanceMeters);
    expect(testResults.every((result) => result.distanceMeters <= 500)).toBe(true);
  });

  it("uses a spatial-index-eligible ST_DWithin plan", async () => {
    await client.query("BEGIN");
    try {
      await client.query("SET LOCAL enable_seqscan = off");
      const explained = await client.query(
        `EXPLAIN (FORMAT JSON) ${NEARBY_TOILETS_SQL}`,
        [10, 10, 500, 10],
      );
      const plan = JSON.stringify(explained.rows);
      expect(plan).toContain("toilets_geom_gist_idx");
    } finally {
      await client.query("ROLLBACK");
    }
  });
});
