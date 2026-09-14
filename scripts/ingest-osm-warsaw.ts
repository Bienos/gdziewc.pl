import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzip } from "node:zlib";
import { promisify } from "node:util";
import { Client } from "pg";
import { ingestOsmWarsawResponse } from "../lib/toilets/ingestion/osm";

const DEFAULT_OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const QUERY_FILE = resolve(process.cwd(), "data/osm/warsaw-toilets.overpassql");
const gunzipAsync = promisify(gunzip);

function parseMode(args: string[]): { mode: "file"; path: string } | { mode: "live" } {
  if (args.length === 1 && args[0] === "--live") return { mode: "live" };
  if (args.length === 2 && args[0] === "--file" && args[1]) {
    return { mode: "file", path: resolve(args[1]) };
  }
  throw new Error("Usage: npm run db:ingest:osm-warsaw -- --file /path/response.json | --live");
}

async function loadInput(mode: ReturnType<typeof parseMode>): Promise<unknown> {
  if (mode.mode === "file") {
    const file = await readFile(mode.path);
    const json = mode.path.endsWith(".gz")
      ? (await gunzipAsync(file)).toString("utf8")
      : file.toString("utf8");
    return JSON.parse(json) as unknown;
  }

  const query = await readFile(QUERY_FILE, "utf8");
  const response = await fetch(process.env.OVERPASS_URL ?? DEFAULT_OVERPASS_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "user-agent": "GdzieKibel.pl development ingestion (manual)",
    },
    body: new URLSearchParams({ data: query }),
  });
  if (!response.ok) {
    throw new Error(`Overpass request failed with HTTP ${response.status}`);
  }
  return response.json() as Promise<unknown>;
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");

  const input = await loadInput(parseMode(process.argv.slice(2)));
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const result = await ingestOsmWarsawResponse(client, input);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
