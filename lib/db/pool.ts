import { Pool } from "pg";
import { getDatabaseUrl } from "../env/server";

const globalForDatabase = globalThis as typeof globalThis & {
  gdzieKibelPool?: Pool;
};

export function getDatabasePool(): Pool {
  if (!globalForDatabase.gdzieKibelPool) {
    globalForDatabase.gdzieKibelPool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return globalForDatabase.gdzieKibelPool;
}
