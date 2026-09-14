import { Client } from "pg";
import { getDatabaseUrl } from "@/lib/env/server";

async function main() {
  const client = new Client({ connectionString: getDatabaseUrl() });
  await client.connect();
  try {
    const result = await client.query<{ installed_version: string }>(
      "SELECT installed_version FROM pg_available_extensions WHERE name = 'postgis' AND installed_version IS NOT NULL",
    );
    if (result.rowCount !== 1 || !result.rows[0]) {
      throw new Error("PostGIS is not installed in the configured database.");
    }
    console.log(`PostGIS ${result.rows[0].installed_version} is available.`);
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "PostGIS check failed.");
  process.exitCode = 1;
});
