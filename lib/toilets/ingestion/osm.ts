import type { ClientBase } from "pg";
import { osmResponseSchema, osmToiletSourceAdapter } from "../sources/osm";

export interface OsmIngestionResult {
  runId: string;
  datasetUpdatedAt: string;
  fetchedAt: string;
  recordsFetched: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsRejected: number;
}

function canonicalName(name: string | null): string {
  return name ?? "Toaleta";
}

export async function ingestOsmWarsawResponse(
  client: ClientBase,
  input: unknown,
  fetchedAt = new Date().toISOString(),
): Promise<OsmIngestionResult> {
  const response = osmResponseSchema.parse(input);
  const datasetUpdatedAt = response.osm3s.timestamp_osm_base;
  const records = response.elements.map((element) =>
    osmToiletSourceAdapter.normalize(element, { datasetUpdatedAt, fetchedAt }),
  );

  await client.query("BEGIN");
  try {
    const run = await client.query<{ id: string }>(`
      INSERT INTO ingestion_runs (source_name, source_dataset_updated_at, records_fetched)
      VALUES ('openstreetmap', $1, $2)
      RETURNING id
    `, [datasetUpdatedAt, records.length]);
    const runId = run.rows[0]?.id;
    if (!runId) throw new Error("Failed to create the ingestion run");

    let recordsCreated = 0;
    let recordsUpdated = 0;

    for (const record of records) {
      const existing = await client.query<{ toilet_id: string | null }>(`
        SELECT toilet_id
        FROM toilet_source_records
        WHERE source_name = $1 AND source_record_id = $2
        FOR UPDATE
      `, [record.sourceName, record.sourceRecordId]);

      let toiletId = existing.rows[0]?.toilet_id ?? null;
      if (toiletId) {
        await client.query(`
          UPDATE toilets
          SET name = $2,
              address = $3,
              geom = ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography,
              access_state = $6,
              price_state = $7,
              price_amount_minor = $8,
              currency = $9,
              open_24h = $10,
              opening_hours_raw = $11,
              wheelchair_state = $12,
              baby_changing_state = $13,
              unisex_state = $14,
              updated_at = now()
          WHERE id = $1
        `, [
          toiletId,
          canonicalName(record.name),
          record.address,
          record.location.lng,
          record.location.lat,
          record.accessState,
          record.priceState,
          record.priceAmountMinor,
          record.currency,
          record.open24h,
          record.openingHoursRaw,
          record.wheelchairState,
          record.babyChangingState,
          record.unisexState,
        ]);
        recordsUpdated += 1;
      } else {
        const toilet = await client.query<{ id: string }>(`
          INSERT INTO toilets (
            name, address, geom, access_state, price_state, price_amount_minor, currency, open_24h,
            opening_hours_raw, wheelchair_state, baby_changing_state, unisex_state
          )
          VALUES (
            $1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, $6, $7, $8,
            $9, $10, $11, $12, $13
          )
          RETURNING id
        `, [
          canonicalName(record.name),
          record.address,
          record.location.lng,
          record.location.lat,
          record.accessState,
          record.priceState,
          record.priceAmountMinor,
          record.currency,
          record.open24h,
          record.openingHoursRaw,
          record.wheelchairState,
          record.babyChangingState,
          record.unisexState,
        ]);
        toiletId = toilet.rows[0]?.id ?? null;
        if (!toiletId) throw new Error(`Failed to create toilet for ${record.sourceRecordId}`);
        recordsCreated += 1;
      }

      await client.query(`
        INSERT INTO toilet_source_records (
          source_name, source_record_id, toilet_id, source_url, source_element_type,
          raw_payload, normalized_payload, licence_id, licence_url, attribution_text,
          source_updated_at, source_dataset_updated_at, fetched_at, source_confidence,
          ingestion_run_id
        )
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10, $11, $12, $13, 'low', $14)
        ON CONFLICT (source_name, source_record_id) DO UPDATE
        SET toilet_id = EXCLUDED.toilet_id,
            source_url = EXCLUDED.source_url,
            source_element_type = EXCLUDED.source_element_type,
            raw_payload = EXCLUDED.raw_payload,
            normalized_payload = EXCLUDED.normalized_payload,
            licence_id = EXCLUDED.licence_id,
            licence_url = EXCLUDED.licence_url,
            attribution_text = EXCLUDED.attribution_text,
            source_updated_at = EXCLUDED.source_updated_at,
            source_dataset_updated_at = EXCLUDED.source_dataset_updated_at,
            fetched_at = EXCLUDED.fetched_at,
            ingestion_run_id = EXCLUDED.ingestion_run_id,
            updated_at = now()
      `, [
        record.sourceName,
        record.sourceRecordId,
        toiletId,
        record.sourceUrl,
        record.sourceElementType,
        JSON.stringify(record.rawPayload),
        JSON.stringify(record),
        record.licence.id,
        record.licence.url,
        record.licence.attribution,
        record.sourceUpdatedAt,
        record.sourceDatasetUpdatedAt,
        record.fetchedAt,
        runId,
      ]);
    }

    await client.query(`
      UPDATE ingestion_runs
      SET completed_at = now(), status = 'succeeded',
          records_created = $2, records_updated = $3, records_rejected = 0
      WHERE id = $1
    `, [runId, recordsCreated, recordsUpdated]);
    await client.query("COMMIT");

    return {
      runId,
      datasetUpdatedAt,
      fetchedAt,
      recordsFetched: records.length,
      recordsCreated,
      recordsUpdated,
      recordsRejected: 0,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}
