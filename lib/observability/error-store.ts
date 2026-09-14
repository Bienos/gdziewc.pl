import type { Client, Pool } from "pg";
import { getDatabasePool } from "../db/pool";
import { scrubErrorRecord } from "./errors";

type QueryClient = Pick<Client | Pool, "query">;

export async function storeSafeError(client: QueryClient, value: unknown): Promise<boolean> {
  const record = scrubErrorRecord(value);
  if (!record) return false;

  await client.query(
    `WITH pruned AS (
       DELETE FROM runtime_error_events WHERE created_at < now() - interval '30 days'
     )
     INSERT INTO runtime_error_events (code, surface) VALUES ($1, $2)`,
    [record.code, record.surface],
  );
  return true;
}

export async function storeSafeErrorBestEffort(value: unknown): Promise<void> {
  try {
    await storeSafeError(getDatabasePool(), value);
  } catch {
    // Observability must never break the product path it observes.
  }
}
