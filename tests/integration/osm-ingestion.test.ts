import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ingestOsmWarsawResponse } from "../../lib/toilets/ingestion/osm";

const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;
const datasetUpdatedAt = "2040-01-02T03:04:05Z";
const sourceRecordIds = ["osm/node/900000001", "osm/way/900000002"];

function response(name = "Testowa toaleta") {
  return {
    osm3s: { timestamp_osm_base: datasetUpdatedAt },
    elements: [
      {
        type: "node",
        id: 900000001,
        lat: 52.2297,
        lon: 21.0122,
        timestamp: "2039-12-30T10:00:00Z",
        version: 2,
        tags: {
          amenity: "toilets",
          name,
          access: "yes",
          fee: "no",
          wheelchair: "yes",
        },
      },
      {
        type: "way",
        id: 900000002,
        center: { lat: 52.23, lon: 21.02 },
        tags: { amenity: "toilets", access: "private" },
      },
    ],
  };
}

describeWithDatabase("Warsaw OSM ingestion", () => {
  const client = new Client({ connectionString: databaseUrl });

  beforeAll(async () => {
    await client.connect();
    await client.query(`
      DELETE FROM toilet_source_records
      WHERE source_name = 'openstreetmap' AND source_record_id = ANY($1::text[])
    `, [sourceRecordIds]);
    await client.query(`
      DELETE FROM ingestion_runs
      WHERE source_name = 'openstreetmap' AND source_dataset_updated_at = $1
    `, [datasetUpdatedAt]);
  });

  afterAll(async () => {
    const linked = await client.query<{ toilet_id: string }>(`
      SELECT toilet_id
      FROM toilet_source_records
      WHERE source_name = 'openstreetmap' AND source_record_id = ANY($1::text[])
        AND toilet_id IS NOT NULL
    `, [sourceRecordIds]);
    await client.query(`
      DELETE FROM toilet_source_records
      WHERE source_name = 'openstreetmap' AND source_record_id = ANY($1::text[])
    `, [sourceRecordIds]);
    if (linked.rows.length > 0) {
      await client.query("DELETE FROM toilets WHERE id = ANY($1::uuid[])", [
        linked.rows.map((row) => row.toilet_id),
      ]);
    }
    await client.query(`
      DELETE FROM ingestion_runs
      WHERE source_name = 'openstreetmap' AND source_dataset_updated_at = $1
    `, [datasetUpdatedAt]);
    await client.end();
  });

  it("creates canonical toilets, lineage and a successful run", async () => {
    const result = await ingestOsmWarsawResponse(client, response(), "2040-01-02T04:00:00Z");
    expect(result).toMatchObject({
      recordsFetched: 2,
      recordsCreated: 2,
      recordsUpdated: 0,
      recordsRejected: 0,
    });

    const rows = await client.query<{
      source_record_id: string;
      toilet_id: string;
      access_state: string;
      licence_id: string;
      attribution_text: string;
    }>(`
      SELECT s.source_record_id, s.toilet_id, t.access_state, s.licence_id, s.attribution_text
      FROM toilet_source_records s
      JOIN toilets t ON t.id = s.toilet_id
      WHERE s.source_name = 'openstreetmap' AND s.source_record_id = ANY($1::text[])
      ORDER BY s.source_record_id
    `, [sourceRecordIds]);
    expect(rows.rows).toHaveLength(2);
    expect(rows.rows[0]).toMatchObject({
      access_state: "public",
      licence_id: "ODbL-1.0",
      attribution_text: "© OpenStreetMap contributors",
    });
    expect(rows.rows[1]?.access_state).toBe("not_public");
  });

  it("updates in place on an unchanged-source rerun", async () => {
    const before = await client.query<{ toilet_id: string }>(`
      SELECT toilet_id FROM toilet_source_records
      WHERE source_name = 'openstreetmap' AND source_record_id = $1
    `, [sourceRecordIds[0]]);

    const result = await ingestOsmWarsawResponse(
      client,
      response("Zaktualizowana toaleta"),
      "2040-01-02T05:00:00Z",
    );
    expect(result).toMatchObject({ recordsCreated: 0, recordsUpdated: 2 });

    const after = await client.query<{ toilet_id: string; name: string }>(`
      SELECT s.toilet_id, t.name
      FROM toilet_source_records s JOIN toilets t ON t.id = s.toilet_id
      WHERE s.source_name = 'openstreetmap' AND s.source_record_id = $1
    `, [sourceRecordIds[0]]);
    expect(after.rows[0]?.toilet_id).toBe(before.rows[0]?.toilet_id);
    expect(after.rows[0]?.name).toBe("Zaktualizowana toaleta");

    const counts = await client.query<{ sources: number; toilets: number }>(`
      SELECT COUNT(*)::int AS sources, COUNT(DISTINCT toilet_id)::int AS toilets
      FROM toilet_source_records
      WHERE source_name = 'openstreetmap' AND source_record_id = ANY($1::text[])
    `, [sourceRecordIds]);
    expect(counts.rows[0]).toEqual({ sources: 2, toilets: 2 });
  });

  it("rejects the full response before creating a run or rows", async () => {
    const runsBefore = await client.query<{ count: number }>(`
      SELECT COUNT(*)::int AS count FROM ingestion_runs
      WHERE source_name = 'openstreetmap' AND source_dataset_updated_at = $1
    `, ["2041-01-01T00:00:00Z"]);

    await expect(ingestOsmWarsawResponse(client, {
      osm3s: { timestamp_osm_base: "2041-01-01T00:00:00Z" },
      elements: [{ type: "node", id: 900000003, lat: 52.2, lon: 21, tags: { amenity: "cafe" } }],
    })).rejects.toThrow();

    const runsAfter = await client.query<{ count: number }>(`
      SELECT COUNT(*)::int AS count FROM ingestion_runs
      WHERE source_name = 'openstreetmap' AND source_dataset_updated_at = $1
    `, ["2041-01-01T00:00:00Z"]);
    expect(runsAfter.rows[0]?.count).toBe(runsBefore.rows[0]?.count);
  });
});
