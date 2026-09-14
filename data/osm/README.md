# Warsaw OpenStreetMap ingestion input

`warsaw-toilets.overpassql` is the versioned, bounded query used by the manual TASK-004 importer. It requests toilet nodes and ways inside Warsaw's administrative boundary and includes element metadata plus calculated way centres.

Run ingestion from a saved Overpass JSON response:

```bash
npm run db:ingest:osm-warsaw -- --file /absolute/path/to/response.json
```

Plain JSON and gzip-compressed JSON are accepted. The repository includes
`warsaw-toilets-2026-09-13.json.gz`, the exact snapshot used for TASK-004 verification:

- response `osm_base`: `2026-09-13T20:30:19Z`;
- 562 elements (448 nodes and 114 ways);
- SHA-256: `e94e55a2f01d7bd8234efc3cc99ef39432a3615875f241dd7c2fedcbf936030b`.

Reproduce the verified import with:

```bash
npm run db:ingest:osm-warsaw -- --file data/osm/warsaw-toilets-2026-09-13.json.gz
```

Or make an explicit one-off development fetch:

```bash
npm run db:ingest:osm-warsaw -- --live
```

Both commands require `DATABASE_URL`. The live mode uses `https://overpass-api.de/api/interpreter` by default; it is manual development tooling, not a scheduled production dependency. Override it only with `OVERPASS_URL`.

Source data is © OpenStreetMap contributors and available under ODbL 1.0. The importer stores the attribution, licence link, raw record, normalized record, response dataset time, and fetch time on every source row.
