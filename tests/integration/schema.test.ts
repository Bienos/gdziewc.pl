import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase("PostGIS schema", () => {
  const client = new Client({ connectionString: databaseUrl });

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it("has PostGIS and the canonical/report/observability tables", async () => {
    const extension = await client.query(
      "SELECT extversion FROM pg_extension WHERE extname = 'postgis'",
    );
    expect(extension.rowCount).toBe(1);

    const tables = await client.query<{ table_name: string }>(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('toilets', 'toilet_source_records', 'ingestion_runs', 'toilet_reports', 'analytics_events', 'runtime_error_events')
      ORDER BY table_name
    `);
    expect(tables.rows.map((row) => row.table_name)).toEqual([
      "analytics_events",
      "ingestion_runs",
      "runtime_error_events",
      "toilet_reports",
      "toilet_source_records",
      "toilets",
    ]);
  });

  it("stores only allowlisted runtime error fields", async () => {
    const inserted = await client.query<{ code: string; surface: string }>(
      "INSERT INTO runtime_error_events (code, surface) VALUES ('nearby_failed', 'location') RETURNING code, surface",
    );
    expect(inserted.rows[0]).toEqual({ code: "nearby_failed", surface: "location" });
    const columns = await client.query<{ column_name: string }>(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'runtime_error_events'
      ORDER BY ordinal_position
    `);
    expect(columns.rows.map((row) => row.column_name)).toEqual(["id", "code", "surface", "created_at"]);
    await client.query("DELETE FROM runtime_error_events WHERE id = (SELECT id FROM runtime_error_events ORDER BY created_at DESC LIMIT 1)");
  });

  it("stores a pending report without changing toilet facts", async () => {
    await client.query("BEGIN");
    try {
      const toilet = await client.query<{ id: string }>(`
        INSERT INTO toilets (name, geom, canonical_status)
        VALUES ('Report integration test', ST_SetSRID(ST_MakePoint(21.0122, 52.2297), 4326)::geography, 'active')
        RETURNING id
      `);
      const toiletId = toilet.rows[0]?.id;
      const report = await client.query<{ status: string }>(
        "INSERT INTO toilet_reports (toilet_id, issue_type, note) VALUES ($1, 'hours', 'Zmiana godzin') RETURNING status",
        [toiletId],
      );
      expect(report.rows[0]?.status).toBe("pending");
      const facts = await client.query("SELECT canonical_status FROM toilets WHERE id = $1", [toiletId]);
      expect(facts.rows[0]?.canonical_status).toBe("active");
    } finally {
      await client.query("ROLLBACK");
    }
  });

  it("stores a geography point and exposes the GiST index", async () => {
    const inserted = await client.query<{ id: string; lng: number; lat: number }>(`
      INSERT INTO toilets (name, geom)
      VALUES ('Schema integration test', ST_SetSRID(ST_MakePoint(21.0122, 52.2297), 4326)::geography)
      RETURNING id, ST_X(geom::geometry) AS lng, ST_Y(geom::geometry) AS lat
    `);

    expect(inserted.rows[0]).toMatchObject({ lng: 21.0122, lat: 52.2297 });

    const index = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public' AND indexname = 'toilets_geom_gist_idx'
    `);
    expect(index.rowCount).toBe(1);

    await client.query("DELETE FROM toilets WHERE id = $1", [inserted.rows[0]?.id]);
  });
});
